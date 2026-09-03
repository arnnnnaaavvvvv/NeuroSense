"""
test_smoke_e2e.py

End-to-End Smoke Tests for NeuroSense Early-Warning Module:
Feeds one sample through each dataset path:
    raw sample -> pre_event_windowing -> model_router -> rag_precautions
Asserts well-formed, non-throwing output, valid clinical citations, and research disclaimer.
"""

import pytest
import numpy as np

from early_warning.data_loaders.mitbih_apnea_loader import MITBIHApneaLoader
from early_warning.data_loaders.sam40_stress_loader import SAM40StressLoader
from early_warning.data_loaders.student_stress_eeg_loader import StudentStressEEGLoader
from early_warning.data_loaders.dasps_anxiety_loader import DASPSAnxietyLoader

from early_warning.models.model_router import route_prediction
from early_warning.rag.rag_precautions import retrieve_precautions, MEDICAL_RESEARCH_DISCLAIMER


def test_e2e_mitbih_apnea_pipeline():
    loader = MITBIHApneaLoader(lookback_sec=90.0)
    sig, onsets, durs = loader._generate_synthetic_psg_benchmark("slp01a", duration_sec=180.0, seed=1)

    from early_warning.preprocessing.pre_event_windowing import extract_pre_event_windows
    X, y, meta = extract_pre_event_windows(
        sig, fs=250.0, event_onsets_sec=onsets, event_durations_sec=durs, lookback_sec=90.0
    )

    sample = X[0]
    pred = route_prediction(sample, task="apnea")
    prec = retrieve_precautions(task="apnea", risk_stage=pred["risk_stage"])

    assert pred["task"] == "apnea"
    assert pred["head_used"] == "apnea_risk_head"
    assert 0.0 <= pred["confidence"] <= 1.0
    assert "guidance_text" in prec
    assert len(prec["citations"]) > 0
    assert "AASM" in prec["source_citation"] or "NICE" in prec["source_citation"]
    assert len(prec["recommended_actions"]) > 0
    assert prec["medical_disclaimer"] == MEDICAL_RESEARCH_DISCLAIMER


def test_e2e_sam40_stress_pipeline():
    loader = SAM40StressLoader()
    X, y = loader._generate_synthetic_sam40_subject(subject_id=1, seed=42)

    sample = X[0]
    pred = route_prediction(sample, task="stress")
    prec = retrieve_precautions(task="stress_anxiety", risk_stage=pred["risk_stage"])

    assert pred["task"] == "stress_anxiety"
    assert pred["head_used"] == "stress_anxiety_risk_head"
    assert "guidance_text" in prec
    assert "APA" in prec["source_citation"] or "NICE" in prec["source_citation"]
    assert len(prec["recommended_actions"]) > 0


def test_e2e_student_stress_pipeline():
    loader = StudentStressEEGLoader()
    X, y = loader._generate_synthetic_student_subject(subject_id=2, seed=84)

    sample = X[0]
    pred = route_prediction(sample, task="stress_anxiety")
    prec = retrieve_precautions(task="stress_anxiety", risk_stage=pred["risk_stage"])

    assert pred["head_used"] == "stress_anxiety_risk_head"
    assert len(prec["recommended_actions"]) > 0


def test_e2e_dasps_anxiety_pipeline():
    loader = DASPSAnxietyLoader()
    X, y = loader._generate_synthetic_dasps_subject(subject_id=3, seed=230)

    sample = X[0]
    pred = route_prediction(sample, task="anxiety")
    prec = retrieve_precautions(task="anxiety", risk_stage=pred["risk_stage"])

    assert pred["task"] == "stress_anxiety"
    assert pred["subtype"] == "anxiety"
    assert len(prec["citations"]) > 0
