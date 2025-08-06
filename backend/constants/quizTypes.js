// Quiz type constants
const QUIZ_TYPES = {
  MCQ: 'mcq',
  TRUE_FALSE: 'true_false',
  OPEN_ENDED: 'open_ended',
  MIX: 'mix'
};

// Quiz type labels for display
const QUIZ_TYPE_LABELS = {
  [QUIZ_TYPES.MCQ]: 'mcq',
  [QUIZ_TYPES.TRUE_FALSE]: 'true_false',
  [QUIZ_TYPES.OPEN_ENDED]: 'open_ended',
  [QUIZ_TYPES.MIX]: 'mcq, true_false, open_ended'
};

module.exports = {
  QUIZ_TYPES,
  QUIZ_TYPE_LABELS
}; 