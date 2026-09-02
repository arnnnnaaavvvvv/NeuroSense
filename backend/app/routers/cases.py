from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
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

    model_config = ConfigDict(from_attributes=True)


@router.get("/cases", response_model=List[CaseListItem])
def list_curated_cases(db: Session = Depends(get_db)):
    """
    Returns the immutable list of curated PhysioNet CHB-MIT demo cases from PostgreSQL.
    No file upload is supported or permitted.
    """
    cases = db.query(Case).all()
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
            predicted_class=pred.predicted_class if pred else "Unknown"
        ))
    return results
