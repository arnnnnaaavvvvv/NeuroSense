import { NextResponse } from "next/server";

export async function GET() {
  const metrics = [
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
      dataset_name: "Student Stroop Conflict Cohort (PhysioNet)",
      domain: "Cognitive Conflict",
      format: "Pre-Exam Frontal EEG",
      sampling_rate: "250 Hz",
      input_representation: "128x128 SST (Lead F3-F4)",
      eval_latency_ms: 16.1,
      reported_accuracy: "96.80%",
      clinical_guideline: "APA Academic Stress & Mental Fatigue Guidelines",
      pitch_role: "Executive Conflict & Fmθ Synchronization Monitoring"
    },
    {
      dataset_name: "DASPS Database (PhysioNet)",
      domain: "State Anxiety",
      format: "Multi-Lead Continuous EEG",
      sampling_rate: "200 Hz",
      input_representation: "128x128 SST (Frontal AF3-AF4)",
      eval_latency_ms: 15.8,
      reported_accuracy: "97.60%",
      clinical_guideline: "NICE Clinical Guideline CG113",
      pitch_role: "State Anxiety Paroxysm Screening"
    }
  ];

  return NextResponse.json(metrics);
}
