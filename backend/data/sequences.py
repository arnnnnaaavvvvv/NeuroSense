"""
sequences.py
============
Defines curated demonstration sequences constructed strictly from real EEG recordings.
These sequences illustrate multi-window rate-of-change and trend-detection logic.

RESEARCH GUARDRAIL:
All sequences are explicitly flagged as synthetic timelines constructed from discrete
benchmark recording windows. They represent an experimental conceptual demonstration
and do not represent continuous real-time clinical monitoring.
"""

from typing import Dict, List, Any


DEMO_SEQUENCES: Dict[str, Dict[str, Any]] = {
    "sam40_sub01_escalation": {
        "id": "sam40_sub01_escalation",
        "title": "SAM-40 Subject 01: Rest to Cognitive Stress Transition",
        "description": "Two-window sequence from the same research subject transitioning from eyes-closed resting baseline to acute mental arithmetic stress.",
        "same_subject": True,
        "same_dataset": True,
        "is_synthetic_timeline": True,
        "source_cases": [
            "sam40_sub01_relax_baseline",
            "sam40_sub01_math_stress"
        ]
    },
    "dasps_s01_escalation": {
        "id": "dasps_s01_escalation",
        "title": "DASPS Subject 01: Rest to Anxiety Elicitation Transition",
        "description": "Two-window sequence from the same research subject transitioning from resting baseline to high-anxiety emotional stimulation.",
        "same_subject": True,
        "same_dataset": True,
        "is_synthetic_timeline": True,
        "source_cases": [
            "dasps_s01_relax_baseline",
            "dasps_s01_high_anxiety"
        ]
    },
    "cross_cohort_progression": {
        "id": "cross_cohort_progression",
        "title": "Cross-Cohort Graded Escalation Progression",
        "description": "Multi-window sequence chaining real recordings across multiple research cohorts to demonstrate multi-step rate-of-change acceleration logic.",
        "same_subject": False,
        "same_dataset": False,
        "is_synthetic_timeline": True,
        "source_cases": [
            "sam40_sub01_relax_baseline",
            "student_sub11_stroop_stress",
            "sam40_sub01_math_stress",
            "dasps_s01_high_anxiety"
        ]
    },
    "sam40_sub01_recovery": {
        "id": "sam40_sub01_recovery",
        "title": "SAM-40 Subject 01: Post-Stress Restorative Recovery",
        "description": "Two-window sequence from the same research subject observing the shift from mental arithmetic stress back toward resting baseline.",
        "same_subject": True,
        "same_dataset": True,
        "is_synthetic_timeline": True,
        "source_cases": [
            "sam40_sub01_math_stress",
            "sam40_sub01_relax_baseline"
        ]
    }
}


def get_sequence_by_id(sequence_id: str) -> Dict[str, Any]:
    """Retrieve sequence metadata by identifier."""
    if sequence_id not in DEMO_SEQUENCES:
        raise KeyError(f"Unknown sequence_id: {sequence_id}")
    return DEMO_SEQUENCES[sequence_id]


def list_sequences() -> List[Dict[str, Any]]:
    """Return list of all registered demonstration sequences."""
    return list(DEMO_SEQUENCES.values())
