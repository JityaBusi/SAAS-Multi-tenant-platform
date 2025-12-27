import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { registerTenant } from "../controllers/auth.controller.js";

const router = express.Router();

// router.post("/register-tenant", authController.registerTenant);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.me);



router.post("/register-tenant", registerTenant);

export default router;
