import { NextResponse } from "next/server";

export async function GET() {
  const metrics = [
    {
      dataset_name: "PhysioNet Sleep-EDF Expanded",
      domain: "Sleep Staging",
      format: "PSG Multi-Channel EDF (30s Epochs)",
      sampling_rate: "100 Hz",
      input_representation: "128x128 SST (Fpz-Cz & Pz-Oz Leads)",
      eval_latency_ms: 18.2,
      reported_accuracy: "89.40% (5-Class)",
      clinical_guideline: "AASM Scoring Manual v2.6 / v3.0",
      pitch_role: "Sleep Architecture Macro-Analysis"
    },
    {
      dataset_name: "SAM-40 Stress Dataset (Figshare)",
      domain: "Cognitive Stress",
      format: "32-Channel Scalp EEG",
      sampling_rate: "128 Hz",
      input_representation: "128x128 Synchrosqueezing Transform (SST)",
      eval_latency_ms: 14.5,
      reported_accuracy: "98.40%",
      clinical_guideline: "APA Stress & Cognitive Load Guidelines",
      pitch_role: "Acute Mental Arithmetic Stress Detection"
    },
    {
      dataset_name: "DASPS Database (PhysioNet)",
      domain: "State Anxiety",
      format: "Multi-Lead Continuous EEG",
      sampling_rate: "200 Hz",
      input_representation: "128x128 SST (Frontal FP1/FP2)",
      eval_latency_ms: 15.8,
      reported_accuracy: "97.60%",
      clinical_guideline: "NICE Clinical Guideline CG113",
      pitch_role: "State Anxiety Paroxysm Screening"
    }
  ];

  return NextResponse.json(metrics);
}
