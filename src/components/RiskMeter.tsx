
import { useEffect, useState } from 'react';
import { RiskStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface RiskMeterProps {
  status: RiskStatus;
  score: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const RiskMeter = ({ 
  status, 
  score, 
  size = 'md',
  animated = true,
  className 
}: RiskMeterProps) => {
  const [currentScore, setCurrentScore] = useState(0);
  
  useEffect(() => {
    if (!animated) {
      setCurrentScore(score);
      return;
    }
    
    // Animate the score from 0 to the actual value
    let start = 0;
    const increment = score / 30; // Divide by number of steps
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setCurrentScore(score);
        clearInterval(timer);
      } else {
        setCurrentScore(start);
      }
    }, 20);
    
    return () => clearInterval(timer);
  }, [score, animated]);
  
  const getColor = (status: RiskStatus) => {
    switch (status) {
      case 'safe':
        return 'bg-status-safe';
      case 'suspicious':
        return 'bg-status-suspicious';
      case 'malicious':
        return 'bg-status-destructive';
      case 'analyzing':
      default:
        return 'bg-muted-foreground';
    }
  };
  
  const sizesConfig = {
    sm: 'h-2 w-full max-w-[120px]',
    md: 'h-3 w-full max-w-[200px]',
    lg: 'h-4 w-full max-w-[280px]',
  };
  
  const statusLabels = {
    safe: 'Safe',
    suspicious: 'Suspicious',
    malicious: 'Malicious',
    analyzing: 'Analyzing',
  };
  
  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      <div className={cn(
        "relative rounded-full bg-secondary overflow-hidden", 
        sizesConfig[size]
      )}>
        <div 
          className={cn(
            "absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out",
            getColor(status)
          )}
          style={{ width: `${currentScore}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center text-xs">
        <span className="font-medium">
          {statusLabels[status]}
        </span>
        <span className="text-muted-foreground">
          {Math.round(currentScore)}%
        </span>
      </div>
    </div>
  );
};

export default RiskMeter;
