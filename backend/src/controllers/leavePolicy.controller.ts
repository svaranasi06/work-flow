import { Request, Response } from "express";
import {
  createLeavePolicy,
  getLeavePolicies,
  updateLeavePolicy,
} from "../services/leavePolicy.service";
import { LeaveType } from "../models/leaveRequest.model";

export const addLeavePolicy = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      leave_type,
      policy_year,
      display_name,
      description,
      default_allocation,
      max_days_per_request,
      carry_forward_allowed,
      max_carry_forward_days,
      requires_document,
      is_active,
    } = req.body;

    const policy = await createLeavePolicy({
      leave_type: leave_type as LeaveType,
      policy_year,
      display_name,
      description,
      default_allocation,
      max_days_per_request,
      carry_forward_allowed,
      max_carry_forward_days,
      requires_document,
      is_active,
    });

    return res.status(201).json({
      success: true,
      message: "Leave policy created successfully",
      data: policy,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};

export const getLeavePolicyList = async (
  req: Request,
  res: Response
) => {
  try {
    const year = Number(req.query.year);

    const isActive =
      req.query.is_active !== undefined
        ? req.query.is_active === "true"
        : undefined;

    const policies = await getLeavePolicies({
      year,
      is_active: isActive,
    });

    return res.status(200).json({
      success: true,
      message: "Leave policies fetched successfully",
      data: {
        year,
        policies,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    return res.status(500).json({
      success: false,
      message,
    });
  }
};

export const editLeavePolicy = async (
  req: Request,
  res: Response
) => {
  try {
    const policyId = Number(req.params.id);

    const policy = await updateLeavePolicy(
      policyId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Leave policy updated successfully",
      data: policy,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};