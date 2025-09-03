import { query } from "../db/pool.js";

export async function upsertRating({ userId, storeId, rating }) {
  const result = await query(
    `INSERT INTO ratings (user_id, store_id, rating)
     VALUES ($1,$2,$3)
     ON CONFLICT (user_id, store_id) DO UPDATE SET rating=EXCLUDED.rating, updated_at=now()
     RETURNING id, user_id, store_id, rating, created_at, updated_at`,
    [userId, storeId, rating]
  );
  return result.rows[0];
}

export async function getUserRatingForStore({ userId, storeId }) {
  const result = await query(`SELECT rating FROM ratings WHERE user_id=$1 AND store_id=$2`, [userId, storeId]);
  return result.rows[0]?.rating || null;
}

