import type {
  AuthUser,
  LeaveBalance,
} from "./auth.types";

export type LeaveType =
  | "ANNUAL"
  | "PATERNITY"
  | "BEREAVEMENT"
  | "COMPOFF";

export type LeaveStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export type ApprovalStage =
  | "MANAGER_REVIEW"
  | "HR_REVIEW"
  | "ADMIN_REVIEW"
  | "COMPLETED";

export interface DashboardUser
  extends Omit<AuthUser, "leaveBalance"> {}

export interface UpcomingHoliday {
  id: number;
  holiday_name: string;
  holiday_date: string;
  holiday_type:
    | "GOVERNMENT"
    | "FESTIVAL"
    | "COMPANY"
    | "OPTIONAL";
  description: string | null;
}

export interface RecentLeaveApplication {
  id: number;
  leave_type: LeaveType;
  reason: string;
  start_date: string;
  end_date: string;
  days: number;
  status: LeaveStatus;
  approval_stage: ApprovalStage;
  created_at: string;
}

export interface DashboardData {
  user: DashboardUser;
  leave_balance: LeaveBalance | null;
  pending_count: number;
  attendance_percentage?: number;
  upcoming_holidays: UpcomingHoliday[];
  recent_leave_applications: RecentLeaveApplication[];
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}