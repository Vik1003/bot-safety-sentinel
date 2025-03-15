
import { AnalysisResult, ModelPerformance, DatasetMetrics } from './types';

// Base URL for the Python backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Analyzes a URL for safety using the Python ML model API
 */
export const analyzeUrl = async (url: string): Promise<AnalysisResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing URL:', error);
    throw error;
  }
};

/**
 * Gets the model performance metrics from the API
 */
export const getModelPerformance = async (): Promise<ModelPerformance> => {
  try {
    const response = await fetch(`${API_BASE_URL}/model/performance`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching model performance:', error);
    throw error;
  }
};

/**
 * Gets the dataset metrics from the API
 */
export const getDatasetMetrics = async (): Promise<DatasetMetrics> => {
  try {
    const response = await fetch(`${API_BASE_URL}/model/dataset`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching dataset metrics:', error);
    throw error;
  }
};
