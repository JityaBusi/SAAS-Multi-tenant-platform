import express from "express";
import dotenv from "dotenv";

import sequelize from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import { errorMiddleware } from "./src/middlewares/error.middleware.js";

dotenv.config();

const app = express();
app.use(express.json());

// 🔑 DB CONNECTION TEST
try {
  await sequelize.authenticate();
  console.log("✅ Database connected");
} catch (error) {
  console.error("❌ Database connection failed:", error.message);
  process.exit(1);
}

// health
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "saas-backend" });
});

// routes
app.use("/api/auth", authRoutes);

// error handler
app.use(errorMiddleware);

export default app;
