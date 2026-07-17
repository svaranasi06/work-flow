import { Router } from "express";
import { getMyDashboard } from "../controllers/dashboard.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, getMyDashboard);

export default router;