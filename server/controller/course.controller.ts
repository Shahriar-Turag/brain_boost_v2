import { NextFunction, Request, Response } from 'express';
import { CatchAsyncError } from '../middleware/catchAsyncErrors';
import ErrorHandler from '../utils/ErrorHandler';
import cloudinary from 'cloudinary';
import { createCourse } from '../services/course.service';
import CourseModel from '../models/course.model';
import { redis } from '../utils/redis';

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

				await redis.set(courseId, JSON.stringify(course));

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
				console.log('hitting redis');
				return res.status(200).json({
					success: true,
					courses,
				});
			} else {
				const courses = await CourseModel.find().select(
					'-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links'
				);
				console.log('hitting database');

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
