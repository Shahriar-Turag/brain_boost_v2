import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/ErrorHandler';
import { CatchAsyncError } from '../middleware/catchAsyncErrors';
import { generateLast12MonthsData } from '../utils/analytics.generator';
import userModel from '../models/user.model';
import CourseModel from '../models/course.model';
import OrderModel from '../models/order.model';

//get users analytics => /api/v1/admin/analytics/users --only admin can access this route
export const getUsersAnalytics = CatchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const users = await generateLast12MonthsData(userModel);

			res.status(200).json({
				success: true,
				users,
			});
		} catch (err: any) {
			return next(new ErrorHandler(err.message, 500));
		}
	}
);

//get course analytics => /api/v1/admin/analytics/courses --only admin can access this route

export const getCoursesAnalytics = CatchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const courses = await generateLast12MonthsData(CourseModel);

			res.status(200).json({
				success: true,
				courses,
			});
		} catch (err: any) {
			return next(new ErrorHandler(err.message, 500));
		}
	}
);

//get orders analytics => /api/v1/admin/analytics/orders --only admin can access this route

export const getOrdersAnalytics = CatchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const orders = await generateLast12MonthsData(OrderModel);

			res.status(200).json({
				success: true,
				orders,
			});
		} catch (err: any) {
			return next(new ErrorHandler(err.message, 500));
		}
	}
);
