"""
trend.py
========
Multi-window rate-of-change and trend detection module for demonstration of early-warning logic.
Operates across sequences of discrete EEG window inferences.

DESIGN SPECIFICATION & GUARDRAILS:
1. Calculates rate-of-change (first derivative) and acceleration (second derivative)
   between consecutive recording windows.
2. Classifies trend state into one of: 'stable', 'rising', 'escalating', 'peak', 'declining'.
3. CRITICAL: Strictly computes rate-of-change only. NEVER computes, returns, or models any
   time-to-event countdown, time remaining, or temporal projection.
"""

from typing import Dict, List, Any
from pydantic import BaseModel, Field


class WindowMetrics(BaseModel):
    case_id: str
    window_index: int
    arousal_score: float = Field(..., description="Normalized arousal index across [0.0, 1.0]")
    beta_deviation_percent: float = Field(..., description="Beta band percentage deviation relative to reference")
    beta_alpha_ratio: float = Field(..., description="Beta to Alpha spectral power ratio")
    risk_stage: str = Field(..., description="Window categorical classification stage")
    source_label: str = Field(..., description="Description of the recording epoch")


class WindowTransition(BaseModel):
    from_index: int
    to_index: int
    delta_beta_deviation: float = Field(..., description="Change in beta deviation percentage (W2 - W1)")
    delta_arousal: float = Field(..., description="Change in normalized arousal score (W2 - W1)")
    percent_rate_of_change: float = Field(..., description="Window-over-window rate of change percentage")
    slope: float = Field(..., description="First derivative / slope between consecutive windows")


class TrendResult(BaseModel):
    trend_state: str = Field(..., description="Classification: 'stable' | 'rising' | 'escalating' | 'peak' | 'declining'")
    trend_title: str
    trend_description: str
    transitions: List[WindowTransition]
    first_derivative_slopes: List[float] = Field(..., description="Slope values per consecutive window step")
    second_derivative_acceleration: float = Field(..., description="Acceleration / change in slope across windows")
    mean_slope: float = Field(..., description="Average rate of change across the sequence")
    windows: List[WindowMetrics]


def compute_trend(sequence_of_predictions: List[Dict[str, Any]]) -> TrendResult:
    """
    Computes window-over-window rate of change and trend state across a sequence of EEG inferences.

    Trend States:
    - 'stable': Negligible rate of change (|mean_slope| <= 5.0)
    - 'rising': Positive rate of change with steady progression
    - 'escalating': Rising slope combined with accelerating second derivative
    - 'peak': High absolute arousal with plateaued or zero rate of change
    - 'declining': Negative rate of change reflecting recovery or reduction in arousal
    """
    if not sequence_of_predictions:
        raise ValueError("sequence_of_predictions must contain at least 1 window")

    windows: List[WindowMetrics] = []
    for idx, pred in enumerate(sequence_of_predictions):
        case_id = pred.get("case_id", f"window_{idx}")
        classification = pred.get("classification", {})
        stress_metrics = classification.get("stress_metrics", {})
        
        # Extract beta deviation
        beta_dev = 0.0
        baseline_comp = classification.get("baseline_comparison", [])
        for comp in baseline_comp:
            if comp.get("band") == "Beta":
                beta_dev = float(comp.get("deviation_percent", 0.0))
                break
        
        # Extract arousal score
        confidence = float(classification.get("confidence", 0.5))
        risk_stage = classification.get("risk_stage", "baseline")
        is_stress = classification.get("binary_class") == "stress" or risk_stage != "baseline"
        
        # Arousal score on [0.0, 1.0] scale
        if is_stress:
            arousal = round(0.5 + (confidence * 0.5), 3)
        else:
            arousal = round(0.5 - (confidence * 0.5), 3)
            
        bar = float(stress_metrics.get("beta_alpha_ratio", 1.0))
        label = pred.get("description") or classification.get("detected_state_title") or f"Window {idx + 1}"

        windows.append(WindowMetrics(
            case_id=case_id,
            window_index=idx,
            arousal_score=arousal,
            beta_deviation_percent=round(beta_dev, 1),
            beta_alpha_ratio=round(bar, 2),
            risk_stage=risk_stage,
            source_label=label
        ))

    # If only 1 window, rate of change is zero
    if len(windows) == 1:
        return TrendResult(
            trend_state="stable",
            trend_title="Stable Baseline Pattern",
            trend_description="Single window observed; rate-of-change is zero.",
            transitions=[],
            first_derivative_slopes=[],
            second_derivative_acceleration=0.0,
            mean_slope=0.0,
            windows=windows
        )

    # Compute consecutive transitions
    transitions: List[WindowTransition] = []
    slopes: List[float] = []

    for i in range(len(windows) - 1):
        w_prev = windows[i]
        w_next = windows[i + 1]

        delta_beta = round(w_next.beta_deviation_percent - w_prev.beta_deviation_percent, 1)
        delta_arousal = round(w_next.arousal_score - w_prev.arousal_score, 3)

        # Baseline denominator for rate of change calculation
        ref_base = max(abs(w_prev.beta_deviation_percent), 15.0)
        pct_change = round((delta_beta / ref_base) * 100.0, 1)
        slope = delta_beta

        slopes.append(slope)
        transitions.append(WindowTransition(
            from_index=w_prev.window_index,
            to_index=w_next.window_index,
            delta_beta_deviation=delta_beta,
            delta_arousal=delta_arousal,
            percent_rate_of_change=pct_change,
            slope=slope
        ))

    mean_slope = round(sum(slopes) / len(slopes), 2)

    # Compute second derivative (acceleration) if >= 2 transitions (>= 3 windows)
    if len(slopes) >= 2:
        acceleration = round(slopes[-1] - slopes[-2], 2)
    else:
        acceleration = 0.0

    last_window = windows[-1]
    last_slope = slopes[-1]

    # Classification logic based strictly on mathematical derivatives
    if mean_slope <= -8.0:
        trend_state = "declining"
        trend_title = "Declining Arousal / Restorative Trend"
        trend_description = (
            f"Negative rate of change (mean slope {mean_slope:+.1f}%). High-frequency beta power "
            "is decreasing window-over-window toward resting levels."
        )
    elif last_window.arousal_score >= 0.75 and abs(last_slope) <= 6.0:
        trend_state = "peak"
        trend_title = "Peak Arousal Plateau"
        trend_description = (
            f"Elevated arousal with plateaued slope (last transition {last_slope:+.1f}%). "
            "System is sustaining maximum arousal with stabilized rate of change."
        )
    elif (len(slopes) >= 2 and last_slope > 8.0 and acceleration > 0.0) or (len(slopes) == 1 and last_slope >= 30.0):
        trend_state = "escalating"
        trend_title = "Escalating Trend (Accelerating Rate of Change)"
        trend_description = (
            f"Active escalation pattern: rising slope ({last_slope:+.1f}%) with positive rate-of-change "
            f"acceleration ({acceleration:+.1f}%). Demonstrates early escalation trajectory across sequenced windows."
        )
    elif mean_slope > 5.0:
        trend_state = "rising"
        trend_title = "Rising Arousal Trend"
        trend_description = (
            f"Positive rate of change (mean slope {mean_slope:+.1f}%). Beta elevation indicates "
            "steady upward arousal shift across windows."
        )
    else:
        trend_state = "stable"
        trend_title = "Stable Neurometric Trend"
        trend_description = (
            f"Stable trajectory across windows with minimal rate of change (mean slope {mean_slope:+.1f}%)."
        )

    return TrendResult(
        trend_state=trend_state,
        trend_title=trend_title,
        trend_description=trend_description,
        transitions=transitions,
        first_derivative_slopes=slopes,
        second_derivative_acceleration=acceleration,
        mean_slope=mean_slope,
        windows=windows
    )
