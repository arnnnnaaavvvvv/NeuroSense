import { NextRequest, NextResponse } from "next/server";
import { analyzeSequenceTrend } from "../../../../lib/trend-logic";

export async function GET(
  request: NextRequest,
  { params }: { params: { sequenceId: string } }
) {
  const sequenceId = params.sequenceId;

  try {
    const result = analyzeSequenceTrend(sequenceId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { detail: err.message || `Sequence '${sequenceId}' not found.` },
      { status: 404 }
    );
  }
}
