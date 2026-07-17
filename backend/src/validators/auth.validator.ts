import { body } from "express-validator";

export const loginValidator = [
  body("emp_id")
    .notEmpty()
    .withMessage("Employee ID is required")
    .isLength({ min: 3 })
    .withMessage("Employee ID must be at least 3 characters"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];