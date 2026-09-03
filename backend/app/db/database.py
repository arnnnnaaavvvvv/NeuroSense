from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.db.models import Base

# Database engine initialization
connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    """Initializes schema and tables with seamless column migrations."""
    Base.metadata.create_all(bind=engine)
    
    if settings.DATABASE_URL.startswith("sqlite"):
        with engine.connect() as conn:
            # Check cases table
            case_info = conn.exec_driver_sql("PRAGMA table_info(cases)").fetchall()
            case_cols = [r[1] for r in case_info]
            if "domain" not in case_cols:
                conn.exec_driver_sql("ALTER TABLE cases ADD COLUMN domain VARCHAR(32) DEFAULT 'epilepsy'")
            if "dataset_source" not in case_cols:
                conn.exec_driver_sql("ALTER TABLE cases ADD COLUMN dataset_source VARCHAR(32) DEFAULT 'chbmit'")
            if "montage_channel" not in case_cols:
                conn.exec_driver_sql("ALTER TABLE cases ADD COLUMN montage_channel VARCHAR(64)")

            # Check predictions table
            pred_info = conn.exec_driver_sql("PRAGMA table_info(predictions)").fetchall()
            pred_cols = [r[1] for r in pred_info]
            if "domain" not in pred_cols:
                conn.exec_driver_sql("ALTER TABLE predictions ADD COLUMN domain VARCHAR(32) DEFAULT 'epilepsy'")
            if "sleep_stage" not in pred_cols:
                conn.exec_driver_sql("ALTER TABLE predictions ADD COLUMN sleep_stage VARCHAR(32)")
            if "sleep_metrics" not in pred_cols:
                conn.exec_driver_sql("ALTER TABLE predictions ADD COLUMN sleep_metrics JSON")
            if "secondary_metrics" not in pred_cols:
                conn.exec_driver_sql("ALTER TABLE predictions ADD COLUMN secondary_metrics JSON")

            # Check guideline_documents table
            guideline_info = conn.exec_driver_sql("PRAGMA table_info(guideline_documents)").fetchall()
            guideline_cols = [r[1] for r in guideline_info]
            if "domain" not in guideline_cols:
                conn.exec_driver_sql("ALTER TABLE guideline_documents ADD COLUMN domain VARCHAR(32) DEFAULT 'epilepsy'")

            conn.commit()


def get_db():
    """Dependency for obtaining a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
