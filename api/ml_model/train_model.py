import os
import sys
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import logging

# Add parent directory to Python path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

# Import the enhanced modules
from api.ml_model.stack_ensemble import StackEnsembleModel
from api.ml_model.feature_extraction import extract_advanced_features, get_feature_names

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def generate_sample_data(n_samples=1000):
    """Generate synthetic data for training the model with advanced features."""
    np.random.seed(42)
    
    # Generate sample URLs
    domains = ['example.com', 'test.com', 'secure.com', 'login.com']
    paths = ['', '/login', '/account', '/secure', '/update']
    protocols = ['http://', 'https://']
    
    urls = []
    labels = []
    
    for _ in range(n_samples):
        # Generate URL components
        protocol = np.random.choice(protocols)
        domain = np.random.choice(domains)
        path = np.random.choice(paths)
        
        # Add query parameters randomly
        if np.random.random() > 0.5:
            query = f"?id={np.random.randint(1000)}"
            if np.random.random() > 0.7:
                query += f"&token={np.random.randint(10000)}"
        else:
            query = ""
            
        url = f"{protocol}{domain}{path}{query}"
        urls.append(url)
        
        # Generate label based on URL characteristics
        is_malicious = (
            protocol == "http://" or
            "login" in url.lower() or
            "token" in url.lower() or
            len(query) > 20
        )
        labels.append(int(is_malicious))
    
    # Extract features for each URL
    features_list = []
    for url in urls:
        features = extract_advanced_features(url)
        features_list.append(features)
    
    # Convert to DataFrame
    X = pd.DataFrame(features_list)
    y = np.array(labels)
    
    return X, y

def main():
    logger.info("Starting model training process...")
    
    # Generate enhanced training data
    logger.info("Generating synthetic training data...")
    X, y = generate_sample_data(n_samples=10000)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Define base models with enhanced parameters
    base_models = [
        RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            min_samples_split=5,
            random_state=42
        ),
        GradientBoostingClassifier(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            random_state=42
        ),
        LogisticRegression(
            max_iter=1000,
            class_weight='balanced',
            random_state=42
        )
    ]
    
    # Create and train stack ensemble model
    logger.info("Training stack ensemble model...")
    model = StackEnsembleModel(base_models=base_models)
    model.fit(X_train, y_train)
    
    # Evaluate model with comprehensive metrics
    logger.info("Evaluating model performance...")
    metrics = model.score(X_test, y_test)
    
    logger.info("Model performance metrics:")
    for metric, value in metrics.items():
        logger.info(f"{metric.capitalize()}: {value:.4f}")
    
    # Get and log feature importance
    logger.info("\nFeature Importance:")
    importance = model.get_feature_importance()
    for feat, imp in sorted(importance.items(), key=lambda x: x[1], reverse=True):
        logger.info(f"{feat}: {imp:.4f}")
    
    # Test prediction with confidence scores
    sample_idx = np.random.randint(len(X_test))
    sample_url = X_test.iloc[sample_idx:sample_idx+1]
    probas, confidence = model.predict_proba(sample_url)
    
    logger.info("\nSample Prediction:")
    logger.info(f"Prediction probabilities: Safe: {probas[0,0]:.4f}, Malicious: {probas[0,1]:.4f}")
    logger.info(f"Confidence metrics: {confidence}")
    
    # Save the model
    logger.info("\nSaving model...")
    save_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'saved_models')
    os.makedirs(save_dir, exist_ok=True)
    model_path = os.path.join(save_dir, 'stack_ensemble_model.joblib')
    model.save_model(model_path)
    logger.info(f"Model saved to {model_path}")

if __name__ == "__main__":
    main() 