import { Router } from "express";
import {
  addLeavePolicy,
  editLeavePolicy,
  getLeavePolicyList,
} from "../controllers/leavePolicy.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import { validateRequest } from "../middleware/validateRequest.middleware";
import {
  createLeavePolicyValidator,
  getLeavePoliciesValidator,
  updateLeavePolicyValidator,
} from "../validators/leavePolicy.validator";

const router = Router();

router.get(
  "/",
  authenticate,
  getLeavePoliciesValidator,
  validateRequest,
  getLeavePolicyList
);

router.post(
  "/",
  authenticate,
  authorizeRoles("HR", "ADMIN"),
  createLeavePolicyValidator,
  validateRequest,
  addLeavePolicy
);

router.patch(
  "/:id",
  authenticate,
  authorizeRoles("HR", "ADMIN"),
  updateLeavePolicyValidator,
  validateRequest,
  editLeavePolicy
);

export default router;