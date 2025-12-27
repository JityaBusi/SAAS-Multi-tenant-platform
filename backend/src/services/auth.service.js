import { hashPassword, comparePassword } from "../utils/password.util.js";
import { generateToken } from "../utils/jwt.util.js";
import db from "../db/index.js"; // your DB connection

export async function registerTenant(data) {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const tenantRes = await client.query(
      `INSERT INTO tenants (name, subdomain)
       VALUES ($1, $2) RETURNING id`,
      [data.tenantName, data.subdomain]
    );

    const tenantId = tenantRes.rows[0].id;
    const passwordHash = await hashPassword(data.adminPassword);

    const userRes = await client.query(
      `INSERT INTO users (email, full_name, password_hash, role, tenant_id)
       VALUES ($1, $2, $3, 'tenant_admin', $4)
       RETURNING id, email, full_name`,
      [data.adminEmail, data.adminFullName, passwordHash, tenantId]
    );

    await client.query("COMMIT");

    return {
      tenantId,
      adminUser: userRes.rows[0]
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function loginUser(data) {
  const tenantRes = await db.query(
    "SELECT * FROM tenants WHERE subdomain = $1 AND is_active = true",
    [data.tenantSubdomain]
  );

  if (!tenantRes.rows.length) {
    throw { status: 404, message: "Tenant not found" };
  }

  const tenant = tenantRes.rows[0];

  const userRes = await db.query(
    "SELECT * FROM users WHERE email = $1 AND tenant_id = $2 AND is_active = true",
    [data.email, tenant.id]
  );

  if (!userRes.rows.length) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const user = userRes.rows[0];
  const isMatch = await comparePassword(data.password, user.password_hash);

  if (!isMatch) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const token = generateToken({
    userId: user.id,
    tenantId: tenant.id,
    role: user.role
  });

  return {
    user,
    token
  };
}
