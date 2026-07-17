import { Request, Response } from "express";
import {
  getMyNotifications,
  markNotificationAsRead,
} from "../services/notification.service";

export const getMyNotificationList = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const notifications = await getMyNotifications(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      data: notifications,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return res.status(500).json({
      success: false,
      message,
    });
  }
};

export const markNotificationRead = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const notificationId = Number(req.params.id);

    if (!notificationId) {
      return res.status(400).json({
        success: false,
        message: "Valid notification ID is required",
      });
    }

    const notification = await markNotificationAsRead(
      notificationId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Notification marked as read successfully",
      data: notification,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};