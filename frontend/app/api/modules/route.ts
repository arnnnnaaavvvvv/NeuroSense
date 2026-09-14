import { NextResponse } from "next/server";

export async function GET() {
  const modules = [
    {
      domain: "stress_anxiety",
      title: "Acute Cognitive Stress & State Anxiety Neural Staging",
      description: "Continuous mental workload, acute cognitive stress, and state anxiety paroxysm detection using calibrated frontal EEG rhythms (Frontal Alpha Asymmetry, Beta/Alpha power ratios, and Frontal Midline Theta).",
      model_backbone: "Özdemir CNN Multi-Head Classifier (128x128 SST Spectrograms)",
      primary_guidelines: [
        "APA Stress in Higher Education Guidelines",
        "NICE Clinical Guideline CG113 (Generalized Anxiety)",
        "AAPB Guidelines for Neurofeedback & Autonomic Regulation"
      ],
      datasets: [
        {
          id: "sam40",
          name: "SAM-40 Arithmetic Stress Dataset",
          source_url: "https://figshare.com/articles/dataset/SAM-40/123456",
          format: "Multi-Lead Scalp EEG (128 Hz, Fp1-Fp2)",
          sampling_rate_hz: 128.0,
          use_case: "Calibrated Arithmetic Speed Stress & Relaxation Baseline",
          case_count: 2
        },
        {
          id: "student_stress",
          name: "Student Stroop Cognitive Conflict Cohort",
          source_url: "https://physionet.org",
          format: "Frontal Scalp EEG (250 Hz, F3-F4)",
          sampling_rate_hz: 250.0,
          use_case: "Academic Workload & Stroop Interference Monitoring",
          case_count: 1
        },
        {
          id: "dasps",
          name: "DASPS Differential State Anxiety Database",
          source_url: "https://physionet.org",
          format: "Differential Prefrontal EEG (200 Hz, AF3-AF4)",
          sampling_rate_hz: 200.0,
          use_case: "Psychometric State Anxiety Stratification & Recovery",
          case_count: 2
        }
      ]
    }
  ];

  return NextResponse.json(modules);
}
