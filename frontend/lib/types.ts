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
  domain?: string;
  dataset_source?: string;
  montage_channel?: string | null;
  sleep_stage?: string | null;
  title?: string;
  highlights?: string[];
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
  autonomic_tone: "Parasympathetic Dominant" | "Sympathetic Arousal" | "Acute Hyperarousal";
  stress_index_percent: number;
  anxiety_paroxysm_risk: "Low" | "Moderate" | "Elevated" | "High";
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
  confidence: number;
  model_name: string;
  provenance: string;
  domain?: string;
  sleep_stage?: string | null;
  sleep_metrics?: SleepMetrics | null;
  stress_metrics?: StressMetrics | null;
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

export interface ModuleDatasetInfo {
  id: string;
  name: string;
  source_url: string;
  format: string;
  sampling_rate_hz: number;
  use_case: string;
  case_count: number;
}

export interface DisorderModuleInfo {
  domain: string;
  title: string;
  description: string;
  model_backbone: string;
  primary_guidelines: string[];
  datasets: ModuleDatasetInfo[];
}

export interface UCIFastPathResponse {
  dataset: string;
  class_label: number;
  label_name: string;
  binary_class: string;
  confidence: number;
  features_count: number;
  features_sample: number[];
  variance: number;
  inference_time_ms: number;
  key_markers: string[];
  presentation_pitch_note: string;
}

export interface BonnFastPathResponse {
  dataset: string;
  subset: string;
  sampling_rate_hz: number;
  duration_seconds: number;
  channel: string;
  classification: string;
  risk_stage: string;
  confidence: number;
  samples_count: number;
  samples_preview: number[];
  inference_time_ms: number;
  key_markers: string[];
  presentation_pitch_note: string;
}

export interface BenchmarkMetricItem {
  dataset_name: string;
  domain: string;
  format: string;
  sampling_rate: string;
  input_representation: string;
  eval_latency_ms: number;
  reported_accuracy: string;
  clinical_guideline: string;
  pitch_role: string;
}
