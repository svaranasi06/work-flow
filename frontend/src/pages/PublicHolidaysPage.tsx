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
  CalendarPlus,
} from "lucide-react";

import AddHolidayModal from "../components/AddHolidayModal";

import { useAuth } from "../context/AuthContext";

import {
  getHolidaysByYear,
} from "../services/holiday.service";

import type {
  ApiErrorResponse,
} from "../types/auth.types";

import type {
  HolidayItem,
  HolidayType,
} from "../types/holiday.types";

import "../styles/public-holidays.css";

const currentYear = new Date().getFullYear();

const formatHolidayDate = (
  holidayDate: string
): string => {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
  }).format(
    new Date(`${holidayDate}T00:00:00`)
  );
};

const getHolidayTypeLabel = (
  holidayType: HolidayType
): string => {
  switch (holidayType) {
    case "GOVERNMENT":
      return "Government";

    case "FESTIVAL":
      return "Festival";

    case "COMPANY":
      return "Company";

    case "OPTIONAL":
      return "Optional";

    default:
      return holidayType;
  }
};

const PublicHolidaysPage = () => {
  const { user } = useAuth();

  const [selectedYear, setSelectedYear] =
    useState(currentYear);

  const [holidays, setHolidays] =
    useState<HolidayItem[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [
    isAddHolidayModalOpen,
    setIsAddHolidayModalOpen,
  ] = useState(false);

  const availableYears = useMemo(
    () => [
      currentYear - 1,
      currentYear,
      currentYear + 1,
    ],
    []
  );

  const canCreateHoliday =
    user?.role === "HR";

  const loadHolidays =
    useCallback(async (): Promise<void> => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response =
          await getHolidaysByYear(
            selectedYear
          );

        setHolidays(
          response.data.holidays
        );
      } catch (error) {
        if (
          axios.isAxiosError<ApiErrorResponse>(
            error
          )
        ) {
          setErrorMessage(
            error.response?.data.message ??
              "Unable to load public holidays."
          );
        } else {
          setErrorMessage(
            "An unexpected error occurred while loading public holidays."
          );
        }
      } finally {
        setIsLoading(false);
      }
    }, [selectedYear]);

  useEffect(() => {
    void loadHolidays();
  }, [loadHolidays]);

  if (isLoading) {
    return (
      <section className="public-holidays-state">
        <div className="public-holidays-loader" />

        <h1>Loading public holidays</h1>

        <p>
          Please wait while organization holidays
          are loaded.
        </p>
      </section>
    );
  }

  if (
    errorMessage &&
    holidays.length === 0
  ) {
    return (
      <section className="public-holidays-state">
        <AlertCircle
          className="public-holidays-error-icon"
          size={42}
        />

        <h1>
          Unable to load public holidays
        </h1>

        <p>{errorMessage}</p>
      </section>
    );
  }

  return (
    <>
      <section className="public-holidays-page">
        <header className="public-holidays-header">
          <div>
            <p className="page-eyebrow">
              Organization Calendar
            </p>

            <h1>Public Holidays</h1>

            <p>
              Review organization-wide public
              holidays for the selected year.
            </p>
          </div>

          <div className="public-holidays-header-actions">
            <label htmlFor="holiday-year">
              Year
            </label>

            <select
              id="holiday-year"
              value={selectedYear}
              onChange={(event) => {
                setSelectedYear(
                  Number(event.target.value)
                );
              }}
            >
              {availableYears.map((year) => (
                <option
                  key={year}
                  value={year}
                >
                  {year}
                </option>
              ))}
            </select>
            {canCreateHoliday && (
              <button
                type="button"
                className="public-holidays-add-button"
                onClick={() => {
                  setIsAddHolidayModalOpen(
                    true
                  );
                }}
              >
                <CalendarPlus size={18} />

                Add Holiday
              </button>
            )}
          </div>
        </header>

        <article className="public-holidays-summary-card">
          <div className="public-holidays-summary-icon">
            <CalendarDays size={25} />
          </div>

          <div>
            <span>
              Holidays in {selectedYear}
            </span>

            <strong>
              {holidays.length}
            </strong>

            <p>
              Active organization holidays
              configured for the selected year.
            </p>
          </div>
        </article>

        {errorMessage && (
          <div
            className="public-holidays-inline-error"
            role="alert"
          >
            <AlertCircle size={18} />

            <span>{errorMessage}</span>
          </div>
        )}

        {holidays.length === 0 ? (
          <section className="public-holidays-empty">
            <CalendarDays size={46} />

            <strong>
              No public holidays found
            </strong>

            <p>
              No active organization holidays are
              configured for {selectedYear}.
            </p>

            {canCreateHoliday && (
              <button
                type="button"
                className="public-holidays-empty-add-button"
                onClick={() => {
                  setIsAddHolidayModalOpen(
                    true
                  );
                }}
              >
                <CalendarPlus size={17} />

                Add First Holiday
              </button>
            )}
          </section>
        ) : (
          <section className="public-holidays-list">
            {holidays.map((holiday) => (
              <article
                key={holiday.id}
                className="public-holiday-card"
              >
                <div className="public-holiday-date">
                  <strong>
                    {new Intl.DateTimeFormat(
                      "en-IN",
                      {
                        day: "2-digit",
                      }
                    ).format(
                      new Date(
                        `${holiday.holiday_date}T00:00:00`
                      )
                    )}
                  </strong>

                  <span>
                    {new Intl.DateTimeFormat(
                      "en-IN",
                      {
                        month: "short",
                      }
                    ).format(
                      new Date(
                        `${holiday.holiday_date}T00:00:00`
                      )
                    )}
                  </span>
                </div>

                <div className="public-holiday-content">
                  <div className="public-holiday-title-row">
                    <div>
                      <h2>
                        {holiday.holiday_name}
                      </h2>

                      <span
                        className={`public-holiday-type public-holiday-type-${holiday.holiday_type.toLowerCase()}`}
                      >
                        {getHolidayTypeLabel(
                          holiday.holiday_type
                        )}
                      </span>
                    </div>

                    <span className="public-holiday-active-status">
                      Active
                    </span>
                  </div>

                  <p className="public-holiday-full-date">
                    {formatHolidayDate(
                      holiday.holiday_date
                    )}
                  </p>

                  <p className="public-holiday-description">
                    {holiday.description ??
                      "No description provided."}
                  </p>
                </div>
              </article>
            ))}
          </section>
        )}

        <section className="public-holidays-information">
          <CalendarDays size={21} />

          <div>
            <strong>
              Calendar integration
            </strong>

            <p>
              Active holidays automatically
              appear in the Leave Calendar for all
              authenticated employees.
            </p>
          </div>
        </section>
      </section>

      {isAddHolidayModalOpen && (
        <AddHolidayModal
          selectedYear={selectedYear}
          onClose={() => {
            setIsAddHolidayModalOpen(
              false
            );
          }}
          onHolidayCreated={
            loadHolidays
          }
        />
      )}
    </>
  );
};

export default PublicHolidaysPage;