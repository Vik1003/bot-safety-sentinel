export type RiskStatus = 'safe' | 'suspicious' | 'malicious' | 'analyzing';

export interface AnalysisResult {
  url: string;
  is_safe: boolean;
  confidence_score: number;
  prediction_stability: number;
  probabilities: {
    safe: number;
    malicious: number;
  };
  feature_importance: Array<{
    feature: string;
    importance: number;
  }>;
  analysis_time: number;
  timestamp: string;
}

export interface FeatureMetric {
  name: string;
  value: string | number | boolean;
  score: number; // 0-100
  importance: number; // 0-10
}

export interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  auc_roc: number;
  framework: string;
  modelType: string;
  baseModels: string[];
  modelVersion: string;
  lastUpdated: string;
}

export interface DatasetMetrics {
  total_samples: number;
  safe_samples: number;
  malicious_samples: number;
  features_used: string[];
  last_updated: string;
  data_sources: string[];
  class_distribution: {
    safe: number;
    malicious: number;
  };
}

export interface APIError {
  message: string;
  status: number;
  details?: string;
}
