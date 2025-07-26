import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useState, useEffect } from "react";

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
    if (change > 0) return <TrendingUp className="w-4 h-4 text-success" />;
    return <TrendingDown className="w-4 h-4 text-destructive" />;
  };

  const formatRate = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Card className="p-6 bg-gradient-card border-border/50 shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-105 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{flag}</span>
          <div>
            <h3 className="font-semibold text-foreground">{currency}</h3>
            <p className="text-sm text-muted-foreground">{currencyName}</p>
          </div>
        </div>
        {getTrendIcon()}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-primary">₦</span>
          <span className="text-2xl font-bold text-foreground animate-number-up">
            {formatRate(displayRate)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          per {symbol}1 {currency}
        </p>
        
        {getRateChange() && (
          <div className={`text-sm font-medium ${
            getRateChange()! > 0 ? 'text-success' : 'text-destructive'
          }`}>
            {getRateChange()! > 0 ? '+' : ''}{getRateChange()!.toFixed(2)}%
          </div>
        )}
      </div>
    </Card>
  );
};