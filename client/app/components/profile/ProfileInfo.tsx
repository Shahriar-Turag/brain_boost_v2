import Image from 'next/image';
import React, { FC, useEffect, useState } from 'react';
import avatarIcon from '../../../public/avatar.png';
import { AiOutlineCamera } from 'react-icons/ai';
import { styles } from '@/app/styles/style';
import {
	useEditProfileMutation,
	useUpdateAvatarMutation,
} from '@/redux/features/user/userApi';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import toast from 'react-hot-toast';

type Props = {
	avatar: string | null;
	user: any;
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
	const [name, setName] = useState(user && user.name);
	const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
	const [editProfile, { isSuccess: success, error: updateError }] =
		useEditProfileMutation();
	const [loadUser, setLoadUser] = useState(false);
	const {} = useLoadUserQuery(undefined, { skip: loadUser ? false : true });

	const imageHandler = async (e: any) => {
		const fileReader = new FileReader();

		fileReader.onload = () => {
			if (fileReader.readyState === 2) {
				const avatar = fileReader.result;
				updateAvatar(avatar);
			}
		};
		fileReader.readAsDataURL(e.target.files[0]);
	};

	useEffect(() => {
		if (isSuccess || success) {
			setLoadUser(true);
		}
		if (error || updateError) {
			console.log(error);
		}
		if (success) {
			toast.success('Profile updated successfully');
		}
	}, [isSuccess, error, success, updateError]);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		if (name !== '') {
			await editProfile({
				name: name,
			});
		}
	};
	return (
		<>
			<div className='w-full flex justify-center'>
				<div className='relative'>
					<Image
						src={user?.avatar?.url || avatar || avatarIcon}
						alt='avatar'
						width={120}
						height={120}
						className='w-auto h-auto cursor-pointer border-[3px] border-[#37a39a] rounded-full'
					/>
					<input
						type='file'
						name=''
						id='avatar'
						className='hidden'
						onChange={imageHandler}
						accept='image/png, image/jpeg, image/jpg, image/gif, image/svg, image/webp'
					/>
					<label htmlFor='avatar'>
						<div className='w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer'>
							<AiOutlineCamera size={20} className='z-1' />
						</div>
					</label>
				</div>
			</div>
			<br />
			<br />
			<div className='w-full pl-6 800px:pl-10'>
				<form onSubmit={handleSubmit}>
					<div className='800px:w-[50%] m-auto block pb-4'>
						<div className='w-[100%]'>
							<label className='block '>Full name</label>
							<input
								type='text'
								className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
								required
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div className='w-[100%] pt-4'>
							<label className='block'>Email address</label>
							<input
								type='text'
								readOnly
								className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
								required
								value={user?.email}
							/>
						</div>
						<input
							className={`w-full 800px:w-[250px] h-[40px] border border-[#37a39a] text-center dark:text-white text-black rounded-[3px] mt-8 cursor-pointer`}
							required
							value='Update'
							type='submit'
						/>
					</div>
				</form>
			</div>
		</>
	);
};

export default ProfileInfo;
