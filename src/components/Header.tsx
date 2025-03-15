
import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ease-in-out",
      scrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-medium text-lg tracking-tight">SocialBotGuard</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a 
            href="#features" 
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a 
            href="#how-it-works" 
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            How It Works
          </a>
          <a 
            href="#about" 
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            About
          </a>
        </nav>
        
        <div className="flex items-center">
          <a 
            href="#analyzer" 
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
              "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            )}
          >
            Analyze URL
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
