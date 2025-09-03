import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;

const databaseUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/store_ratings";

export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : false,
});

export async function query(text, params) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const durationMs = Date.now() - start;
  if (process.env.DEBUG_SQL === "true") {
    // eslint-disable-next-line no-console
    console.log("executed query", { text, durationMs, rows: result.rowCount });
  }
  return result;
}

