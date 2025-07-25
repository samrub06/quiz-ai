const cors = require('cors');
require('dotenv/config');
const express = require('express');
const path = require('path');
const errorHandler = require('./middlewares/errors.handler.js');
const quizRouter = require('./routes/quiz.js');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/quiz', quizRouter);

// Serve static files from the frontend build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// For any other route, serve index.html (for SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;