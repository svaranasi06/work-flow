import { Op } from "sequelize";
import db from "../models";
import { HolidayType } from "../models/holiday.model";

interface CreateHolidayInput {
  holiday_name: string;
  holiday_date: string;
  holiday_type: HolidayType;
  description?: string | null;
}

export const createHoliday = async (
  holidayData: CreateHolidayInput
) => {
  const existingHoliday = await db.Holiday.findOne({
    where: {
      holiday_date: holidayData.holiday_date,
    },
  });

  if (existingHoliday) {
    throw new Error("A holiday already exists on the selected date");
  }

  const holiday = await db.Holiday.create({
    holiday_name: holidayData.holiday_name,
    holiday_date: new Date(holidayData.holiday_date),
    holiday_type: holidayData.holiday_type,
    description: holidayData.description || null,
    is_active: true,
  });

  return holiday;
};

export const getHolidaysByYear = async (year: number) => {
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  const holidays = await db.Holiday.findAll({
    where: {
      holiday_date: {
        [Op.between]: [startDate, endDate],
      },
      is_active: true,
    },
    order: [["holiday_date", "ASC"]],
  });

  return holidays;
};