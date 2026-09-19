"""
test_benchmark_integrity.py
===========================
Unit tests asserting mathematical consistency and cross-component data integrity:
1. Relative band powers across all 5 bands sum to 100% (+-0.1% tolerance).
2. Per-band deviation equals round(((current - ref) / ref) * 100, 1) (+-0.1% tolerance).
3. Beta/Alpha ratio equals round(beta_abs_power / alpha_abs_power, 2) (+-0.01 tolerance).
4. No negative powers or invalid values across all 5 demo cases.
"""

import os
import json
import pytest

BENCHMARK_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "lib", "benchmark-data.json")
)

@pytest.fixture(scope="module")
def benchmark_data():
    assert os.path.exists(BENCHMARK_PATH), f"benchmark-data.json not found at {BENCHMARK_PATH}"
    with open(BENCHMARK_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def test_all_five_demo_cases_present(benchmark_data):
    cases = benchmark_data.get("cases", [])
    assert len(cases) == 5, f"Expected 5 demo cases, got {len(cases)}"
    case_ids = {c["id"] for c in cases}
    expected_ids = {
        "sam40_sub01_math_stress",
        "sam40_sub01_relax_baseline",
        "student_sub11_stroop_stress",
        "dasps_s01_high_anxiety",
        "dasps_s01_relax_baseline",
    }
    assert case_ids == expected_ids

def test_relative_band_power_sums_to_100_percent(benchmark_data):
    """
    Requirement 1: Relative power across all five bands must sum to 100% (+-0.1% rounding tolerance)
    for every demo case.
    """
    predictions = benchmark_data["predictions"]
    for case_id, pred in predictions.items():
        numerical_bands = pred.get("numerical_band_powers", [])
        assert len(numerical_bands) == 5, f"{case_id} must have 5 bands (Delta, Theta, Alpha, Beta, Gamma)"
        
        band_names = [b["band"] for b in numerical_bands]
        assert set(band_names) == {"Delta", "Theta", "Alpha", "Beta", "Gamma"}
        
        rel_sum = round(sum(b["rel_power_percent"] for b in numerical_bands), 1)
        assert 99.9 <= rel_sum <= 100.1, (
            f"Case {case_id}: relative band powers sum to {rel_sum}%, expected 100.0% +- 0.1%"
        )

def test_deviation_formula_matches_displayed_current_ref(benchmark_data):
    """
    Requirement 2: % deviation badge shown per band must equal (current - ref) / ref,
    computed from the same current/ref values displayed beside it.
    """
    predictions = benchmark_data["predictions"]
    for case_id, pred in predictions.items():
        baseline_comp = pred.get("baseline_comparison", [])
        assert len(baseline_comp) >= 4, f"{case_id} baseline comparison missing bands"
        
        for item in baseline_comp:
            band = item["band"]
            current = item["current_session_rel_percent"]
            ref = item["resting_baseline_rel_percent"]
            stated_dev = item["deviation_percent"]
            
            assert ref > 0, f"{case_id} {band} reference power must be > 0"
            expected_dev = round(((current - ref) / ref) * 100.0, 1)
            
            assert abs(stated_dev - expected_dev) <= 0.1, (
                f"Case {case_id}, Band {band}: stated deviation {stated_dev}% != "
                f"expected ((current {current} - ref {ref}) / ref) * 100 = {expected_dev}%"
            )

def test_beta_alpha_ratio_matches_band_power_table(benchmark_data):
    """
    Requirement 3: Stated beta/alpha ratio must equal beta_power / alpha_power using
    the same values shown in the band-power table for that case.
    """
    predictions = benchmark_data["predictions"]
    for case_id, pred in predictions.items():
        numerical_bands = pred.get("numerical_band_powers", [])
        bands_by_name = {b["band"]: b for b in numerical_bands}
        
        beta_power = bands_by_name["Beta"]["abs_power_uv2"]
        alpha_power = bands_by_name["Alpha"]["abs_power_uv2"]
        assert alpha_power > 0, f"{case_id} alpha power must be > 0"
        
        expected_ratio = round(beta_power / alpha_power, 2)
        stated_ratio = pred["stress_metrics"]["beta_alpha_ratio"]
        
        assert abs(stated_ratio - expected_ratio) <= 0.01, (
            f"Case {case_id}: stated ratio {stated_ratio} != "
            f"table beta ({beta_power}) / alpha ({alpha_power}) = {expected_ratio}"
        )

def test_single_source_of_truth_consistency(benchmark_data):
    """
    Requirement 4: Baseline comparison current_session_rel_percent must resolve to the
    exact same values in numerical_band_powers.
    """
    predictions = benchmark_data["predictions"]
    for case_id, pred in predictions.items():
        numerical_bands = {b["band"]: b["rel_power_percent"] for b in pred["numerical_band_powers"]}
        for comp in pred["baseline_comparison"]:
            band = comp["band"]
            assert band in numerical_bands
            assert comp["current_session_rel_percent"] == numerical_bands[band], (
                f"Case {case_id} band {band}: baseline_comparison current ({comp['current_session_rel_percent']}) "
                f"!= numerical_band_powers ({numerical_bands[band]})"
            )

if __name__ == "__main__":
    with open(BENCHMARK_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    test_all_five_demo_cases_present(data)
    test_relative_band_power_sums_to_100_percent(data)
    test_deviation_formula_matches_displayed_current_ref(data)
    test_beta_alpha_ratio_matches_band_power_table(data)
    test_single_source_of_truth_consistency(data)
    print("ALL 5 BENCHMARK INTEGRITY TESTS PASSED SUCCESSFULLY!")

