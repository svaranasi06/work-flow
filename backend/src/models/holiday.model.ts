import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/db";

export type HolidayType =
  | "GOVERNMENT"
  | "FESTIVAL"
  | "COMPANY"
  | "OPTIONAL";

interface HolidayAttributes {
  id: number;
  holiday_name: string;
  holiday_date: Date;
  holiday_type: HolidayType;
  description: string | null;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

type HolidayCreationAttributes = Optional<
  HolidayAttributes,
  "id" | "description" | "is_active" | "created_at" | "updated_at"
>;

class Holiday
  extends Model<HolidayAttributes, HolidayCreationAttributes>
  implements HolidayAttributes
{
  public id!: number;
  public holiday_name!: string;
  public holiday_date!: Date;
  public holiday_type!: HolidayType;
  public description!: string | null;
  public is_active!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Holiday.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    holiday_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    holiday_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true,
    },
    holiday_type: {
      type: DataTypes.ENUM(
        "GOVERNMENT",
        "FESTIVAL",
        "COMPANY",
        "OPTIONAL"
      ),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(500),
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
    tableName: "holidays",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Holiday;