import { query } from "../db/pool.js";

export async function createUser({ name, email, address, passwordHash, role }) {
  const result = await query(
    `INSERT INTO users (name, email, address, password_hash, role)
     VALUES ($1,$2,$3,$4,$5) RETURNING id, name, email, address, role, created_at`,
    [name, email, address, passwordHash, role]
  );
  return result.rows[0];
}

export async function findUserByEmail(email) {
  const result = await query(`SELECT * FROM users WHERE email=$1`, [email]);
  return result.rows[0] || null;
}

export async function findUserById(id) {
  const result = await query(`SELECT id, name, email, address, role, created_at FROM users WHERE id=$1`, [id]);
  return result.rows[0] || null;
}

export async function updateUserPassword(id, passwordHash) {
  await query(`UPDATE users SET password_hash=$2, updated_at=now() WHERE id=$1`, [id, passwordHash]);
}

export async function listUsers({ search, role, sortBy = "name", order = "asc", limit = 20, offset = 0 }) {
  const values = [];
  const where = [];
  if (search) {
    values.push(`%${search}%`);
    const idx = values.length;
    where.push(`(name ILIKE $${idx} OR email ILIKE $${idx} OR address ILIKE $${idx})`);
  }
  if (role) {
    values.push(role);
    where.push(`role = $${values.length}`);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const orderSql = ["name", "email", "address", "role", "created_at"].includes(sortBy) ? sortBy : "name";
  const dir = order.toLowerCase() === "desc" ? "DESC" : "ASC";
  values.push(limit);
  values.push(offset);
  const result = await query(
    `SELECT id, name, email, address, role, created_at
     FROM users
     ${whereSql}
     ORDER BY ${orderSql} ${dir}
     LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values
  );
  return result.rows;
}

