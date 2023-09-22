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
import { useRegisterMutation } from '@/redux/features/auth/authApi';
import toast from 'react-hot-toast';

type Props = {
	setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
	name: Yup.string().required('Please enter your name'),
	email: Yup.string()
		.email('Invalid email address')
		.required('Please enter your email address'),
	password: Yup.string().required('Please enter your password').min(6),
});

const SignUp: React.FC<Props> = ({ setRoute }) => {
	const [show, setShow] = React.useState(false);
	const [register, { data, error, isSuccess }] = useRegisterMutation();

	useEffect(() => {
		if (isSuccess) {
			const message = data?.message || 'Registration Successful';
			toast.success(message);
			setRoute('Verification');
		}
		if (error) {
			if ('data' in error) {
				const errorData = error as any;
				toast.error(errorData.data.message);
			}
		}
	}, [isSuccess, error, data, setRoute]);

	const formik = useFormik({
		initialValues: {
			name: '',
			email: '',
			password: '',
		},
		validationSchema: schema,
		onSubmit: async ({ name, email, password }) => {
			const data = {
				name,
				email,
				password,
			};
			await register(data);
		},
	});

	const { errors, touched, values, handleChange, handleSubmit } = formik;
	return (
		<div className='w-full'>
			<h1 className={`${styles.title}`}>Join Brain Boost</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label className={`${styles.label}`} htmlFor='name'>
						Enter your name
					</label>
					<input
						type='text'
						name='name'
						value={values.name}
						onChange={handleChange}
						id='name'
						placeholder='John Doe'
						className={`${
							errors.name && touched.name && 'border-red-500'
						} ${styles.input}`}
					/>
					{errors.name && touched.name && (
						<div className='text-red-500 pt-2 block'>
							{errors.name}
						</div>
					)}
				</div>
				<div className='w-full mt-5 relative mb-1'>
					<label className={`${styles.label}`} htmlFor='email'>
						Enter your email
					</label>
					<input
						type='email'
						name='email'
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
				</div>
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
				{errors.password && touched.password && (
					<div className='text-red-500 pt-2 block'>
						{errors.password}
					</div>
				)}
				<div className='w-full mt-5'>
					<input
						type='submit'
						value='Sign Up'
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
					Already have an account?
					<span
						className='text-[#2190ff] cursor-pointer font-bold pl-2'
						onClick={() => setRoute('Login')}
					>
						Login
					</span>
				</h5>
			</form>
			<br />
		</div>
	);
};

export default SignUp;
