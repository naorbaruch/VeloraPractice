-- Velora: Seed Questions 2–6
-- Run this in Supabase SQL Editor AFTER schema.sql and seed.sql

-- ============================================================
-- NEW TRACKS
-- ============================================================

insert into tracks (id, title, slug, description, "order") values
  ('a1b2c3d4-0002-4000-8000-000000000001', 'Security & Liens', 'security-and-liens', 'Scenarios covering security packages, negative pledges, share pledges, and lien mechanics in project finance.', 2),
  ('a1b2c3d4-0003-4000-8000-000000000001', 'Cash Flow & Waterfall', 'cash-flow-and-waterfall', 'Scenarios involving cash waterfall mechanics, distribution lock-ups, DSCR testing, and cash sweep provisions.', 3),
  ('a1b2c3d4-0004-4000-8000-000000000001', 'Events of Default', 'events-of-default', 'Scenarios covering cross-default, acceleration, enforcement sequencing, and related default mechanics.', 4),
  ('a1b2c3d4-0005-4000-8000-000000000001', 'Loan Mechanics', 'loan-mechanics', 'Scenarios on increased costs, change in law, mandatory prepayment triggers, and general facility mechanics.', 5);

-- ============================================================
-- QUESTION 2 — Security Package / Negative Pledge
-- ============================================================

insert into scenarios (id, track_id, scenario_code, title, context, assumptions, trigger_event, difficulty, "order") values
  (
    'b1b2c3d4-0002-4000-8000-000000000001',
    'a1b2c3d4-0002-4000-8000-000000000001',
    'PF-SEC-001',
    'Working Capital Facility Against Negative Pledge',
    E'A ProjectCo has a senior secured term loan.\n\nThe security package includes:\n- All-asset security at ProjectCo level\n- Share pledge over HoldCo\n- A standard negative pledge clause',
    ARRAY[
      'The negative pledge clause prohibits granting security unless expressly permitted',
      'No carve-out exists for receivables financing',
      'No lender consent is obtained',
      'The working capital facility is with a local bank'
    ],
    'ProjectCo wants to enter into a short-term working capital facility with a local bank, secured only over receivables. No lender consent is obtained.',
    'intermediate',
    1
  );

insert into questions (id, scenario_id, prompt, "order") values
  ('c1b2c3d4-0002-4000-8000-000000000001', 'b1b2c3d4-0002-4000-8000-000000000001', 'What is the most accurate risk under a typical project finance facility?', 1);

insert into answer_options (id, question_id, label, text, is_correct, correctness_type, legal_accuracy, market_practice, risk_awareness, perspective_awareness, composite, wrong_explanation) values
  ('d2a00001-0001-4000-8000-000000000001', 'c1b2c3d4-0002-4000-8000-000000000001', 'A', 'No issue, because the security is limited to receivables', false, 'incorrect', 15, 10, 10, 15, 13, 'Incorrect. The scope of the new security is irrelevant if the negative pledge is broadly drafted. Most negative pledge clauses prohibit any security interest, not just those over specific asset classes.'),
  ('d2a00001-0002-4000-8000-000000000001', 'c1b2c3d4-0002-4000-8000-000000000001', 'B', 'A breach of the negative pledge may occur', true, 'correct', 90, 90, 85, 80, 86, null),
  ('d2a00001-0003-4000-8000-000000000001', 'c1b2c3d4-0002-4000-8000-000000000001', 'C', 'An automatic Event of Default occurs', false, 'suboptimal', 35, 30, 40, 25, 33, 'Incorrect. While a negative pledge breach is serious, it typically triggers a Potential Event of Default first. Automatic acceleration would require further steps and lender action.'),
  ('d2a00001-0004-4000-8000-000000000001', 'c1b2c3d4-0002-4000-8000-000000000001', 'D', 'Only a disclosure obligation is triggered', false, 'incorrect', 20, 15, 15, 20, 18, 'Incorrect. A negative pledge breach is a substantive covenant breach, not merely a disclosure matter. It goes beyond notification requirements.');

insert into explanations (id, question_id, correct_explanation, lender_perspective, borrower_perspective, learning_outcome) values
  ('e1b2c3d4-0002-4000-8000-000000000001', 'c1b2c3d4-0002-4000-8000-000000000001',
   E'Negative pledge clauses usually prohibit any security interest unless expressly permitted. Even limited collateral (such as receivables) can breach the negative pledge unless specifically carved out in the permitted security basket.\n\nThe fact that the new security is small or limited to receivables does not prevent a breach. What matters is whether the negative pledge contains a carve-out for this type of security.',
   E'From the lenders'' perspective:\n- The negative pledge protects the priority of their security package\n- Any erosion of asset coverage is a concern\n- Even a small breach signals governance issues at ProjectCo\n- Lenders will want to understand why consent was not sought',
   E'From the borrower''s perspective:\n- The working capital need may be legitimate and urgent\n- The borrower may have assumed receivables were excluded\n- Failing to seek consent is a procedural error that risks escalation\n- Early engagement with lenders could have avoided the breach',
   E'The user should understand:\n- Negative pledge clauses are typically broadly drafted\n- Even limited security can trigger a breach\n- Carve-outs must be explicitly stated to be relied upon\n- Consent should be sought before granting any new security');

-- ============================================================
-- QUESTION 3 — Cash Waterfall / Distribution Lock-Up
-- ============================================================

insert into scenarios (id, track_id, scenario_code, title, context, assumptions, trigger_event, difficulty, "order") values
  (
    'b1b2c3d4-0003-4000-8000-000000000001',
    'a1b2c3d4-0003-4000-8000-000000000001',
    'PF-CW-001',
    'Distribution Lock-Up on DSCR Breach',
    E'ProjectCo''s loan agreement includes:\n- A cash waterfall\n- A distribution lock-up if DSCR < 1.20x\n- Quarterly testing\n\nCash balances remain strong throughout.',
    ARRAY[
      'DSCR lock-up threshold is 1.20x',
      'Testing is quarterly',
      'Q2 DSCR is 1.15x due to temporary curtailment',
      'Cash balances remain strong',
      'No payment default or other Event of Default exists'
    ],
    'In Q2, DSCR drops to 1.15x due to temporary revenue curtailment.',
    'beginner',
    1
  );

insert into questions (id, scenario_id, prompt, "order") values
  ('c1b2c3d4-0003-4000-8000-000000000001', 'b1b2c3d4-0003-4000-8000-000000000001', 'What is the most accurate consequence?', 1);

insert into answer_options (id, question_id, label, text, is_correct, correctness_type, legal_accuracy, market_practice, risk_awareness, perspective_awareness, composite, wrong_explanation) values
  ('d3a00001-0001-4000-8000-000000000001', 'c1b2c3d4-0003-4000-8000-000000000001', 'A', 'Immediate Event of Default', false, 'incorrect', 15, 10, 20, 15, 15, 'Incorrect. A DSCR lock-up breach is a cash trap mechanism, not a default trigger. The distribution restriction is a protective measure that operates independently from Events of Default.'),
  ('d3a00001-0002-4000-8000-000000000001', 'c1b2c3d4-0003-4000-8000-000000000001', 'B', 'Mandatory prepayment of excess cash', false, 'suboptimal', 35, 40, 35, 30, 35, 'Incorrect. Cash sweep or mandatory prepayment mechanics are typically separate from distribution lock-ups. A lock-up traps cash within the project waterfall — it does not automatically convert into a prepayment obligation.'),
  ('d3a00001-0003-4000-8000-000000000001', 'c1b2c3d4-0003-4000-8000-000000000001', 'C', 'Distributions are blocked until compliance is restored', true, 'correct', 90, 92, 88, 85, 89, null),
  ('d3a00001-0004-4000-8000-000000000001', 'c1b2c3d4-0003-4000-8000-000000000001', 'D', 'No impact because cash balances are sufficient', false, 'incorrect', 10, 10, 10, 15, 11, 'Incorrect. Distribution lock-ups are ratio-based, not balance-based. The fact that cash balances are strong is irrelevant — the DSCR test is what controls distribution permissions.');

insert into explanations (id, question_id, correct_explanation, lender_perspective, borrower_perspective, learning_outcome) values
  ('e1b2c3d4-0003-4000-8000-000000000001', 'c1b2c3d4-0003-4000-8000-000000000001',
   E'This is a cash trap, not a default. When DSCR falls below the lock-up threshold (1.20x), distributions to equity holders are blocked until the ratio is restored.\n\nThe mechanism preserves cash within the project to protect debt service capacity. It does not trigger enforcement rights or mandatory prepayment.',
   E'From the lenders'' perspective:\n- The lock-up is working as designed — cash is being preserved\n- No enforcement action is needed or appropriate\n- Lenders will monitor whether the DSCR breach is temporary or structural\n- If DSCR continues to decline, other covenants may be triggered',
   E'From the borrower''s perspective:\n- Distributions are temporarily blocked, which affects equity returns\n- The situation is manageable if the curtailment is truly temporary\n- The borrower should communicate proactively with lenders\n- No remedial action is legally required, but transparency builds trust',
   E'The user should understand:\n- The difference between a cash trap and an Event of Default\n- DSCR lock-ups protect cash flow, not enforce repayment\n- Cash balances are irrelevant to ratio-based tests\n- Distribution lock-ups are a standard protective mechanism');

-- ============================================================
-- QUESTION 4 — Mandatory Prepayment / Insurance Proceeds
-- ============================================================

insert into scenarios (id, track_id, scenario_code, title, context, assumptions, trigger_event, difficulty, "order") values
  (
    'b1b2c3d4-0004-4000-8000-000000000001',
    'a1b2c3d4-0005-4000-8000-000000000001',
    'PF-MP-001',
    'Insurance Proceeds and Reinstatement Exception',
    E'A force majeure event damages part of the project.\nInsurance proceeds are received and are sufficient to repair the asset.\n\nThe loan agreement includes:\n- Mandatory prepayment from insurance proceeds\n- An exception if funds are used for reinstatement',
    ARRAY[
      'Insurance proceeds are sufficient to cover repair costs',
      'The loan agreement contains a reinstatement exception',
      'Reinstatement must be completed within an agreed timeframe',
      'No other Event of Default exists'
    ],
    'The project is damaged by a force majeure event. Insurance proceeds are received.',
    'advanced',
    1
  );

insert into questions (id, scenario_id, prompt, "order") values
  ('c1b2c3d4-0004-4000-8000-000000000001', 'b1b2c3d4-0004-4000-8000-000000000001', 'What determines whether prepayment is required?', 1);

insert into answer_options (id, question_id, label, text, is_correct, correctness_type, legal_accuracy, market_practice, risk_awareness, perspective_awareness, composite, wrong_explanation) values
  ('d4a00001-0001-4000-8000-000000000001', 'c1b2c3d4-0004-4000-8000-000000000001', 'A', 'Whether the lenders consent to reinstatement', false, 'suboptimal', 40, 35, 30, 35, 35, 'Incorrect. Reinstatement exceptions are typically contractual — they operate automatically if conditions are met. Lender consent may be relevant in some structures, but the primary determinant is whether the reinstatement is completed within the agreed period.'),
  ('d4a00001-0002-4000-8000-000000000001', 'c1b2c3d4-0004-4000-8000-000000000001', 'B', 'Whether the proceeds exceed a monetary threshold', false, 'incorrect', 20, 20, 25, 20, 21, 'Incorrect. While some facilities have de minimis thresholds, the key determinant for the reinstatement exception is completion of repairs within the agreed timeframe, not the amount of proceeds.'),
  ('d4a00001-0003-4000-8000-000000000001', 'c1b2c3d4-0004-4000-8000-000000000001', 'C', 'Whether the project is fully repaired within the agreed period', true, 'correct', 92, 90, 90, 85, 89, null),
  ('d4a00001-0004-4000-8000-000000000001', 'c1b2c3d4-0004-4000-8000-000000000001', 'D', 'Whether the borrower elects to reinstate', false, 'suboptimal', 40, 40, 35, 30, 36, 'Incorrect. Borrower election alone is insufficient. Reinstatement exceptions are conditional — the borrower must actually complete the reinstatement within the contractually agreed timeframe. A mere election does not satisfy the exception.');

insert into explanations (id, question_id, correct_explanation, lender_perspective, borrower_perspective, learning_outcome) values
  ('e1b2c3d4-0004-4000-8000-000000000001', 'c1b2c3d4-0004-4000-8000-000000000001',
   E'Reinstatement exceptions are conditional. The borrower is typically permitted to use insurance proceeds for repair instead of prepayment, but only if the project is fully reinstated within the agreed timeframe.\n\nFailure to complete repairs within that period typically converts the proceeds into a mandatory prepayment obligation. The exception is not a permanent right — it is a conditional window.',
   E'From the lenders'' perspective:\n- The reinstatement exception balances project continuity against debt protection\n- Lenders want the asset restored, but not at the cost of indefinite delay\n- The agreed timeframe is a hard boundary\n- Monitoring reinstatement progress is critical',
   E'From the borrower''s perspective:\n- The reinstatement exception provides flexibility to restore the asset\n- But the clock is ticking — delays convert the exception into an obligation\n- Borrowers should engage contractors and insurers immediately\n- Proactive communication with lenders about reinstatement progress is essential',
   E'The user should understand:\n- Reinstatement exceptions are conditional, not absolute\n- The agreed timeframe is the key determinant\n- Failure to complete triggers mandatory prepayment\n- Borrower election alone is not sufficient');

-- ============================================================
-- QUESTION 5 — Event of Default / Cross-Default
-- ============================================================

insert into scenarios (id, track_id, scenario_code, title, context, assumptions, trigger_event, difficulty, "order") values
  (
    'b1b2c3d4-0005-4000-8000-000000000001',
    'a1b2c3d4-0004-4000-8000-000000000001',
    'PF-EOD-001',
    'Cross-Default from Sponsor Corporate Loan',
    E'The sponsor defaults on a corporate-level loan unrelated to ProjectCo.\n\nProjectCo''s financing includes:\n- A cross-default clause\n- Threshold language\n- Requirement that default affects the sponsor''s ability to perform obligations',
    ARRAY[
      'The sponsor default is on a corporate-level loan unrelated to ProjectCo',
      'ProjectCo financing contains a qualified cross-default clause',
      'Threshold and materiality language applies',
      'No ProjectCo payment default exists'
    ],
    'The sponsor defaults on a corporate-level loan unrelated to ProjectCo.',
    'intermediate',
    1
  );

insert into questions (id, scenario_id, prompt, "order") values
  ('c1b2c3d4-0005-4000-8000-000000000001', 'b1b2c3d4-0005-4000-8000-000000000001', 'When does this default typically become relevant to ProjectCo lenders?', 1);

insert into answer_options (id, question_id, label, text, is_correct, correctness_type, legal_accuracy, market_practice, risk_awareness, perspective_awareness, composite, wrong_explanation) values
  ('d5a00001-0001-4000-8000-000000000001', 'c1b2c3d4-0005-4000-8000-000000000001', 'A', 'Immediately upon any sponsor default', false, 'incorrect', 15, 10, 20, 20, 16, 'Incorrect. Cross-default clauses in project finance are typically qualified with thresholds and materiality requirements. An unqualified, automatic cross-default would be unusual in a well-structured project financing.'),
  ('d5a00001-0002-4000-8000-000000000001', 'c1b2c3d4-0005-4000-8000-000000000001', 'B', 'Only if ProjectCo is also in payment default', false, 'incorrect', 20, 20, 15, 15, 18, 'Incorrect. Cross-default clauses are designed to capture defaults elsewhere that affect the project. Requiring ProjectCo itself to also be in default would defeat the purpose of a cross-default provision.'),
  ('d5a00001-0003-4000-8000-000000000001', 'c1b2c3d4-0005-4000-8000-000000000001', 'C', 'If the sponsor default meets the threshold and impacts support obligations', true, 'correct', 90, 92, 88, 90, 90, null),
  ('d5a00001-0004-4000-8000-000000000001', 'c1b2c3d4-0005-4000-8000-000000000001', 'D', 'Never, because it is structurally separate', false, 'incorrect', 10, 15, 10, 20, 14, 'Incorrect. Structural separation does not eliminate cross-default risk. Cross-default clauses are specifically designed to bridge structural separation where the sponsor''s financial health is relevant to the project.');

insert into explanations (id, question_id, correct_explanation, lender_perspective, borrower_perspective, learning_outcome) values
  ('e1b2c3d4-0005-4000-8000-000000000001', 'c1b2c3d4-0005-4000-8000-000000000001',
   E'Cross-default clauses in project finance are usually qualified, not absolute. They typically require:\n\n- The default to exceed a monetary threshold\n- The default to materially affect the sponsor''s ability to perform its obligations to the project\n\nA sponsor default on an unrelated corporate loan becomes relevant only if it meets both conditions. The structural separation between sponsor and ProjectCo does not eliminate this risk if the cross-default clause is properly drafted.',
   E'From the lenders'' perspective:\n- Cross-default protects against sponsor distress that could cascade to the project\n- Lenders will assess whether the sponsor can still meet equity commitments and support obligations\n- The threshold language prevents trivial defaults from triggering consequences\n- Monitoring sponsor financial health is an ongoing concern',
   E'From the borrower''s perspective:\n- Structural separation provides some protection, but is not absolute\n- The sponsor should disclose the default proactively to project lenders\n- If the default is below threshold or does not impact support obligations, no consequence follows\n- Failure to disclose can erode lender confidence independently',
   E'The user should understand:\n- Cross-default clauses are typically qualified, not absolute\n- Both threshold and impact tests must be met\n- Structural separation does not eliminate cross-default risk\n- The purpose is to capture sponsor distress that affects the project');

-- ============================================================
-- QUESTION 6 — Change in Law / Increased Costs
-- ============================================================

insert into scenarios (id, track_id, scenario_code, title, context, assumptions, trigger_event, difficulty, "order") values
  (
    'b1b2c3d4-0006-4000-8000-000000000001',
    'a1b2c3d4-0005-4000-8000-000000000001',
    'PF-LM-001',
    'Increased Costs Claim Following Regulatory Change',
    E'A regulatory change increases capital requirements for banks.\nLenders incur higher funding costs and invoke the increased costs clause in the loan agreement.',
    ARRAY[
      'The regulatory change affects bank capital requirements',
      'The loan agreement contains an increased costs clause',
      'Lenders claim their funding costs have increased',
      'The change applies market-wide, not just to the project lenders'
    ],
    'Lenders invoke the increased costs clause following a regulatory change that increases their capital requirements.',
    'intermediate',
    2
  );

insert into questions (id, scenario_id, prompt, "order") values
  ('c1b2c3d4-0006-4000-8000-000000000001', 'b1b2c3d4-0006-4000-8000-000000000001', 'What is the borrower''s most typical obligation?', 1);

insert into answer_options (id, question_id, label, text, is_correct, correctness_type, legal_accuracy, market_practice, risk_awareness, perspective_awareness, composite, wrong_explanation) values
  ('d6a00001-0001-4000-8000-000000000001', 'c1b2c3d4-0006-4000-8000-000000000001', 'A', 'Immediately refinance the loan', false, 'incorrect', 15, 10, 20, 15, 15, 'Incorrect. There is no automatic obligation to refinance upon an increased costs claim. The borrower''s obligation is to compensate the lender for the demonstrable increased costs, not to restructure the facility.'),
  ('d6a00001-0002-4000-8000-000000000001', 'c1b2c3d4-0006-4000-8000-000000000001', 'B', 'Compensate lenders for demonstrable increased costs', true, 'correct', 92, 90, 85, 82, 87, null),
  ('d6a00001-0003-4000-8000-000000000001', 'c1b2c3d4-0006-4000-8000-000000000001', 'C', 'Reject the claim if costs are market-wide', false, 'incorrect', 20, 25, 20, 30, 24, 'Incorrect. The fact that increased costs are market-wide does not provide a basis for rejection. Increased costs clauses typically operate regardless of whether the regulatory change is specific or general. The borrower bears the cost risk.'),
  ('d6a00001-0004-4000-8000-000000000001', 'c1b2c3d4-0006-4000-8000-000000000001', 'D', 'Pay a fixed additional margin', false, 'suboptimal', 30, 35, 25, 25, 29, 'Incorrect. Increased costs clauses require reimbursement of actual, demonstrable costs — not a fixed additional margin. The amount is based on the lender''s actual increased cost, which must be substantiated.');

insert into explanations (id, question_id, correct_explanation, lender_perspective, borrower_perspective, learning_outcome) values
  ('e1b2c3d4-0006-4000-8000-000000000001', 'c1b2c3d4-0006-4000-8000-000000000001',
   E'Increased cost clauses require the borrower to reimburse lenders for actual, demonstrable costs arising from regulatory or legal changes. The obligation is to compensate for real increased costs, not to pay a fixed surcharge or refinance the facility.\n\nThe lender must typically provide evidence that the costs have increased and that the increase is attributable to the regulatory change. The borrower cannot reject the claim simply because the change is market-wide.',
   E'From the lenders'' perspective:\n- The increased costs clause protects against regulatory risk that was not priced into the original facility\n- Lenders must substantiate their claim with evidence\n- The claim is typically certified by the lender\n- Lenders may face pushback and should document their increased costs carefully',
   E'From the borrower''s perspective:\n- The obligation is to compensate actual costs, not estimates\n- The borrower should request evidence and verify the claim\n- Market-wide changes cannot be used as a defense\n- The borrower may have a right to prepay and refinance with a cheaper lender if costs become too high',
   E'The user should understand:\n- Increased costs clauses require demonstrable, actual cost reimbursement\n- A market-wide change does not invalidate the claim\n- The lender must substantiate the cost increase\n- The borrower''s main remedy is often the right to prepay and refinance');
