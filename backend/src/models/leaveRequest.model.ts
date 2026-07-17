import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/db";

export type LeaveType = "ANNUAL" | "PATERNITY" | "BEREAVEMENT" | "COMPOFF";

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export type ApprovalStage =
  | "MANAGER_REVIEW"
  | "HR_REVIEW"
  | "ADMIN_REVIEW"
  | "COMPLETED";

export type ApproverRole = "MANAGER" | "HR" | "ADMIN" | null;

interface LeaveRequestAttributes {
  id: number;
  employee_id: number;
  leave_type: LeaveType;
  reason: string;
  start_date: Date;
  end_date: Date;
  days: number;
  status: LeaveStatus;
  approval_stage: ApprovalStage;
  approver_id: number | null;
  approved_by: number | null;
  approved_by_role: ApproverRole;
  manager_remarks: string | null;
  hr_remarks: string | null;
  supporting_document: string | null;
  is_half_day: boolean;
  is_emergency: boolean;
  action_at: Date | null;
  created_at?: Date;
  updated_at?: Date;
}

type LeaveRequestCreationAttributes = Optional<
  LeaveRequestAttributes,
  | "id"
  | "status"
  | "approval_stage"
  | "approver_id"
  | "approved_by"
  | "approved_by_role"
  | "manager_remarks"
  | "hr_remarks"
  | "supporting_document"
  | "is_half_day"
  | "is_emergency"
  | "action_at"
  | "created_at"
  | "updated_at"
>;

class LeaveRequest
  extends Model<LeaveRequestAttributes, LeaveRequestCreationAttributes>
  implements LeaveRequestAttributes
{
  public id!: number;
  public employee_id!: number;
  public leave_type!: LeaveType;
  public reason!: string;
  public start_date!: Date;
  public end_date!: Date;
  public days!: number;
  public status!: LeaveStatus;
  public approval_stage!: ApprovalStage;
  public approver_id!: number | null;
  public approved_by!: number | null;
  public approved_by_role!: ApproverRole;
  public manager_remarks!: string | null;
  public hr_remarks!: string | null;
  public supporting_document!: string | null;
  public is_half_day!: boolean;
  public is_emergency!: boolean;
  public action_at!: Date | null;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

LeaveRequest.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    employee_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    leave_type: {
      type: DataTypes.ENUM("ANNUAL", "PATERNITY", "BEREAVEMENT", "COMPOFF"),
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    days: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED", "CANCELLED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
    approval_stage: {
      type: DataTypes.ENUM(
        "MANAGER_REVIEW",
        "HR_REVIEW",
        "ADMIN_REVIEW",
        "COMPLETED"
      ),
      allowNull: false,
    },
    approver_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    approved_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    approved_by_role: {
      type: DataTypes.ENUM("MANAGER", "HR", "ADMIN"),
      allowNull: true,
    },
    manager_remarks: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    hr_remarks: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    supporting_document: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_half_day: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_emergency: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    action_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "leave_requests",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default LeaveRequest;