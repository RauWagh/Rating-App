import fs from 'fs'
import path from 'path'
import url from 'url'
import dotenv from 'dotenv'
import pkg from 'pg'

dotenv.config()

const { Client } = pkg

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

async function main() {
  const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/store_ratings'
  const seedPath = path.join(rootDir, 'scripts', 'seed.sql')
  const sql = fs.readFileSync(seedPath, 'utf8')

  const client = new Client({ connectionString: databaseUrl, ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false })
  await client.connect()
  try {
    await client.query(sql)
    console.log('Seed data applied to', databaseUrl)
  } finally {
    await client.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

