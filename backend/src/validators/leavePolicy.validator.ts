import { body, param, query } from "express-validator";

const allowedLeaveTypes = [
  "ANNUAL",
  "PATERNITY",
  "BEREAVEMENT",
  "COMPOFF",
];

export const createLeavePolicyValidator = [
  body("leave_type")
    .notEmpty()
    .withMessage("Leave type is required")
    .isIn(allowedLeaveTypes)
    .withMessage("Invalid leave type"),

  body("policy_year")
    .notEmpty()
    .withMessage("Policy year is required")
    .isInt({ min: 2020, max: 2100 })
    .withMessage("Policy year must be between 2020 and 2100"),

  body("display_name")
    .trim()
    .notEmpty()
    .withMessage("Display name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Display name must be between 2 and 100 characters"),

  body("description")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("default_allocation")
    .notEmpty()
    .withMessage("Default allocation is required")
    .isFloat({ min: 0 })
    .withMessage("Default allocation cannot be negative"),

  body("max_days_per_request")
    .optional({ nullable: true })
    .isFloat({ min: 0.5 })
    .withMessage("Maximum days per request must be at least 0.5"),

  body("carry_forward_allowed")
    .optional()
    .isBoolean()
    .withMessage("Carry forward allowed must be true or false"),

  body("max_carry_forward_days")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum carry-forward days cannot be negative"),

  body("requires_document")
    .optional()
    .isBoolean()
    .withMessage("Requires document must be true or false"),

  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("Active status must be true or false"),

  body().custom((requestBody) => {
    const carryForwardAllowed =
      requestBody.carry_forward_allowed === true ||
      requestBody.carry_forward_allowed === "true";

    const maximumCarryForwardDays = Number(
      requestBody.max_carry_forward_days ?? 0
    );

    if (!carryForwardAllowed && maximumCarryForwardDays > 0) {
      throw new Error(
        "Maximum carry-forward days must be 0 when carry forward is disabled"
      );
    }

    return true;
  }),
];

export const updateLeavePolicyValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Policy ID must be a valid positive integer"),

  body("display_name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Display name cannot be empty")
    .isLength({ min: 2, max: 100 })
    .withMessage("Display name must be between 2 and 100 characters"),

  body("description")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("default_allocation")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Default allocation cannot be negative"),

  body("max_days_per_request")
    .optional({ nullable: true })
    .isFloat({ min: 0.5 })
    .withMessage("Maximum days per request must be at least 0.5"),

  body("carry_forward_allowed")
    .optional()
    .isBoolean()
    .withMessage("Carry forward allowed must be true or false"),

  body("max_carry_forward_days")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum carry-forward days cannot be negative"),

  body("requires_document")
    .optional()
    .isBoolean()
    .withMessage("Requires document must be true or false"),

  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("Active status must be true or false"),

  body().custom((requestBody) => {
    if (Object.keys(requestBody).length === 0) {
      throw new Error("At least one policy field must be provided");
    }

    return true;
  }),
];

export const getLeavePoliciesValidator = [
  query("year")
    .notEmpty()
    .withMessage("Policy year is required")
    .isInt({ min: 2020, max: 2100 })
    .withMessage("Policy year must be between 2020 and 2100"),

  query("is_active")
    .optional()
    .isBoolean()
    .withMessage("Active status must be true or false"),
];