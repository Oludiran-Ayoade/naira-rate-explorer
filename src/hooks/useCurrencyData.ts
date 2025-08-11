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

  // This object now contains metadata for all 161 currencies provided by exchangerate-api.com.
  const currencyInfo: Record<string, { name: string; flag: string; symbol: string }> = {
    // Top Currencies
    USD: { name: 'US Dollar', flag: '🇺🇸', symbol: '$' },
    EUR: { name: 'Euro', flag: '🇪🇺', symbol: '€' },
    GBP: { name: 'British Pound', flag: '🇬🇧', symbol: '£' },
    JPY: { name: 'Japanese Yen', flag: '🇯🇵', symbol: '¥' },
    CAD: { name: 'Canadian Dollar', flag: '🇨�', symbol: 'C$' },
    AUD: { name: 'Australian Dollar', flag: '🇦🇺', symbol: 'A$' },
    CHF: { name: 'Swiss Franc', flag: '🇨🇭', symbol: 'Fr' },
    CNY: { name: 'Chinese Yuan', flag: '🇨🇳', symbol: '¥' },
    INR: { name: 'Indian Rupee', flag: '🇮🇳', symbol: '₹' },
    SGD: { name: 'Singapore Dollar', flag: '🇸🇬', symbol: 'S$' },
    HKD: { name: 'Hong Kong Dollar', flag: '🇭🇰', symbol: 'HK$' },
    NZD: { name: 'New Zealand Dollar', flag: '🇳🇿', symbol: 'NZ$' },
    SEK: { name: 'Swedish Krona', flag: '🇸🇪', symbol: 'kr' },
    KRW: { name: 'South Korean Won', flag: '🇰🇷', symbol: '₩' },
    NOK: { name: 'Norwegian Krone', flag: '🇳🇴', symbol: 'kr' },
    MXN: { name: 'Mexican Peso', flag: '🇲🇽', symbol: '$' },
    BRL: { name: 'Brazilian Real', flag: '🇧🇷', symbol: 'R$' },
    RUB: { name: 'Russian Ruble', flag: '🇷🇺', symbol: '₽' },
    ZAR: { name: 'South African Rand', flag: '🇿🇦', symbol: 'R' },
    TRY: { name: 'Turkish Lira', flag: '🇹🇷', symbol: '₺' },
    IDR: { name: 'Indonesian Rupiah', flag: '🇮🇩', symbol: 'Rp' },
    MYR: { name: 'Malaysian Ringgit', flag: '🇲🇾', symbol: 'RM' },
    PHP: { name: 'Philippine Peso', flag: '🇵🇭', symbol: '₱' },
    THB: { name: 'Thai Baht', flag: '🇹🇭', symbol: '฿' },
    PLN: { name: 'Polish Zloty', flag: '🇵🇱', symbol: 'zł' },
    DKK: { name: 'Danish Krone', flag: '🇩🇰', symbol: 'kr' },
    CZK: { name: 'Czech Koruna', flag: '🇨🇿', symbol: 'Kč' },
    HUF: { name: 'Hungarian Forint', flag: '🇭🇺', symbol: 'Ft' },
    ILS: { name: 'Israeli New Shekel', flag: '🇮🇱', symbol: '₪' },
    CLP: { name: 'Chilean Peso', flag: '🇨🇱', symbol: '$' },
    COP: { name: 'Colombian Peso', flag: '🇨🇴', symbol: '$' },
    PEN: { name: 'Peruvian Sol', flag: '🇵🇪', symbol: 'S/' },
    ARS: { name: 'Argentine Peso', flag: '🇦🇷', symbol: '$' },
    NGN: { name: 'Nigerian Naira', flag: '🇳🇬', symbol: '₦' },
    GHS: { name: 'Ghanaian Cedi', flag: '🇬🇭', symbol: '₵' },
    KES: { name: 'Kenyan Shilling', flag: '🇰🇪', symbol: 'KSh' },
    EGP: { name: 'Egyptian Pound', flag: '🇪🇬', symbol: '£' },
    AED: { name: 'UAE Dirham', flag: '🇦🇪', symbol: 'د.إ' },
    SAR: { name: 'Saudi Riyal', flag: '🇸🇦', symbol: '﷼' },
    QAR: { name: 'Qatari Riyal', flag: '🇶🇦', symbol: '﷼' },
    KWD: { name: 'Kuwaiti Dinar', flag: '🇰🇼', symbol: 'د.ك' },
    BHD: { name: 'Bahraini Dinar', flag: '🇧🇭', symbol: '.د.ب' },
    OMR: { name: 'Omani Rial', flag: '🇴🇲', symbol: 'ر.ع.' },
    JOD: { name: 'Jordanian Dinar', flag: '🇯🇴', symbol: 'د.ا' },

    // Alphabetical List of all 161 Currencies (excluding duplicates from common list above)
    AFN: { name: 'Afghan Afghani', flag: '🇦🇫', symbol: '؋' },
    ALL: { name: 'Albanian Lek', flag: '🇦🇱', symbol: 'L' },
    AMD: { name: 'Armenian Dram', flag: '🇦🇲', symbol: '֏' },
    ANG: { name: 'Netherlands Antillean Guilder', flag: '🇦🇼', symbol: 'ƒ' },
    AOA: { name: 'Angolan Kwanza', flag: '🇦🇴', symbol: 'Kz' },
    AZN: { name: 'Azerbaijani Manat', flag: '🇦🇿', symbol: '₼' },
    BAM: { name: 'Bosnia and Herzegovina Convertible Mark', flag: '🇧🇦', symbol: 'KM' },
    BBD: { name: 'Barbadian Dollar', flag: '🇧🇧', symbol: '$' },
    BDT: { name: 'Bangladeshi Taka', flag: '🇧🇩', symbol: '৳' },
    BGN: { name: 'Bulgarian Lev', flag: '🇧🇬', symbol: 'лв' },
    BIF: { name: 'Burundian Franc', flag: '🇧🇮', symbol: 'Fr' },
    BMD: { name: 'Bermudian Dollar', flag: '🇧🇲', symbol: '$' },
    BND: { name: 'Brunei Dollar', flag: '🇧🇳', symbol: '$' },
    BOB: { name: 'Bolivian Boliviano', flag: '🇧🇴', symbol: 'Bs.' },
    BTN: { name: 'Bhutanese Ngultrum', flag: '🇧🇹', symbol: 'Nu.' },
    BWP: { name: 'Botswana Pula', flag: '🇧🇼', symbol: 'P' },
    BZD: { name: 'Belize Dollar', flag: '🇧🇿', symbol: 'BZ$' },
    CDF: { name: 'Congolese Franc', flag: '🇨🇩', symbol: 'FC' },
    CRC: { name: 'Costa Rican Colón', flag: '🇨🇷', symbol: '₡' },
    CUC: { name: 'Cuban Convertible Peso', flag: '🇨🇺', symbol: '$' },
    CUP: { name: 'Cuban Peso', flag: '🇨🇺', symbol: '$' },
    CVE: { name: 'Cape Verdean Escudo', flag: '🇨🇻', symbol: '$' },
    DJF: { name: 'Djiboutian Franc', flag: '🇩🇯', symbol: 'Fdj' },
    DOP: { name: 'Dominican Peso', flag: '🇩🇴', symbol: 'RD$' },
    DZD: { name: 'Algerian Dinar', flag: '🇩🇿', symbol: 'د.ج' },
    ERN: { name: 'Eritrean Nakfa', flag: '🇪🇷', symbol: 'Nfk' },
    ETB: { name: 'Ethiopian Birr', flag: '🇪🇹', symbol: 'Br' },
    FJD: { name: 'Fijian Dollar', flag: '🇫🇯', symbol: '$' },
    FKP: { name: 'Falkland Islands Pound', flag: '🇫🇰', symbol: '£' },
    GEL: { name: 'Georgian Lari', flag: '🇬🇪', symbol: '₾' },
    GGP: { name: 'Guernsey Pound', flag: '🇬🇬', symbol: '£' },
    GIP: { name: 'Gibraltar Pound', flag: '🇬🇮', symbol: '£' },
    GMD: { name: 'Gambian Dalasi', flag: '🇬🇲', symbol: 'D' },
    GNF: { name: 'Guinean Franc', flag: '🇬🇳', symbol: 'Fr' },
    GTQ: { name: 'Guatemalan Quetzal', flag: '🇬🇹', symbol: 'Q' },
    GYD: { name: 'Guyanese Dollar', flag: '🇬🇾', symbol: '$' },
    HNL: { name: 'Honduran Lempira', flag: '🇭🇳', symbol: 'L' },
    HTG: { name: 'Haitian Gourde', flag: '🇭🇹', symbol: 'G' },
    IMP: { name: 'Isle of Man Pound', flag: '🇮🇲', symbol: '£' },
    IQD: { name: 'Iraqi Dinar', flag: '🇮🇶', symbol: 'ع.د' },
    IRR: { name: 'Iranian Rial', flag: '🇮🇷', symbol: '﷼' },
    ISK: { name: 'Icelandic Króna', flag: '🇮🇸', symbol: 'kr' },
    JEP: { name: 'Jersey Pound', flag: '🇯🇪', symbol: '£' },
    JMD: { name: 'Jamaican Dollar', flag: '🇯🇲', symbol: '$' },
    KGS: { name: 'Kyrgyzstani Som', flag: '🇰🇬', symbol: 'с' },
    KHR: { name: 'Cambodian Riel', flag: '🇰🇭', symbol: '៛' },
    KMF: { name: 'Comorian Franc', flag: '🇰🇲', symbol: 'Fr' },
    KPW: { name: 'North Korean Won', flag: '🇰🇵', symbol: '₩' },
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
    MZN: { name: 'Mozambican Metical', flag: '🇲🇿', symbol: 'MT' },
    NAD: { name: 'Namibian Dollar', flag: '🇳🇦', symbol: '$' },
    NIO: { name: 'Nicaraguan Córdoba', flag: '🇳🇮', symbol: 'C$' },
    NPR: { name: 'Nepalese Rupee', flag: '🇳🇵', symbol: '₨' },
    PAB: { name: 'Panamanian Balboa', flag: '🇵🇦', symbol: 'B/.' },
    PGK: { name: 'Papua New Guinean Kina', flag: '🇵🇬', symbol: 'K' },
    PKR: { name: 'Pakistani Rupee', flag: '🇵🇰', symbol: '₨' },
    PYG: { name: 'Paraguayan Guarani', flag: '🇵🇾', symbol: '₲' },
    RSD: { name: 'Serbian Dinar', flag: '🇷🇸', symbol: 'дин.' },
    RWF: { name: 'Rwandan Franc', flag: '🇷🇼', symbol: 'Fr' },
    SCR: { name: 'Seychellois Rupee', flag: '🇸🇨', symbol: '₨' },
    SDG: { name: 'Sudanese Pound', flag: '🇸🇩', symbol: 'ج.س.' },
    SHP: { name: 'Saint Helena Pound', flag: '🇸🇭', symbol: '£' },
    SLL: { name: 'Sierra Leonean Leone', flag: '🇸🇱', symbol: 'Le' },
    SOS: { name: 'Somali Shilling', flag: '🇸🇴', symbol: 'Sh' },
    SSP: { name: 'South Sudanese Pound', flag: '🇸🇸', symbol: '£' },
    STN: { name: 'São Tomé and Príncipe Dobra', flag: '🇸🇹', symbol: 'Db' },
    SVC: { name: 'Salvadoran Colón', flag: '🇸🇻', symbol: '₡' },
    SYP: { name: 'Syrian Pound', flag: '🇸🇾', symbol: 'ل.س' },
    SZL: { name: 'Eswatini Lilangeni', flag: '🇸🇿', symbol: 'L' },
    TJS: { name: 'Tajikistani Somoni', flag: '🇹🇯', symbol: 'ЅМ' },
    TMT: { name: 'Turkmenistani Manat', flag: '🇹🇲', symbol: 'm' },
    TND: { name: 'Tunisian Dinar', flag: '🇹🇳', symbol: 'د.ت' },
    TOP: { name: 'Tongan Paʻanga', flag: '🇹🇴', symbol: 'T$' },
    TTD: { name: 'Trinidad and Tobago Dollar', flag: '🇹🇹', symbol: '$' },
    UAH: { name: 'Ukrainian Hryvnia', flag: '🇺🇦', symbol: '₴' },
    UGX: { name: 'Ugandan Shilling', flag: '🇺🇬', symbol: 'USh' },
    UYU: { name: 'Uruguayan Peso', flag: '🇺🇾', symbol: '$' },
    UZS: { name: 'Uzbekistani Soʻm', flag: '🇺🇿', symbol: 'сўм' },
    VES: { name: 'Venezuelan Bolívar Soberano', flag: '🇻🇪', symbol: 'Bs.' },
    VUV: { name: 'Vanuatu Vatu', flag: '🇻🇺', symbol: 'Vt' },
    WST: { name: 'Samoan Tala', flag: '🇼🇸', symbol: 'T' },
    XAF: { name: 'Central African CFA Franc', flag: '🇨🇫', symbol: 'FCFA' },
    XCD: { name: 'East Caribbean Dollar', flag: '🇦🇬', symbol: '$' },
    XOF: { name: 'West African CFA Franc', flag: '🇧🇯', symbol: 'FCFA' },
    XPF: { name: 'CFP Franc', flag: '🇵🇫', symbol: 'Fr' },
    YER: { name: 'Yemeni Rial', flag: '🇾🇪', symbol: '﷼' },
    ZMW: { name: 'Zambian Kwacha', flag: '🇿🇲', symbol: 'ZK' },
    ZWL: { name: 'Zimbabwean Dollar', flag: '🇿🇼', symbol: 'Z$' },
  };

  const fetchCurrencyData = async () => {
    try {
      setIsLoading(true);

      // Using the free tier API - ExchangeRate-API
      // Fetching rates relative to USD to get a broad list of global currencies.
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (!response.ok) {
        throw new Error('Failed to fetch currency data');
      }

      const data = await response.json();
      const rates: CurrencyData = data.rates;
      const baseCurrencyCode = data.base; // This should be 'USD'

      // Get the NGN rate relative to the base currency (USD)
      const ngnRateToUsd = rates['NGN'];

      // Store previous rates for comparison
      const previousRates = currencies.reduce((acc, curr) => {
        acc[curr.code] = curr.rate;
        return acc;
      }, {} as Record<string, number>);

      // Process currencies returned by the API
      const processedCurrencies: Currency[] = Object.entries(rates)
        .map(([code, rateFromUsd]) => {
          // Exclude NGN and currencies not found in currencyInfo
          if (code === 'NGN' || !currencyInfo[code]) {
            return null; // Exclude this currency
          }
          
          const info = currencyInfo[code]; // We know info exists because of the filter above

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

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchCurrencyData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const getMajorCurrencies = () => {
    return currencies
      .filter(currency => ['USD', 'EUR', 'GBP'].includes(currency.code)) // NGN is already excluded from 'currencies' state
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