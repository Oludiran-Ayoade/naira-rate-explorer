import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CurrencySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const CurrencySearch = ({ value, onChange, placeholder = "Search currencies..." }: CurrencySearchProps) => {
  return (
    <div className="relative max-w-md mx-auto mb-8">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 bg-background/80 backdrop-blur-sm border-border/50 focus:border-primary transition-colors"
      />
    </div>
  );
};