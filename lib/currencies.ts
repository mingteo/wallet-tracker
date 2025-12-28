export type CurrencyConfig = {
  code: string;
  name: string;
  locale: string;
  symbol: string;
  fractionDigits: number;
};

export const SURPORTED_CURRENCIES: CurrencyConfig[] = [
  {
    code: "IDR",
    name: "Indonesian Rupiah",
    locale: "id-ID",
    symbol: "Rp",
    fractionDigits: 0,
  },
  {
    code: "USD",
    name: "US Dollar",
    locale: "en-US",
    symbol: "$",
    fractionDigits: 2,
  },
  {
    code: "SGD",
    name: "Singapore Dollar",
    locale: "en-SG",
    symbol: "S$",
    fractionDigits: 2,
  },
  {
    code: "EUR",
    name: "Euro",
    locale: "de-DE",
    symbol: "€",
    fractionDigits: 2,
  },
  {
    code: "GBP",
    name: "British Pound",
    locale: "en-GB",
    symbol: "£",
    fractionDigits: 2,
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    locale: "ja-JP",
    symbol: "¥",
    fractionDigits: 0,
  },
  {
    code: "CNY",
    name: "Chinese Yuan",
    locale: "zh-CN",
    symbol: "¥",
    fractionDigits: 2,
  },
  {
    code: "KRW",
    name: "South Korean Won",
    locale: "ko-KR",
    symbol: "₩",
    fractionDigits: 0,
  },
];

export const DEFAULT_CURRENCY = "IDR";
