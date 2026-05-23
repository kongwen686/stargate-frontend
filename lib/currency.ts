export type SupportedCurrency = "USDC" | "EURC" | "XLM";

const CURRENCY_FORMATS: Record<
  SupportedCurrency,
  { symbol: string; minimumFractionDigits: number; maximumFractionDigits: number }
> = {
  USDC: { symbol: "USDC", minimumFractionDigits: 2, maximumFractionDigits: 2 },
  EURC: { symbol: "EURC", minimumFractionDigits: 2, maximumFractionDigits: 2 },
  XLM: { symbol: "XLM", minimumFractionDigits: 2, maximumFractionDigits: 7 },
};

export function formatCurrencyAmount(
  amount: string | number,
  currency: SupportedCurrency = "USDC",
  locale = "en-US",
): string {
  const numericAmount = typeof amount === "number" ? amount : Number(amount);

  if (!Number.isFinite(numericAmount)) {
    throw new TypeError("amount must be a finite number");
  }

  const format = CURRENCY_FORMATS[currency];
  const formattedAmount = new Intl.NumberFormat(locale, {
    minimumFractionDigits: format.minimumFractionDigits,
    maximumFractionDigits: format.maximumFractionDigits,
    useGrouping: true,
  }).format(numericAmount);

  return `${formattedAmount} ${format.symbol}`;
}
