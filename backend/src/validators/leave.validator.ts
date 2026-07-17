import { body,query } from "express-validator";

export const applyLeaveValidator = [
  body("leave_type")
    .notEmpty()
    .withMessage("Leave type is required")
    .isIn(["ANNUAL", "PATERNITY", "BEREAVEMENT", "COMPOFF"])
    .withMessage("Invalid leave type"),

  body("reason")
    .notEmpty()
    .withMessage("Reason is required")
    .isLength({ min: 5, max: 500 })
    .withMessage("Reason must be between 5 and 500 characters"),

  body("start_date")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid date"),

  body("end_date")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("End date must be a valid date")
    .custom((endDate, { req }) => {
      const startDate = new Date(req.body.start_date);
      const finalEndDate = new Date(endDate);

      if (finalEndDate < startDate) {
        throw new Error("End date cannot be before start date");
      }

      return true;
    }),

  body("is_half_day")
    .optional()
    .isBoolean()
    .withMessage("Half day value must be true or false"),

  body("is_emergency")
    .optional()
    .isBoolean()
    .withMessage("Emergency value must be true or false"),
];



export const monthlyAttendanceValidator = [
  query("month")
    .notEmpty()
    .withMessage("Month is required")
    .isInt({ min: 1, max: 12 })
    .withMessage("Month must be between 1 and 12"),

  query("year")
    .notEmpty()
    .withMessage("Year is required")
    .isInt({ min: 2020, max: 2100 })
    .withMessage("Year must be between 2020 and 2100"),
];


export const leaveSummaryValidator = [
  query("year")
    .notEmpty()
    .withMessage("Year is required")
    .isInt({ min: 2020, max: 2100 })
    .withMessage("Year must be between 2020 and 2100"),
];