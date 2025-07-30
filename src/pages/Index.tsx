import { useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { CurrencyCard } from '@/components/CurrencyCard';
import { CurrencySearch } from '@/components/CurrencySearch';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useCurrencyData } from '@/hooks/useCurrencyData';

const Index = () => {
  const { currencies, isLoading, lastUpdated, fetchCurrencyData, getMajorCurrencies } = useCurrencyData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCurrencies = currencies.filter(currency =>
    currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Fixed theme toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      
      <HeroSection
        majorRates={getMajorCurrencies()}
        lastUpdated={lastUpdated}
        onRefresh={fetchCurrencyData}
        isLoading={isLoading}
      />
      
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-emerald-50/20 dark:to-emerald-950/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              Complete Currency
              <span className="bg-gradient-primary bg-clip-text text-transparent block">
                Exchange Rates
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore exchange rates for {currencies.length} currencies from around the world, 
              all compared against the Nigerian Naira with real-time precision.
            </p>
          </div>
          
          <CurrencySearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search for any currency..."
          />
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 12 }).map((_, index) => (
                <div 
                  key={index} 
                  className="h-56 bg-gradient-glass backdrop-blur-md rounded-xl animate-pulse border border-border/50"
                  style={{ animationDelay: `${index * 100}ms` }}
                ></div>
              ))}
            </div>
          ) : (
            <>
              {filteredCurrencies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredCurrencies.map((currency, index) => (
                    <div
                      key={currency.code}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <CurrencyCard
                        currency={currency.code}
                        currencyName={currency.name}
                        flag={currency.flag}
                        rate={currency.rate}
                        previousRate={currency.previousRate}
                        symbol={currency.symbol}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 animate-fade-in">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">No Results Found</h3>
                  <p className="text-xl text-muted-foreground">
                    No currencies match "{searchTerm}". Try a different search term.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      
   <footer className="relative border-t border-border/50 bg-gradient-glass backdrop-blur-xl">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center gap-2 text-2xl font-bold text-foreground">
        <span className="text-primary">₦aira Rate Explorer</span>
      </div>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Your trusted source for accurate currency exchange rates and financial information powered by
        <span className="font-semibold text-primary"> ExchangeRate-API</span>
        <br />
      </p>
      
      <div className="flex items-center justify-center gap-2 pt-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-muted-foreground"
        >
          <rect x="2" y="4" width="20" height="16" rx="2"></rect>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
        </svg>
        <span className="text-sm text-muted-foreground font-medium">Contact Us:</span>
        <a 
          href="mailto:nairar8te@gmail.com" 
          className="text-sm text-primary font-medium hover:underline transition-colors"
        >
          Nairar8te@gmail.com
        </a>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
};

export default Index;
