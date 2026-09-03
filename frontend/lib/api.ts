import { 
  CaseItem, 
  AnalysisResponse, 
  PrecautionResponse, 
  RawWaveformData, 
  ClinicalAuditExportResponse,
  DisorderModuleInfo,
  UCIFastPathResponse,
  BonnFastPathResponse,
  BenchmarkMetricItem
} from "./types";

function getApiBase(): string {
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/$/, "");
  }
  return "/api";
}

const API_BASE = getApiBase();

export async function fetchCases(domain?: string, dataset?: string): Promise<CaseItem[]> {
  try {
    const params = new URLSearchParams();
    if (domain) params.append("domain", domain);
    if (dataset) params.append("dataset", dataset);
    const queryString = params.toString() ? `?${params.toString()}` : "";

    const res = await fetch(`${API_BASE}/cases${queryString}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch cases: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error("fetchCases error:", err);
    throw err;
  }
}

export async function fetchModules(): Promise<DisorderModuleInfo[]> {
  try {
    const res = await fetch(`${API_BASE}/modules`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch modules: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error("fetchModules error:", err);
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

export async function fetchPrecautions(stage: string, domain?: string): Promise<PrecautionResponse> {
  try {
    const params = new URLSearchParams();
    if (domain) params.append("domain", domain);
    const queryString = params.toString() ? `?${params.toString()}` : "";

    const res = await fetch(`${API_BASE}/precautions/${encodeURIComponent(stage)}${queryString}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch precautions for ${stage}: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error(`fetchPrecautions (${stage}) error:`, err);
    throw err;
  }
}

export async function fetchWaveformData(rawUrl: string): Promise<RawWaveformData> {
  try {
    let url = rawUrl;
    if (rawUrl.startsWith("http")) {
      url = rawUrl;
    } else if (process.env.NEXT_PUBLIC_BACKEND_URL) {
      url = `${process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/$/, "")}${rawUrl}`;
    } else {
      url = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
    }

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

export async function runUciFastPath(targetClass: number = 1): Promise<UCIFastPathResponse> {
  try {
    const res = await fetch(`${API_BASE}/demo/fast-path/uci?target_class=${targetClass}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to run UCI fast path: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error("runUciFastPath error:", err);
    throw err;
  }
}

export async function runBonnFastPath(subset: string = "ictal"): Promise<BonnFastPathResponse> {
  try {
    const res = await fetch(`${API_BASE}/demo/fast-path/bonn?subset=${encodeURIComponent(subset)}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to run Bonn fast path: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error("runBonnFastPath error:", err);
    throw err;
  }
}

export async function fetchBenchmarkMetrics(): Promise<BenchmarkMetricItem[]> {
  try {
    const res = await fetch(`${API_BASE}/demo/metrics`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch benchmark metrics: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error("fetchBenchmarkMetrics error:", err);
    throw err;
  }
}
