import { query } from "express-validator";

export const leaveReportValidator = [
  query("year")
    .optional()
    .isInt({ min: 2020, max: 2100 })
    .withMessage("Year must be between 2020 and 2100"),

  query("status")
    .optional()
    .isIn(["PENDING", "APPROVED", "REJECTED", "CANCELLED"])
    .withMessage("Invalid leave status"),

  query("leave_type")
    .optional()
    .isIn(["ANNUAL", "PATERNITY", "BEREAVEMENT", "COMPOFF"])
    .withMessage("Invalid leave type"),

  query("department_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Department ID must be a positive integer"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be at least 1"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];