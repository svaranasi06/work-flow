import sequelize from "../database/db";

import Department from "./department.model";
import User from "./user.model";
import LeaveBalance from "./leaveBalance.model";
import RefreshToken from "./refreshToken.model";
import LeaveRequest from "./leaveRequest.model";
import Notification from "./notification.model";
import Attendance from "./attendance.model";
import Holiday from "./holiday.model";
import LeavePolicy from "./leavePolicy.model";
/*
  Department → User Relationship

  One department can have many users.
  Example:
  Engineering department can have many associates and managers.
*/
Department.hasMany(User, {
  foreignKey: "department_id",
  as: "users",
});

/*
  User → Department Relationship

  Each user belongs to one department.
  users.department_id connects to departments.id.
*/
User.belongsTo(Department, {
  foreignKey: "department_id",
  as: "department",
});

/*
  Manager → Associates Relationship

  This is a self-relationship on the users table.

  One manager can have many associates.
  Example:
  Manager user can manage multiple associate users.
*/
User.hasMany(User, {
  foreignKey: "manager_id",
  as: "associates",
});

/*
  Associate → Manager Relationship

  Each associate can have one reporting manager.
  users.manager_id connects to users.id.
*/
User.belongsTo(User, {
  foreignKey: "manager_id",
  as: "manager",
});

/*
  User → LeaveBalance Relationship

  One user has one leave balance record.

  Example:
  One employee has one record containing:
  annual_leave_balance,
  paternity_leave_balance,
  bereavement_leave_balance,
  compoff_leave_balance.
*/
User.hasOne(LeaveBalance, {
  foreignKey: "user_id",
  as: "leaveBalance",
});

/*
  LeaveBalance → User Relationship

  Each leave balance record belongs to one user.
  leave_balances.user_id connects to users.id.
*/
LeaveBalance.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

/*
  User → RefreshToken Relationship

  One user can have many refresh tokens.

  Example:
  If the same user logs in from multiple devices,
  multiple refresh token records can exist.
*/
User.hasMany(RefreshToken, {
  foreignKey: "user_id",
  as: "refreshTokens",
});

/*
  RefreshToken → User Relationship

  Each refresh token belongs to one user.
  refresh_tokens.user_id connects to users.id.
*/
RefreshToken.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

/*
  User → LeaveRequest Relationship as Employee

  One user can apply for many leave requests.

  Example:
  An associate can apply multiple leaves over time.
*/
User.hasMany(LeaveRequest, {
  foreignKey: "employee_id",
  as: "leaveRequests",
});

/*
  LeaveRequest → User Relationship as Employee

  Each leave request belongs to one employee.
  leave_requests.employee_id connects to users.id.
*/
LeaveRequest.belongsTo(User, {
  foreignKey: "employee_id",
  as: "employee",
});

/*
  User → LeaveRequest Relationship as Current Approver

  One manager or HR can have many pending approval requests.

  Example:
  Associate leave request will have approver_id as Manager ID.
  Manager leave request will have approver_id as HR ID.
*/
User.hasMany(LeaveRequest, {
  foreignKey: "approver_id",
  as: "assignedApprovals",
});

/*
  LeaveRequest → User Relationship as Current Approver

  Each leave request has one current approver.
  leave_requests.approver_id connects to users.id.
*/
LeaveRequest.belongsTo(User, {
  foreignKey: "approver_id",
  as: "approver",
});

/*
  User → LeaveRequest Relationship as Final Approver

  One manager or HR can approve/reject many leave requests.

  This is useful for reports and approval history.
*/
User.hasMany(LeaveRequest, {
  foreignKey: "approved_by",
  as: "completedApprovals",
});

/*
  LeaveRequest → User Relationship as Final Approver

  Each completed leave request stores who approved or rejected it.
  leave_requests.approved_by connects to users.id.
*/
LeaveRequest.belongsTo(User, {
  foreignKey: "approved_by",
  as: "approvedByUser",
});

/*
  Central model registry.

  This db object exports:
  - sequelize connection
  - all models

  server.ts uses db.sequelize for authentication and sync.
  Other modules can use these models through db.User, db.LeaveRequest, etc.
*/

//1. Receiver relationship
// One user can receive many notifications.One notification belongs to one receiver.

User.hasMany(Notification, {
  foreignKey: "receiver_id",
  as: "receivedNotifications",
});

Notification.belongsTo(User, {
  foreignKey: "receiver_id",
  as: "receiver",
});
//sender module
//One user can send/trigger many notifications.One notification can have one sender.

User.hasMany(Notification, {
  foreignKey: "sender_id",
  as: "sentNotifications",
});

Notification.belongsTo(User, {
  foreignKey: "sender_id",
  as: "sender",
});
//Leave request relationship
// One leave request can have many notifications.One notification can be linked to one leave request.
LeaveRequest.hasMany(Notification, {
  foreignKey: "leave_request_id",
  as: "notifications",
});

Notification.belongsTo(LeaveRequest, {
  foreignKey: "leave_request_id",
  as: "leaveRequest",
});

// One user can have many attendance records.
// Each attendance record belongs to one user.
User.hasMany(Attendance, {
  foreignKey: "employee_id",
  as: "attendanceRecords",
});

Attendance.belongsTo(User, {
  foreignKey: "employee_id",
  as: "employee",
});


const db = {
  sequelize,
  Department,
  User,
  LeaveBalance,
  RefreshToken,
  LeaveRequest,
  Notification,
  Attendance,
  Holiday,
  LeavePolicy
};

export default db;