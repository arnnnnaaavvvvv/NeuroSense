import pytest
from fastapi.testclient import TestClient
from app.main import app
from scripts.precompute_cases import run_precomputation

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_database():
    """Ensure precomputed cases and guidelines exist before running tests."""
    run_precomputation()


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_get_cases():
    response = client.get("/cases")
    assert response.status_code == 200
    cases = response.json()
    assert len(cases) == 6
    case_ids = [c["id"] for c in cases]
    assert "chb01_ictal_01" in case_ids
    assert "chb01_base_01" in case_ids


def test_get_analysis():
    response = client.get("/analyze/chb01_ictal_01")
    assert response.status_code == 200
    data = response.json()
    assert data["case_id"] == "chb01_ictal_01"
    assert data["classification"]["binary_class"] == "ictal"
    assert data["classification"]["confidence"] >= 0.90
    assert "sst_image_url" in data["signal_assets"]
    assert len(data["key_markers"]) > 0


def test_get_precautions():
    response = client.get("/precautions/ictal")
    assert response.status_code == 200
    data = response.json()
    assert data["risk_stage"] == "ictal"
    assert "guidance_text" in data
    assert len(data["citations"]) > 0
    assert "AES" in data["source_citation"] or "NICE" in data["source_citation"]


def test_export_summary():
    response = client.get("/cases/chb01_ictal_01/export-summary")
    assert response.status_code == 200
    data = response.json()
    assert data["case_id"] == "chb01_ictal_01"
    assert "export_timestamp" in data
    assert data["evaluated_risk_stage"] == "Ictal (Active Seizure / High Risk)"
    assert len(data["citations"]) > 0
    assert "RESEARCH PROTOTYPE" in data["medical_disclaimer"]
