import React from 'react';
import { Modal, Box } from '@mui/material';

type Props = {
	open: boolean;
	setOpen: (open: boolean) => void;
	activeItem: any;
	route: string;
	setRoute?: (route: string) => void;
	component: any;
};

const CustomModal: React.FC<Props> = ({
	open,
	setOpen,
	activeItem,
	route,
	setRoute,
	component: Component,
}) => {
	return (
		<Modal
			open={open}
			onClose={() => setOpen(false)}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'
			disableScrollLock={true}
			className='justify-center items-center flex overflow-hidden'
		>
			<Box className='w-full max-w-xl bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 md:p-6 m-6 outline-none'>
				<Component setOpen={setOpen} setRoute={setRoute} />
			</Box>
		</Modal>
	);
};
export default CustomModal;
