import os
import sys
import shutil
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def main():
    """Force rebuild the model by removing the old one and training a new one."""
    logger.info("Starting force model rebuild process...")
    
    # Path to the model file
    model_path = os.path.join('api', 'saved_models', 'stack_ensemble_model.joblib')
    
    # Remove old model if it exists
    if os.path.exists(model_path):
        logger.info(f"Removing old model: {model_path}")
        try:
            os.remove(model_path)
            logger.info("Old model removed successfully")
        except Exception as e:
            logger.error(f"Error removing old model: {str(e)}")
    
    # Ensure saved_models directory exists
    os.makedirs(os.path.join('api', 'saved_models'), exist_ok=True)
    
    try:
        # Import the train_model function
        from api.ml_model.train_model import main as train_model
        
        # Train a new model
        logger.info("Training new model...")
        train_model()
        
        # Verify the model file exists
        if os.path.exists(model_path):
            logger.info(f"Model file verified at: {model_path}")
            logger.info("Model rebuilt successfully!")
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