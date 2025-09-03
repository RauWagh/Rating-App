import { createUser, findUserByEmail, updateUserPassword } from "../models/user.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signJwt } from "../utils/jwt.js";
import { nameConstraints, addressConstraints, passwordConstraints } from "../config/validation.js";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function signup(req, res) {
  try {
    const { name, email, address, password } = req.body;
    if (!name || name.length < nameConstraints.min || name.length > nameConstraints.max) {
      return res.status(400).json({ message: `Name must be ${nameConstraints.min}-${nameConstraints.max} chars` });
    }
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (address && address.length > addressConstraints.max) {
      return res.status(400).json({ message: `Address max ${addressConstraints.max} chars` });
    }
    if (!password || password.length < passwordConstraints.min || password.length > passwordConstraints.max) {
      return res.status(400).json({ message: `Password must be ${passwordConstraints.min}-${passwordConstraints.max} chars` });
    }

    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ message: "Email already in use" });

    const passwordHash = await hashPassword(password);
    const user = await createUser({ name, email, address: address || "", passwordHash, role: "USER" });
    const token = signJwt({ id: user.id, role: user.role, email: user.email, name: user.name });
    return res.status(201).json({ token, user });
  } catch (err) {
    return res.status(500).json({ message: "Signup failed" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await comparePassword(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = signJwt({ id: user.id, role: user.role, email: user.email, name: user.name });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role } });
  } catch (err) {
    return res.status(500).json({ message: "Login failed" });
  }
}

export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < passwordConstraints.min || newPassword.length > passwordConstraints.max) {
      return res.status(400).json({ message: `New password must be ${passwordConstraints.min}-${passwordConstraints.max} chars` });
    }
    const user = await findUserByEmail(req.user.email);
    if (!user) return res.status(404).json({ message: "User not found" });
    const ok = await comparePassword(currentPassword, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Current password incorrect" });
    const passwordHash = await hashPassword(newPassword);
    await updateUserPassword(user.id, passwordHash);
    return res.json({ message: "Password updated" });
  } catch (err) {
    return res.status(500).json({ message: "Change password failed" });
  }
}

