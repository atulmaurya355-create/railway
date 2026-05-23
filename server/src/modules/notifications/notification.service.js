import { Notification } from './notification.model.js';
import { ApiError } from '../../utils/apiError.js';
import { LeaderboardStats } from '../leaderboard/leaderboardStats.model.js';

export async function createNotification(userId, data) {
  return await Notification.create({
    user: userId,
    title: data.title,
    message: data.message,
    type: data.type,
    metadata: data.metadata || {},
  });
}

export async function getUserNotifications(userId, filters = {}) {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const query = { user: userId };
  if (filters.status) query.status = filters.status;
  if (filters.type) query.type = filters.type;

  const [notifications, total] = await Promise.all([
    Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments(query),
  ]);

  // Compute unread count for total convenience in navigation badge headers
  const unreadCount = await Notification.countDocuments({ user: userId, status: 'unread' });

  return {
    notifications,
    unreadCount,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function markAsRead(notificationId, userId) {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { status: 'read' },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  return notification;
}

export async function markAllAsRead(userId) {
  await Notification.updateMany(
    { user: userId, status: 'unread' },
    { status: 'read' }
  );
  return { message: 'All notifications marked as read' };
}

export async function deleteNotification(notificationId, userId) {
  const result = await Notification.deleteOne({ _id: notificationId, user: userId });
  if (result.deletedCount === 0) {
    throw new ApiError(404, 'Notification not found');
  }
  return { message: 'Notification deleted successfully' };
}

export async function checkAndTriggerDailyReminder(userId) {
  const stats = await LeaderboardStats.findOne({ userId });
  if (!stats || !stats.currentStreak || stats.currentStreak === 0) {
    return;
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (stats.lastActivityDate && stats.lastActivityDate >= startOfToday) {
    return;
  }

  const existingReminder = await Notification.findOne({
    user: userId,
    type: 'dailyReminder',
    createdAt: { $gte: startOfToday }
  });

  if (!existingReminder) {
    await createNotification(userId, {
      title: 'Keep your streak burning! 🔥',
      message: `You have an active ${stats.currentStreak}-day study streak! Complete a mock test or quiz today to keep it alive.`,
      type: 'dailyReminder',
      metadata: { currentStreak: stats.currentStreak }
    });
  }
}
