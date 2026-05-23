import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from './notification.service.js';

export const getUserNotificationsHandler = asyncHandler(async (req, res) => {
  const data = await getUserNotifications(req.user.id, req.query);

  res.status(200).json({
    success: true,
    data,
  });
});

export const markAsReadHandler = asyncHandler(async (req, res) => {
  const notification = await markAsRead(req.params.notificationId, req.user.id);

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    data: { notification },
  });
});

export const markAllAsReadHandler = asyncHandler(async (req, res) => {
  const result = await markAllAsRead(req.user.id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const deleteNotificationHandler = asyncHandler(async (req, res) => {
  const result = await deleteNotification(req.params.notificationId, req.user.id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});
