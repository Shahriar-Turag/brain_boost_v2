import { styles } from '@/app/styles/style';
import React, { FC, useState } from 'react';

type Props = {
	courseInfo: any;
	setCourseInfo: (courseInfo: any) => void;
	active: number;
	setActive: (active: number) => void;
};

const CourseInformation: FC<Props> = ({
	courseInfo,
	setCourseInfo,
	active,
	setActive,
}) => {
	const [dragging, setDragging] = useState(false);

	const handleSubmit = (e: any) => {
		e.preventDefault();
		setActive(active + 1);
	};

	const handleChange = (e: any) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				if (reader.readyState === 2) {
					setCourseInfo({ ...courseInfo, thumbnail: reader.result });
				}
			};
			reader.readAsDataURL(file);
		}
	};

	const handleDragOver = (e: any) => {
		e.preventDefault();
		setDragging(true);
	};

	const handleDragLeave = (e: any) => {
		e.preventDefault();
		setDragging(false);
	};

	const handleDrop = (e: any) => {
		e.preventDefault();
		setDragging(false);
		const file = e.dataTransfer.files?.[0];

		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				if (reader.readyState === 2) {
					setCourseInfo({ ...courseInfo, thumbnail: reader.result });
				}
			};
			reader.readAsDataURL(file);
		}
	};
	return (
		<div className='w-[80%] m-auto my-24'>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor='' className={`${styles.label}`}>
						Course Name
					</label>
					<input
						type='name'
						name=''
						required
						value={courseInfo.name}
						onChange={(e: any) =>
							setCourseInfo({
								...courseInfo,
								name: e.target.value,
							})
						}
						id='name'
						placeholder='MERN stack LMS platform with nextjs 13'
						className={`${styles.input}`}
					/>
				</div>
				<br />
				<div className='mb-5'>
					<label htmlFor=''>Course Description</label>
					<textarea
						name=''
						id=''
						cols={30}
						rows={8}
						value={courseInfo.description}
						placeholder='Write a short description about your course...'
						onChange={(e: any) =>
							setCourseInfo({
								...courseInfo,
								description: e.target.value,
							})
						}
						className={`${styles.input} !h-min !py-2`}
					></textarea>
				</div>
				<br />
				<div className='w-full flex justify-between'>
					<div className='w-[45%]'>
						<label className={`${styles.label} `}>
							Course price
						</label>
						<input
							type='number'
							name=''
							required
							value={courseInfo.price}
							onChange={(e: any) =>
								setCourseInfo({
									...courseInfo,
									price: e.target.value,
								})
							}
							id='price'
							placeholder='29'
							className={`${styles.input}`}
						/>
					</div>
					<div className='w-[50%]'>
						<label className={`${styles.label} w-[50%]`}>
							Estimated price (Optional)
						</label>
						<input
							type='number'
							name=''
							required
							value={courseInfo.estimatedPrice}
							onChange={(e: any) =>
								setCourseInfo({
									...courseInfo,
									estimatedPrice: e.target.value,
								})
							}
							id='price'
							placeholder='79'
							className={`${styles.input}`}
						/>
					</div>
				</div>
				<br />
				<div>
					{/* email */}
					<label className={`${styles.label}`} htmlFor='tags'>
						{' '}
						Course Tags
					</label>
					<input
						type='text'
						name=''
						required
						value={courseInfo.tags}
						onChange={(e: any) =>
							setCourseInfo({
								...courseInfo,
								tags: e.target.value,
							})
						}
						id='tags'
						placeholder='react, nextjs, typescript, javascript'
						className={`${styles.input}`}
					/>
				</div>
				<br />
				<div className='w-full flex justify-between'>
					<div className='w-[45%]'>
						<label htmlFor='level' className={`${styles.label} `}>
							Course Level
						</label>
						<input
							type='text'
							name=''
							required
							value={courseInfo.level}
							onChange={(e: any) =>
								setCourseInfo({
									...courseInfo,
									level: e.target.value,
								})
							}
							id='level'
							placeholder='Beginner/Intermediate/Advanced'
							className={`${styles.input}`}
						/>
					</div>
					<div className='w-[50%]'>
						<label
							htmlFor='demoUrl'
							className={`${styles.label} w-[50%]`}
						>
							Demo URL
						</label>
						<input
							type='text'
							name=''
							required
							value={courseInfo.demoUrl}
							onChange={(e: any) =>
								setCourseInfo({
									...courseInfo,
									demoUrl: e.target.value,
								})
							}
							id='demoUrl'
							placeholder='eer74fd'
							className={`${styles.input}`}
						/>
					</div>
				</div>
				<br />
				<div className='w-full'>
					<input
						type='file'
						accept='image/*'
						id='file'
						className='hidden'
						onChange={handleChange}
					/>
					<label
						htmlFor='file'
						className={`w-full min-h-[10vh] dark:border-white rounded border-[#00000026] p-3 border flex items-center justify-center ${
							dragging ? 'bg-blue-500' : 'bg-transparent'
						} `}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
					>
						{courseInfo.thumbnail ? (
							<img
								src={courseInfo.thumbnail}
								alt=''
								className='w-full max-h-full object-cover'
							/>
						) : (
							<p className='text-center text-black dark:text-white'>
								Drag & Drop your thumbnail here or click to add
							</p>
						)}
					</label>
				</div>

				<div className='w-full flex items-center justify-end'>
					<input
						type='submit'
						value='Next'
						className='w-full 800px:w-[180px] h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer'
					/>
				</div>
			</form>
		</div>
	);
};

export default CourseInformation;
