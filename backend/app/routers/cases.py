from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from app.db.database import get_db
from app.db.models import Case, Prediction
from pydantic import BaseModel, ConfigDict

router = APIRouter(tags=["Cases"])


class CaseListItem(BaseModel):
    id: str
    patient_anon_id: str
    age_years: Optional[int] = None
    gender: Optional[str] = None
    eeg_sampling_rate_hz: int
    total_segments: int
    description: Optional[str] = None
    risk_stage: Optional[str] = None
    predicted_class: Optional[str] = None
    domain: Optional[str] = "epilepsy"
    dataset_source: Optional[str] = "chbmit"
    montage_channel: Optional[str] = None
    sleep_stage: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ModuleDatasetInfo(BaseModel):
    id: str
    name: str
    source_url: str
    format: str
    sampling_rate_hz: float
    use_case: str
    case_count: int


class DisorderModuleInfo(BaseModel):
    domain: str
    title: str
    description: str
    model_backbone: str
    primary_guidelines: List[str]
    datasets: List[ModuleDatasetInfo]


@router.get("/cases", response_model=List[CaseListItem])
def list_curated_cases(
    domain: Optional[str] = Query(default=None, description="Filter by clinical disorder domain: 'epilepsy' or 'sleep'"),
    dataset: Optional[str] = Query(default=None, description="Filter by benchmark dataset: 'chbmit', 'bonn', 'uci', or 'sleep-edf'"),
    db: Session = Depends(get_db)
):
    """
    Returns the list of curated multi-disorder cases from SQLite/PostgreSQL.
    Supports filtering by disorder domain and dataset benchmark source.
    """
    query = db.query(Case)
    if domain:
        query = query.filter(Case.domain == domain.lower().strip())
    if dataset:
        query = query.filter(Case.dataset_source == dataset.lower().strip())

    cases = query.all()
    results = []
    for c in cases:
        pred = db.query(Prediction).filter(Prediction.case_id == c.id).first()
        results.append(CaseListItem(
            id=c.id,
            patient_anon_id=c.patient_anon_id,
            age_years=c.age_years,
            gender=c.gender,
            eeg_sampling_rate_hz=c.eeg_sampling_rate_hz,
            total_segments=c.total_segments,
            description=c.description,
            risk_stage=pred.risk_stage if pred else "Unknown",
            predicted_class=pred.predicted_class if pred else "Unknown",
            domain=c.domain or "epilepsy",
            dataset_source=c.dataset_source or "chbmit",
            montage_channel=c.montage_channel,
            sleep_stage=pred.sleep_stage if pred else None
        ))
    return results


@router.get("/modules", response_model=List[DisorderModuleInfo])
def get_clinical_modules(db: Session = Depends(get_db)):
    """
    Returns the metadata and supported datasets for the Multi-Disorder EEG Intelligence Platform.
    """
    chb_count = db.query(Case).filter(Case.dataset_source == "chbmit").count()
    bonn_count = db.query(Case).filter(Case.dataset_source == "bonn").count()
    uci_count = db.query(Case).filter(Case.dataset_source == "uci").count()
    sleep_count = db.query(Case).filter(Case.dataset_source == "sleep-edf").count()

    return [
        DisorderModuleInfo(
            domain="epilepsy",
            title="Epileptic Seizure Risk & Paroxysm Classification",
            description=(
                "Clinical electrographic seizure detection, transitional pre-ictal risk stratification, "
                "and paroxysmal discharge identification across pediatric and adult EEG recordings."
            ),
            model_backbone="Özdemir et al. 2021 CNN Backbone + 128x128 Synchrosqueezing Transform (SST)",
            primary_guidelines=["AES 2016 Status Epilepticus Protocol", "ILAE 2017 Operational Classification", "NICE NG217"],
            datasets=[
                ModuleDatasetInfo(
                    id="chbmit",
                    name="PhysioNet CHB-MIT Scalp EEG",
                    source_url="https://physionet.org/content/chbmit/1.0.0/",
                    format="Multi-lead EDF (256 Hz)",
                    sampling_rate_hz=256.0,
                    use_case="Primary Gold-Standard Seizure Benchmark (10s Multi-Montage Analysis)",
                    case_count=chb_count
                ),
                ModuleDatasetInfo(
                    id="bonn",
                    name="Bonn University Epilepsy Dataset",
                    source_url="https://github.com/RYH2077/EEG-Epilepsy-Datasets",
                    format="Univariate Time-Series (173.61 Hz)",
                    sampling_rate_hz=173.61,
                    use_case="Fast Live-Demo Classifier (Trains in seconds, ideal for live walkthroughs)",
                    case_count=bonn_count
                ),
                ModuleDatasetInfo(
                    id="uci",
                    name="UCI Epileptic Seizure Recognition",
                    source_url="https://github.com/akshayg056/Epileptic-seizure-detection-",
                    format="Pre-flattened Tabular CSV (178 Features)",
                    sampling_rate_hz=178.0,
                    use_case="Near-Instant Tabular Pitch Benchmark (<2ms live inference)",
                    case_count=uci_count
                )
            ]
        ),
        DisorderModuleInfo(
            domain="sleep",
            title="Polysomnography Sleep Architecture & Disorder Staging",
            description=(
                "5-Class automated sleep staging (Wake, N1, N2, N3, REM) and sleep micro-architecture "
                "disorder screening (Sleep Apnea, Hypopnea, Severe Fragmentation, Chronic Insomnia WASO)."
            ),
            model_backbone="Shared Özdemir CNN Backbone + 5-Class AASM Sleep Staging Head (128x128 SST)",
            primary_guidelines=["AASM 2021 Adult Chronic Insomnia", "AASM Sleep Scoring Manual v2.6/v3.0", "AASM 2019/2021 OSA Guidelines"],
            datasets=[
                ModuleDatasetInfo(
                    id="sleep-edf",
                    name="PhysioNet Sleep-EDF Expanded",
                    source_url="https://physionet.org/content/sleep-edfx/1.0.0/",
                    format="PSG Multi-Channel EDF (100 Hz, 30s Epochs)",
                    sampling_rate_hz=100.0,
                    use_case="Primary Sleep Staging & Disorder Benchmark (Hypnogram Macro-Architecture)",
                    case_count=sleep_count
                )
            ]
        )
    ]
