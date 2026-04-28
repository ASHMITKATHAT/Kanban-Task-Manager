import { Router } from 'express';
import { getNotifications, markAsRead, markAllAsRead, getUnreadCount } from '../controllers/notificationController';
import { authenticateToken, authorizeRoles } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validation';
import { notificationFilterSchema } from '../validators/notificationValidator';

const router = Router();

router.get('/', authenticateToken, authorizeRoles('Admin', 'User'), validateRequest(notificationFilterSchema, 'query'), getNotifications);
router.get('/unread-count', authenticateToken, authorizeRoles('Admin', 'User'), getUnreadCount);
router.put('/mark-all-read', authenticateToken, authorizeRoles('Admin', 'User'), markAllAsRead);
router.put('/:id/read', authenticateToken, authorizeRoles('Admin', 'User'), markAsRead);

export default router;

// update 2026-04-28 12:29:15
