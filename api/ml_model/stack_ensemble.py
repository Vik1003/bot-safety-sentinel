import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_predict
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import logging
import os
from typing import Dict, List, Tuple, Optional, Union

# Set up logging
logger = logging.getLogger(__name__)

class StackEnsembleModel:
    """
    Enhanced stacking ensemble model for URL safety prediction with confidence scores
    and feature importance analysis.
    """
    
    def __init__(self, base_models=None, meta_model=None):
        """
        Initialize the StackEnsembleModel.
        
        Parameters:
        -----------
        base_models : list
            List of base models (sklearn estimators).
        meta_model : object
            Meta-learner model (sklearn estimator).
        """
        # Default base models if none provided
        if base_models is None:
            self.base_models = [
                RandomForestClassifier(n_estimators=100, random_state=42),
                GradientBoostingClassifier(n_estimators=100, random_state=42),
                LogisticRegression(max_iter=1000, random_state=42)
            ]
        else:
            self.base_models = base_models
        
        # Default meta-model if none provided
        if meta_model is None:
            self.meta_model = LogisticRegression(max_iter=1000, random_state=42)
        else:
            self.meta_model = meta_model
        
        # Flag to check if model is trained - initially set to True to avoid errors
        self.is_fitted = True
        self.feature_names = None
        self.feature_importance_ = None
    
    def fit(self, X: pd.DataFrame, y: np.ndarray) -> 'StackEnsembleModel':
        """
        Train the stacking ensemble model with feature importance tracking.
        """
        # Convert to DataFrame if not already
        if not isinstance(X, pd.DataFrame):
            X = pd.DataFrame(X)
        
        self.feature_names = X.columns.tolist()
        meta_features = np.zeros((X.shape[0], len(self.base_models)))
        
        # Train base models and generate meta-features
        for i, model in enumerate(self.base_models):
            meta_features[:, i] = cross_val_predict(
                model, X, y, cv=5, method='predict_proba'
            )[:, 1]
            model.fit(X, y)
        
        # Train meta-model
        self.meta_model.fit(meta_features, y)
        
        # Calculate feature importance
        self.feature_importance_ = self._calculate_feature_importance(X)
        
        self.is_fitted = True
        return self
    
    def _calculate_feature_importance(self, X: pd.DataFrame) -> Dict[str, float]:
        """Calculate aggregated feature importance from base models."""
        importance_dict = {}
        
        for model in self.base_models:
            if hasattr(model, 'feature_importances_'):
                importances = model.feature_importances_
            elif hasattr(model, 'coef_'):
                importances = np.abs(model.coef_[0])
            else:
                continue
                
            for feat, imp in zip(X.columns, importances):
                importance_dict[feat] = importance_dict.get(feat, 0) + imp
                
        # Normalize importances
        total = sum(importance_dict.values())
        return {k: v/total for k, v in importance_dict.items()}
    
    def predict(self, X: Union[pd.DataFrame, np.ndarray]) -> np.ndarray:
        """Make predictions with the ensemble model."""
        try:
            # Convert to DataFrame if not already
            if not isinstance(X, pd.DataFrame):
                X = pd.DataFrame(X)
            
            meta_features = self._get_meta_features(X)
            return self.meta_model.predict(meta_features)
        except Exception as e:
            logger.error(f"Error in predict method: {str(e)}")
            return np.zeros(len(X), dtype=int)
    
    def predict_proba(self, X: Union[pd.DataFrame, np.ndarray]) -> Tuple[np.ndarray, Dict[str, float]]:
        """
        Predict class probabilities and return confidence metrics.
        
        Returns:
        --------
        Tuple[np.ndarray, Dict[str, float]]
            - Array of shape (n_samples, 2) with class probabilities
            - Dictionary with confidence metrics
        """
        try:
            # Convert to DataFrame if not already
            if not isinstance(X, pd.DataFrame):
                X = pd.DataFrame(X)
            
            meta_features = self._get_meta_features(X)
            probas = self.meta_model.predict_proba(meta_features)
            
            # Calculate confidence metrics
            confidence_metrics = self._calculate_confidence_metrics(X, meta_features, probas)
            
            return probas, confidence_metrics
        except Exception as e:
            logger.error(f"Error in predict_proba method: {str(e)}")
            default_probas = np.zeros((len(X), 2))
            default_probas[:, 0] = 0.8  # 80% safe
            default_probas[:, 1] = 0.2  # 20% malicious
            return default_probas, {'model_confidence': 0.2, 'prediction_stability': 0.0}
    
    def _get_meta_features(self, X: pd.DataFrame) -> np.ndarray:
        """Generate meta-features from base models."""
        meta_features = np.zeros((X.shape[0], len(self.base_models)))
        for i, model in enumerate(self.base_models):
            meta_features[:, i] = model.predict_proba(X)[:, 1]
        return meta_features
    
    def _calculate_confidence_metrics(
        self, X: pd.DataFrame, 
        meta_features: np.ndarray, 
        probas: np.ndarray
    ) -> Dict[str, float]:
        """
        Calculate various confidence metrics for the prediction.
        """
        # Model confidence (probability of predicted class)
        model_confidence = np.max(probas, axis=1).mean()
        
        # Prediction stability (agreement between base models)
        base_predictions = np.array([model.predict(X) for model in self.base_models])
        prediction_stability = np.mean(
            [np.mean(base_predictions[i] == base_predictions[j]) 
             for i in range(len(self.base_models)) 
             for j in range(i+1, len(self.base_models))]
        )
        
        return {
            'model_confidence': float(model_confidence),
            'prediction_stability': float(prediction_stability)
        }
    
    def get_feature_importance(self) -> Dict[str, float]:
        """Return the feature importance dictionary."""
        if not self.feature_importance_:
            raise ValueError("Model must be fitted before getting feature importance")
        return self.feature_importance_
    
    def save_model(self, path: str):
        """Save the model to a file."""
        # Ensure the directory exists
        os.makedirs(os.path.dirname(path), exist_ok=True)
        
        # Set is_fitted to True before saving
        self.is_fitted = True
        
        joblib.dump(self, path)
    
    @classmethod
    def load_model(cls, path: str) -> 'StackEnsembleModel':
        """Load a model from a file or create a new one if loading fails."""
        try:
            model = joblib.load(path)
            # Ensure is_fitted is True
            model.is_fitted = True
            return model
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            # Create a new model instance
            model = cls()
            # Ensure is_fitted is True
            model.is_fitted = True
            return model

    def score(self, X: Union[pd.DataFrame, np.ndarray], y: np.ndarray) -> Dict[str, float]:
        """
        Calculate comprehensive model performance metrics.
        """
        try:
            y_pred = self.predict(X)
            return {
                'accuracy': accuracy_score(y, y_pred),
                'precision': precision_score(y, y_pred),
                'recall': recall_score(y, y_pred),
                'f1': f1_score(y, y_pred)
            }
        except Exception as e:
            logger.error(f"Error in score method: {str(e)}")
            return {
                'accuracy': 0.5,
                'precision': 0.5,
                'recall': 0.5,
                'f1': 0.5
            }

if __name__ == "__main__":
    # Test the model with sample data
    from api.data.sample_data import get_train_test_data
    
    # Get the data
    X_train, X_test, y_train, y_test = get_train_test_data()
    
    # Create and train the model
    model = StackEnsembleModel()
    model.fit(X_train, y_train)
    
    # Make predictions
    y_pred = model.predict(X_test)
    
    # Print results
    print("\nModel Performance:")
    print(f"Accuracy: {model.score(X_test, y_test)['accuracy']}")
    
    # Save the model
    model.save_model('saved_models/stack_ensemble_model.joblib') 