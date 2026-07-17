import { Request, Response } from "express";
import {
   applyLeave,
   getMyLeaves,
   getManagerPendingLeaves,
   approveLeaveByManager,
   rejectLeaveByManager,
   getHrPendingLeaves,
   approveLeaveByHr,
   rejectLeaveByHr,
   cancelPendingLeave,
   getLeaveSummary
  } from "../services/leave.service";

export const applyLeaveRequest = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const { leave_type, reason, start_date, end_date, is_half_day, is_emergency } =
      req.body;

    const leaveRequest = await applyLeave({
      employee_id: req.user.id,
      leave_type,
      reason,
      start_date,
      end_date,
      is_half_day,
      is_emergency,
    });

    return res.status(201).json({
      success: true,
      message: "Leave request submitted successfully",
      data: leaveRequest,
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

export const getMyLeaveRequests = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const leaves = await getMyLeaves(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Leave requests fetched successfully",
      data: leaves,
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


export const getManagerPendingLeaveRequests = async (
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

    const pendingLeaves = await getManagerPendingLeaves(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Manager pending leave requests fetched successfully",
      data: pendingLeaves,
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


export const approveLeaveRequestByManager = async (
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

    const leaveRequestId = Number(req.params.id);
    const { manager_remarks } = req.body;

    if (!leaveRequestId) {
      return res.status(400).json({
        success: false,
        message: "Valid leave request ID is required",
      });
    }

    const leaveRequest = await approveLeaveByManager(
      leaveRequestId,
      req.user.id,
      manager_remarks
    );

    return res.status(200).json({
      success: true,
      message: "Leave request approved successfully",
      data: leaveRequest,
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

export const rejectLeaveRequestByManager = async (
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

    const leaveRequestId = Number(req.params.id);
    const { manager_remarks } = req.body;

    if (!leaveRequestId) {
      return res.status(400).json({
        success: false,
        message: "Valid leave request ID is required",
      });
    }

    const leaveRequest = await rejectLeaveByManager(
      leaveRequestId,
      req.user.id,
      manager_remarks
    );

    return res.status(200).json({
      success: true,
      message: "Leave request rejected successfully",
      data: leaveRequest,
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

export const getHrPendingLeaveRequests = async (
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

    const pendingLeaves = await getHrPendingLeaves(req.user.id);

    return res.status(200).json({
      success: true,
      message: "HR pending leave requests fetched successfully",
      data: pendingLeaves,
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


export const approveLeaveRequestByHr = async (
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

    const leaveRequestId = Number(req.params.id);
    const { hr_remarks } = req.body;

    if (!leaveRequestId) {
      return res.status(400).json({
        success: false,
        message: "Valid leave request ID is required",
      });
    }

    const leaveRequest = await approveLeaveByHr(
      leaveRequestId,
      req.user.id,
      hr_remarks
    );

    return res.status(200).json({
      success: true,
      message: "Leave request approved successfully by HR",
      data: leaveRequest,
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

export const rejectLeaveRequestByHr = async (
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

    const leaveRequestId = Number(req.params.id);
    const { hr_remarks } = req.body;

    if (!leaveRequestId) {
      return res.status(400).json({
        success: false,
        message: "Valid leave request ID is required",
      });
    }

    const leaveRequest = await rejectLeaveByHr(
      leaveRequestId,
      req.user.id,
      hr_remarks
    );

    return res.status(200).json({
      success: true,
      message: "Leave request rejected successfully by HR",
      data: leaveRequest,
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

export const cancelMyPendingLeave = async (
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

    const leaveRequestId = Number(req.params.id);

    if (
      !Number.isInteger(leaveRequestId) ||
      leaveRequestId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid leave request ID is required",
      });
    }

    const cancelledLeave = await cancelPendingLeave(
      leaveRequestId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Leave request cancelled successfully",
      data: cancelledLeave,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};

export const getMyLeaveSummary = async (
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

    const year = Number(req.query.year);

    const leaveSummary = await getLeaveSummary(
      req.user.id,
      year
    );

    return res.status(200).json({
      success: true,
      message: "Leave summary fetched successfully",
      data: leaveSummary,
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

