import { Router } from "express";
import { getMyMonthlyCalendar } from "../controllers/calendar.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validateRequest.middleware";
import { monthlyAttendanceValidator } from "../validators/attendance.validator";

const router = Router();

router.get(
  "/monthly",
  authenticate,
  monthlyAttendanceValidator,
  validateRequest,
  getMyMonthlyCalendar
);

export default router;