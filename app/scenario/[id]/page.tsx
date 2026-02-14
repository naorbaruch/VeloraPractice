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
    <div className="max-w-6xl mx-auto px-8">
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
      <div className="pb-4 mb-4 border-b border-border/50">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-mono text-muted">
            {scenario.scenario_code}
          </span>
          <span className="text-xs text-muted">&middot;</span>
          <span className="text-xs text-muted">
            {difficultyLabel[scenario.difficulty] || scenario.difficulty}
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          {scenario.title}
        </h1>
      </div>

      {/* Two-column layout: facts left, question right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
        {/* Left: scenario facts */}
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              Context
            </p>
            <div className="text-sm leading-relaxed whitespace-pre-line text-foreground/80">
              {scenario.context}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              Key Assumptions
            </p>
            <ul className="space-y-2">
              {(scenario.assumptions as string[]).map(
                (assumption: string, i: number) => (
                  <li
                    key={i}
                    className="text-sm leading-relaxed flex gap-2 text-foreground/80"
                  >
                    <span className="text-muted-light shrink-0">&bull;</span>
                    {assumption}
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-accent-subtle border border-accent/10">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
              Trigger Event
            </p>
            <p className="text-sm leading-relaxed font-medium">
              {scenario.trigger_event}
            </p>
          </div>
        </div>

        {/* Right: question + answers */}
        <div className="lg:border-l lg:border-border/50 lg:pl-8">
          {questions && questions.length > 0 && (
            <ScenarioInteraction questions={questions} />
          )}
        </div>
      </div>
    </div>
  );
}
