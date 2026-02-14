import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function TracksPage() {
  const supabase = await createClient();

  const { data: tracks } = await supabase
    .from("tracks")
    .select("*, scenarios(count)")
    .order("order", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Tracks</h1>
      <p className="text-muted mb-8">
        Choose a topic area. Each track contains independent scenarios you can
        explore in any order.
      </p>

      {!tracks || tracks.length === 0 ? (
        <div className="p-8 border border-border rounded-lg text-center text-muted">
          No tracks available yet. Check back soon.
        </div>
      ) : (
        <div className="grid gap-4">
          {tracks.map((track) => {
            const scenarioCount =
              (track.scenarios as unknown as { count: number }[])?.[0]?.count ?? 0;
            return (
              <Link
                key={track.id}
                href={`/tracks/${track.slug}`}
                className="block p-6 border border-border rounded-lg hover:border-accent/40 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">{track.title}</h2>
                    <p className="text-sm text-muted">{track.description}</p>
                  </div>
                  <span className="text-xs text-muted whitespace-nowrap ml-4">
                    {scenarioCount} scenario{scenarioCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
