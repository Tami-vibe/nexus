export function formatMoney(cents: number, currency = "ils") {
  return new Intl.NumberFormat("en-IL", {
    style: "currency",
    currency: currency.toUpperCase() === "ILS" ? "ILS" : currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
