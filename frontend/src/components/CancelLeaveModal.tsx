import { useState } from "react";

import axios from "axios";

import {
  AlertTriangle,
  Ban,
  X,
} from "lucide-react";

import { cancelLeaveRequest } from "../services/leave.service";

import type {
  ApiErrorResponse,
} from "../types/auth.types";

import type {
  LeaveRequest,
} from "../types/leave.types";

interface CancelLeaveModalProps {
  leaveRequest: LeaveRequest;
  onClose: () => void;
  onLeaveCancelled: () => Promise<void>;
}

const CancelLeaveModal = ({
  leaveRequest,
  onClose,
  onLeaveCancelled,
}: CancelLeaveModalProps) => {
  const [isCancelling, setIsCancelling] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const handleCancelLeave = async () => {
    try {
      setIsCancelling(true);
      setErrorMessage("");

      await cancelLeaveRequest(leaveRequest.id);

      await onLeaveCancelled();

      onClose();
    } catch (error) {
      if (
        axios.isAxiosError<ApiErrorResponse>(error)
      ) {
        setErrorMessage(
          error.response?.data.message ??
            "Unable to cancel the leave request."
        );
      } else {
        setErrorMessage(
          "An unexpected error occurred while cancelling the leave request."
        );
      }
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div
      className="leave-modal-backdrop"
      role="presentation"
      onMouseDown={() => {
        if (!isCancelling) {
          onClose();
        }
      }}
    >
      <section
        className="cancel-leave-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-leave-title"
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        <header className="cancel-leave-modal-header">
          <div className="cancel-leave-warning-icon">
            <AlertTriangle size={25} />
          </div>

          <button
            type="button"
            className="leave-modal-close"
            onClick={onClose}
            aria-label="Close cancellation confirmation"
            disabled={isCancelling}
          >
            <X size={20} />
          </button>
        </header>

        <div className="cancel-leave-modal-content">
          <p className="page-eyebrow">
            Cancel Request
          </p>

          <h2 id="cancel-leave-title">
            Cancel this leave request?
          </h2>

          <p>
            This action will cancel request{" "}
            <strong>#{leaveRequest.id}</strong>.
            The request will be removed from the
            approver&apos;s pending inbox.
          </p>

          <div className="cancel-leave-details">
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

              <strong>
                {leaveRequest.days}
              </strong>
            </div>
          </div>

          <p className="cancel-leave-note">
            Your leave balance will not change because
            a pending request has not deducted any
            balance.
          </p>

          {errorMessage && (
            <div
              className="apply-leave-error"
              role="alert"
            >
              <AlertTriangle size={18} />

              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        <footer className="cancel-leave-modal-footer">
          <button
            type="button"
            className="apply-leave-cancel-button"
            onClick={onClose}
            disabled={isCancelling}
          >
            Keep Request
          </button>

          <button
            type="button"
            className="confirm-cancel-leave-button"
            onClick={() =>
              void handleCancelLeave()
            }
            disabled={isCancelling}
          >
            <Ban size={18} />

            {isCancelling
              ? "Cancelling..."
              : "Cancel Leave"}
          </button>
        </footer>
      </section>
    </div>
  );
};

export default CancelLeaveModal;