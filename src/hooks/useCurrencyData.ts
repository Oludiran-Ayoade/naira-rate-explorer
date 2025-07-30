import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CurrencyData {
  [key: string]: number;
}

interface Currency {
  code: string;
  name: string;
  flag: string;
  symbol: string;
  rate: number;
  previousRate?: number;
}

export const useCurrencyData = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const { toast } = useToast();

  const currencyInfo: Record<string, { name: string; flag: string; symbol: string }> = {
    USD: { name: 'US Dollar', flag: '🇺🇸', symbol: '$' },
    EUR: { name: 'Euro', flag: '🇪🇺', symbol: '€' },
    GBP: { name: 'British Pound', flag: '🇬🇧', symbol: '£' },
    GHS: { name: 'Ghanaian Cedi', flag: '🇬🇭', symbol: '₵' },
    KES: { name: 'Kenyan Shilling', flag: '🇰🇪', symbol: 'KSh' },
    ZAR: { name: 'South African Rand', flag: '🇿🇦', symbol: 'R' },
    CAD: { name: 'Canadian Dollar', flag: '🇨🇦', symbol: 'C$' },
    AUD: { name: 'Australian Dollar', flag: '🇦🇺', symbol: 'A$' },
    JPY: { name: 'Japanese Yen', flag: '🇯🇵', symbol: '¥' },
    CNY: { name: 'Chinese Yuan', flag: '🇨🇳', symbol: '¥' },
    INR: { name: 'Indian Rupee', flag: '🇮🇳', symbol: '₹' },
    CHF: { name: 'Swiss Franc', flag: '🇨🇭', symbol: 'Fr' },
    SEK: { name: 'Swedish Krona', flag: '🇸🇪', symbol: 'kr' },
    NOK: { name: 'Norwegian Krone', flag: '🇳🇴', symbol: 'kr' },
    DKK: { name: 'Danish Krone', flag: '🇩🇰', symbol: 'kr' },
    PLN: { name: 'Polish Zloty', flag: '🇵🇱', symbol: 'zł' },
    CZK: { name: 'Czech Koruna', flag: '🇨🇿', symbol: 'Kč' },
    HUF: { name: 'Hungarian Forint', flag: '🇭🇺', symbol: 'Ft' },
    RON: { name: 'Romanian Leu', flag: '🇷🇴', symbol: 'lei' },
    BGN: { name: 'Bulgarian Lev', flag: '🇧🇬', symbol: 'лв' },
    HRK: { name: 'Croatian Kuna', flag: '🇭🇷', symbol: 'kn' },
    RUB: { name: 'Russian Ruble', flag: '🇷🇺', symbol: '₽' },
    TRY: { name: 'Turkish Lira', flag: '🇹🇷', symbol: '₺' },
    BRL: { name: 'Brazilian Real', flag: '🇧🇷', symbol: 'R$' },
    MXN: { name: 'Mexican Peso', flag: '🇲🇽', symbol: '$' },
    ARS: { name: 'Argentine Peso', flag: '🇦🇷', symbol: '$' },
    CLP: { name: 'Chilean Peso', flag: '🇨🇱', symbol: '$' },
    COP: { name: 'Colombian Peso', flag: '🇨🇴', symbol: '$' },
    PEN: { name: 'Peruvian Sol', flag: '🇵🇪', symbol: 'S/' },
    UYU: { name: 'Uruguayan Peso', flag: '🇺🇾', symbol: '$' },
    KRW: { name: 'South Korean Won', flag: '🇰🇷', symbol: '₩' },
    SGD: { name: 'Singapore Dollar', flag: '🇸🇬', symbol: 'S$' },
    MYR: { name: 'Malaysian Ringgit', flag: '🇲🇾', symbol: 'RM' },
    THB: { name: 'Thai Baht', flag: '🇹🇭', symbol: '฿' },
    PHP: { name: 'Philippine Peso', flag: '🇵🇭', symbol: '₱' },
    IDR: { name: 'Indonesian Rupiah', flag: '🇮🇩', symbol: 'Rp' },
    VND: { name: 'Vietnamese Dong', flag: '🇻🇳', symbol: '₫' },
    EGP: { name: 'Egyptian Pound', flag: '🇪🇬', symbol: '£' },
    MAD: { name: 'Moroccan Dirham', flag: '🇲🇦', symbol: 'د.م.' },
    TND: { name: 'Tunisian Dinar', flag: '🇹🇳', symbol: 'د.ت' },
    DZD: { name: 'Algerian Dinar', flag: '🇩🇿', symbol: 'د.ج' },
    AOA: { name: 'Angolan Kwanza', flag: '🇦🇴', symbol: 'Kz' },
    BWP: { name: 'Botswana Pula', flag: '🇧🇼', symbol: 'P' },
    ETB: { name: 'Ethiopian Birr', flag: '🇪🇹', symbol: 'Br' },
    GNF: { name: 'Guinean Franc', flag: '🇬🇳', symbol: 'Fr' },
    LRD: { name: 'Liberian Dollar', flag: '🇱🇷', symbol: 'L$' },
    MWK: { name: 'Malawian Kwacha', flag: '🇲🇼', symbol: 'MK' },
    MZN: { name: 'Mozambican Metical', flag: '🇲🇿', symbol: 'MT' },
    RWF: { name: 'Rwandan Franc', flag: '🇷🇼', symbol: 'Fr' },
    SLL: { name: 'Sierra Leonean Leone', flag: '🇸🇱', symbol: 'Le' },
    TZS: { name: 'Tanzanian Shilling', flag: '🇹🇿', symbol: 'TSh' },
    UGX: { name: 'Ugandan Shilling', flag: '🇺🇬', symbol: 'USh' },
    XAF: { name: 'Central African Franc', flag: '🇨🇲', symbol: 'Fr' },
    XOF: { name: 'West African Franc', flag: '🇸🇳', symbol: 'Fr' },
    ZMW: { name: 'Zambian Kwacha', flag: '🇿🇲', symbol: 'ZK' },
    ZWL: { name: 'Zimbabwean Dollar', flag: '🇿🇼', symbol: 'Z$' },
  };

  const fetchCurrencyData = async () => {
    try {
      setIsLoading(true);
      
      // Using a free tier API - ExchangeRate-API
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/NGN');     
      if (!response.ok) {
        throw new Error('Failed to fetch currency data');
      }
      
      const data = await response.json();
      const rates: CurrencyData = data.rates;
      
      // Store previous rates for comparison
      const previousRates = currencies.reduce((acc, curr) => {
        acc[curr.code] = curr.rate;
        return acc;
      }, {} as Record<string, number>);
      
      // Convert rates to NGN base (invert the rates since API gives NGN to other currencies)
      const processedCurrencies: Currency[] = Object.entries(rates)
        .filter(([code]) => code !== 'NGN' && currencyInfo[code])
        .map(([code, rate]) => ({
          code,
          name: currencyInfo[code].name,
          flag: currencyInfo[code].flag,
          symbol: currencyInfo[code].symbol,
          rate: 1 / rate, // Invert to get how many NGN per 1 unit of foreign currency
          previousRate: previousRates[code],
        }))
        .sort((a, b) => {
          // Sort by importance: USD, EUR, GBP first, then alphabetically
          const order = ['USD', 'EUR', 'GBP', 'GHS', 'KES', 'ZAR'];
          const aIndex = order.indexOf(a.code);
          const bIndex = order.indexOf(b.code);
          
          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
          return a.name.localeCompare(b.name);
        });
      
      setCurrencies(processedCurrencies);
      console.log(processedCurrencies);
      
      setLastUpdated(new Date().toLocaleTimeString());
      
      toast({
        title: "Rates Updated",
        description: "Currency exchange rates have been refreshed successfully.",
      });
      
    } catch (error) {
      console.error('Error fetching currency data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch currency rates. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencyData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchCurrencyData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getMajorCurrencies = () => {
    return currencies
      .filter(currency => ['USD', 'EUR', 'GBP'].includes(currency.code))
      .map(currency => ({
        currency: currency.code,
        rate: currency.rate,
        flag: currency.flag,
        symbol: currency.symbol,
      }));
  };

  return {
    currencies,
    isLoading,
    lastUpdated,
    fetchCurrencyData,
    getMajorCurrencies,
  };
};
