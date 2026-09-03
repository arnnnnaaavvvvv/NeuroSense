"""
model_router.py

Task Router for Early-Warning Physiological Risk Classification.
Takes a task identifier ("apnea" or "stress_anxiety" / "stress" / "anxiety")
and routes input 128x128 SST spectrograms through the shared Özdemir backbone to the correct head.
"""

import numpy as np
from typing import Dict, Any, Optional
from .dual_head_model import EarlyWarningCNN

_SHARED_MODEL: Optional[EarlyWarningCNN] = None


def get_model(weights_path: Optional[str] = None) -> EarlyWarningCNN:
    """Returns singleton model instance."""
    global _SHARED_MODEL
    if _SHARED_MODEL is None:
        _SHARED_MODEL = EarlyWarningCNN(weights_path=weights_path)
    return _SHARED_MODEL


def route_prediction(
    signal_repr: np.ndarray,
    task: str = "apnea",
    weights_path: Optional[str] = None
) -> Dict[str, Any]:
    """
    Routes an input 128x128 SST representation to the requested classification head.

    Args:
        signal_repr: np.ndarray of shape (128, 128, 1) or (1, 128, 128, 1)
        task: "apnea" (sleep apnea early warning) or
              "stress_anxiety" / "stress" / "anxiety" (student stress/anxiety risk)
        weights_path: optional path to Keras saved weights

    Returns:
        Structured prediction dictionary with risk_stage, confidence score,
        head_used, and key electrographic markers.
    """
    model = get_model(weights_path)
    norm_task = task.lower().strip()

    if norm_task == "apnea":
        return model.predict_apnea_risk(signal_repr)
    elif norm_task in ["stress_anxiety", "stress", "anxiety"]:
        subtype = "anxiety" if norm_task == "anxiety" else "stress"
        return model.predict_stress_anxiety_risk(signal_repr, task_subtype=subtype)
    else:
        raise ValueError(
            f"Unsupported task '{task}'. Expected 'apnea' or 'stress_anxiety'/'stress'/'anxiety'."
        )
