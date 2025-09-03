import { query } from "../db/pool.js";
import { createUser, listUsers, findUserById } from "../models/user.js";
import { createStore } from "../models/store.js";
import { hashPassword } from "../utils/password.js";
import { query } from "../db/pool.js";

export async function getDashboardCounts(req, res) {
  try {
    const [{ rows: u }, { rows: s }, { rows: r }] = await Promise.all([
      query("SELECT COUNT(*)::int AS count FROM users"),
      query("SELECT COUNT(*)::int AS count FROM stores"),
      query("SELECT COUNT(*)::int AS count FROM ratings"),
    ]);
    return res.json({ users: u[0].count, stores: s[0].count, ratings: r[0].count });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch counts" });
  }
}

export async function adminCreateUser(req, res) {
  try {
    const { name, email, address = "", password, role } = req.body;
    const passwordHash = await hashPassword(password);
    const user = await createUser({ name, email, address, passwordHash, role });
    return res.status(201).json(user);
  } catch (err) {
    return res.status(400).json({ message: "Failed to create user" });
  }
}

export async function adminListUsers(req, res) {
  try {
    const { search = "", role, sortBy = "name", order = "asc", limit = 50, offset = 0 } = req.query;
    const users = await listUsers({ search, role, sortBy, order, limit: Number(limit), offset: Number(offset) });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: "Failed to list users" });
  }
}

export async function adminCreateStore(req, res) {
  try {
    const { name, email = null, address, ownerId = null } = req.body;
    const store = await createStore({ name, email, address, ownerId });
    return res.status(201).json(store);
  } catch (err) {
    return res.status(400).json({ message: "Failed to create store" });
  }
}

export async function adminListStores(req, res) {
  try {
    const { search = "", sortBy = "name", order = "asc", limit = 50, offset = 0 } = req.query;
    const values = [];
    const where = [];
    if (search) {
      values.push(`%${search}%`);
      where.push(`(s.name ILIKE $${values.length} OR s.email ILIKE $${values.length} OR s.address ILIKE $${values.length})`);
    }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const orderSql = ["name", "email", "address"].includes(sortBy) ? sortBy : "name";
    const dir = order.toLowerCase() === "desc" ? "DESC" : "ASC";
    values.push(Number(limit));
    values.push(Number(offset));
    const result = await query(
      `SELECT s.id, s.name, s.email, s.address, COALESCE(ROUND(AVG(r.rating)::numeric,2),0) AS rating
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       ${whereSql}
       GROUP BY s.id
       ORDER BY ${orderSql} ${dir}
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );
    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ message: "Failed to list stores" });
  }
}

export async function adminGetUserDetails(req, res) {
  try {
    const { id } = req.params;
    const user = await findUserById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    let ownerRating = null;
    if (user.role === "OWNER") {
      const { rows } = await query(
        `SELECT s.id AS store_id, ROUND(AVG(r.rating)::numeric,2) AS rating
         FROM stores s LEFT JOIN ratings r ON r.store_id = s.id
         WHERE s.owner_id=$1
         GROUP BY s.id
         LIMIT 1`,
        [id]
      );
      ownerRating = rows[0] ? { storeId: rows[0].store_id, rating: rows[0].rating } : null;
    }
    return res.json({ ...user, ownerRating });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch user details" });
  }
}

