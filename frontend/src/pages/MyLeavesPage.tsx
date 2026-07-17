import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  AlertCircle,
  Ban,
  CalendarPlus,
} from "lucide-react";

import ApplyLeaveModal from "../components/ApplyLeaveModal";
import CancelLeaveModal from "../components/CancelLeaveModal";

import {
  getLeaveSummary,
  getMyLeaves,
} from "../services/leave.service";

import type {
  ApiErrorResponse,
} from "../types/auth.types";

import type {
  LeaveRequest,
  LeaveSummaryItem,
} from "../types/leave.types";

import "../styles/my-leaves.css";

const currentYear = new Date().getFullYear();

const MyLeavesPage = () => {
  const [leaves, setLeaves] =
    useState<LeaveRequest[]>([]);

  const [summary, setSummary] =
    useState<LeaveSummaryItem[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [
    isApplyModalOpen,
    setIsApplyModalOpen,
  ] = useState(false);

  const [
    leaveSelectedForCancellation,
    setLeaveSelectedForCancellation,
  ] = useState<LeaveRequest | null>(null);

  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) => {
      const startYear = Number(
        leave.start_date.substring(0, 4)
      );

      const endYear = Number(
        leave.end_date.substring(0, 4)
      );

      return (
        startYear <= currentYear &&
        endYear >= currentYear
      );
    });
  }, [leaves]);

  const loadLeaveData =
    useCallback(async (): Promise<void> => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [
          myLeavesResponse,
          summaryResponse,
        ] = await Promise.all([
          getMyLeaves(),
          getLeaveSummary(currentYear),
        ]);

        setLeaves(
          myLeavesResponse.data
        );

        setSummary(
          summaryResponse.data.summary
        );
      } catch (error) {
        if (
          axios.isAxiosError<ApiErrorResponse>(
            error
          )
        ) {
          setErrorMessage(
            error.response?.data.message ??
              "Unable to load leave information."
          );
        } else {
          setErrorMessage(
            "An unexpected error occurred while loading leave information."
          );
        }
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadLeaveData();
  }, [loadLeaveData]);

  if (isLoading) {
    return (
      <section className="leave-page-state">
        <div className="leave-page-loader" />

        <h1>Loading leave information</h1>

        <p>
          Please wait while balances and leave
          applications are loaded.
        </p>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="leave-page-state">
        <AlertCircle
          className="leave-page-error-icon"
          size={42}
        />

        <h1>Unable to load My Leaves</h1>

        <p>{errorMessage}</p>
      </section>
    );
  }

  return (
    <>
      <section className="my-leaves-page">
        <header className="my-leaves-header">
          <div>
            <p className="page-eyebrow">
              Employee Leave
            </p>

            <h1>My Leaves</h1>

            <p>
              Review balances, track applications,
              and manage personal leave requests.
            </p>
          </div>

          <div className="my-leaves-header-actions">
            <button
              type="button"
              className="apply-leave-button"
              onClick={() => {
                setIsApplyModalOpen(true);
              }}
            >
              <CalendarPlus size={18} />

              Apply Leave
            </button>
          </div>
        </header>

        <section className="leave-summary-section">
          <div className="leave-section-heading">
            <div>
              <h2>Leave Summary</h2>

              <p>
                Leave availability and usage for{" "}
                {currentYear}.
              </p>
            </div>
          </div>

          <div className="leave-summary-grid">
            {summary.map((item) => (
              <article
                key={item.leave_type}
                className="leave-summary-card"
              >
                <div className="leave-summary-card-header">
                  <span>
                    {item.display_name}
                  </span>

                  <strong>
                    {item.available}
                  </strong>
                </div>

                <p>Available balance</p>

                <div className="leave-summary-metrics">
                  <div>
                    <span>Pending</span>

                    <strong>
                      {item.pending}
                    </strong>
                  </div>

                  <div>
                    <span>Used</span>

                    <strong>
                      {item.used}
                    </strong>
                  </div>

                  <div>
                    <span>Lapsed</span>

                    <strong>
                      {item.lapsed}
                    </strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="leave-history-section">
          <div className="leave-section-heading">
            <div>
              <h2>Leave Applications</h2>

              <p>
                Personal leave requests for{" "}
                {currentYear}.
              </p>
            </div>
          </div>

          {filteredLeaves.length === 0 ? (
            <div className="leave-empty-state">
              <CalendarPlus size={38} />

              <strong>
                No leave applications for{" "}
                {currentYear}
              </strong>

              <p>
                Current-year leave requests will
                appear here.
              </p>
            </div>
          ) : (
            <div className="leave-table-wrapper">
              <table className="leave-table">
                <thead>
                  <tr>
                    <th>Request</th>
                    <th>Leave Type</th>
                    <th>Dates</th>
                    <th>Days</th>
                    <th>Approver</th>
                    <th>Status</th>
                    <th>Applied On</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLeaves.map((leave) => (
                    <tr key={leave.id}>
                      <td>#{leave.id}</td>

                      <td>
                        {leave.leave_type.replaceAll(
                          "_",
                          " "
                        )}
                      </td>

                      <td>
                        {leave.start_date}
                        {" - "}
                        {leave.end_date}
                      </td>

                      <td>{leave.days}</td>

                      <td>
                        {leave.approver?.name ??
                          leave.approvedByUser
                            ?.name ??
                          "Not assigned"}
                      </td>

                      <td>
                        <span
                          className={`leave-status leave-status-${leave.status.toLowerCase()}`}
                        >
                          {leave.status}
                        </span>
                      </td>

                      <td>
                        {new Date(
                          leave.created_at
                        ).toLocaleDateString(
                          "en-IN"
                        )}
                      </td>

                      <td>
                        {leave.status ===
                        "PENDING" ? (
                          <button
                            type="button"
                            className="cancel-leave-action-button"
                            onClick={() => {
                              setLeaveSelectedForCancellation(
                                leave
                              );
                            }}
                          >
                            <Ban size={15} />

                            Cancel
                          </button>
                        ) : (
                          <span className="leave-no-action">
                            -
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>

      {isApplyModalOpen && (
        <ApplyLeaveModal
  leaveSummary={summary}
  onClose={() => {
    setIsApplyModalOpen(false);
  }}
  onLeaveCreated={loadLeaveData}
/>
      )}

      {leaveSelectedForCancellation && (
        <CancelLeaveModal
          leaveRequest={
            leaveSelectedForCancellation
          }
          onClose={() => {
            setLeaveSelectedForCancellation(
              null
            );
          }}
          onLeaveCancelled={
            loadLeaveData
          }
        />
      )}
    </>
  );
};

export default MyLeavesPage;