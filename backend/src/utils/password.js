import bcrypt from "bcryptjs";
import { validatePassword } from "../config/validation.js";

const SALT_ROUNDS = 10;

export async function hashPassword(plainPassword) {
  if (!validatePassword(plainPassword)) {
    throw new Error("Password must be 8-16 chars, include uppercase & special char");
  }
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(plainPassword, salt);
}

export async function comparePassword(plainPassword, passwordHash) {
  return bcrypt.compare(plainPassword, passwordHash);
}

