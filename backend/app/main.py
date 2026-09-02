import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.db.database import init_db, SessionLocal
from app.db.models import Case
from app.routers import cases, analyze, precautions, export
from app.ml.model import load_cnn_model
from app.rag.embed_guidelines import seed_guidelines

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("neurosense.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup lifecycle
    logger.info("Initializing NeuroSense Backend Service...")
    os.makedirs(settings.PROCESSED_DATA_DIR, exist_ok=True)
    
    init_db()
    
    db = SessionLocal()
    seed_guidelines(db)
    
    case_count = db.query(Case).count()
    if case_count == 0:
        logger.info("No cases found in DB. Running offline precomputation seeder...")
        try:
            from scripts.precompute_cases import run_precomputation
            run_precomputation()
        except Exception as e:
            logger.error(f"Error during auto-seeding: {e}")
    db.close()

    load_cnn_model()
    logger.info("NeuroSense backend ready.")
    
    yield
    logger.info("NeuroSense backend shutting down.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="NeuroSense: Clinical Research EEG Seizure Risk Classification & Precaution Guidance Demo",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static directory for SST spectrogram images and waveform JSONs
app.mount(
    f"{settings.STATIC_URL_PREFIX}/processed",
    StaticFiles(directory=settings.PROCESSED_DATA_DIR),
    name="processed_data"
)

# Register Routers
app.include_router(cases.router)
app.include_router(analyze.router)
app.include_router(precautions.router)
app.include_router(export.router)

app.include_router(cases.router, prefix=settings.API_V1_STR)
app.include_router(analyze.router, prefix=settings.API_V1_STR)
app.include_router(precautions.router, prefix=settings.API_V1_STR)
app.include_router(export.router, prefix=settings.API_V1_STR)


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "NeuroSense API",
        "disclaimer": "RESEARCH PROTOTYPE ONLY - NOT FOR CLINICAL DIAGNOSIS"
    }
