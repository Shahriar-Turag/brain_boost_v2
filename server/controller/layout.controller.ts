import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/ErrorHandler';
import { CatchAsyncError } from '../middleware/catchAsyncErrors';
import LayoutModel from '../models/layout.model';
import cloudinary from 'cloudinary';

//create layout
export const createLayout = CatchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { type } = req.body;

			const isTypeExist = await LayoutModel.findOne({ type });

			if (isTypeExist)
				return next(new ErrorHandler('Layout already exist', 400));

			if (type === 'Banner') {
				const { title, subtitle, image } = req.body;

				const myCloud = await cloudinary.v2.uploader.upload(image, {
					folder: 'layout',
				});

				const banner = {
					image: {
						public_id: myCloud.public_id,
						url: myCloud.secure_url,
					},
					title,
					subtitle,
				};

				await LayoutModel.create(banner);
			}

			if (type === 'FAQ') {
				const { faq } = req.body;

				const faqItems = await Promise.all(
					faq.map(async (item: any) => {
						return {
							question: item.question,
							answer: item.answer,
						};
					})
				);
				await LayoutModel.create({ type: 'FAQ', faq: faqItems });
			}
			if (type === 'Categories') {
				const { categories } = req.body;

				const categoryItems = await Promise.all(
					categories.map(async (item: any) => {
						return {
							title: item.title,
						};
					})
				);

				await LayoutModel.create({
					type: 'Categories',
					categories: categoryItems,
				});
			}

			res.status(200).json({
				success: true,
				message: 'Layout created successfully',
			});
		} catch (err: any) {
			return next(new ErrorHandler(err.message, 500));
		}
	}
);

//edit layout
export const editLayout = CatchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { type } = req.body;

			if (type === 'Banner') {
				const bannerData: any = await LayoutModel.findOne({
					type: 'Banner',
				});
				const { title, subtitle, image } = req.body;

				if (bannerData) {
					await cloudinary.v2.uploader.destroy(
						bannerData.image.public_id
					);
				}
				const myCloud = await cloudinary.v2.uploader.upload(image, {
					folder: 'layout',
				});

				const banner = {
					image: {
						public_id: myCloud.public_id,
						url: myCloud.secure_url,
					},
					title,
					subtitle,
				};

				await LayoutModel.findByIdAndUpdate(bannerData._id, { banner });
			}

			if (type === 'FAQ') {
				const { faq } = req.body;
				const faqItem = await LayoutModel.findOne({ type: 'FAQ' });

				const faqItems = await Promise.all(
					faq.map(async (item: any) => {
						return {
							question: item.question,
							answer: item.answer,
						};
					})
				);
				await LayoutModel.findByIdAndUpdate(faqItem?._id, {
					type: 'FAQ',
					faq: faqItems,
				});
			}
			if (type === 'Categories') {
				const { categories } = req.body;

				const categoryItem = await LayoutModel.findOne({
					type: 'Categories',
				});

				const categoryItems = await Promise.all(
					categories.map(async (item: any) => {
						return {
							title: item.title,
						};
					})
				);

				await LayoutModel.findByIdAndUpdate(categoryItem?._id, {
					type: 'Categories',
					categories: categoryItems,
				});
			}

			res.status(200).json({
				success: true,
				message: 'Layout updated successfully',
			});
		} catch (err: any) {
			return next(new ErrorHandler(err.message, 500));
		}
	}
);

//get layout by type
export const getLayoutByType = CatchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { type } = req.body;
			const layout = await LayoutModel.findOne({ type });

			res.status(200).json({
				success: true,
				layout,
			});
		} catch (err: any) {
			return next(new ErrorHandler(err.message, 500));
		}
	}
);
