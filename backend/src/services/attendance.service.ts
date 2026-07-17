import { Op } from "sequelize";
import db from "../models";

export const getMonthlyAttendance = async (
  employeeId: number,
  month: number,
  year: number
) => {
  const firstDay = `${year}-${String(month).padStart(2, "0")}-01`;

  const lastDate = new Date(year, month, 0).getDate();

  const lastDay = `${year}-${String(month).padStart(2, "0")}-${String(
    lastDate
  ).padStart(2, "0")}`;

  const attendanceRecords = await db.Attendance.findAll({
    where: {
      employee_id: employeeId,
      date: {
        [Op.between]: [firstDay, lastDay],
      },
    },
    order: [["date", "ASC"]],
  });

  return attendanceRecords;
};