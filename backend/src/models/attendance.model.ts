import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/db";

export type AttendanceStatus =
  | "PRESENT"
  | "HALF_DAY"
  | "ABSENT"
  | "HOLIDAY"
  | "LEAVE_APPLIED"
  | "LEAVE_APPROVED"
  | "WFH"
  | "REGULARIZED"
  | "WEEK_OFF"
  | "EMPTY";

interface AttendanceAttributes {
  id: number;
  employee_id: number;
  date: Date;
  check_in: string | null;
  check_out: string | null;
  status: AttendanceStatus;
  working_hours: number | null;
  remarks: string | null;
  created_at?: Date;
  updated_at?: Date;
}

type AttendanceCreationAttributes = Optional<
  AttendanceAttributes,
  | "id"
  | "check_in"
  | "check_out"
  | "working_hours"
  | "remarks"
  | "created_at"
  | "updated_at"
>;

class Attendance
  extends Model<AttendanceAttributes, AttendanceCreationAttributes>
  implements AttendanceAttributes
{
  public id!: number;
  public employee_id!: number;
  public date!: Date;
  public check_in!: string | null;
  public check_out!: string | null;
  public status!: AttendanceStatus;
  public working_hours!: number | null;
  public remarks!: string | null;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Attendance.init(
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    check_in: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    check_out: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "PRESENT",
        "HALF_DAY",
        "ABSENT",
        "HOLIDAY",
        "LEAVE_APPLIED",
        "LEAVE_APPROVED",
        "WFH",
        "REGULARIZED",
        "WEEK_OFF",
        "EMPTY"
      ),
      allowNull: false,
      defaultValue: "EMPTY",
    },
    working_hours: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "attendance",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["employee_id", "date"],
      },
    ],
  }
);

export default Attendance;