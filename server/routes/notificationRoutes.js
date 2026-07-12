import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as notificationController from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', requireAuth, notificationController.getUserNotifications);
router.get('/unread/count', requireAuth, notificationController.getUnreadCount);
router.put('/:id/read', requireAuth, notificationController.markAsRead);
router.put('/read-all', requireAuth, notificationController.markAllAsRead);
router.delete('/:id', requireAuth, notificationController.deleteNotification);

export default router;
