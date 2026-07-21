import os
import json
import logging
import joblib
from typing import Any, Dict

def get_logger(name: str) -> logging.Logger:
    """
    Returns a configured logger with standard formatting.
    """
    logger = logging.getLogger(name)
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
    return logger

logger = get_logger("ml_utils")

def ensure_dir(path: str) -> None:
    """
    Ensures that the directory for a given file path (or direct directory path) exists.
    """
    if os.path.exists(path):
        return
    
    # If the path has an extension, treat it as a file path and get its directory
    _, ext = os.path.splitext(path)
    dir_path = os.path.dirname(path) if ext else path
    
    if dir_path and not os.path.exists(dir_path):
        os.makedirs(dir_path, exist_ok=True)
        logger.info(f"Created directory: {dir_path}")

def save_json(data: Dict[str, Any], file_path: str) -> None:
    """
    Saves a dictionary as a formatted JSON file.
    """
    ensure_dir(file_path)
    try:
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=4)
        logger.info(f"Saved JSON data to {file_path}")
    except Exception as e:
        logger.error(f"Error saving JSON to {file_path}: {e}")
        raise e

def load_json(file_path: str) -> Dict[str, Any]:
    """
    Loads data from a JSON file.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"JSON file not found at {file_path}")
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading JSON from {file_path}: {e}")
        raise e

def save_model(model: Any, file_path: str) -> None:
    """
    Saves a machine learning model or preprocessor using joblib.
    """
    ensure_dir(file_path)
    try:
        joblib.dump(model, file_path)
        logger.info(f"Saved joblib model to {file_path}")
    except Exception as e:
        logger.error(f"Error saving joblib model to {file_path}: {e}")
        raise e

def load_model(file_path: str) -> Any:
    """
    Loads a machine learning model or preprocessor using joblib.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Joblib file not found at {file_path}")
    try:
        model = joblib.load(file_path)
        logger.info(f"Loaded joblib model from {file_path}")
        return model
    except Exception as e:
        logger.error(f"Error loading joblib model from {file_path}: {e}")
        raise e
