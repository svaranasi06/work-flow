import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/db";

interface DepartmentAttributes {
  id: number;
  name: string;
  description?: string | null;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

type DepartmentCreationAttributes = Optional<
  DepartmentAttributes,
  "id" | "description" | "is_active" | "created_at" | "updated_at"
>;

class Department
  extends Model<DepartmentAttributes, DepartmentCreationAttributes>
  implements DepartmentAttributes
{
  public id!: number;
  public name!: string;
  public description!: string | null;
  public is_active!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Department.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(255),
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
    tableName: "departments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Department;