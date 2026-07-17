import { useState } from "react";

import type {
  ChangeEvent,
} from "react";

import axios from "axios";

import {
  AlertCircle,
  CheckCircle2,
  X,
  XCircle,
} from "lucide-react";

import {
  approveLeaveByHr,
  rejectLeaveByHr,
} from "../services/approval.service";

import type {
  ApiErrorResponse,
} from "../types/auth.types";

import type {
  ApprovalAction,
  HrPendingLeave,
} from "../types/approval.types";

import "../styles/manager-inbox.css";

interface HrActionModalProps {
  leaveRequest: HrPendingLeave;
  action: ApprovalAction;
  onClose: () => void;
  onActionCompleted: () => Promise<void>;
}

const HrActionModal = ({
  leaveRequest,
  action,
  onClose,
  onActionCompleted,
}: HrActionModalProps) => {
  const [remarks, setRemarks] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const isApproval = action === "APPROVE";

  const handleRemarksChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setRemarks(event.target.value);

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const validateRemarks = (): string => {
    const trimmedRemarks = remarks.trim();

    if (!isApproval && trimmedRemarks.length < 5) {
      return "Please provide a rejection reason of at least 5 characters.";
    }

    if (trimmedRemarks.length > 500) {
      return "Remarks cannot exceed 500 characters.";
    }

    return "";
  };

  const handleAction = async (): Promise<void> => {
    const validationMessage = validateRemarks();

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const actionData = {
        hr_remarks: remarks.trim() || undefined,
      };

      if (isApproval) {
        await approveLeaveByHr(
          leaveRequest.id,
          actionData
        );
      } else {
        await rejectLeaveByHr(
          leaveRequest.id,
          actionData
        );
      }

      await onActionCompleted();

      onClose();
    } catch (error) {
      if (
        axios.isAxiosError<ApiErrorResponse>(error)
      ) {
        setErrorMessage(
          error.response?.data.message ??
            `Unable to ${
              isApproval ? "approve" : "reject"
            } the leave request.`
        );
      } else {
        setErrorMessage(
          `An unexpected error occurred while ${
            isApproval ? "approving" : "rejecting"
          } the leave request.`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="approval-modal-backdrop"
      role="presentation"
      onMouseDown={() => {
        if (!isSubmitting) {
          onClose();
        }
      }}
    >
      <section
        className="approval-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hr-action-title"
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        <header className="approval-modal-header">
          <div
            className={
              isApproval
                ? "approval-modal-icon approval-modal-icon-approve"
                : "approval-modal-icon approval-modal-icon-reject"
            }
          >
            {isApproval ? (
              <CheckCircle2 size={26} />
            ) : (
              <XCircle size={26} />
            )}
          </div>

          <button
            type="button"
            className="approval-modal-close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close HR action dialog"
          >
            <X size={20} />
          </button>
        </header>

        <div className="approval-modal-content">
          <p className="page-eyebrow">
            HR Review
          </p>

          <h2 id="hr-action-title">
            {isApproval
              ? "Approve Manager Leave"
              : "Reject Manager Leave"}
          </h2>

          <p>
            You are about to{" "}
            <strong>
              {isApproval ? "approve" : "reject"}
            </strong>{" "}
            request{" "}
            <strong>#{leaveRequest.id}</strong>{" "}
            submitted by{" "}
            <strong>
              {leaveRequest.employee.name}
            </strong>
            .
          </p>

          <div className="approval-request-summary">
            <div>
              <span>Employee</span>

              <strong>
                {leaveRequest.employee.name}
              </strong>

              <small>
                {leaveRequest.employee.emp_id}
              </small>
            </div>

            <div>
              <span>Leave Type</span>

              <strong>
                {leaveRequest.leave_type.replace(
                  "_",
                  " "
                )}
              </strong>
            </div>

            <div>
              <span>Dates</span>

              <strong>
                {leaveRequest.start_date}
                {" - "}
                {leaveRequest.end_date}
              </strong>
            </div>

            <div>
              <span>Days</span>

              <strong>{leaveRequest.days}</strong>
            </div>
          </div>

          <div className="approval-reason-box">
            <span>Manager Reason</span>

            <p>{leaveRequest.reason}</p>
          </div>

          <div className="approval-remarks-group">
            <label htmlFor="hr_remarks">
              HR Remarks
              {!isApproval && (
                <span>
                  {" "}
                  Required for rejection
                </span>
              )}
            </label>

            <textarea
              id="hr_remarks"
              rows={4}
              value={remarks}
              onChange={handleRemarksChange}
              placeholder={
                isApproval
                  ? "Add optional approval remarks"
                  : "Explain why this request is being rejected"
              }
              maxLength={500}
              disabled={isSubmitting}
            />

            <small>{remarks.length}/500</small>
          </div>

          {errorMessage && (
            <div
              className="approval-modal-error"
              role="alert"
            >
              <AlertCircle size={18} />

              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        <footer className="approval-modal-footer">
          <button
            type="button"
            className="approval-secondary-button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Go Back
          </button>

          <button
            type="button"
            className={
              isApproval
                ? "approval-primary-button approval-primary-button-approve"
                : "approval-primary-button approval-primary-button-reject"
            }
            onClick={() => {
              void handleAction();
            }}
            disabled={isSubmitting}
          >
            {isApproval ? (
              <CheckCircle2 size={18} />
            ) : (
              <XCircle size={18} />
            )}

            {isSubmitting
              ? isApproval
                ? "Approving..."
                : "Rejecting..."
              : isApproval
                ? "Confirm Approval"
                : "Confirm Rejection"}
          </button>
        </footer>
      </section>
    </div>
  );
};

export default HrActionModal;