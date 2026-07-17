import db from "../models";
import { NotificationType } from "../models/notification.model";

interface CreateNotificationInput {
  receiver_id: number;
  sender_id?: number | null;
  leave_request_id?: number | null;
  title: string;
  message: string;
  type: NotificationType;
}

export const createNotification = async (
  notificationData: CreateNotificationInput
) => {
  const notification = await db.Notification.create({
    receiver_id: notificationData.receiver_id,
    sender_id: notificationData.sender_id || null,
    leave_request_id: notificationData.leave_request_id || null,
    title: notificationData.title,
    message: notificationData.message,
    type: notificationData.type,
    is_read: false,
  });

  return notification;
};

export const getMyNotifications = async (userId: number) => {
  const notifications = await db.Notification.findAll({
    where: {
      receiver_id: userId,
    },
    include: [
      {
        model: db.User,
        as: "sender",
        attributes: ["id", "name", "emp_id", "role"],
      },
      {
        model: db.LeaveRequest,
        as: "leaveRequest",
      },
    ],
    order: [["created_at", "DESC"]],
  });

  return notifications;
};

export const markNotificationAsRead = async (
  notificationId: number,
  userId: number
) => {
  const notification = await db.Notification.findOne({
    where: {
      id: notificationId,
      receiver_id: userId,
    },
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  notification.is_read = true;

  await notification.save();

  return notification;
};