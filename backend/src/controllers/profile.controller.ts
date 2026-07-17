import { Request, Response } from "express";
import { getUserProfile } from "../services/profile.service";

export const getMyProfile = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const profile = await getUserProfile(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: profile,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    return res.status(500).json({
      success: false,
      message,
    });
  }
};