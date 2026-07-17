import { Router } from "express";
import {
  login,
  refreshToken,
  logout,
} from "../controllers/auth.controller";
import { loginValidator } from "../validators/auth.validator";
import { validateRequest } from "../middleware/validateRequest.middleware";

const router = Router();

router.post("/login", loginValidator, validateRequest, login);

router.get("/refresh-token", refreshToken);

router.post("/logout", logout);

export default router;