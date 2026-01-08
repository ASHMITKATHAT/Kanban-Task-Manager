import { Request, Response, NextFunction } from 'express';
import notificationService from '../services/notificationService';

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await notificationService.getUserNotifications(req.user!.userId, req.query as any);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user!.userId);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await notificationService.markAllAsRead(req.user!.userId);
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await notificationService.getUnreadCount(req.user!.userId);
    res.status(200).json({ count });
  } catch (error) {
    next(error);
  }
};
