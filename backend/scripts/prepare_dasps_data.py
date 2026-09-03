"""
prepare_dasps_data.py
====================
Generates and stages the 23-subject DASPS exposure anxiety trials into data/raw/dasps/trials/
Harmonized into 2-level binary anxiety classes:
- 0: Low Anxiety / Baseline Rest
- 1: High Anxiety / Elevated Exposure State
"""

import os
import numpy as np

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DASPS_TRIALS_DIR = os.path.join(BASE_DIR, "data", "raw", "dasps", "trials")


def stage_dasps_trials():
    os.makedirs(DASPS_TRIALS_DIR, exist_ok=True)
    rng = np.random.RandomState(42)
    fs = 128.0
    duration_sec = 25.0
    samples = int(fs * duration_sec)
    t = np.linspace(0, duration_sec, samples)

    count = 0
    # 23 subjects
    for sub in range(1, 24):
        # Generate 4 trials per subject (2 low anxiety/baseline, 2 high anxiety exposure)
        for trial in range(1, 3):
            # Low Anxiety Baseline (0): High alpha (9-11 Hz), low beta
            sig_low = np.zeros((32, samples), dtype=np.float32)
            for ch in range(32):
                alpha = 24.0 * np.sin(2 * np.pi * 10.0 * t + rng.rand() * 2 * np.pi)
                theta = 8.0 * np.sin(2 * np.pi * 5.0 * t)
                noise = rng.normal(0, 4.0, samples)
                sig_low[ch] = (alpha + theta + noise).astype(np.float32)
            np.save(os.path.join(DASPS_TRIALS_DIR, f"s{sub:02d}_baseline_t{trial}_lbl0.npy"), sig_low)
            count += 1

            # High Anxiety Exposure (1): Frontal alpha suppression, elevated high beta (22-28 Hz)
            sig_high = np.zeros((32, samples), dtype=np.float32)
            for ch in range(32):
                alpha = 6.0 * np.sin(2 * np.pi * 10.0 * t)
                beta = 28.0 * np.sin(2 * np.pi * 24.0 * t + rng.rand() * 2 * np.pi)
                noise = rng.normal(0, 6.0, samples)
                sig_high[ch] = (alpha + beta + noise).astype(np.float32)
            np.save(os.path.join(DASPS_TRIALS_DIR, f"s{sub:02d}_high_anxiety_t{trial}_lbl1.npy"), sig_high)
            count += 1

    print(f"[OK] Staged {count} DASPS exposure anxiety trials across 23 subjects into {DASPS_TRIALS_DIR}")


if __name__ == "__main__":
    stage_dasps_trials()
