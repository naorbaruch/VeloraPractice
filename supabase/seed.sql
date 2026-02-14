-- Velora Practice: Seed Data — Canonical Scenario
-- Run this AFTER schema.sql in Supabase SQL Editor

-- 1. Insert Track
insert into tracks (id, title, slug, description, "order") values
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Change of Control', 'change-of-control', 'Scenarios involving change of control clauses, mandatory prepayment triggers, and sponsor transfer mechanics in project finance.', 1);

-- 2. Insert Scenario (PF-COC-001)
insert into scenarios (id, track_id, scenario_code, title, context, assumptions, trigger_event, difficulty, "order") values
  (
    'b1b2c3d4-0001-4000-8000-000000000001',
    'a1b2c3d4-0001-4000-8000-000000000001',
    'PF-COC-001',
    'Change of Control at HoldCo Without Lender Consent',
    E'A project company ("ProjectCo") owns and operates a renewable energy project.\n\nThe financing structure includes:\n- A senior secured term loan\n- Lenders are granted:\n  - Security over all project assets\n  - A share pledge over 100% of HoldCo\n\nThe loan agreement contains:\n- A Change of Control clause\n- A 30-day cure period\n- Standard Events of Default and enforcement mechanics\n\nThe current sponsor owns 100% of HoldCo.',
    ARRAY[
      'The Change of Control definition includes: Transfer of more than 50% of voting rights at HoldCo',
      'No prior lender consent was obtained',
      'No waivers are in place',
      'No insolvency or payment default exists',
      'Cash flows of the project remain stable'
    ],
    'The sponsor sells 60% of HoldCo to a new investor. The transaction closes without notifying the lenders.',
    'intermediate',
    1
  );

-- 3. Insert Question
insert into questions (id, scenario_id, prompt, "order") values
  (
    'c1b2c3d4-0001-4000-8000-000000000001',
    'b1b2c3d4-0001-4000-8000-000000000001',
    'What is the most accurate immediate consequence under a typical international project finance facility?',
    1
  );

-- 4. Insert Answer Options
insert into answer_options (id, question_id, label, text, is_correct, correctness_type, legal_accuracy, market_practice, risk_awareness, perspective_awareness, composite, wrong_explanation) values
  (
    'd1b2c3d4-0001-4000-8000-000000000001',
    'c1b2c3d4-0001-4000-8000-000000000001',
    'A',
    'An automatic Event of Default occurs and the loan is immediately accelerated',
    false,
    'incorrect',
    20, 15, 25, 20, 20,
    'Incorrect. Acceleration generally requires an Event of Default and lender action. A Change of Control triggers a Potential Event of Default first, not an automatic acceleration. Neither an EoD nor lender action has occurred yet.'
  ),
  (
    'd1b2c3d4-0002-4000-8000-000000000001',
    'c1b2c3d4-0001-4000-8000-000000000001',
    'B',
    'A mandatory prepayment obligation is immediately triggered',
    false,
    'suboptimal',
    40, 35, 40, 30, 36,
    'Incorrect. Mandatory prepayment is usually triggered only after an Event of Default, or after expiry of the cure period without remediation. The immediate consequence is a Potential Event of Default, not yet a prepayment obligation.'
  ),
  (
    'd1b2c3d4-0003-4000-8000-000000000001',
    'c1b2c3d4-0001-4000-8000-000000000001',
    'C',
    'A Potential Event of Default arises and the cure period begins',
    true,
    'correct',
    95, 90, 85, 80, 88,
    null
  ),
  (
    'd1b2c3d4-0004-4000-8000-000000000001',
    'c1b2c3d4-0001-4000-8000-000000000001',
    'D',
    'No breach occurs because project cash flows are unaffected',
    false,
    'incorrect',
    10, 10, 15, 15, 13,
    'Incorrect. Project finance is control-driven, not purely cash-flow-driven. A Change of Control breach is triggered by the transfer of ownership, regardless of whether project cash flows remain stable.'
  );

-- 5. Insert Explanation
insert into explanations (id, question_id, correct_explanation, lender_perspective, borrower_perspective, learning_outcome) values
  (
    'e1b2c3d4-0001-4000-8000-000000000001',
    'c1b2c3d4-0001-4000-8000-000000000001',
    E'A Change of Control has occurred because control of HoldCo has transferred beyond the agreed threshold (60% > 50%).\n\nHowever, in a typical project finance structure:\n- Change of Control is not automatically an Event of Default\n- It is first treated as a Potential Event of Default\n- The agreed cure period (30 days) begins upon occurrence\n\nDuring the cure period, the borrower may:\n- Reverse the transaction\n- Obtain lender consent\n- Refinance the debt\n\nAcceleration does not occur unless the cure period expires without remediation.',
    E'From the lenders'' perspective:\n- Control risk has materially increased\n- The identity, creditworthiness, and incentives of the sponsor have changed\n- Immediate enforcement is usually not optimal\n- Preserving optionality during the cure period is preferred',
    E'From the borrower''s perspective:\n- The breach is serious but not fatal\n- The cure period provides time to manage the situation\n- Immediate engagement with lenders is critical\n- Failure to act escalates the risk significantly',
    E'The user should walk away understanding:\n- The difference between Potential EoD and EoD\n- The role of cure periods\n- Why lenders care about control even when cash flows are stable'
  );
