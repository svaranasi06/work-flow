import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  AlertCircle,
  Bell,
  BellRing,
  CheckCircle2,
  Clock3,
  Inbox,
  XCircle,
} from "lucide-react";

import {
  getMyNotifications,
  markNotificationAsRead,
} from "../services/notification.service";

import type {
  ApiErrorResponse,
} from "../types/auth.types";

import type {
  NotificationItem,
  NotificationType,
} from "../types/notification.types";

import "../styles/notifications.css";

const getNotificationIcon = (
  type: NotificationType
) => {
  switch (type) {
    case "LEAVE_APPROVED":
      return CheckCircle2;

    case "LEAVE_REJECTED":
      return XCircle;

    case "LEAVE_APPLIED":
      return Clock3;

    case "HR_INFO":
    default:
      return Bell;
  }
};

const getNotificationTypeClass = (
  type: NotificationType
): string => {
  return type
    .toLowerCase()
    .replaceAll("_", "-");
};

const formatNotificationDate = (
  createdAt: string
): string => {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(createdAt));
};

const NotificationsPage = () => {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [
    notificationBeingUpdated,
    setNotificationBeingUpdated,
  ] = useState<number | null>(null);

  const loadNotifications =
    useCallback(async (): Promise<void> => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response =
          await getMyNotifications();

        setNotifications(response.data);
      } catch (error) {
        if (
          axios.isAxiosError<ApiErrorResponse>(
            error
          )
        ) {
          setErrorMessage(
            error.response?.data.message ??
              "Unable to load notifications."
          );
        } else {
          setErrorMessage(
            "An unexpected error occurred while loading notifications."
          );
        }
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter(
      (notification) =>
        !notification.is_read
    ).length;
  }, [notifications]);

  const handleMarkAsRead = async (
    notificationId: number
  ): Promise<void> => {
    try {
      setNotificationBeingUpdated(
        notificationId
      );

      setErrorMessage("");

      const response =
        await markNotificationAsRead(
          notificationId
        );

      setNotifications(
        (currentNotifications) =>
          currentNotifications.map(
            (notification) =>
              notification.id ===
              notificationId
                ? response.data
                : notification
          )
      );
    } catch (error) {
      if (
        axios.isAxiosError<ApiErrorResponse>(
          error
        )
      ) {
        setErrorMessage(
          error.response?.data.message ??
            "Unable to mark the notification as read."
        );
      } else {
        setErrorMessage(
          "An unexpected error occurred while updating the notification."
        );
      }
    } finally {
      setNotificationBeingUpdated(null);
    }
  };

  if (isLoading) {
    return (
      <section className="notifications-state">
        <div className="notifications-loader" />

        <h1>Loading notifications</h1>

        <p>
          Please wait while your latest workflow
          notifications are loaded.
        </p>
      </section>
    );
  }

  if (
    errorMessage &&
    notifications.length === 0
  ) {
    return (
      <section className="notifications-state">
        <AlertCircle
          className="notifications-error-icon"
          size={42}
        />

        <h1>Unable to load notifications</h1>

        <p>{errorMessage}</p>

        
      </section>
    );
  }

  return (
    <section className="notifications-page">
      <header className="notifications-header">
        <div>
          <p className="page-eyebrow">
            Workflow Updates
          </p>

          <h1>Notifications</h1>

          <p>
            Review leave workflow updates and mark
            unread notifications as read.
          </p>
        </div>
      </header>

      <article className="notifications-summary-card">
        <div className="notifications-summary-icon">
          <BellRing size={25} />
        </div>

        <div>
          <span>Unread Notifications</span>

          <strong>{unreadCount}</strong>

          <p>
            Notifications that still require your
            attention.
          </p>
        </div>
      </article>

      {errorMessage && (
        <div
          className="notifications-inline-error"
          role="alert"
        >
          <AlertCircle size={18} />

          <span>{errorMessage}</span>
        </div>
      )}

      {notifications.length === 0 ? (
        <section className="notifications-empty">
          <Inbox size={46} />

          <strong>
            No notifications available
          </strong>

          <p>
            Leave workflow notifications sent to
            your account will appear here.
          </p>
        </section>
      ) : (
        <section className="notifications-list">
          {notifications.map(
            (notification) => {
              const Icon =
                getNotificationIcon(
                  notification.type
                );

              const typeClass =
                getNotificationTypeClass(
                  notification.type
                );

              const isUpdating =
                notificationBeingUpdated ===
                notification.id;

              return (
                <article
                  key={notification.id}
                  className={
                    notification.is_read
                      ? `notification-card notification-card-${typeClass}`
                      : `notification-card notification-card-${typeClass} notification-card-unread`
                  }
                >
                  <div
                    className={`notification-icon notification-icon-${typeClass}`}
                  >
                    <Icon size={21} />
                  </div>

                  <div className="notification-content">
                    <div className="notification-title-row">
                      <div>
                        <h2>
                          {notification.title}
                        </h2>

                        {!notification.is_read && (
                          <span className="notification-unread-badge">
                            Unread
                          </span>
                        )}
                      </div>

                      <time
                        dateTime={
                          notification.created_at
                        }
                      >
                        {formatNotificationDate(
                          notification.created_at
                        )}
                      </time>
                    </div>

                    <p className="notification-message">
                      {notification.message}
                    </p>

                    <div className="notification-meta">
                      <span>
                        From:{" "}
                        <strong>
                          {notification.sender
                            ?.name ?? "System"}
                        </strong>
                      </span>

                      <span>
                        Type:{" "}
                        {notification.type.replaceAll(
                          "_",
                          " "
                        )}
                      </span>
                    </div>

                    {notification.leaveRequest && (
                      <div className="notification-leave-summary">
                        <div>
                          <span>Request</span>

                          <strong>
                            #
                            {
                              notification
                                .leaveRequest.id
                            }
                          </strong>
                        </div>

                        <div>
                          <span>Leave Type</span>

                          <strong>
                            {notification.leaveRequest.leave_type.replaceAll(
                              "_",
                              " "
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>Dates</span>

                          <strong>
                            {
                              notification
                                .leaveRequest
                                .start_date
                            }
                            {" - "}
                            {
                              notification
                                .leaveRequest
                                .end_date
                            }
                          </strong>
                        </div>

                        <div>
                          <span>Status</span>

                          <strong>
                            {
                              notification
                                .leaveRequest.status
                            }
                          </strong>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="notification-actions">
                    {!notification.is_read ? (
                      <button
                        type="button"
                        className="notification-read-button"
                        onClick={() => {
                          void handleMarkAsRead(
                            notification.id
                          );
                        }}
                        disabled={isUpdating}
                      >
                        <CheckCircle2 size={16} />

                        {isUpdating
                          ? "Updating..."
                          : "Mark as Read"}
                      </button>
                    ) : (
                      <span className="notification-read-label">
                        <CheckCircle2 size={15} />

                        Read
                      </span>
                    )}
                  </div>
                </article>
              );
            }
          )}
        </section>
      )}
    </section>
  );
};

export default NotificationsPage;