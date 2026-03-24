// Database types matching SOCRA schema (see supabase/schema.sql)

export type UserRole = "teacher" | "student";

export type AssignmentMode = "explore" | "guided" | "challenge" | "assess";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Course {
  id: string;
  teacher_id: string;
  title: string;
  description: string;
}

export interface Concept {
  id: string;
  course_id: string;
  label: string;
  description: string;
  position_x: number;
  position_y: number;
}

export interface ConceptEdge {
  id: string;
  from_concept_id: string;
  to_concept_id: string;
}

export interface MasteryScore {
  student_id: string;
  concept_id: string;
  score: number; // 0.0 – 1.0
  updated_at: string;
}

export interface Session {
  id: string;
  student_id: string;
  course_id: string;
  mode: AssignmentMode;
  started_at: string;
  ended_at: string | null;
}

export interface SessionEvent {
  id: string;
  session_id: string;
  event_type: string;
  concept_id: string | null;
  payload: Record<string, unknown>;
  created_at: string;
}

export interface TeacherAlert {
  id: string;
  course_id: string;
  student_id: string;
  concept_id: string;
  reason: string;
  resolved: boolean;
  created_at: string;
}

export interface Assignment {
  id: string;
  course_id: string;
  title: string;
  mode: AssignmentMode;
  due_at: string;
}
