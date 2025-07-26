import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CurrencySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const CurrencySearch = ({ value, onChange, placeholder = "Search currencies..." }: CurrencySearchProps) => {
  return (
    <div className="relative max-w-lg mx-auto mb-12">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-12 pr-4 py-4 text-lg bg-gradient-glass backdrop-blur-md border-border/50 focus:border-primary transition-all duration-300 focus:shadow-glow rounded-xl"
        />
      </div>
    </div>
  );
};