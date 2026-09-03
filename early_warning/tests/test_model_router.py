"""
test_model_router.py

Unit tests for early_warning/models/model_router.py and dual_head_model.py:
- Task routing between apnea and stress/anxiety heads
- Output dictionary keys and confidence ranges
- Exception on unknown task
"""

import pytest
import numpy as np

from early_warning.models.model_router import route_prediction
from early_warning.models.dual_head_model import EarlyWarningCNN, build_keras_dual_head_model


def test_keras_model_architecture_spec():
    # If tensorflow is not installed, it returns None gracefully
    model = build_keras_dual_head_model()
    if model is not None:
        assert len(model.outputs) == 2
        out_names = [layer.name for layer in model.outputs]
        assert any("apnea" in name for name in out_names)
        assert any("stress" in name for name in out_names)


def test_apnea_routing():
    dummy_input = np.random.uniform(0, 1, (128, 128, 1)).astype(np.float32)
    res = route_prediction(dummy_input, task="apnea")

    assert res["task"] == "apnea"
    assert res["head_used"] == "apnea_risk_head"
    assert res["risk_stage"] in ["elevated_risk", "low_risk"]
    assert 0.0 <= res["confidence"] <= 1.0
    assert res["lookback_window_sec"] == 90
    assert len(res["key_markers"]) > 0
    assert res["inference_time_ms"] >= 0.0


def test_stress_routing():
    dummy_input = np.random.uniform(0, 1, (128, 128, 1)).astype(np.float32)
    res = route_prediction(dummy_input, task="stress")

    assert res["task"] == "stress_anxiety"
    assert res["subtype"] == "stress"
    assert res["head_used"] == "stress_anxiety_risk_head"
    assert res["risk_stage"] in ["elevated_risk", "baseline"]
    assert 0.0 <= res["confidence"] <= 1.0
    assert len(res["key_markers"]) > 0


def test_anxiety_routing():
    dummy_input = np.random.uniform(0, 1, (128, 128, 1)).astype(np.float32)
    res = route_prediction(dummy_input, task="anxiety")

    assert res["task"] == "stress_anxiety"
    assert res["subtype"] == "anxiety"
    assert res["head_used"] == "stress_anxiety_risk_head"


def test_invalid_task_routing():
    dummy_input = np.random.uniform(0, 1, (128, 128, 1)).astype(np.float32)
    with pytest.raises(ValueError, match="Unsupported task"):
        route_prediction(dummy_input, task="invalid_task_name")
