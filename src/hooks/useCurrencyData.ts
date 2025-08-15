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

  // This object contains metadata (name, flag, symbol) for all 161 currencies
  // provided by exchangerate-api.com, excluding XDR.
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
    BAM: { name: 'Bosnia and Herzegovina Convertible Mark', flag: '�🇦', symbol: 'KM' },
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
    CDF: { name: 'Congolese Franc', flag: '🇨🇩', symbol: 'FC' },
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

  // --- Hardcoded Default Currency Rates (Snapshot relative to NGN) ---
  // This array will be used to immediately populate the UI if no cached data is found.
  // The rates are '1 foreign currency = X NGN' and are based on a snapshot around August 2025.
  const DEFAULT_CURRENCIES_SNAPSHOT: Currency[] = [
    { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪', symbol: 'د.إ', rate: 379.80 },
    { code: 'AFN', name: 'Afghan Afghani', flag: '🇦🇫', symbol: '؋', rate: 19.95 },
    { code: 'ALL', name: 'Albanian Lek', flag: '🇦🇱', symbol: 'L', rate: 15.05 },
    { code: 'AMD', name: 'Armenian Dram', flag: '🇦🇲', symbol: '֏', rate: 3.65 },
    { code: 'ANG', name: 'Netherlands Antillean Guilder', flag: '🇦🇼', symbol: 'ƒ', rate: 777.20 },
    { code: 'AOA', name: 'Angolan Kwanza', flag: '🇦🇴', symbol: 'Kz', rate: 1.68 },
    { code: 'ARS', name: 'Argentine Peso', flag: '🇦🇷', symbol: '$', rate: 1.55 },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', symbol: 'A$', rate: 910.15 },
    { code: 'AWG', name: 'Aruban Florin', flag: '🇦🇼', symbol: 'ƒ', rate: 777.20 },
    { code: 'AZN', name: 'Azerbaijani Manat', flag: '🇦🇿', symbol: '₼', rate: 823.50 },
    { code: 'BAM', name: 'Bosnia and Herzegovina Convertible Mark', flag: '🇧🇦', symbol: 'KM', rate: 840.90 },
    { code: 'BBD', name: 'Barbadian Dollar', flag: '🇧🇧', symbol: '$', rate: 700.00 },
    { code: 'BDT', name: 'Bangladeshi Taka', flag: '🇧🇩', symbol: '৳', rate: 11.90 },
    { code: 'BGN', name: 'Bulgarian Lev', flag: '🇧🇬', symbol: 'лв', rate: 840.90 },
    { code: 'BHD', name: 'Bahraini Dinar', flag: '🇧🇭', symbol: '.د.ب', rate: 3700.00 },
    { code: 'BIF', name: 'Burundian Franc', flag: '🇧🇮', symbol: 'Fr', rate: 0.49 },
    { code: 'BMD', name: 'Bermudian Dollar', flag: '🇧🇲', symbol: '$', rate: 1400.00 },
    { code: 'BND', name: 'Brunei Dollar', flag: '🇧🇳', symbol: '$', rate: 1030.00 },
    { code: 'BOB', name: 'Bolivian Boliviano', flag: '🇧🇴', symbol: 'Bs.', rate: 204.00 },
    { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷', symbol: 'R$', rate: 259.00 },
    { code: 'BSD', name: 'Bahamian Dollar', flag: '🇧🇸', symbol: '$', rate: 1400.00 },
    { code: 'BTN', name: 'Bhutanese Ngultrum', flag: '🇧🇹', symbol: 'Nu.', rate: 16.90 },
    { code: 'BWP', name: 'Botswana Pula', flag: '🇧🇼', symbol: 'P', rate: 102.00 },
    { code: 'BYN', name: 'Belarusian Ruble', flag: '🇧🇾', symbol: 'Br', rate: 420.00 },
    { code: 'BZD', name: 'Belize Dollar', flag: '🇧🇿', symbol: 'BZ$', rate: 698.00 },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', symbol: 'C$', rate: 1025.00 },
    { code: 'CDF', name: 'Congolese Franc', flag: '🇨🇩', symbol: 'FC', rate: 0.50 },
    { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', symbol: 'Fr', rate: 1550.00 },
    { code: 'CLP', name: 'Chilean Peso', flag: '🇨🇱', symbol: '$', rate: 1.48 },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳', symbol: '¥', rate: 193.00 },
    { code: 'COP', name: 'Colombian Peso', flag: '🇨🇴', symbol: '$', rate: 0.35 },
    { code: 'CRC', name: 'Costa Rican Colón', flag: '🇨🇷', symbol: '₡', rate: 2.70 },
    { code: 'CUC', name: 'Cuban Convertible Peso', flag: '🇨🇺', symbol: '$', rate: 1400.00 },
    { code: 'CUP', name: 'Cuban Peso', flag: '🇨🇺', symbol: '$', rate: 58.00 },
    { code: 'CVE', name: 'Cape Verdean Escudo', flag: '🇨🇻', symbol: '$', rate: 13.50 },
    { code: 'CZK', name: 'Czech Koruna', flag: '🇨🇿', symbol: 'Kč', rate: 56.00 },
    { code: 'DJF', name: 'Djiboutian Franc', flag: '🇩🇯', symbol: 'Fdj', rate: 7.90 },
    { code: 'DKK', name: 'Danish Krone', flag: '🇩🇰', symbol: 'kr', rate: 200.00 },
    { code: 'DOP', name: 'Dominican Peso', flag: '🇩🇴', symbol: 'RD$', rate: 24.00 },
    { code: 'DZD', name: 'Algerian Dinar', flag: '🇩🇿', symbol: 'د.ج', rate: 10.30 },
    { code: 'EGP', name: 'Egyptian Pound', flag: '🇪🇬', symbol: '£', rate: 29.50 },
    { code: 'ERN', name: 'Eritrean Nakfa', flag: '🇪🇷', symbol: 'Nfk', rate: 93.33 },
    { code: 'ETB', name: 'Ethiopian Birr', flag: '🇪🇹', symbol: 'Br', rate: 24.50 },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺', symbol: '€', rate: 1530.00 },
    { code: 'FJD', name: 'Fijian Dollar', flag: '🇫🇯', symbol: '$', rate: 620.00 },
    { code: 'FKP', name: 'Falkland Islands Pound', flag: '🇫🇰', symbol: '£', rate: 1770.00 },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧', symbol: '£', rate: 1770.00 },
    { code: 'GEL', name: 'Georgian Lari', flag: '🇬🇪', symbol: '₾', rate: 505.00 },
    { code: 'GGP', name: 'Guernsey Pound', flag: '🇬🇬', symbol: '£', rate: 1770.00 },
    { code: 'GHS', name: 'Ghanaian Cedi', flag: '🇬🇭', symbol: '₵', rate: 94.00 },
    { code: 'GIP', name: 'Gibraltar Pound', flag: '🇬🇮', symbol: '£', rate: 1770.00 },
    { code: 'GMD', name: 'Gambian Dalasi', flag: '🇬🇲', symbol: 'D', rate: 20.20 },
    { code: 'GNF', name: 'Guinean Franc', flag: '🇬🇳', symbol: 'Fr', rate: 0.16 },
    { code: 'GTQ', name: 'Guatemalan Quetzal', flag: '🇬🇹', symbol: 'Q', rate: 180.00 },
    { code: 'GYD', name: 'Guyanese Dollar', flag: '🇬🇾', symbol: '$', rate: 6.70 },
    { code: 'HKD', name: 'Hong Kong Dollar', flag: '🇭🇰', symbol: 'HK$', rate: 179.00 },
    { code: 'HNL', name: 'Honduran Lempira', flag: '🇭🇳', symbol: 'L', rate: 57.00 },
    { code: 'HRK', name: 'Croatian Kuna', flag: '🇭🇷', symbol: 'kn', rate: 203.00 },
    { code: 'HTG', name: 'Haitian Gourde', flag: '🇭🇹', symbol: 'G', rate: 10.50 },
    { code: 'HUF', name: 'Hungarian Forint', flag: '🇭🇺', symbol: 'Ft', rate: 3.90 },
    { code: 'IDR', name: 'Indonesian Rupiah', flag: '🇮🇩', symbol: 'Rp', rate: 0.088 },
    { code: 'ILS', name: 'Israeli New Shekel', flag: '🇮🇱', symbol: '₪', rate: 370.00 },
    { code: 'IMP', name: 'Isle of Man Pound', flag: '🇮🇲', symbol: '£', rate: 1770.00 },
    { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳', symbol: '₹', rate: 16.90 },
    { code: 'IQD', name: 'Iraqi Dinar', flag: '🇮🇶', symbol: 'ع.د', rate: 1.07 },
    { code: 'IRR', name: 'Iranian Rial', flag: '🇮🇷', symbol: '﷼', rate: 0.033 },
    { code: 'ISK', name: 'Icelandic Króna', flag: '🇮🇸', symbol: 'kr', rate: 10.00 },
    { code: 'JEP', name: 'Jersey Pound', flag: '🇯🇪', symbol: '£', rate: 1770.00 },
    { code: 'JMD', name: 'Jamaican Dollar', flag: '🇯🇲', symbol: '$', rate: 9.00 },
    { code: 'JOD', name: 'Jordanian Dinar', flag: '🇯🇴', symbol: 'د.ا', rate: 1970.00 },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', symbol: '¥', rate: 9.00 },
    { code: 'KES', name: 'Kenyan Shilling', flag: '🇰🇪', symbol: 'KSh', rate: 10.70 },
    { code: 'KGS', name: 'Kyrgyzstani Som', flag: '🇰🇬', symbol: 'с', rate: 15.70 },
    { code: 'KHR', name: 'Cambodian Riel', flag: '🇰🇭', symbol: '៛', rate: 0.34 },
    { code: 'KMF', name: 'Comorian Franc', flag: '🇰🇲', symbol: 'Fr', rate: 3.10 },
    { code: 'KPW', name: 'North Korean Won', flag: '🇰🇵', symbol: '₩', rate: 1.55 },
    { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷', symbol: '₩', rate: 1.00 },
    { code: 'KWD', name: 'Kuwaiti Dinar', flag: '🇰🇼', symbol: 'د.ك', rate: 4570.00 },
    { code: 'KYD', name: 'Cayman Islands Dollar', flag: '🇰🇾', symbol: '$', rate: 1680.00 },
    { code: 'KZT', name: 'Kazakhstani Tenge', flag: '🇰🇿', symbol: '₸', rate: 3.00 },
    { code: 'LAK', name: 'Lao Kip', flag: '🇱🇦', symbol: '₭', rate: 0.065 },
    { code: 'LBP', name: 'Lebanese Pound', flag: '🇱🇧', symbol: 'ل.ل.', rate: 0.015 },
    { code: 'LKR', name: 'Sri Lankan Rupee', flag: '🇱🇰', symbol: '₨', rate: 4.60 },
    { code: 'LRD', name: 'Liberian Dollar', flag: '🇱🇷', symbol: 'L$', rate: 7.20 },
    { code: 'LSL', name: 'Lesotho Loti', flag: '🇱🇸', symbol: 'L', rate: 74.00 },
    { code: 'LYD', name: 'Libyan Dinar', flag: '🇱🇾', symbol: 'ل.د', rate: 288.00 },
    { code: 'MAD', name: 'Moroccan Dirham', flag: '🇲🇦', symbol: 'د.م.', rate: 140.00 },
    { code: 'MDL', name: 'Moldovan Leu', flag: '🇲🇩', symbol: 'L', rate: 78.00 },
    { code: 'MGA', name: 'Malagasy Ariary', flag: '🇲🇬', symbol: 'Ar', rate: 0.31 },
    { code: 'MKD', name: 'Macedonian Denar', flag: '🇲🇰', symbol: 'ден', rate: 25.00 },
    { code: 'MMK', name: 'Myanmar Kyat', flag: '🇲🇲', symbol: 'K', rate: 0.67 },
    { code: 'MNT', name: 'Mongolian Tögrög', flag: '🇲🇳', symbol: '₮', rate: 0.40 },
    { code: 'MOP', name: 'Macanese Pataca', flag: '🇲🇴', symbol: 'P', rate: 172.00 },
    { code: 'MRU', name: 'Mauritanian Ouguiya', flag: '🇲🇷', symbol: 'UM', rate: 35.00 },
    { code: 'MUR', name: 'Mauritian Rupee', flag: '🇲🇺', symbol: '₨', rate: 30.50 },
    { code: 'MVR', name: 'Maldivian Rufiyaa', flag: '🇲🇻', symbol: 'Rf', rate: 91.00 },
    { code: 'MWK', name: 'Malawian Kwacha', flag: '🇲🇼', symbol: 'MK', rate: 0.81 },
    { code: 'MXN', name: 'Mexican Peso', flag: '🇲🇽', symbol: '$', rate: 75.00 },
    { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾', symbol: 'RM', rate: 297.00 },
    { code: 'MZN', name: 'Mozambican Metical', flag: '🇲🇿', symbol: 'MT', rate: 22.00 },
    { code: 'NAD', name: 'Namibian Dollar', flag: '🇳🇦', symbol: '$', rate: 74.00 },
    { code: 'NIO', name: 'Nicaraguan Córdoba', flag: '🇳🇮', symbol: 'C$', rate: 38.00 },
    { code: 'NOK', name: 'Norwegian Krone', flag: '🇳🇴', symbol: 'kr', rate: 130.00 },
    { code: 'NPR', name: 'Nepalese Rupee', flag: '🇳🇵', symbol: '₨', rate: 10.50 },
    { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿', symbol: 'NZ$', rate: 840.00 },
    { code: 'OMR', name: 'Omani Rial', flag: '🇴🇲', symbol: 'ر.ع.', rate: 3600.00 },
    { code: 'PAB', name: 'Panamanian Balboa', flag: '🇵🇦', symbol: 'B/.', rate: 1400.00 },
    { code: 'PEN', name: 'Peruvian Sol', flag: '🇵🇪', symbol: 'S/', rate: 375.00 },
    { code: 'PGK', name: 'Papua New Guinean Kina', flag: '🇵🇬', symbol: 'K', rate: 360.00 },
    { code: 'PHP', name: 'Philippine Peso', flag: '🇵🇭', symbol: '₱', rate: 23.50 },
    { code: 'PKR', name: 'Pakistani Rupee', flag: '🇵🇰', symbol: '₨', rate: 5.00 },
    { code: 'PLN', name: 'Polish Zloty', flag: '🇵🇱', symbol: 'zł', rate: 350.00 },
    { code: 'PYG', name: 'Paraguayan Guarani', flag: '🇵🇾', symbol: '₲', rate: 0.19 },
    { code: 'QAR', name: 'Qatari Riyal', flag: '🇶🇦', symbol: '﷼', rate: 385.00 },
    { code: 'RON', name: 'Romanian Leu', flag: '🇷🇴', symbol: 'lei', rate: 310.00 },
    { code: 'RSD', name: 'Serbian Dinar', flag: '🇷🇸', symbol: 'дин.', rate: 13.00 },
    { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺', symbol: '₽', rate: 15.50 },
    { code: 'RWF', name: 'Rwandan Franc', flag: '🇷🇼', symbol: 'Fr', rate: 1.07 },
    { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦', symbol: '﷼', rate: 372.00 },
    { code: 'SCR', name: 'Seychellois Rupee', flag: '🇸🇨', symbol: '₨', rate: 100.00 },
    { code: 'SDG', name: 'Sudanese Pound', flag: '🇸🇩', symbol: 'ج.س.', rate: 2.30 },
    { code: 'SEK', name: 'Swedish Krona', flag: '🇸🇪', symbol: 'kr', rate: 130.00 },
    { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬', symbol: 'S$', rate: 1030.00 },
    { code: 'SHP', name: 'Saint Helena Pound', flag: '🇸🇭', symbol: '£', rate: 1770.00 },
    { code: 'SLL', name: 'Sierra Leonean Leone', flag: '🇸🇱', symbol: 'Le', rate: 0.068 },
    { code: 'SOS', name: 'Somali Shilling', flag: '🇸🇴', symbol: 'Sh', rate: 2.45 },
    { code: 'SSP', name: 'South Sudanese Pound', flag: '🇸🇸', symbol: '£', rate: 1.10 },
    { code: 'STN', name: 'São Tomé and Príncipe Dobra', flag: '🇸🇹', symbol: 'Db', rate: 60.00 },
    { code: 'SVC', name: 'Salvadoran Colón', flag: '🇸🇻', symbol: '₡', rate: 160.00 },
    { code: 'SYP', name: 'Syrian Pound', flag: '🇸🇾', symbol: 'ل.س', rate: 0.11 },
    { code: 'SZL', name: 'Eswatini Lilangeni', flag: '🇸🇿', symbol: 'L', rate: 74.00 },
    { code: 'THB', name: 'Thai Baht', flag: '🇹🇭', symbol: '฿', rate: 38.00 },
    { code: 'TJS', name: 'Tajikistani Somoni', flag: '🇹🇯', symbol: 'ЅМ', rate: 128.00 },
    { code: 'TMT', name: 'Turkmenistani Manat', flag: '🇹🇲', symbol: 'm', rate: 400.00 },
    { code: 'TND', name: 'Tunisian Dinar', flag: '🇹🇳', symbol: 'د.ت', rate: 445.00 },
    { code: 'TOP', name: 'Tongan Paʻanga', flag: '🇹🇴', symbol: 'T$', rate: 580.00 },
    { code: 'TRY', name: 'Turkish Lira', flag: '🇹🇷', symbol: '₺', rate: 43.00 },
    { code: 'TTD', name: 'Trinidad and Tobago Dollar', flag: '🇹🇹', symbol: '$', rate: 206.00 },
    { code: 'TWD', name: 'New Taiwan Dollar', flag: '🇹🇼', symbol: 'NT$', rate: 43.00 },
    { code: 'TZS', name: 'Tanzanian Shilling', flag: '🇹🇿', symbol: 'TSh', rate: 0.54 },
    { code: 'UAH', name: 'Ukrainian Hryvnia', flag: '🇺🇦', symbol: '₴', rate: 35.00 },
    { code: 'UGX', name: 'Ugandan Shilling', flag: '🇺🇬', symbol: 'USh', rate: 0.38 },
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸', symbol: '$', rate: 1400.00 },
    { code: 'UYU', name: 'Uruguayan Peso', flag: '🇺🇾', symbol: '$', rate: 35.00 },
    { code: 'UZS', name: 'Uzbekistani Soʻm', flag: '🇺🇿', symbol: 'сўм', rate: 0.11 },
    { code: 'VES', name: 'Venezuelan Bolívar Soberano', flag: '🇻🇪', symbol: 'Bs.', rate: 38.00 },
    { code: 'VND', name: 'Vietnamese Dong', flag: '🇻🇳', symbol: '₫', rate: 0.056 },
    { code: 'VUV', name: 'Vanuatu Vatu', flag: '🇻🇺', symbol: 'Vt', rate: 11.50 },
    { code: 'WST', name: 'Samoan Tala', flag: '🇼🇸', symbol: 'T', rate: 510.00 },
    { code: 'XAF', name: 'Central African CFA Franc', flag: '🇨🇫', symbol: 'FCFA', rate: 2.35 },
    { code: 'XCD', name: 'East Caribbean Dollar', flag: '🇦🇬', symbol: '$', rate: 518.00 },
    { code: 'XOF', name: 'West African CFA Franc', flag: '🇧🇯', symbol: 'FCFA', rate: 2.35 },
    { code: 'XPF', name: 'CFP Franc', flag: '🇵🇫', symbol: 'Fr', rate: 12.80 },
    { code: 'YER', name: 'Yemeni Rial', flag: '🇾🇪', symbol: '﷼', rate: 5.60 },
    { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦', symbol: 'R', rate: 74.00 },
    { code: 'ZMW', name: 'Zambian Kwacha', flag: '🇿🇲', symbol: 'ZK', rate: 52.00 },
    { code: 'ZWL', name: 'Zimbabwean Dollar', flag: '🇿🇼', symbol: 'Z$', rate: 0.004 },
  ];

  const fetchCurrencyData = async () => {
    try {
      setIsLoading(true);

      const cachedData = localStorage.getItem('cachedCurrencyRates');
      const cachedTimestamp = localStorage.getItem('cachedCurrencyRatesTimestamp');
      const now = new Date().getTime();
      const cacheFreshnessLimit = 5 * 60 * 1000; // 5 minutes in milliseconds

      // --- NEW LOGIC: Prioritize cached data, then default data, then fetch ---
      if (cachedData && cachedTimestamp) {
        const parsedCachedData = JSON.parse(cachedData);
        const parsedCachedTimestamp = parseInt(cachedTimestamp, 10);

        // If cache is fresh, display it immediately and stop loading indicator.
        if (now - parsedCachedTimestamp < cacheFreshnessLimit) {
          setCurrencies(parsedCachedData.currencies);
          setLastUpdated(parsedCachedData.lastUpdated);
          setIsLoading(false);
          // No toast here to avoid spamming on quick refreshes
        } else {
          // If cache is stale, display it immediately but keep loading indicator true for fresh fetch.
          setCurrencies(parsedCachedData.currencies);
          setLastUpdated(parsedCachedData.lastUpdated + ' (stale)');
        }
      } else {
        // --- If no cached data, display hardcoded defaults immediately ---
        setCurrencies(DEFAULT_CURRENCIES_SNAPSHOT);
        setLastUpdated('Defaults Loaded'); // Indicate that default data is showing
        setIsLoading(false); // Stop loading indicator, as something is displayed
        toast({
          title: "Loading Rates",
          description: "Displaying default rates while fetching the latest updates.",
        });
      }

      // --- Always fetch fresh data in the background (after initial display) ---
      // This fetch operation will run regardless of whether cache or defaults were used,
      // ensuring the data eventually becomes live.
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (!response.ok) {
        throw new Error('Failed to fetch currency data');
      }

      const data = await response.json();
      const rates: CurrencyData = data.rates;
      const ngnRateToUsd = rates['NGN'];

      // Only update previousRates from the live 'currencies' state, which might be defaults or stale cache
      const currentDisplayedCurrencies = currencies; // Capture current state for previous rates
      const previousRates = currentDisplayedCurrencies.reduce((acc, curr) => {
        acc[curr.code] = curr.rate;
        return acc;
      }, {} as Record<string, number>);


      const processedCurrencies: Currency[] = Object.entries(rates)
        .map(([code, rateFromUsd]) => {
          if (code === 'NGN' || !currencyInfo[code]) {
            return null;
          }
          
          const info = currencyInfo[code]; 
          const rateInNgn = ngnRateToUsd / rateFromUsd;

          return {
            code,
            name: info.name,
            flag: info.flag,
            symbol: info.symbol,
            rate: rateInNgn,
            previousRate: previousRates[code], // Use previously displayed rate
          };
        })
        .filter(Boolean) as Currency[];

      setCurrencies(processedCurrencies);
      setLastUpdated(new Date().toLocaleTimeString());

      // --- Store fresh data in localStorage ---
      localStorage.setItem('cachedCurrencyRates', JSON.stringify({
        currencies: processedCurrencies,
        lastUpdated: new Date().toLocaleTimeString()
      }));
      localStorage.setItem('cachedCurrencyRatesTimestamp', String(now));

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
      // Important: If an error occurs during fetch, ensure isLoading is set to false
      // so the loading spinner disappears, but the default/cached data remains.
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencyData();
    
    // Auto-refresh every 5 minutes (still in effect for continuous updates)
    const interval = setInterval(fetchCurrencyData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures it runs once on mount

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
