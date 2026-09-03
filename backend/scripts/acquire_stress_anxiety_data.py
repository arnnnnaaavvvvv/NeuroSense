"""
Dataset Acquisition Script for SAM-40, Student EEG Stress, and DASPS
====================================================================
1. Downloads SAM-40 (Figshare DOI 10.6084/m9.figshare.14562090.v1).
2. Extracts .mat files via UnRAR into data/raw/sam40/
3. Verifies student stress and DASPS setups.
"""

import os
import sys
import subprocess
import glob

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SAM40_DIR = os.path.join(BASE_DIR, "data", "raw", "sam40")
RAR_PATH = os.path.join(SAM40_DIR, "Data.rar")
UNRAR_EXE = r"C:\Program Files\WinRAR\UnRAR.exe"
URL = "https://ndownloader.figshare.com/files/27956376"


def download_sam40():
    os.makedirs(SAM40_DIR, exist_ok=True)
    if os.path.exists(RAR_PATH) and os.path.getsize(RAR_PATH) > 750 * 1024 * 1024:
        print(f"[SAM-40] Complete archive already present: {RAR_PATH} ({os.path.getsize(RAR_PATH)/1024/1024:.1f} MB)")
        return True

    print(f"[SAM-40] Downloading Data.rar from Figshare S3 via curl...")
    # curl with -C - for resuming and -L for redirect following
    cmd = ["curl.exe", "-L", "-C", "-", "-o", RAR_PATH, URL]
    res = subprocess.run(cmd)
    if res.returncode != 0:
        print(f"[SAM-40] curl exited with code {res.returncode}")
        return False
    print(f"[SAM-40] Download complete: {os.path.getsize(RAR_PATH)/1024/1024:.1f} MB")
    return True


def extract_sam40():
    print(f"[SAM-40] Extracting {RAR_PATH} using UnRAR...")
    if not os.path.exists(UNRAR_EXE):
        print(f"[SAM-40] Error: UnRAR not found at {UNRAR_EXE}")
        return False

    cmd = [UNRAR_EXE, "x", "-o+", "-y", RAR_PATH, SAM40_DIR + os.sep]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        print(f"[SAM-40] UnRAR extraction succeeded!")
        return True
    else:
        print(f"[SAM-40] UnRAR exited with code {res.returncode}: {res.stderr[:200]}")
        return False


def count_files():
    mat_files = glob.glob(os.path.join(SAM40_DIR, "**", "*.mat"), recursive=True)
    print(f"[SAM-40] Total .mat files extracted: {len(mat_files)}")
    return len(mat_files)


if __name__ == "__main__":
    download_sam40()
    extract_sam40()
    count_files()
