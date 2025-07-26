import { useState, useRef } from 'react';
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
      <DialogContent className="bg-gradient-card backdrop-blur-xl border-border/50 shadow-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl font-bold">
            <Calculator className="w-6 h-6 text-primary" />
            Currency Converter
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-3 p-4 bg-gradient-glass rounded-lg border border-border/30">
            <span className="text-2xl">{currency.flag}</span>
            <div>
              <h3 className="font-semibold text-foreground">{currency.code}</h3>
              <p className="text-sm text-muted-foreground">{currency.name}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Nigerian Naira (₦)</label>
              <Input
                type="number"
                placeholder="Enter amount in Naira"
                value={nairaAmount}
                onChange={(e) => convertFromNaira(e.target.value)}
                className="text-lg bg-gradient-glass backdrop-blur-sm"
              />
              {nairaAmount && (
                <p className="text-xs text-muted-foreground">
                  ₦{formatNumber(Number(nairaAmount))}
                </p>
              )}
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={swapAmounts}
                className="bg-gradient-glass backdrop-blur-sm hover:bg-gradient-secondary"
              >
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {currency.name} ({currency.symbol})
              </label>
              <Input
                type="number"
                placeholder={`Enter amount in ${currency.code}`}
                value={foreignAmount}
                onChange={(e) => convertFromForeign(e.target.value)}
                className="text-lg bg-gradient-glass backdrop-blur-sm"
              />
              {foreignAmount && (
                <p className="text-xs text-muted-foreground">
                  {currency.symbol}{formatNumber(Number(foreignAmount))}
                </p>
              )}
            </div>
          </div>

          {nairaAmount && foreignAmount && (
            <Button
              onClick={generatePreview}
              className="w-full bg-gradient-primary hover:bg-gradient-secondary text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-glow"
            >
              <Eye className="w-5 h-5 mr-2" />
              Preview Conversion Card
            </Button>
          )}
        </div>
      </DialogContent>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="bg-gradient-card backdrop-blur-xl border-border/50 shadow-2xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-bold">
              <Eye className="w-6 h-6 text-primary" />
              Conversion Card Preview
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 pt-4">
            <div className="flex justify-center">
              <div 
                ref={cardRef}
                className="w-96 h-60 bg-gradient-to-br from-emerald-800 via-emerald-600 to-emerald-900 rounded-2xl shadow-2xl p-6 text-white relative overflow-hidden"
              >
                {/* Decorative geometric pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 w-8 h-8 border-2 border-white/30 rotate-45"></div>
                  <div className="absolute top-8 right-8 w-4 h-4 bg-white/20 rotate-12"></div>
                  <div className="absolute bottom-8 left-4 w-6 h-6 border border-white/20 rounded-full"></div>
                </div>
                
                {/* Accent border */}
                <div className="absolute left-0 top-0 w-2 h-full bg-gradient-to-b from-emerald-300 to-emerald-500 rounded-l-2xl"></div>
                
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold tracking-wide">NairaRate</h3>
                    <p className="text-emerald-200 text-xs font-medium">CURRENCY CONVERTER</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl">{currency.flag}</span>
                    <p className="text-emerald-300 text-sm font-semibold">{currency.code}</p>
                  </div>
                </div>
                
                {/* Conversion amounts */}
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-white">
                    ₦{formatNumber(Number(nairaAmount))}
                  </div>
                  <div className="text-emerald-300 text-lg font-medium">=</div>
                  <div className="text-2xl font-bold text-emerald-200">
                    {currency.symbol}{formatNumber(Number(foreignAmount))}
                  </div>
                </div>
                
                {/* Footer */}
                <div className="absolute bottom-4 left-6 right-6 text-center">
                  <p className="text-emerald-200/70 text-xs">
                    Generated {new Date().toLocaleDateString('en-US', {
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
            
            <div className="flex gap-3 justify-center">
              <Button
                onClick={downloadCard}
                className="bg-gradient-primary hover:bg-gradient-secondary text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-glow"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Card
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
                className="bg-gradient-glass backdrop-blur-sm hover:bg-gradient-secondary px-6 py-3"
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