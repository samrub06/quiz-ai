// Quiz type constants
export const QUIZ_TYPES = {
  MCQ: 'mcq',
  TRUE_FALSE: 'true_false',
  OPEN_ENDED: 'open_ended',
  MIX: 'mix'
} as const;

// Quiz type labels for display
export const QUIZ_TYPE_LABELS = {
  [QUIZ_TYPES.MCQ]: 'mcq',
  [QUIZ_TYPES.TRUE_FALSE]: 'true_false',
  [QUIZ_TYPES.OPEN_ENDED]: 'open_ended',
  [QUIZ_TYPES.MIX]: 'mcq, true_false, open_ended'
} as const;

// Type for quiz types
export type QuizType = typeof QUIZ_TYPES[keyof typeof QUIZ_TYPES]; 