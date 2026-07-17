import { getMyMonthlyAttendance } from "../controllers/attendance.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validateRequest.middleware";
import { monthlyAttendanceValidator } from "../validators/attendance.validator";
import { Router } from "express";

const router = Router();

router.get(
  "/monthly",
  authenticate,
  monthlyAttendanceValidator,
  validateRequest,
  getMyMonthlyAttendance
);

export default router;