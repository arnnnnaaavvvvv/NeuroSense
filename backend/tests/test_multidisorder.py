import pytest
from fastapi.testclient import TestClient
from app.main import app
from scripts.precompute_multidisorder import run_multi_disorder_precomputation

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_multi_disorder_database():
    """Ensure multi-disorder cases and guidelines are seeded before tests."""
    run_multi_disorder_precomputation()


def test_modules_endpoint():
    response = client.get("/modules")
    assert response.status_code == 200
    modules = response.json()
    domains = [m["domain"] for m in modules]
    assert "epilepsy" in domains
    assert "sleep" in domains

    epilepsy_mod = next(m for m in modules if m["domain"] == "epilepsy")
    dataset_ids = [d["id"] for d in epilepsy_mod["datasets"]]
    assert "chbmit" in dataset_ids
    assert "bonn" in dataset_ids
    assert "uci" in dataset_ids


def test_domain_filtering():
    # Epilepsy cases
    res_epilepsy = client.get("/cases?domain=epilepsy")
    assert res_epilepsy.status_code == 200
    epilepsy_cases = res_epilepsy.json()
    assert len(epilepsy_cases) >= 12
    assert all(c["domain"] == "epilepsy" for c in epilepsy_cases)

    # Sleep cases
    res_sleep = client.get("/cases?domain=sleep")
    assert res_sleep.status_code == 200
    sleep_cases = res_sleep.json()
    assert len(sleep_cases) == 4
    assert all(c["domain"] == "sleep" for c in sleep_cases)


def test_dataset_filtering():
    res_bonn = client.get("/cases?dataset=bonn")
    assert res_bonn.status_code == 200
    assert len(res_bonn.json()) == 3

    res_uci = client.get("/cases?dataset=uci")
    assert res_uci.status_code == 200
    assert len(res_uci.json()) == 3

    res_sleep = client.get("/cases?dataset=sleep-edf")
    assert res_sleep.status_code == 200
    assert len(res_sleep.json()) == 4


def test_sleep_case_analysis():
    res = client.get("/analyze/sleep_cassette_sc4002e0")
    assert res.status_code == 200
    data = res.json()
    assert data["case_id"] == "sleep_cassette_sc4002e0"
    assert data["domain"] == "sleep"
    assert data["dataset_source"] == "sleep-edf"
    assert data["time_window"]["duration_seconds"] == 30.0
    assert data["classification"]["sleep_stage"] == "N2"
    assert "sleep_efficiency_percent" in data["classification"]["sleep_metrics"]
    assert len(data["key_markers"]) > 0


def test_sleep_guideline_precautions():
    res = client.get("/precautions/n2?domain=sleep")
    assert res.status_code == 200
    data = res.json()
    assert "guidance_text" in data
    assert len(data["citations"]) > 0
    assert any("AASM" in c["source_org"] for c in data["citations"])


def test_fast_path_uci():
    res = client.get("/demo/fast-path/uci?target_class=1")
    assert res.status_code == 200
    data = res.json()
    assert data["dataset"] == "uci"
    assert data["class_label"] == 1
    assert data["binary_class"] == "ictal"
    assert data["features_count"] == 178
    assert data["inference_time_ms"] < 50.0  # Fast pitch guarantee


def test_fast_path_bonn():
    res = client.get("/demo/fast-path/bonn?subset=ictal")
    assert res.status_code == 200
    data = res.json()
    assert data["dataset"] == "bonn"
    assert data["classification"] == "ictal"
    assert len(data["samples_preview"]) > 0
    assert data["inference_time_ms"] < 50.0


def test_benchmark_metrics():
    res = client.get("/demo/metrics")
    assert res.status_code == 200
    metrics = res.json()
    assert len(metrics) == 4
    names = [m["dataset_name"] for m in metrics]
    assert any("CHB-MIT" in n for n in names)
    assert any("Bonn" in n for n in names)
    assert any("UCI" in n for n in names)
    assert any("Sleep-EDF" in n for n in names)
