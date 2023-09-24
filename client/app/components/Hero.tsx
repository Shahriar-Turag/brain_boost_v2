import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Props = {};

const Hero: React.FC<Props> = (props) => {
	return (
		<div className=' flex min-h-screen items-center justify-center'>
			<div className='hero-animation absolute 800px:h-[50vh] h-[40vh]  800px:w-[50vh] w-[40vh] rounded-full overflow-hidden' />
			<div className='text-center space-y-10 z-10 800px:px-0 px-10'>
				<h1 className='max-w-[1100px] 800px:text-6xl text-4xl font-extrabold dark:text-white text-black'>
					Improve your online{' '}
					<span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-pink-400 '>
						Learning Experience
					</span>{' '}
					Better Instantly
					<span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-pink-400 '>
						.
					</span>
				</h1>
				<p className='max-w-[800px] mx-auto text-slate-400 800px:text-2xl text-md'>
					Empower your academic journey with Brain Boost&apos;s
					dedicated community and comprehensive resources.
				</p>
				<Link href={'/courses'}>
					<button className='font-bold text-white bg-blue-400 px-5 py-3 rounded-full mt-5'>
						Explore Courses
					</button>
				</Link>
			</div>
		</div>
	);
};

export default Hero;
