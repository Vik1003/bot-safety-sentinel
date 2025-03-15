
// This file is kept temporarily to avoid breaking imports
// It will be deprecated in favor of apiClient.ts
import { AnalysisResult, ModelPerformance, DatasetMetrics } from './types';

// These functions are now just placeholders and will be properly implemented in apiClient.ts
export const mockAnalysis = async (url: string): Promise<AnalysisResult> => {
  console.warn("mockAnalysis is deprecated. Use apiClient instead.");
  throw new Error("Mock data has been removed. Please use the actual API client.");
};

export const getFeatureMetrics = (result: AnalysisResult) => {
  console.warn("getFeatureMetrics is deprecated. This data should come from the API.");
  return result.featureMetrics || [];
};

export const getModelPerformance = (): ModelPerformance => {
  console.warn("getModelPerformance is deprecated. Use apiClient instead.");
  throw new Error("Mock data has been removed. Please use the actual API client.");
};

export const getDatasetMetrics = (): DatasetMetrics => {
  console.warn("getDatasetMetrics is deprecated. Use apiClient instead.");
  throw new Error("Mock data has been removed. Please use the actual API client.");
};
