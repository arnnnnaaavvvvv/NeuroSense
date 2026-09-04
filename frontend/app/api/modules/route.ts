import { NextResponse } from "next/server";

export async function GET() {
  const modules = [
    {
      domain: "sleep",
      title: "Polysomnography Sleep Architecture & Disorder Staging",
      description: "5-Class automated sleep staging (Wake, N1, N2, N3, REM) and sleep micro-architecture disorder screening (Sleep Apnea, Hypopnea, Severe Fragmentation, Chronic Insomnia WASO).",
      model_backbone: "Shared Özdemir CNN Backbone + 5-Class AASM Sleep Staging Head (128x128 SST)",
      primary_guidelines: [
        "AASM 2021 Adult Chronic Insomnia",
        "AASM Sleep Scoring Manual v2.6/v3.0",
        "AASM 2019/2021 OSA Guidelines"
      ],
      datasets: [
        {
          id: "sleep-edf",
          name: "PhysioNet Sleep-EDF Expanded",
          source_url: "https://physionet.org/content/sleep-edfx/1.0.0/",
          format: "PSG Multi-Channel EDF (100 Hz, 30s Epochs)",
          sampling_rate_hz: 100.0,
          use_case: "Primary Sleep Staging & Disorder Benchmark (Hypnogram Macro-Architecture)",
          case_count: 4
        }
      ]
    },
    {
      domain: "early_warning",
      title: "Early-Warning Physiological Stress & State Anxiety Detection",
      description: "Continuous mental workload, acute cognitive stress, and state anxiety detection using calibrated frontal EEG rhythms (Beta/Theta power ratios, Alpha desynchronization).",
      model_backbone: "Shared Özdemir CNN Backbone + Stress/Anxiety Multi-Head (128x128 SST)",
      primary_guidelines: [
        "APA Stress in Higher Education Guidelines",
        "NICE Clinical Guideline CG113",
        "AASM 2021 Clinical Guidelines"
      ],
      datasets: [
        {
          id: "sam40",
          name: "SAM-40 Stress Dataset",
          source_url: "https://figshare.com/articles/dataset/SAM-40/123456",
          format: "Multi-Lead Scalp EEG (128 Hz)",
          sampling_rate_hz: 128.0,
          use_case: "Calibrated Arithmetic Stress Detection",
          case_count: 2
        },
        {
          id: "student_stress",
          name: "Student Exam Stress Cohort",
          source_url: "https://physionet.org",
          format: "Pre-Exam Frontal EEG (250 Hz)",
          sampling_rate_hz: 250.0,
          use_case: "Academic & Performance Stress Monitoring",
          case_count: 1
        },
        {
          id: "dasps",
          name: "DASPS State Anxiety Database",
          source_url: "https://physionet.org",
          format: "Differential Anxiety EEG (200 Hz)",
          sampling_rate_hz: 200.0,
          use_case: "Psychometric State Anxiety Stratification",
          case_count: 2
        },
        {
          id: "slpdb",
          name: "MIT-BIH Polysomnographic Database",
          source_url: "https://physionet.org/content/slpdb/1.0.0/",
          format: "PSG EEG (250 Hz)",
          sampling_rate_hz: 250.0,
          use_case: "Pre-Apnea Airway Stability Warning",
          case_count: 1
        }
      ]
    }
  ];

  return NextResponse.json(modules);
}
