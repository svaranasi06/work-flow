import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/db";

interface LeaveBalanceAttributes {
  id: number;
  user_id: number;
  annual_leave_balance: number;
  paternity_leave_balance: number;
  bereavement_leave_balance: number;
  compoff_leave_balance: number;
  created_at?: Date;
  updated_at?: Date;
}

type LeaveBalanceCreationAttributes = Optional<
  LeaveBalanceAttributes,
  | "id"
  | "annual_leave_balance"
  | "paternity_leave_balance"
  | "bereavement_leave_balance"
  | "compoff_leave_balance"
  | "created_at"
  | "updated_at"
>;

class LeaveBalance
  extends Model<LeaveBalanceAttributes, LeaveBalanceCreationAttributes>
  implements LeaveBalanceAttributes
{
  public id!: number;
  public user_id!: number;
  public annual_leave_balance!: number;
  public paternity_leave_balance!: number;
  public bereavement_leave_balance!: number;
  public compoff_leave_balance!: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

LeaveBalance.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
    },
    annual_leave_balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 12,
    },
    paternity_leave_balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 5,
    },
    bereavement_leave_balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 2,
    },
    compoff_leave_balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "leave_balances",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default LeaveBalance;