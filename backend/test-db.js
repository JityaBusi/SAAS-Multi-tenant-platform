import pkg from "pg";
const { Client } = pkg;

const client = new Client({
  host: "localhost",
  user: "postgres",
  password: "Somi@2495",
  database: "saas_platform",
  port: 5432,
});

try {
  await client.connect();
  console.log("✅ PG raw connection success");
  await client.end();
} catch (err) {
  console.error("❌ PG raw connection failed:", err.message);
}
