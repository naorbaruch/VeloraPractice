# Product Requirements Document

## Project Finance Interactive Case Simulator (Working Title: Velora)

---

## 1. Product Vision

### 1.1 What this product is

This product is a web-based, interactive, scenario-driven simulator designed to train judgment in project finance legal and structuring decisions.

It teaches how deals actually work, not black-letter law.

Users are presented with fact patterns and must choose the best possible decision among multiple plausible alternatives. The product explains:

- Why the correct answer is correct, and
- Why the other answers are wrong or suboptimal.

**This is not a quiz game.**
**This is not legal advice.**
**This is a professional judgment training tool.**

### 1.2 Target users (V1)

**Primary V1 users:**

- Project finance professionals (finance + legal)
- Junior to senior level
- Lender-side and sponsor-side

The product must support mixed seniority:

- Simple factual scenarios (for juniors)
- Complex multi-layered scenarios (for seniors)

### 1.3 Core learning goal

After using the product, a user should be better at:

- Identifying which clause or risk is triggered
- Understanding sequencing (what happens first vs later)
- Thinking like both lenders and borrowers
- Avoiding common but dangerous misunderstandings

---

## 2. Scope and Non-Goals

### 2.1 In scope

- International project finance market practice
- Common-law style logic (LMA / NY-law inspired)
- Topics such as:
  - Change of Control
  - Events of Default vs Potential EoD
  - Mandatory prepayment
  - Security packages
  - Share pledges
  - Cash waterfalls
  - Covenants
  - Cure periods
  - Enforcement sequencing

### 2.2 Explicitly out of scope (V1)

- Jurisdiction-specific statutory law (e.g., Israeli Companies Law)
- Court precedents
- Legal drafting tutorials
- AI-generated real-time legal advice
- Mobile app (desktop web only)

---

## 3. Language, Jurisdiction & Legal Posture

### 3.1 Language

English only in V1.

### 3.2 Legal framework

- International project finance market practice
- No jurisdiction-specific correctness unless explicitly marked

### 3.3 Legal disclaimer (mandatory)

The product must display a clear disclaimer:

- Educational purposes only
- No legal or financial advice
- No jurisdiction-specific reliance

---

## 4. Product Structure

### 4.1 Tracks

The system must support multiple independent tracks, even if V1 ships with only one populated track.

Examples:

- Security & Liens
- Change of Control
- Cash Flow & Waterfall
- Events of Default

Tracks are logical groupings, not linear courses.

### 4.2 Free exploration

Users may:

- Enter any available track
- Answer scenarios in any order
- Replay scenarios

No forced progression in V1.

---

## 5. Core User Flow

### 5.1 Anonymous entry

1. User lands on homepage
2. Immediately sees a scenario
3. Can answer up to 5 questions anonymously
4. After threshold — soft gate appears: "Create an account to continue"

### 5.2 Authenticated experience

After signup (email + password):

- User progress is saved
- Scores accumulate
- Track completion becomes visible

### 5.3 Scenario interaction flow

1. User reads scenario
2. User selects one answer
3. Answer is locked
4. System reveals:
   - Correct answer
   - Composite score
   - Explanation
   - Why other answers are wrong
   - Lender vs borrower perspective (if applicable)

---

## 6. Question & Answer Design

### 6.1 Question format

Each question must have:

- One best answer
- Other answers that are:
  - Plausible
  - Common mistakes
  - Defensible but inferior

No trick questions.

### 6.2 Answer correctness model

Answer types:

- **Correct** (best)
- **Acceptable but suboptimal**
- **Incorrect**

Only one answer is marked best.

---

## 7. Scoring System (Composite)

Each answer produces a composite score, composed of:

| Component             | Description                              |
| --------------------- | ---------------------------------------- |
| Legal Accuracy        | Is the legal logic correct               |
| Market Practice       | Reflects how deals actually work         |
| Risk Awareness        | Identifies downside and sequencing       |
| Perspective Awareness | Understands lender vs borrower           |

- Each component scored 0–100.
- Composite score = weighted average (weights configurable).

---

## 8. Explanation Engine

### 8.1 Explanation sections (mandatory)

After answering, the user sees:

1. **Correct Answer Explained**
2. **Lender Perspective** (if applicable)
3. **Borrower Perspective** (if applicable)
4. **Why Other Answers Are Wrong**

This content is static, authored, not AI-generated in real time.

---

## 9. Content Authoring Model

### 9.1 Scenario structure

Each scenario contains:

- Title
- Context / background
- Assumptions (explicit)
- One or more questions

### 9.2 Question object

Each question includes:

- Prompt
- Answer options
- Correct answer
- Scoring weights
- Explanation blocks

Content should be authored in structured JSON/YAML.

---

## 10. Technology Requirements (High Level)

### 10.1 Frontend

- Web app (React / Next.js)
- Desktop-first UX
- Text-heavy, readable design
- No gamified visuals (no avatars, no animations)

### 10.2 Backend

- User authentication
- Scenario delivery
- Scoring logic
- Progress tracking
- Simple CRUD architecture is sufficient

### 10.3 AI usage

- No AI required in V1 runtime.
- AI may be used offline to:
  - Help author scenarios
  - Refine explanations

---

## 11. Monetization (V1 & Future)

### 11.1 V1

- Free access
- Signup required after limited usage
- No payments

### 11.2 Future (explicitly NOT built now)

- Content gating
- Paid scenario packs
- Subscriptions
- Team dashboards

System architecture should allow feature flags.

---

## 12. Analytics & Success Metrics

Track:

- Anonymous → signup conversion
- Question completion rates
- Average composite score
- Drop-off points
- Scenario replay frequency

No vanity DAU metrics.

---

## 13. What NOT to Build (Critical)

- No chat
- No real-time multiplayer
- No AI explanations per user
- No mobile app
- No jurisdiction forks
- No heavy gamification

---

## 14. Timeline Expectation

- Concept & content design: 2–3 weeks
- MVP build: 3–5 weeks
- Total to usable V1: ~6–8 weeks

---

## 15. Product Philosophy (For the Builder)

This product succeeds if users say:

> "This feels like how real deals actually work."

It fails if it feels like:

- A law school exam
- A trivia quiz
- A mobile game

**Final Note to the Builder:**

Content quality > feature count.

If forced to choose, always prioritize:

- Clear scenarios
- Honest ambiguity
- Market realism

---

## 16. Canonical Scenario (Gold Standard)

This scenario defines the minimum acceptable quality for all future content. If a future scenario is materially weaker than this one, it should not ship.

### 16.1 Canonical Scenario — Full Example

| Field       | Value                                        |
| ----------- | -------------------------------------------- |
| Scenario ID | PF-COC-001                                   |
| Track       | Change of Control / Mandatory Prepayment     |
| Difficulty  | Intermediate → Advanced                      |

**Scenario Title:** Change of Control at HoldCo Without Lender Consent

**Scenario Context:**

A project company ("ProjectCo") owns and operates a renewable energy project.

The financing structure includes:

- A senior secured term loan
- Lenders are granted:
  - Security over all project assets
  - A share pledge over 100% of HoldCo

The loan agreement contains:

- A Change of Control clause
- A 30-day cure period
- Standard Events of Default and enforcement mechanics

The current sponsor owns 100% of HoldCo.

**Key Assumptions (Explicit):**

- The Change of Control definition includes: Transfer of more than 50% of voting rights at HoldCo
- No prior lender consent was obtained
- No waivers are in place
- No insolvency or payment default exists
- Cash flows of the project remain stable

**Trigger Event:**

The sponsor sells 60% of HoldCo to a new investor. The transaction closes without notifying the lenders.

**Question 1 — Prompt:**

What is the most accurate immediate consequence under a typical international project finance facility?

**Answer Options:**

- A. An automatic Event of Default occurs and the loan is immediately accelerated
- B. A mandatory prepayment obligation is immediately triggered
- C. A Potential Event of Default arises and the cure period begins
- D. No breach occurs because project cash flows are unaffected

**Correct Answer:** C

**Scoring Breakdown:**

| Component             | Score |
| --------------------- | ----- |
| Legal Accuracy        | 95    |
| Market Practice       | 90    |
| Risk Awareness        | 85    |
| Perspective Awareness | 80    |
| **Composite Score**   | **88**|

**Explanation — Correct Answer:**

A Change of Control has occurred because control of HoldCo has transferred beyond the agreed threshold.

However, in a typical project finance structure:

- Change of Control is not automatically an Event of Default
- It is first treated as a Potential Event of Default
- The agreed cure period begins upon occurrence

During the cure period, the borrower may:

- Reverse the transaction
- Obtain lender consent
- Refinance the debt

Acceleration does not occur unless the cure period expires without remediation.

**Lender Perspective:**

- Control risk has materially increased
- The identity, creditworthiness, and incentives of the sponsor have changed
- Immediate enforcement is usually not optimal
- Preserving optionality during the cure period is preferred

**Borrower Perspective:**

- The breach is serious but not fatal
- The cure period provides time to manage the situation
- Immediate engagement with lenders is critical
- Failure to act escalates the risk significantly

**Why the Other Answers Are Wrong:**

**A — Automatic acceleration:** Incorrect. Acceleration generally requires an Event of Default and lender action. Neither has occurred yet.

**B — Immediate mandatory prepayment:** Incorrect. Mandatory prepayment is usually triggered only after an Event of Default, or after expiry of the cure period.

**D — No breach due to stable cash flows:** Incorrect. Project finance is control-driven, not purely cash-flow-driven.

**Learning Outcome:**

The user should walk away understanding:

- The difference between Potential EoD and EoD
- The role of cure periods
- Why lenders care about control even when cash flows are stable

---

## 17. Scenario Authoring Template (Reusable)

This template must be used for all future scenarios.

### 17.1 Scenario Metadata

- **Scenario ID:**
- **Track:**
- **Difficulty:** (Beginner / Intermediate / Advanced)
- **Estimated Time:** (minutes)

### 17.2 Scenario Title

Short, descriptive, professional title.

### 17.3 Scenario Context

Describe the project, financing structure, and relevant documents. Avoid unnecessary facts. Assume the reader is a finance professional.

### 17.4 Key Assumptions (Mandatory)

List assumptions explicitly. Anything not stated here is assumed NOT to exist.

### 17.5 Trigger Event

Describe the specific action or event that creates legal or financial consequences.

### 17.6 Question Block

**Question Prompt:** Ask what happens next, who has rights, or which risk is triggered. Avoid definition questions.

**Answer Options:**

- A. Plausible but incorrect
- B. Common misunderstanding
- C. Best answer
- D. Defensible but incomplete

**Correct Answer:** Single best answer only.

### 17.7 Scoring Breakdown

- Legal Accuracy:
- Market Practice:
- Risk Awareness:
- Perspective Awareness:
- Composite Score:

### 17.8 Explanation Sections (Mandatory)

**Correct Answer Explained** — Explain logic step-by-step. No jargon without explanation.

**Lender Perspective** (if applicable) — What lenders care about here. Why they act or delay.

**Borrower Perspective** (if applicable) — What flexibility exists. What mistakes borrowers often make.

**Why Other Answers Are Wrong** — One short paragraph per incorrect answer. Explain the trap.

### 17.9 Learning Outcome

Explicitly state what the user should now understand.

---

## 18. Quality Bar (Non-Negotiable)

A scenario is **not acceptable** if:

- The answer is obvious
- There is no ambiguity
- It tests memory instead of judgment
- It could be answered without real deal experience

---

## 19. V1 MVP Implementation Checklist

| #  | Feature                                              | Status  |
| -- | ---------------------------------------------------- | ------- |
| 1  | Next.js + Tailwind project setup                     | Done    |
| 2  | Supabase client (browser + server)                   | Done    |
| 3  | Database schema (6 tables + RLS policies)            | Done    |
| 4  | Seed data — canonical scenario PF-COC-001            | Done    |
| 5  | Homepage with CTA                                    | Done    |
| 6  | Tracks listing page                                  | Done    |
| 7  | Track detail page (scenarios list)                   | Done    |
| 8  | Scenario page (context, assumptions, trigger)        | Done    |
| 9  | Interactive Q&A (select, lock-in, reveal)            | Done    |
| 10 | Composite score display with bars                    | Done    |
| 11 | Explanation engine (correct, perspectives, wrong answers, learning outcome) | Done |
| 12 | Auth — signup (email + password)                     | Done    |
| 13 | Auth — login                                         | Done    |
| 14 | Auth — callback route                                | Done    |
| 15 | Auth — session middleware                             | Done    |
| 16 | Header shows auth state (sign in / sign out)         | Done    |
| 17 | Anonymous 5-question gate (localStorage)             | Done    |
| 18 | Save user progress to DB                             | Done    |
| 19 | Dashboard (stats + recent answers)                   | Done    |
| 20 | Legal disclaimer in footer                           | Done    |
| 21 | `.env.local` gitignored                              | Done    |
| 22 | Vercel environment variables set                     | Pending |
| 23 | Production deploy on Vercel                          | Pending |
| 24 | Admin panel for scenario authoring                   | Future  |
| 25 | Additional scenario content                          | Future  |
| 26 | Password reset / email verification                  | Future  |
| 27 | Analytics tracking                                   | Future  |
| 28 | Feature flags for monetization                       | Future  |

---

## Final Note

This canonical scenario and template are now part of the definition of the product.

Any agent building this:

- Must implement the system to support this structure
- Must treat this scenario as the benchmark
