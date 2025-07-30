import { Card } from "@/components/ui/card";
import { RefreshCw, Clock, Sparkles } from "lucide-react";
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-emerald-50/30 to-background dark:from-background dark:via-emerald-950/20 dark:to-background">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-emerald-400 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-32 w-20 h-20 bg-emerald-600 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-primary rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/50"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-glass backdrop-blur-md border border-primary/20 mb-6 animate-glow-pulse">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Live Exchange Rates</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              ₦aira Rate
            </span>
            <br />
            <span className="text-foreground">Explorer</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover real-time exchange rates for Nigerian Naira against world currencies. 
            <br className="hidden md:block" />
            {/* Powered by professional-grade APIs with lightning-fast updates. */}
          </p>
        </div>

        {/* Major currency cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {majorRates.map((rate, index) => (
            <Card 
              key={rate.currency} 
              className="group relative p-8 bg-gradient-card backdrop-blur-xl border-border/50 shadow-xl hover:shadow-glow transition-all duration-700 hover:scale-105 animate-slide-up overflow-hidden"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent transform -skew-x-12 transition-transform duration-1000 group-hover:translate-x-full opacity-0 group-hover:opacity-100" />
              
              <div className="relative z-10 text-center">
                <div className="text-6xl mb-6 animate-float group-hover:animate-glow-pulse">
                  {rate.flag}
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {rate.currency}
                  </h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-3xl font-bold text-primary">₦</span>
                    <span className="text-4xl font-bold text-foreground tracking-tight">
                      {formatRate(rate.rate)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground bg-gradient-glass backdrop-blur-sm px-3 py-1 rounded-full inline-block">
                    per {rate.symbol}1 {rate.currency}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in">
          <Button 
            onClick={onRefresh} 
            size="lg"
            disabled={isLoading}
            className="group bg-gradient-primary hover:shadow-glow text-primary-foreground border-0 px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            <RefreshCw className={`w-5 h-5 mr-3 transition-transform duration-300 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
            {isLoading ? 'Updating...' : 'Refresh Rates'}
          </Button>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground bg-gradient-glass backdrop-blur-md px-6 py-3 rounded-full border border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <Clock className="w-4 h-4" />
            </div>
            <span className="font-medium">Last updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};