import Joi from "joi";

export const registerTenantSchema = Joi.object({
  tenantName: Joi.string().required(),
  subdomain: Joi.string().required(),
  adminEmail: Joi.string().email().required(),
  adminPassword: Joi.string().min(8).required(),
  adminFullName: Joi.string().required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  tenantSubdomain: Joi.string().required()
});
