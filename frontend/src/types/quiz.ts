export interface QuizQuestion {
  question: string;
  choices?: string[];
  correctAnswer: string;
  explanation: string;
  type?: 'mcq' | 'true_false' | 'open_ended';
}

export interface QuizParams {
  topic: string;
  subtopic?: string;
  nbQuestions: number;
  level?: string;
  lang?: string;
  type?: string; // Quiz type (e.g., Multiple Choice, True/False)
}

export interface QuizHistoryAnswer {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  questionNumber?: number;
}

export interface QuizHistory {
  date: string;
  params: QuizParams;
  score: number;
  total: number;
  answers: QuizHistoryAnswer[];
} 