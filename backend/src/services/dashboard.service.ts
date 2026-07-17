import { Op } from "sequelize";
import db from "../models";

const calculateAttendancePercentage = (
  attendanceRecords: Array<{ status: string }>
): number => {
  const eligibleRecords = attendanceRecords.filter((record) =>
    ["PRESENT", "WFH", "REGULARIZED", "HALF_DAY", "ABSENT"].includes(
      record.status
    )
  );

  if (eligibleRecords.length === 0) {
    return 0;
  }

  const attendedDays = eligibleRecords.reduce((total, record) => {
    if (
      record.status === "PRESENT" ||
      record.status === "WFH" ||
      record.status === "REGULARIZED"
    ) {
      return total + 1;
    }

    if (record.status === "HALF_DAY") {
      return total + 0.5;
    }

    return total;
  }, 0);

  return Number(
    ((attendedDays / eligibleRecords.length) * 100).toFixed(2)
  );
};

export const getDashboardData = async (userId: number) => {
  const user = await db.User.findOne({
    where: {
      id: userId,
      is_active: true,
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
    throw new Error("User not found or inactive");
  }

  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const monthValue = String(currentMonth).padStart(2, "0");

  const monthStartDate = `${currentYear}-${monthValue}-01`;

  const monthLastDate = new Date(
    currentYear,
    currentMonth,
    0
  ).getDate();

  const monthEndDate = `${currentYear}-${monthValue}-${String(
    monthLastDate
  ).padStart(2, "0")}`;

  const today = currentDate.toISOString().split("T")[0];

  const pendingApprovalWhere =
    user.role === "MANAGER"
      ? {
          approver_id: user.id,
          status: "PENDING",
          approval_stage: "MANAGER_REVIEW",
        }
      : user.role === "HR"
      ? {
          approver_id: user.id,
          status: "PENDING",
          approval_stage: "HR_REVIEW",
        }
      : {
          employee_id: user.id,
          status: "PENDING",
        };

  const [
    recentLeaveRequests,
    pendingApprovalCount,
    upcomingHolidays,
    monthlyAttendance,
  ] = await Promise.all([
    db.LeaveRequest.findAll({
      where: {
        employee_id: user.id,
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
        "created_at",
      ],
      order: [["created_at", "DESC"]],
      limit: 5,
    }),

    db.LeaveRequest.count({
      where: pendingApprovalWhere,
    }),

    db.Holiday.findAll({
      where: {
        holiday_date: {
          [Op.gte]: today,
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
      order: [["holiday_date", "ASC"]],
      limit: 3,
    }),

    db.Attendance.findAll({
      where: {
        employee_id: user.id,
        date: {
          [Op.between]: [monthStartDate, monthEndDate],
        },
      },
      attributes: ["status"],
    }),
  ]);

  const attendancePercentage =
    calculateAttendancePercentage(monthlyAttendance);

  return {
    user: {
      id: user.id,
      name: user.name,
      emp_id: user.emp_id,
      email: user.email,
      role: user.role,
      department: user.get("department"),
    },
    leave_balance: user.get("leaveBalance"),
    pending_count: pendingApprovalCount,
    attendance_percentage: attendancePercentage,
    upcoming_holidays: upcomingHolidays,
    recent_leave_applications: recentLeaveRequests,
  };
};