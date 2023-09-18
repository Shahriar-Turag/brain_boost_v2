import express from 'express';
import { uploadCourse } from '../controller/course.controller';
const courseRouter = express.Router();

courseRouter.post('/create-course', uploadCourse);
