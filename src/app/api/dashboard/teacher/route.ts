import { NextResponse } from "next/server";

// TODO: Implement teacher dashboard API
// Returns: class mastery overview, concept heatmap, unresolved alerts

export async function GET() {
  return NextResponse.json(
    { message: "Teacher dashboard endpoint — not yet implemented" },
    { status: 501 }
  );
}
