/**
 * Display, layout, and rendering configuration constants for EEG oscilloscope,
 * STFT spectrogram, and temporal trajectory displays.
 */

export const SIGNAL_DISPLAY_CONFIG = {
  AMPLITUDE_RANGE_UV: 100.0,
  DEFAULT_SAMPLING_RATE_HZ: 128,
  CANVAS_WIDTH: 720,
  CANVAS_HEIGHT: 240,
  STFT_TENSOR_DIM: 128,
  DEFAULT_DURATION_SEC: 10.0,
  PLAYBACK_SPEEDS: [0.5, 1.0, 2.0, 4.0] as const,
  SPECTROGRAM_COLORMAP: {
    DARK_THRESHOLD: 0.05,
    MID_THRESHOLD: 0.55,
  },
  CRANIAL_EMG_SCREEN: {
    BAND_HZ: "30.0–48.0 Hz",
    POWER_THRESHOLD_UV2: 5.0,
    RATIO_THRESHOLD: 0.10,
  }
} as const;

export const DEFAULT_STRESS_METRICS = {
  frontal_alpha_asymmetry: -0.22,
  beta_alpha_ratio: 1.65,
  fm_theta_power_percent: 24.5,
  stress_index_percent: 78.4,
  cognitive_workload_indicator: "Elevated" as const,
  anxiety_indicator: "Insufficient evidence from single-modality EEG / requires multimodal telemetry" as const
};
