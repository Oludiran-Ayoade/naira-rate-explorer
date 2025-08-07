// src/data/blackMarketRates.ts
export interface BlackMarketRate {
  buy: number;
  sell: number;
}

export const blackMarketRates: Record<string, BlackMarketRate> = {
  USD: { buy: 1565, sell: 1570 },
  GBP: { buy: 2090, sell: 2110 },
  EUR: { buy: 1765, sell: 1785 },
  CAD: { buy: 1150, sell: 1200 },
  ZAR: { buy: 80, sell: 100 },
  AED: { buy: 400, sell: 420 },
  CNY: { buy: 205, sell: 220 },
  GHS: { buy: 120, sell: 135 },
  AUD: { buy: 900, sell: 1000 },
  XOF: { buy: 2.60, sell: 2.79 },
  XAF: { buy: 2.41, sell: 2.48 }
};