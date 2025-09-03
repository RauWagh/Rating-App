import { query } from "../db/pool.js";

export async function createStore({ name, email, address, ownerId }) {
  const result = await query(
    `INSERT INTO stores (name, email, address, owner_id)
     VALUES ($1,$2,$3,$4) RETURNING id, name, email, address, owner_id, created_at`,
    [name, email, address, ownerId]
  );
  return result.rows[0];
}

export async function listStoresWithRatings({ userId, search, sortBy = "name", order = "asc", limit = 20, offset = 0 }) {
  const values = [];
  const where = [];
  if (search) {
    values.push(`%${search}%`);
    const idx = values.length;
    where.push(`(s.name ILIKE $${idx} OR s.address ILIKE $${idx})`);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const orderSql = ["name", "email", "address"].includes(sortBy) ? sortBy : "name";
  const dir = order.toLowerCase() === "desc" ? "DESC" : "ASC";

  const userRatingJoin = userId ? `LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = $${values.push(userId)}` : "";
  values.push(limit);
  values.push(offset);
  const result = await query(
    `SELECT s.id, s.name, s.email, s.address,
            ROUND(AVG(r.rating)::numeric, 2) AS overall_rating,
            ${userId ? "ur.rating AS user_rating" : "NULL AS user_rating"}
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     ${userRatingJoin}
     ${whereSql}
     GROUP BY s.id ${userId ? ", ur.rating" : ""}
     ORDER BY ${orderSql} ${dir}
     LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values
  );
  return result.rows;
}

export async function getStoreAverageRating(storeId) {
  const result = await query(`SELECT ROUND(AVG(rating)::numeric, 2) AS avg FROM ratings WHERE store_id=$1`, [storeId]);
  return result.rows[0]?.avg || null;
}

export async function listStoreRaters(storeId) {
  const result = await query(
    `SELECT u.id, u.name, u.email, r.rating, r.created_at
     FROM ratings r
     JOIN users u ON u.id = r.user_id
     WHERE r.store_id=$1
     ORDER BY r.created_at DESC`,
    [storeId]
  );
  return result.rows;
}

