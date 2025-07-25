const express = require('express');
const { streamQuiz, streamMockQuiz } = require('../controllers/quiz.js');
const { validateQuizInput } = require('../middlewares/quiz.validator.js');
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
const router = express.Router();

router.post('/stream', validateQuizInput, asyncHandler(streamQuiz));
router.post('/mock-stream', validateQuizInput, asyncHandler(streamMockQuiz));

module.exports = router; 