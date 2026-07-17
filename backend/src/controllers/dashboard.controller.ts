import { Request, Response } from "express";
import { getDashboardData } from "../services/dashboard.service";

export const getMyDashboard = async (
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

    const dashboardData = await getDashboardData(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: dashboardData,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return res.status(500).json({
      success: false,
      message,
    });
  }
};