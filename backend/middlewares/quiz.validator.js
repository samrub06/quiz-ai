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

function validateQuizInput(req, res, next) {
  try {
    req.body = quizSchema.parse(req.body);
    // Validation topic

    if (containsForbiddenWord(req.body.topic || req.body.subtopic)) {
      return res.status(400).json({ error: 'Topic contains forbidden word' });
    }

    if (req.body.type && !allowedTypes.includes(req.body.type)) {
      return res.status(400).json({ error: 'Invalid quiz type' });
    } 
    next();
  } catch (err) {
    res.status(400).json({ error: err.errors });
  }
}

module.exports = { quizSchema, validateQuizInput };