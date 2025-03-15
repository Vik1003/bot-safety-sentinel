
import { useState } from 'react';
import { AnalysisResult, FeatureMetric, RiskStatus } from '@/lib/types';
import { getFeatureMetrics } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import RiskMeter from './RiskMeter';
import { AlertTriangle, CheckCircle, ExternalLink, XCircle, ChevronDown, ChevronUp, Link2, ShieldCheck, Lock, Unlock, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ResultCardProps {
  result: AnalysisResult;
  className?: string;
}

const ResultCard = ({ result, className }: ResultCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const metrics = getFeatureMetrics(result);
  
  const getStatusIcon = (status: RiskStatus) => {
    switch (status) {
      case 'safe':
        return <CheckCircle className="h-6 w-6 text-status-safe" />;
      case 'suspicious':
        return <AlertTriangle className="h-6 w-6 text-status-suspicious" />;
      case 'malicious':
        return <XCircle className="h-6 w-6 text-status-malicious" />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (status: RiskStatus) => {
    switch (status) {
      case 'safe':
        return 'border-status-safe/20 bg-status-safe/5';
      case 'suspicious':
        return 'border-status-suspicious/20 bg-status-suspicious/5';
      case 'malicious':
        return 'border-status-malicious/20 bg-status-malicious/5';
      default:
        return 'border-muted';
    }
  };
  
  const getFeatureIcon = (name: string) => {
    switch (name) {
      case 'URL Risk Score':
        return <BarChart2 className="h-4 w-4" />;
      case 'Redirections':
        return <ExternalLink className="h-4 w-4" />;
      case 'Shortened URL':
        return <Link2 className="h-4 w-4" />;
      case 'Domain Reputation':
        return <ShieldCheck className="h-4 w-4" />;
      case 'SSL Certificate':
        return result.sslStatus ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />;
      case 'Bot Behavior Score':
        return <BarChart2 className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300",
      getStatusColor(result.status),
      "animate-scale-in shadow-lg border",
      className
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            {getStatusIcon(result.status)}
            <CardTitle className="text-xl">
              {result.status === 'safe' ? 'Safe URL' : 
               result.status === 'suspicious' ? 'Suspicious URL' : 
               'Malicious URL'}
            </CardTitle>
          </div>
          <RiskMeter status={result.status} score={result.score} size="sm" />
        </div>
        <CardDescription className="mt-1 truncate max-w-[350px]">
          {result.url}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Analysis Results</p>
            <span className="text-xs text-muted-foreground">
              {new Date(result.timestamp).toLocaleString()}
            </span>
          </div>
          
          <div className="space-y-3">
            {metrics.slice(0, showDetails ? metrics.length : 3).map((metric, i) => (
              <div 
                key={i}
                className={cn(
                  "flex items-center justify-between p-2 rounded-md",
                  "bg-background/50 border transition-all"
                )}
              >
                <div className="flex items-center space-x-2">
                  {getFeatureIcon(metric.name)}
                  <span className="text-sm font-medium">{metric.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm">
                    {typeof metric.value === 'boolean' 
                      ? (metric.value ? 'Yes' : 'No')
                      : metric.value}
                  </span>
                  <div 
                    className={cn(
                      "w-2 h-2 rounded-full",
                      metric.score > 66 ? "bg-status-malicious" :
                      metric.score > 33 ? "bg-status-suspicious" :
                      "bg-status-safe"
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {result.details && (
            <p className="text-sm text-muted-foreground mt-2">
              {result.details}
            </p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs font-normal"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? (
            <>
              <ChevronUp className="h-3 w-3 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 mr-1" />
              Show More
            </>
          )}
        </Button>
        
        <Button variant="outline" size="sm" className="text-xs">
          <ExternalLink className="h-3 w-3 mr-1" />
          Open Safely
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResultCard;
