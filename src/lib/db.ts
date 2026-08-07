import { Pool } from "pg";

declare global {
  var __nexusPgPool: Pool | undefined;
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  return new Pool({
    connectionString,
    max: 10,
  });
}

export const pool: Pool = global.__nexusPgPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  global.__nexusPgPool = pool;
}

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[],
) {
  const result = await pool.query(text, params);
  return result as { rows: T[]; rowCount: number | null };
}
