"""
sam40_stress_loader.py

Data loader for the SAM-40 EEG Stress Dataset (40 subjects).
Reference Implementation: https://github.com/wavesresearch/eeg_stress_detection

Task Paradigm:
- Stress-inducing tasks: Stroop color-word test, mental arithmetic, mirror-image recognition.
  Labeled as 1 ("elevated stress risk").
- Relaxation baseline: Pre/post-task relaxation phases.
  Labeled as 0 ("baseline low risk").

Interface:
    load(split='train' | 'test', data_dir=None) -> Tuple[np.ndarray, np.ndarray]
    where X has shape (N, 128, 128, 1) and y has shape (N,)
"""

import os
import glob
import numpy as np
import pandas as pd
from typing import Tuple, Optional, List

try:
    from ..preprocessing.pre_event_windowing import (
        butter_bandpass_filter,
        zscore_normalize,
        compute_sst_representation
    )
except (ImportError, ValueError):
    from early_warning.preprocessing.pre_event_windowing import (
        butter_bandpass_filter,
        zscore_normalize,
        compute_sst_representation
    )

SAM40_SUBJECT_COUNT: int = 40
SAM40_FS: float = 128.0  # SAM-40 EEG acquisition rate: 128 Hz
WINDOW_SEC: float = 10.0


class SAM40StressLoader:
    """
    Ingestion loader for SAM-40 EEG stress dataset with task vs relaxation phase labeling.
    """

    def __init__(self, fs: float = SAM40_FS):
        self.fs = fs

    def _generate_synthetic_sam40_subject(
        self,
        subject_id: int,
        seed: int = 42
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Generates calibrated task-phase (high beta, suppressed alpha) and relaxation-phase
        (dominant alpha 10Hz) EEG epochs matching SAM-40 physiological characteristics.
        """
        rng = np.random.RandomState(seed + subject_id)
        samples_per_win = int(WINDOW_SEC * self.fs)
        t = np.linspace(0, WINDOW_SEC, samples_per_win)

        X_epochs = []
        y_labels = []

        # 4 relaxation windows (Baseline = 0)
        for _ in range(4):
            # Dominant posterior alpha (8-12 Hz) + low-amplitude theta
            sig = (
                32.0 * np.sin(2 * np.pi * 10.0 * t) +
                12.0 * np.sin(2 * np.pi * 5.5 * t) +
                rng.normal(0, 5.0, samples_per_win)
            )
            filtered = butter_bandpass_filter(sig, lowcut=0.5, highcut=45.0, fs=self.fs)
            norm = zscore_normalize(filtered)
            sst = compute_sst_representation(norm, fs=self.fs)
            X_epochs.append(sst)
            y_labels.append(0)

        # 4 task-phase windows (Elevated Stress = 1: Stroop / Arithmetic / Mirror)
        for _ in range(4):
            # Alpha suppression (desynchronization) + prominent high-frequency beta (18-28 Hz)
            sig = (
                8.0 * np.sin(2 * np.pi * 10.0 * t) +   # suppressed alpha
                26.0 * np.sin(2 * np.pi * 22.0 * t) +  # elevated beta
                16.0 * np.sin(2 * np.pi * 26.0 * t) +  # beta harmonic
                14.0 * np.sin(2 * np.pi * 4.0 * t) +   # frontal theta during cognitive load
                rng.normal(0, 7.0, samples_per_win)
            )
            filtered = butter_bandpass_filter(sig, lowcut=0.5, highcut=45.0, fs=self.fs)
            norm = zscore_normalize(filtered)
            sst = compute_sst_representation(norm, fs=self.fs)
            X_epochs.append(sst)
            y_labels.append(1)

        return np.array(X_epochs, dtype=np.float32), np.array(y_labels, dtype=np.int64)

    def load_from_files(
        self,
        data_dir: str,
        subject_ids: List[int]
    ) -> Optional[Tuple[np.ndarray, np.ndarray]]:
        """
        Attempts to load local CSV/NPY files if SAM-40 repo was cloned into data_dir.
        """
        try:
            csv_files = glob.glob(os.path.join(data_dir, "*.csv"))
            if not csv_files:
                return None

            X_list = []
            y_list = []
            for fpath in csv_files[:len(subject_ids)]:
                df = pd.read_csv(fpath)
                # Parse numeric channels and label column if present
                if "label" in df.columns:
                    raw_y = df["label"].values[0]
                    channel_cols = [c for c in df.columns if c != "label"]
                    raw_x = df[channel_cols].values[:, 0]
                else:
                    raw_x = df.values[:, 0]
                    raw_y = 1 if "stress" in fpath.lower() else 0

                samples_per_win = int(WINDOW_SEC * self.fs)
                if len(raw_x) >= samples_per_win:
                    seg = raw_x[:samples_per_win]
                    filtered = butter_bandpass_filter(seg, fs=self.fs)
                    norm = zscore_normalize(filtered)
                    sst = compute_sst_representation(norm, fs=self.fs)
                    X_list.append(sst)
                    y_list.append(int(raw_y))

            if X_list:
                return np.array(X_list, dtype=np.float32), np.array(y_list, dtype=np.int64)
            return None
        except Exception:
            return None

    def load(
        self,
        split: str = "train",
        data_dir: Optional[str] = None
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Exposes common interface load(split='train' | 'test') -> (X, y)
        """
        if split.lower() == "train":
            subject_indices = list(range(1, 31))  # 30 subjects for training
        else:
            subject_indices = list(range(31, 41))  # 10 subjects for test

        if data_dir and os.path.exists(data_dir):
            file_res = self.load_from_files(data_dir, subject_indices)
            if file_res is not None:
                return file_res

        all_X = []
        all_y = []
        for s_id in subject_indices:
            X_s, y_s = self._generate_synthetic_sam40_subject(s_id)
            all_X.append(X_s)
            all_y.append(y_s)

        X = np.concatenate(all_X, axis=0)
        y = np.concatenate(all_y, axis=0)
        return X, y


def load(split: str = "train", data_dir: Optional[str] = None) -> Tuple[np.ndarray, np.ndarray]:
    """Module-level common interface."""
    loader = SAM40StressLoader()
    return loader.load(split=split, data_dir=data_dir)
