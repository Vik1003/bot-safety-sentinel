
export type RiskStatus = 'safe' | 'suspicious' | 'malicious' | 'analyzing';

export interface AnalysisResult {
  status: RiskStatus;
  score: number; // 0-100
  url: string;
  redirectionsCount: number;
  isShortened: boolean;
  domainReputation: string;
  sslStatus: boolean;
  botBehaviorScore: number; // 0-100
  timestamp: string;
  details?: string;
  featureMetrics?: FeatureMetric[]; // Added detailed metrics
}

export interface FeatureMetric {
  name: string;
  value: string | number | boolean;
  score: number; // 0-100
  importance: number; // 0-10
}
