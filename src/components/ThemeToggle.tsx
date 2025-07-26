import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="relative bg-gradient-glass backdrop-blur-md border-border/50 hover:bg-gradient-secondary transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
    >
      <Sun className={`h-4 w-4 transition-all duration-300 ${
        theme === 'dark' ? 'scale-0 rotate-90' : 'scale-100 rotate-0'
      }`} />
      <Moon className={`absolute h-4 w-4 transition-all duration-300 ${
        theme === 'dark' ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'
      }`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};