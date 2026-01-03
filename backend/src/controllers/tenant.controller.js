import pool from "../db/index.js";
import { validate as isUuid } from "uuid";

/**
 * GET /api/tenants
 * Super Admin only
 */
export const listTenants = async (req, res) => {
  try {
    if (req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    const result = await pool.query(`
      SELECT id, name, subdomain, status, subscription_plan, created_at
      FROM tenants
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("listTenants error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * GET /api/tenants/:tenantId
 * Tenant Admin OR Super Admin
 */
export const getTenantDetails = async (req, res) => {
  const { tenantId } = req.params;

  // ✅ 1. UUID validation
  if (!isUuid(tenantId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid tenantId"
    });
  }

  // ✅ 2. Auth safety check
  if (!req.user || !req.user.role) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }

  try {
    const tenantResult = await pool.query(
      "SELECT * FROM tenants WHERE id = $1",
      [tenantId]
    );

    if (tenantResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found"
      });
    }

    const tenant = tenantResult.rows[0];

    // ✅ 3. Authorization check
    if (
      req.user.role !== "super_admin" &&
      req.user.tenant_id !== tenantId
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    const usersCount = await pool.query(
      "SELECT COUNT(*) FROM users WHERE tenant_id = $1",
      [tenantId]
    );

    const projectsCount = await pool.query(
      "SELECT COUNT(*) FROM projects WHERE tenant_id = $1",
      [tenantId]
    );

    const tasksCount = await pool.query(
      "SELECT COUNT(*) FROM tasks WHERE tenant_id = $1",
      [tenantId]
    );

    res.json({
      success: true,
      data: {
        id: tenant.id,
        name: tenant.name,
        subdomain: tenant.subdomain,
        status: tenant.status,
        subscriptionPlan: tenant.subscription_plan,
        maxUsers: tenant.max_users,
        maxProjects: tenant.max_projects,
        createdAt: tenant.created_at,
        totalUsers: Number(usersCount.rows[0].count),
        totalProjects: Number(projectsCount.rows[0].count),
        totalTasks: Number(tasksCount.rows[0].count)
      }
    });
  } catch (error) {
    console.error("getTenantDetails error:", error);
    res.status(500).json({
      success: false,
      message: error.message // 👈 TEMPORARY for debugging
    });
  }
};


/**
 * PUT /api/tenants/:tenantId
 * Super Admin only
 */
export const updateTenant = async (req, res) => {
  const { tenantId } = req.params;
  const {
    name,
    status,
    subscription_plan,
    max_users,
    max_projects
  } = req.body;

  try {
    if (req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    const result = await pool.query(
      `
      UPDATE tenants
      SET
        name = COALESCE($1, name),
        status = COALESCE($2, status),
        subscription_plan = COALESCE($3, subscription_plan),
        max_users = COALESCE($4, max_users),
        max_projects = COALESCE($5, max_projects),
        updated_at = NOW()
      WHERE id = $6
      RETURNING *
      `,
      [
        name,
        status,
        subscription_plan,
        max_users,
        max_projects,
        tenantId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found"
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error("updateTenant error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
