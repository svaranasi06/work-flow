import { useState } from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import axios from "axios";

import {
  AlertCircle,
  CalendarPlus,
  X,
} from "lucide-react";

import { applyForLeave } from "../services/leave.service";

import type {
  ApiErrorResponse,
} from "../types/auth.types";

import type {
  ApplyLeaveInput,LeaveSummaryItem
} from "../types/leave.types";

interface ApplyLeaveModalProps {
  leaveSummary: LeaveSummaryItem[];
  onClose: () => void;
  onLeaveCreated: () => Promise<void>;
}

const initialFormData: ApplyLeaveInput = {
  leave_type: "ANNUAL",
  reason: "",
  start_date: "",
  end_date: "",
  is_half_day: false,
  is_emergency: false,
};

const ApplyLeaveModal = ({
  leaveSummary,
  onClose,
  onLeaveCreated,
}: ApplyLeaveModalProps) => {
  const [formData, setFormData] =
    useState<ApplyLeaveInput>(initialFormData);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");


    const selectedLeaveSummary =
  leaveSummary.find(
    (item) =>
      item.leave_type ===
      formData.leave_type
  );

const usableBalance = Math.max(
  0,
  (selectedLeaveSummary?.available ?? 0) -
    (selectedLeaveSummary?.pending ?? 0)
);

  const handleInputChange = (
    event: ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >
  ) => {
    const {
      name,
      value,
      type,
    } = event.target;

    const fieldValue =
      type === "checkbox"
        ? (event.target as HTMLInputElement).checked
        : value;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]:fieldValue,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const validateForm = (): string => {
    if (!formData.leave_type) {
      return "Please select a leave type.";
    }

    if (!selectedLeaveSummary) {
  return "Leave balance information is unavailable.";
}

if (usableBalance <= 0) {
  return `You have no usable ${selectedLeaveSummary.display_name} balance after considering pending requests.`;
}

    if (formData.reason.trim().length < 5) {
      return "Reason must contain at least 5 characters.";
    }

    if (!formData.start_date) {
      return "Start date is required.";
    }

    if (!formData.end_date) {
      return "End date is required.";
    }

    const startDate = new Date(
      `${formData.start_date}T00:00:00`
    );

    const endDate = new Date(
      `${formData.end_date}T00:00:00`
    );

    if (endDate < startDate) {
      return "End date cannot be before start date.";
    }

    if (
      formData.is_half_day &&
      formData.start_date !== formData.end_date
    ) {
      return "Half-day leave must use the same start and end date.";
    }

    return "";
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const validationMessage = validateForm();

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await applyForLeave({
        ...formData,
        reason: formData.reason.trim(),
      });

      await onLeaveCreated();

      onClose();
    } catch (error) {
      if (
        axios.isAxiosError<ApiErrorResponse>(error)
      ) {
        setErrorMessage(
          error.response?.data.message ??
            "Unable to submit the leave request."
        );
      } else {
        setErrorMessage(
          "An unexpected error occurred while submitting the leave request."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="leave-modal-backdrop"
      role="presentation"
      onMouseDown={() => {
        if (!isSubmitting) {
          onClose();
        }
      }}
    >
      <section
        className="leave-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-leave-title"
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        <header className="leave-modal-header">
          <div>
            <p className="page-eyebrow">
              New Request
            </p>

            <h2 id="apply-leave-title">
              Apply Leave
            </h2>

            <p>
              Enter the leave details and submit the
              request for approval.
            </p>
          </div>

          <button
            type="button"
            className="leave-modal-close"
            onClick={onClose}
            aria-label="Close apply leave form"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </header>

        <form
          className="apply-leave-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="apply-form-group">
            <label htmlFor="leave_type">
              Leave Type
            </label>

            <select
              id="leave_type"
              name="leave_type"
              value={formData.leave_type}
              onChange={handleInputChange}
              disabled={isSubmitting}
            >
              <option value="ANNUAL">
                Annual Leave
              </option>

              <option value="PATERNITY">
                Paternity Leave
              </option>

              <option value="BEREAVEMENT">
                Bereavement Leave
              </option>

              <option value="COMPOFF">
                Comp Off
              </option>
            </select>
          </div>

          <div className="apply-form-date-grid">
            <div className="apply-form-group">
              <label htmlFor="start_date">
                Start Date
              </label>

              <input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="apply-form-group">
              <label htmlFor="end_date">
                End Date
              </label>

              <input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleInputChange}
                min={
                  formData.start_date ||
                  undefined
                }
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="apply-form-group">
            <label htmlFor="reason">
              Reason
            </label>

            <textarea
              id="reason"
              name="reason"
              rows={4}
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Provide a short reason for your leave request"
              maxLength={500}
              disabled={isSubmitting}
            />

            <span className="apply-form-character-count">
              {formData.reason.length}/500
            </span>
          </div>

          <div className="apply-form-options">
            <label className="apply-checkbox-option">
              <input
                type="checkbox"
                name="is_half_day"
                checked={formData.is_half_day}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />

              <span>
                <strong>Half Day</strong>

                <small>
                  Apply for half a working day
                </small>
              </span>
            </label>

            <label className="apply-checkbox-option">
              <input
                type="checkbox"
                name="is_emergency"
                checked={formData.is_emergency}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />

              <span>
                <strong>Emergency Leave</strong>

                <small>
                  Mark this request as urgent
                </small>
              </span>
            </label>
          </div>

          {errorMessage && (
            <div
              className="apply-leave-error"
              role="alert"
            >
              <AlertCircle size={18} />

              <span>{errorMessage}</span>
            </div>
          )}

          <footer className="apply-leave-form-footer">
            <button
              type="button"
              className="apply-leave-cancel-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="apply-leave-submit-button"
              disabled={isSubmitting}
            >
              <CalendarPlus size={18} />

              {isSubmitting
                ? "Submitting..."
                : "Submit Leave Request"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
};

export default ApplyLeaveModal;