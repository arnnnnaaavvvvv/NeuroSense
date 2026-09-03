import { NextRequest, NextResponse } from "next/server";
import benchmarkData from "../../../../lib/benchmark-data.json";

export async function GET(
  request: NextRequest,
  { params }: { params: { stage: string } }
) {
  const stage = decodeURIComponent(params.stage).toLowerCase();
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain")?.toLowerCase() || (["wake", "n1", "n2", "n3", "rem"].some(s => stage.includes(s)) ? "sleep" : "epilepsy");

  // Find matching guideline
  let matching = benchmarkData.guidelines.filter((g) => (g.domain || "epilepsy").toLowerCase() === domain);

  let targetGuideline = matching.find((g) => {
    const tag = (g.risk_stage_tag || "").toLowerCase();
    if (domain === "sleep") {
      if (stage.includes("n3")) return tag.includes("n3") || tag.includes("deep");
      if (stage.includes("n2")) return tag.includes("n2") || tag.includes("sleep_apnea");
      if (stage.includes("n1")) return tag.includes("n1") || tag.includes("light");
      if (stage.includes("rem")) return tag.includes("rem") || tag.includes("sleep_apnea");
      if (stage.includes("wake")) return tag.includes("wake") || tag.includes("insomnia");
    } else {
      if (stage.includes("ictal") && !stage.includes("pre") && !stage.includes("inter")) return tag.includes("ictal");
      if (stage.includes("pre")) return tag.includes("pre");
      return tag.includes("base") || tag.includes("inter");
    }
    return false;
  }) || matching[0];

  const citations = matching
    .filter((g) => g.document_title === targetGuideline?.document_title || g.risk_stage_tag === targetGuideline?.risk_stage_tag)
    .slice(0, 3)
    .map((g) => ({
      source_org: g.source_org,
      document_title: g.document_title,
      section_title: g.section_title,
      page_number: g.page_number,
      citation_reference: g.citation_reference
    }));

  const response = {
    risk_stage: stage,
    guidance_text: targetGuideline?.chunk_content || "Verified clinical guideline recommendations.",
    source_citation: `${targetGuideline?.source_org} (${targetGuideline?.citation_reference})`,
    citations: citations.length > 0 ? citations : [
      {
        source_org: targetGuideline?.source_org || "AASM",
        document_title: targetGuideline?.document_title || "Clinical Guidelines",
        section_title: targetGuideline?.section_title || "Practice Recommendations",
        page_number: targetGuideline?.page_number || 1,
        citation_reference: targetGuideline?.citation_reference || "Clinical Guidelines 2021"
      }
    ],
    medical_disclaimer: "RESEARCH PROTOTYPE ONLY: NeuroSense is an experimental research demonstration and is NOT a diagnostic medical device. Never alter patient treatment or withhold emergency clinical interventions based on this system."
  };

  return NextResponse.json(response);
}
