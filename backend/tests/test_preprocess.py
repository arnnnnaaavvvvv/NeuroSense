import pytest
import numpy as np
from app.ml.preprocess import compute_sst, resize_and_normalize_sst, process_eeg_segment_to_sst


def test_sst_preprocessing_shape_and_range():
    """
    Verifies that the SST pipeline transforms a 1D EEG signal segment into a normalized 128x128 2D array.
    """
    sampling_rate = 256
    duration = 10.0
    total_samples = int(sampling_rate * duration)
    
    # Synthetic EEG signal: 10 Hz alpha wave + 3 Hz delta component + noise
    t = np.linspace(0, duration, total_samples, endpoint=False)
    synthetic_eeg = 15.0 * np.sin(2 * np.pi * 10 * t) + 25.0 * np.sin(2 * np.pi * 3 * t) + np.random.normal(0, 2, total_samples)

    sst_128 = process_eeg_segment_to_sst(synthetic_eeg, sampling_rate=sampling_rate, target_size=(128, 128))

    assert sst_128.shape == (128, 128), f"Expected shape (128, 128), got {sst_128.shape}"
    assert np.min(sst_128) >= 0.0, "SST values should be non-negative"
    assert np.max(sst_128) <= 1.0, "SST values should be normalized to <= 1.0"
    assert not np.isnan(sst_128).any(), "SST output must not contain NaN"
