import { NextRequest, NextResponse } from "next/server";
import benchmarkData from "../../../lib/benchmark-data.json";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain")?.toLowerCase();
  const dataset = searchParams.get("dataset")?.toLowerCase();

  let cases = benchmarkData.cases;

  if (domain) {
    cases = cases.filter((c) => (c.domain || "sleep").toLowerCase() === domain);
  }

  if (dataset) {
    cases = cases.filter((c) => (c.dataset_source || "sleep-edf").toLowerCase() === dataset);
  }

  return NextResponse.json(cases);
}
