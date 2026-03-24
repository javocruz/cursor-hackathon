import { NextResponse } from "next/server";

// TODO: Implement evaluation
// 1. Receive student answers
// 2. Call evaluate_response() per answer
// 3. Update mastery scores on the graph
// 4. Check alert thresholds, flag_student() if needed
// 5. Write session summary

export async function POST() {
  return NextResponse.json(
    { message: "Evaluation endpoint — not yet implemented" },
    { status: 501 }
  );
}
