import { Router } from "express";
import { getLeaveReportList } from "../controllers/report.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import { validateRequest } from "../middleware/validateRequest.middleware";
import { leaveReportValidator } from "../validators/report.validator";

const router = Router();

router.get(
  "/leaves",
  authenticate,
  authorizeRoles("HR", "ADMIN"),
  leaveReportValidator,
  validateRequest,
  getLeaveReportList
);

export default router;