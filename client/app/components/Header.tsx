'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { FC, useEffect, useState } from 'react';
import NavItem from '../utils/NavItem';
import { ThemeSwitcher } from '../utils/ThemeSwitcher';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { HiOutlineUserCircle } from 'react-icons/hi';
import CustomModal from '../utils/CustomModal';
import Login from '../components/auth/Login';
import SignUp from '../components/auth/SignUp';
import Verification from './auth/Verification';
import { useSelector } from 'react-redux';
import avatarIcon from '../../public/avatar.png';
import { useSession } from 'next-auth/react';
import {
	useLogoutQuery,
	useSocialAuthMutation,
} from '@/redux/features/auth/authApi';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

type Props = {
	open: boolean;
	setOpen: (open: boolean) => void;
	activeItem: number;
	route: string;
	setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ activeItem, setOpen, route, open, setRoute }) => {
	const [active, setActive] = useState(false);
	const [openSidebar, setOpenSidebar] = useState(false);
	const { user } = useSelector((state: any) => state.auth);
	const { data } = useSession();
	const [socialAuth, { isSuccess, error, isError }] = useSocialAuthMutation();

	const [logout, setLogout] = useState(false);
	const {} = useLogoutQuery(undefined, { skip: !logout ? true : false });

	console.log(data);

	useEffect(() => {
		// If there's no user and there's data from social auth
		if (!user && data) {
			socialAuth({
				email: data?.user?.email,
				name: data?.user?.name,
				avatar: data?.user?.image,
			});
		}

		// If the social auth was successful and there's no user in Redux store
		if (!user && isSuccess) {
			toast.success('Logged in successfully');
		}

		// If the social auth had an error
		if (error) {
			toast.error('Something went wrong');
		}

		// If data is null, set the logout state to true
		if (data && user === null) {
			setLogout(true);
		}
	}, [data, user]);

	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', () => {
			if (window.scrollY > 80) {
				setActive(true);
			} else {
				setActive(false);
			}
		});
	}

	const handleClose = (e: any) => {
		if (e.target.id === 'screen') {
			setOpenSidebar(false);
		}
	};
	return (
		<div className='w-full relative'>
			<div
				className={`${
					active
						? 'dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500'
						: 'w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow'
				}`}
			>
				<div className='w-[95%] 800px:w-[92%] m-auto h-full'>
					<div className='w-full h-[80px] flex items-center justify-between p-3'>
						<div>
							<Link href={'/'}>
								<Image
									src='/logo.svg'
									alt='logo'
									width={180}
									height={180}
								/>
							</Link>
						</div>
						<div className='flex items-center gap-4'>
							<NavItem activeItem={activeItem} isMobile={false} />
							<ThemeSwitcher />
							{/* only for mobile */}
							<div className='800px:hidden'>
								<HiOutlineMenuAlt3
									size='25'
									className='cursor-pointer dark:text-white text-black'
									onClick={() => setOpenSidebar(true)}
								/>
							</div>
							{user ? (
								<>
									<Link href='/profile'>
										<Image
											src={
												user?.avatar?.url || avatarIcon
											}
											alt='user image'
											className='rounded-full cursor-pointer w-auto h-auto dark:border-emerald-500 border-red-400'
											width={30}
											height={30}
										/>
									</Link>
								</>
							) : (
								<HiOutlineUserCircle
									size='25'
									className='hidden 800px:block cursor-pointer dark:text-white text-black'
									onClick={() => setOpen(true)}
								/>
							)}
						</div>
					</div>
				</div>

				{/* Mobile sidebar */}
				{openSidebar && (
					<div
						className='fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]'
						onClick={handleClose}
						id='screen'
					>
						<div className='w-[75%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0'>
							<NavItem activeItem={activeItem} isMobile={true} />
							<HiOutlineUserCircle
								size={25}
								className='cursor-pointer ml-5 my-2 text-black dark:text-white'
								onclick={() => setOpen(true)}
							/>
							<br />
							<br />
							<p className='text-[16px] px-2 pl-5 text-black dark:text-white'>
								Copyright &copy; 2023 Brain Boost
							</p>
						</div>
					</div>
				)}
			</div>
			{route === 'Login' && (
				<>
					{open && (
						<CustomModal
							open={open}
							setOpen={setOpen}
							route={route}
							setRoute={setRoute}
							activeItem={activeItem}
							component={Login}
						/>
					)}
				</>
			)}
			{route === 'Sign-Up' && (
				<>
					{open && (
						<CustomModal
							open={open}
							setOpen={setOpen}
							route={route}
							setRoute={setRoute}
							activeItem={activeItem}
							component={SignUp}
						/>
					)}
				</>
			)}
			{route === 'Verification' && (
				<>
					{open && (
						<CustomModal
							open={open}
							setOpen={setOpen}
							route={route}
							setRoute={setRoute}
							activeItem={activeItem}
							component={Verification}
						/>
					)}
				</>
			)}
		</div>
	);
};

export default dynamic(() => Promise.resolve(Header), { ssr: false });
