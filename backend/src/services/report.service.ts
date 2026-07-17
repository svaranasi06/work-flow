import { Op, WhereOptions } from "sequelize";
import db from "../models";
import {
  LeaveStatus,
  LeaveType,
} from "../models/leaveRequest.model";

interface LeaveReportFilters {
  year?: number;
  status?: LeaveStatus;
  leave_type?: LeaveType;
  department_id?: number;
  page?: number;
  limit?: number;
}

export const getLeaveReport = async (
  filters: LeaveReportFilters
) => {
  const {
    year,
    status,
    leave_type,
    department_id,
    page = 1,
    limit = 10,
  } = filters;

  const leaveWhere: WhereOptions = {};
  const employeeWhere: WhereOptions = {};

  if (year) {
    const yearStartDate = `${year}-01-01`;
    const yearEndDate = `${year}-12-31`;

    Object.assign(leaveWhere, {
      start_date: {
        [Op.lte]: yearEndDate,
      },
      end_date: {
        [Op.gte]: yearStartDate,
      },
    });
  }

  if (status) {
    Object.assign(leaveWhere, {
      status,
    });
  }

  if (leave_type) {
    Object.assign(leaveWhere, {
      leave_type,
    });
  }

  if (department_id) {
    Object.assign(employeeWhere, {
      department_id,
    });
  }

  const offset = (page - 1) * limit;

  const result = await db.LeaveRequest.findAndCountAll({
    where: leaveWhere,

    include: [
      {
        model: db.User,
        as: "employee",
        required: true,
        where:
          Object.keys(employeeWhere).length > 0
            ? employeeWhere
            : undefined,
        attributes: [
          "id",
          "name",
          "emp_id",
          "email",
          "role",
          "department_id",
        ],
        include: [
          {
            model: db.Department,
            as: "department",
            attributes: ["id", "name"],
          },
        ],
      },
      {
        model: db.User,
        as: "approver",
        attributes: ["id", "name", "emp_id", "role"],
        required: false,
      },
      {
        model: db.User,
        as: "approvedByUser",
        attributes: ["id", "name", "emp_id", "role"],
        required: false,
      },
    ],

    order: [["created_at", "DESC"]],

    limit,
    offset,

    distinct: true,
  });

  const totalRecords = result.count;
  const totalPages = Math.ceil(totalRecords / limit);

  return {
    filters: {
      year: year || null,
      status: status || null,
      leave_type: leave_type || null,
      department_id: department_id || null,
    },
    pagination: {
      current_page: page,
      records_per_page: limit,
      total_records: totalRecords,
      total_pages: totalPages,
    },
    records: result.rows,
  };
};