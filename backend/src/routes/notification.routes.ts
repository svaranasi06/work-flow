import { Router } from "express";
import {
  getMyNotificationList,
  markNotificationRead,
} from "../controllers/notification.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/my-notifications", authenticate, getMyNotificationList);

router.patch("/:id/read", authenticate, markNotificationRead);

export default router;