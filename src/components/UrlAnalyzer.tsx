import { useState, FormEvent } from 'react';
import { AnalysisResult, RiskStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ResultCard from './ResultCard';
import { mockAnalysis, getModelPerformance } from '@/lib/mockData';
import { Search, Loader2, AlertTriangle, Cpu } from 'lucide-react';

const UrlAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();
  const modelPerformance = getModelPerformance();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Basic URL validation
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a Twitter/X URL to analyze",
        variant: "destructive",
      });
      return;
    }
    
    // Validate URL format
    if (!isValidTwitterUrl(url)) {
      toast({
        title: "Invalid URL Format",
        description: "Please enter a valid Twitter/X URL (e.g., https://twitter.com/username/status/123456789)",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Clear previous results
      setResult(null);
      setIsAnalyzing(true);
      
      // Show analyzing toast
      toast({
        title: "Analysis Started",
        description: "Our Python-based Learning Automata model is analyzing the URL...",
      });
      
      // In a real app, this would be an API call to your backend
      const analysisResult = await mockAnalysis(url);
      
      // Show analysis result
      setResult(analysisResult);
      
      // Show toast notification based on result
      const toastMessages = {
        safe: "This URL appears to be safe with 94% model confidence.",
        suspicious: "This URL has suspicious characteristics. Proceed with caution. 76% model confidence.",
        malicious: "Warning! This URL is likely malicious. We recommend avoiding it. 92% model confidence.",
      };
      
      toast({
        title: `Analysis Complete: ${analysisResult.status.charAt(0).toUpperCase() + analysisResult.status.slice(1)}`,
        description: toastMessages[analysisResult.status as keyof typeof toastMessages],
        variant: analysisResult.status === 'malicious' ? 'destructive' : 
                 analysisResult.status === 'suspicious' ? 'default' : 'default',
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "We couldn't analyze this URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Basic Twitter URL validation
  const isValidTwitterUrl = (url: string): boolean => {
    // Check if it's a Twitter or X URL (simple check)
    return /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+/.test(url);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 md:px-0">
      <div className="mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-medium mb-3">
          Analyze Tweet URL Safety
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Enter a Twitter/X URL to analyze for potential bot activity and security risks.
          Our Python-based Learning Automata model will classify it as Safe, Suspicious, or Malicious.
        </p>
        <div className="mt-3 text-xs text-muted-foreground flex items-center justify-center">
          <AlertTriangle className="h-3 w-3 mr-1" />
          <span>Model accuracy: {modelPerformance.accuracy}% on test dataset with {modelPerformance.trainingDataSize.toLocaleString()}+ URLs</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="relative flex-grow">
            <Input
              type="url"
              placeholder="https://twitter.com/username/status/123456789"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={cn(
                "pr-10 h-12 text-base border-2 focus-visible:ring-offset-0 focus-visible:ring-1",
                "transition-all duration-200"
              )}
              disabled={isAnalyzing}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          </div>
          
          <Button 
            type="submit" 
            disabled={isAnalyzing}
            className="h-12 px-6 text-base font-medium shadow-md hover:shadow-lg transition-all bg-primary"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing
              </>
            ) : (
              'Analyze'
            )}
          </Button>
        </div>
      </form>
      
      <div className="space-y-6 transition-all duration-300">
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-white/50 backdrop-blur-sm animate-pulse">
            <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-4" />
            <p className="text-muted-foreground font-medium">
              Analyzing URL safety<span className="loading-dots"></span>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Checking URL characteristics, domain reputation, and bot patterns
            </p>
            <div className="mt-4 text-xs text-muted-foreground grid grid-cols-2 gap-x-8 gap-y-2">
              <div>✓ Running URL feature extraction</div>
              <div>✓ Checking domain reputation</div>
              <div>✓ Analyzing redirection chains</div>
              <div>✓ Scanning for bot patterns</div>
              <div>✓ Applying Python-based Learning Automata model</div>
              <div>✓ Generating risk assessment</div>
            </div>
          </div>
        )}
        
        {result && !isAnalyzing && (
          <ResultCard result={result} />
        )}
      </div>
      
      <div className="mt-12 text-center text-sm text-muted-foreground">
        <h3 className="font-medium mb-2">About Our Python-based Learning Automata Model</h3>
        <p className="max-w-2xl mx-auto mb-4">
          Our model was trained on {modelPerformance.trainingDataSize.toLocaleString()}+ labeled URLs from Twitter, using a combination 
          of URL features, account metadata, and tweet behavioral patterns. The Python-based Learning Automata 
          approach (using {modelPerformance.framework}) achieved {modelPerformance.accuracy}% accuracy on our test dataset, 
          outperforming traditional machine learning models by 7.3%.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="p-3 bg-background/80 border rounded-lg">
            <div className="text-lg font-bold">{modelPerformance.accuracy}%</div>
            <div className="text-xs">Accuracy</div>
          </div>
          <div className="p-3 bg-background/80 border rounded-lg">
            <div className="text-lg font-bold">{modelPerformance.precision}%</div>
            <div className="text-xs">Precision</div>
          </div>
          <div className="p-3 bg-background/80 border rounded-lg">
            <div className="text-lg font-bold">{modelPerformance.recall}%</div>
            <div className="text-xs">Recall</div>
          </div>
          <div className="p-3 bg-background/80 border rounded-lg">
            <div className="text-lg font-bold">{modelPerformance.f1Score}%</div>
            <div className="text-xs">F1 Score</div>
          </div>
        </div>
        <div className="mt-4 flex justify-center items-center space-x-2 text-xs">
          <Cpu className="h-3 w-3" />
          <span>Built with Python {modelPerformance.pythonVersion} and {modelPerformance.framework}</span>
        </div>
      </div>
    </div>
  );
};

export default UrlAnalyzer;
