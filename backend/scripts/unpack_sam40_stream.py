"""
unpack_sam40_stream.py
======================
Extracts all 960 real EEG trials (32 channels x 3200 timesteps, 128 Hz)
from the Figshare SAM-40 binary stream into data/raw/sam40/trials/
"""

import os
import sys
import zlib
import numpy as np

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SAM40_FILE = os.path.join(BASE_DIR, "data", "raw", "sam40", "Data.rar")
TRIALS_DIR = os.path.join(BASE_DIR, "data", "raw", "sam40", "trials")


def unpack_all_trials():
    os.makedirs(TRIALS_DIR, exist_ok=True)
    if not os.path.exists(SAM40_FILE):
        print(f"Error: {SAM40_FILE} does not exist.")
        return

    print(f"Scanning and extracting trials from {SAM40_FILE}...")
    file_size = os.path.getsize(SAM40_FILE)
    print(f"Archive Size: {file_size / 1024 / 1024:.1f} MB")

    trial_count = 0
    tasks = ["arithmetic", "mirror", "stroop", "relaxation"]
    # 40 subjects, 4 tasks, 6 trials = 960 trials total

    with open(SAM40_FILE, "rb") as f:
        # Skip HTML error header if present
        f.seek(0)
        chunk = f.read(1000)
        start_pos = chunk.find(b'\x0f\x00\x00\x00')
        if start_pos == -1:
            start_pos = 118 + 104
        f.seek(start_pos)

        while f.tell() < file_size:
            pos = f.tell()
            tag = f.read(8)
            if len(tag) < 8:
                break
            elem_type = int.from_bytes(tag[:4], "little")
            elem_size = int.from_bytes(tag[4:], "little")

            if elem_type != 15 or elem_size > 5 * 1024 * 1024 or elem_size <= 0:
                f.seek(pos + 1)
                continue

            data = f.read(elem_size)
            try:
                decomp = zlib.decompress(data)
                name_pos = decomp.find(b"Clean_data")
                if name_pos != -1:
                    # Data payload: 32 channels * 3200 timesteps double (8 bytes) = 819200 bytes
                    # Located at end of decompressed chunk
                    raw_floats = decomp[-819200:]
                    arr = np.frombuffer(raw_floats, dtype=np.float64).reshape((32, 3200))

                    # Map trial index to subject (1-40) and task
                    sub_id = (trial_count // 24) + 1
                    sub_trial_idx = trial_count % 24
                    task_idx = (sub_trial_idx // 6) % 4
                    task_name = tasks[task_idx]
                    label = 0 if task_name == "relaxation" else 1

                    trial_filename = f"sub{sub_id:02d}_{task_name}_t{sub_trial_idx % 6 + 1}_lbl{label}.npy"
                    out_path = os.path.join(TRIALS_DIR, trial_filename)
                    np.save(out_path, arr.astype(np.float32))

                    trial_count += 1
                    if trial_count % 80 == 0:
                        print(f"  Extracted {trial_count} trials... (Sub {sub_id:02d})")
            except Exception:
                f.seek(pos + 1)

    print(f"[OK] Successfully unpacked {trial_count} real SAM-40 trials into {TRIALS_DIR}!")
    return trial_count


if __name__ == "__main__":
    unpack_all_trials()
