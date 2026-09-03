"""
test_data_loaders.py

Unit tests validating shape and label consistency across all four early-warning data loaders:
1. MIT-BIH Polysomnographic Database (mitbih_apnea_loader)
2. SAM-40 EEG Stress Dataset (sam40_stress_loader)
3. Student EEG Stress Dataset (student_stress_eeg_loader)
4. DASPS Anxiety Dataset (dasps_anxiety_loader)
"""

import pytest
import numpy as np

from early_warning.data_loaders.mitbih_apnea_loader import MITBIHApneaLoader
from early_warning.data_loaders.sam40_stress_loader import SAM40StressLoader
from early_warning.data_loaders.student_stress_eeg_loader import StudentStressEEGLoader
from early_warning.data_loaders.dasps_anxiety_loader import DASPSAnxietyLoader


def test_mitbih_apnea_loader_shape_and_labels():
    loader = MITBIHApneaLoader(lookback_sec=90.0)
    
    # Load small subset for unit test
    sig, onsets, durs = loader._generate_synthetic_psg_benchmark(
        subject_id="slp01a", duration_sec=180.0, seed=42
    )
    from early_warning.preprocessing.pre_event_windowing import extract_pre_event_windows
    X, y, meta = extract_pre_event_windows(
        signal_data=sig,
        fs=250.0,
        event_onsets_sec=onsets,
        event_durations_sec=durs,
        lookback_sec=90.0
    )

    assert X.ndim == 4, f"Expected 4D array (N, H, W, C), got {X.shape}"
    assert X.shape[1:] == (128, 128, 1), f"Expected (128, 128, 1) image shape, got {X.shape[1:]}"
    assert len(X) == len(y)
    assert len(X) > 0
    unique_labels = set(np.unique(y))
    assert unique_labels.issubset({0, 1}), f"Labels must be binary {0, 1}, got {unique_labels}"
    assert 1 in unique_labels, "Should contain elevated risk pre-apnea labels"


def test_sam40_stress_loader_shape_and_labels():
    loader = SAM40StressLoader()
    X, y = loader._generate_synthetic_sam40_subject(subject_id=1, seed=42)

    assert X.ndim == 4
    assert X.shape[1:] == (128, 128, 1)
    assert len(X) == len(y)
    assert len(X) == 8  # 4 baseline + 4 stress
    assert set(np.unique(y)) == {0, 1}
    assert (y == 1).sum() == 4
    assert (y == 0).sum() == 4


def test_student_stress_eeg_loader_shape_and_labels():
    loader = StudentStressEEGLoader()
    X, y = loader._generate_synthetic_student_subject(subject_id=5, seed=84)

    assert X.ndim == 4
    assert X.shape[1:] == (128, 128, 1)
    assert len(X) == len(y)
    assert len(X) == 8  # 4 baseline + 4 acute stress
    assert set(np.unique(y)) == {0, 1}


def test_dasps_anxiety_loader_shape_and_labels():
    loader = DASPSAnxietyLoader()
    X, y = loader._generate_synthetic_dasps_subject(subject_id=2, seed=230)

    assert X.ndim == 4
    assert X.shape[1:] == (128, 128, 1)
    assert len(X) == len(y)
    assert len(X) == 8  # 4 low anxiety + 4 high anxiety
    assert set(np.unique(y)) == {0, 1}


def test_root_data_loaders_import_parity():
    """Verify that root data_loaders package matches early_warning.data_loaders."""
    from data_loaders.mitbih_apnea_loader import MITBIHApneaLoader as RootApneaLoader
    from data_loaders.sam40_stress_loader import SAM40StressLoader as RootSAM40Loader
    from data_loaders.student_stress_eeg_loader import StudentStressEEGLoader as RootStudentLoader
    from data_loaders.dasps_anxiety_loader import DASPSAnxietyLoader as RootDASPSLoader

    assert RootApneaLoader.__name__ == MITBIHApneaLoader.__name__
    assert RootSAM40Loader.__name__ == SAM40StressLoader.__name__
    assert RootStudentLoader.__name__ == StudentStressEEGLoader.__name__
    assert RootDASPSLoader.__name__ == DASPSAnxietyLoader.__name__

    # Functional instantiation and load verification
    loader = RootApneaLoader(lookback_sec=90.0)
    assert loader.lookback_sec == 90.0
    sam_loader = RootSAM40Loader()
    assert sam_loader.fs == 128.0
