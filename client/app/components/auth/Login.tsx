import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
	AiOutlineEye,
	AiOutlineEyeInvisible,
	AiFillGithub,
} from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { styles } from '@/app/styles/style';
import { useLoginMutation } from '@/redux/features/auth/authApi';
import toast from 'react-hot-toast';

type Props = {
	setRoute: (route: string) => void;
	setOpen: (open: boolean) => void;
};

const schema = Yup.object().shape({
	email: Yup.string()
		.email('Invalid email address')
		.required('Please enter your email address'),
	password: Yup.string().required('Please enter your password').min(6),
});

const Login: React.FC<Props> = ({ setRoute, setOpen }) => {
	const [show, setShow] = React.useState(false);
	const [login, { data, isError, isSuccess, error }] = useLoginMutation();

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validationSchema: schema,
		onSubmit: async ({ email, password }) => {
			await login({ email, password });
		},
	});

	useEffect(() => {
		if (isSuccess) {
			toast.success('Login Successful');
			setOpen(false);
		}
		if (error) {
			if ('data' in error) {
				const errorData = error as any;
				toast.error(errorData.data.message);
			}
		}
	}, [isSuccess, error, setOpen]);

	const { errors, touched, values, handleChange, handleSubmit } = formik;
	return (
		<div className='w-full'>
			<h1 className={`${styles.title}`}>Login to Brain Boost</h1>
			<form onSubmit={handleSubmit}>
				<label className={`${styles.label}`} htmlFor='email'>
					Enter your email
				</label>
				<input
					type='email'
					name=''
					value={values.email}
					onChange={handleChange}
					id='email'
					placeholder='loginmail@gmail.com'
					className={`${
						errors.email && touched.email && 'border-red-500'
					} ${styles.input}`}
				/>
				{errors.email && touched.email && (
					<div className='text-red-500 pt-2 block'>
						{errors.email}
					</div>
				)}
				<div className='w-full mt-5 relative mb-1'>
					<label className={`${styles.label}`} htmlFor='password'>
						Enter your password
					</label>
					<input
						type={!show ? 'password' : 'text'}
						name='password'
						value={values.password}
						onChange={handleChange}
						id='password'
						placeholder='********'
						className={`${
							errors.password &&
							touched.password &&
							'border-red-500'
						} ${styles.input}`}
					/>
					{!show ? (
						<AiOutlineEyeInvisible
							className='absolute bottom-2 right-2 z-1 cursor-pointer text-black dark:text-white'
							onClick={() => setShow(!show)}
							size={25}
						/>
					) : (
						<AiOutlineEye
							className='absolute bottom-2 right-2 z-1 cursor-pointer text-black dark:text-white'
							onClick={() => setShow(!show)}
							size={25}
						/>
					)}
				</div>
				<div className='w-full mt-5'>
					<input
						type='submit'
						value='Login'
						className={`${styles.submitButton}`}
					/>
				</div>
				<br />
				<h5 className='text-center pt-4 text-[12px] text-black dark:text-white font-bold'>
					Or join with
				</h5>
				<div className='flex items-center justify-center my-3 space-x-4'>
					<FcGoogle size={30} className='cursor-pointer' />
					<AiFillGithub
						size={30}
						className='cursor-pointer text-black dark:text-white'
					/>
				</div>
				<h5 className='text-center pt-4 text-[14px] text-black dark:text-white'>
					Don&apos;t have any account?
					<span
						className='text-[#2190ff] pl-2 cursor-pointer font-bold'
						onClick={() => setRoute('Sign-Up')}
					>
						Sign Up
					</span>
				</h5>
			</form>
			<br />
		</div>
	);
};

export default Login;
