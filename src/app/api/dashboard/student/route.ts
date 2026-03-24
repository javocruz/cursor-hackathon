import { NextResponse } from "next/server";

// TODO: Implement student dashboard API
// Returns: student's concept map, mastery scores, available assignments

export async function GET() {
  return NextResponse.json(
    { message: "Student dashboard endpoint — not yet implemented" },
    { status: 501 }
  );
}
