import "dotenv/config";

import db from "../models";

import { hashPassword } from "../utils/password.util";

const seedDatabase = async (): Promise<void> => {
  try {
    await db.sequelize.authenticate();

    console.log("Database connected successfully");

    const [
      engineeringDepartment,
    ] = await db.Department.findOrCreate({
      where: {
        name: "Engineering",
      },
      defaults: {
        name: "Engineering",
        description:
          "Software development and technical delivery team",
        is_active: true,
      },
    });

    const [
      hrDepartment,
    ] = await db.Department.findOrCreate({
      where: {
        name: "Human Resources",
      },
      defaults: {
        name: "Human Resources",
        description:
          "HR and employee policy management team",
        is_active: true,
      },
    });

    const hashedPassword =
      await hashPassword("password123");

    const [managerOne] =
      await db.User.findOrCreate({
        where: {
          emp_id: "MGR001",
        },
        defaults: {
          name: "Project Manager",
          emp_id: "MGR001",
          email: "manager@example.com",
          password: hashedPassword,
          role: "MANAGER",
          department_id:
            engineeringDepartment.id,
          manager_id: null,
          is_active: true,
        },
      });

    const [managerTwo] =
      await db.User.findOrCreate({
        where: {
          emp_id: "MGR002",
        },
        defaults: {
          name: "Development Manager",
          emp_id: "MGR002",
          email: "manager2@example.com",
          password: hashedPassword,
          role: "MANAGER",
          department_id:
            engineeringDepartment.id,
          manager_id: null,
          is_active: true,
        },
      });

    const [hrOne] =
      await db.User.findOrCreate({
        where: {
          emp_id: "HR001",
        },
        defaults: {
          name: "HR User",
          emp_id: "HR001",
          email: "hr@example.com",
          password: hashedPassword,
          role: "HR",
          department_id:
            hrDepartment.id,
          manager_id: null,
          is_active: true,
        },
      });

    const [hrTwo] =
      await db.User.findOrCreate({
        where: {
          emp_id: "HR002",
        },
        defaults: {
          name: "HR Executive",
          emp_id: "HR002",
          email: "hr2@example.com",
          password: hashedPassword,
          role: "HR",
          department_id:
            hrDepartment.id,
          manager_id: null,
          is_active: true,
        },
      });

    const [associateOne] =
      await db.User.findOrCreate({
        where: {
          emp_id: "ASC001",
        },
        defaults: {
          name: "Associate User",
          emp_id: "ASC001",
          email: "associate@example.com",
          password: hashedPassword,
          role: "ASSOCIATE",
          department_id:
            engineeringDepartment.id,
          manager_id: managerOne.id,
          is_active: true,
        },
      });

    const [associateTwo] =
      await db.User.findOrCreate({
        where: {
          emp_id: "ASC002",
        },
        defaults: {
          name: "Associate Two",
          emp_id: "ASC002",
          email: "associate2@example.com",
          password: hashedPassword,
          role: "ASSOCIATE",
          department_id:
            engineeringDepartment.id,
          manager_id: managerTwo.id,
          is_active: true,
        },
      });

    const [associateThree] =
      await db.User.findOrCreate({
        where: {
          emp_id: "ASC003",
        },
        defaults: {
          name: "Associate Three",
          emp_id: "ASC003",
          email: "associate3@example.com",
          password: hashedPassword,
          role: "ASSOCIATE",
          department_id:
            engineeringDepartment.id,
          manager_id: managerTwo.id,
          is_active: true,
        },
      });

    await managerOne.update({
      name: "Project Manager",
      email: "manager@example.com",
      role: "MANAGER",
      department_id:
        engineeringDepartment.id,
      manager_id: null,
      is_active: true,
    });

    await managerTwo.update({
      name: "Development Manager",
      email: "manager2@example.com",
      role: "MANAGER",
      department_id:
        engineeringDepartment.id,
      manager_id: null,
      is_active: true,
    });

    await hrOne.update({
      name: "HR User",
      email: "hr@example.com",
      role: "HR",
      department_id:
        hrDepartment.id,
      manager_id: null,
      is_active: true,
    });

    await hrTwo.update({
      name: "HR Executive",
      email: "hr2@example.com",
      role: "HR",
      department_id:
        hrDepartment.id,
      manager_id: null,
      is_active: true,
    });

    await associateOne.update({
      name: "Associate User",
      email: "associate@example.com",
      role: "ASSOCIATE",
      department_id:
        engineeringDepartment.id,
      manager_id: managerOne.id,
      is_active: true,
    });

    await associateTwo.update({
      name: "Associate Two",
      email: "associate2@example.com",
      role: "ASSOCIATE",
      department_id:
        engineeringDepartment.id,
      manager_id: managerTwo.id,
      is_active: true,
    });

    await associateThree.update({
      name: "Associate Three",
      email: "associate3@example.com",
      role: "ASSOCIATE",
      department_id:
        engineeringDepartment.id,
      manager_id: managerTwo.id,
      is_active: true,
    });

    const users = [
      managerOne,
      managerTwo,
      hrOne,
      hrTwo,
      associateOne,
      associateTwo,
      associateThree,
    ];

    for (const user of users) {
      await db.LeaveBalance.findOrCreate({
        where: {
          user_id: user.id,
        },
        defaults: {
          user_id: user.id,
          annual_leave_balance: 12,
          paternity_leave_balance: 5,
          bereavement_leave_balance: 2,
          compoff_leave_balance: 4,
        },
      });
    }

    console.log(
      "Seed data inserted successfully"
    );

    console.log("");
    console.log("Available test users:");
    console.log(
      "MGR001 / password123 - Project Manager"
    );
    console.log(
      "MGR002 / password123 - Development Manager"
    );
    console.log(
      "ASC001 / password123 - Assigned to MGR001"
    );
    console.log(
      "ASC002 / password123 - Assigned to MGR002"
    );
    console.log(
      "ASC003 / password123 - Assigned to MGR002"
    );
    console.log(
      "HR001 / password123 - HR User"
    );
    console.log(
      "HR002 / password123 - HR Executive"
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Seed failed:",
      error
    );

    process.exit(1);
  }
};

void seedDatabase();