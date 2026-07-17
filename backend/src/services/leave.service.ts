import { Op } from "sequelize";
import db from "../models";
import { LeaveType } from "../models/leaveRequest.model";


interface ApplyLeaveInput {
  employee_id: number;
  leave_type: LeaveType;
  reason: string;
  start_date: string;
  end_date: string;
  is_half_day?: boolean;
  is_emergency?: boolean;
}


const getDateKeysInRange = (
  startDate: string,
  endDate: string
): string[] => {
  const dateKeys: string[] = [];

  const currentDate = new Date(
    `${startDate}T00:00:00Z`
  );

  const finalDate = new Date(
    `${endDate}T00:00:00Z`
  );

  while (currentDate <= finalDate) {
    const year =
      currentDate.getUTCFullYear();

    const month = String(
      currentDate.getUTCMonth() + 1
    ).padStart(2, "0");

    const day = String(
      currentDate.getUTCDate()
    ).padStart(2, "0");

    dateKeys.push(
      `${year}-${month}-${day}`
    );

    currentDate.setUTCDate(
      currentDate.getUTCDate() + 1
    );
  }

  return dateKeys;
};

const isWeekendDate = (
  dateKey: string
): boolean => {
  const date = new Date(
    `${dateKey}T00:00:00Z`
  );
//utc function is used like This helps prevent a date from changing because of the server’s timezone.
//saturday to sunday is true
//monday is false
  const dayOfWeek =
    date.getUTCDay();

  return (
    dayOfWeek === 0 ||
    dayOfWeek === 6
  );
};

const formatHolidayDateKey = (
  holidayDate: string | Date
): string => {
  if (holidayDate instanceof Date) {
    return holidayDate
      .toISOString()
      .slice(0, 10);
  }

  return String(
    holidayDate
  ).slice(0, 10);
};

const getAvailableBalance = (
  leaveBalance: any,
  leaveType: LeaveType
): number => {
  switch (leaveType) {
    case "ANNUAL":
      return leaveBalance.annual_leave_balance;

    case "PATERNITY":
      return leaveBalance.paternity_leave_balance;

    case "BEREAVEMENT":
      return leaveBalance.bereavement_leave_balance;

    case "COMPOFF":
      return leaveBalance.compoff_leave_balance;

    default:
      return 0;
  }
};

export const applyLeave = async (leaveData: ApplyLeaveInput) => {
  const {
    employee_id,
    leave_type,
    reason,
    start_date,
    end_date,
    is_half_day = false,
    is_emergency = false,
  } = leaveData;

  const employee = await db.User.findOne({
    where: {
      id: employee_id,
      is_active: true,
    },
  });

if (!employee) {
  throw new Error(
    "Employee not found or inactive"
  );
}

const requestedStartDate =
  new Date(
    `${start_date}T00:00:00Z`
  );

const requestedEndDate =
  new Date(
    `${end_date}T00:00:00Z`
  );

if (
  Number.isNaN(
    requestedStartDate.getTime()
  ) ||
  Number.isNaN(
    requestedEndDate.getTime()
  )
) {
  throw new Error(
    "Invalid start date or end date"
  );
}

if (
  requestedEndDate <
  requestedStartDate
) {
  throw new Error(
    "End date cannot be before start date"
  );
}

if (
  is_half_day &&
  start_date !== end_date
) {
  throw new Error(
    "Half-day leave must use the same start and end date."
  );
}

const selectedDateKeys =
  getDateKeysInRange(
    start_date,
    end_date
  );

const publicHolidays =
  await db.Holiday.findAll({
    where: {
      holiday_date: {
        [Op.between]: [
          start_date,
          end_date,
        ],
      },
      is_active: true,
    },
    attributes: [
      "holiday_date",
      "holiday_name",
    ],
    order: [
      ["holiday_date", "ASC"],
    ],
  });

const publicHolidayDateSet =
  new Set<string>(
    publicHolidays.map(
      (holiday) =>
        formatHolidayDateKey(
          holiday.holiday_date
        )
    )
  );

const workingDateKeys =
  selectedDateKeys.filter(
    (dateKey) => {
      const isWeekend =
        isWeekendDate(dateKey);

      const isPublicHoliday =
        publicHolidayDateSet.has(
          dateKey
        );

      return (
        !isWeekend &&
        !isPublicHoliday
      );
    }
  );

if (
  workingDateKeys.length === 0
) {
  throw new Error(
    "The selected date range contains no working days. Please select at least one weekday that is not a public holiday."
  );
}

const leaveDays =
  is_half_day
    ? 0.5
    : workingDateKeys.length;

if (leaveDays <= 0) {
  throw new Error(
    "Invalid leave duration"
  );
}
  const leaveBalance = await db.LeaveBalance.findOne({
    where: {
      user_id: employee.id,
    },
  });

  if (!leaveBalance) {
    throw new Error("Leave balance not found");
  }

  const availableBalance = getAvailableBalance(leaveBalance, leave_type);

  if (availableBalance < leaveDays) {
    throw new Error("Insufficient leave balance");
  }

  const duplicateLeave = await db.LeaveRequest.findOne({
    where: {
      employee_id: employee.id,
      status: {
        [Op.in]: ["PENDING", "APPROVED"],
      },
      start_date: {
        [Op.lte]: end_date,
      },
      end_date: {
        [Op.gte]: start_date,
      },
    },
  });

  if (duplicateLeave) {
    throw new Error("Leave request already exists for selected date range");
  }

  let approvalStage: "MANAGER_REVIEW" | "HR_REVIEW";
  let approverId: number | null = null;

  if (employee.role === "ASSOCIATE") {
    if (!employee.manager_id) {
      throw new Error("Reporting manager is not assigned");
    }

    approvalStage = "MANAGER_REVIEW";
    approverId = employee.manager_id;
  } else if (employee.role === "MANAGER") {
    const hrUser = await db.User.findOne({
      where: {
        role: "HR",
        is_active: true,
      },
    });

    if (!hrUser) {
      throw new Error("HR approver not found");
    }

    approvalStage = "HR_REVIEW";
    approverId = hrUser.id;
  } else {
    throw new Error("Leave application is not allowed for this role currently");
  }

  const leaveRequest = await db.LeaveRequest.create({
    employee_id: employee.id,
    leave_type,
    reason,
    start_date: new Date(start_date),
    end_date: new Date(end_date),
    days: leaveDays,
    status: "PENDING",
    approval_stage: approvalStage,
    approver_id: approverId,
    is_half_day,
    is_emergency,
  });

  return leaveRequest;
};


export const getMyLeaves = async (employeeId: number) => {
  const leaves = await db.LeaveRequest.findAll({
    where: {
      employee_id: employeeId,
    },
    include: [
      {
        model: db.User,
        as: "approver",
        attributes: ["id", "name", "emp_id", "role"],
      },
      {
        model: db.User,
        as: "approvedByUser",
        attributes: ["id", "name", "emp_id", "role"],
      },
    ],
    order: [["created_at", "DESC"]],
  });

  return leaves;
};

export const getManagerPendingLeaves = async (managerId: number) => {
  const pendingLeaves = await db.LeaveRequest.findAll({
    where: {
      approver_id: managerId,
      status: "PENDING",
      approval_stage: "MANAGER_REVIEW",
    },
    include: [
      {
        model: db.User,
        as: "employee",
        attributes: ["id", "name", "emp_id", "email", "role"],
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
      },
    ],
    order: [["created_at", "DESC"]],
  });

  return pendingLeaves;
};

export const approveLeaveByManager = async (
  leaveRequestId: number,
  managerId: number,
  managerRemarks?: string
) => {
  const transaction =
    await db.sequelize.transaction();  //start the transaction 

  try {
    const leaveRequest =
      await db.LeaveRequest.findOne({
        where: {
          id: leaveRequestId,
          approver_id: managerId,
          status: "PENDING",
          approval_stage: "MANAGER_REVIEW",
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

    if (!leaveRequest) {
      throw new Error(
        "Pending leave request not found for this manager"
      );
    }

    const employee = await db.User.findOne({
      where: {
        id: leaveRequest.employee_id,
        is_active: true,
      },
      attributes: [
        "id",
        "name",
        "emp_id",
        "role",
      ],
      transaction,
    });

    if (!employee) {
      throw new Error(
        "Leave applicant not found or inactive"
      );
    }

    const leaveBalance =
      await db.LeaveBalance.findOne({
        where: {
          user_id: leaveRequest.employee_id,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

    if (!leaveBalance) {
      throw new Error(
        "Leave balance not found"
      );
    }

    const availableBalance =
      getAvailableBalance(
        leaveBalance,
        leaveRequest.leave_type
      );

    if (
      availableBalance <
      leaveRequest.days
    ) {
      throw new Error(
        "Insufficient leave balance at the time of approval"
      );
    }

    if (
      leaveRequest.leave_type === "ANNUAL"
    ) {
      leaveBalance.annual_leave_balance -=
        leaveRequest.days;
    }

    if (
      leaveRequest.leave_type === "PATERNITY"
    ) {
      leaveBalance.paternity_leave_balance -=
        leaveRequest.days;
    }

    if (
      leaveRequest.leave_type ===
      "BEREAVEMENT"
    ) {
      leaveBalance.bereavement_leave_balance -=
        leaveRequest.days;
    }

    if (
      leaveRequest.leave_type === "COMPOFF"
    ) {
      leaveBalance.compoff_leave_balance -=
        leaveRequest.days;
    }

    leaveRequest.status = "APPROVED";
    leaveRequest.approval_stage = "COMPLETED";
    leaveRequest.approved_by = managerId;
    leaveRequest.approved_by_role =
      "MANAGER";
    leaveRequest.manager_remarks =
      managerRemarks?.trim() || null;
    leaveRequest.action_at = new Date();

    await leaveBalance.save({
      transaction,
    });

    await leaveRequest.save({
      transaction,
    });

    const hrUser = await db.User.findOne({
      where: {
        role: "HR",
        is_active: true,
      },
      attributes: [
        "id",
        "name",
        "emp_id",
        "role",
      ],
      transaction,
    });

    if (!hrUser) {
      throw new Error(
        "Active HR user not found"
      );
    }

    await db.Notification.create(
      {
        receiver_id: employee.id,
        sender_id: managerId,
        leave_request_id: leaveRequest.id,
        title: "Leave Request Approved",
        message:
          `Your ${leaveRequest.leave_type} leave request ` +
          `from ${leaveRequest.start_date} to ` +
          `${leaveRequest.end_date} was approved by your Manager.`,
        type: "LEAVE_APPROVED",
        is_read: false,
      },
      {
        transaction,
      }
    );

    await db.Notification.create(
      {
        receiver_id: hrUser.id,
        sender_id: managerId,
        leave_request_id: leaveRequest.id,
        title: "Associate Leave Approved",
        message:
          `Manager approved ${employee.name}'s ` +
          `${leaveRequest.leave_type} leave request.`,
        type: "HR_INFO",
        is_read: false,
      },
      {
        transaction,
      }
    );

    await transaction.commit();

    return leaveRequest;
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

export const rejectLeaveByManager = async (
  leaveRequestId: number,
  managerId: number,
  managerRemarks?: string
) => {
  const transaction =
    await db.sequelize.transaction();

  try {
    const leaveRequest =
      await db.LeaveRequest.findOne({
        where: {
          id: leaveRequestId,
          approver_id: managerId,
          status: "PENDING",
          approval_stage: "MANAGER_REVIEW",
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

    if (!leaveRequest) {
      throw new Error(
        "Pending leave request not found for this manager"
      );
    }

    const employee = await db.User.findOne({
      where: {
        id: leaveRequest.employee_id,
        is_active: true,
      },
      attributes: [
        "id",
        "name",
        "emp_id",
        "role",
      ],
      transaction,
    });

    if (!employee) {
      throw new Error(
        "Leave applicant not found or inactive"
      );
    }

    const trimmedRemarks =
      managerRemarks?.trim() || "";

    if (trimmedRemarks.length < 5) {
      throw new Error(
        "Manager remarks must contain at least 5 characters for rejection"
      );
    }

    leaveRequest.status = "REJECTED";
    leaveRequest.approval_stage = "COMPLETED";
    leaveRequest.approved_by = managerId;
    leaveRequest.approved_by_role =
      "MANAGER";
    leaveRequest.manager_remarks =
      trimmedRemarks;
    leaveRequest.action_at = new Date();

    await leaveRequest.save({
      transaction,
    });

    const hrUser = await db.User.findOne({
      where: {
        role: "HR",
        is_active: true,
      },
      attributes: [
        "id",
        "name",
        "emp_id",
        "role",
      ],
      transaction,
    });

    if (!hrUser) {
      throw new Error(
        "Active HR user not found"
      );
    }

    await db.Notification.create(
      {
        receiver_id: employee.id,
        sender_id: managerId,
        leave_request_id: leaveRequest.id,
        title: "Leave Request Rejected",
        message:
          `Your ${leaveRequest.leave_type} leave request ` +
          `from ${leaveRequest.start_date} to ` +
          `${leaveRequest.end_date} was rejected by your Manager.`,
        type: "LEAVE_REJECTED",
        is_read: false,
      },
      {
        transaction,
      }
    );

    await db.Notification.create(
      {
        receiver_id: hrUser.id,
        sender_id: managerId,
        leave_request_id: leaveRequest.id,
        title: "Associate Leave Rejected",
        message:
          `Manager rejected ${employee.name}'s ` +
          `${leaveRequest.leave_type} leave request.`,
        type: "HR_INFO",
        is_read: false,
      },
      {
        transaction,
      }
    );

    await transaction.commit();

    return leaveRequest;
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};


export const getHrPendingLeaves = async (hrId: number) => {
  const pendingLeaves = await db.LeaveRequest.findAll({
    where: {
      approver_id: hrId,
      status: "PENDING",
      approval_stage: "HR_REVIEW",
    },
    include: [
      {
        model: db.User,
        as: "employee",
        attributes: ["id", "name", "emp_id", "email", "role"],
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
      },
    ],
    order: [["created_at", "DESC"]],
  });

  return pendingLeaves;
};


export const approveLeaveByHr = async (
  leaveRequestId: number,
  hrId: number,
  hrRemarks?: string
) => {
  const transaction =
    await db.sequelize.transaction();

  try {
    const leaveRequest =
      await db.LeaveRequest.findOne({
        where: {
          id: leaveRequestId,
          approver_id: hrId,
          status: "PENDING",
          approval_stage: "HR_REVIEW",
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

    if (!leaveRequest) {
      throw new Error(
        "Pending leave request not found for this HR"
      );
    }

    const employee =
      await db.User.findOne({
        where: {
          id: leaveRequest.employee_id,
          is_active: true,
        },
        attributes: [
          "id",
          "name",
          "emp_id",
          "role",
        ],
        transaction,
      });

    if (!employee) {
      throw new Error(
        "Leave applicant not found or inactive"
      );
    }

    const leaveBalance =
      await db.LeaveBalance.findOne({
        where: {
          user_id:
            leaveRequest.employee_id,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

    if (!leaveBalance) {
      throw new Error(
        "Leave balance not found"
      );
    }

    const availableBalance =
      getAvailableBalance(
        leaveBalance,
        leaveRequest.leave_type
      );

    if (
      availableBalance <
      leaveRequest.days
    ) {
      throw new Error(
        "Insufficient leave balance at the time of approval"
      );
    }

    if (
      leaveRequest.leave_type ===
      "ANNUAL"
    ) {
      leaveBalance
        .annual_leave_balance -=
        leaveRequest.days;
    }

    if (
      leaveRequest.leave_type ===
      "PATERNITY"
    ) {
      leaveBalance
        .paternity_leave_balance -=
        leaveRequest.days;
    }

    if (
      leaveRequest.leave_type ===
      "BEREAVEMENT"
    ) {
      leaveBalance
        .bereavement_leave_balance -=
        leaveRequest.days;
    }

    if (
      leaveRequest.leave_type ===
      "COMPOFF"
    ) {
      leaveBalance
        .compoff_leave_balance -=
        leaveRequest.days;
    }

    leaveRequest.status =
      "APPROVED";

    leaveRequest.approval_stage =
      "COMPLETED";

    leaveRequest.approved_by =
      hrId;

    leaveRequest.approved_by_role =
      "HR";

    leaveRequest.hr_remarks =
      hrRemarks?.trim() || null;

    leaveRequest.action_at =
      new Date();

    await leaveBalance.save({
      transaction,
    });

    await leaveRequest.save({
      transaction,
    });

    await db.Notification.create(
      {
        receiver_id: employee.id,
        sender_id: hrId,
        leave_request_id:
          leaveRequest.id,
        title:
          "Leave Request Approved",
        message:
          `Your ${leaveRequest.leave_type} leave request ` +
          `from ${leaveRequest.start_date} to ` +
          `${leaveRequest.end_date} was approved by HR.`,
        type: "LEAVE_APPROVED",
        is_read: false,
      },
      {
        transaction,
      }
    );

    await transaction.commit();

    return leaveRequest;
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

export const rejectLeaveByHr = async (
  leaveRequestId: number,
  hrId: number,
  hrRemarks?: string
) => {
  const transaction =
    await db.sequelize.transaction();

  try {
    const leaveRequest =
      await db.LeaveRequest.findOne({
        where: {
          id: leaveRequestId,
          approver_id: hrId,
          status: "PENDING",
          approval_stage: "HR_REVIEW",
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

    if (!leaveRequest) {
      throw new Error(
        "Pending leave request not found for this HR"
      );
    }

    const employee =
      await db.User.findOne({
        where: {
          id: leaveRequest.employee_id,
          is_active: true,
        },
        attributes: [
          "id",
          "name",
          "emp_id",
          "role",
        ],
        transaction,
      });

    if (!employee) {
      throw new Error(
        "Leave applicant not found or inactive"
      );
    }

    const trimmedRemarks =
      hrRemarks?.trim() || "";

    if (trimmedRemarks.length < 5) {
      throw new Error(
        "HR remarks must contain at least 5 characters for rejection"
      );
    }

    leaveRequest.status =
      "REJECTED";

    leaveRequest.approval_stage =
      "COMPLETED";

    leaveRequest.approved_by =
      hrId;

    leaveRequest.approved_by_role =
      "HR";

    leaveRequest.hr_remarks =
      trimmedRemarks;

    leaveRequest.action_at =
      new Date();

    await leaveRequest.save({
      transaction,
    });

    await db.Notification.create(
      {
        receiver_id: employee.id,
        sender_id: hrId,
        leave_request_id:
          leaveRequest.id,
        title:
          "Leave Request Rejected",
        message:
          `Your ${leaveRequest.leave_type} leave request ` +
          `from ${leaveRequest.start_date} to ` +
          `${leaveRequest.end_date} was rejected by HR.`,
        type: "LEAVE_REJECTED",
        is_read: false,
      },
      {
        transaction,
      }
    );

    await transaction.commit();

    return leaveRequest;
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};


const getActiveHrUser = async () => {
  const hrUser = await db.User.findOne({
    where: {
      role: "HR",
      is_active: true,
    },
  });

  if (!hrUser) {
    throw new Error("Active HR user not found");
  }

  return hrUser;
};

export const cancelPendingLeave = async (
  leaveRequestId: number,
  employeeId: number
) => {
  const leaveRequest = await db.LeaveRequest.findOne({
    where: {
      id: leaveRequestId,
      employee_id: employeeId,
      status: "PENDING",
    },
  });

  if (!leaveRequest) {
    throw new Error(
      "Pending leave request not found or you are not allowed to cancel it"
    );
  }

  leaveRequest.status = "CANCELLED";
  leaveRequest.approval_stage = "COMPLETED";
  leaveRequest.approver_id = null;
  leaveRequest.action_at = new Date();

  await leaveRequest.save();

  return leaveRequest;
};

export const getLeaveSummary = async (
  employeeId: number,
  year: number
) => {
  const leaveBalance = await db.LeaveBalance.findOne({
    where: {
      user_id: employeeId,
    },
  });

  if (!leaveBalance) {
    throw new Error("Leave balance not found");
  }

  const yearStartDate = `${year}-01-01`;
  const yearEndDate = `${year}-12-31`;

  const leaveRequests = await db.LeaveRequest.findAll({
    where: {
      employee_id: employeeId,
      status: {
        [Op.in]: ["PENDING", "APPROVED"],
      },
      start_date: {
        [Op.lte]: yearEndDate,
      },
      end_date: {
        [Op.gte]: yearStartDate,
      },
    },
    attributes: [
      "leave_type",
      "days",
      "status",
      "start_date",
      "end_date",
    ],
  });

  const leaveTypes = [
    {
      leave_type: "ANNUAL",
      display_name: "Annual Leave",
      available: leaveBalance.annual_leave_balance,
    },
    {
      leave_type: "PATERNITY",
      display_name: "Paternity Leave",
      available: leaveBalance.paternity_leave_balance,
    },
    {
      leave_type: "BEREAVEMENT",
      display_name: "Bereavement Leave",
      available: leaveBalance.bereavement_leave_balance,
    },
    {
      leave_type: "COMPOFF",
      display_name: "Comp Off",
      available: leaveBalance.compoff_leave_balance,
    },
  ] as const;

  const summary = leaveTypes.map((leaveType) => {
    const relevantRequests = leaveRequests.filter(
      (request) => request.leave_type === leaveType.leave_type
    );

    const pending = relevantRequests
      .filter((request) => request.status === "PENDING")
      .reduce((total, request) => total + request.days, 0);

    const used = relevantRequests
      .filter((request) => request.status === "APPROVED")
      .reduce((total, request) => total + request.days, 0);

    return {
      leave_type: leaveType.leave_type,
      display_name: leaveType.display_name,
      available: leaveType.available,
      pending,
      used,
      lapsed: 0,
    };
  });

  return {
    year,
    summary,
  };
};