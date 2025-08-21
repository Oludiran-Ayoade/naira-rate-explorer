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

  // This object contains metadata for all currencies from exchangerate-api.com
  // that have a specific country flag. XDR (Special Drawing Rights) has been
  // removed as it doesn't have a direct country flag and you wished to exclude it.
  const currencyInfo: Record<string, { name: string; flag: string; symbol: string }> = {
    // Currencies in alphabetical order by code
    AED: { name: 'UAE Dirham', flag: '🇦🇪', symbol: 'د.إ' },
    AFN: { name: 'Afghan Afghani', flag: '🇦🇫', symbol: '؋' },
    ALL: { name: 'Albanian Lek', flag: '🇦🇱', symbol: 'L' },
    AMD: { name: 'Armenian Dram', flag: '🇦🇲', symbol: '֏' },
    ANG: { name: 'Netherlands Antillean Guilder', flag: '🇦🇼', symbol: 'ƒ' },
    AOA: { name: 'Angolan Kwanza', flag: '🇦🇴', symbol: 'Kz' },
    ARS: { name: 'Argentine Peso', flag: '🇦🇷', symbol: '$' },
    AUD: { name: 'Australian Dollar', flag: '🇦🇺', symbol: 'A$' },
    AWG: { name: 'Aruban Florin', flag: '🇦🇼', symbol: 'ƒ' },
    AZN: { name: 'Azerbaijani Manat', flag: '🇦🇿', symbol: '₼' },
    BAM: { name: 'Bosnia and Herzegovina Convertible Mark', flag: '🇧🇦', symbol: 'KM' },
    BBD: { name: 'Barbadian Dollar', flag: '🇧🇧', symbol: '$' },
    BDT: { name: 'Bangladeshi Taka', flag: '🇧🇩', symbol: '৳' },
    BGN: { name: 'Bulgarian Lev', flag: '🇧🇬', symbol: 'лв' },
    BHD: { name: 'Bahraini Dinar', flag: '🇧🇭', symbol: '.د.ب' },
    BIF: { name: 'Burundian Franc', flag: '🇧🇮', symbol: 'Fr' },
    BMD: { name: 'Bermudian Dollar', flag: '🇧🇲', symbol: '$' },
    BND: { name: 'Brunei Dollar', flag: '🇧🇳', symbol: '$' },
    BOB: { name: 'Bolivian Boliviano', flag: '🇧🇴', symbol: 'Bs.' },
    BRL: { name: 'Brazilian Real', flag: '🇧🇷', symbol: 'R$' },
    BSD: { name: 'Bahamian Dollar', flag: '🇧🇸', symbol: '$' },
    BTN: { name: 'Bhutanese Ngultrum', flag: '🇧🇹', symbol: 'Nu.' },
    BWP: { name: 'Botswana Pula', flag: '🇧🇼', symbol: 'P' },
    BYN: { name: 'Belarusian Ruble', flag: '🇧🇾', symbol: 'Br' },
    BZD: { name: 'Belize Dollar', flag: '🇧🇿', symbol: 'BZ$' },
    CAD: { name: 'Canadian Dollar', flag: '🇨🇦', symbol: 'C$' },
    CDF: { name: 'Congolese Franc', flag: '�🇩', symbol: 'FC' },
    CHF: { name: 'Swiss Franc', flag: '🇨🇭', symbol: 'Fr' },
    CLP: { name: 'Chilean Peso', flag: '🇨🇱', symbol: '$' },
    CNY: { name: 'Chinese Yuan', flag: '🇨🇳', symbol: '¥' },
    COP: { name: 'Colombian Peso', flag: '🇨🇴', symbol: '$' },
    CRC: { name: 'Costa Rican Colón', flag: '🇨🇷', symbol: '₡' },
    CUC: { name: 'Cuban Convertible Peso', flag: '🇨🇺', symbol: '$' },
    CUP: { name: 'Cuban Peso', flag: '🇨🇺', symbol: '$' },
    CVE: { name: 'Cape Verdean Escudo', flag: '🇨🇻', symbol: '$' },
    CZK: { name: 'Czech Koruna', flag: '🇨🇿', symbol: 'Kč' },
    DJF: { name: 'Djiboutian Franc', flag: '🇩🇯', symbol: 'Fdj' },
    DKK: { name: 'Danish Krone', flag: '🇩🇰', symbol: 'kr' },
    DOP: { name: 'Dominican Peso', flag: '🇩🇴', symbol: 'RD$' },
    DZD: { name: 'Algerian Dinar', flag: '🇩🇿', symbol: 'د.ج' },
    EGP: { name: 'Egyptian Pound', flag: '🇪🇬', symbol: '£' },
    ERN: { name: 'Eritrean Nakfa', flag: '🇪🇷', symbol: 'Nfk' },
    ETB: { name: 'Ethiopian Birr', flag: '🇪🇹', symbol: 'Br' },
    EUR: { name: 'Euro', flag: '🇪🇺', symbol: '€' },
    FJD: { name: 'Fijian Dollar', flag: '🇫🇯', symbol: '$' },
    FKP: { name: 'Falkland Islands Pound', flag: '🇫🇰', symbol: '£' },
    GBP: { name: 'British Pound', flag: '🇬🇧', symbol: '£' },
    GEL: { name: 'Georgian Lari', flag: '🇬🇪', symbol: '₾' },
    GGP: { name: 'Guernsey Pound', flag: '🇬🇬', symbol: '£' },
    GHS: { name: 'Ghanaian Cedi', flag: '🇬🇭', symbol: '₵' },
    GIP: { name: 'Gibraltar Pound', flag: '🇬🇮', symbol: '£' },
    GMD: { name: 'Gambian Dalasi', flag: '🇬🇲', symbol: 'D' },
    GNF: { name: 'Guinean Franc', flag: '🇬🇳', symbol: 'Fr' },
    GTQ: { name: 'Guatemalan Quetzal', flag: '🇬🇹', symbol: 'Q' },
    GYD: { name: 'Guyanese Dollar', flag: '🇬🇾', symbol: '$' },
    HKD: { name: 'Hong Kong Dollar', flag: '🇭🇰', symbol: 'HK$' },
    HNL: { name: 'Honduran Lempira', flag: '🇭🇳', symbol: 'L' },
    HRK: { name: 'Croatian Kuna', flag: '🇭🇷', symbol: 'kn' },
    HTG: { name: 'Haitian Gourde', flag: '🇭🇹', symbol: 'G' },
    HUF: { name: 'Hungarian Forint', flag: '🇭🇺', symbol: 'Ft' },
    IDR: { name: 'Indonesian Rupiah', flag: '🇮🇩', symbol: 'Rp' },
    ILS: { name: 'Israeli New Shekel', flag: '🇮🇱', symbol: '₪' },
    IMP: { name: 'Isle of Man Pound', flag: '🇮🇲', symbol: '£' },
    INR: { name: 'Indian Rupee', flag: '🇮🇳', symbol: '₹' },
    IQD: { name: 'Iraqi Dinar', flag: '🇮🇶', symbol: 'ع.د' },
    IRR: { name: 'Iranian Rial', flag: '🇮🇷', symbol: '﷼' },
    ISK: { name: 'Icelandic Króna', flag: '🇮🇸', symbol: 'kr' },
    JEP: { name: 'Jersey Pound', flag: '🇯🇪', symbol: '£' },
    JMD: { name: 'Jamaican Dollar', flag: '🇯🇲', symbol: '$' },
    JOD: { name: 'Jordanian Dinar', flag: '🇯🇴', symbol: 'د.ا' },
    JPY: { name: 'Japanese Yen', flag: '🇯🇵', symbol: '¥' },
    KES: { name: 'Kenyan Shilling', flag: '🇰🇪', symbol: 'KSh' },
    KGS: { name: 'Kyrgyzstani Som', flag: '🇰🇬', symbol: 'с' },
    KHR: { name: 'Cambodian Riel', flag: '🇰🇭', symbol: '៛' },
    KMF: { name: 'Comorian Franc', flag: '🇰🇲', symbol: 'Fr' },
    KPW: { name: 'North Korean Won', flag: '🇰🇵', symbol: '₩' },
    KRW: { name: 'South Korean Won', flag: '🇰🇷', symbol: '₩' },
    KWD: { name: 'Kuwaiti Dinar', flag: '🇰🇼', symbol: 'د.ك' },
    KYD: { name: 'Cayman Islands Dollar', flag: '🇰🇾', symbol: '$' },
    KZT: { name: 'Kazakhstani Tenge', flag: '🇰🇿', symbol: '₸' },
    LAK: { name: 'Lao Kip', flag: '🇱🇦', symbol: '₭' },
    LBP: { name: 'Lebanese Pound', flag: '🇱🇧', symbol: 'ل.ل.' },
    LKR: { name: 'Sri Lankan Rupee', flag: '🇱🇰', symbol: '₨' },
    LRD: { name: 'Liberian Dollar', flag: '🇱🇷', symbol: 'L$' },
    LSL: { name: 'Lesotho Loti', flag: '🇱🇸', symbol: 'L' },
    LYD: { name: 'Libyan Dinar', flag: '🇱🇾', symbol: 'ل.د' },
    MAD: { name: 'Moroccan Dirham', flag: '🇲🇦', symbol: 'د.م.' },
    MDL: { name: 'Moldovan Leu', flag: '🇲🇩', symbol: 'L' },
    MGA: { name: 'Malagasy Ariary', flag: '🇲🇬', symbol: 'Ar' },
    MKD: { name: 'Macedonian Denar', flag: '🇲🇰', symbol: 'ден' },
    MMK: { name: 'Myanmar Kyat', flag: '🇲🇲', symbol: 'K' },
    MNT: { name: 'Mongolian Tögrög', flag: '🇲🇳', symbol: '₮' },
    MOP: { name: 'Macanese Pataca', flag: '🇲🇴', symbol: 'P' },
    MRU: { name: 'Mauritanian Ouguiya', flag: '🇲🇷', symbol: 'UM' },
    MUR: { name: 'Mauritian Rupee', flag: '🇲🇺', symbol: '₨' },
    MVR: { name: 'Maldivian Rufiyaa', flag: '🇲🇻', symbol: 'Rf' },
    MWK: { name: 'Malawian Kwacha', flag: '🇲🇼', symbol: 'MK' },
    MXN: { name: 'Mexican Peso', flag: '🇲🇽', symbol: '$' },
    MYR: { name: 'Malaysian Ringgit', flag: '🇲🇾', symbol: 'RM' },
    MZN: { name: 'Mozambican Metical', flag: '🇲🇿', symbol: 'MT' },
    NAD: { name: 'Namibian Dollar', flag: '🇳🇦', symbol: '$' },
    NGN: { name: 'Nigerian Naira', flag: '🇳🇬', symbol: '₦' },
    NIO: { name: 'Nicaraguan Córdoba', flag: '🇳🇮', symbol: 'C$' },
    NOK: { name: 'Norwegian Krone', flag: '🇳🇴', symbol: 'kr' },
    NPR: { name: 'Nepalese Rupee', flag: '🇳🇵', symbol: '₨' },
    NZD: { name: 'New Zealand Dollar', flag: '🇳🇿', symbol: 'NZ$' },
    OMR: { name: 'Omani Rial', flag: '🇴🇲', symbol: 'ر.ع.' },
    PAB: { name: 'Panamanian Balboa', flag: '🇵🇦', symbol: 'B/.' },
    PEN: { name: 'Peruvian Sol', flag: '🇵🇪', symbol: 'S/' },
    PGK: { name: 'Papua New Guinean Kina', flag: '🇵🇬', symbol: 'K' },
    PHP: { name: 'Philippine Peso', flag: '🇵🇭', symbol: '₱' },
    PKR: { name: 'Pakistani Rupee', flag: '🇵🇰', symbol: '₨' },
    PLN: { name: 'Polish Zloty', flag: '🇵🇱', symbol: 'zł' },
    PYG: { name: 'Paraguayan Guarani', flag: '🇵🇾', symbol: '₲' },
    QAR: { name: 'Qatari Riyal', flag: '🇶🇦', symbol: '﷼' },
    RON: { name: 'Romanian Leu', flag: '🇷🇴', symbol: 'lei' },
    RSD: { name: 'Serbian Dinar', flag: '🇷🇸', symbol: 'дин.' },
    RUB: { name: 'Russian Ruble', flag: '🇷🇺', symbol: '₽' },
    RWF: { name: 'Rwandan Franc', flag: '🇷🇼', symbol: 'Fr' },
    SAR: { name: 'Saudi Riyal', flag: '🇸🇦', symbol: '﷼' },
    SCR: { name: 'Seychellois Rupee', flag: '🇸🇨', symbol: '₨' },
    SDG: { name: 'Sudanese Pound', flag: '🇸🇩', symbol: 'ج.س.' },
    SEK: { name: 'Swedish Krona', flag: '🇸🇪', symbol: 'kr' },
    SGD: { name: 'Singapore Dollar', flag: '🇸🇬', symbol: 'S$' },
    SHP: { name: 'Saint Helena Pound', flag: '🇸🇭', symbol: '£' },
    SLL: { name: 'Sierra Leonean Leone', flag: '🇸🇱', symbol: 'Le' },
    SOS: { name: 'Somali Shilling', flag: '🇸🇴', symbol: 'Sh' },
    SSP: { name: 'South Sudanese Pound', flag: '🇸🇸', symbol: '£' },
    STN: { name: 'São Tomé and Príncipe Dobra', flag: '🇸🇹', symbol: 'Db' },
    SVC: { name: 'Salvadoran Colón', flag: '🇸🇻', symbol: '₡' },
    SYP: { name: 'Syrian Pound', flag: '🇸🇾', symbol: 'ل.س' },
    SZL: { name: 'Eswatini Lilangeni', flag: '🇸🇿', symbol: 'L' },
    THB: { name: 'Thai Baht', flag: '🇹🇭', symbol: '฿' },
    TJS: { name: 'Tajikistani Somoni', flag: '🇹🇯', symbol: 'ЅМ' },
    TMT: { name: 'Turkmenistani Manat', flag: '🇹🇲', symbol: 'm' },
    TND: { name: 'Tunisian Dinar', flag: '🇹🇳', symbol: 'د.ت' },
    TOP: { name: 'Tongan Paʻanga', flag: '🇹🇴', symbol: 'T$' },
    TRY: { name: 'Turkish Lira', flag: '🇹🇷', symbol: '₺' },
    TTD: { name: 'Trinidad and Tobago Dollar', flag: '🇹🇹', symbol: '$' },
    TWD: { name: 'New Taiwan Dollar', flag: '🇹🇼', symbol: 'NT$' },
    TZS: { name: 'Tanzanian Shilling', flag: '🇹🇿', symbol: 'TSh' },
    UAH: { name: 'Ukrainian Hryvnia', flag: '🇺🇦', symbol: '₴' },
    UGX: { name: 'Ugandan Shilling', flag: '🇺🇬', symbol: 'USh' },
    USD: { name: 'US Dollar', flag: '🇺🇸', symbol: '$' },
    UYU: { name: 'Uruguayan Peso', flag: '🇺🇾', symbol: '$' },
    UZS: { name: 'Uzbekistani Soʻm', flag: '🇺🇿', symbol: 'сўм' },
    VES: { name: 'Venezuelan Bolívar Soberano', flag: '🇻🇪', symbol: 'Bs.' },
    VND: { name: 'Vietnamese Dong', flag: '🇻🇳', symbol: '₫' },
    VUV: { name: 'Vanuatu Vatu', flag: '🇻🇺', symbol: 'Vt' },
    WST: { name: 'Samoan Tala', flag: '🇼🇸', symbol: 'T' },
    XAF: { name: 'Central African CFA Franc', flag: '🇨🇫', symbol: 'FCFA' },
    XCD: { name: 'East Caribbean Dollar', flag: '🇦🇬', symbol: '$' },
    XOF: { name: 'West African CFA Franc', flag: '🇧🇯', symbol: 'FCFA' },
    XPF: { name: 'CFP Franc', flag: '🇵🇫', symbol: 'Fr' },
    YER: { name: 'Yemeni Rial', flag: '🇾🇪', symbol: '﷼' },
    ZAR: { name: 'South African Rand', flag: '🇿🇦', symbol: 'R' },
    ZMW: { name: 'Zambian Kwacha', flag: '🇿🇲', symbol: 'ZK' },
    ZWL: { name: 'Zimbabwean Dollar', flag: '🇿🇼', symbol: 'Z$' },
  };

  const fetchCurrencyData = async () => {
    try {
      setIsLoading(true);

      // --- 1. Attempt to load cached data for instant display ---
      const cachedData = localStorage.getItem('cachedCurrencyRates');
      const cachedTimestamp = localStorage.getItem('cachedCurrencyRatesTimestamp');
      const now = new Date().getTime();
      const cacheFreshnessLimit = 5 * 60 * 1000; // 5 minutes in milliseconds

      if (cachedData && cachedTimestamp) {
        const parsedCachedData = JSON.parse(cachedData);
        const parsedCachedTimestamp = parseInt(cachedTimestamp, 10);

        if (now - parsedCachedTimestamp < cacheFreshnessLimit) {
          setCurrencies(parsedCachedData.currencies);
          setLastUpdated(parsedCachedData.lastUpdated);
          setIsLoading(false);
        } else {
          setCurrencies(parsedCachedData.currencies);
          setLastUpdated(parsedCachedData.lastUpdated + ' (stale)');
        }
      }

      // --- 2. Always fetch fresh data in the background ---
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (!response.ok) {
        throw new Error('Failed to fetch currency data');
      }

      const data = await response.json();
      const rates: CurrencyData = data.rates;
      // baseCurrencyCode will be 'USD' from the API response
      const baseCurrencyCode = data.base; 

      const ngnRateToUsd = rates['NGN'];

      const previousRates = currencies.reduce((acc, curr) => {
        acc[curr.code] = curr.rate;
        return acc;
      }, {} as Record<string, number>);

      const processedCurrencies: Currency[] = Object.entries(rates)
        .map(([code, rateFromUsd]) => {
          // Exclude NGN and any currency not explicitly found in currencyInfo
          if (code === 'NGN' || !currencyInfo[code]) {
            return null; // Exclude this currency
          }
          
          const info = currencyInfo[code]; 

          // Calculate the rate as '1 unit of foreign currency = X NGN'
          const rateInNgn = ngnRateToUsd / rateFromUsd;

          return {
            code,
            name: info.name,
            flag: info.flag,
            symbol: info.symbol,
            rate: rateInNgn,
            previousRate: previousRates[code],
          };
        })
        .filter(Boolean) as Currency[]; // Filter out null entries

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
    
    // Auto-refresh every 5 minutes (still in effect for continuous updates)
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