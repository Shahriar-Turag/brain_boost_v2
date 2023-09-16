import { Request, Response, NextFunction } from 'express';
import userModel, { IUser } from '../models/user.model';
import ErrorHandler from '../utils/ErrorHandler';
import { CatchAsyncError } from '../middleware/catchAsyncErrors';
import jwt, { Secret } from 'jsonwebtoken';
import ejs from 'ejs';
import path from 'path';

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
				path.join(__dirname, '../mails/activation.mail.ejs'),
				data
			);

			try {
			} catch (err) {}
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
