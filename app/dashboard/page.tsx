import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Get user progress with question and scenario details
  const { data: progress } = await supabase
    .from("user_progress")
    .select(
      "*, questions(prompt, scenarios(id, title, scenario_code, tracks(title, slug)))"
    )
    .eq("user_id", user.id)
    .order("answered_at", { ascending: false });

  // Calculate stats
  const totalAnswered = progress?.length ?? 0;
  const avgScore =
    totalAnswered > 0
      ? Math.round(
          (progress!.reduce((sum, p) => sum + p.composite_score, 0) /
            totalAnswered) *
            100
        ) / 100
      : 0;

  // Get total questions available
  const { count: totalQuestions } = await supabase
    .from("questions")
    .select("*", { count: "exact", head: true });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-sm text-muted mb-8">{user.email}</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="p-6 border border-border rounded-lg text-center">
          <div className="text-2xl font-bold text-accent">{totalAnswered}</div>
          <div className="text-xs text-muted mt-1">Questions Answered</div>
        </div>
        <div className="p-6 border border-border rounded-lg text-center">
          <div className="text-2xl font-bold text-accent">
            {totalQuestions ?? 0}
          </div>
          <div className="text-xs text-muted mt-1">Total Available</div>
        </div>
        <div className="p-6 border border-border rounded-lg text-center">
          <div className="text-2xl font-bold text-accent">{avgScore}</div>
          <div className="text-xs text-muted mt-1">Avg. Score</div>
        </div>
      </div>

      {/* Recent answers */}
      <h2 className="text-lg font-semibold mb-4">Recent Answers</h2>
      {!progress || progress.length === 0 ? (
        <div className="p-8 border border-border rounded-lg text-center text-muted">
          <p className="mb-4">No answers yet. Start training!</p>
          <Link
            href="/tracks"
            className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-light transition-colors text-sm"
          >
            Browse Tracks
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {progress.map((p) => {
            const question = p.questions as unknown as {
              prompt: string;
              scenarios: {
                id: string;
                title: string;
                scenario_code: string;
                tracks: { title: string; slug: string };
              };
            };
            const scoreColor =
              p.composite_score >= 80
                ? "text-success"
                : p.composite_score >= 50
                  ? "text-warning"
                  : "text-error";

            return (
              <Link
                key={p.id}
                href={`/scenario/${question.scenarios.id}`}
                className="block p-4 border border-border rounded-lg hover:border-accent/40 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-muted mb-1">
                      {question.scenarios.tracks.title} &middot;{" "}
                      {question.scenarios.scenario_code}
                    </div>
                    <div className="text-sm font-medium">
                      {question.prompt}
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${scoreColor} ml-4`}>
                    {p.composite_score}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
