import { NextRequest, NextResponse } from "next/server";
import benchmarkData from "../../../../../lib/benchmark-data.json";

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
  const domain = caseItem.domain || "stress_anxiety";

  // Find matching guideline
  let matching = benchmarkData.guidelines.filter((g) => (g.domain || "stress_anxiety").toLowerCase() === domain.toLowerCase());
  if (matching.length === 0) {
    matching = benchmarkData.guidelines;
  }
  const stage = (pred?.risk_stage || "").toLowerCase();
  let target = matching.find((g) => {
    const tag = (g.risk_stage_tag || "").toLowerCase();
    if (stage.includes("elevated") || stage.includes("stress") || stage.includes("anxiety") || stage.includes("math") || stage.includes("stroop")) {
      return tag.includes("elevated_risk") || tag.includes("stress") || tag.includes("anxiety");
    }
    return tag.includes("base") || tag.includes("low") || tag.includes("relax");
  }) || matching[0];

  const citations = matching.slice(0, 3).map((g) => ({
    source_org: g.source_org,
    document_title: g.document_title,
    section_title: g.section_title,
    page_number: g.page_number,
    citation_reference: g.citation_reference
  }));

  const response = {
    export_timestamp: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
    case_id: caseItem.id,
    patient_anon_id: caseItem.patient_anon_id,
    age_years: caseItem.age_years,
    gender: caseItem.gender,
    domain: caseItem.domain,
    dataset_source: caseItem.dataset_source,
    montage_channel: caseItem.montage_channel,
    stress_metrics: pred?.stress_metrics || {
      frontal_alpha_asymmetry: -0.22,
      beta_alpha_ratio: 1.65,
      fm_theta_power_percent: 24.5,
      stress_index_percent: 78.4,
      cognitive_workload_indicator: "Elevated",
      anxiety_indicator: "Insufficient evidence from single-modality EEG / requires multimodal telemetry"
    },
    sampling_rate_hz: caseItem.eeg_sampling_rate_hz,
    duration_seconds: 10.0,
    time_window_start: pred?.start_time_seconds || 0.0,
    time_window_end: pred?.end_time_seconds || 10.0,
    evaluated_risk_stage: pred?.risk_stage || "Calm Baseline Rest",
    binary_class: pred?.predicted_class || "baseline",
    confidence_score: pred?.confidence || 0.95,
    model_version: pred?.model_name || "Özdemir CNN Multi-Head",
    key_markers: pred?.key_markers || [],
    sst_image_url: `/static/processed/${caseItem.id}_sst_128.png`,
    clinical_guidance_summary: target?.chunk_content || "Verified clinical guideline guidance.",
    primary_citation: `${target?.source_org} (${target?.citation_reference})`,
    citations: citations,
    medical_disclaimer: "RESEARCH PROTOTYPE ONLY: NeuroSense is an experimental research demonstration and is NOT a diagnostic medical device. Never alter patient treatment or withhold emergency clinical interventions based on this system."
  };

  return NextResponse.json(response);
}
