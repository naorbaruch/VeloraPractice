export interface Track {
  id: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  created_at: string;
}

export interface Scenario {
  id: string;
  track_id: string;
  scenario_code: string; // e.g. "PF-COC-001"
  title: string;
  context: string;
  assumptions: string[];
  trigger_event: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  order: number;
  created_at: string;
}

export interface Question {
  id: string;
  scenario_id: string;
  prompt: string;
  order: number;
}

export interface AnswerOption {
  id: string;
  question_id: string;
  label: string; // "A", "B", "C", "D"
  text: string;
  is_correct: boolean;
  correctness_type: "correct" | "suboptimal" | "incorrect";
  scores: {
    legal_accuracy: number;
    market_practice: number;
    risk_awareness: number;
    perspective_awareness: number;
    composite: number;
  };
  wrong_explanation: string | null; // why this answer is wrong (null for correct answer)
}

export interface Explanation {
  id: string;
  question_id: string;
  correct_explanation: string;
  lender_perspective: string | null;
  borrower_perspective: string | null;
  learning_outcome: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  question_id: string;
  selected_answer_id: string;
  composite_score: number;
  answered_at: string;
}

// Combined types for UI
export interface ScenarioWithQuestions extends Scenario {
  track: Track;
  questions: QuestionWithAnswers[];
}

export interface QuestionWithAnswers extends Question {
  answer_options: AnswerOption[];
  explanation: Explanation;
}
