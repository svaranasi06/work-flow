import db from "../models";
import { LeaveType } from "../models/leaveRequest.model";

interface CreateLeavePolicyInput {
  leave_type: LeaveType;
  policy_year: number;
  display_name: string;
  description?: string | null;
  default_allocation: number;
  max_days_per_request?: number | null;
  carry_forward_allowed?: boolean;
  max_carry_forward_days?: number;
  requires_document?: boolean;
  is_active?: boolean;
}

interface UpdateLeavePolicyInput {
  display_name?: string;
  description?: string | null;
  default_allocation?: number;
  max_days_per_request?: number | null;
  carry_forward_allowed?: boolean;
  max_carry_forward_days?: number;
  requires_document?: boolean;
  is_active?: boolean;
}

interface GetLeavePoliciesFilters {
  year: number;
  is_active?: boolean;
}

export const createLeavePolicy = async (
  policyData: CreateLeavePolicyInput
) => {
  const existingPolicy = await db.LeavePolicy.findOne({
    where: {
      leave_type: policyData.leave_type,
      policy_year: policyData.policy_year,
    },
  });

  if (existingPolicy) {
    throw new Error(
      "A policy already exists for this leave type and year"
    );
  }

  const carryForwardAllowed =
    policyData.carry_forward_allowed ?? false;

  const maxCarryForwardDays = carryForwardAllowed
    ? policyData.max_carry_forward_days ?? 0
    : 0;

  const policy = await db.LeavePolicy.create({
    leave_type: policyData.leave_type,
    policy_year: policyData.policy_year,
    display_name: policyData.display_name,
    description: policyData.description ?? null,
    default_allocation: policyData.default_allocation,
    max_days_per_request:
      policyData.max_days_per_request ?? null,
    carry_forward_allowed: carryForwardAllowed,
    max_carry_forward_days: maxCarryForwardDays,
    requires_document: policyData.requires_document ?? false,
    is_active: policyData.is_active ?? true,
  });

  return policy;
};

export const getLeavePolicies = async (
  filters: GetLeavePoliciesFilters
) => {
  const whereCondition: {
    policy_year: number;
    is_active?: boolean;
  } = {
    policy_year: filters.year,
  };

  if (filters.is_active !== undefined) {
    whereCondition.is_active = filters.is_active;
  }

  const policies = await db.LeavePolicy.findAll({
    where: whereCondition,
    order: [["leave_type", "ASC"]],
  });

  return policies;
};

export const updateLeavePolicy = async (
  policyId: number,
  policyData: UpdateLeavePolicyInput
) => {
  const policy = await db.LeavePolicy.findByPk(policyId);

  if (!policy) {
    throw new Error("Leave policy not found");
  }

  const carryForwardAllowed =
    policyData.carry_forward_allowed ??
    policy.carry_forward_allowed;

  const maxCarryForwardDays = carryForwardAllowed
    ? policyData.max_carry_forward_days ??
      policy.max_carry_forward_days
    : 0;

  await policy.update({
    ...policyData,
    carry_forward_allowed: carryForwardAllowed,
    max_carry_forward_days: maxCarryForwardDays,
  });

  return policy;
};