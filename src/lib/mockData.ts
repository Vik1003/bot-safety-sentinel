import { AnalysisResult, FeatureMetric } from './types';

export const mockAnalysis = (url: string): Promise<AnalysisResult> => {
  // This is mock data for demonstration purposes
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create a deterministic but seemingly random result based on the URL
      const hash = stringToHash(url);
      const isSuspicious = hash % 3 === 1;
      const isMalicious = hash % 3 === 2;
      
      const score = isMalicious ? 
        75 + (hash % 25) : 
        (isSuspicious ? 
          40 + (hash % 35) : 
          (hash % 40));
      
      // Generate consistent fake metrics based on URL hash
      const redirectionsCount = isMalicious ? 2 + (hash % 3) : (isSuspicious ? 1 : 0);
      const isShortened = (hash % 2 === 0);
      const domainReputation = isMalicious ? 'Poor' : (isSuspicious ? 'Unknown' : 'Good');
      const sslStatus = !isMalicious;
      const botBehaviorScore = isMalicious ? 
        70 + (hash % 30) : 
        (isSuspicious ? 
          40 + (hash % 30) : 
          (hash % 30));
      
      // Generate feature metrics
      const featureMetrics = generateFeatureMetrics({
        score,
        redirectionsCount,
        isShortened,
        domainReputation,
        sslStatus,
        botBehaviorScore
      });
      
      const result: AnalysisResult = {
        status: isMalicious ? 'malicious' : (isSuspicious ? 'suspicious' : 'safe'),
        score: score,
        url: url,
        redirectionsCount,
        isShortened,
        domainReputation,
        sslStatus,
        botBehaviorScore,
        timestamp: new Date().toISOString(),
        details: getDetails(isMalicious, isSuspicious, url),
        featureMetrics
      };
      
      resolve(result);
    }, 2000); // Simulate network delay
  });
};

// Generate detailed feature metrics based on analysis results
function generateFeatureMetrics({ 
  score, 
  redirectionsCount, 
  isShortened, 
  domainReputation, 
  sslStatus, 
  botBehaviorScore 
}: {
  score: number;
  redirectionsCount: number;
  isShortened: boolean;
  domainReputation: string;
  sslStatus: boolean;
  botBehaviorScore: number;
}): FeatureMetric[] {
  return [
    {
      name: 'URL Risk Score',
      value: `${score}%`,
      score: score,
      importance: 10,
    },
    {
      name: 'Redirections',
      value: redirectionsCount,
      score: redirectionsCount > 2 ? 80 : (redirectionsCount > 0 ? 40 : 0),
      importance: 7,
    },
    {
      name: 'Shortened URL',
      value: isShortened,
      score: isShortened ? 60 : 0,
      importance: 6,
    },
    {
      name: 'Domain Reputation',
      value: domainReputation,
      score: domainReputation === 'Poor' ? 90 : (domainReputation === 'Unknown' ? 50 : 10),
      importance: 9,
    },
    {
      name: 'SSL Certificate',
      value: sslStatus ? 'Valid' : 'Invalid/Missing',
      score: sslStatus ? 0 : 80,
      importance: 8,
    },
    {
      name: 'Bot Behavior Score',
      value: `${botBehaviorScore}%`,
      score: botBehaviorScore,
      importance: 9,
    },
    {
      name: 'Content Sentiment',
      value: score > 70 ? 'Negative' : (score > 40 ? 'Neutral' : 'Positive'),
      score: score > 70 ? 85 : (score > 40 ? 50 : 15),
      importance: 6,
    },
    {
      name: 'Link Pattern Analysis',
      value: score > 60 ? 'Suspicious' : 'Normal',
      score: score > 60 ? 75 : 20,
      importance: 8,
    },
    {
      name: 'Posting Frequency',
      value: botBehaviorScore > 70 ? 'Abnormal' : 'Normal',
      score: botBehaviorScore > 70 ? 80 : 10,
      importance: 7,
    },
    {
      name: 'Account Age',
      value: botBehaviorScore > 50 ? 'New Account' : 'Established Account',
      score: botBehaviorScore > 50 ? 65 : 15,
      importance: 5,
    }
  ];
}

export const getFeatureMetrics = (result: AnalysisResult): FeatureMetric[] => {
  // If the result already has feature metrics, return them
  if (result.featureMetrics && result.featureMetrics.length > 0) {
    return result.featureMetrics;
  }
  
  // Otherwise generate them based on the result data
  return generateFeatureMetrics({
    score: result.score,
    redirectionsCount: result.redirectionsCount,
    isShortened: result.isShortened,
    domainReputation: result.domainReputation,
    sslStatus: result.sslStatus,
    botBehaviorScore: result.botBehaviorScore
  });
};

// Helper function to get a deterministic hash from a string
function stringToHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function getDetails(isMalicious: boolean, isSuspicious: boolean, url: string): string {
  if (isMalicious) {
    return `The URL ${url} shows multiple high-risk factors including suspicious redirect chains, poor domain reputation, and bot-like behavior patterns. Our Learning Automata model has classified this URL as malicious with high confidence (92.7% accuracy). We recommend avoiding this link.`;
  } else if (isSuspicious) {
    return `The URL ${url} has some concerning characteristics such as URL shortening or unknown domain reputation. Our Learning Automata model has flagged some potential risks but cannot definitively classify it as malicious (76.4% confidence). Proceed with caution.`;
  } else {
    return `The URL ${url} appears to be safe based on our analysis. No suspicious patterns detected by our Learning Automata model, which has achieved a 94.2% accuracy on known safe URLs. The classification confidence for this URL is high.`;
  }
}
