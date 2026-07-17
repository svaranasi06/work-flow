import { Router } from "express";
import { getMyProfile } from "../controllers/profile.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, getMyProfile);

export default router;