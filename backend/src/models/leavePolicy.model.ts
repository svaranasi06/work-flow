import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/db";
import { LeaveType } from "./leaveRequest.model";

interface LeavePolicyAttributes {
  id: number;
  leave_type: LeaveType;
  policy_year: number;
  display_name: string;
  description: string | null;
  default_allocation: number;
  max_days_per_request: number | null;
  carry_forward_allowed: boolean;
  max_carry_forward_days: number;
  requires_document: boolean;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

type LeavePolicyCreationAttributes = Optional<
  LeavePolicyAttributes,
  | "id"
  | "description"
  | "max_days_per_request"
  | "carry_forward_allowed"
  | "max_carry_forward_days"
  | "requires_document"
  | "is_active"
  | "created_at"
  | "updated_at"
>;

class LeavePolicy
  extends Model<
    LeavePolicyAttributes,
    LeavePolicyCreationAttributes
  >
  implements LeavePolicyAttributes
{
  public id!: number;
  public leave_type!: LeaveType;
  public policy_year!: number;
  public display_name!: string;
  public description!: string | null;
  public default_allocation!: number;
  public max_days_per_request!: number | null;
  public carry_forward_allowed!: boolean;
  public max_carry_forward_days!: number;
  public requires_document!: boolean;
  public is_active!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

LeavePolicy.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    leave_type: {
      type: DataTypes.ENUM(
        "ANNUAL",
        "PATERNITY",
        "BEREAVEMENT",
        "COMPOFF"
      ),
      allowNull: false,
    },

    policy_year: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    display_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    default_allocation: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },

    max_days_per_request: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: 0.5,
      },
    },

    carry_forward_allowed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    max_carry_forward_days: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },

    requires_document: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "leave_policies",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["leave_type", "policy_year"],
      },
    ],
  }
);

export default LeavePolicy;