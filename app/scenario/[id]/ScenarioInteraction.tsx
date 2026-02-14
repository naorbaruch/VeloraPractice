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

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color =
    score >= 80
      ? "bg-success"
      : score >= 50
        ? "bg-warning"
        : "bg-error";

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-40 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-mono w-8 text-right">{score}</span>
    </div>
  );
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

    // Save progress if user is logged in
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
    }
  }

  if (showGate && !isRevealed) {
    return (
      <div className="p-8 border-2 border-accent/30 rounded-lg text-center">
        <h2 className="text-xl font-semibold mb-3">
          Create an account to continue
        </h2>
        <p className="text-sm text-muted mb-6">
          You&apos;ve answered 5 questions. Sign up to save your progress and
          keep training.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/auth/signup"
            className="px-6 py-3 bg-accent text-white rounded-md hover:bg-accent-light transition-colors font-medium"
          >
            Create Account
          </a>
          <a
            href="/auth/login"
            className="px-6 py-3 border border-border rounded-md hover:bg-card transition-colors font-medium"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="text-xs text-muted mb-2">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <h2 className="text-lg font-semibold">{question.prompt}</h2>
      </div>

      <div className="grid gap-3 mb-6">
        {question.answer_options
          .sort((a, b) => a.label.localeCompare(b.label))
          .map((option) => {
            let borderClass = "border-border hover:border-accent/40";
            if (selectedAnswer === option.id && !isRevealed) {
              borderClass = "border-accent ring-2 ring-accent/20";
            }
            if (isRevealed) {
              if (option.is_correct) {
                borderClass = "border-success ring-2 ring-success/20";
              } else if (selectedAnswer === option.id) {
                borderClass = "border-error ring-2 ring-error/20";
              } else {
                borderClass = "border-border opacity-60";
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                disabled={isRevealed}
                className={`w-full text-left p-4 border-2 rounded-lg transition-all ${borderClass} ${
                  isRevealed ? "cursor-default" : "cursor-pointer"
                }`}
              >
                <div className="flex gap-3">
                  <span className="font-semibold text-accent shrink-0">
                    {option.label}.
                  </span>
                  <span className="text-sm">{option.text}</span>
                </div>
              </button>
            );
          })}
      </div>

      {!isRevealed && (
        <button
          onClick={handleSubmit}
          disabled={!selectedAnswer}
          className="px-6 py-3 bg-accent text-white rounded-md hover:bg-accent-light transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Lock In Answer
        </button>
      )}

      {isRevealed && selectedOption && correctOption && explanation && (
        <div className="mt-8 space-y-6">
          {/* Score */}
          <div className="p-6 border border-border rounded-lg bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Your Score</h3>
              <div className="text-2xl font-bold text-accent">
                {selectedOption.composite}
              </div>
            </div>
            <div className="space-y-3">
              <ScoreBar
                label="Legal Accuracy"
                score={selectedOption.legal_accuracy}
              />
              <ScoreBar
                label="Market Practice"
                score={selectedOption.market_practice}
              />
              <ScoreBar
                label="Risk Awareness"
                score={selectedOption.risk_awareness}
              />
              <ScoreBar
                label="Perspective Awareness"
                score={selectedOption.perspective_awareness}
              />
            </div>
          </div>

          {/* Correct answer explanation */}
          <div className="p-6 border border-success/30 rounded-lg bg-success/5">
            <h3 className="font-semibold text-success mb-3">
              Correct Answer: {correctOption.label}
            </h3>
            <div className="text-sm leading-relaxed whitespace-pre-line">
              {explanation.correct_explanation}
            </div>
          </div>

          {/* Perspectives */}
          {(explanation.lender_perspective ||
            explanation.borrower_perspective) && (
            <div className="grid md:grid-cols-2 gap-4">
              {explanation.lender_perspective && (
                <div className="p-6 border border-border rounded-lg">
                  <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted">
                    Lender Perspective
                  </h3>
                  <div className="text-sm leading-relaxed whitespace-pre-line">
                    {explanation.lender_perspective}
                  </div>
                </div>
              )}
              {explanation.borrower_perspective && (
                <div className="p-6 border border-border rounded-lg">
                  <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted">
                    Borrower Perspective
                  </h3>
                  <div className="text-sm leading-relaxed whitespace-pre-line">
                    {explanation.borrower_perspective}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Why other answers are wrong */}
          <div className="p-6 border border-border rounded-lg">
            <h3 className="font-semibold mb-4">Why Other Answers Are Wrong</h3>
            <div className="space-y-4">
              {question.answer_options
                .filter((a) => !a.is_correct)
                .sort((a, b) => a.label.localeCompare(b.label))
                .map((option) => (
                  <div key={option.id}>
                    <div className="text-sm font-semibold mb-1">
                      {option.label}. {option.text}
                    </div>
                    <p className="text-sm text-muted">
                      {option.wrong_explanation}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Learning outcome */}
          <div className="p-6 border border-accent/20 rounded-lg bg-accent/5">
            <h3 className="font-semibold mb-3 text-accent">Learning Outcome</h3>
            <div className="text-sm leading-relaxed whitespace-pre-line">
              {explanation.learning_outcome}
            </div>
          </div>

          {/* Next button */}
          {currentQuestion < questions.length - 1 && (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-accent text-white rounded-md hover:bg-accent-light transition-colors font-medium"
            >
              Next Question
            </button>
          )}
        </div>
      )}
    </div>
  );
}
