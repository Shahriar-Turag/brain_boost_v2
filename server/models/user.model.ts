import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const emailRegexPattern: RegExp = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	avatar: {
		public_id: string;
		url: string;
	};
	role: string;
	isVerified: boolean;
	courses: Array<{ courseId: string }>;
	comparePassword: (password: string) => Promise<boolean>;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please enter your name'],
		},
		email: {
			type: String,
			required: [true, 'Please enter your email'],
			validate: {
				validator: function (v: string) {
					return emailRegexPattern.test(v);
				},
				message: (props: any) => `${props.value} is not a valid email!`,
			},
			unique: true,
		},
		password: {
			type: String,
			required: [true, 'Please enter your password'],
			minlength: [6, 'Your password must be longer than 6 characters'],
			select: false,
		},
		avatar: {
			public_id: {
				type: String,
				url: String,
			},
		},
		role: {
			type: String,
			default: 'user',
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		courses: [
			{
				courseId: {
					type: mongoose.Schema.Types.ObjectId,
				},
			},
		],
	},
	{ timestamps: true }
);

//encrypt password before saving user

userSchema.pre<IUser>('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

//compare user password

userSchema.methods.comparePassword = async function (
	enteredPassword: string
): Promise<boolean> {
	return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default userModel;
