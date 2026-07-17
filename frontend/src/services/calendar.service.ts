import api from "./api.service";

import type {
  CalendarResponse,
} from "../types/calendar.types";

export const getMonthlyCalendar = async(
  month: number,
  year: number
): Promise<CalendarResponse> => {
  const response =
    await api.get<CalendarResponse>(
      "/calendar/monthly",
      {
        params: {
          month,
          year,
        },
      }
    );

  return response.data;
};