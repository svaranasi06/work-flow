import { Op } from "sequelize";
import db from "../models";
import { comparePassword } from "../utils/password.util";
import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiryDate,
  verifyRefreshToken,
} from "../utils/token.util";

interface LoginInput {
  emp_id: string;
  password: string;
}

export const loginUser = async (loginData: LoginInput) => {
  const { emp_id, password } = loginData;

  const user = await db.User.findOne({
    where: { emp_id },
    include: [
      {
        model: db.Department,
        as: "department",
        attributes: ["id", "name"],
      },
      {
        model: db.LeaveBalance,
        as: "leaveBalance",
        attributes: [
          "annual_leave_balance",
          "paternity_leave_balance",
          "bereavement_leave_balance",
          "compoff_leave_balance",
        ],
      },
    ],
  });

  if (!user) {
    throw new Error("Invalid employee ID or password");
  }

  if (!user.is_active) {
    throw new Error("User account is inactive");
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid employee ID or password");
  }

  const tokenPayload = {
    id: user.id,
    emp_id: user.emp_id,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  await db.RefreshToken.create({
    user_id: user.id,
    token: refreshToken,
    expires_at: getRefreshTokenExpiryDate(),
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      emp_id: user.emp_id,
      email: user.email,
      role: user.role,
      department: user.get("department"),
      leaveBalance: user.get("leaveBalance"),
    },
  };
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  const decodedToken = verifyRefreshToken(refreshToken);

  const storedToken = await db.RefreshToken.findOne({
    where: {
      token: refreshToken,
      user_id: decodedToken.id,
      is_revoked: false,
      expires_at: {
        [Op.gt]: new Date(),
      },
    },
  });

  if (!storedToken) {
    throw new Error("Invalid or expired refresh token");
  }

  const user = await db.User.findOne({
    where: {
      id: decodedToken.id,
    },
    include: [
      {
        model: db.Department,
        as: "department",
        attributes: ["id", "name"],
      },
      {
        model: db.LeaveBalance,
        as: "leaveBalance",
        attributes: [
          "annual_leave_balance",
          "paternity_leave_balance",
          "bereavement_leave_balance",
          "compoff_leave_balance",
        ],
      },
    ],
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.is_active) {
    throw new Error("User account is inactive");
  }

  const newAccessToken = generateAccessToken({
    id: user.id,
    emp_id: user.emp_id,
    role: user.role,
  });

  return {
    accessToken: newAccessToken,
    user: {
      id: user.id,
      name: user.name,
      emp_id: user.emp_id,
      email: user.email,
      role: user.role,
      department: user.get("department"),
      leaveBalance: user.get("leaveBalance"),
    },
  };
};

export const logoutUser = async (refreshToken: string) => {
  const storedToken = await db.RefreshToken.findOne({
    where: {
      token: refreshToken,
      is_revoked: false,
    },
  });

  if (storedToken) {
    storedToken.is_revoked = true;
    await storedToken.save();
  }

  return true;
};