import { Request, Response, NextFunction } from 'express';
import userModel, { IUser } from '../models/user.model';
import ErrorHandler from '../utils/ErrorHandler';
import { CatchAsyncError } from '../middleware/catchAsyncErrors';
import jwt, { Secret } from 'jsonwebtoken';
import ejs from 'ejs';
import path from 'path';
import sendMail from '../utils/sendMail';

//register user
interface IRegistrationBody {
	name: string;
	email: string;
	password: string;
	avatar?: string;
}

export const registerUser = CatchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { name, email, password } = req.body;

			const isEmailExist = await userModel.findOne({ email });

			if (isEmailExist) {
				return next(new ErrorHandler('Email already exists', 400));
			}

			const user: IRegistrationBody = {
				name,
				email,
				password,
			};

			const activationToken = createActivationToken(user);

			const activationCode = activationToken.activationCode;

			const data = {
				user: {
					name: user.name,
				},
				activationCode,
			};
			const html = await ejs.renderFile(
				path.join(__dirname, '../mails/activation-mail.ejs'),
				data
			);

			try {
				await sendMail({
					email: user.email,
					subject: 'Account Activation',
					template: 'activation-mail.ejs',
					data,
				});

				res.status(201).json({
					success: true,
					message: `An email has been sent to ${user.email}. Please check your email to activate your account`,
					activationToken: activationToken.token,
				});
			} catch (err: any) {
				return new ErrorHandler(err.message, 400);
			}
		} catch (err: any) {
			return next(new ErrorHandler(err.message, 400));
		}
	}
);

interface IActivationToken {
	token: string;
	activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
	const activationCode = Math.floor(100000 + Math.random() * 900000);

	const token = jwt.sign(
		{ user, activationCode },
		process.env.ACTIVATION_SECRET as Secret,
		{
			expiresIn: '5m',
		}
	);

	return { token, activationCode: activationCode.toString() };
};

//activate user
interface IActivationRequest {
	activation_token: string;
	activation_code: string;
}

export const activateUser = CatchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { activation_token, activation_code } =
				req.body as IActivationRequest;

			const newUser: { user: IUser; activationCode: string } = jwt.verify(
				activation_token,
				process.env.ACTIVATION_SECRET as string
			) as { user: IUser; activationCode: string };

			//check if the activation code is correct
			if (newUser.activationCode.toString() !== activation_code) {
				return next(new ErrorHandler('Incorrect activation code', 400));
			}

			const { name, email, password } = newUser.user;

			//check if the user already exists
			const existUser = await userModel.findOne({ email });

			if (existUser) {
				return next(new ErrorHandler('User already exists', 400));
			}

			const user = await userModel.create({
				name,
				email,
				password,
			});

			res.status(201).json({
				success: true,
				message: 'Account activated successfully',
			});
		} catch (err: any) {
			return next(new ErrorHandler(err.message, 400));
		}
	}
);
