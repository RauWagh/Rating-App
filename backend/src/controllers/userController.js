import { listStoresWithRatings } from "../models/store.js";
import { upsertRating } from "../models/rating.js";

export async function listStores(req, res) {
  try {
    const { search = "", sortBy = "name", order = "asc", limit = 50, offset = 0 } = req.query;
    const rows = await listStoresWithRatings({
      userId: req.user?.id,
      search,
      sortBy,
      order,
      limit: Number(limit),
      offset: Number(offset),
    });
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ message: "Failed to list stores" });
  }
}

export async function submitRating(req, res) {
  try {
    const { storeId, rating } = req.body;
    const value = Number(rating);
    if (!storeId || Number.isNaN(value) || value < 1 || value > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }
    const r = await upsertRating({ userId: req.user.id, storeId, rating: value });
    return res.status(201).json(r);
  } catch (err) {
    return res.status(400).json({ message: "Failed to submit rating" });
  }
}

