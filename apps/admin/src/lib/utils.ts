export function formatMoney(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

export function capitalize(value: string) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}
