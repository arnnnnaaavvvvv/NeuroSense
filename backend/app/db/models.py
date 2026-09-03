import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Case(Base):
    __tablename__ = "cases"

    id = Column(String(64), primary_key=True, index=True)
    patient_anon_id = Column(String(32), nullable=False)
    age_years = Column(Integer, nullable=True)
    gender = Column(String(10), nullable=True)
    eeg_sampling_rate_hz = Column(Integer, default=256, nullable=False)
    total_segments = Column(Integer, default=1, nullable=False)
    description = Column(Text, nullable=True)
    domain = Column(String(32), default="epilepsy", nullable=False)
    dataset_source = Column(String(32), default="chbmit", nullable=False)
    montage_channel = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    predictions = relationship("Prediction", back_populates="case", cascade="all, delete-orphan")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String(64), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False, index=True)
    segment_id = Column(Integer, default=0, nullable=False)
    start_time_seconds = Column(Float, nullable=False)
    end_time_seconds = Column(Float, nullable=False)
    sst_image_path = Column(String(255), nullable=False)
    raw_signal_path = Column(String(255), nullable=False)
    predicted_class = Column(String(32), nullable=False)
    risk_stage = Column(String(32), nullable=False)
    confidence_score = Column(Float, nullable=False)
    model_version = Column(String(32), default="m32.h5", nullable=False)
    key_markers = Column(JSON, nullable=True)
    domain = Column(String(32), default="epilepsy", nullable=True)
    sleep_stage = Column(String(32), nullable=True)
    sleep_metrics = Column(JSON, nullable=True)
    secondary_metrics = Column(JSON, nullable=True)
    precomputed_at = Column(DateTime, default=datetime.utcnow)

    case = relationship("Case", back_populates="predictions")


class GuidelineDocument(Base):
    __tablename__ = "guideline_documents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    domain = Column(String(32), default="epilepsy", nullable=False)
    source_org = Column(String(64), nullable=False)
    document_title = Column(String(255), nullable=False)
    section_title = Column(String(255), nullable=True)
    chunk_content = Column(Text, nullable=False)
    risk_stage_tag = Column(String(32), nullable=False, index=True)
    embedding = Column(JSON, nullable=True)  # Stored as vector float array
    page_number = Column(Integer, nullable=True)
    citation_reference = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class AuditLog(Base):
    __tablename__ = "audit_log"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(64), nullable=False, index=True)
    case_id = Column(String(64), nullable=True)
    segment_id = Column(Integer, nullable=True)
    requested_action = Column(String(64), nullable=False)
    retrieved_chunk_ids = Column(JSON, nullable=True)
    llm_prompt = Column(Text, nullable=True)
    llm_response = Column(Text, nullable=True)
    client_ip_hash = Column(String(64), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
