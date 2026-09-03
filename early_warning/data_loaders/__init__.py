"""
data_loaders package for NeuroSense Early-Warning Module.
Exposes common load interface across:
- MIT-BIH Polysomnographic Database (mitbih_apnea_loader)
- SAM-40 EEG Stress Dataset (sam40_stress_loader)
- Student EEG Stress Dataset (student_stress_eeg_loader)
- DASPS Anxiety Dataset (dasps_anxiety_loader)
"""

from .mitbih_apnea_loader import MITBIHApneaLoader, load as load_mitbih_apnea
from .sam40_stress_loader import SAM40StressLoader, load as load_sam40_stress
from .student_stress_eeg_loader import StudentStressEEGLoader, load as load_student_stress
from .dasps_anxiety_loader import DASPSAnxietyLoader, load as load_dasps_anxiety

__all__ = [
    "MITBIHApneaLoader",
    "load_mitbih_apnea",
    "SAM40StressLoader",
    "load_sam40_stress",
    "StudentStressEEGLoader",
    "load_student_stress",
    "DASPSAnxietyLoader",
    "load_dasps_anxiety",
]
