export interface SessionProvenance {
  dataset_name: string;
  subject_id: string;
  task: string;
  condition: string;
  window_length_sec: number;
  sampling_rate_hz: number;
  channels_recorded: string;
  cohort_type: string;
}

export interface SignalQualityDetail {
  overall_score: number;
  quality_grade: "Optimal" | "Acceptable" | "Degraded";
  electrode_contact: string;
  ocular_artifact: string;
  cranial_emg_artifact: string;
  motion_artifact: string;
  mains_noise_50hz: string;
  gating_verdict: string;
}

export interface PersonalBaselineBandComparison {
  band: "Delta" | "Theta" | "Alpha" | "Beta" | "Gamma";
  range_hz: string;
  resting_baseline_rel_percent: number;
  current_session_rel_percent: number;
  deviation_percent: number;
  direction: "elevated" | "suppressed" | "nominal";
  analytic_significance: string;
}

export interface NumericalBandPower {
  band: "Delta" | "Theta" | "Alpha" | "Beta" | "Gamma";
  range_hz: string;
  abs_power_uv2: number;
  rel_power_percent: number;
}

export interface TemporalTrajectoryPoint {
  time_sec: number;
  phase: "Baseline" | "Rising Arousal" | "Peak Arousal" | "Recovery / Sustained";
  arousal_index: number;
  note: string;
}

export interface ModelValidationMetrics {
  evaluation_protocol: string;
  script_source: string;
  accuracy: number;
  sensitivity: number;
  specificity: number;
  precision: number;
  f1_macro: number;
  auroc: number;
  total_cases_evaluated: number;
  total_subjects: number;
  disclaimer: string;
}

export interface ExplainableAIReasoning {
  primary_features: string[];
  spectral_findings: string[];
  artifact_validation: string;
  temporal_stability: string;
}

export interface StructuredInterpretation {
  current_finding: string;
  evidence: string;
  interpretation: string;
  limitation: string;
}

export interface CaseItem {
  id: string;
  patient_anon_id: string;
  age_years: number | null;
  gender: string | null;
  eeg_sampling_rate_hz: number;
  total_segments: number;
  description: string | null;
  risk_stage: string;
  predicted_class: string;
  three_state_class?: "baseline" | "rising_arousal" | "high_arousal";
  domain?: string;
  dataset_source?: string;
  montage_channel?: string | null;
  sleep_stage?: string | null;
  title?: string;
  highlights?: string[];
  session_provenance?: SessionProvenance;
}

export interface TimeWindow {
  start_seconds: number;
  end_seconds: number;
  duration_seconds: number;
}

export interface SignalAssets {
  sst_image_url: string;
  raw_waveform_url: string;
}

export interface StressMetrics {
  frontal_alpha_asymmetry: number;
  beta_alpha_ratio: number;
  fm_theta_power_percent: number;
  stress_index_percent: number;
  cognitive_workload_indicator: "Nominal" | "Elevated" | "High Cognitive Friction";
  anxiety_indicator: "Insufficient evidence from single-modality EEG / requires multimodal telemetry" | "Concordant with task stimulation protocol";
}

export interface SleepMetrics {
  sleep_efficiency_percent: number;
  waso_minutes: number;
  tst_hours?: number;
  n3_slow_wave_percent?: number;
  rem_percent?: number;
  apnea_hypopnea_risk?: string;
  stage_percentages?: Record<string, number>;
}

export interface ClassificationSummary {
  binary_class: string;
  risk_stage: string;
  three_state_class: "baseline" | "rising_arousal" | "high_arousal";
  detected_state_title: string;
  confidence: number;
  model_name: string;
  provenance: string;
  session_provenance: SessionProvenance;
  domain?: string;
  sleep_stage?: string | null;
  sleep_metrics?: SleepMetrics | null;
  stress_metrics?: StressMetrics | null;
  signal_quality: SignalQualityDetail;
  baseline_comparison: PersonalBaselineBandComparison[];
  numerical_band_powers: NumericalBandPower[];
  temporal_trajectory: TemporalTrajectoryPoint[];
  model_validation: ModelValidationMetrics;
  explainable_reasoning: ExplainableAIReasoning;
  structured_interpretation: StructuredInterpretation;
}

export interface AnalysisResponse {
  case_id: string;
  segment_id: number;
  patient_anon_id: string;
  description: string | null;
  domain?: string;
  dataset_source?: string;
  montage_channel?: string | null;
  time_window: TimeWindow;
  signal_assets: SignalAssets;
  classification: ClassificationSummary;
  key_markers: string[];
  cached: boolean;
}

export interface CitationItem {
  source_org: string;
  document_title: string;
  section_title?: string;
  page_number?: number;
  citation_reference: string;
}

export interface PrecautionResponse {
  risk_stage: string;
  guidance_text: string;
  source_citation: string;
  citations: CitationItem[];
  medical_disclaimer: string;
}

export interface ChannelInfo {
  lead_name: string;
  samples: number[];
}

export interface RawWaveformData {
  case_id: string;
  sampling_rate_hz: number;
  duration_seconds: number;
  channel: string;
  samples: number[];
  channels?: Record<string, ChannelInfo>;
  domain?: string;
  dataset_source?: string;
  hypnogram?: string[];
  sleep_metrics?: SleepMetrics;
  stress_metrics?: StressMetrics;
}

export interface ClinicalAuditExportResponse {
  export_timestamp: string;
  case_id: string;
  patient_anon_id: string;
  age_years: number | null;
  gender: string | null;
  domain?: string;
  dataset_source?: string;
  montage_channel?: string | null;
  sleep_stage?: string | null;
  sleep_metrics?: SleepMetrics | null;
  stress_metrics?: StressMetrics | null;
  sampling_rate_hz: number;
  duration_seconds: number;
  time_window_start: number;
  time_window_end: number;
  evaluated_risk_stage: string;
  binary_class: string;
  confidence_score: number;
  model_version: string;
  key_markers: string[];
  sst_image_url: string;
  clinical_guidance_summary: string;
  primary_citation: string;
  citations: CitationItem[];
  medical_disclaimer: string;
}

export type CategoryFilter = "all" | "stress" | "conflict" | "anxiety" | "baseline";
