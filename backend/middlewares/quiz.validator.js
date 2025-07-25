const { z } = require('zod');

const allowedTopics = [
  'Math', 'Science', 'History', 'Geography', 'Literature', 'Art', 'Music', 'Technology', 'Sports', 'Languages'
];
const allowedSubtopics = [
  'Algebra', 'Geometry', 'Biology', 'Physics', 'Chemistry', 'World War II', 'Painting', 'Classical', 'Programming', 'Football', 'English', 'French'
];
const allowedTypes = ['mcq', 'true_false', 'open_ended'];


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
   /*  if (!allowedTopics.includes(req.body.topic)) {
      return res.status(400).json({ error: 'Invalid or unknown topic' });
    }
    if (containsForbiddenWord(req.body.topic)) {
      return res.status(400).json({ error: 'Topic contains forbidden word' });
    }
    if (req.body.subtopic) {
      if (!allowedSubtopics.includes(req.body.subtopic)) {
        return res.status(400).json({ error: 'Invalid or unknown subtopic' });
      }
      if (containsForbiddenWord(req.body.subtopic)) {
        return res.status(400).json({ error: 'Subtopic contains forbidden word' });
      }
    }
    if (req.body.type && !allowedTypes.includes(req.body.type)) {
      return res.status(400).json({ error: 'Invalid quiz type' });
    } */
    next();
  } catch (err) {
    res.status(400).json({ error: err.errors });
  }
}

module.exports = { quizSchema, validateQuizInput };