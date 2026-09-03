import json
import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.database import get_db
from app.db.models import Case, Prediction
from app.core.config import settings

logger = logging.getLogger("neurosense.routers.analyze")
router = APIRouter(tags=["Analysis"])

# Optional Redis connection with graceful fallback
_redis_client = None
try:
    import redis
    _redis_client = redis.Redis.from_url(settings.REDIS_URL, socket_timeout=2.0, decode_responses=True)
    _redis_client.ping()
    logger.info("Connected to Redis cache for analysis lookups.")
except Exception as e:
    logger.warning(f"Redis unavailable ({e}). Falling back directly to indexed PostgreSQL/SQLite lookups.")
    _redis_client = None


class TimeWindow(BaseModel):
    start_seconds: float
    end_seconds: float
    duration_seconds: float


class SignalAssets(BaseModel):
    sst_image_url: str
    raw_waveform_url: str


class ClassificationSummary(BaseModel):
    binary_class: str
    risk_stage: str
    confidence: float
    model_name: str
    provenance: str
    domain: Optional[str] = "epilepsy"
    sleep_stage: Optional[str] = None
    sleep_metrics: Optional[dict] = None


class AnalysisResponse(BaseModel):
    case_id: str
    segment_id: int
    patient_anon_id: str
    description: Optional[str]
    domain: Optional[str] = "epilepsy"
    dataset_source: Optional[str] = "chbmit"
    montage_channel: Optional[str] = None
    time_window: TimeWindow
    signal_assets: SignalAssets
    classification: ClassificationSummary
    key_markers: List[str]
    cached: bool = True


@router.get("/analyze/{case_id}", response_model=AnalysisResponse)
def get_case_analysis(
    case_id: str,
    segment_id: Optional[int] = Query(default=None, description="Segment ID index"),
    db: Session = Depends(get_db)
):
    """
    Returns the precomputed classification, 128x128 SST spectrogram link,
    waveform data, and key signal markers from PostgreSQL/Redis.

    CRITICAL SAFETY GUARANTEE:
    This endpoint reads strictly precomputed data. It NEVER invokes the ML model directly.
    """
    cache_key = f"neurosense:analysis:{case_id}:{segment_id or 0}"

    # 1. Attempt Redis Cache Lookup
    if _redis_client:
        try:
            cached_val = _redis_client.get(cache_key)
            if cached_val:
                cached_dict = json.loads(cached_val)
                cached_dict["cached"] = True
                return AnalysisResponse(**cached_dict)
        except Exception as e:
            logger.warning(f"Redis lookup failed ({e}). Proceeding with primary database query.")

    # 2. Query Database
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(
            status_code=404,
            detail=f"Case '{case_id}' not found. Only pre-selected curated cases are valid."
        )

    query = db.query(Prediction).filter(Prediction.case_id == case_id)
    if segment_id is not None:
        query = query.filter(Prediction.segment_id == segment_id)
    
    pred = query.first()
    if not pred:
        raise HTTPException(
            status_code=404,
            detail=f"No precomputed prediction record exists for case '{case_id}'."
        )

    duration = pred.end_time_seconds - pred.start_time_seconds

    # Determine provenance string based on dataset source
    provenance_map = {
        "chbmit": "Özdemir & Kaya (2020) CNN / PhysioNet CHB-MIT",
        "bonn": "Bonn University Epilepsy EEG Dataset (Univariate)",
        "uci": "UCI Epileptic Seizure Recognition Benchmark (178 Features)",
        "sleep-edf": "PhysioNet Sleep-EDF Expanded / AASM 5-Class Staging"
    }
    provenance = provenance_map.get(case.dataset_source, "NeuroSense Multi-Disorder Backbone")

    response_data = AnalysisResponse(
        case_id=case.id,
        segment_id=pred.segment_id,
        patient_anon_id=case.patient_anon_id,
        description=case.description,
        domain=case.domain or "epilepsy",
        dataset_source=case.dataset_source or "chbmit",
        montage_channel=case.montage_channel,
        time_window=TimeWindow(
            start_seconds=pred.start_time_seconds,
            end_seconds=pred.end_time_seconds,
            duration_seconds=round(duration, 2)
        ),
        signal_assets=SignalAssets(
            sst_image_url=pred.sst_image_path,
            raw_waveform_url=pred.raw_signal_path
        ),
        classification=ClassificationSummary(
            binary_class=pred.predicted_class,
            risk_stage=pred.risk_stage,
            confidence=round(pred.confidence_score, 4),
            model_name=pred.model_version,
            provenance=provenance,
            domain=case.domain or "epilepsy",
            sleep_stage=pred.sleep_stage,
            sleep_metrics=pred.sleep_metrics
        ),
        key_markers=pred.key_markers or [],
        cached=False
    )

    # 3. Populate Redis Cache on Miss (TTL: 24 hours)
    if _redis_client:
        try:
            _redis_client.setex(cache_key, 86400, response_data.model_dump_json())
        except Exception as e:
            logger.warning(f"Failed to set Redis cache: {e}")

    return response_data
