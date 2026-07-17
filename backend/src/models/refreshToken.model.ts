import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/db";


// user_id:
// Which user owns this refresh token.

// token:
// Actual refresh token.

// expires_at:
// Expiry date and time of refresh token.

// is_revoked:
// Used to invalidate token during logout.

interface RefreshTokenAttributes {
  id: number;
  user_id: number;
  token: string;
  expires_at: Date;
  is_revoked: boolean;
  created_at?: Date;
  updated_at?: Date;
}

type RefreshTokenCreationAttributes = Optional<
  RefreshTokenAttributes,
  "id" | "is_revoked" | "created_at" | "updated_at"
>;

class RefreshToken
  extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
  implements RefreshTokenAttributes
{
  public id!: number;
  public user_id!: number;
  public token!: string;
  public expires_at!: Date;
  public is_revoked!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_revoked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "refresh_tokens",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default RefreshToken;