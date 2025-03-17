import os
import sys
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def main():
    """Rebuild the model with the current scikit-learn version."""
    logger.info("Starting model rebuild process...")
    
    try:
        # Import the train_model function
        from api.ml_model.train_model import main as train_model
        
        # Train a new model
        logger.info("Training new model...")
        train_model()
        
        logger.info("Model rebuilt successfully!")
        
        # Verify the model file exists
        model_path = os.path.join('api', 'saved_models', 'stack_ensemble_model.joblib')
        if os.path.exists(model_path):
            logger.info(f"Model file verified at: {model_path}")
        else:
            logger.error(f"Model file not found at: {model_path}")
            
    except ImportError as e:
        logger.error(f"Failed to import necessary modules: {str(e)}")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Error during model rebuild: {str(e)}")
        sys.exit(1)
        
    logger.info("Model rebuild process completed.")

if __name__ == "__main__":
    main() 