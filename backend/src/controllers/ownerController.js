import { getStoreAverageRating, listStoreRaters } from "../models/store.js";
import { query } from "../db/pool.js";

export async function getOwnerDashboard(req, res) {
  try {
    const { rows } = await query(`SELECT id FROM stores WHERE owner_id=$1 LIMIT 1`, [req.user.id]);
    if (!rows.length) return res.status(404).json({ message: "No store found for owner" });
    const storeId = rows[0].id;
    const avg = await getStoreAverageRating(storeId);
    const raters = await listStoreRaters(storeId);
    return res.json({ storeId, averageRating: avg, raters });
  } catch (err) {
    return res.status(500).json({ message: "Failed to load owner dashboard" });
  }
}

