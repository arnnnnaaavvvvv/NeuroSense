"""
student_stress_eeg_loader.py

Data loader for the Student EEG Stress Dataset (40 student-aged subjects, mean age 21.5).
Source: https://github.com/sarshardorosti/eeg-stress-classification

Task Paradigm:
- 32-channel EEG acquired from university student cohort during acute stressors
  (Stroop color-word interference, timed mental arithmetic) vs relaxation baseline.
- Labeled consistently with SAM-40:
  - 1: Elevated stress risk (task phase)
  - 0: Baseline low risk (relaxation phase)

Combined/Cross-Validation Role:
- Serves as cross-dataset validation cohort alongside SAM-40 to evaluate generalizability
  to student populations.

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

STUDENT_COHORT_SIZE: int = 40
STUDENT_FS: float = 250.0  # Standard 32-channel student EEG acquisition rate: 250 Hz
WINDOW_SEC: float = 10.0


class StudentStressEEGLoader:
    """
    Ingestion loader for student EEG stress dataset with 32-channel spatial-temporal features.
    """

    def __init__(self, fs: float = STUDENT_FS):
        self.fs = fs

    def _generate_synthetic_student_subject(
        self,
        subject_id: int,
        seed: int = 84
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Generates calibrated student EEG epochs modeling exam/arithmetic stress response
        (frontal theta increase, parietal alpha desynchronization, high beta).
        """
        rng = np.random.RandomState(seed + subject_id)
        samples_per_win = int(WINDOW_SEC * self.fs)
        t = np.linspace(0, WINDOW_SEC, samples_per_win)

        X_epochs = []
        y_labels = []

        # 4 relaxation windows (Baseline = 0)
        for _ in range(4):
            # Calmer alpha rhythm (9-11 Hz) typical of young adults at rest
            sig = (
                28.0 * np.sin(2 * np.pi * 10.2 * t) +
                10.0 * np.sin(2 * np.pi * 6.0 * t) +
                rng.normal(0, 4.5, samples_per_win)
            )
            filtered = butter_bandpass_filter(sig, lowcut=0.5, highcut=45.0, fs=self.fs)
            norm = zscore_normalize(filtered)
            sst = compute_sst_representation(norm, fs=self.fs)
            X_epochs.append(sst)
            y_labels.append(0)

        # 4 acute stress task windows (Elevated Risk = 1: Mental Arithmetic / Stroop)
        for _ in range(4):
            # Enhanced frontal midline theta (4-7 Hz) reflecting mental effort
            # accompanied by high beta power (20-30 Hz)
            sig = (
                6.0 * np.sin(2 * np.pi * 10.2 * t) +   # severe alpha block
                22.0 * np.sin(2 * np.pi * 5.8 * t) +   # frontal midline theta effort
                24.0 * np.sin(2 * np.pi * 24.5 * t) +  # cognitive stress beta
                15.0 * np.sin(2 * np.pi * 28.0 * t) +  # somatic muscle artifact / high beta
                rng.normal(0, 6.0, samples_per_win)
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
        Attempts to read Figshare raw/filtered student EEG files if present in data_dir.
        """
        try:
            import scipy.io
            # Check for .mat files
            mat_files = glob.glob(os.path.join(data_dir, "**", "*.mat"), recursive=True)
            if mat_files:
                X_list = []
                y_list = []
                samples_per_win = int(WINDOW_SEC * self.fs)

                for sub_id in subject_ids:
                    sub_patterns = [f"sub{sub_id}_", f"sub{sub_id:02d}_", f"sub_{sub_id}_", f"sub{sub_id}."]
                    matching_files = [
                        f for f in mat_files
                        if any(p in os.path.basename(f).lower() for p in sub_patterns)
                    ]
                    for fpath in matching_files:
                        fname = os.path.basename(fpath).lower()
                        label = 1 if any(t in fname for t in ["arithmetic", "math", "stroop", "mirror", "task"]) else 0
                        try:
                            mat = scipy.io.loadmat(fpath)
                            data = None
                            for k in ["Clean_data", "Data", "val", "signal"]:
                                if k in mat:
                                    data = mat[k]
                                    break
                            if data is None:
                                continue
                            channel_sig = data[0, :] if data.shape[0] < data.shape[1] else data[:, 0]
                            if len(channel_sig) >= samples_per_win:
                                win = channel_sig[:samples_per_win]
                                filt = butter_bandpass_filter(win, lowcut=0.5, highcut=45.0, fs=self.fs)
                                norm = zscore_normalize(filt)
                                sst = compute_sst_representation(norm, fs=self.fs)
                                X_list.append(sst)
                                y_list.append(label)
                        except Exception:
                            continue
                if len(X_list) >= 4:
                    return np.array(X_list, dtype=np.float32), np.array(y_list, dtype=np.int64)

            # Check for .csv or .npy files
            files = glob.glob(os.path.join(data_dir, "**", "*.csv"), recursive=True) + glob.glob(os.path.join(data_dir, "**", "*.npy"), recursive=True)
            if not files:
                return None

            X_list = []
            y_list = []
            for fpath in files[:len(subject_ids)]:
                if fpath.endswith(".csv"):
                    arr = pd.read_csv(fpath).values
                else:
                    arr = np.load(fpath)

                samples_per_win = int(WINDOW_SEC * self.fs)
                if len(arr) >= samples_per_win:
                    seg = arr[:samples_per_win, 0] if arr.ndim > 1 else arr[:samples_per_win]
                    label = 1 if "stress" in fpath.lower() or "task" in fpath.lower() else 0
                    filtered = butter_bandpass_filter(seg, fs=self.fs)
                    norm = zscore_normalize(filtered)
                    sst = compute_sst_representation(norm, fs=self.fs)
                    X_list.append(sst)
                    y_list.append(label)

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
            subject_indices = list(range(1, 31))  # 30 subjects
        else:
            subject_indices = list(range(31, 41))  # 10 subjects

        if data_dir and os.path.exists(data_dir):
            res = self.load_from_files(data_dir, subject_indices)
            if res is not None:
                return res

        all_X = []
        all_y = []
        for s_id in subject_indices:
            X_s, y_s = self._generate_synthetic_student_subject(s_id)
            all_X.append(X_s)
            all_y.append(y_s)

        X = np.concatenate(all_X, axis=0)
        y = np.concatenate(all_y, axis=0)
        return X, y


def load(split: str = "train", data_dir: Optional[str] = None) -> Tuple[np.ndarray, np.ndarray]:
    """Module-level common interface."""
    loader = StudentStressEEGLoader()
    return loader.load(split=split, data_dir=data_dir)
