const cors = require('cors');
require('dotenv/config');
const express = require('express');
const errorHandler = require('./middlewares/errors.handler.js');
const quizRouter = require('./routes/quiz.js');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/quiz', quizRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;