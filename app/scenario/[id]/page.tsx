import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ScenarioInteraction from "./ScenarioInteraction";

export const dynamic = "force-dynamic";

export default async function ScenarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: scenario } = await supabase
    .from("scenarios")
    .select("*, tracks(title, slug)")
    .eq("id", id)
    .single();

  if (!scenario) notFound();

  const { data: questions } = await supabase
    .from("questions")
    .select("*, answer_options(*), explanations(*)")
    .eq("scenario_id", id)
    .order("order", { ascending: true });

  const track = scenario.tracks as unknown as { title: string; slug: string };
  const difficultyLabel: Record<string, string> = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };

  return (
    <div className="max-w-3xl mx-auto px-8">
      {/* Breadcrumb */}
      <div className="pt-8 pb-4">
        <a
          href={`/tracks/${track.slug}`}
          className="text-[13px] text-muted hover:text-foreground transition-colors"
        >
          &larr; {track.title}
        </a>
      </div>

      {/* Scenario header */}
      <div className="py-12 border-b border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono text-muted">
            {scenario.scenario_code}
          </span>
          <span className="text-xs text-muted">&middot;</span>
          <span className="text-xs text-muted">
            {difficultyLabel[scenario.difficulty] || scenario.difficulty}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight leading-tight">
          {scenario.title}
        </h1>
      </div>

      {/* Context */}
      <div className="py-12 border-b border-border/50">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-6">
          Context
        </p>
        <div className="text-[15px] leading-[1.8] whitespace-pre-line text-foreground/90">
          {scenario.context}
        </div>
      </div>

      {/* Assumptions */}
      <div className="py-12 border-b border-border/50">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-6">
          Key Assumptions
        </p>
        <ul className="space-y-3">
          {(scenario.assumptions as string[]).map(
            (assumption: string, i: number) => (
              <li
                key={i}
                className="text-[15px] leading-relaxed flex gap-3 text-foreground/90"
              >
                <span className="text-muted-light shrink-0">&bull;</span>
                {assumption}
              </li>
            )
          )}
        </ul>
      </div>

      {/* Trigger */}
      <div className="py-12 border-b border-border/50">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-6">
          Trigger Event
        </p>
        <p className="text-lg leading-relaxed font-medium">
          {scenario.trigger_event}
        </p>
      </div>

      {/* Questions */}
      <div className="py-16">
        {questions && questions.length > 0 && (
          <ScenarioInteraction questions={questions} />
        )}
      </div>
    </div>
  );
}
