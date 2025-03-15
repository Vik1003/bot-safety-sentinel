
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
  featureMetrics?: FeatureMetric[]; // Detailed metrics
  modelConfidence?: number; // 0-100, represents the model's confidence in its prediction
  modelAccuracy?: number; // 0-100, represents the overall model accuracy
}

export interface FeatureMetric {
  name: string;
  value: string | number | boolean;
  score: number; // 0-100
  importance: number; // 0-10
}

export interface ModelPerformance {
  accuracy: number; // 0-100
  precision: number; // 0-100
  recall: number; // 0-100
  f1Score: number; // 0-100
  trainingDataSize: number;
  trainingTime: string; // e.g., "3 hours 45 minutes"
  lastUpdated: string; // ISO date string
}

export interface DatasetMetrics {
  totalSamples: number;
  maliciousSamples: number;
  suspiciousSamples: number;
  safeSamples: number;
  urlFeatures: number;
  behaviorFeatures: number;
  metadataFeatures: number;
}
