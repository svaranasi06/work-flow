import {
  useState,
} from "react";

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

import {
  createHoliday,
} from "../services/holiday.service";

import type {
  ApiErrorResponse,
} from "../types/auth.types";

import type {
  CreateHolidayInput,
} from "../types/holiday.types";

interface AddHolidayModalProps {
  selectedYear: number;
  onClose: () => void;
  onHolidayCreated: () => Promise<void>;
}

const createInitialFormData = (
  selectedYear: number
): CreateHolidayInput => {
  return {
    holiday_name: "",
    holiday_date: `${selectedYear}-01-01`,
    holiday_type: "FESTIVAL",
    description: "",
  };
};

const AddHolidayModal = ({
  selectedYear,
  onClose,
  onHolidayCreated,
}: AddHolidayModalProps) => {
  const [formData, setFormData] =
    useState<CreateHolidayInput>(() =>
      createInitialFormData(selectedYear)
    );

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

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
    } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
     [name]:value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const validateForm = (): string => {
    const trimmedHolidayName =
      formData.holiday_name.trim();

    const trimmedDescription =
      formData.description?.trim() ?? "";

    if (trimmedHolidayName.length < 2) {
      return "Holiday name must contain at least 2 characters.";
    }

    if (trimmedHolidayName.length > 150) {
      return "Holiday name cannot exceed 150 characters.";
    }

    if (!formData.holiday_date) {
      return "Holiday date is required.";
    }

    const holidayYear = Number(
      formData.holiday_date.substring(0, 4)
    );

    if (holidayYear !== selectedYear) {
      return `Holiday date must belong to ${selectedYear}.`;
    }

    if (!formData.holiday_type) {
      return "Holiday type is required.";
    }

    if (trimmedDescription.length > 500) {
      return "Description cannot exceed 500 characters.";
    }

    return "";
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    const validationMessage =
      validateForm();

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await createHoliday({
        holiday_name:
          formData.holiday_name.trim(),
        holiday_date:
          formData.holiday_date,
        holiday_type:
          formData.holiday_type,
        description:
          formData.description?.trim() ||
          null,
      });

      await onHolidayCreated();

      onClose();
    } catch (error) {
      if (
        axios.isAxiosError<ApiErrorResponse>(
          error
        )
      ) {
        setErrorMessage(
          error.response?.data.message ??
            "Unable to create the holiday."
        );
      } else {
        setErrorMessage(
          "An unexpected error occurred while creating the holiday."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="holiday-modal-backdrop"
      role="presentation"
      onMouseDown={() => {
        if (!isSubmitting) {
          onClose();
        }
      }}
    >
      <section
        className="holiday-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-holiday-title"
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        <header className="holiday-modal-header">
          <div>
            <p className="page-eyebrow">
              HR Configuration
            </p>

            <h2 id="add-holiday-title">
              Add Public Holiday
            </h2>

            <p>
              Create an organization-wide holiday
              for {selectedYear}.
            </p>
          </div>

          <button
            type="button"
            className="holiday-modal-close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close add holiday form"
          >
            <X size={20} />
          </button>
        </header>

        <form
          className="holiday-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="holiday-form-group">
            <label htmlFor="holiday_name">
              Holiday Name
            </label>

            <input
              id="holiday_name"
              name="holiday_name"
              type="text"
              value={formData.holiday_name}
              onChange={handleInputChange}
              placeholder="Example: Ganesh Chaturthi"
              maxLength={150}
              disabled={isSubmitting}
            />
          </div>

          <div className="holiday-form-grid">
            <div className="holiday-form-group">
              <label htmlFor="holiday_date">
                Holiday Date
              </label>

              <input
                id="holiday_date"
                name="holiday_date"
                type="date"
                value={formData.holiday_date}
                onChange={handleInputChange}
                min={`${selectedYear}-01-01`}
                max={`${selectedYear}-12-31`}
                disabled={isSubmitting}
              />
            </div>

            <div className="holiday-form-group">
              <label htmlFor="holiday_type">
                Holiday Type
              </label>

              <select
                id="holiday_type"
                name="holiday_type"
                value={formData.holiday_type}
                onChange={handleInputChange}
                disabled={isSubmitting}
              >
                <option value="GOVERNMENT">
                  Government
                </option>

                <option value="FESTIVAL">
                  Festival
                </option>

                <option value="COMPANY">
                  Company
                </option>

                <option value="OPTIONAL">
                  Optional
                </option>
              </select>
            </div>
          </div>

          <div className="holiday-form-group">
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={4}
              value={
                formData.description ?? ""
              }
              onChange={handleInputChange}
              placeholder="Enter an optional description"
              maxLength={500}
              disabled={isSubmitting}
            />

            <span className="holiday-character-count">
              {
                (
                  formData.description ?? ""
                ).length
              }
              /500
            </span>
          </div>

          {errorMessage && (
            <div
              className="holiday-form-error"
              role="alert"
            >
              <AlertCircle size={18} />

              <span>{errorMessage}</span>
            </div>
          )}

          <footer className="holiday-form-footer">
            <button
              type="button"
              className="holiday-cancel-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="holiday-submit-button"
              disabled={isSubmitting}
            >
              <CalendarPlus size={18} />

              {isSubmitting
                ? "Creating..."
                : "Create Holiday"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
};

export default AddHolidayModal;