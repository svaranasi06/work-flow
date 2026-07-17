import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import type {
  CalendarData,
  CalendarDay,
} from "../types/calendar.types";

export const formatDateKey = (
  date: Date
): string => {
  return format(date, "yyyy-MM-dd");
};

export const buildCalendarDays = (
  visibleMonth: Date,
  calendarData: CalendarData
): CalendarDay[] => {
  const monthStart =
    startOfMonth(visibleMonth);

  const monthEnd =
    endOfMonth(visibleMonth);

  const calendarStart =
    startOfWeek(monthStart, {
      weekStartsOn: 0,
    });

  const calendarEnd =
    endOfWeek(monthEnd, {
      weekStartsOn: 0,
    });

  const weekendDateSet =
    new Set<string>(
      calendarData.weekends
    );

  const holidayDateSet =
    new Set<string>(
      calendarData.holidays.map(
        (holiday) =>
          holiday.holiday_date
      )
    );

  const visibleDates =
    eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd,
    });

  return visibleDates.map((date) => {
    const dateKey =
      formatDateKey(date);

    const isWeekend =
      weekendDateSet.has(dateKey);

    const isHoliday =
      holidayDateSet.has(dateKey);

    const matchingLeaves =
      calendarData.leaves.filter(
        (leave) => {
          const isWithinLeaveRange =
            leave.start_date <=
              dateKey &&
            leave.end_date >=
              dateKey;

          const isWorkingDate =
            !isWeekend &&
            !isHoliday;

          return (
            isWithinLeaveRange &&
            isWorkingDate
          );
        }
      );

    const matchingHolidays =
      calendarData.holidays.filter(
        (holiday) => {
          return (
            holiday.holiday_date ===
            dateKey
          );
        }
      );

    return {
      date,
      dateKey,
      dayNumber: date.getDate(),

      isCurrentMonth:
        isSameMonth(
          date,
          visibleMonth
        ),

      isToday:
        isToday(date),

      isWeekend,

      leaves:
        matchingLeaves,

      holidays:
        matchingHolidays,
    };
  });
};