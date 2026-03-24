import { NextResponse } from "next/server";

// TODO: Implement document ingestion pipeline
// 1. Receive uploaded document (PDF, notes, syllabus)
// 2. Parse content
// 3. Extract concepts and topics via LLM
// 4. Infer prerequisite relationships
// 5. Build dependency graph and write to Supabase
// 6. Return graph data for React Flow visualization

export async function POST() {
  return NextResponse.json(
    { message: "Document ingest endpoint — not yet implemented" },
    { status: 501 }
  );
}
