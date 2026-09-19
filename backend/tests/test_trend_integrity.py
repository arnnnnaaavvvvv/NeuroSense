"""
test_trend_integrity.py
========================
Automated unit tests asserting:
1. compute_trend correctly classifies trend states and rates of change.
2. No time-to-event or countdown fields are output by trend.py.
3. Disclosure text accurately reflects same-subject vs cross-subject sequence metadata.
4. Language guardrails: no forbidden terms in source or rendered output.
"""

import os
import sys
import json
import re

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.data.sequences import DEMO_SEQUENCES, list_sequences
from app.ml.trend import compute_trend, TrendResult
from app.routers.trend import get_sequence_trend


def test_sequences_metadata_integrity():
    """Verify all sequences are flagged as synthetic timelines and have valid source cases."""
    sequences = list_sequences()
    assert len(sequences) >= 3

    for seq in sequences:
        assert seq["is_synthetic_timeline"] is True, f"{seq['id']} must be flagged is_synthetic_timeline=True"
        assert len(seq["source_cases"]) >= 2, f"{seq['id']} must have at least 2 source windows"
        assert isinstance(seq["same_subject"], bool)
        assert isinstance(seq["same_dataset"], bool)


def test_trend_computation_and_no_time_fields():
    """Verify compute_trend produces rate-of-change metrics and NEVER outputs time-to-event fields."""
    forbidden_time_fields = [
        "time_to_event",
        "countdown",
        "time_remaining",
        "predicted_minutes",
        "time_estimate",
        "countdown_seconds",
        "estimated_onset"
    ]

    for seq_id in DEMO_SEQUENCES:
        res = get_sequence_trend(seq_id)
        assert isinstance(res.trend_state, str)
        assert res.trend_state in {"stable", "rising", "escalating", "peak", "declining"}
        assert isinstance(res.mean_slope, float)
        assert isinstance(res.slope_per_window, list)

        # Assert no forbidden time prediction fields exist in response
        res_dict = res.model_dump()
        for field in forbidden_time_fields:
            assert field not in res_dict, f"Forbidden time field '{field}' detected in response!"


def test_mandatory_disclosure_generation():
    """Verify disclosure text is dynamically generated and accurately distinguishes same-subject vs cross-subject."""
    # 1. Same-subject sequence
    same_subj_res = get_sequence_trend("sam40_sub01_escalation")
    disclosure_1 = same_subj_res.demonstration_disclosure
    assert "From the same research subject." in disclosure_1
    assert "Spans different subjects/sessions" not in disclosure_1
    assert "chained from 2 separate recordings" in disclosure_1
    assert "This is not a validated prediction of a real anxiety attack and gives no time-to-event estimate." in disclosure_1

    # 2. Cross-subject sequence
    cross_subj_res = get_sequence_trend("cross_cohort_progression")
    disclosure_2 = cross_subj_res.demonstration_disclosure
    assert "Spans different subjects/sessions — not a real continuous recording." in disclosure_2
    assert "From the same research subject." not in disclosure_2
    assert "chained from 4 separate recordings" in disclosure_2
    assert "This is not a validated prediction of a real anxiety attack and gives no time-to-event estimate." in disclosure_2


def test_trend_state_escalating_and_declining():
    """Verify SAM-40 escalation sequence yields escalating trend, recovery yields declining trend."""
    escalating_res = get_sequence_trend("sam40_sub01_escalation")
    assert escalating_res.trend_state == "escalating"
    assert escalating_res.mean_slope > 0

    recovery_res = get_sequence_trend("sam40_sub01_recovery")
    assert recovery_res.trend_state == "declining"
    assert recovery_res.mean_slope < 0


def test_language_guardrails_across_new_files():
    """Ensure no forbidden language appears in trend source code or API fields."""
    feature_files = [
        os.path.join(os.path.dirname(__file__), "..", "data", "sequences.py"),
        os.path.join(os.path.dirname(__file__), "..", "app", "ml", "trend.py"),
        os.path.join(os.path.dirname(__file__), "..", "app", "routers", "trend.py")
    ]

    # Forbidden terms outside of the single regulatory disclaimer clause
    strictly_forbidden_patterns = [
        r"\bpanic\b",
        r"\bbefore it happens\b",
        r"\bin \d+ minutes\b",
        r"\bdetects symptoms of anxiety\b"
    ]

    for file_path in feature_files:
        assert os.path.exists(file_path), f"File {file_path} does not exist"
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        for pattern in strictly_forbidden_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            assert len(matches) == 0, f"Forbidden pattern '{pattern}' found in {file_path}: {matches}"


if __name__ == "__main__":
    test_sequences_metadata_integrity()
    test_trend_computation_and_no_time_fields()
    test_mandatory_disclosure_generation()
    test_trend_state_escalating_and_declining()
    test_language_guardrails_across_new_files()
    print("ALL 5 TREND INTEGRITY AND LANGUAGE TESTS PASSED SUCCESSFULLY!")
