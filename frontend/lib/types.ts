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

export interface ClassificationSummary {
  binary_class: string;
  risk_stage: string;
  confidence: number;
  model_name: string;
  provenance: string;
}

export interface AnalysisResponse {
  case_id: string;
  segment_id: number;
  patient_anon_id: string;
  description: string | null;
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
}

export interface ClinicalAuditExportResponse {
  export_timestamp: string;
  case_id: string;
  patient_anon_id: string;
  age_years: number | null;
  gender: string | null;
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
