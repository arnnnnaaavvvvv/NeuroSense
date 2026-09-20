/**
 * trend-logic.ts
 * ==============
 * Multi-window rate-of-change and escalation trend detection logic.
 * Sourced strictly from real EEG benchmark recordings.
 *
 * RESEARCH GUARDRAILS & DISCLOSURE:
 * This module implements a conceptual demonstration of rate-of-change tracking.
 * It computes first-order derivative (slope) and second-order derivative (acceleration).
 * It NEVER computes, returns, or models any time-to-event estimate, countdown, or temporal forecast.
 */

import benchmarkData from "./benchmark-data.json";

export interface SequenceMetadata {
  id: string;
  title: string;
  description: string;
  same_subject: boolean;
  same_dataset: boolean;
  is_synthetic_timeline: boolean;
  source_cases: string[];
}

export interface WindowMetrics {
  case_id: string;
  window_index: int_number;
  arousal_score: number;
  beta_deviation_percent: number;
  beta_alpha_ratio: number;
  risk_stage: string;
  source_label: string;
}

type int_number = number;

export interface WindowTransition {
  from_index: number;
  to_index: number;
  delta_beta_deviation: number;
  delta_arousal: number;
  percent_rate_of_change: number;
  slope: number;
}

export type TrendState = "stable" | "rising" | "escalating" | "peak" | "declining";

export interface TrendAnalysisResult {
  sequence_id: string;
  sequence_metadata: SequenceMetadata;
  trend_state: TrendState;
  trend_title: string;
  trend_description: string;
  slope_per_window: number[];
  mean_slope: number;
  second_derivative_acceleration: number;
  transitions: WindowTransition[];
  windows: WindowMetrics[];
  demonstration_disclosure: string;
}

export const DEMO_SEQUENCES: Record<string, SequenceMetadata> = {
  sam40_sub01_escalation: {
    id: "sam40_sub01_escalation",
    title: "SAM-40 Subject 01: Rest to Cognitive Stress Transition",
    description: "Two-window sequence from the same research subject transitioning from eyes-closed resting baseline to acute mental arithmetic stress.",
    same_subject: true,
    same_dataset: true,
    is_synthetic_timeline: true,
    source_cases: [
      "sam40_sub01_relax_baseline",
      "sam40_sub01_math_stress"
    ]
  },
  dasps_s01_escalation: {
    id: "dasps_s01_escalation",
    title: "DASPS Subject 01: Rest to Anxiety Elicitation Transition",
    description: "Two-window sequence from the same research subject transitioning from resting baseline to high-anxiety emotional stimulation.",
    same_subject: true,
    same_dataset: true,
    is_synthetic_timeline: true,
    source_cases: [
      "dasps_s01_relax_baseline",
      "dasps_s01_high_anxiety"
    ]
  },
  cross_cohort_progression: {
    id: "cross_cohort_progression",
    title: "Cross-Cohort Graded Escalation Progression",
    description: "Multi-window sequence chaining real recordings across multiple research cohorts to demonstrate multi-step rate-of-change acceleration logic.",
    same_subject: false,
    same_dataset: false,
    is_synthetic_timeline: true,
    source_cases: [
      "sam40_sub01_relax_baseline",
      "student_sub11_stroop_stress",
      "sam40_sub01_math_stress",
      "dasps_s01_high_anxiety"
    ]
  },
  sam40_sub01_recovery: {
    id: "sam40_sub01_recovery",
    title: "SAM-40 Subject 01: Post-Stress Restorative Recovery",
    description: "Two-window sequence from the same research subject observing the shift from mental arithmetic stress back toward resting baseline.",
    same_subject: true,
    same_dataset: true,
    is_synthetic_timeline: true,
    source_cases: [
      "sam40_sub01_math_stress",
      "sam40_sub01_relax_baseline"
    ]
  }
};

export function getSequenceMetadata(sequenceId: string): SequenceMetadata {
  const seq = DEMO_SEQUENCES[sequenceId];
  if (!seq) {
    throw new Error(`Unknown sequence ID: ${sequenceId}`);
  }
  return seq;
}

export function listAvailableSequences(): SequenceMetadata[] {
  return Object.values(DEMO_SEQUENCES);
}

export function analyzeSequenceTrend(sequenceId: string): TrendAnalysisResult {
  const seq = getSequenceMetadata(sequenceId);
  const predictions = benchmarkData.predictions as Record<string, any>;
  const casesMap = new Map(benchmarkData.cases.map(c => [c.id, c]));

  const windows: WindowMetrics[] = [];

  seq.source_cases.forEach((caseId, idx) => {
    const pred = predictions[caseId];
    if (!pred) {
      throw new Error(`Case prediction not found for: ${caseId}`);
    }
    const caseItem = casesMap.get(caseId);

    // Extract beta deviation
    let betaDev = 0.0;
    const comps = pred.baseline_comparison || [];
    for (const comp of comps) {
      if (comp.band === "Beta") {
        betaDev = Number(comp.deviation_percent) || 0.0;
        break;
      }
    }

    const confidence = Number(pred.confidence) || 0.5;
    const riskStage = pred.risk_stage || "baseline";
    const isBaseline =
      pred.predicted_class === "baseline" ||
      pred.three_state_class === "baseline" ||
      (riskStage && riskStage.toLowerCase().includes("baseline"));
    const isStress = !isBaseline;
    const arousal = isStress 
      ? Math.round((0.5 + confidence * 0.5) * 1000) / 1000
      : Math.round((0.5 - confidence * 0.45) * 1000) / 1000;

    const bar = Number(pred.stress_metrics?.beta_alpha_ratio) || 1.0;
    const label = caseItem?.description || pred.detected_state_title || `Window ${idx + 1}`;

    windows.push({
      case_id: caseId,
      window_index: idx,
      arousal_score: arousal,
      beta_deviation_percent: Math.round(betaDev * 10) / 10,
      beta_alpha_ratio: Math.round(bar * 100) / 100,
      risk_stage: riskStage,
      source_label: label
    });
  });

  const transitions: WindowTransition[] = [];
  const slopes: number[] = [];

  for (let i = 0; i < windows.length - 1; i++) {
    const wPrev = windows[i];
    const wNext = windows[i + 1];

    const deltaBeta = Math.round((wNext.beta_deviation_percent - wPrev.beta_deviation_percent) * 10) / 10;
    const deltaArousal = Math.round((wNext.arousal_score - wPrev.arousal_score) * 1000) / 1000;
    const refBase = Math.max(Math.abs(wPrev.beta_deviation_percent), 15.0);
    const pctChange = Math.round((deltaBeta / refBase) * 1000) / 10;
    const slope = deltaBeta;

    slopes.push(slope);
    transitions.push({
      from_index: wPrev.window_index,
      to_index: wNext.window_index,
      delta_beta_deviation: deltaBeta,
      delta_arousal: deltaArousal,
      percent_rate_of_change: pctChange,
      slope: slope
    });
  }

  const meanSlope = slopes.length > 0
    ? Math.round((slopes.reduce((acc, v) => acc + v, 0) / slopes.length) * 10) / 10
    : 0.0;

  const acceleration = slopes.length >= 2
    ? Math.round((slopes[slopes.length - 1] - slopes[slopes.length - 2]) * 10) / 10
    : 0.0;

  const lastWindow = windows[windows.length - 1];
  const lastSlope = slopes[slopes.length - 1] ?? 0.0;

  let trendState: TrendState = "stable";
  let trendTitle = "Stable Neurometric Trend";
  let trendDescription = `Stable trajectory across windows with minimal rate of change (mean slope ${meanSlope > 0 ? "+" : ""}${meanSlope.toFixed(1)}%).`;

  if (meanSlope <= -8.0) {
    trendState = "declining";
    trendTitle = "Declining Arousal / Restorative Trend";
    trendDescription = `Negative rate of change (mean slope ${meanSlope > 0 ? "+" : ""}${meanSlope.toFixed(1)}%). High-frequency beta power is decreasing window-over-window toward resting levels.`;
  } else if (lastWindow.arousal_score >= 0.75 && Math.abs(lastSlope) <= 6.0) {
    trendState = "peak";
    trendTitle = "Peak Arousal Plateau";
    trendDescription = `Elevated arousal with plateaued slope (last transition ${lastSlope > 0 ? "+" : ""}${lastSlope.toFixed(1)}%). System is sustaining high arousal with stabilized rate of change.`;
  } else if ((slopes.length >= 2 && lastSlope > 8.0 && acceleration > 0.0) || (slopes.length === 1 && lastSlope >= 30.0)) {
    trendState = "escalating";
    trendTitle = "Escalating Trend (Accelerating Rate of Change)";
    trendDescription = `Active escalation pattern: rising slope (${lastSlope > 0 ? "+" : ""}${lastSlope.toFixed(1)}%) with positive rate-of-change acceleration (${acceleration > 0 ? "+" : ""}${acceleration.toFixed(1)}%). Demonstrates early escalation trajectory across sequenced windows.`;
  } else if (meanSlope > 5.0) {
    trendState = "rising";
    trendTitle = "Rising Arousal Trend";
    trendDescription = `Positive rate of change (mean slope ${meanSlope > 0 ? "+" : ""}${meanSlope.toFixed(1)}%). Beta elevation indicates steady upward arousal shift across windows.`;
  }

  const subjectDisclosurePart = seq.same_subject
    ? "From the same research subject."
    : "Spans different subjects/sessions — not a real continuous recording.";

  const demonstrationDisclosure = `Demonstration sequence — chained from ${seq.source_cases.length} separate recordings to illustrate trend-detection logic. ${subjectDisclosurePart} This is not a validated prediction of a real anxiety attack and gives no time-to-event estimate.`;

  return {
    sequence_id: sequenceId,
    sequence_metadata: seq,
    trend_state: trendState,
    trend_title: trendTitle,
    trend_description: trendDescription,
    slope_per_window: slopes,
    mean_slope: meanSlope,
    second_derivative_acceleration: acceleration,
    transitions: transitions,
    windows: windows,
    demonstration_disclosure: demonstrationDisclosure
  };
}
