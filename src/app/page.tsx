import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    title: "Concept Dependency Graph",
    description:
      "Upload course materials and SOCRA automatically extracts concepts and prerequisite relationships into a visual dependency graph.",
  },
  {
    title: "Socratic Tutoring Agent",
    description:
      "An AI agent that guides students with targeted questions — never just giving the answer. It adapts in real time to each student's mastery level.",
  },
  {
    title: "Teacher Dashboard",
    description:
      "Real-time mastery heatmaps, class-wide struggle metrics, and proactive alerts so teachers know exactly where to intervene.",
  },
  {
    title: "Adaptive Assignment Modes",
    description:
      "Four modes — Explore, Guided, Challenge, Assess — let teachers set the level while the agent dynamically adjusts within those bounds.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
        <Badge variant="secondary" className="mb-4 text-sm">
          Cursor Hackathon 2025
        </Badge>
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          SOCRA
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          A Socratic AI tutoring agent that understands the curriculum as a
          dependency graph, guides each student like a tutor with memory and
          goals, and alerts teachers before students fall behind.
        </p>
        <div className="mt-8 flex gap-4">
          <Button size="lg">Get Started</Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <Card key={f.title}>
              <CardHeader>
                <CardTitle>{f.title}</CardTitle>
                <CardDescription>{f.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        Built with Next.js, Supabase, and OpenAI &middot; IE University
      </footer>
    </div>
  );
}
