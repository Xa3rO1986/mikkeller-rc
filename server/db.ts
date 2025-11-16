import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Используем node-postgres для production развертывания
// Поддерживает обычные PostgreSQL соединения (не только Neon)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // SSL только для облачных БД (например Neon), не для локального Docker PostgreSQL
  ssl: process.env.DATABASE_URL?.includes('neon.tech') || process.env.DATABASE_URL?.includes('amazonaws.com')
    ? { rejectUnauthorized: false } 
    : false
});

export const db = drizzle(pool, { schema });
