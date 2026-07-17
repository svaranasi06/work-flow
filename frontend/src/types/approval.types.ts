import type {
  LeaveRequest,
} from "./leave.types";

import type {
  LeaveBalance,
} from "./auth.types";

export interface ApprovalDepartment {
  id: number;
  name: string;
}

export interface ApprovalEmployee {
  id: number;
  name: string;
  emp_id: string;
  email: string;
  role: string;
  department: ApprovalDepartment | null;
  leaveBalance: LeaveBalance | null;
}

export interface ManagerPendingLeave
  extends LeaveRequest {
  employee: ApprovalEmployee;
}

export interface ManagerPendingLeavesResponse {
  success: boolean;
  message: string;
  data: ManagerPendingLeave[];
}

export interface ManagerActionInput {
  manager_remarks?: string;
}

export interface ManagerActionResponse {
  success: boolean;
  message: string;
  data: LeaveRequest;
}

export type ApprovalAction =
  | "APPROVE"
  | "REJECT";

export interface HrPendingLeave
  extends LeaveRequest {
  employee: ApprovalEmployee;
}

export interface HrPendingLeavesResponse {
  success: boolean;
  message: string;
  data: HrPendingLeave[];
}

export interface HrActionInput {
  hr_remarks?: string;
}

export interface HrActionResponse {
  success: boolean;
  message: string;
  data: LeaveRequest;
}