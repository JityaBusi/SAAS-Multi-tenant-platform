// import pkg from "pg";
// const { Pool } = pkg;

// const pool = new Pool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME
// });

// pool.on("connect", () => {
//   console.log("✅ PostgreSQL connected");
// });

// export default {
//   query: (text, params) => pool.query(text, params),
//   connect: () => pool.connect()
// };


import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

export default pool;
