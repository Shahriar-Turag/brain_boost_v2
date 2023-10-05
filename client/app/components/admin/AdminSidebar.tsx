'use client';
import React, { FC, useState, useEffect } from 'react';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, IconButton, Typography } from '@mui/material';

import {
	HomeOutlinedIcon,
	ArrowForwardIosIcon,
	ArrowBackIosIcon,
	PeopleOutlinedIcon,
	ReceiptOutlinedIcon,
	BarChartOutlinedIcon,
	MapOutlinedIcon,
	GroupsIcon,
	OndemandVideoIcon,
	VideoCallIcon,
	WebIcon,
	QuizIcon,
	ManageHistoryIcon,
	SettingsIcon,
	ExitToAppIcon,
	TrendingUpOutlinedIcon,
} from './Icon';
import avatarDefault from '../../../public/avatar.png';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';

type ItemProps = {
	title: string;
	to: string;
	icon: JSX.Element;
	selected: string;
	setSelected: any;
	isCollapsed: boolean;
};

const Item: FC<ItemProps> = ({
	title,
	to,
	icon,
	selected,
	setSelected,
	isCollapsed,
}) => {
	return (
		<Link href={to} passHref>
			<MenuItem
				active={selected === title}
				onClick={() => setSelected(title)}
			>
				<Box display='flex' alignItems='center' gap={2}>
					<Box display='flex' alignItems='center'>
						{icon}
					</Box>
					{!isCollapsed && (
						<Typography className='!text-[16px] !font-poppins '>
							{title}
						</Typography>
					)}
				</Box>
			</MenuItem>
		</Link>
	);
};

const AdminSidebar = () => {
	const { user } = useSelector((state: any) => state.auth);
	const [logout, setLogout] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [selected, setSelected] = useState('Dashboard');
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => setMounted(true), []);

	if (!mounted) return null;

	const logoutHandler = () => {
		setLogout(true);
	};

	return (
		<Box
			sx={{
				'& .pro-sidebar-inner': {
					background: `${
						theme === 'dark'
							? '#111c43 !important'
							: '#fff !important'
					}`,
				},
				'& .pro-icon-wrapper': {
					backgroundColor: 'transparent !important',
				},
				'& .pro-inner-item:hover': {
					color: '#868dfb !important',
				},
				'& .pro-menu-item.active': {
					color: '#6870fa !important',
				},
				'& .pro-inner-item': {
					padding: '5px 20px 5px 20px !important',
					opacity: 1,
				},
				'& .pro-menu-item': {
					color: `${theme !== 'dark' && '#000'} `,
				},
				'& .pro-sidebar': {
					height: '100vh',
					overflowY: 'auto',
				},
			}}
			className='!bg-white dark:bg-[#111c43]'
		>
			<ProSidebar
				collapsed={isCollapsed}
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
				}}
			>
				<Menu iconShape='square'>
					<MenuItem
						onClick={() => setIsCollapsed(!isCollapsed)}
						icon={isCollapsed ? <ArrowForwardIosIcon /> : undefined}
						style={{
							margin: '0 0 20px 0',
						}}
					>
						{!isCollapsed && (
							<Box
								display='flex'
								justifyContent='space-evenly'
								alignItems='center'
								gap={5}
								ml='15px'
							>
								<Link
									href='/'
									className='text-[25px] uppercase dark:text-white text-black'
								>
									Brain Boost
								</Link>

								<IconButton
									onClick={() => setIsCollapsed(!isCollapsed)}
									className='inline-block'
								>
									<ArrowBackIosIcon className='text-black dark:text-white' />
								</IconButton>
							</Box>
						)}
					</MenuItem>
					{!isCollapsed && (
						<Box mb='25px'>
							<Box
								display='flex'
								justifyContent='center'
								alignItems='center'
							>
								<Image
									alt='profile-user'
									src={
										user.avatar
											? user.avatar.url
											: avatarDefault
									}
									width={100}
									height={100}
									style={{
										cursor: 'pointer',
										borderRadius: '50%',
										border: '3px solid #5b6fe6',
									}}
								/>
							</Box>
							<Box textAlign='center'>
								<Typography
									variant='h4'
									className='!text-[20px] text-black dark:text-white'
									sx={{ m: '10px 0 0 0' }}
								>
									{user?.name}
								</Typography>
								<Typography
									variant='h6'
									sx={{ m: '10px 0 0 0' }}
									className='!text-[20px] text-black dark:text-white capitalize'
								>
									-{user?.role}
								</Typography>
							</Box>
						</Box>
					)}

					<Box>
						<Item
							title='Dashboard'
							to='/admin/dashboard'
							icon={<HomeOutlinedIcon />}
							selected={selected}
							setSelected={setSelected}
							isCollapsed={isCollapsed}
						/>
						<br />
						<MenuItem>
							{!isCollapsed && (
								<Typography className='!text-[18px] !font-poppins'>
									Data
								</Typography>
							)}
						</MenuItem>
						<Item
							title='Users'
							to='/admin/users'
							icon={<PeopleOutlinedIcon />}
							selected={selected}
							setSelected={setSelected}
							isCollapsed={isCollapsed}
						/>
						<Item
							title='Invoices'
							to='/admin/data/invoices'
							icon={<ReceiptOutlinedIcon />}
							selected={selected}
							setSelected={setSelected}
							isCollapsed={isCollapsed}
						/>
						<br />
						{/* Content */}
						<MenuItem>
							{!isCollapsed && (
								<Typography className='!text-[18px] !font-poppins'>
									Content
								</Typography>
							)}
						</MenuItem>
						<Item
							title='Create Courses'
							to='/admin/create-course'
							icon={<VideoCallIcon />}
							selected={selected}
							setSelected={setSelected}
							isCollapsed={isCollapsed}
						/>
						<Item
							title='Live Courses'
							to='/admin/content/live-courses'
							icon={<OndemandVideoIcon />}
							selected={selected}
							setSelected={setSelected}
							isCollapsed={isCollapsed}
						/>
						<br />

						{/* Customization */}
						<MenuItem>
							{!isCollapsed && (
								<Typography className='!text-[18px] !font-poppins'>
									Customization
								</Typography>
							)}
						</MenuItem>
						<Item
							title='Hero'
							to='/admin/customization/hero'
							icon={<WebIcon />}
							selected={selected}
							setSelected={setSelected}
							isCollapsed={isCollapsed}
						/>
						<Item
							title='FAQ'
							to='/admin/customization/faq'
							icon={<QuizIcon />}
							selected={selected}
							setSelected={setSelected}
							isCollapsed={isCollapsed}
						/>
						<Item
							title='Categories'
							to='/admin/customization/categories'
							icon={<GroupsIcon />}
							selected={selected}
							setSelected={setSelected}
							isCollapsed={isCollapsed}
						/>
						<br />

						{/* Controllers */}
						<MenuItem>
							{!isCollapsed && (
								<Typography className='!text-[18px] !font-poppins'>
									Controllers
								</Typography>
							)}
						</MenuItem>
						<Item
							title='Manage Team'
							to='/admin/controllers/manage-team'
							icon={<ManageHistoryIcon />}
							selected={selected}
							setSelected={setSelected}
							isCollapsed={isCollapsed}
						/>
						<br />

						{/* Analytics */}
						<MenuItem>
							{!isCollapsed && (
								<Typography className='!text-[18px] !font-poppins'>
									Analytics
								</Typography>
							)}
						</MenuItem>
						<Item
							title='Course Analytics'
							to='/admin/analytics/course-analytics'
							icon={<BarChartOutlinedIcon />}
							selected={selected}
							setSelected={setSelected}
							isCollapsed={isCollapsed}
						/>
						<Item
							title='Orders Analytics'
							to='/admin/analytics/orders-analytics'
							icon={<MapOutlinedIcon />}
							selected={selected}
							setSelected={setSelected}
							isCollapsed={isCollapsed}
						/>
						<Item
							title='Users Analytics'
							to='/admin/analytics/users-analytics'
							icon={<TrendingUpOutlinedIcon />}
							selected={selected}
							setSelected={setSelected}
							isCollapsed={isCollapsed}
						/>
						<br />

						{/* Extras */}
						<MenuItem>
							{!isCollapsed && (
								<Typography className='!text-[18px] !font-poppins'>
									Extras
								</Typography>
							)}
						</MenuItem>
						<Item
							title='Settings'
							to='/admin/settings'
							icon={<SettingsIcon />}
							selected={selected}
							setSelected={setSelected}
							isCollapsed={isCollapsed}
						/>
						<Box onClick={logoutHandler}>
							<Item
								title='Logout'
								to='/'
								icon={<ExitToAppIcon />}
								selected={selected}
								setSelected={setSelected}
								isCollapsed={isCollapsed}
							/>
						</Box>
						<br />
					</Box>
				</Menu>
			</ProSidebar>
		</Box>
	);
};

export default AdminSidebar;
