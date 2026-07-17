import { Request, Response } from "express";
import { getMonthlyAttendance } from "../services/attendance.service";

export const getMyMonthlyAttendance = async (
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

    const month = Number(req.query.month);
    const year = Number(req.query.year);

    const attendanceRecords = await getMonthlyAttendance(
      req.user.id,
      month,
      year
    );

    return res.status(200).json({
      success: true,
      message: "Monthly attendance fetched successfully",
      data: {
        month,
        year,
        attendance: attendanceRecords,
      },
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