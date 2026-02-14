"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface AnswerOption {
  id: string;
  label: string;
  text: string;
  is_correct: boolean;
  correctness_type: string;
  legal_accuracy: number;
  market_practice: number;
  risk_awareness: number;
  perspective_awareness: number;
  composite: number;
  wrong_explanation: string | null;
}

interface Explanation {
  correct_explanation: string;
  lender_perspective: string | null;
  borrower_perspective: string | null;
  learning_outcome: string;
}

interface Question {
  id: string;
  prompt: string;
  order: number;
  answer_options: AnswerOption[];
  explanations: Explanation | Explanation[];
}

function getAnonymousCount(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem("velora_anon_count") || "0", 10);
}

function incrementAnonymousCount(): number {
  const count = getAnonymousCount() + 1;
  localStorage.setItem("velora_anon_count", count.toString());
  return count;
}

export default function ScenarioInteraction({
  questions,
}: {
  questions: Question[];
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null);
    });
  }, []);

  const question = questions[currentQuestion];
  const explanation = Array.isArray(question.explanations)
    ? question.explanations[0]
    : question.explanations;
  const selectedOption = question.answer_options.find(
    (a) => a.id === selectedAnswer
  );
  const correctOption = question.answer_options.find((a) => a.is_correct);

  function handleSelect(answerId: string) {
    if (isRevealed) return;
    setSelectedAnswer(answerId);
  }

  async function handleSubmit() {
    if (!selectedAnswer || isRevealed) return;

    if (!userId) {
      const count = incrementAnonymousCount();
      if (count >= 5) {
        setShowGate(true);
        return;
      }
    }

    setIsRevealed(true);

    if (userId) {
      const option = question.answer_options.find(
        (a) => a.id === selectedAnswer
      );
      if (option) {
        const supabase = createClient();
        await supabase.from("user_progress").upsert(
          {
            user_id: userId,
            question_id: question.id,
            selected_answer_id: selectedAnswer,
            composite_score: option.composite,
          },
          { onConflict: "user_id,question_id" }
        );
      }
    }
  }

  function handleNext() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsRevealed(false);
      setShowGate(false);
      setExpandedSection(null);
    }
  }

  function toggleSection(section: string) {
    setExpandedSection(expandedSection === section ? null : section);
  }

  // Gate screen
  if (showGate && !isRevealed) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-3">
          Create an account to continue
        </h2>
        <p className="text-muted mb-10 max-w-sm mx-auto">
          You&apos;ve used your 5 free questions. Sign up to save progress and
          keep training.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/auth/signup"
            className="px-8 py-4 bg-foreground text-background rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Create Account
          </a>
          <a
            href="/auth/login"
            className="px-8 py-4 text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Question */}
      <div className="mb-10">
        <p className="text-xs text-muted mb-4">
          Question {currentQuestion + 1} of {questions.length}
        </p>
        <h2 className="text-xl font-semibold leading-relaxed">
          {question.prompt}
        </h2>
      </div>

      {/* Answer options */}
      <div className="space-y-3 mb-10">
        {question.answer_options
          .sort((a, b) => a.label.localeCompare(b.label))
          .map((option) => {
            const isSelected = selectedAnswer === option.id;

            let stateStyles = "border-border/60 hover:border-foreground/20";
            if (isSelected && !isRevealed) {
              stateStyles = "border-foreground ring-1 ring-foreground/10";
            }
            if (isRevealed) {
              if (option.is_correct) {
                stateStyles =
                  "border-success bg-success-subtle";
              } else if (isSelected) {
                stateStyles =
                  "border-error bg-error-subtle";
              } else {
                stateStyles = "border-border/30 opacity-50";
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                disabled={isRevealed}
                className={`w-full text-left px-6 py-5 border rounded-xl transition-all duration-200 ${stateStyles} ${
                  isRevealed ? "cursor-default" : "cursor-pointer"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`text-sm font-bold shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                      isSelected && !isRevealed
                        ? "bg-foreground text-background"
                        : isRevealed && option.is_correct
                          ? "bg-success text-white"
                          : isRevealed && isSelected
                            ? "bg-error text-white"
                            : "bg-border/50 text-muted"
                    }`}
                  >
                    {option.label}
                  </span>
                  <span className="text-[15px] leading-relaxed pt-0.5">
                    {option.text}
                  </span>
                </div>
              </button>
            );
          })}
      </div>

      {/* Submit button */}
      {!isRevealed && (
        <button
          onClick={handleSubmit}
          disabled={!selectedAnswer}
          className="px-8 py-4 bg-foreground text-background rounded-full text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-20 disabled:cursor-not-allowed"
        >
          Lock In Answer
        </button>
      )}

      {/* Reveal */}
      {isRevealed && selectedOption && correctOption && explanation && (
        <div className="mt-12">
          {/* Score — single prominent number */}
          <div className="text-center py-12 border-b border-border/50">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              Your Score
            </p>
            <div
              className={`text-7xl font-bold tabular-nums ${
                selectedOption.composite >= 80
                  ? "text-success"
                  : selectedOption.composite >= 50
                    ? "text-warning"
                    : "text-error"
              }`}
            >
              {selectedOption.composite}
            </div>
            <p className="text-sm text-muted mt-3">out of 100</p>
          </div>

          {/* Correct answer explanation */}
          <div className="py-12 border-b border-border/50">
            <p className="text-xs font-semibold uppercase tracking-widest text-success mb-6">
              Correct Answer &mdash; {correctOption.label}
            </p>
            <div className="text-[15px] leading-[1.8] whitespace-pre-line text-foreground/90">
              {explanation.correct_explanation}
            </div>
          </div>

          {/* Expandable sections */}
          <div className="divide-y divide-border/50">
            {/* Lender perspective */}
            {explanation.lender_perspective && (
              <div>
                <button
                  onClick={() => toggleSection("lender")}
                  className="w-full flex items-center justify-between py-6 text-left"
                >
                  <span className="text-sm font-semibold">
                    Lender Perspective
                  </span>
                  <span className="text-muted text-lg">
                    {expandedSection === "lender" ? "\u2212" : "+"}
                  </span>
                </button>
                {expandedSection === "lender" && (
                  <div className="pb-8 text-[15px] leading-[1.8] whitespace-pre-line text-foreground/90">
                    {explanation.lender_perspective}
                  </div>
                )}
              </div>
            )}

            {/* Borrower perspective */}
            {explanation.borrower_perspective && (
              <div>
                <button
                  onClick={() => toggleSection("borrower")}
                  className="w-full flex items-center justify-between py-6 text-left"
                >
                  <span className="text-sm font-semibold">
                    Borrower Perspective
                  </span>
                  <span className="text-muted text-lg">
                    {expandedSection === "borrower" ? "\u2212" : "+"}
                  </span>
                </button>
                {expandedSection === "borrower" && (
                  <div className="pb-8 text-[15px] leading-[1.8] whitespace-pre-line text-foreground/90">
                    {explanation.borrower_perspective}
                  </div>
                )}
              </div>
            )}

            {/* Why others are wrong */}
            <div>
              <button
                onClick={() => toggleSection("wrong")}
                className="w-full flex items-center justify-between py-6 text-left"
              >
                <span className="text-sm font-semibold">
                  Why Other Answers Are Wrong
                </span>
                <span className="text-muted text-lg">
                  {expandedSection === "wrong" ? "\u2212" : "+"}
                </span>
              </button>
              {expandedSection === "wrong" && (
                <div className="pb-8 space-y-6">
                  {question.answer_options
                    .filter((a) => !a.is_correct)
                    .sort((a, b) => a.label.localeCompare(b.label))
                    .map((option) => (
                      <div key={option.id}>
                        <p className="text-sm font-semibold mb-1">
                          {option.label}. {option.text}
                        </p>
                        <p className="text-[15px] leading-relaxed text-muted">
                          {option.wrong_explanation}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Learning outcome */}
            <div>
              <button
                onClick={() => toggleSection("outcome")}
                className="w-full flex items-center justify-between py-6 text-left"
              >
                <span className="text-sm font-semibold text-accent">
                  Learning Outcome
                </span>
                <span className="text-muted text-lg">
                  {expandedSection === "outcome" ? "\u2212" : "+"}
                </span>
              </button>
              {expandedSection === "outcome" && (
                <div className="pb-8 text-[15px] leading-[1.8] whitespace-pre-line text-foreground/90">
                  {explanation.learning_outcome}
                </div>
              )}
            </div>
          </div>

          {/* Next */}
          {currentQuestion < questions.length - 1 && (
            <div className="pt-12">
              <button
                onClick={handleNext}
                className="px-8 py-4 bg-foreground text-background rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Next Question
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
