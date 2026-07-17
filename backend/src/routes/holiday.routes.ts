import { Router } from "express";
import {
  addHoliday,
  getHolidayList,
} from "../controllers/holiday.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import { validateRequest } from "../middleware/validateRequest.middleware";
import {
  createHolidayValidator,
  getHolidaysValidator,
} from "../validators/holiday.validator";

const router = Router();

router.get(
  "/",
  authenticate,
  getHolidaysValidator,
  validateRequest,
  getHolidayList
);

router.post(
  "/",
  authenticate,
  authorizeRoles("HR", "ADMIN"),
  createHolidayValidator,
  validateRequest,
  addHoliday
);

export default router;