import type {
  LeaveStatus,
  LeaveType,
} from "./dashboard.types";

export type NotificationType =
  | "LEAVE_APPLIED"
  | "LEAVE_APPROVED"
  | "LEAVE_REJECTED"
  | "HR_INFO";

export interface NotificationUser {
  id: number;
  name: string;
  emp_id: string;
  role: string;
}

export interface NotificationLeaveRequest {
  id: number;
  employee_id: number;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  days: number;
  status: LeaveStatus;
}

export interface NotificationItem {
  id: number;
  receiver_id: number;
  sender_id: number | null;
  leave_request_id: number | null;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender?: NotificationUser | null;
  leaveRequest?: NotificationLeaveRequest | null;
}

export interface NotificationsResponse {
  success: boolean;
  message: string;
  data: NotificationItem[];
}

export interface MarkNotificationReadResponse {
  success: boolean;
  message: string;
  data: NotificationItem;
}