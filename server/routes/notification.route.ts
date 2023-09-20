import express from 'express';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';
import {
	getNotifications,
	updateNotificationStatus,
} from '../controller/notification.controller';
const notificationRoute = express.Router();

notificationRoute.get(
	'/get-all-notifications',
	isAuthenticated,
	authorizeRoles('admin'),
	getNotifications
);

notificationRoute.put(
	'/update-notification/:id',
	isAuthenticated,
	authorizeRoles('admin'),
	updateNotificationStatus
);

export default notificationRoute;
