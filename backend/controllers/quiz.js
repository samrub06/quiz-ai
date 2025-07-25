const { streamQuizToRes, streamMockQuizToRes } = require('../services/quizService.js');

async function streamQuiz(req, res) {
  const {
    topic = 'Math',
    subtopic = 'Algebra',
    nbQuestions = 10,
    level = '',
    lang = 'fr',
    type = 'mcq'
  } = req.body;
  await streamQuizToRes({ topic, subtopic, nbQuestions, level, lang, type }, res);
}

async function streamMockQuiz(req, res) {
  const {
    topic = 'Math',
    subtopic = 'Algebra',
    nbQuestions = 10,
    level = '',
    lang = 'fr',
    type = 'mcq'
  } = req.body;
  await streamMockQuizToRes({ topic, subtopic, nbQuestions, level, lang, type }, res);
}

module.exports = { streamQuiz, streamMockQuiz }; 