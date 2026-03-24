import { NextResponse } from "next/server";

// TODO: Implement agentic chat loop
// 1. Receive student message
// 2. Load context: mastery profile, current concept, session history, teacher mode
// 3. Agent tool selection: check gaps, generate content, evaluate reasoning
// 4. Execute tools against Supabase / LLM
// 5. Stream response via Vercel AI SDK
// 6. Write mastery events + reasoning traces back to Supabase

export async function POST() {
  return NextResponse.json(
    { message: "Agent chat endpoint — not yet implemented" },
    { status: 501 }
  );
}
