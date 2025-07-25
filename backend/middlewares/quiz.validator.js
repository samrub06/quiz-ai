const { z } = require('zod');

const containsForbiddenWord = [
  "sex", 
  "porn",
  "adult",
  "nudity",
  "violence",
  "gore",
  "hate",
  "sexuality",
];

const allowedTypes = ['mcq', 'true_false', 'open_ended','mix'];

const quizSchema = z.object({
  topic: z.string().min(1),
  subtopic: z.string().optional(),
  nbQuestions: z.number().min(1).max(50),
  level: z.string().optional(),
  lang: z.string().optional(),
  type: z.string().optional() 
});

function containsForbiddenWords(str) {
  if (!str) return false;
  return containsForbiddenWord.some(word => str.toLowerCase().includes(word));
}

function validateQuizInput(req, res, next) {
  try {
    req.body = quizSchema.parse(req.body);
    // Validation topic
    if (containsForbiddenWords(req.body.topic) || containsForbiddenWords(req.body.subtopic)) {
      const err = new Error('Topic contains forbidden word');
      err.status = 400;
      return next(err);
    }
    if (req.body.type && !allowedTypes.includes(req.body.type)) {
      const err = new Error('Invalid quiz type');
      err.status = 400;
      return next(err);
    }
    next();
  } catch (err) {
    err.status = 400;
    next(err);
  }
}

module.exports = { quizSchema, validateQuizInput };