import { config } from "dotenv";
config({ path: ".env" });

const vat = process.env.SMOKE_VAT ?? "IL-GYM-001";
const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

async function main() {
  // Warm capacity
  const capRes = await fetch(`${base}/api/capacity/${vat}`);
  const cap = await capRes.json();
  console.log("capacity", cap);

  const spots = Number(cap.spots_open ?? 0);
  const attempts = spots + 3;
  const results = await Promise.all(
    Array.from({ length: attempts }, () =>
      fetch(`${base}/api/capacity/hold`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vat_number: vat, phone: "+972500009999" }),
      }).then(async (r) => ({ status: r.status, body: await r.json() })),
    ),
  );

  const ok = results.filter((r) => r.body.ok).length;
  const fail = results.length - ok;
  console.log({ attempts, ok, fail, spots });
  if (ok !== spots) {
    console.error("FAIL: expected ok === spots");
    process.exit(1);
  }
  console.log("PASS: concurrent holds respected capacity");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
