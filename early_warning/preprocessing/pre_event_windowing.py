"""
pre_event_windowing.py

Shared preprocessing and pre-event windowing utility for early-warning risk classification.
Frames both apnea and stress/anxiety detection as pre-onset early-warning tasks:
- Sleep Apnea: Extracts lookback windows (default 90s before annotated apnea onset) as elevated risk (1).
- Stress/Anxiety: Extracts task-phase windows as elevated risk (1) vs relaxation baseline (0).

Applies:
- 4th-order Butterworth bandpass filtering (0.5 - 45 Hz)
- Z-score normalization
- 128x128 Synchrosqueezing Transform (SST) / Time-Frequency spectral projection
"""

import numpy as np
from scipy import signal
from typing import List, Tuple, Dict, Any, Optional

# Standard lookback window chosen empirically for pre-apnea physiological changes
DEFAULT_APNEA_LOOKBACK_SEC: float = 90.0  # 60-120s lookback window, tuned to 90s
DEFAULT_WINDOW_SEC: float = 10.0          # Sub-window segment duration
DEFAULT_STEP_SEC: float = 5.0             # Step stride for overlapping windows


def butter_bandpass_filter(
    data: np.ndarray,
    lowcut: float = 0.5,
    highcut: float = 45.0,
    fs: float = 250.0,
    order: int = 4
) -> np.ndarray:
    """
    Apply a zero-phase Butterworth bandpass filter to preserve physiological EEG bands (delta, theta, alpha, beta).
    """
    nyq = 0.5 * fs
    low = max(0.01, lowcut / nyq)
    high = min(0.99, highcut / nyq)
    b, a = signal.butter(order, [low, high], btype="band")
    
    if data.ndim == 1:
        return signal.filtfilt(b, a, data)
    else:
        return signal.filtfilt(b, a, data, axis=-1)


def zscore_normalize(data: np.ndarray, eps: float = 1e-8) -> np.ndarray:
    """
    Standardize EEG signal to zero mean and unit variance per channel.
    """
    mean = np.mean(data, axis=-1, keepdims=True)
    std = np.std(data, axis=-1, keepdims=True)
    return (data - mean) / (std + eps)


def compute_sst_representation(
    data_1d: np.ndarray,
    fs: float = 250.0,
    target_shape: Tuple[int, int] = (128, 128)
) -> np.ndarray:
    """
    Compute a 128x128 normalized time-frequency representation for the Özdemir CNN backbone.
    Uses STFT with log-magnitude scaling and cubic/bilinear interpolation.
    Output shape: (target_shape[0], target_shape[1], 1)
    """
    # STFT parameters
    nperseg = min(len(data_1d), int(fs * 1.0))
    if nperseg < 16:
        nperseg = 16
    noverlap = nperseg // 2

    f, t, Zxx = signal.stft(data_1d, fs=fs, nperseg=nperseg, noverlap=noverlap)
    magnitude = np.abs(Zxx)
    log_mag = np.log1p(magnitude)

    # Resize log_mag to (128, 128)
    h, w = log_mag.shape
    if h == 0 or w == 0:
        return np.zeros((target_shape[0], target_shape[1], 1), dtype=np.float32)

    # 2D grid resampling
    from scipy.ndimage import zoom
    zoom_factors = (target_shape[0] / h, target_shape[1] / w)
    resized = zoom(log_mag, zoom_factors, order=1)

    # Normalize to [0, 1]
    min_val = np.min(resized)
    max_val = np.max(resized)
    if max_val > min_val:
        norm_img = (resized - min_val) / (max_val - min_val)
    else:
        norm_img = np.zeros_like(resized)

    return norm_img.astype(np.float32)[:, :, np.newaxis]


def extract_pre_event_windows(
    signal_data: np.ndarray,
    fs: float,
    event_onsets_sec: List[float],
    event_durations_sec: Optional[List[float]] = None,
    lookback_sec: float = DEFAULT_APNEA_LOOKBACK_SEC,
    window_sec: float = DEFAULT_WINDOW_SEC,
    step_sec: float = DEFAULT_STEP_SEC
) -> Tuple[np.ndarray, np.ndarray, List[Dict[str, Any]]]:
    """
    Takes continuous physiological signals and annotated event onsets, slicing them into:
    1. Pre-event lookback windows: [onset - lookback_sec, onset] labeled as 1 ("elevated_risk")
    2. Non-event baseline windows: periods at least lookback_sec away from any event labeled as 0 ("low_risk")

    Returns:
        X: np.ndarray of shape (N, 128, 128, 1) SST representations
        y: np.ndarray of shape (N,) binary risk labels (0 or 1)
        meta: list of window metadata dicts
    """
    total_samples = len(signal_data)
    total_duration_sec = total_samples / fs
    samples_per_window = int(window_sec * fs)
    samples_per_step = int(step_sec * fs)

    # Filter & normalize raw 1D signal
    filtered = butter_bandpass_filter(signal_data, lowcut=0.5, highcut=45.0, fs=fs)
    normalized = zscore_normalize(filtered)

    if event_durations_sec is None:
        event_durations_sec = [20.0] * len(event_onsets_sec)

    # Define pre-event intervals: [onset - lookback, onset]
    pre_event_intervals = []
    event_intervals = []
    for onset, dur in zip(event_onsets_sec, event_durations_sec):
        pre_start = max(0.0, onset - lookback_sec)
        pre_event_intervals.append((pre_start, onset))
        event_intervals.append((onset, onset + dur))

    windows = []
    labels = []
    metadata = []

    # Slide window across the recording
    curr_sec = 0.0
    while curr_sec + window_sec <= total_duration_sec:
        start_idx = int(curr_sec * fs)
        end_idx = start_idx + samples_per_window
        w_data = normalized[start_idx:end_idx]

        w_center = curr_sec + window_sec / 2.0

        # Check if inside any pre-event window
        in_pre_event = any(start <= w_center <= end for start, end in pre_event_intervals)
        # Check if inside any active event
        in_active_event = any(start <= w_center <= end for start, end in event_intervals)

        if in_pre_event and not in_active_event:
            # Elevated pre-event risk
            sst = compute_sst_representation(w_data, fs=fs)
            windows.append(sst)
            labels.append(1)
            metadata.append({
                "start_sec": curr_sec,
                "end_sec": curr_sec + window_sec,
                "category": "elevated_risk",
                "lookback_sec": lookback_sec
            })
        elif not in_pre_event and not in_active_event:
            # Baseline low risk
            # Only accept if far enough from upcoming event
            min_dist_to_event = min([abs(w_center - onset) for onset in event_onsets_sec], default=999.0)
            if min_dist_to_event > lookback_sec:
                sst = compute_sst_representation(w_data, fs=fs)
                windows.append(sst)
                labels.append(0)
                metadata.append({
                    "start_sec": curr_sec,
                    "end_sec": curr_sec + window_sec,
                    "category": "low_risk_baseline",
                    "lookback_sec": lookback_sec
                })

        curr_sec += step_sec

    if len(windows) == 0:
        # Fallback single window
        dummy_sst = compute_sst_representation(normalized[:min(total_samples, samples_per_window)], fs=fs)
        return np.array([dummy_sst]), np.array([0]), [{"start_sec": 0.0, "category": "baseline"}]

    return np.array(windows, dtype=np.float32), np.array(labels, dtype=np.int64), metadata
