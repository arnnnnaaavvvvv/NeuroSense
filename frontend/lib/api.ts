import { CaseItem, AnalysisResponse, PrecautionResponse, RawWaveformData, ClinicalAuditExportResponse } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export async function fetchCases(): Promise<CaseItem[]> {
  try {
    const res = await fetch(`${API_BASE}/cases`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch cases: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error("fetchCases error:", err);
    throw err;
  }
}

export async function fetchAnalysis(caseId: string): Promise<AnalysisResponse> {
  try {
    const res = await fetch(`${API_BASE}/analyze/${caseId}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch analysis for ${caseId}: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error(`fetchAnalysis (${caseId}) error:`, err);
    throw err;
  }
}

export async function fetchPrecautions(stage: string): Promise<PrecautionResponse> {
  try {
    const res = await fetch(`${API_BASE}/precautions/${encodeURIComponent(stage)}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch precautions for ${stage}: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error(`fetchPrecautions (${stage}) error:`, err);
    throw err;
  }
}

export async function fetchWaveformData(rawUrl: string): Promise<RawWaveformData> {
  try {
    const url = rawUrl.startsWith("http") ? rawUrl : `${API_BASE}${rawUrl}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch raw waveform from ${url}`);
    return await res.json();
  } catch (err) {
    console.error("fetchWaveformData error:", err);
    throw err;
  }
}

export async function fetchClinicalAuditExport(caseId: string): Promise<ClinicalAuditExportResponse> {
  try {
    const res = await fetch(`${API_BASE}/cases/${caseId}/export-summary`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch clinical audit export for ${caseId}`);
    return await res.json();
  } catch (err) {
    console.error("fetchClinicalAuditExport error:", err);
    throw err;
  }
}
