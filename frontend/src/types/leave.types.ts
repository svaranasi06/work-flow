import type {
  ApprovalStage,
  LeaveStatus,
  LeaveType,
} from "./dashboard.types";

export interface LeaveApprover {
  id: number;
  name: string;
  emp_id: string;
  role: string;
}

export interface LeaveRequest {
  id: number;
  employee_id: number;
  leave_type: LeaveType;
  reason: string;
  start_date: string;
  end_date: string;
  days: number;
  status: LeaveStatus;
  approval_stage: ApprovalStage;
  approver_id: number | null;
  approved_by: number | null;
  approved_by_role:
    | "MANAGER"
    | "HR"
    | "ADMIN"
    | null;
  manager_remarks: string | null;
  hr_remarks: string | null;
  supporting_document: string | null;
  is_half_day: boolean;
  is_emergency: boolean;
  action_at: string | null;
  created_at: string;
  updated_at: string;
  approver?: LeaveApprover | null;
  approvedByUser?: LeaveApprover | null;
}

export interface MyLeavesResponse {
  success: boolean;
  message: string;
  data: LeaveRequest[];
}

export interface LeaveSummaryItem {
  leave_type: LeaveType;
  display_name: string;
  available: number;
  pending: number;
  used: number;
  lapsed: number;
}

export interface LeaveSummaryData {
  year: number;
  summary: LeaveSummaryItem[];
}

export interface LeaveSummaryResponse {
  success: boolean;
  message: string;
  data: LeaveSummaryData;
}

export interface ApplyLeaveInput {
  leave_type: LeaveType;
  reason: string;
  start_date: string;
  end_date: string;
  is_half_day: boolean;
  is_emergency: boolean;
}

export interface ApplyLeaveResponse {
  success: boolean;
  message: string;
  data: LeaveRequest;
}

export interface CancelLeaveResponse {
  success: boolean;
  message: string;
  data: LeaveRequest;
}