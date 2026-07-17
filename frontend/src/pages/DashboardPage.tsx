import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { format, parseISO } from "date-fns";

import {
  AlertCircle,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Umbrella,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { getDashboardData } from "../services/dashboard.service";

import type {
  DashboardData,
  LeaveStatus,
} from "../types/dashboard.types";

import type {
  ApiErrorResponse,
  UserRole,
} from "../types/auth.types";

import "../styles/dashboard.css";

interface LeaveBalanceCard {
  label: string;
  value: number;
  description: string;
  icon: typeof Umbrella;
  styleName: string;
}

const getPendingLabel = (role?: UserRole): string => {
  if (role === "MANAGER") {
    return "Pending Approvals";
  }

  if (role === "HR") {
    return "Pending HR Reviews";
  }

  return "Pending Requests";
};

//css helper function
const getStatusClassName = (
  status: LeaveStatus
): string => {
  return `leave-status leave-status-${status.toLowerCase()}`;
};
//date formating helper function
const formatDate = (date: string): string => {
  return format(parseISO(date), "dd MMM yyyy");
};

const DashboardPage = () => {
  const { user } = useAuth();

  const [dashboardData, setDashboardData] =
    useState<DashboardData | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");


    //use call back is used load dashboard is used by load dashboard refresh and then try again
    //stable function reference 

    //useCallback prevents React from creating a new loadDashboard function during every render. This makes it safe to use the function as a useEffect dependency.
  const loadDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await getDashboardData();

      setDashboardData(response.data);
    } catch (error) {
      if (
        axios.isAxiosError<ApiErrorResponse>(error)
      ) {
        setErrorMessage(
          error.response?.data.message ??
            "Unable to load dashboard data."
        );
      } else {
        setErrorMessage(
          "An unexpected error occurred while loading the dashboard."
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  if (isLoading) {
    return (
      <section className="dashboard-state-card">
        <div className="dashboard-loader" />

        <h1>Loading dashboard</h1>

        <p>
          Please wait while the latest leave
          information is loaded.
        </p>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="dashboard-state-card">
        <AlertCircle
          className="dashboard-error-icon"
          size={42}
        />

        <h1>Unable to load dashboard</h1>

        <p>{errorMessage}</p>

       
      </section>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const leaveBalance = dashboardData.leave_balance;

  const leaveBalanceCards: LeaveBalanceCard[] = [
    {
      label: "Annual Leave",
      value:
        leaveBalance?.annual_leave_balance ?? 0,
      description:
        "Remaining paid annual leave",
      icon: Umbrella,
      styleName: "annual",
    },
    {
      label: "Paternity Leave",
      value:
        leaveBalance?.paternity_leave_balance ?? 0,
      description:
        "Remaining paternity leave",
      icon: CalendarCheck,
      styleName: "paternity",
    },
    {
      label: "Bereavement Leave",
      value:
        leaveBalance?.bereavement_leave_balance ?? 0,
      description:
        "Remaining bereavement leave",
      icon: Clock3,
      styleName: "bereavement",
    },
    {
      label: "Comp Off",
      value:
        leaveBalance?.compoff_leave_balance ?? 0,
      description:
        "Available compensatory leave",
      icon: CheckCircle2,
      styleName: "compoff",
    },
  ];

  return (
    <section className="dashboard-page">
      <header className="dashboard-page-header">
        <div>
          <p className="page-eyebrow">
            Overview
          </p>

          <h1>Leave Dashboard</h1>

          <p>
            Review leave balances, pending actions,
            upcoming holidays, and recent requests.
          </p>
        </div>
      </header>

      <div className="dashboard-highlight-grid">
        <article className="dashboard-pending-card">
          <div className="dashboard-pending-icon">
            <Clock3 size={25} />
          </div>

          <div>
            <span>
              {getPendingLabel(user?.role)}
            </span>

            <strong>
              {dashboardData.pending_count}
            </strong>

            <p>
              {user?.role === "MANAGER"
                ? "Associate requests waiting for your action"
                : user?.role === "HR"
                  ? "Manager requests waiting for HR review"
                  : "Your leave requests waiting for approval"}
            </p>
          </div>
        </article>

        <article className="dashboard-user-summary">
          <span>Employee</span>

          <strong>
            {dashboardData.user.name}
          </strong>

          <p>
            {dashboardData.user.emp_id} ·{" "}
            {dashboardData.user.role}
          </p>

          <small>
            {dashboardData.user.department?.name ??
              "Department not assigned"}
          </small>
        </article>
      </div>

      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <h2>Available Leave Balance</h2>

            <p>
              Current remaining balance by leave type.
            </p>
          </div>
        </div>

        <div className="leave-balance-grid">
          {leaveBalanceCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.label}
                className={`leave-balance-card leave-balance-card-${card.styleName}`}
              >
                <div className="leave-balance-icon">
                  <Icon size={22} />
                </div>

                <span>{card.label}</span>

                <strong>{card.value}</strong>

                <p>{card.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <div className="dashboard-content-grid">
        <section className="dashboard-panel">
          <div className="dashboard-section-heading">
            <div>
              <h2>Recent Leave Applications</h2>

              <p>
                Your five most recent leave requests.
              </p>
            </div>
          </div>

          {dashboardData.recent_leave_applications
            .length === 0 ? (
            <div className="dashboard-empty-state">
              <CalendarCheck size={35} />

              <strong>No leave applications</strong>

              <p>
                Your recent leave requests will appear
                here.
              </p>
            </div>
          ) : (
            <div className="recent-leave-list">
              {dashboardData.recent_leave_applications.map(
                (leave) => (
                  <article
                    key={leave.id}
                    className="recent-leave-item"
                  >
                    <div className="recent-leave-date-icon">
                      <CalendarDays size={20} />
                    </div>

                    <div className="recent-leave-details">
                      <div>
                        <strong>
                          {leave.leave_type.replace(
                            "_",
                            " "
                          )}
                        </strong>

                        <span
                          className={getStatusClassName(
                            leave.status
                          )}
                        >
                          {leave.status}
                        </span>
                      </div>

                      <p>
                        {formatDate(leave.start_date)}
                        {" - "}
                        {formatDate(leave.end_date)}
                      </p>

                      <small>
                        {leave.days}{" "}
                        {leave.days === 1
                          ? "day"
                          : "days"}
                      </small>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-section-heading">
            <div>
              <h2>Upcoming Holidays</h2>

              <p>
                Next company holidays and observances.
              </p>
            </div>
          </div>

          {dashboardData.upcoming_holidays.length ===
          0 ? (
            <div className="dashboard-empty-state">
              <CalendarDays size={35} />

              <strong>No upcoming holidays</strong>

              <p>
                Future active holidays will appear
                here.
              </p>
            </div>
          ) : (
            <div className="upcoming-holiday-list">
              {dashboardData.upcoming_holidays.map(
                (holiday) => (
                  <article
                    key={holiday.id}
                    className="holiday-item"
                  >
                    <div className="holiday-date">
                      <strong>
                        {format(
                          parseISO(
                            holiday.holiday_date
                          ),
                          "dd"
                        )}
                      </strong>

                      <span>
                        {format(
                          parseISO(
                            holiday.holiday_date
                          ),
                          "MMM"
                        )}
                      </span>
                    </div>

                    <div>
                      <strong>
                        {holiday.holiday_name}
                      </strong>

                      <p>
                        {holiday.description ??
                          holiday.holiday_type}
                      </p>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </section>
  );
};

export default DashboardPage;