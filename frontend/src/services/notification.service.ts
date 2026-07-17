import api from "./api.service";

import type {
  MarkNotificationReadResponse,
  NotificationsResponse,
} from "../types/notification.types";

export const getMyNotifications =
  async (): Promise<NotificationsResponse> => {
    const response =
      await api.get<NotificationsResponse>(
        "/notifications/my-notifications"
      );

    return response.data;
  };

export const markNotificationAsRead = async (
  notificationId: number
): Promise<MarkNotificationReadResponse> => {
  const response =
    await api.patch<MarkNotificationReadResponse>(
      `/notifications/${notificationId}/read`
    );

    return response.data;
  };