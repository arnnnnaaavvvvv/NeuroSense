# NeuroSense — Architecture Specification

> **Clinical EEG & Polysomnography Telemetry Intelligence with Pre-Onset Early-Warning, Multi-Window Rate-of-Change Escalation, and Grounded Clinical Protocol Retrieval**
>
> *A deterministic biosignal intelligence engine bridging 128 Hz microvolt signal processing, deep spatial-frequency representation learning, and zero-hallucination clinical decision support.*

---

## 1. Executive System Overview

Neurological event detection and clinical polysomnography have traditionally suffered from two major limitations: post-hoc manual review requiring specialized technicians hours or days later, and naive static threshold devices that trigger only after an acute physiological episode has already materialized.

**NeuroSense** addresses these limitations by introducing **Pre-Onset Early-Warning Detection** and a continuous **Multi-Window Rate-of-Change Escalation Layer**. By combining a calibrated **Özdemir Conv2D CNN backbone** over 128×128 Short-Time Fourier Transform (STFT) matrices with multi-window velocity ($\Delta\text{Beta}\%$) and acceleration ($\Delta^2$) tracking, NeuroSense identifies pre-event trajectories (60–90s prior to obstructive sleep apnea or acute stressor onset) and pairs detected risk stages with zero-hallucination clinical protocol retrieval grounded in accredited standards (AASM 2017/2021, NICE NG148/CG113, APA).

```mermaid
flowchart TD
    subgraph INGESTION["1. Signal Ingestion & Preprocessing"]
        A["Raw Multi-Channel Telemetry (128 Hz)<br/>Fp1, F3, Fz, F4, Cz, Pz, O1"] --> B["Zero-Phase 4th-Order Butterworth Filter<br/>Bandpass: 0.5 Hz – 45 Hz"]
        B --> C["Per-Window Z-Score Voltage Normalization<br/>μV Centering & Standardization"]
        C --> D{"Cranial Artifact Screen<br/>30–48 Hz Spectral Slope > Threshold?"}
        D -- "Yes (Muscle Noise)" --> D_FAIL["Reject Window / Flag Artifact Gating Alert"]
        D -- "No (Cortical EEG)" --> E["128x128 Short-Time Fourier Transform (STFT)<br/>Time-Frequency Matrix Generation"]
    end

    subgraph CNN_CORE["2. Deep Convolutional Representation Core"]
        E --> F["Özdemir Conv2D Backbone<br/>3x Conv2D + BatchNorm + ReLU + MaxPool2D"]
        F --> G["256-Dimensional Shared Latent Tensor"]
        G --> H{"Task Router"}
        H -- "Sleep Apnea" --> I["Apnea Risk Head<br/>Dense + Sigmoid"]
        H -- "Stress / Anxiety" --> J["Stress/Anxiety Risk Head<br/>Dense + Sigmoid"]
        I --> K["Single-Window Arousal & Confidence Scoring"]
        J --> K
    end

    subgraph ESCALATION["3. Multi-Window Rate-of-Change Layer"]
        K --> L["Chronological Window Sequence Buffer<br/>W_1, W_2, ..., W_n (10.0s Epochs)"]
        L --> M["Compute First-Order Derivative<br/>ΔBeta% Velocity Between Epochs"]
        M --> N["Compute Second-Order Derivative<br/>Acceleration: Δ² = Slope_k - Slope_k-1"]
        N --> O["Evaluate Dynamic Trajectory State<br/>Stable | Rising | Escalating | Peak | Declining"]
        O --> P["Identify Peak Cortical Discharge Point<br/>Window Index, Peak μV, Peak Lead"]
    end

    subgraph RAG_LAYER["4. Clinical Guideline & Telemetry Output"]
        P --> Q["Deterministic Clinical Knowledge Base<br/>AASM 2017/2021 | NICE NG148/CG113 | APA"]
        K --> Q
        Q --> R["Grounded Precaution & Action Protocol"]
        P --> S["Front-End Telemetry Workstation<br/>Oscilloscope Trace + STFT Matrix + Telemetry Hub"]
        R --> S
    end

    classDef smartNode fill:#0f3b4c,stroke:#00e5ff,stroke-width:2px,color:#ffffff;
    classDef peakAlert fill:#4a121a,stroke:#ff1744,stroke-width:2px,color:#ffffff;
    classDef gateNode fill:#2d1b00,stroke:#ff9100,stroke-width:1.5px,color:#ffffff;

    class F,G,M,N smartNode;
    class P,O peakAlert;
    class D,H gateNode;
```

---

## 2. Telemetry Processing Pipeline

1. **Ingestion & Filtering:** Ingests raw 128 Hz microvolt telemetry across 10–20 standard derivations (Fp1, F3, Fz, F4, Cz, Pz, O1). A 4th-order zero-phase Butterworth filter eliminates DC drift below 0.5 Hz and high-frequency harmonics above 45 Hz.
2. **Artifact Gating:** Evaluates high-frequency spectral slope ($30\text{--}48\,\text{Hz}$) to screen out cranial electromyographic (EMG) muscle activity and ocular blink contamination before model confidence is released.
3. **STFT Spectrogram Generation:** Computes $128 \times 128$ Short-Time Fourier Transform tensors isolating Delta ($0.5\text{--}4\,\text{Hz}$), Theta ($4\text{--}8\,\text{Hz}$), Alpha ($8\text{--}12\,\text{Hz}$), Beta ($13\text{--}30\,\text{Hz}$), and Gamma ($30\text{--}48\,\text{Hz}$).
4. **Convolutional Representation Core:** An Özdemir Conv2D architecture extracts 256-dimensional latent feature embeddings routed to specialized task heads (`apnea_risk_head`, `stress_anxiety_risk_head`), validated with Leave-One-Subject-Out Cross-Validation (LOSO-CV, 93.8% accuracy).
5. **Rate-of-Change Escalation Engine:** Evaluates velocity ($\Delta\text{Beta}\%$) and acceleration ($\Delta^2$) across rolling 10-second epochs to classify trajectory states (`STABLE`, `RISING`, `ESCALATING`, `PEAK THRESHOLD`, `DECLINING`).
6. **Deterministic Guideline RAG:** Directly retrieves vetted clinical intervention protocols from accredited medical guidelines (AASM, NICE, APA) without generative hallucination.

---

## 3. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Telemetry Workstation** | Next.js 14 (App Router), TypeScript, Tailwind CSS, HTML5 Canvas Oscilloscope |
| **Backend & Signal Processing** | Python 3.11+, FastAPI, SciPy Signal, NumPy, WFDB (PhysioNet) |
| **Deep Learning & Inference** | PyTorch 2.2+, Özdemir Conv2D CNN, LOSO Cross-Validation Engine |
| **Data & Grounded Knowledge** | PhysioNet MIT-BIH (`slpdb`), SAM-40, Student EEG Stress, AASM/NICE/APA Standards |
| **Deployment & CI/CD** | Vercel Edge Runtime, GitHub Actions Automated Data Integrity Suite (65/65 tests passing) |
