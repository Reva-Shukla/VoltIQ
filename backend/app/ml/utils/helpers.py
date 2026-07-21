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

logger = get_logger("voltiq_ml")

def ensure_dir(path: str) -> None:
    """
    Ensures that the directory for a given file path exists.
    """
    if os.path.exists(path):
        return
    _, ext = os.path.splitext(path)
    dir_path = os.path.dirname(path) if ext else path
    if dir_path and not os.path.exists(dir_path):
        os.makedirs(dir_path, exist_ok=True)

def save_json(data: Dict[str, Any], file_path: str) -> None:
    ensure_dir(file_path)
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=4)

def load_json(file_path: str) -> Dict[str, Any]:
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"JSON file not found at {file_path}")
    with open(file_path, 'r') as f:
        return json.load(f)

def save_model(model: Any, file_path: str) -> None:
    ensure_dir(file_path)
    joblib.dump(model, file_path)

def load_model(file_path: str) -> Any:
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Joblib file not found at {file_path}")
    return joblib.load(file_path)
