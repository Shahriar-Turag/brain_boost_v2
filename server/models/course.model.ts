import mongoose, { Schema, Document, Model } from 'mongoose';

interface IComment extends Document {
	user: object;
	comment: string;
	commentReplies?: IComment[];
}

interface IReview extends Document {
	user: object;
	rating: number;
	comment: string;
	commentReplies: IComment[];
}

interface ILink extends Document {
	title: string;
	url: string;
}

interface ICourseData extends Document {
	title: string;
	description: string;
	videoUrl: string;
	videoThumbnail: object;
	videoSection: string;
	videoLength: number;
	videoPlayer: string;
	links: ILink[];
	suggestion: string;
	questions: IComment[];
}

interface ICourse extends Document {
	name: string;
	description: string;
	price: number;
	estimatedPrice?: number;
	thumbnail: object;
	tags: string[];
	level: string;
	demoUrl: string;
	benefits: { title: string }[];
	prerequisites: { title: string }[];
	reviews: IReview[];
	courseData: ICourseData[];
	ratings?: number;
	purchased?: number;
}

//review schema
const reviewSchema = new Schema<IReview>({
	user: Object,
	rating: {
		type: Number,
		default: 0,
	},
	comment: String,
});

//link schema
const linkSchema = new Schema<ILink>({
	title: String,
	url: String,
});

//comment schema
const commentSchema = new Schema<IComment>({
	user: Object,
	comment: String,
	commentReplies: [Object],
});

//course data schema
const courseDataSchema = new Schema<ICourseData>({
	videoUrl: String,
	videoThumbnail: Object,
	title: String,
	videoSection: String,
	description: String,
	videoLength: Number,
	videoPlayer: String,
	links: [linkSchema],
	suggestion: String,
	questions: [commentSchema],
});

//course schema
const courseSchema = new Schema<ICourse>({
	name: {
		type: String,
		required: [true, 'Please enter course name'],
	},
	description: {
		type: String,
		required: [true, 'Please enter course description'],
	},
	price: {
		type: Number,
		required: [true, 'Please enter course price'],
	},
	estimatedPrice: Number,
	thumbnail: {
		public_id: {
			type: String,
			required: [true, 'Please upload course thumbnail'],
		},
		url: {
			type: String,
			required: [true, 'Please upload course thumbnail'],
		},
	},
	tags: {
		type: [String],
		required: [true, 'Please enter course tags'],
	},
	level: {
		type: String,
		required: [true, 'Please enter course level'],
	},
	demoUrl: {
		type: String,
		required: [true, 'Please enter course demo url'],
	},
	benefits: [{ title: String }],
	prerequisites: [{ title: String }],
	reviews: [reviewSchema],
	courseData: [courseDataSchema],
	ratings: {
		type: Number,
		default: 0,
	},
	purchased: {
		type: Number,
		default: 0,
	},
});

const CourseModel: Model<ICourse> = mongoose.model('Course', courseSchema);

export default CourseModel;
