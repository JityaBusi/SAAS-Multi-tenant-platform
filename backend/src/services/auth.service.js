import { hashPassword, comparePassword } from "../utils/password.util.js";
import { generateToken } from "../utils/jwt.util.js";
import db from "../db/index.js";

/**
 * Register Tenant + Admin
 */
export async function registerTenant(data) {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const tenantRes = await client.query(
      `INSERT INTO tenants (name, subdomain)
       VALUES ($1, $2)
       RETURNING id`,
      [data.tenantName, data.subdomain]
    );

    const tenantId = tenantRes.rows[0].id;
    const passwordHash = await hashPassword(data.adminPassword);

    const userRes = await client.query(
      `INSERT INTO users (email, full_name, password_hash, role, tenant_id)
       VALUES ($1, $2, $3, 'tenant_admin', $4)
       RETURNING id, email, full_name, role`,
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

/**
 * Login User
 */
export async function loginUser(data) {
  // 1️⃣ Fetch tenant (NO is_active)
  const tenantRes = await db.query(
    "SELECT id, subdomain FROM tenants WHERE subdomain = $1",
    [data.tenantSubdomain]
  );

  if (!tenantRes.rows.length) {
    throw { status: 404, message: "Tenant not found" };
  }

  const tenant = tenantRes.rows[0];

  // 2️⃣ Fetch user (NO is_active)
  const userRes = await db.query(
    `
    SELECT id, email, password_hash, role, tenant_id
    FROM users
    WHERE email = $1 AND tenant_id = $2
    `,
    [data.email, tenant.id]
  );

  if (!userRes.rows.length) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const user = userRes.rows[0];

  // 3️⃣ Password check
  const isMatch = await comparePassword(data.password, user.password_hash);
  if (!isMatch) {
    throw { status: 401, message: "Invalid credentials" };
  }

  // 4️⃣ Generate JWT
  const token = generateToken({
    userId: user.id,
    tenantId: user.tenant_id,
    role: user.role
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenant_id
    },
    token
  };
}
