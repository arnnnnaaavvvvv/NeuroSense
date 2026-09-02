from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.database import get_db
from app.rag.retrieval import retrieve_guidelines_for_stage, format_guidance_response

router = APIRouter(tags=["Precautions"])


class CitationItem(BaseModel):
    source_org: str
    document_title: str
    section_title: Optional[str]
    page_number: Optional[int]
    citation_reference: str


class PrecautionResponse(BaseModel):
    risk_stage: str
    guidance_text: str
    source_citation: str
    citations: List[CitationItem]
    medical_disclaimer: str


class PrecautionRetrieveRequest(BaseModel):
    case_id: Optional[str] = None
    segment_id: Optional[int] = None
    risk_stage: str
    session_id: Optional[str] = "demo_session"


@router.get("/precautions/{stage}", response_model=PrecautionResponse)
def get_precautions_by_stage(
    stage: str,
    top_k: int = Query(default=2, ge=1, le=5),
    session_id: Optional[str] = Query(default="demo_session"),
    db: Session = Depends(get_db)
):
    """
    Retrieves clinical precaution guidelines matching the specified risk stage
    (e.g., 'ictal', 'pre-ictal', 'baseline') from the vector knowledge base,
    formats them via a strict non-hallucinatory prompt, and returns verified citations.
    """
    guidelines = retrieve_guidelines_for_stage(db, risk_stage=stage, top_k=top_k)
    response_data = format_guidance_response(
        guideline_docs=guidelines,
        risk_stage=stage,
        session_id=session_id,
        db=db
    )
    return response_data


@router.post("/guidelines/retrieve", response_model=PrecautionResponse)
def retrieve_guidelines(
    payload: PrecautionRetrieveRequest,
    db: Session = Depends(get_db)
):
    """
    Alternative POST endpoint matching the architecture contract.
    """
    guidelines = retrieve_guidelines_for_stage(db, risk_stage=payload.risk_stage, top_k=2)
    response_data = format_guidance_response(
        guideline_docs=guidelines,
        risk_stage=payload.risk_stage,
        session_id=payload.session_id,
        db=db
    )
    return response_data
