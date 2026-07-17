export type UserRole =
  | "ASSOCIATE"
  | "MANAGER"
  | "HR"
  | "ADMIN";

export interface Department
{
id: number;
name: string;
}

export interface LeaveBalance
{
annual_leave_balance: number;
paternity_leave_balance: number;
bereavement_leave_balance: number;
compoff_leave_balance: number;
}

export interface AuthUser
{
id: number;
name: string;
emp_id: string;
email: string;
role: UserRole;
department: Department | null;
leaveBalance: LeaveBalance | null;
}

export interface LoginCredentials
{
emp_id: string;
password: string;
}

export interface AuthResponseData
{
accessToken: string;
user: AuthUser;
}

export interface LoginResponse
{
  success: boolean;
  message: string;
  data: AuthResponseData;
}

export interface RefreshTokenResponse
{
  success: boolean;
  message: string;
  data: AuthResponseData;
}

export interface LogoutResponse
{
  success: boolean;
  message: string;
}

export interface ValidationError 
{
  field: string;
  message: string;
}

export interface ApiErrorResponse 
{
success: false;
message: string;
errors?: ValidationError[];
}