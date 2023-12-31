import { NextFunction, Request, Response } from 'express';
import { CatchAsyncError } from '../middleware/catchAsyncErrors';
import ErrorHandler from '../utils/ErrorHandler';
import cloudinary from 'cloudinary';
import { createCourse, getAllCoursesService } from '../services/course.service';
import CourseModel from '../models/course.model';
import { redis } from '../utils/redis';
import mongoose from 'mongoose';
import ejs from 'ejs';
import path from 'path';
import sendMail from '../utils/sendMail';
import NotificationModel from '../models/notification.model';

//upload course
export const uploadCourse = CatchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const data = req.body;
			const thumbnail = data.thumbnail;
			if (thumbnail) {
				const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
					folder: 'courses',
				});
				data.thumbnail = {
					public_id: myCloud.public_id,
					url: myCloud.secure_url,
				};
			}
			createCourse(data, res, next);
		} catch (err: any) {
			return next(new ErrorHandler(err.message, 500));
		}
	}
);

//edit course
export const editCourse = CatchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const data = req.body;
			const thumbnail = data.thumbnail;
			if (thumbnail) {
				await cloudinary.v2.uploader.destroy(data.thumbnail.public_id);
				const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
					folder: 'courses',
				});
				data.thumbnail = {
					public_id: myCloud.public_id,
					url: myCloud.secure_url,
				};
			}
			const courseId = req.params.id;

			const course = await CourseModel.findByIdAndUpdate(
				courseId,
				{
					$set: data,
				},
				{
					new: true,
				}
			);

			res.status(200).json({
				success: true,
				course,
			});
		} catch (err: any) {
			return next(new ErrorHandler(err.message, 500));
		}
	}
);

//get single course --without purchasing
export const getSingleCourse = CatchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const courseId = req.params.id;

			//check if the course is in the cache and to prevent extra pressure on the database
			const isCacheExist = await redis.get(courseId);
			if (isCacheExist) {
				const course = JSON.parse(isCacheExist);
				return res.status(200).json({
					success: true,
					course,
				});
			} else {
				//ignore the fields that will not show in the course description page
				const course = await CourseModel.findById(req.params.id).select(
					'-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links'
				);

				await redis.set(courseId, JSON.stringify(course), 'EX', 604800); //7days expiry

				res.status(200).json({
					success: true,
					course,
				});
			}
		} catch (err: any) {
			return next(new ErrorHandler(err.message, 500));
		}
	}
);

//get all courses --without purchasing
export const getAllCourses = CatchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const isCacheExist = await redis.get('allCourses');

			if (isCacheExist) {
				const courses = JSON.parse(isCacheExist);

				return res.status(200).json({
					success: true,
					courses,
				});
			} else {
				const courses = await CourseModel.find().select(
					'-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links'
				);

				await redis.set('allCourses', JSON.stringify(courses));

				res.status(200).json({
					success: true,
					courses,
				});
			}
		} catch (err: any) {
			return next(new ErrorHandler(err.message, 500));
		}
	}
);

//get course content --only for valid user
export const getCourseByUser = CatchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userCourseList = req.user?.courses;
			const courseId = req.params.id;

			const courseExist = userCourseList?.find(
				(course: any) => course._id.toString() === courseId
			);

			if (!courseExist) {
				return next(
					new ErrorHandler(
						'You are not eligible to access this course',
						404
					)
				);
			}

			const course = await CourseModel.findById(courseId);

			const content = course?.courseData;

			res.status(200).json({
				success: true,
				content,
			});
		} catch (err: any) {
			return next(new ErrorHandler(err.message, 500));
		}
	}
);

//add questions in courses
interface IQuestion {
	question: string;
	courseId: string;
	contentId: string;
}

export const addQuestion = CatchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { question, courseId, contentId } = req.body as IQuestion;
			const course = await CourseModel.findById(courseId);

			if (!mongoose.Types.ObjectId.isValid(contentId)) {
				return next(new ErrorHandler('Invalid content id', 400));
			}

			const courseContent = course?.courseData?.find((item: any) =>
				item._id.equals(contentId)
			);

			if (!courseContent) {
				return next(new ErrorHandler('Invalid content id', 400));
			}

			//create a new question object
			const newQuestion: any = {
				user: req.user,
				question,
				questionReplies: [],
			};

			//add question in the course content
			courseContent.questions.push(newQuestion);

			await NotificationModel.create({
				user: req.user?._id,
				title: 'New Question Received',
				message: `${req.user?.name} has asked a question on your course ${courseContent?.title} of ${course?.name}`,
			});

			//save the updated course
			await course?.save();

			res.status(200).json({
				success: true,
				course,
			});
		} catch (err: any) {
			return next(new ErrorHandler(err.message, 500));
		}
	}
);

//add answers of questions in courses

interface IAddAnswer {
	answer: string;
	questionId: string;
	courseId: string;
	contentId: string;
}

export const addAnswer = CatchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { answer, questionId, courseId, contentId } =
				req.body as IAddAnswer;

			const course = await CourseModel.findById(courseId);

			if (!mongoose.Types.ObjectId.isValid(contentId)) {
				return next(new ErrorHandler('Invalid content id', 400));
			}

			const courseContent = course?.courseData?.find((item: any) =>
				item._id.equals(contentId)
			);

			if (!courseContent) {
				return next(new ErrorHandler('Invalid content id', 400));
			}

			const question = courseContent.questions.find((item: any) =>
				item._id.equals(questionId)
			);

			if (!question) {
				return next(new ErrorHandler('Invalid question id', 400));
			}

			//create a new answer object
			const newAnswer: any = {
				user: req.user,
				answer,
			};

			//add answer in the question
			question.questionReplies?.push(newAnswer);

			//save the course
			await course?.save();

			if (req.user?._id === question.user._id) {
				//create a notification
				await NotificationModel.create({
					user: req.user?._id,
					title: 'New Question Reply Received',
					message: `${req.user?.name} has replied to your question on ${courseContent?.title} of ${course?.name}`,
				});
			} else {
				const data = {
					name: question.user.name,
					title: courseContent.title,
				};
				const html = await ejs.renderFile(
					path.join(__dirname, '../mails/question-reply.ejs'),
					data
				);
				try {
					await sendMail({
						email: question.user.email,
						subject: 'Question Reply',
						template: 'question-reply.ejs',
						data,
					});
				} catch (err: any) {
					return next(new ErrorHandler(err.message, 500));
				}
			}

			res.status(200).json({
				success: true,
				course,
			});
		} catch (err: any) {
			return next(new ErrorHandler(err.message, 500));
		}
	}
);

//add review in courses
interface IReview {
	review: string;
	courseId: string;
	rating: number;
	userId: string;
}

export const addReview = CatchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userCourseList = req.user?.courses;

			const courseId = req.params.id;

			//check if the courseId exist in the userCourseList
			const courseExist = userCourseList?.some(
				(course: any) => course._id.toString() === courseId.toString()
			);

			if (!courseExist) {
				return next(
					new ErrorHandler(
						'You are not eligible to access this course',
						404
					)
				);
			}

			const course = await CourseModel.findById(courseId);

			const { review, rating } = req.body as IReview;

			const reviewData: any = {
				user: req.user,
				comment: review,
				rating,
			};

			course?.reviews.push(reviewData);

			let avg = 0;

			course?.reviews.forEach((item: any) => {
				avg += item.rating;
			});

			if (course) {
				course.ratings = avg / course.reviews.length; //calculate the average rating
			}

			await course?.save();

			const notification = {
				title: 'New Review received',
				message: `${req.user?.name} has given a review on your course ${course?.name}`,
			};

			//create notification

			res.status(200).json({
				success: true,
				course,
			});
		} catch (err: any) {
			return next(new ErrorHandler(err.message, 500));
		}
	}
);

//add reply to reviews in courses
interface IReply {
	comment: string;
	courseId: string;
	reviewId: string;
}

export const addReply = CatchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { comment, courseId, reviewId } = req.body as IReply;

			const course = await CourseModel.findById(courseId);

			if (!course) {
				return next(new ErrorHandler('Course not found', 404));
			}

			const review = course?.reviews?.find(
				(item: any) => item._id.toString() === reviewId
			);

			if (!review) {
				return next(new ErrorHandler('Review not found', 404));
			}

			const replyData: any = {
				user: req.user,
				comment,
			};

			if (!review.commentReplies) {
				review.commentReplies = [];
			}

			review.commentReplies?.push(replyData);

			await course.save();

			res.status(200).json({
				success: true,
				course,
			});
		} catch (err: any) {
			return next(new ErrorHandler(err.message, 500));
		}
	}
);

//get all courses --only for admin

export const getAllCourse = CatchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await getAllCoursesService(res);
		} catch (err: any) {
			return next(new ErrorHandler(err.message, 500));
		}
	}
);

//delete course --only for admin

export const deleteCourse = CatchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params;

			const course = await CourseModel.findById(id);

			if (!course) {
				return next(new ErrorHandler('Course not found', 404));
			}

			await course.deleteOne({ id });

			await redis.del(id);

			res.status(200).json({
				success: true,
				message: 'Course deleted successfully',
			});
		} catch (err: any) {
			return next(new ErrorHandler(err.message, 500));
		}
	}
);
