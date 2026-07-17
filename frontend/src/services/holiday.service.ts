import api from "./api.service";

import type {
  CreateHolidayInput,
  CreateHolidayResponse,
  HolidayListResponse,
} from "../types/holiday.types";

export const getHolidaysByYear = async (
  year: number
): Promise<HolidayListResponse> => {
  const response =
    await api.get<HolidayListResponse>(
      "/holidays",
      {
        params: {
          year,
        },
      }
    );

  return response.data;
};

export const createHoliday = async (
  holidayData: CreateHolidayInput
): Promise<CreateHolidayResponse> => {
  const response =
    await api.post<CreateHolidayResponse>(
      "/holidays",
      holidayData
    );

  return response.data;
};