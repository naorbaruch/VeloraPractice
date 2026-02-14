import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TrackDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: track } = await supabase
    .from("tracks")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!track) notFound();

  const { data: scenarios } = await supabase
    .from("scenarios")
    .select("id, title, scenario_code, difficulty, order")
    .eq("track_id", track.id)
    .order("order", { ascending: true });

  const difficultyColor: Record<string, string> = {
    beginner: "text-success",
    intermediate: "text-warning",
    advanced: "text-error",
  };

  return (
    <div>
      <Link
        href="/tracks"
        className="text-sm text-muted hover:text-foreground transition-colors mb-4 inline-block"
      >
        &larr; All Tracks
      </Link>
      <h1 className="text-2xl font-bold mb-2">{track.title}</h1>
      <p className="text-muted mb-8">{track.description}</p>

      {!scenarios || scenarios.length === 0 ? (
        <div className="p-8 border border-border rounded-lg text-center text-muted">
          No scenarios in this track yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {scenarios.map((scenario) => (
            <Link
              key={scenario.id}
              href={`/scenario/${scenario.id}`}
              className="block p-6 border border-border rounded-lg hover:border-accent/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-muted mb-1">
                    {scenario.scenario_code}
                  </div>
                  <h2 className="text-lg font-semibold mb-1">
                    {scenario.title}
                  </h2>
                </div>
                <span
                  className={`text-xs font-medium capitalize ${difficultyColor[scenario.difficulty] || "text-muted"}`}
                >
                  {scenario.difficulty}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
