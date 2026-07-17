import { Op } from "sequelize";

import db from "../models";

export const getMonthlyCalendarData =
  async (
    employeeId: number,
    month: number,
    year: number
  ) => {
    const monthValue =
      String(month).padStart(2, "0");

    const lastDate =
      new Date(
        year,
        month,
        0
      ).getDate();

    const startDate =
      `${year}-${monthValue}-01`;

    const endDate =
      `${year}-${monthValue}-${String(
        lastDate
      ).padStart(2, "0")}`;

    const [
      leaveRequests,
      holidays,
    ] = await Promise.all([
      db.LeaveRequest.findAll({
        where: {
          employee_id: employeeId,

          status: {
            [Op.in]: [
              "PENDING",
              "APPROVED",
            ],
          },

          start_date: {
            [Op.lte]: endDate,
          },

          end_date: {
            [Op.gte]: startDate,
          },
        },

        attributes: [
          "id",
          "leave_type",
          "reason",
          "start_date",
          "end_date",
          "days",
          "status",
          "approval_stage",
          "manager_remarks",
          "hr_remarks",
          "is_half_day",
          "is_emergency",
        ],

        order: [
          ["start_date", "ASC"],
        ],
      }),

      db.Holiday.findAll({
        where: {
          holiday_date: {
            [Op.between]: [
              startDate,
              endDate,
            ],
          },

          is_active: true,
        },

        attributes: [
          "id",
          "holiday_name",
          "holiday_date",
          "holiday_type",
          "description",
        ],

        order: [
          ["holiday_date", "ASC"],
        ],
      }),
    ]);

    const weekends: string[] = [];

    for (
      let day = 1;
      day <= lastDate;
      day += 1
    ) {
      const currentDate =
        new Date(
          Date.UTC(
            year,
            month - 1,
            day
          )
        );

      const dayOfWeek =
        currentDate.getUTCDay();

      if (
        dayOfWeek === 0 ||
        dayOfWeek === 6
      ) {
        const formattedDate =
          `${year}-${monthValue}-${String(
            day
          ).padStart(2, "0")}`;

        weekends.push(
          formattedDate
        );
      }
    }

    return {
      month,
      year,
      start_date: startDate,
      end_date: endDate,
      leaves: leaveRequests,
      holidays,
      weekends,
    };
  };