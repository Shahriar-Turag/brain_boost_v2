import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export const navItemsData = [
	{
		name: 'Home',
		url: '/',
	},
	{
		name: 'Courses',
		url: '/courses',
	},
	{
		name: 'About',
		url: '/about',
	},
	{
		name: 'Policy',
		url: '/policy',
	},
	{
		name: 'FAQ',
		url: '/faq',
	},
];

type Props = {
	activeItem: number;
	isMobile: boolean;
};

const NavItem: React.FC<Props> = ({ activeItem, isMobile }) => {
	return (
		<>
			<div className='hidden 800px:flex'>
				{navItemsData &&
					navItemsData.map((i, index) => (
						<Link href={`${i.url}`} key={index} passHref>
							<span
								className={`${
									activeItem === index
										? 'dark:text-[#37a39a] text-[crimson]'
										: 'dark:text-white text-black'
								} text-[18px] px-6 font-poppins font-[400]`}
							>
								{i.name}
							</span>
						</Link>
					))}
			</div>
			{isMobile && (
				<div className='800px:hidden mt-5'>
					<div className='w-full flex items-center justify-center'>
						<Link href={'/'} passHref>
							<Image
								src='/logo.svg'
								alt='logo'
								width={180}
								height={180}
							/>
						</Link>
					</div>
					{navItemsData &&
						navItemsData.map((i, index) => (
							<Link href='/' passHref key={index}>
								<span
									className={`${
										activeItem === index
											? 'dark:text-[#37a39a] text-[crimson]'
											: 'dark:text-white text-black'
									} py-5 text-[18px] px-6 font-poppins font-[400] block`}
								>
									{i.name}
								</span>
							</Link>
						))}
				</div>
			)}
		</>
	);
};

export default dynamic(() => Promise.resolve(NavItem), { ssr: false });
