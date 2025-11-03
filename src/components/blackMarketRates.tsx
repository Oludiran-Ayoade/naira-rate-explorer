// src/data/blackMarketRates.ts
export interface BlackMarketRate {
  buy: number;
  sell: number;
}

export const blackMarketRates: Record<string, BlackMarketRate> = {
  USD: { buy: 1445, sell: 1450 },
  GBP: { buy: 1950, sell: 1980 },
  EUR: { buy: 1665, sell: 1690 },
  CAD: { buy: 1000, sell: 1100 },
  ZAR: { buy: 90, sell: 110 },
  AED: { buy: 385, sell: 410 },
  CNY: { buy: 190, sell: 210 },
  GHS: { buy: 90, sell: 115 },
  AUD: { buy: 800, sell: 900 },
  XOF: { buy: 2.50, sell: 2.60 },
  XAF: { buy: 2.40, sell: 2.50 }
};