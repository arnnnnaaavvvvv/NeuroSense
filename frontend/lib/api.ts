import { 
  CaseItem, 
  AnalysisResponse, 
  PrecautionResponse, 
  RawWaveformData, 
  ClinicalAuditExportResponse
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") || "/api";

export async function fetchCases(domain?: string, dataset?: string): Promise<CaseItem[]> {
  const params = new URLSearchParams();
  if (domain) params.append("domain", domain);
  if (dataset) params.append("dataset", dataset);
  const queryString = params.toString() ? `?${params.toString()}` : "";

  const res = await fetch(`${API_BASE}/cases${queryString}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch benchmark cases: ${res.statusText}`);
  }
  return await res.json();
}

export async function fetchAnalysis(caseId: string): Promise<AnalysisResponse> {
  const res = await fetch(`${API_BASE}/analyze/${caseId}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch case analysis for '${caseId}': ${res.statusText}`);
  }
  return await res.json();
}

export async function fetchPrecautions(stage: string, domain?: string): Promise<PrecautionResponse> {
  const params = new URLSearchParams();
  if (domain) params.append("domain", domain);
  const queryString = params.toString() ? `?${params.toString()}` : "";

  const res = await fetch(`${API_BASE}/precautions/${encodeURIComponent(stage)}${queryString}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch clinical precautions for '${stage}': ${res.statusText}`);
  }
  return await res.json();
}

export async function fetchWaveformData(rawUrl: string): Promise<RawWaveformData> {
  let url = rawUrl;
  if (rawUrl.startsWith("http")) {
    url = rawUrl;
  } else if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    url = `${process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/$/, "")}${rawUrl}`;
  } else {
    url = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
  }

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch raw EEG waveform data from '${url}'`);
  }
  return await res.json();
}

export async function fetchClinicalAuditExport(caseId: string): Promise<ClinicalAuditExportResponse> {
  const res = await fetch(`${API_BASE}/cases/${caseId}/export-summary`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch clinical audit export for '${caseId}'`);
  }
  return await res.json();
}
