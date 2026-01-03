import express from "express";
import {
  listTenants,
  getTenantDetails,
  updateTenant
} from "../controllers/tenant.controller.js";
import authenticate from "../middlewares/auth.middleware.js";


const router = express.Router();

// 🔐 PROTECTED ROUTES
router.get("/tenants", authenticate, listTenants);
router.get("/tenants/:tenantId", authenticate, getTenantDetails);
router.put("/tenants/:tenantId", authenticate, updateTenant);

export default authenticate;

