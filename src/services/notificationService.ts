import Notification from '../models/Notification';

interface NotificationFilter {
  unreadOnly: boolean;
  type?: string;
  page: number;
  limit: number;
}

const getUserNotifications = async (userId: string, filter: NotificationFilter) => {
  const query: any = { recipient: userId };
  if (filter.unreadOnly) query.read = false;
  if (filter.type) query.type = filter.type;

  const total = await Notification.countDocuments(query);
  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .skip((filter.page - 1) * filter.limit)
    .limit(filter.limit)
    .populate('task', 'title')
    .populate('board', 'title');

  return { notifications, total, page: filter.page, limit: filter.limit, totalPages: Math.ceil(total / filter.limit) };
};

const markAsRead = async (notificationId: string, userId: string) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { read: true },
    { new: true }
  );
  return notification;
};

const markAllAsRead = async (userId: string) => {
  await Notification.updateMany({ recipient: userId, read: false }, { read: true });
  return true;
};

const getUnreadCount = async (userId: string) => {
  return Notification.countDocuments({ recipient: userId, read: false });
};

export default {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
};

// update 2026-04-14 12:16:58

// update 2026-05-08 12:47:24
