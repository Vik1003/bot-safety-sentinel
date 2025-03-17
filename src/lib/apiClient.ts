import axios from 'axios';
import { AnalysisResult, ModelPerformance, DatasetMetrics } from './types';

// Base URL for the Python backend API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Analyzes a URL for safety using the Python ML model API
 */
export const analyzeUrl = async (url: string): Promise<AnalysisResult> => {
  try {
    const response = await apiClient.post('/analyze', { url });
    return response.data;
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
    const response = await apiClient.get('/model/performance');
    return response.data;
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
    const response = await apiClient.get('/model/dataset');
    return response.data;
  } catch (error) {
    console.error('Error fetching dataset metrics:', error);
    throw error;
  }
};

export const getModelHealth = async (): Promise<{ status: string; message: string }> => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Error checking model health:', error);
    throw error;
  }
};

export default apiClient;
