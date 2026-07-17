import type {
  LeaveStatus,
  LeaveType,
} from "./dashboard.types";

export type HolidayType =
  | "GOVERNMENT"
  | "FESTIVAL"
  | "COMPANY"
  | "OPTIONAL";

export interface CalendarLeave {
  id: number;
  leave_type: LeaveType;
  reason: string;
  start_date: string;
  end_date: string;
  days: number;
  status: LeaveStatus;
  is_half_day: boolean;
  is_emergency: boolean;
}

export interface CalendarHoliday {
  id: number;
  holiday_name: string;
  holiday_date: string;
  holiday_type: HolidayType;
  description: string | null;
}

export interface CalendarData {
  month: number;
  year: number;
  leaves: CalendarLeave[];
  holidays: CalendarHoliday[];
  weekends: string[];
}

export interface CalendarResponse {
  success: boolean;
  message: string;
  data: CalendarData;
}

export interface CalendarDay {
  date: Date;
  dateKey: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  leaves: CalendarLeave[];
  holidays: CalendarHoliday[];
}