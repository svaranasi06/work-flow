import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/db";

export type UserRole = "ASSOCIATE" | "MANAGER" | "HR" | "ADMIN";

interface UserAttributes {
  id: number;
  name: string;
  emp_id: string;
  email: string;
  password: string;
  role: UserRole;
  department_id: number | null;
  manager_id: number | null;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

type UserCreationAttributes = Optional<
  UserAttributes,
  "id" | "department_id" | "manager_id" | "is_active" | "created_at" | "updated_at"
>;

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public name!: string;
  public emp_id!: string;
  public email!: string;
  public password!: string;
  public role!: UserRole;
  public department_id!: number | null;
  public manager_id!: number | null;
  public is_active!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    emp_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("ASSOCIATE", "MANAGER", "HR", "ADMIN"),
      allowNull: false,
      defaultValue: "ASSOCIATE",
    },
    department_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    manager_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default User;