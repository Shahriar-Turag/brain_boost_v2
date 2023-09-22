'use client';

import React, { FC, useState } from 'react';
import Heading from './utils/Heading';
import Header from './components/Header';
import Hero from './components/Hero';

interface Props {}

const Page: FC<Props> = (Props) => {
	const [open, setOpen] = useState(false);
	const [activeItem, setActiveItem] = useState(0);
	const [route, setRoute] = useState('Login');
	return (
		<div>
			<Heading
				title='Brain Boost'
				description='Boost your academic performance with Brain Boost'
				keywords='brain, boost, academic, performance, study, studying, study, skills, skill, learning, learn, education, educational, school, college, university, university, student, students, high, school, highschool, high-school, middle, middle-school, middle-school, middle, school, elementary, elementary-school, elementary-school, elementary, school, primary, primary-school, primary-school, primary, school, secondary, secondary-school, secondary-school, secondary, school, university, university, college, college, university, Programming, MERN, Machine learning, Artificial intelligence, AI, ML, Data science, Data, science, Data, analysis, Data, analytics, Data, visualization, Data, visualisation, Data'
			/>
			<Header
				open={open}
				setOpen={setOpen}
				activeItem={activeItem}
				route={route}
				setRoute={setRoute}
			/>
			<Hero />
		</div>
	);
};

export default Page;
