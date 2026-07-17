import { query } from "express-validator";

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