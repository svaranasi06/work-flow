import { Request, Response } from "express";
import {
  createHoliday,
  getHolidaysByYear,
} from "../services/holiday.service";

export const addHoliday = async (req: Request, res: Response) => {
  try {
    const {
      holiday_name,
      holiday_date,
      holiday_type,
      description,
    } = req.body;

    const holiday = await createHoliday({
      holiday_name,
      holiday_date,
      holiday_type,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Holiday created successfully",
      data: holiday,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};

export const getHolidayList = async (
  req: Request,
  res: Response
) => {
  try {
    const year = Number(req.query.year);

    const holidays = await getHolidaysByYear(year);

    return res.status(200).json({
      success: true,
      message: "Holidays fetched successfully",
      data: {
        year,
        holidays,
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