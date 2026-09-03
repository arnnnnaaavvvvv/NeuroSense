import { NextResponse } from "next/server";

export async function GET() {
  const metrics = [
    {
      dataset_name: "PhysioNet CHB-MIT Scalp EEG",
      domain: "Epilepsy",
      format: "23-Lead Continuous EDF",
      sampling_rate: "256 Hz",
      input_representation: "128x128 Synchrosqueezing Transform (SST)",
      eval_latency_ms: 22.4,
      reported_accuracy: "99.28%",
      clinical_guideline: "AES 2016 / ILAE 2017 Protocol",
      pitch_role: "Gold Standard Clinical Validation"
    },
    {
      dataset_name: "Bonn University Epilepsy Center",
      domain: "Epilepsy",
      format: "Univariate Single-Channel",
      sampling_rate: "173.61 Hz",
      input_representation: "128x128 Synchrosqueezing Transform (SST)",
      eval_latency_ms: 6.5,
      reported_accuracy: "98.50%",
      clinical_guideline: "ILAE 2017 Operational Classification",
      pitch_role: "Fast Live-Demo Interactive Classifier"
    },
    {
      dataset_name: "UCI Epileptic Seizure Recognition",
      domain: "Epilepsy",
      format: "Pre-flattened Tabular CSV",
      sampling_rate: "178 Features/s",
      input_representation: "178-Vector Scaled Feature Matrix",
      eval_latency_ms: 1.8,
      reported_accuracy: "97.80%",
      clinical_guideline: "NICE NG217 Clinical Stratification",
      pitch_role: "Instant Pitch Benchmark (<2ms Latency)"
    },
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
    }
  ];

  return NextResponse.json(metrics);
}
