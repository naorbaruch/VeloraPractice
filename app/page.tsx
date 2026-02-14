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
    <div>
      {/* Hero */}
      <section className="py-20 max-w-5xl mx-auto px-8">
        <p className="text-sm font-medium text-accent tracking-wide uppercase mb-4">
          Project Finance Training
        </p>
        <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-5">
          Train your deal judgment.
        </h1>
        <p className="text-lg text-muted leading-relaxed max-w-xl mb-8">
          Real scenarios. Real ambiguity. Learn how project finance deals
          actually work — not black-letter law.
        </p>
        <div className="flex items-center gap-4">
          {scenario ? (
            <Link
              href={`/scenario/${scenario.id}`}
              className="px-8 py-4 bg-foreground text-background rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Start a Scenario
            </Link>
          ) : (
            <span className="px-8 py-4 bg-foreground/30 text-background rounded-full text-sm font-medium cursor-default">
              Coming soon
            </span>
          )}
          <Link
            href="/tracks"
            className="px-8 py-4 text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Browse Tracks
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-8 py-16 border-t border-border/50">
        <p className="text-sm font-medium text-accent tracking-wide uppercase mb-10">
          How it works
        </p>
        <div className="space-y-16">
          {[
            {
              num: "01",
              title: "Read the scenario",
              desc: "A realistic fact pattern from international project finance. Explicit assumptions, no hidden tricks.",
            },
            {
              num: "02",
              title: "Choose your answer",
              desc: "Every option is plausible. Only one is best. Lock in your answer — no going back.",
            },
            {
              num: "03",
              title: "Understand the reasoning",
              desc: "See why the correct answer is correct, why the others fail, and how lenders and borrowers see it differently.",
            },
          ].map((step) => (
            <div key={step.num} className="flex gap-8">
              <span className="text-3xl font-bold text-border shrink-0">
                {step.num}
              </span>
              <div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Scoring */}
      <section className="max-w-5xl mx-auto px-8 py-16 border-t border-border/50">
        <p className="text-sm font-medium text-accent tracking-wide uppercase mb-4">
          Composite Scoring
        </p>
        <h2 className="text-2xl font-bold mb-4">
          Every answer is scored across four dimensions
        </h2>
        <p className="text-muted mb-12 max-w-lg">
          Your composite score reflects how well your judgment aligns with
          market practice — not just legal correctness.
        </p>
        <div className="grid grid-cols-2 gap-x-12 gap-y-8">
          {[
            { label: "Legal Accuracy", desc: "Is the legal logic sound?" },
            { label: "Market Practice", desc: "How do deals actually work?" },
            { label: "Risk Awareness", desc: "Do you see the downside?" },
            {
              label: "Perspective",
              desc: "Lender vs borrower — who cares about what?",
            },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-sm font-semibold mb-1">{item.label}</div>
              <div className="text-sm text-muted">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-8 py-16 border-t border-border/50 text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to test your judgment?</h2>
        <p className="text-muted mb-8">
          5 free questions. No credit card. No fluff.
        </p>
        {scenario && (
          <Link
            href={`/scenario/${scenario.id}`}
            className="inline-block px-8 py-4 bg-foreground text-background rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Start Now
          </Link>
        )}
      </section>
    </div>
  );
}
