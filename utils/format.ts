export function formatCurrency(amount: number, currency: string = "IDR") {
  // Use id-ID for IDR, en-US for USD/others for now to match common formatting preferences
  const locale = currency === "IDR" ? "id-ID" : "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    // IDR typically doesn't use decimals for display, others usually do
    minimumFractionDigits: currency === "IDR" ? 0 : 2,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
  }).format(amount);
}
