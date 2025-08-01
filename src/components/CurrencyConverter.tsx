import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Calculator, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { blackMarketRates } from "./blackMarketRates";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CurrencyConverterProps {
  isOpen: boolean;
  onClose: () => void;
  currency: {
    code: string;
    name: string;
    flag: string;
    rate: number;
    symbol: string;
  };
}

export const CurrencyConverter = ({ isOpen, onClose, currency }: CurrencyConverterProps) => {
  const [inputValue, setInputValue] = useState('');
  const [inputType, setInputType] = useState<'naira' | 'foreign'>('naira');
  const [showPreview, setShowPreview] = useState(false);
  const [useBlackMarket, setUseBlackMarket] = useState(false);
  const [rateType, setRateType] = useState<'buy' | 'sell'>('buy');
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);

  // Get current rate based on selection
  const currentRate = useBlackMarket && blackMarketRates[currency.code] 
    ? blackMarketRates[currency.code][rateType] 
    : currency.rate;

  // Calculate converted amount
  const convertedAmount = inputValue && !isNaN(Number(inputValue))
    ? inputType === 'naira'
      ? (Number(inputValue) / currentRate).toFixed(2)
      : (Number(inputValue) * currentRate).toFixed(2)
    : '';

  // Update conversion when rate changes
  useEffect(() => {
    if (inputValue) {
      setInputValue(inputValue); // Force re-render to update converted amount
    }
  }, [currentRate]);

  const handleInputChange = (value: string, type: 'naira' | 'foreign') => {
    setInputValue(value);
    setInputType(type);
  };

  const swapAmounts = () => {
    setInputType(prev => prev === 'naira' ? 'foreign' : 'naira');
    setInputValue(convertedAmount);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const generatePreview = () => {
    if (!inputValue) {
      toast.error("Please enter an amount to convert before previewing");
      return;
    }
    setShowPreview(true);
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `nairarate-conversion-${currency.code}-${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success("Conversion card downloaded successfully!");
          setShowPreview(false);
        }
      });
    } catch (error) {
      toast.error("Failed to generate card");
    }
  };

  // Hide close button when dialog opens
  useEffect(() => {
    if (showPreview && dialogContentRef.current) {
      const closeButton = dialogContentRef.current.querySelector('button[data-dialog-close]');
      if (closeButton) {
        (closeButton as HTMLElement).style.display = 'none';
      }
    }
  }, [showPreview]);

  // Animation effect for the background
  useEffect(() => {
    if (!canvasRef.current || !showPreview) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        color: `rgba(74, 222, 128, ${Math.random() * 0.4 + 0.2})`
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      // Cleanup animation frame if needed
    };
  }, [showPreview]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="bg-white dark:bg-gray-900 border-0 rounded-2xl shadow-xl max-w-md p-6 overflow-hidden font-['Raleway']"
        ref={dialogContentRef}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-950 opacity-30"></div>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-600">
              Currency Converter
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative space-y-6 pt-4 z-10">
          {/* Currency Header */}
          <div className="flex items-center gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
            <div className="text-4xl">{currency.flag}</div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{currency.code}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{currency.name}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Exchange Rate</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">₦{currentRate.toFixed(2)}</p>
              
              {/* Black Market Toggle */}
              {/* <div className="flex items-center justify-end gap-2 mt-2">
                <Switch 
                  id="black-market-toggle"
                  checked={useBlackMarket}
                  onCheckedChange={setUseBlackMarket}
                  className="data-[state=checked]:bg-emerald-500 scale-75"
                />
                <Label htmlFor="black-market-toggle" className="text-xs cursor-pointer">
                  Black Market
                </Label>
              </div> */}
              {blackMarketRates[currency.code] && (
                <div className="flex items-center justify-end gap-2 mt-2">
                  <Switch
                    id="black-market-toggle"
                    checked={useBlackMarket}
                    onCheckedChange={setUseBlackMarket}
                    className="data-[state=checked]:bg-emerald-500 scale-75"
                  />
                  <Label htmlFor="black-market-toggle" className="text-xs cursor-pointer">
                    Black Market
                  </Label>
                </div>
              )}
              
              {/* Buy/Sell Radio Buttons */}
              {useBlackMarket && blackMarketRates[currency.code] && (
                <RadioGroup 
                  value={rateType} 
                  onValueChange={(value: 'buy' | 'sell') => setRateType(value)}
                  className="flex gap-4 justify-end mt-1"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="buy" id="buy" className="w-3 h-3" />
                    <Label htmlFor="buy" className="text-xs cursor-pointer">
                      Buy: ₦{blackMarketRates[currency.code].buy.toFixed(2)}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="sell" id="sell" className="w-3 h-3" />
                    <Label htmlFor="sell" className="text-xs cursor-pointer">
                      Sell: ₦{blackMarketRates[currency.code].sell.toFixed(2)}
                    </Label>
                  </div>
                </RadioGroup>
              )}
            </div>
          </div>

          {/* Conversion Inputs */}
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nigerian Naira (₦)</label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={inputType === 'naira' ? inputValue : convertedAmount}
                  onChange={(e) => handleInputChange(e.target.value, 'naira')}
                  className="text-xl h-14 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900 rounded-xl pl-14 pr-4 font-normal"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-700 dark:text-gray-300">₦</span>
                {inputType === 'naira' && inputValue && (
                  <p className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400 font-normal">
                    {formatNumber(Number(inputValue))}
                  </p>
                )}
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                onClick={swapAmounts}
                className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-bounce"
                aria-label="Swap currencies"
              >
                <ArrowUpDown className="w-5 h-5 text-white" />
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {currency.name} ({currency.symbol})
              </label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={inputType === 'foreign' ? inputValue : convertedAmount}
                  onChange={(e) => handleInputChange(e.target.value, 'foreign')}
                  className="text-xl h-14 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900 rounded-xl pl-14 pr-4 font-normal"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-700 dark:text-gray-300">{currency.symbol}</span>
                {inputType === 'foreign' && inputValue && (
                  <p className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400 font-normal">
                    {formatNumber(Number(inputValue))}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          {inputValue && (
            <Button
              onClick={generatePreview}
              className="w-full h-14 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
            >
              <Eye className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
              Preview Conversion Card
            </Button>
          )}
        </div>
      </DialogContent>

      {/* Preview Modal with Animated Background */}
      <Dialog open={showPreview} onOpenChange={(open) => {
        if (!open) setShowPreview(false);
      }}>
        <DialogContent 
          className="bg-transparent border-0 shadow-none max-w-3xl p-0 overflow-visible [&>button]:hidden"
        >
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full z-0 opacity-20 pointer-events-none"
          />
          <div className="relative space-y-6 z-10">
            <div className="flex justify-center px-4">
              <div 
                ref={cardRef}
                className="w-full max-w-[28rem] h-80 bg-gradient-to-br from-emerald-900 via-green-900 to-gray-900 rounded-3xl shadow-2xl p-6 md:p-8 text-white relative overflow-hidden border border-emerald-500/20 font-['Raleway']"
              >
                {/* Animated floating particles */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(20)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute rounded-full bg-emerald-500/10"
                      style={{
                        width: `${Math.random() * 12 + 5}px`,
                        height: `${Math.random() * 12 + 5}px`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animation: `float ${Math.random() * 15 + 10}s linear infinite`,
                        animationDelay: `${Math.random() * 5}s`,
                        transform: `rotate(${Math.random() * 360}deg)`
                      }}
                    />
                  ))}
                </div>
                
                {/* Glossy overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                
                {/* Card content */}
                <div className="relative h-full flex flex-col">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6 md:mb-8">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold tracking-tight">NairaRate.ng</h3>
                      <p className="text-emerald-300 text-xs font-medium uppercase tracking-widest">
                        {useBlackMarket ? 'Black Market Conversion' : 'Premium Conversion'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl md:text-4xl">{currency.flag}</span>
                      <p className="text-emerald-300 text-xs md:text-sm font-semibold mt-1 md:mt-2">
                        {currency.name} ({currency.code})
                      </p>
                    </div>
                  </div>
                  
                  {/* Conversion amounts */}
                  <div className="flex-1 flex flex-col justify-center items-center space-y-3 md:space-y-4">
                    <div className="text-3xl md:text-5xl font-bold text-white font-normal">
                      ₦{inputType === 'naira' ? formatNumber(Number(inputValue)) : formatNumber(Number(convertedAmount))}
                    </div>
                    <div className="w-24 md:w-32 h-1 md:h-1.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full opacity-80"></div>
                    <div className="text-3xl md:text-5xl font-bold text-emerald-300 font-normal">
                      {inputType === 'foreign' ? formatNumber(Number(inputValue)) : formatNumber(Number(convertedAmount))}{currency.symbol}
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="mt-auto pt-4 md:pt-5 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <p className="text-[0.65rem] md:text-xs text-emerald-200/70">
                        Rate: ₦{currentRate.toFixed(2)} = {currency.symbol}1
                      </p>
                      <p className="text-[0.65rem] md:text-xs text-emerald-200/70">
                        {new Date().toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button
                onClick={downloadCard}
                className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Download Card
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
                className="px-6 py-3 sm:px-8 sm:py-4 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                Close Preview
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};