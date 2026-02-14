import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: scenario } = await supabase
    .from("scenarios")
    .select("id, title, scenario_code, difficulty")
    .order("order", { ascending: true })
    .limit(1)
    .single();

  return (
    <div className="py-12">
      <section className="mb-16">
        <h1 className="text-3xl font-bold mb-4 leading-tight">
          Train Your Project Finance Judgment
        </h1>
        <p className="text-lg text-muted max-w-2xl mb-2">
          Real scenarios. Real ambiguity. Learn how deals actually work — not
          black-letter law.
        </p>
        <p className="text-sm text-muted mb-8">
          Answer up to 5 questions before signing up. No credit card required.
        </p>

        <div className="flex gap-4">
          {scenario ? (
            <Link
              href={`/scenario/${scenario.id}`}
              className="px-6 py-3 bg-accent text-white rounded-md hover:bg-accent-light transition-colors font-medium"
            >
              Start a Scenario
            </Link>
          ) : (
            <span className="px-6 py-3 bg-accent/50 text-white rounded-md font-medium cursor-default">
              No scenarios available yet
            </span>
          )}
          <Link
            href="/tracks"
            className="px-6 py-3 border border-border rounded-md hover:bg-card transition-colors font-medium"
          >
            Browse Tracks
          </Link>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-xl font-semibold mb-6">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "1",
              title: "Read the scenario",
              desc: "A realistic fact pattern from international project finance. Explicit assumptions, no hidden tricks.",
            },
            {
              step: "2",
              title: "Choose your answer",
              desc: "All options are plausible. Only one is best. Your answer locks in and reveals a composite score.",
            },
            {
              step: "3",
              title: "Understand the reasoning",
              desc: "See why the correct answer is correct — and why the others fail. Lender and borrower perspectives included.",
            },
          ].map((item) => (
            <div key={item.step} className="p-6 border border-border rounded-lg">
              <div className="text-sm font-semibold text-accent mb-2">
                {item.step}
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Scoring dimensions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Legal Accuracy", desc: "Is the legal logic correct?" },
            { label: "Market Practice", desc: "How deals actually work" },
            { label: "Risk Awareness", desc: "Downside & sequencing" },
            { label: "Perspective", desc: "Lender vs borrower view" },
          ].map((item) => (
            <div key={item.label} className="p-4 border border-border rounded-lg">
              <div className="text-sm font-semibold mb-1">{item.label}</div>
              <div className="text-xs text-muted">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
