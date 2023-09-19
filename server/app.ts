require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
export const app = express();

import cors from 'cors';
import cookieParser from 'cookie-parser';

import { ErrorMiddleware } from './middleware/error';
import userRouter from './routes/user.route';
import courseRouter from './routes/course.route';
import orderRouter from './routes/order.route';

//body parser
app.use(express.json({ limit: '50mb' }));

//cookie parser
app.use(cookieParser());

//cors
app.use(
	cors({
		origin: process.env.ORIGIN,
	})
);

//routes
app.use('/api/v1', userRouter);
app.use('/api/v1', courseRouter);
app.use('/api/v1', orderRouter);

//test api
app.get('/test', (req: Request, res: Response, next: NextFunction) => {
	res.status(200).json({
		success: true,
		message: 'API is working',
	});
});

//unknown route handler
app.all('*', (req: Request, res: Response, next: NextFunction) => {
	const err = new Error(
		`Can't find ${req.originalUrl} on this server`
	) as any;
	err.statusCode = 404;
	next(err);
});

app.use(ErrorMiddleware);
