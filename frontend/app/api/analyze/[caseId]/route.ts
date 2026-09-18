import { NextRequest, NextResponse } from "next/server";
import benchmarkData from "../../../../lib/benchmark-data.json";

export async function GET(
  request: NextRequest,
  { params }: { params: { caseId: string } }
) {
  const caseId = params.caseId;
  const caseItem = benchmarkData.cases.find((c) => c.id === caseId);

  if (!caseItem) {
    return NextResponse.json({ detail: `Case '${caseId}' not found` }, { status: 404 });
  }

  const predictions = benchmarkData.predictions as Record<string, typeof benchmarkData.predictions[keyof typeof benchmarkData.predictions]>;
  const pred = predictions[caseId];
  if (!pred) {
    return NextResponse.json({ detail: `Analysis for case '${caseId}' not found` }, { status: 404 });
  }

  const duration = (pred.end_time_seconds || 10.0) - (pred.start_time_seconds || 0.0);

  const response = {
    case_id: caseItem.id,
    segment_id: pred.segment_id || 1,
    patient_anon_id: caseItem.patient_anon_id,
    description: caseItem.description,
    domain: caseItem.domain || "stress_anxiety",
    dataset_source: caseItem.dataset_source || "sam40",
    montage_channel: caseItem.montage_channel || "Fp1-Fp2",
    time_window: {
      start_seconds: pred.start_time_seconds || 0.0,
      end_seconds: pred.end_time_seconds || 10.0,
      duration_seconds: duration
    },
    signal_assets: {
      sst_image_url: `/static/processed/${caseItem.id}_sst_128.png`,
      raw_waveform_url: `/static/processed/${caseItem.id}_raw.json`
    },
    classification: {
      binary_class: pred.predicted_class,
      risk_stage: pred.risk_stage,
      three_state_class: pred.three_state_class || (pred.predicted_class === "baseline" ? "baseline" : "high_arousal"),
      detected_state_title: pred.detected_state_title || pred.risk_stage,
      confidence: pred.confidence,
      model_name: pred.model_name || "Özdemir Conv2D CNN Backbone (128x128 STFT)",
      provenance: pred.provenance || `${caseItem.dataset_source?.toUpperCase()} Research Benchmark Cohort`,
      session_provenance: pred.session_provenance || caseItem.session_provenance,
      domain: caseItem.domain,
      stress_metrics: pred.stress_metrics,
      signal_quality: pred.signal_quality,
      baseline_comparison: pred.baseline_comparison || [],
      numerical_band_powers: pred.numerical_band_powers || [],
      temporal_trajectory: pred.temporal_trajectory || [],
      model_validation: pred.model_validation,
      explainable_reasoning: pred.explainable_reasoning,
      structured_interpretation: pred.structured_interpretation
    },
    key_markers: pred.key_markers || [],
    cached: true
  };

  return NextResponse.json(response);
}
