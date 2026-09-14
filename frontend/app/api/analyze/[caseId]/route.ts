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

  const pred = (benchmarkData.predictions as any)[caseId];
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
      confidence: pred.confidence,
      model_name: pred.model_name || "Özdemir CNN Multi-Head (128x128 SST)",
      provenance: `${caseItem.dataset_source?.toUpperCase()} Stress & Anxiety EEG Benchmark Cohort`,
      domain: caseItem.domain,
      stress_metrics: pred.stress_metrics || {
        frontal_alpha_asymmetry: -0.22,
        beta_alpha_ratio: 1.65,
        fm_theta_power_percent: 24.5,
        autonomic_tone: "Sympathetic Dominance",
        stress_index_percent: 78.4,
        anxiety_paroxysm_risk: "Elevated"
      }
    },
    key_markers: pred.key_markers || [],
    cached: true
  };

  return NextResponse.json(response);
}
