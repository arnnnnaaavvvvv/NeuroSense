import { NextResponse } from "next/server";

export async function GET() {
  const modules = [
    {
      domain: "epilepsy",
      title: "Epileptic Seizure Risk & Paroxysm Classification",
      description: "Clinical electrographic seizure detection, transitional pre-ictal risk stratification, and paroxysmal discharge identification across pediatric and adult EEG recordings.",
      model_backbone: "Özdemir et al. 2021 CNN Backbone + 128x128 Synchrosqueezing Transform (SST)",
      primary_guidelines: [
        "AES 2016 Status Epilepticus Protocol",
        "ILAE 2017 Operational Classification",
        "NICE NG217"
      ],
      datasets: [
        {
          id: "chbmit",
          name: "PhysioNet CHB-MIT Scalp EEG",
          source_url: "https://physionet.org/content/chbmit/1.0.0/",
          format: "Multi-lead EDF (256 Hz)",
          sampling_rate_hz: 256.0,
          use_case: "Primary Gold-Standard Seizure Benchmark (10s Multi-Montage Analysis)",
          case_count: 6
        },
        {
          id: "bonn",
          name: "Bonn University Epilepsy Dataset",
          source_url: "https://github.com/RYH2077/EEG-Epilepsy-Datasets",
          format: "Univariate Time-Series (173.61 Hz)",
          sampling_rate_hz: 173.61,
          use_case: "Fast Live-Demo Classifier (Trains in seconds, ideal for live walkthroughs)",
          case_count: 3
        },
        {
          id: "uci",
          name: "UCI Epileptic Seizure Recognition",
          source_url: "https://github.com/akshayg056/Epileptic-seizure-detection-",
          format: "Pre-flattened Tabular CSV (178 Features)",
          sampling_rate_hz: 178.0,
          use_case: "Near-Instant Tabular Pitch Benchmark (<2ms live inference)",
          case_count: 3
        }
      ]
    },
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
    }
  ];

  return NextResponse.json(modules);
}
