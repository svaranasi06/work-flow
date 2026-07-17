import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  RefreshCw,
  Umbrella,
} from "lucide-react";

import {
  addMonths,
  format,
  startOfMonth,
  subMonths,
} from "date-fns";

import { useNavigate } from "react-router-dom";

import { getMonthlyCalendar } from "../services/calendar.service";

import {
  buildCalendarDays,
  formatDateKey,
} from "../utils/calendar.util";

import type {
  ApiErrorResponse,
} from "../types/auth.types";

import type {
  CalendarData,
  CalendarDay,
} from "../types/calendar.types";

import "../styles/calendar.css";

const weekDayLabels = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
];

const CalendarPage = () => {
  const navigate = useNavigate();

  const [visibleMonth, setVisibleMonth] =
    useState(() => startOfMonth(new Date()));

  const [calendarData, setCalendarData] =
    useState<CalendarData | null>(null);

  const [selectedDateKey, setSelectedDateKey] =
    useState(() => formatDateKey(new Date()));

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const loadCalendarData =
    useCallback(async (): Promise<void> => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const month =
          visibleMonth.getMonth() + 1;  //java script months are zero based so we added +1

        const year =
          visibleMonth.getFullYear();

        const response =
          await getMonthlyCalendar(
            month,
            year
          );

        setCalendarData(response.data);
      } catch (error) {
        if (
          axios.isAxiosError<ApiErrorResponse>(
            error
          )
        ) {
          setErrorMessage(
            error.response?.data.message ??
              "Unable to load calendar information."
          );
        } else {
          setErrorMessage(
            "An unexpected error occurred while loading the calendar."
          );
        }
      } finally {
        setIsLoading(false);
      }
    }, [visibleMonth]);

  useEffect(() => {
    void loadCalendarData();
  }, [loadCalendarData]);

  const calendarDays = useMemo<
    CalendarDay[]
  >(() => {
    if (!calendarData) {
      return [];
    }

    return buildCalendarDays(
      visibleMonth,
      calendarData
    );
  }, [visibleMonth, calendarData]);

  const selectedDay = useMemo(() => {
    return (
      calendarDays.find(
        (day) =>
          day.dateKey === selectedDateKey
      ) ?? null
    );
  }, [calendarDays, selectedDateKey]);

  const upcomingHolidays = useMemo(() => {
    if (!calendarData) {
      return [];
    }

    return [...calendarData.holidays].sort(
      (firstHoliday, secondHoliday) =>
        firstHoliday.holiday_date.localeCompare(
          secondHoliday.holiday_date
        )
    );
  }, [calendarData]);

  const handlePreviousMonth = () => {
    const previousMonth =
      subMonths(visibleMonth, 1); //goes to previous month 

    setVisibleMonth(previousMonth);

    setSelectedDateKey(
      formatDateKey(previousMonth)
    );
  };

  const handleNextMonth = () => {
    const nextMonth =
      addMonths(visibleMonth, 1);

    setVisibleMonth(nextMonth);

    setSelectedDateKey(
      formatDateKey(nextMonth)
    );
  };

  const handleToday = () => {
    const today = new Date();

    setVisibleMonth(startOfMonth(today));
    setSelectedDateKey(formatDateKey(today));
  };

  const handleDaySelection = (
    day: CalendarDay
  ) => {
    setSelectedDateKey(day.dateKey);

    if (!day.isCurrentMonth) {
      setVisibleMonth(
        startOfMonth(day.date)
      );
    }
  };

  const getDayClassName = (
    day: CalendarDay
  ): string => {
    const classNames = [
      "calendar-day",
    ];

    if (!day.isCurrentMonth) {
      classNames.push(
        "calendar-day-outside"
      );
    }

    if (day.isWeekend) {
      classNames.push(
        "calendar-day-weekend"
      );
    }

    if (day.isToday) {
      classNames.push(
        "calendar-day-today"
      );
    }

    if (
      day.dateKey === selectedDateKey
    ) {
      classNames.push(
        "calendar-day-selected"
      );
    }

    if (day.holidays.length > 0) {
      classNames.push(
        "calendar-day-holiday"
      );
    }

    return classNames.join(" ");
  };

  if (isLoading) {
    return (
      <section className="calendar-page-state">
        <div className="calendar-page-loader" />

        <h1>Loading calendar</h1>

        <p>
          Please wait while leave and holiday
          information is loaded.
        </p>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="calendar-page-state">
        <AlertCircle
          className="calendar-page-error-icon"
          size={42}
        />

        <h1>Unable to load calendar</h1>

        <p>{errorMessage}</p>

        <button
          type="button"
          onClick={() => {
            void loadCalendarData();
          }}
        >
          <RefreshCw size={17} />

          Try Again
        </button>
      </section>
    );
  }

  if (!calendarData) {
    return null;
  }

  return (
    <section className="calendar-page">
      <header className="calendar-page-header">
        <div>
          <p className="page-eyebrow">
            Leave Planning
          </p>

          <h1>Leave Calendar</h1>

          <p>
            Review personal leaves, company
            holidays, and weekends.
          </p>
        </div>

        <button
          type="button"
          className="calendar-apply-button"
          onClick={() => {
            navigate("/my-leaves");
          }}
        >
          <CalendarDays size={18} />

          Apply Leave
        </button>
      </header>

      <div className="calendar-layout">
        <section className="calendar-main-panel">
          <header className="calendar-toolbar">
            <div className="calendar-month-navigation">
              <button
                type="button"
                className="calendar-navigation-button"
                onClick={handlePreviousMonth}
                aria-label="View previous month"
              >
                <ChevronLeft size={20} />
              </button>

              <h2>
                {format(
                  visibleMonth,
                  "MMMM yyyy"
                )}
              </h2>

              <button
                type="button"
                className="calendar-navigation-button"
                onClick={handleNextMonth}
                aria-label="View next month"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="calendar-toolbar-actions">
              <button
                type="button"
                className="calendar-today-button"
                onClick={handleToday}
              >
                Today
              </button>

              <button
                type="button"
                className="calendar-refresh-button"
                onClick={() => {
                  void loadCalendarData();
                }}
                aria-label="Refresh calendar"
              >
                <RefreshCw size={17} />
              </button>
            </div>
          </header>

          <div className="calendar-week-header">
            {weekDayLabels.map(
              (weekDay) => (
                <div key={weekDay}>
                  {weekDay}
                </div>
              )
            )}
          </div>

          <div className="calendar-grid">
            {calendarDays.map((day) => (
              <button
                key={day.dateKey}
                type="button"
                className={getDayClassName(
                  day
                )}
                onClick={() => {
                  handleDaySelection(day);
                }}
              >
                <div className="calendar-day-header">
                  <span>
                    {day.dayNumber}
                  </span>

                  {day.isToday && (
                    <small>Today</small>
                  )}
                </div>

                <div className="calendar-day-events">
                  {day.holidays
                    .slice(0, 1)
                    .map((holiday) => (
                      <span
                        key={holiday.id}
                        className="calendar-event calendar-event-holiday"
                      >
                        {holiday.holiday_name}
                      </span>
                    ))}

                  {day.leaves
                    .slice(0, 2)
                    .map((leave) => (
                      <span
                        key={leave.id}
                        className={
                          leave.status ===
                          "APPROVED"
                            ? "calendar-event calendar-event-approved"
                            : "calendar-event calendar-event-pending"
                        }
                      >
                        {leave.is_half_day
                          ? "Half Day"
                          : leave.leave_type.replace(
                              "_",
                              " "
                            )}
                      </span>
                    ))}

                  {day.leaves.length > 2 && (
                    <span className="calendar-event-more">
                      +
                      {day.leaves.length - 2}{" "}
                      more
                    </span>
                  )}

                  {day.isWeekend &&
                    day.leaves.length === 0 &&
                    day.holidays.length === 0 && (
                      <span className="calendar-weekend-label">
                        Weekend
                      </span>
                    )}
                </div>
              </button>
            ))}
          </div>

          <footer className="calendar-legend">
            <div>
              <span className="calendar-legend-dot calendar-legend-approved" />

              Approved Leave
            </div>

            <div>
              <span className="calendar-legend-dot calendar-legend-pending" />

              Pending Leave
            </div>

            <div>
              <span className="calendar-legend-dot calendar-legend-holiday" />

              Holiday
            </div>

            <div>
              <span className="calendar-legend-dot calendar-legend-weekend" />

              Weekend
            </div>
          </footer>
        </section>

        <aside className="calendar-side-panel">
          <section className="calendar-details-card">
            <div className="calendar-side-heading">
              <div>
                <p className="page-eyebrow">
                  Selected Date
                </p>

                <h2>
                  {selectedDay
                    ? format(
                        selectedDay.date,
                        "dd MMMM yyyy"
                      )
                    : "Select a date"}
                </h2>
              </div>
            </div>

            {!selectedDay ? (
              <div className="calendar-side-empty">
                <CalendarDays size={33} />

                <p>
                  Select a date to review leave and
                  holiday information.
                </p>
              </div>
            ) : selectedDay.leaves.length === 0 &&
              selectedDay.holidays.length ===
                0 ? (
              <div className="calendar-side-empty">
                <CircleCheck size={33} />

                <strong>
                  No leave or holiday
                </strong>

                <p>
                  No active leave or company holiday
                  exists on this date.
                </p>
              </div>
            ) : (
              <div className="calendar-selected-events">
                {selectedDay.holidays.map(
                  (holiday) => (
                    <article
                      key={holiday.id}
                      className="selected-event-card selected-event-holiday"
                    >
                      <CalendarDays size={19} />

                      <div>
                        <strong>
                          {holiday.holiday_name}
                        </strong>

                        <span>
                          {holiday.holiday_type}
                        </span>

                        {holiday.description && (
                          <p>
                            {holiday.description}
                          </p>
                        )}
                      </div>
                    </article>
                  )
                )}

                {selectedDay.leaves.map(
                  (leave) => (
                    <article
                      key={leave.id}
                      className={
                        leave.status ===
                        "APPROVED"
                          ? "selected-event-card selected-event-approved"
                          : "selected-event-card selected-event-pending"
                      }
                    >
                      {leave.status ===
                      "APPROVED" ? (
                        <Umbrella size={19} />
                      ) : (
                        <Clock3 size={19} />
                      )}

                      <div>
                        <strong>
                          {leave.leave_type.replace(
                            "_",
                            " "
                          )}
                        </strong>

                        <span>
                          {leave.status}
                          {leave.is_half_day
                            ? " · Half Day"
                            : ""}
                          {leave.is_emergency
                            ? " · Emergency"
                            : ""}
                        </span>

                        <p>{leave.reason}</p>
                      </div>
                    </article>
                  )
                )}
              </div>
            )}
          </section>

          <section className="calendar-holidays-card">
            <div className="calendar-side-heading">
              <div>
                <p className="page-eyebrow">
                  Holidays
                </p>

                <h2>
                  {format(
                    visibleMonth,
                    "MMMM yyyy"
                  )}
                </h2>
              </div>
            </div>

            {upcomingHolidays.length === 0 ? (
              <div className="calendar-side-empty">
                <CalendarDays size={32} />

                <p>
                  No company holidays are configured
                  for this month.
                </p>
              </div>
            ) : (
              <div className="calendar-holiday-list">
                {upcomingHolidays.map(
                  (holiday) => (
                    <button
                      key={holiday.id}
                      type="button"
                      onClick={() => {
                        setSelectedDateKey(
                          holiday.holiday_date
                        );
                      }}
                    >
                      <div className="calendar-holiday-date">
                        <strong>
                          {format(
                            new Date(
                              `${holiday.holiday_date}T00:00:00`
                            ),
                            "dd"
                          )}
                        </strong>

                        <span>
                          {format(
                            new Date(
                              `${holiday.holiday_date}T00:00:00`
                            ),
                            "MMM"
                          )}
                        </span>
                      </div>

                      <div>
                        <strong>
                          {holiday.holiday_name}
                        </strong>

                        <span>
                          {holiday.holiday_type}
                        </span>
                      </div>
                    </button>
                  )
                )}
              </div>
            )}
          </section>
        </aside>
      </div>
    </section>
  );
};

export default CalendarPage;