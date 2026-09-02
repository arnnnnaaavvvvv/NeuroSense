from datetime import datetime
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.database import get_db
from app.db.models import Case, Prediction
from app.rag.retrieval import retrieve_guidelines_for_stage, format_guidance_response

router = APIRouter(tags=["Export"])


class ClinicalAuditExportResponse(BaseModel):
    export_timestamp: str
    case_id: str
    patient_anon_id: str
    age_years: Optional[int]
    gender: Optional[str]
    sampling_rate_hz: int
    duration_seconds: float
    time_window_start: float
    time_window_end: float
    evaluated_risk_stage: str
    binary_class: str
    confidence_score: float
    model_version: str
    key_markers: List[str]
    sst_image_url: str
    clinical_guidance_summary: str
    primary_citation: str
    citations: List[Dict[str, Any]]
    medical_disclaimer: str


@router.get("/cases/{case_id}/export-summary", response_model=ClinicalAuditExportResponse)
def get_case_audit_export(case_id: str, db: Session = Depends(get_db)):
    """
    Generates a structured, printable clinical audit export payload
    combining precomputed EEG classification, signal markers, and verified RAG precautions.
    """
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found.")

    pred = db.query(Prediction).filter(Prediction.case_id == case_id).first()
    if not pred:
        raise HTTPException(status_code=404, detail=f"No prediction found for case '{case_id}'.")

    # Retrieve matching clinical guidelines
    guideline_docs = retrieve_guidelines_for_stage(db, risk_stage=pred.predicted_class, top_k=2)
    guidance_data = format_guidance_response(
        guideline_docs=guideline_docs,
        risk_stage=pred.risk_stage,
        session_id="export_audit",
        db=db
    )

    duration = pred.end_time_seconds - pred.start_time_seconds

    return ClinicalAuditExportResponse(
        export_timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        case_id=case.id,
        patient_anon_id=case.patient_anon_id,
        age_years=case.age_years,
        gender=case.gender,
        sampling_rate_hz=case.eeg_sampling_rate_hz,
        duration_seconds=round(duration, 2),
        time_window_start=pred.start_time_seconds,
        time_window_end=pred.end_time_seconds,
        evaluated_risk_stage=pred.risk_stage,
        binary_class=pred.predicted_class,
        confidence_score=round(pred.confidence_score, 4),
        model_version=pred.model_version,
        key_markers=pred.key_markers or [],
        sst_image_url=pred.sst_image_path,
        clinical_guidance_summary=guidance_data["guidance_text"],
        primary_citation=guidance_data["source_citation"],
        citations=guidance_data["citations"],
        medical_disclaimer=guidance_data["medical_disclaimer"]
    )
