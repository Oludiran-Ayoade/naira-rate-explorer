// src/components/CurrencyCard.tsx
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Calculator } from "lucide-react";
import { useState, useEffect } from "react";
import { CurrencyConverter } from "./CurrencyConverter";
import { blackMarketRates } from "./blackMarketRates";

interface CurrencyCardProps {
  currency: string;
  currencyName: string;
  flag: string;
  rate: number;
  previousRate?: number;
  symbol?: string;
}

export const CurrencyCard = ({ 
  currency, 
  currencyName, 
  flag, 
  rate, 
  previousRate,
  symbol = ""
}: CurrencyCardProps) => {
  const [displayRate, setDisplayRate] = useState(0);
  const [showConverter, setShowConverter] = useState(false);
  
  const blackMarketCurrencies = ['USD', 'GBP', 'EUR', 'CAD', 'ZAR', 'AED', 'CNY', 'GHS', 'AUD', 'XOF', 'XAF'];
  const showBlackMarket = blackMarketCurrencies.includes(currency) && blackMarketRates[currency];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayRate(rate);
    }, Math.random() * 500);
    
    return () => clearTimeout(timer);
  }, [rate]);

  const getRateChange = () => {
    if (!previousRate) return null;
    const change = ((rate - previousRate) / previousRate) * 100;
    return change;
  };

  const getTrendIcon = () => {
    const change = getRateChange();
    if (!change) return <Minus className="w-4 h-4 text-muted-foreground" />;
    if (change > 0) return <TrendingUp className="w-4 h-4 text-emerald-600" />;
    return <TrendingDown className="w-4 h-4 text-destructive" />;
  };

  const formatRate = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value).replace(/\.00$/, '');
  };

  return (
    <>
      <Card 
  className="group relative p-6 bg-gradient-card backdrop-blur-md border-border/50 shadow-lg hover:shadow-glow transition-all duration-500 hover:scale-[1.02] animate-fade-in overflow-hidden cursor-pointer h-[190px] w-full max-w-[55rem]" // ← Change this value
  onClick={() => setShowConverter(true)}
>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent transform -skew-x-12 transition-transform duration-1000 group-hover:translate-x-full opacity-0 group-hover:opacity-100" />
      
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl animate-float group-hover:animate-glow-pulse">
                {flag}
              </div>
              <div>
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  {currency}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currencyName}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="p-2 rounded-full bg-gradient-glass backdrop-blur-sm">
                <Calculator className="w-4 h-4 text-primary" />
              </div>
              <div className="p-2 rounded-full bg-gradient-glass backdrop-blur-sm">
                {getTrendIcon()}
              </div>
            </div>
          </div>
        
          <div className="flex-grow flex flex-col justify-center">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-primary">₦</span>
              <span className="text-3xl font-bold text-foreground animate-number-up tracking-tight">
                {formatRate(displayRate)}
              </span>
            </div>

            {/* Black Market Rates - Single Line */}
            {showBlackMarket && (
              <div className="flex items-baseline gap-2 mt-2 mb-1 text-[0.76rem] font-['Raleway']">
                <span className="flex items-center gap-2 mt-2 mb-1 text-[0.76rem] font-semibold font-['Raleway'] text-muted-foreground">BlackMarket:</span>
                <span className="text-green-400 drop-shadow-[0_0_4px_rgba(74,222,128,0.8)] font-semibold animate-pulse">Buy:₦{formatRate(blackMarketRates[currency].buy)}</span>
                <span className="text-red-400 drop-shadow-[0_0_4px_rgba(248,113,113,0.8)] font-semibold animate-pulse">Sell:₦{formatRate(blackMarketRates[currency].sell)}</span>
              </div>
            )}

            <p className="text-sm font-medium text-muted-foreground">
              per {symbol}1 {currency}
            </p>
          </div>
          
          <div className="mt-2">
            {getRateChange() && (
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                getRateChange()! > 0 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                  : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
              }`}>
                {getRateChange()! > 0 ? '+' : ''}{getRateChange()!.toFixed(2)}%
              </div>
            )}
          </div>
        </div>
      </Card>
      
      <CurrencyConverter
        isOpen={showConverter}
        onClose={() => setShowConverter(false)}
        currency={{
          code: currency,
          name: currencyName,
          flag,
          rate,
          symbol
        }}
      />
    </>
  );
};