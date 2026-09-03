"""
test_pre_event_windowing.py

Unit tests for early_warning/preprocessing/pre_event_windowing.py:
- Butterworth 0.5 - 45 Hz bandpass filtering
- Z-score normalization
- 128x128 SST spectrogram extraction
- 90-second pre-event lookback window labeling logic
"""

import pytest
import numpy as np

from early_warning.preprocessing.pre_event_windowing import (
    butter_bandpass_filter,
    zscore_normalize,
    compute_sst_representation,
    extract_pre_event_windows,
    DEFAULT_APNEA_LOOKBACK_SEC
)


def test_butter_bandpass_and_zscore():
    fs = 250.0
    t = np.linspace(0, 10.0, int(10.0 * fs))
    # Mix DC offset, 10Hz alpha, and 60Hz line noise
    raw = 50.0 + 20.0 * np.sin(2 * np.pi * 10.0 * t) + 15.0 * np.sin(2 * np.pi * 60.0 * t)

    filtered = butter_bandpass_filter(raw, lowcut=0.5, highcut=45.0, fs=fs)
    norm = zscore_normalize(filtered)

    assert len(filtered) == len(raw)
    assert np.isclose(np.mean(norm), 0.0, atol=1e-4)
    assert np.isclose(np.std(norm), 1.0, atol=1e-4)


def test_sst_representation_shape_and_range():
    fs = 200.0
    t = np.linspace(0, 10.0, int(10.0 * fs))
    sig = np.sin(2 * np.pi * 12.0 * t)

    sst = compute_sst_representation(sig, fs=fs, target_shape=(128, 128))

    assert sst.shape == (128, 128, 1)
    assert sst.dtype == np.float32
    assert np.min(sst) >= 0.0
    assert np.max(sst) <= 1.0


def test_lookback_windowing_label_assignment():
    fs = 100.0
    duration_sec = 240.0
    total_samples = int(duration_sec * fs)
    dummy_signal = np.sin(np.linspace(0, 50, total_samples))

    # Event onset at 120s
    event_onsets = [120.0]
    lookback = 90.0

    X, y, meta = extract_pre_event_windows(
        signal_data=dummy_signal,
        fs=fs,
        event_onsets_sec=event_onsets,
        lookback_sec=lookback,
        window_sec=10.0,
        step_sec=5.0
    )

    assert len(X) > 0
    assert len(X) == len(y) == len(meta)

    # Check that any window ending between [120 - 90, 120] is labeled 1
    for label, m in zip(y, meta):
        center = (m["start_sec"] + m["end_sec"]) / 2.0
        if (120.0 - lookback) <= center <= 120.0:
            assert label == 1, f"Window at {center}s should be labeled 1 (elevated pre-event risk)"
        elif abs(center - 120.0) > lookback:
            assert label == 0, f"Window at {center}s should be labeled 0 (baseline)"
