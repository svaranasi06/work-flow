import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/db";

export type NotificationType =
  | "LEAVE_APPLIED"
  | "LEAVE_APPROVED"
  | "LEAVE_REJECTED"
  | "HR_INFO";

interface NotificationAttributes {
  id: number;
  receiver_id: number;
  sender_id: number | null;
  leave_request_id: number | null;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at?: Date;
  updated_at?: Date;
}

type NotificationCreationAttributes = Optional<
  NotificationAttributes,
  "id" | "sender_id" | "leave_request_id" | "is_read" | "created_at" | "updated_at"
>;

class Notification
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  public id!: number;
  public receiver_id!: number;
  public sender_id!: number | null;
  public leave_request_id!: number | null;
  public title!: string;
  public message!: string;
  public type!: NotificationType;
  public is_read!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    receiver_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    sender_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    leave_request_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        "LEAVE_APPLIED",
        "LEAVE_APPROVED",
        "LEAVE_REJECTED",
        "HR_INFO"
      ),
      allowNull: false,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "notifications",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Notification;