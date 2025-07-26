import { Card } from "@/components/ui/card";
import { RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  majorRates: Array<{
    currency: string;
    rate: number;
    flag: string;
    symbol: string;
  }>;
  lastUpdated: string;
  onRefresh: () => void;
  isLoading: boolean;
}

export const HeroSection = ({ majorRates, lastUpdated, onRefresh, isLoading }: HeroSectionProps) => {
  const formatRate = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <section className="relative py-20 bg-gradient-hero overflow-hidden">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,hsl(var(--primary))_10px,hsl(var(--primary))_11px)] opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Naira Rate <span className="text-primary">Explorer</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Live exchange rates for Nigerian Naira against world currencies. 
            Real-time data powered by ExchangeRate-API.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {majorRates.map((rate, index) => (
            <Card 
              key={rate.currency} 
              className="p-8 bg-gradient-card border-border/50 shadow-elevated animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-center">
                <div className="text-4xl mb-4 animate-pulse-green">{rate.flag}</div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">{rate.currency}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl font-bold text-primary">₦</span>
                    <span className="text-3xl font-bold text-foreground">
                      {formatRate(rate.rate)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    per {rate.symbol}1 {rate.currency}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 animate-fade-in">
          <Button 
            onClick={onRefresh} 
            variant="outline" 
            size="lg"
            disabled={isLoading}
            className="bg-background/80 backdrop-blur-sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Rates
          </Button>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/60 backdrop-blur-sm px-3 py-2 rounded-lg">
            <Clock className="w-4 h-4" />
            Last updated: {lastUpdated}
          </div>
        </div>
      </div>
    </section>
  );
};