import { useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { CurrencyCard } from '@/components/CurrencyCard';
import { CurrencySearch } from '@/components/CurrencySearch';
import { useCurrencyData } from '@/hooks/useCurrencyData';

const Index = () => {
  const { currencies, isLoading, lastUpdated, fetchCurrencyData, getMajorCurrencies } = useCurrencyData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCurrencies = currencies.filter(currency =>
    currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        majorRates={getMajorCurrencies()}
        lastUpdated={lastUpdated}
        onRefresh={fetchCurrencyData}
        isLoading={isLoading}
      />
      
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">All Currency Rates</h2>
            <p className="text-lg text-muted-foreground">
              Compare Nigerian Naira against {currencies.length} world currencies
            </p>
          </div>
          
          <CurrencySearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search for a currency..."
          />
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="h-48 bg-muted/50 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <>
              {filteredCurrencies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                <div className="text-center py-12">
                  <p className="text-xl text-muted-foreground">
                    No currencies found matching "{searchTerm}"
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">
            Data powered by <span className="font-medium text-primary">ExchangeRate-API</span> • 
            Updated every 5 minutes • Built with ❤️ in Nigeria
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
