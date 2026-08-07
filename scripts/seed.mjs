import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");

  const client = new pg.Client({ connectionString: url });
  await client.connect();
  const sql = readFileSync(join(root, "db", "seed.sql"), "utf8");
  await client.query(sql);
  await client.end();
  console.log("seed complete");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
