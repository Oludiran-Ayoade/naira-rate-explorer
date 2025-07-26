import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Calculator, Download } from 'lucide-react';
import { toast } from 'sonner';

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

  const generateConversionCard = () => {
    if (!nairaAmount || !foreignAmount) {
      toast.error("Please enter amounts to convert before downloading");
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Card dimensions
    canvas.width = 600;
    canvas.height = 400;

    // Background gradient (emerald theme)
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#064e3b'); // emerald-900
    gradient.addColorStop(0.5, '#065f46'); // emerald-800
    gradient.addColorStop(1, '#047857'); // emerald-700
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Glass effect overlay
    const glassGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    glassGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    glassGradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
    ctx.fillStyle = glassGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Currency Conversion', canvas.width / 2, 50);

    // Flag and currency name
    ctx.font = '18px Arial';
    ctx.fillText(`${currency.flag} ${currency.name}`, canvas.width / 2, 80);

    // Conversion amounts
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#10b981'; // emerald-500
    ctx.fillText(`₦${formatNumber(Number(nairaAmount))}`, canvas.width / 2, 140);

    // Arrow
    ctx.font = '24px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('↓', canvas.width / 2, 180);

    // Foreign amount
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#34d399'; // emerald-400
    ctx.fillText(`${currency.symbol}${formatNumber(Number(foreignAmount))}`, canvas.width / 2, 220);

    // Exchange rate
    ctx.font = '16px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText(`Rate: ₦${formatNumber(currency.rate)} per ${currency.symbol}1`, canvas.width / 2, 260);

    // Branding
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('by NairaRate', canvas.width / 2, 320);

    // Timestamp
    ctx.font = '14px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    const now = new Date().toLocaleString();
    ctx.fillText(`Generated on ${now}`, canvas.width / 2, 350);

    // Download
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
      }
    });
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

          <div className="p-3 bg-gradient-glass rounded-lg border border-border/30">
            <p className="text-center text-sm text-muted-foreground">
              Exchange Rate: ₦{formatNumber(currency.rate)} per {currency.symbol}1 {currency.code}
            </p>
          </div>

          {nairaAmount && foreignAmount && (
            <Button
              onClick={generateConversionCard}
              className="w-full bg-gradient-primary hover:bg-gradient-secondary text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-glow"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Conversion Card
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};