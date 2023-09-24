'use client';
import React from 'react';
import Heading from '../utils/Heading';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminProtected from '../hooks/adminProtected';

type Props = {};

const page = (props: Props) => {
	return (
		<div>
			<AdminProtected>
				<Heading
					title='Brain Boost | Admin'
					description='Boost your academic performance with Brain Boost'
					keywords='brain, boost, academic, performance, study, studying, study, skills, skill, learning, learn, education, educational, school, college, university, university, student, students, high, school, highschool, high-school, middle, middle-school, middle-school, middle, school, elementary, elementary-school, elementary-school, elementary, school, primary, primary-school, primary-school, primary, school, secondary, secondary-school, secondary-school, secondary, school, university, university, college, college, university, Programming, MERN, Machine learning, Artificial intelligence, AI, ML, Data science, Data, science, Data, analysis, Data, analytics, Data, visualization, Data, visualisation, Data'
				/>
				<div className='flex h-[200vh]'>
					<div className='1500px;w-[16%] w-1/5'>
						<AdminSidebar />
					</div>
					<div className='w-[85%]'></div>
				</div>
			</AdminProtected>
		</div>
	);
};

export default page;
