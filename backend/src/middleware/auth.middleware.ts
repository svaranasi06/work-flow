import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token.util";
import db from "../models";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token is missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = verifyAccessToken(token);

    const user = await db.User.findOne({
      where: {
        id: decodedToken.id,
        is_active: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not authorized",
      });
    }

    req.user = decodedToken;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
};      