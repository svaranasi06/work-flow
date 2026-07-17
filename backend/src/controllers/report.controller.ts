import { Request, Response } from "express";
import { getLeaveReport } from "../services/report.service";
import {
  LeaveStatus,
  LeaveType,
} from "../models/leaveRequest.model";

export const getLeaveReportList = async (
  req: Request,
  res: Response
) => {
  try {
    const year = req.query.year
      ? Number(req.query.year)
      : undefined;

    const status = req.query.status
      ? (req.query.status as LeaveStatus)
      : undefined;

    const leaveType = req.query.leave_type
      ? (req.query.leave_type as LeaveType)
      : undefined;

    const departmentId = req.query.department_id
      ? Number(req.query.department_id)
      : undefined;

    const page = req.query.page
      ? Number(req.query.page)
      : 1;

    const limit = req.query.limit
      ? Number(req.query.limit)
      : 10;

    const report = await getLeaveReport({
      year,
      status,
      leave_type: leaveType,
      department_id: departmentId,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      message: "Leave report fetched successfully",
      data: report,
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