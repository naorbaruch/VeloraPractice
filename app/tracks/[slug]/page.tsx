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
    <div className="max-w-3xl mx-auto px-8 py-16">
      <Link
        href="/tracks"
        className="text-[13px] text-muted hover:text-foreground transition-colors mb-8 inline-block"
      >
        &larr; All Tracks
      </Link>
      <h1 className="text-3xl font-bold tracking-tight mb-3">{track.title}</h1>
      <p className="text-muted mb-12">{track.description}</p>

      {!scenarios || scenarios.length === 0 ? (
        <div className="py-16 text-center text-muted">
          No scenarios in this track yet.
        </div>
      ) : (
        <div className="space-y-4">
          {scenarios.map((scenario) => (
            <Link
              key={scenario.id}
              href={`/scenario/${scenario.id}`}
              className="block p-8 border border-border/60 rounded-xl hover:border-foreground/20 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-mono text-muted-light mb-2">
                    {scenario.scenario_code}
                  </p>
                  <h2 className="text-lg font-semibold">{scenario.title}</h2>
                </div>
                <span
                  className={`text-xs font-medium capitalize ml-6 pt-1 ${difficultyColor[scenario.difficulty] || "text-muted"}`}
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
