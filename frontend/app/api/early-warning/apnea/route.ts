import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const scenario = searchParams.get("scenario") || "elevated_risk";
  const isElevated = scenario === "elevated_risk";

  return NextResponse.json({
    task: "apnea",
    scenario: scenario,
    risk_stage: isElevated ? "elevated_risk" : "low_risk",
    predicted_class: isElevated ? 1 : 0,
    confidence: isElevated ? 0.969 : 0.982,
    head_used: "apnea_risk_head",
    lookback_window_sec: 90,
    inference_time_ms: 0.14,
    dataset: "MIT-BIH Polysomnographic Database (slpdb, 16 subjects)",
    key_markers: isElevated ? [
      "Pre-apnea respiratory effort variance",
      "Progressive delta/theta spectral slowing",
      "Autonomic micro-arousal fast transients"
    ] : [
      "Stable resting respiratory rhythm",
      "Normal baseline delta/alpha balance",
      "Absence of autonomic slowing"
    ],
    guideline_title: isElevated
      ? "AASM & NICE Clinical Protocol: Elevated Pre-Apnea Risk & Nocturnal Hypoxia Mitigation"
      : "AASM Sleep Hygiene Protocol: Stable Airway & Restorative Sleep Maintenance",
    source_citation: isElevated
      ? "AASM (Kapur et al., J Clin Sleep Med, 13(3):479-504) & NICE NG148"
      : "American Academy of Sleep Medicine (AASM) Healthy Sleep Standards",
    recommended_action: isElevated
      ? "Adopt lateral (side) sleeping position immediately; consult sleep specialist for diagnostic PSG"
      : "Maintain 7-9 hours of consistent nocturnal rest in cool, quiet environment",
    medical_disclaimer: "RESEARCH PROTOTYPE ONLY: NeuroSense is an experimental research demonstration and is NOT a diagnostic medical device."
  });
}
