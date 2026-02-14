import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: scenario } = await supabase
    .from("scenarios")
    .select("id")
    .order("order", { ascending: true })
    .limit(1)
    .single();

  return (
    <div className="max-w-5xl mx-auto px-8">
      {/* Hero */}
      <section className="pt-10 pb-10">
        <p className="text-xs font-medium text-accent tracking-wide uppercase mb-3">
          Project Finance Training
        </p>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Train your deal judgment.
        </h1>
        <p className="text-muted max-w-xl mb-6">
          Real scenarios. Real ambiguity. Learn how project finance deals
          actually work — not black-letter law.
        </p>
        <div className="flex items-center gap-4">
          {scenario ? (
            <Link
              href={`/scenario/${scenario.id}`}
              className="px-6 py-2.5 bg-foreground text-background rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Start a Scenario
            </Link>
          ) : (
            <span className="px-6 py-2.5 bg-foreground/30 text-background rounded-full text-sm font-medium cursor-default">
              Coming soon
            </span>
          )}
          <Link
            href="/tracks"
            className="text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Browse Tracks
          </Link>
        </div>
      </section>

      {/* How it works — horizontal */}
      <section className="py-8 border-t border-border/50">
        <p className="text-xs font-medium text-accent tracking-wide uppercase mb-6">
          How it works
        </p>
        <div className="grid grid-cols-3 gap-8">
          {[
            {
              num: "01",
              title: "Read the scenario",
              desc: "A realistic fact pattern. Explicit assumptions, no tricks.",
            },
            {
              num: "02",
              title: "Choose your answer",
              desc: "Every option is plausible. Only one is best. No going back.",
            },
            {
              num: "03",
              title: "Understand why",
              desc: "Why it's correct, why the others fail. Both perspectives.",
            },
          ].map((step) => (
            <div key={step.num}>
              <span className="text-lg font-bold text-border">{step.num}</span>
              <h3 className="text-sm font-semibold mt-2 mb-1">{step.title}</h3>
              <p className="text-sm text-muted">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Scoring — horizontal */}
      <section className="py-8 border-t border-border/50">
        <p className="text-xs font-medium text-accent tracking-wide uppercase mb-2">
          Composite Scoring
        </p>
        <p className="text-sm text-muted mb-6">
          Every answer is scored across four dimensions.
        </p>
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: "Legal Accuracy", desc: "Is the logic sound?" },
            { label: "Market Practice", desc: "How deals actually work" },
            { label: "Risk Awareness", desc: "Do you see the downside?" },
            { label: "Perspective", desc: "Lender vs borrower" },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-sm font-semibold mb-0.5">{item.label}</div>
              <div className="text-xs text-muted">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 border-t border-border/50 text-center">
        <p className="text-sm font-semibold mb-1">Ready to test your judgment?</p>
        <p className="text-xs text-muted mb-4">
          5 free questions. No credit card.
        </p>
        {scenario && (
          <Link
            href={`/scenario/${scenario.id}`}
            className="inline-block px-6 py-2.5 bg-foreground text-background rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Start Now
          </Link>
        )}
      </section>
    </div>
  );
}
