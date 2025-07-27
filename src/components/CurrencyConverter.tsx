import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Calculator, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

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
  const [nairaAmount, setNairaAmount] = useState('');
  const [foreignAmount, setForeignAmount] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);

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

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const convertFromNaira = (value: string) => {
    setNairaAmount(value);
    if (value && !isNaN(Number(value))) {
      const foreign = Number(value) / currency.rate;
      setForeignAmount(foreign.toFixed(2));
    } else {
      setForeignAmount('');
    }
  };

  const convertFromForeign = (value: string) => {
    setForeignAmount(value);
    if (value && !isNaN(Number(value))) {
      const naira = Number(value) * currency.rate;
      setNairaAmount(naira.toFixed(2));
    } else {
      setNairaAmount('');
    }
  };

  const swapAmounts = () => {
    const tempNaira = nairaAmount;
    const tempForeign = foreignAmount;
    setNairaAmount(tempForeign);
    setForeignAmount(tempNaira);
  };

  const generatePreview = () => {
    if (!nairaAmount || !foreignAmount) {
      toast.error("Please enter amounts to convert before previewing");
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="bg-white dark:bg-gray-900 border-0 rounded-2xl shadow-xl max-w-md p-6 overflow-hidden font-['Poppins']"
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
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">₦{currency.rate.toFixed(2)}</p>
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
                  value={nairaAmount}
                  onChange={(e) => convertFromNaira(e.target.value)}
                  className="text-xl h-14 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900 rounded-xl pl-14 pr-4 font-medium"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-700 dark:text-gray-300">₦</span>
                {nairaAmount && (
                  <p className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
                    {formatNumber(Number(nairaAmount))}
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
                  value={foreignAmount}
                  onChange={(e) => convertFromForeign(e.target.value)}
                  className="text-xl h-14 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900 rounded-xl pl-14 pr-4 font-medium"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-700 dark:text-gray-300">{currency.symbol}</span>
                {foreignAmount && (
                  <p className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
                    {formatNumber(Number(foreignAmount))}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          {nairaAmount && foreignAmount && (
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
            <div className="flex justify-center">
              <div 
                ref={cardRef}
                className="w-[28rem] h-80 bg-gradient-to-br from-emerald-900 via-green-900 to-gray-900 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden border border-emerald-500/20 font-['Raleway']"
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
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-3xl font-bold tracking-tight">NairaRate</h3>
                      <p className="text-emerald-300 text-xs font-medium uppercase tracking-widest">Premium Conversion</p>
                    </div>
                    <div className="text-right">
                      <span className="text-4xl">{currency.flag}</span>
                      <p className="text-emerald-300 text-sm font-semibold mt-2">{currency.name} ({currency.code})</p>
                    </div>
                  </div>
                  
                  {/* Conversion amounts */}
                  <div className="flex-1 flex flex-col justify-center items-center space-y-4">
                    <div className="text-5xl font-bold text-white">
                      ₦{formatNumber(Number(nairaAmount))}
                    </div>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full opacity-80"></div>
                    <div className="text-5xl font-bold text-emerald-300">
                      {currency.symbol}{formatNumber(Number(foreignAmount))}
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="mt-auto pt-5 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-emerald-200/70">
                        Rate: ₦{currency.rate.toFixed(2)} = {currency.symbol}1
                      </p>
                      <p className="text-xs text-emerald-200/70">
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
            <div className="flex gap-4 justify-center">
              <Button
                onClick={downloadCard}
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Card
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
                className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
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