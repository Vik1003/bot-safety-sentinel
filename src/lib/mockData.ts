
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
      
      const result: AnalysisResult = {
        status: isMalicious ? 'malicious' : (isSuspicious ? 'suspicious' : 'safe'),
        score: score,
        url: url,
        redirectionsCount: isMalicious ? 2 + (hash % 3) : (isSuspicious ? 1 : 0),
        isShortened: (hash % 2 === 0),
        domainReputation: isMalicious ? 'Poor' : (isSuspicious ? 'Unknown' : 'Good'),
        sslStatus: !isMalicious,
        botBehaviorScore: isMalicious ? 
          70 + (hash % 30) : 
          (isSuspicious ? 
            40 + (hash % 30) : 
            (hash % 30)),
        timestamp: new Date().toISOString(),
        details: getDetails(isMalicious, isSuspicious, url)
      };
      
      resolve(result);
    }, 2000); // Simulate network delay
  });
};

export const getFeatureMetrics = (result: AnalysisResult): FeatureMetric[] => {
  return [
    {
      name: 'URL Risk Score',
      value: `${result.score}%`,
      score: result.score,
      importance: 10,
    },
    {
      name: 'Redirections',
      value: result.redirectionsCount,
      score: result.redirectionsCount > 2 ? 80 : (result.redirectionsCount > 0 ? 40 : 0),
      importance: 7,
    },
    {
      name: 'Shortened URL',
      value: result.isShortened,
      score: result.isShortened ? 60 : 0,
      importance: 6,
    },
    {
      name: 'Domain Reputation',
      value: result.domainReputation,
      score: result.domainReputation === 'Poor' ? 90 : (result.domainReputation === 'Unknown' ? 50 : 10),
      importance: 9,
    },
    {
      name: 'SSL Certificate',
      value: result.sslStatus ? 'Valid' : 'Invalid/Missing',
      score: result.sslStatus ? 0 : 80,
      importance: 8,
    },
    {
      name: 'Bot Behavior Score',
      value: `${result.botBehaviorScore}%`,
      score: result.botBehaviorScore,
      importance: 9,
    },
  ];
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
    return `The URL ${url} shows multiple high-risk factors including suspicious redirect chains, poor domain reputation, and bot-like behavior patterns. We recommend avoiding this link.`;
  } else if (isSuspicious) {
    return `The URL ${url} has some concerning characteristics such as URL shortening or unknown domain reputation. Proceed with caution.`;
  } else {
    return `The URL ${url} appears to be safe based on our analysis. No suspicious patterns detected.`;
  }
}
