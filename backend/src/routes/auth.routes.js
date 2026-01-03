// import express from "express";
// import * as authController from "../controllers/auth.controller.js";
// import authenticate from "../middlewares/auth.middleware.js";
// import { Router } from "express";
// import { registerTenant } from "../controllers/auth.controller.js";

// const router = express.Router();

// // router.post("/register-tenant", authController.registerTenant);
// router.post("/login", authController.login);
// router.get("/me", authenticate, authController.me);



// router.post("/register-tenant", registerTenant);

// export default router;



import express from "express";
import * as authController from "../controllers/auth.controller.js";
import authenticate from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", authController.login);
router.get("/me", authenticate, authController.me);
router.post("/register-tenant", authController.registerTenant);

export default router;
