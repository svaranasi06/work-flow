export type HolidayType =
  | "GOVERNMENT"
  | "FESTIVAL"
  | "COMPANY"
  | "OPTIONAL";

export interface HolidayItem {
  id: number;
  holiday_name: string;
  holiday_date: string;
  holiday_type: HolidayType;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HolidayListData
{
  year: number;
  holidays: HolidayItem[];
}

export interface HolidayListResponse 
{
  success: boolean;
  message: string;
  data: HolidayListData;
}

export interface CreateHolidayInput
{
  holiday_name: string;
  holiday_date: string;
  holiday_type: HolidayType;
  description?: string | null;
}

export interface CreateHolidayResponse 
{
  success: boolean;
  message: string;
  data: HolidayItem;
}