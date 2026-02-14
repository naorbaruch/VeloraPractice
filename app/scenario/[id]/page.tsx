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

  // Fetch scenario
  const { data: scenario } = await supabase
    .from("scenarios")
    .select("*, tracks(title, slug)")
    .eq("id", id)
    .single();

  if (!scenario) notFound();

  // Fetch questions with answers and explanations
  const { data: questions } = await supabase
    .from("questions")
    .select(
      "*, answer_options(*), explanations(*)"
    )
    .eq("scenario_id", id)
    .order("order", { ascending: true });

  const track = scenario.tracks as unknown as { title: string; slug: string };

  return (
    <div>
      <div className="mb-6">
        <a
          href={`/tracks/${track.slug}`}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          &larr; {track.title}
        </a>
      </div>

      <div className="mb-8">
        <div className="text-xs text-muted mb-1">{scenario.scenario_code}</div>
        <h1 className="text-2xl font-bold mb-4">{scenario.title}</h1>

        <div className="p-6 border border-border rounded-lg mb-6 bg-card">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-3">
            Context
          </h2>
          <div className="text-sm leading-relaxed whitespace-pre-line">
            {scenario.context}
          </div>
        </div>

        <div className="p-6 border border-border rounded-lg mb-6 bg-card">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-3">
            Key Assumptions
          </h2>
          <ul className="text-sm space-y-2">
            {(scenario.assumptions as string[]).map(
              (assumption: string, i: number) => (
                <li key={i} className="flex gap-2">
                  <span className="text-accent font-medium shrink-0">&bull;</span>
                  {assumption}
                </li>
              )
            )}
          </ul>
        </div>

        <div className="p-6 border-2 border-accent/20 rounded-lg mb-8 bg-accent/5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-accent mb-3">
            Trigger Event
          </h2>
          <p className="text-sm leading-relaxed">{scenario.trigger_event}</p>
        </div>
      </div>

      {questions && questions.length > 0 && (
        <ScenarioInteraction questions={questions} />
      )}
    </div>
  );
}
