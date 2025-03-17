import uvicorn
import os
import sys
from pathlib import Path

# Get the absolute path to the project root directory
ROOT_DIR = Path(__file__).resolve().parent

# Add the project root directory to Python path
sys.path.append(str(ROOT_DIR))

if __name__ == "__main__":
    # Run the FastAPI application
    uvicorn.run(
        "api.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=[str(ROOT_DIR / "api")],
        workers=1
    ) 