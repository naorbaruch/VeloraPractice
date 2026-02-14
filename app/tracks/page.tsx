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
    <div className="max-w-3xl mx-auto px-8 py-16">
      <p className="text-sm font-medium text-accent tracking-wide uppercase mb-4">
        Tracks
      </p>
      <h1 className="text-3xl font-bold tracking-tight mb-3">
        Choose a topic
      </h1>
      <p className="text-muted mb-12">
        Each track contains independent scenarios you can explore in any order.
      </p>

      {!tracks || tracks.length === 0 ? (
        <div className="py-16 text-center text-muted">
          No tracks available yet. Check back soon.
        </div>
      ) : (
        <div className="space-y-4">
          {tracks.map((track) => {
            const scenarioCount =
              (track.scenarios as unknown as { count: number }[])?.[0]?.count ??
              0;
            return (
              <Link
                key={track.id}
                href={`/tracks/${track.slug}`}
                className="block p-8 border border-border/60 rounded-xl hover:border-foreground/20 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold mb-2">
                      {track.title}
                    </h2>
                    <p className="text-sm text-muted leading-relaxed">
                      {track.description}
                    </p>
                  </div>
                  <span className="text-xs text-muted-light whitespace-nowrap ml-6 pt-1">
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
