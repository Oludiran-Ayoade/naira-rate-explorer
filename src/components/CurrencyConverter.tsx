import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Calculator } from 'lucide-react';

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
        </div>
      </DialogContent>
    </Dialog>
  );
};