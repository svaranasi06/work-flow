import axios from "axios";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  Inbox,
  RefreshCw,
  XCircle,
} from "lucide-react";

import ManagerActionModal from "../components/ManagerActionModal";

import { getManagerPendingLeaves } from "../services/approval.service";

import type { ApiErrorResponse } from "../types/auth.types";

import type {
  ApprovalAction,
  ManagerPendingLeave,
} from "../types/approval.types";

import "../styles/manager-inbox.css";

interface SelectedManagerAction {
  leaveRequest: ManagerPendingLeave;
  action: ApprovalAction;
}

const ManagerInboxPage = () => {
  const [pendingLeaves, setPendingLeaves] =
    useState<ManagerPendingLeave[]>([]);

  const [selectedAction, setSelectedAction] =
    useState<SelectedManagerAction | null>(
      null
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const loadPendingLeaves =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response =
          await getManagerPendingLeaves();

        setPendingLeaves(response.data);
      } catch (error) {
        if (
          axios.isAxiosError<ApiErrorResponse>(
            error
          )
        ) {
          setErrorMessage(
            error.response?.data.message ??
              "Unable to load pending leave requests."
          );
        } else {
          setErrorMessage(
            "An unexpected error occurred while loading the Manager Inbox."
          );
        }
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadPendingLeaves();
  }, [loadPendingLeaves]);

  const openActionModal = (
    leaveRequest: ManagerPendingLeave,
    action: ApprovalAction
  ) => {
    setSelectedAction({
      leaveRequest,
      action,
    });
  };

  const closeActionModal = () => {
    setSelectedAction(null);
  };

  if (isLoading) {
    return (
      <section className="manager-inbox-state">
        <div className="manager-inbox-loader" />

        <h1>Loading Manager Inbox</h1>

        <p>
          Please wait while assigned leave requests
          are loaded.
        </p>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="manager-inbox-state">
        <AlertCircle
          className="leave-page-error-icon"
          size={42}
        />

        <h1>Unable to load Manager Inbox</h1>

        <p>{errorMessage}</p>

        <button
          type="button"
          className="manager-inbox-refresh-button"
          onClick={() => {
            void loadPendingLeaves();
          }}
        >
          <RefreshCw size={17} />

          Try Again
        </button>
      </section>
    );
  }

  return (
    <>
      <section className="manager-inbox-page">
        <header className="manager-inbox-header">
          <div>
            <p className="page-eyebrow">
              Manager Review
            </p>

            <h1>Manager Inbox</h1>

            <p>
              Review Associate leave requests
              assigned to you.
            </p>
          </div>

          <button
            type="button"
            className="manager-inbox-refresh-button"
            onClick={() => {
              void loadPendingLeaves();
            }}
          >
            <RefreshCw size={17} />

            Refresh
          </button>
        </header>

        <article className="manager-inbox-summary-card">
          <div className="manager-inbox-summary-icon">
            <ClipboardCheck size={25} />
          </div>

          <div>
            <span>Pending Approvals</span>

            <strong>
              {pendingLeaves.length}
            </strong>

            <p>
              Associate requests waiting for your
              review.
            </p>
          </div>
        </article>

        {pendingLeaves.length === 0 ? (
          <section className="manager-inbox-empty">
            <Inbox size={45} />

            <strong>
              No pending leave requests
            </strong>

            <p>
              New Associate leave requests assigned
              to you will appear here.
            </p>
          </section>
        ) : (
          <section className="manager-inbox-list">
            {pendingLeaves.map((leave) => (
              <article
                key={leave.id}
                className="manager-request-card"
              >
                <header className="manager-request-card-header">
                  <div className="manager-request-employee">
                    <div className="manager-request-avatar">
                      {leave.employee.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <strong>
                        {leave.employee.name}
                      </strong>

                      <span>
                        {leave.employee.emp_id}
                        {" · "}
                        {leave.employee.department
                          ?.name ??
                          "Department not assigned"}
                      </span>
                    </div>
                  </div>

                  <span className="manager-request-status">
                    {leave.status}
                  </span>
                </header>

                <div className="manager-request-details">
                  <div className="manager-request-detail">
                    <span>Request ID</span>

                    <strong>
                      #{leave.id}
                    </strong>
                  </div>

                  <div className="manager-request-detail">
                    <span>Leave Type</span>

                    <strong>
                      {leave.leave_type.replace(
                        "_",
                        " "
                      )}
                    </strong>
                  </div>

                  <div className="manager-request-detail">
                    <span>Dates</span>

                    <strong>
                      {leave.start_date}
                      {" - "}
                      {leave.end_date}
                    </strong>
                  </div>

                  <div className="manager-request-detail">
                    <span>Days</span>

                    <strong>
                      {leave.days}
                    </strong>
                  </div>
                </div>

                <div className="manager-request-reason">
                  <span>Employee Reason</span>

                  <p>{leave.reason}</p>
                </div>

                <div className="manager-request-actions">
                  <button
                    type="button"
                    className="manager-reject-button"
                    onClick={() => {
                      openActionModal(
                        leave,
                        "REJECT"
                      );
                    }}
                  >
                    <XCircle size={17} />

                    Reject
                  </button>

                  <button
                    type="button"
                    className="manager-approve-button"
                    onClick={() => {
                      openActionModal(
                        leave,
                        "APPROVE"
                      );
                    }}
                  >
                    <CheckCircle2 size={17} />

                    Approve
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </section>

      {selectedAction !== null && (
        <ManagerActionModal
          leaveRequest={
            selectedAction.leaveRequest
          }
          action={selectedAction.action}
          onClose={closeActionModal}
         onActionCompleted={loadPendingLeaves}
        />
      )}
    </>
  );
};

export default ManagerInboxPage;