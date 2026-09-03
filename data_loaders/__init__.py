"""
Root data_loaders re-export package for NeuroSense Early-Warning Module.
"""

import sys
import os

# Ensure early_warning package is in path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from early_warning.data_loaders import (
    MITBIHApneaLoader,
    load_mitbih_apnea,
    SAM40StressLoader,
    load_sam40_stress,
    StudentStressEEGLoader,
    load_student_stress,
    DASPSAnxietyLoader,
    load_dasps_anxiety
)

__all__ = [
    "MITBIHApneaLoader",
    "load_mitbih_apnea",
    "SAM40StressLoader",
    "load_sam40_stress",
    "StudentStressEEGLoader",
    "load_student_stress",
    "DASPSAnxietyLoader",
    "load_dasps_anxiety"
]
