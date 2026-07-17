import { Request, Response } from "express";
import { getMonthlyCalendarData } from "../services/calendar.service";

export const getMyMonthlyCalendar = async (
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

    const calendarData = await getMonthlyCalendarData(
      req.user.id,
      month,
      year
    );

    return res.status(200).json({
      success: true,
      message: "Monthly calendar data fetched successfully",
      data: calendarData,
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

//Security Point
//The frontend does not send this:
//The backend identifies the employee using the verified access token. Therefore, an Associate cannot change an employee ID and view another employee’s personal calendar.