import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Calculator, Download, Eye, X } from 'lucide-react';
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
  const [showPreview, setShowPreview] = useState(false);
  const [previewCanvas, setPreviewCanvas] = useState<HTMLCanvasElement | null>(null);

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

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Business card style dimensions
    canvas.width = 500;
    canvas.height = 320;

    // Premium gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#064e3b');
    gradient.addColorStop(0.3, '#059669');
    gradient.addColorStop(0.7, '#10b981');
    gradient.addColorStop(1, '#047857');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Elegant geometric pattern overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 20 + 5;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.random() * Math.PI);
      ctx.fillRect(-size/2, -size/2, size, size);
      ctx.restore();
    }

    // Main card container with rounded corners effect
    const cardPadding = 25;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 8;
    ctx.fillRect(cardPadding, cardPadding, canvas.width - (cardPadding * 2), canvas.height - (cardPadding * 2));
    ctx.shadowColor = 'transparent';

    // Accent bar on left
    ctx.fillStyle = '#34d399';
    ctx.fillRect(cardPadding, cardPadding, 8, canvas.height - (cardPadding * 2));

    // NairaRate logo area
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px serif';
    ctx.textAlign = 'left';
    ctx.fillText('NairaRate', cardPadding + 25, cardPadding + 35);

    ctx.font = '12px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('CURRENCY CONVERTER', cardPadding + 25, cardPadding + 55);

    // Currency flag and info in top right
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#34d399';
    ctx.textAlign = 'right';
    ctx.fillText(`${currency.flag} ${currency.code}`, canvas.width - cardPadding - 15, cardPadding + 35);

    // Main conversion section
    const centerY = canvas.height / 2;
    
    // Naira amount
    ctx.font = 'bold 28px serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    const nairaText = `₦${formatNumber(Number(nairaAmount))}`;
    ctx.fillText(nairaText, canvas.width / 2, centerY - 20);

    // Equal sign instead of arrow
    ctx.font = 'bold 20px serif';
    ctx.fillStyle = '#34d399';
    ctx.fillText('=', canvas.width / 2, centerY + 10);

    // Foreign amount
    ctx.font = 'bold 28px serif';
    ctx.fillStyle = '#10b981';
    const foreignText = `${currency.symbol}${formatNumber(Number(foreignAmount))}`;
    ctx.fillText(foreignText, canvas.width / 2, centerY + 40);

    // Bottom section with timestamp
    ctx.font = '10px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.textAlign = 'center';
    const now = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    ctx.fillText(`Generated ${now}`, canvas.width / 2, canvas.height - cardPadding - 10);

    // Decorative corner elements
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(canvas.width - cardPadding - 30, cardPadding, 30, 5);
    ctx.fillRect(canvas.width - cardPadding - 5, cardPadding, 5, 30);

    setPreviewCanvas(canvas);
    setShowPreview(true);
  };

  const downloadCard = () => {
    if (!previewCanvas) return;
    
    previewCanvas.toBlob((blob) => {
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
        <DialogContent className="bg-gradient-card backdrop-blur-xl border-border/50 shadow-2xl max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-xl font-bold">
              <span className="flex items-center gap-3">
                <Eye className="w-6 h-6 text-primary" />
                Conversion Card Preview
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 pt-4">
            {previewCanvas && (
              <div className="flex justify-center">
                <img 
                  src={previewCanvas.toDataURL()} 
                  alt="Conversion Card Preview"
                  className="max-w-full h-auto rounded-lg shadow-2xl border border-border/30"
                />
              </div>
            )}
            
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