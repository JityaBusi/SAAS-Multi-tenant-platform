import * as authService from "../services/auth.service.js";

export async function registerTenant(req, res, next) {
  try {
    const result = await authService.registerTenant(req.body);
    res.status(201).json({
      success: true,
      message: "Tenant registered successfully",
      data: result
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const result = await authService.loginUser(req.body);
    res.json({
      success: true,
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          fullName: result.user.full_name,
          role: result.user.role
        },
        token: result.token,
        expiresIn: 86400
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res) {
  res.json({
    success: true,
    data: req.user
  });
}
