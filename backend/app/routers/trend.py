"""
trend.py (Router)
=================
FastAPI router providing demonstration endpoints for multi-window escalation pattern detection.
Runs rate-of-change and trend classification over sequences of discrete EEG recordings.
"""

import os
import json
import logging
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from app.db.database import get_db
from app.data.sequences import DEMO_SEQUENCES, get_sequence_by_id, list_sequences
from app.ml.trend import compute_trend, TrendResult, WindowMetrics, WindowTransition

logger = logging.getLogger("neurosense.routers.trend")
router = APIRouter(prefix="/trend", tags=["Trend Detection (Demonstration)"])

BENCHMARK_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "..", "frontend", "lib", "benchmark-data.json")
)


class SequenceMetadata(BaseModel):
    id: str
    title: str
    description: str
    same_subject: bool
    same_dataset: bool
    is_synthetic_timeline: bool
    source_cases: List[str]


class SequenceTrendResponse(BaseModel):
    sequence_id: str
    sequence_metadata: SequenceMetadata
    trend_state: str = Field(..., description="'stable' | 'rising' | 'escalating' | 'peak' | 'declining'")
    trend_title: str
    trend_description: str
    slope_per_window: List[float]
    mean_slope: float
    second_derivative_acceleration: float
    transitions: List[WindowTransition]
    windows: List[WindowMetrics]
    demonstration_disclosure: str = Field(
        ...,
        description="Mandatory research disclosure: chained demonstration sequence, not a real continuous timeline"
    )


def _load_prediction_for_case(case_id: str) -> Dict[str, Any]:
    """Helper to fetch single-window prediction record from benchmark repository."""
    if os.path.exists(BENCHMARK_PATH):
        with open(BENCHMARK_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            preds = data.get("predictions", {})
            cases = {c["id"]: c for c in data.get("cases", [])}
            if case_id in preds:
                pred = preds[case_id]
                case_item = cases.get(case_id, {})
                return {
                    "case_id": case_id,
                    "description": case_item.get("description", ""),
                    "classification": {
                        "binary_class": pred.get("predicted_class", "baseline"),
                        "risk_stage": pred.get("risk_stage", "baseline"),
                        "confidence": pred.get("confidence", 0.5),
                        "detected_state_title": pred.get("detected_state_title", ""),
                        "stress_metrics": pred.get("stress_metrics", {}),
                        "baseline_comparison": pred.get("baseline_comparison", []),
                        "numerical_band_powers": pred.get("numerical_band_powers", [])
                    }
                }
    raise HTTPException(status_code=404, detail=f"Case data for '{case_id}' not found")


@router.get("", response_model=List[SequenceMetadata])
def get_available_sequences():
    """List all available demonstration sequences with metadata."""
    return list_sequences()


@router.get("/{sequence_id}", response_model=SequenceTrendResponse)
def get_sequence_trend(sequence_id: str):
    """
    Runs per-window inference retrieval on each case in the sequence,
    computes rate-of-change and trend state via trend.py, and returns
    structured trajectory results with mandatory research disclosure.
    """
    try:
        seq = get_sequence_by_id(sequence_id)
    except KeyError:
        raise HTTPException(
            status_code=404,
            detail=f"Sequence '{sequence_id}' not found. Valid IDs: {list(DEMO_SEQUENCES.keys())}"
        )

    predictions = []
    for case_id in seq["source_cases"]:
        pred = _load_prediction_for_case(case_id)
        predictions.append(pred)

    trend_result: TrendResult = compute_trend(predictions)

    # Generate disclosure statement from sequence metadata
    num_windows = len(seq["source_cases"])
    if seq["same_subject"]:
        subject_str = "From the same research subject."
    else:
        subject_str = "Spans different subjects/sessions — not a real continuous recording."

    disclosure = (
        f"Demonstration sequence — chained from {num_windows} separate recordings to illustrate trend-detection logic. "
        f"{subject_str} This is not a validated prediction of a real anxiety attack and gives no time-to-event estimate."
    )

    return SequenceTrendResponse(
        sequence_id=sequence_id,
        sequence_metadata=SequenceMetadata(**seq),
        trend_state=trend_result.trend_state,
        trend_title=trend_result.trend_title,
        trend_description=trend_result.trend_description,
        slope_per_window=trend_result.first_derivative_slopes,
        mean_slope=trend_result.mean_slope,
        second_derivative_acceleration=trend_result.second_derivative_acceleration,
        transitions=trend_result.transitions,
        windows=trend_result.windows,
        demonstration_disclosure=disclosure
    )
