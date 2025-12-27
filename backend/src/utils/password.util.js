import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const SALT_ROUNDS = 10;

// export async function hashPassword(password) {
//   return bcrypt.hash(password, SALT_ROUNDS);
// }

// export async function comparePassword(password, hash) {
//   return bcrypt.compare(password, hash);
// }

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// import jwt from "jsonwebtoken";

export const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

export const verifyToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);
