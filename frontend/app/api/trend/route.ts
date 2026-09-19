import { NextResponse } from "next/server";
import { listAvailableSequences } from "../../../lib/trend-logic";

export async function GET() {
  const sequences = listAvailableSequences();
  return NextResponse.json(sequences);
}
