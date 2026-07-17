import { body, query } from "express-validator";

export const createHolidayValidator = [
  body("holiday_name")
    .trim()
    .notEmpty()
    .withMessage("Holiday name is required")
    .isLength({ min: 2, max: 150 })
    .withMessage("Holiday name must be between 2 and 150 characters"),

  body("holiday_date")
    .notEmpty()
    .withMessage("Holiday date is required")
    .isISO8601({ strict: true })
    .withMessage("Holiday date must be in YYYY-MM-DD format"),

  body("holiday_type")
    .notEmpty()
    .withMessage("Holiday type is required")
    .isIn(["GOVERNMENT", "FESTIVAL", "COMPANY", "OPTIONAL"])
    .withMessage("Invalid holiday type"),

  body("description")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
];

export const getHolidaysValidator = [
  query("year")
    .notEmpty()
    .withMessage("Year is required")
    .isInt({ min: 2020, max: 2100 })
    .withMessage("Year must be between 2020 and 2100"),
];
