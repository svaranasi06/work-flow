import type {
  LeaveBalance,
  UserRole,
} from "./auth.types";

export interface ProfileDepartment {
  id: number;
  name: string;
  description: string | null;
}

export interface ProfileManager {
  id: number;
  name: string;
  emp_id: string;
  email: string;
  role: UserRole;
}

export interface ProfileData {
  id: number;
  name: string;
  emp_id: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  department: ProfileDepartment | null;
  manager: ProfileManager | null;
  leaveBalance: LeaveBalance | null;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: ProfileData;
}