import Image from 'next/image';
import React, { FC } from 'react';
import avatarDefault from '../../../public/avatar.png';
import { RiLockPasswordLine } from 'react-icons/ri';
import { SiCoursera } from 'react-icons/si';
import { AiOutlineLogout } from 'react-icons/ai';
import { MdAdminPanelSettings } from 'react-icons/md';
import Link from 'next/link';

type Props = {
	user: any;
	active: number;
	avatar: string | null;
	setActive: (active: number) => void;
	logoutHandler: any;
};

const SidebarProfile: FC<Props> = ({
	user,
	active,
	avatar,
	setActive,
	logoutHandler,
}) => {
	return (
		<div className='w-full'>
			<div
				className={`w-full flex items-center px-3 py-4 cursor-pointer ${
					active === 1
						? 'dark:bg-slate-800 bg-[#e6e6e6] rounded-t-[10px]'
						: 'bg-transparent'
				}`}
				onClick={() => setActive(1)}
			>
				<Image
					src={user?.avatar?.url || avatar || avatarDefault}
					alt='avatar'
					className='w-[20px] h-[20px] 800px:w-[30px] 800px:h-[30px] cursor-pointer rounded-full'
					width={30}
					height={30}
				/>
				<h5 className='pl-2 800px:block hidden dark:text-white text-black'>
					My Account
				</h5>
			</div>
			<hr />
			<div
				className={`w-full flex items-center px-3 py-4 cursor-pointer ${
					active === 2
						? 'dark:bg-slate-800 bg-[#e6e6e6]'
						: 'bg-transparent'
				}`}
				onClick={() => setActive(2)}
			>
				<RiLockPasswordLine
					size={20}
					className='text-black dark:text-white'
				/>
				<h5 className='pl-2 800px:block hidden text-black dark:text-white'>
					Change Password
				</h5>
			</div>
			<div
				className={`w-full flex items-center px-3 py-4 cursor-pointer ${
					active === 3
						? 'dark:bg-slate-800 bg-[#e6e6e6]'
						: 'bg-transparent'
				}`}
				onClick={() => setActive(3)}
			>
				<SiCoursera size={20} className='text-black dark:text-white' />
				<h5 className='pl-2 800px:block hidden text-black dark:text-white'>
					Enrolled Courses
				</h5>
			</div>
			{user.role === 'admin' && (
				<Link
					href={'/admin'}
					className={`w-full flex items-center px-3 py-4 cursor-pointer ${
						active === 6
							? 'dark:bg-slate-800 bg-[#e6e6e6]'
							: 'bg-transparent'
					}`}
				>
					<MdAdminPanelSettings
						size={20}
						className='text-black dark:text-white'
					/>
					<h5 className='pl-2 800px:block hidden text-black dark:text-white'>
						Admin Dashboard
					</h5>
				</Link>
			)}
			<div
				className={`w-full flex items-center px-3 py-4 cursor-pointer ${
					active === 4
						? 'dark:bg-slate-800 bg-[#e6e6e6]'
						: 'bg-transparent'
				}`}
				onClick={() => logoutHandler()}
			>
				<AiOutlineLogout
					size={20}
					className='text-black dark:text-white'
				/>
				<h5 className='pl-2 800px:block hidden text-black dark:text-white'>
					Log out
				</h5>
			</div>
		</div>
	);
};

export default SidebarProfile;
