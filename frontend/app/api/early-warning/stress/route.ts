import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const scenario = searchParams.get("scenario") || "elevated_risk";
  const isElevated = scenario === "elevated_risk";

  return NextResponse.json({
    task: "stress_anxiety",
    scenario: scenario,
    risk_stage: isElevated ? "elevated_risk" : "baseline",
    predicted_class: isElevated ? 1 : 0,
    confidence: isElevated ? 0.990 : 0.975,
    head_used: "stress_anxiety_risk_head",
    inference_time_ms: 0.08,
    dataset: "SAM-40 EEG Stress / Student EEG Dataset (Mean age 21.5)",
    key_markers: isElevated ? [
      "Frontal alpha desynchronization (alpha blocking)",
      "Elevated 20-30 Hz beta power during cognitive load",
      "Increased frontal midline theta workload index"
    ] : [
      "Synchronized posterior alpha rhythm (10 Hz)",
      "Low beta agitation ratio",
      "Resting state parasympathetic stabilization"
    ],
    guideline_title: isElevated
      ? "APA & NICE CG113 Protocol: Acute Student Stress / State Anxiety Intervention"
      : "APA Student Wellness Standards: Baseline Cognitive Resilience & Study Hygiene",
    source_citation: isElevated
      ? "APA Stress in Higher Education Guidelines & NICE Clinical Guideline CG113"
      : "American Psychological Association (APA) Mind-Body Health Framework",
    recommended_action: isElevated
      ? "Execute 5-4-3-2-1 sensory grounding exercise and complete 4 cycles of 4-7-8 diaphragmatic breathing"
      : "Use structured study pacing (25-minute Pomodoro blocks) and digital sunset before sleep",
    medical_disclaimer: "RESEARCH PROTOTYPE ONLY: NeuroSense is an experimental research demonstration and is NOT a diagnostic medical device."
  });
}
