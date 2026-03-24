# SOCRA — Project Bible
### Socratic AI Tutoring Agent | Cursor Hackathon 2025

> We didn't build a chatbot. We built an agent that understands the curriculum as a dependency graph, guides each student through it like a tutor with memory and goals, and alerts teachers before students fall behind — not after.

---

## 1. The Problem

A teacher managing 30 students cannot give each one individual attention. Students fall behind quietly. The teacher finds out too late — at a test, or not at all.

At the same time, AI tutoring tools today are either passive (search engines with a chat UI) or dangerously uncalibrated (they just give students the answer). Neither helps a student actually learn. Neither helps a teacher actually teach.

**The hard day we're solving:** a teacher's impossible task of personalising education at scale, and a student's invisible struggle to keep up.

---

## 2. The Solution — What SOCRA Is

SOCRA is a Socratic tutoring agent powered by a curriculum dependency graph. It knows what a student needs to understand before they can understand the next thing. It guides students through material with targeted questions rather than answers. And it monitors every student in real time, so teachers know exactly where to intervene.

### 2.1 The Concept Dependency Graph

When a teacher uploads course material (syllabus, notes, assignments), SOCRA's pipeline automatically:

- Parses all uploaded documents
- Extracts key concepts and topics
- Infers prerequisite relationships between them (e.g. you cannot understand photosynthesis without understanding cell membranes)
- Builds a directed dependency graph stored in Supabase
- Renders the graph visually on the teacher dashboard using React Flow

This graph is the brain of the agent. Every student interaction is anchored to it.

### 2.2 The Agentic Loop

SOCRA's agent is not a chatbot. It is a tool-calling agent that runs on every student interaction:

| Step | What Happens |
|---|---|
| 1. Trigger | Student sends a message, clicks Generate Quiz, opens an assignment, or finishes a task |
| 2. Context Load | Agent fetches student's mastery profile, current concept node, session history, and teacher mode |
| 3. Tool Selection | Agent decides which tools to call: check gaps, generate content, evaluate reasoning, log event |
| 4. Tool Execution | Next.js API route executes the tool against Supabase or the LLM |
| 5. Agent Response | Agent synthesises tool results and responds to the student or triggers a teacher alert |
| 6. State Write | Mastery scores, session events, and reasoning traces are written back to Supabase |

### 2.3 Agent Tools (MCP-style)

The agent is given a defined set of tools it can call. These are the building blocks of every interaction:

| Tool | Description |
|---|---|
| `get_weak_concepts(student_id)` | Returns ranked list of concepts where mastery score is lowest, anchored to dependency graph |
| `get_prerequisite_chain(concept_id)` | Returns the chain of prerequisite concepts the student must master first |
| `generate_quiz(concepts[], mode)` | Generates a targeted quiz for given concepts at appropriate difficulty for the student's current mode |
| `generate_explanation(concept_id, depth)` | Generates a Socratic explanation — leads student with questions rather than answers |
| `evaluate_response(student_answer, concept_id)` | Scores a student's response and returns mastery delta + reasoning quality assessment |
| `log_mastery_event(student_id, concept_id, score)` | Writes a mastery event to Supabase, updates the concept node score |
| `flag_student(student_id, reason, concept_id)` | Creates a teacher alert in the dashboard with context and suggested intervention |
| `get_session_summary(session_id)` | Returns structured JSON summary of session: concepts covered, mastery changes, struggle points |

---

## 3. Teacher Experience

### 3.1 Upload & Graph Generation

- Teacher uploads: syllabus PDF, lecture notes, assignment briefs, reading lists
- Upload triggers an async pipeline: document parsing → concept extraction → dependency inference → graph construction
- Graph is visualised in React Flow on the teacher dashboard — nodes are concepts, edges are prerequisites
- Teacher can manually adjust the graph (add/remove edges, rename nodes) before publishing

### 3.2 Assignment Modes

Instead of a numeric difficulty slider, the teacher assigns a mode per assignment. The agent adapts dynamically within that mode based on real-time student behaviour.

| Mode | Agent Behaviour |
|---|---|
| **Explore** | Agent is generous with hints, explains prerequisites proactively, encourages curiosity. Student is discovering material for the first time. |
| **Guided** | Agent uses Socratic questioning. Gives hints only after struggle is detected. Balances scaffolding with independent reasoning. |
| **Challenge** | Agent withholds hints. Asks probing follow-up questions. Pushes student to derive answers themselves. Flags if student is overwhelmed. |
| **Assess** | Agent is silent on hints. Records all responses without intervention. Teacher gets a clean mastery snapshot. Used for formal evaluation. |

> The mode is a range, not a fixed level. The agent adjusts difficulty upward if the student is coasting, and downward if they are overwhelmed — within the bounds the teacher has set.

### 3.3 Teacher Dashboard

- Concept graph with per-student mastery overlaid as colour intensity on each node
- Class-wide struggle heatmap: which concepts are most students failing on
- Per-student detail view: session history, mastery timeline, reasoning trace
- Live alert feed: agent-generated flags with context (e.g. "Sofia has attempted mitosis 4 times with declining scores — suggest prerequisite review")
- Teacher can click any alert and send a direct message or resource to the student

---

## 4. Student Experience

### 4.1 Dashboard

- View available topics and assignments set by teacher
- See personal concept map: which concepts are mastered (green), in progress (amber), locked (grey)
- A concept is locked until its prerequisites are mastered — the agent enforces this
- Streak and session stats for lightweight motivation

### 4.2 Chat Interface

- Student opens an assignment or topic and begins a chat session
- Agent pre-loads their concept profile before the first message — it already knows their gaps
- Agent never just gives the answer. It leads with questions, checks understanding, and adjusts in real time
- Responses are **streamed** via Vercel AI SDK — feels instant, no waiting for full agent response
- If a student asks about concept C but hasn't mastered concept A (a prerequisite), the agent redirects: "Let's make sure we're solid on X first"

### 4.3 Generate Quiz / Assignment

- Student (or teacher) triggers: "Generate a quiz on my weakest areas"
- Agent calls `get_weak_concepts()` → selects the 3 lowest-scoring nodes on the dependency graph
- Agent calls `generate_quiz(concepts, mode)` → produces a targeted, calibrated quiz
- Student answers inline in the UI
- Agent calls `evaluate_response()` per answer → updates mastery scores on the graph in real time
- At quiz end, agent writes a session summary and checks if any teacher alert thresholds are crossed

---

## 5. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) — deployed on Vercel |
| Styling | Tailwind CSS + shadcn/ui |
| Graph Visualisation | React Flow — concept dependency graph on teacher dashboard |
| Auth | Supabase Auth — magic link / email, role-based (teacher / student) |
| Database | Supabase (Postgres) — users, concepts, mastery scores, sessions, alerts |
| File Storage | Supabase Storage — teacher uploaded documents |
| Backend / API | Next.js API Routes (Vercel serverless) — all LLM calls and agent logic |
| Chat Streaming | Vercel AI SDK (`ai` package) — `useChat()` hook + `StreamingTextResponse` |
| LLM Provider | OpenAI GPT-4o (swappable via `LLM_PROVIDER` env var — Claude-ready) |
| Agent Pattern | Tool-calling loop within Next.js API routes — no separate agent server |
| Document Parsing | LangChain document loaders + OpenAI embeddings for concept extraction |
| Deployment | Vercel (frontend + API) + Supabase (Postgres + storage) |

> LLM provider is fully abstracted behind an env var (`LLM_PROVIDER=openai|anthropic`). Switching to Claude requires only a provider swap — no logic changes.

### Why Not FastAPI / Railway?

- Vercel's Python runtime has no native streaming support — critical for the chat UX
- Python serverless cold starts are 2–3x slower than Node.js on Vercel
- Adds an extra network hop on every request and an extra service to fail during demo
- Next.js API routes give you the same structure and separation of concerns with none of the overhead

---

## 6. Architecture

### 6.1 Streaming & Agent Execution Model

The agent loop is split into three non-blocking phases:

| Phase | What Happens | Timing |
|---|---|---|
| Pre-response tools | `get_weak_concepts`, `check_prerequisites` — Supabase reads | ~200–500ms, non-blocking |
| Streamed LLM response | Agent generates reply, streamed token-by-token to frontend | Starts immediately via Vercel AI SDK |
| Post-response tools | `log_mastery_event`, `flag_student`, `write_session_event` | Fire-and-forget via `waitUntil()` |

The student sees the first token of the response before tool calls finish. Supabase state is updated in the background.

### 6.2 Data Model (Supabase)

| Table | Key Fields |
|---|---|
| `users` | id, email, role (teacher/student), created_at |
| `courses` | id, teacher_id, title, description |
| `enrollments` | student_id, course_id |
| `documents` | id, course_id, filename, storage_path, parsed_at |
| `concepts` | id, course_id, label, description, position_x, position_y |
| `concept_edges` | id, from_concept_id, to_concept_id |
| `mastery_scores` | student_id, concept_id, score (0.0–1.0), updated_at |
| `sessions` | id, student_id, course_id, mode, started_at, ended_at |
| `session_events` | id, session_id, event_type, concept_id, payload (JSON), created_at |
| `teacher_alerts` | id, course_id, student_id, concept_id, reason, resolved, created_at |
| `assignments` | id, course_id, title, mode (explore/guided/challenge/assess), due_at |

### 6.3 API Routes

| Route | Responsibility |
|---|---|
| `POST /api/ingest` | Receives uploaded doc, parses content, extracts concepts, builds dependency graph |
| `POST /api/agent/chat` | Main agent loop: student message → tool calls → streamed response |
| `POST /api/agent/quiz` | Triggers quiz generation: `get_weak_concepts` + `generate_quiz` |
| `POST /api/agent/evaluate` | Evaluates quiz answers, updates mastery scores, checks alert thresholds |
| `GET /api/dashboard/teacher` | Returns class mastery overview, concept heatmap, unresolved alerts |
| `GET /api/dashboard/student` | Returns student's concept map, mastery scores, available assignments |

---

## 7. Build Plan

### CORE — Must Ship

- [ ] Supabase schema: all tables created and seeded with demo data
- [ ] Auth: magic link login, role detection (teacher vs student), redirect to correct dashboard
- [ ] Teacher upload: drag-and-drop → async ingest pipeline → concept graph written to Supabase
- [ ] Concept graph: React Flow visualisation on teacher dashboard
- [ ] Student chat: streaming agent chat with full tool-calling loop
- [ ] Generate quiz: student triggers → agent targets weak concepts → inline answer UI → mastery update
- [ ] Teacher alert feed: real-time agent-generated flags with student + concept context
- [ ] Student concept map: visual mastery state per concept, locked/unlocked logic enforced

### EXTENSION — If Time Allows

- [ ] Teacher can click an alert and message the student directly
- [ ] Session summary page: full reasoning trace per session
- [ ] Mastery timeline chart: student progress over time per concept
- [ ] Auto-generated remedial micro-lesson when a student is flagged
- [ ] Teacher can manually edit concept graph edges before publishing

---

## 8. What Makes This Not a Chat Wrapper

| A chat wrapper does this | SOCRA does this instead |
|---|---|
| Sends user message to LLM, returns response | Runs a tool-calling agentic loop: message → tool calls → Supabase reads/writes → response |
| No memory beyond conversation history | Persistent mastery model per student, per concept, across all sessions |
| Treats all questions the same | Anchors every interaction to a dependency graph — knows what the student needs before they do |
| Generates content randomly | Generates content targeted at the weakest nodes in the student's personal concept graph |
| Teacher has no visibility | Agent proactively writes structured state and fires alerts — dashboard reflects real-time class state |
| Difficulty is fixed or manually set | Agent dynamically adjusts within teacher-set mode based on observed reasoning quality |

> The agent does not wait to be asked. It monitors, it decides, it writes state, it alerts. That is the difference.

---

*SOCRA — Cursor Hackathon — Built with Next.js, Supabase, and OpenAI*
