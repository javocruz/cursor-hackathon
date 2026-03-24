import { NextResponse } from "next/server";

// TODO: Implement quiz generation
// 1. Call get_weak_concepts() for the student
// 2. Select lowest-scoring nodes on dependency graph
// 3. Call generate_quiz(concepts, mode)
// 4. Return targeted quiz

export async function POST() {
  return NextResponse.json(
    { message: "Quiz generation endpoint — not yet implemented" },
    { status: 501 }
  );
}
