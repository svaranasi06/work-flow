import { Router } from "express";
import { 
  applyLeaveRequest,
  getMyLeaveRequests,
  getManagerPendingLeaveRequests ,
  approveLeaveRequestByManager,
  rejectLeaveRequestByManager,
  getHrPendingLeaveRequests,
  approveLeaveRequestByHr,
  rejectLeaveRequestByHr,
  cancelMyPendingLeave,
  getMyLeaveSummary
} from "../controllers/leave.controller";
import { authenticate } from "../middleware/auth.middleware";
import { applyLeaveValidator,leaveSummaryValidator} from "../validators/leave.validator";
import { validateRequest } from "../middleware/validateRequest.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

router.post(
  "/apply",
  authenticate,
  applyLeaveValidator,
  validateRequest,
  applyLeaveRequest
);

router.get("/my-leaves", authenticate, getMyLeaveRequests);


router.get(
  "/manager/pending",
  authenticate,
  authorizeRoles("MANAGER"),
  getManagerPendingLeaveRequests
);

router.post(
  "/manager/:id/approve",
  authenticate,
  authorizeRoles("MANAGER"),
  approveLeaveRequestByManager
);

router.post(
  "/manager/:id/reject",
  authenticate,
  authorizeRoles("MANAGER"),
  rejectLeaveRequestByManager
);

router.get(
  "/hr/pending",
  authenticate,
  authorizeRoles("HR"),
  getHrPendingLeaveRequests
);

router.post(
  "/hr/:id/approve",
  authenticate,
  authorizeRoles("HR"),
  approveLeaveRequestByHr
);

router.post(
  "/hr/:id/reject",
  authenticate,
  authorizeRoles("HR"),
  rejectLeaveRequestByHr
);

router.patch(
  "/:id/cancel",
  authenticate,
  cancelMyPendingLeave
);

router.get(
  "/summary",
  authenticate,
  leaveSummaryValidator,
  validateRequest,
  getMyLeaveSummary
);



export default router;