import { styles } from '@/app/styles/style';
import { useUpdatePasswordMutation } from '@/redux/features/user/userApi';
import React, { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Props = {};

const ChangePassword: FC<Props> = (props) => {
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();

	const passwordChangeHandler = async (e: any) => {
		e.preventDefault();
		if (newPassword !== confirm) {
			toast.error('Passwords do not match');
		} else {
			await updatePassword({
				oldPassword: oldPassword,
				newPassword: newPassword,
			});
		}
	};

	useEffect(() => {
		if (isSuccess) {
			toast.success('Password updated successfully');
		}
		if (error) {
			if ('data' in error) {
				const errorData = error as any;
				toast.error(errorData.data.message);
			}
		}
	}, [isSuccess, error]);
	return (
		<div className='w-full pl-7 px-2 800px:px-5 800px:pl-0'>
			<h1 className='block text-[25px] 800px:text-[30px] font-poppins text-center font-[500] dark:text-white text-black pb-2 '>
				Change Password
			</h1>
			<div className='w-full dark:text-white text-black '>
				<form
					aria-required
					onSubmit={passwordChangeHandler}
					className='flex flex-col items-center'
				>
					<div className='w-[100%] 800px:w-[60%] mt-5'>
						<label className='block'>Enter your old password</label>
						<input
							type='password'
							className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
							required
							value={oldPassword}
							onChange={(e) => setOldPassword(e.target.value)}
						/>
					</div>
					<div className='w-[100%] 800px:w-[60%] mt-5'>
						<label className='block'>Enter your new password</label>
						<input
							type='password'
							className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
							required
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
						/>
					</div>
					<div className='w-[100%] 800px:w-[60%] mt-5'>
						<label className='block'>
							Confirm your new password
						</label>
						<input
							type='password'
							className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
							required
							value={confirm}
							onChange={(e) => setConfirm(e.target.value)}
						/>
						<input
							type='submit'
							value='Update'
							className={`w-[95%] h-[40px] border border-[#37a39a] text-center dark:text-white text-black mt-8 cursor-pointer rounded-[3px]`}
						/>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ChangePassword;
