import db from "../models";

export const getUserProfile = async (userId: number) => {
  const user = await db.User.findOne({
    where: {
      id: userId,
      is_active: true,
    },

    attributes: [
      "id",
      "name",
      "emp_id",
      "email",
      "role",
      "is_active",
      "created_at",
      "updated_at",
    ],

    include: [
      {
        model: db.Department,
        as: "department",
        attributes: ["id", "name", "description"],
      },
      {
        model: db.User,
        as: "manager",
        attributes: [
          "id",
          "name",
          "emp_id",
          "email",
          "role",
        ],
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
    throw new Error("User profile not found");
  }

  return user;
};