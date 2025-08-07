const { z } = require('zod');
const fetch = require('node-fetch');
const { QUIZ_TYPES } = require('../constants/quizTypes');

// Dynamic learning cache for forbidden words
const forbiddenWordsCache = new Map();
const flaggedWordsCache = new Map(); // Words flagged by OpenAI
const safeWordsCache = new Map(); // Words confirmed safe by OpenAI

// Initial static forbidden words
const staticForbiddenWords = [
  "sex", 
  "porn",
  "adult",
  "nudity",
  "violence",
  "gore",
  "hate",
  "sexuality",
];

// Initialize cache with static words
staticForbiddenWords.forEach(word => {
  forbiddenWordsCache.set(word.toLowerCase(), {
    source: 'static',
    confidence: 1.0,
    categories: ['explicit']
  });
});

const allowedTypes = [QUIZ_TYPES.MCQ, QUIZ_TYPES.TRUE_FALSE, QUIZ_TYPES.OPEN_ENDED, QUIZ_TYPES.MIX];

const quizSchema = z.object({
  topic: z.string().min(1),
  subtopic: z.string().optional(),
  nbQuestions: z.number().min(1).max(50),
  level: z.string().optional(),
  lang: z.string().optional(),
  type: z.string().optional() 
});

// Extract words from text for learning
function extractWords(text) {
  if (!text) return [];
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
}

// Enhanced local check with learning cache
function containsForbiddenWords(str) {
  if (!str) return false;
  
  const words = extractWords(str);
  
  for (const word of words) {
    // Check static forbidden words
    if (forbiddenWordsCache.has(word)) {
      return true;
    }
    
    // Check flagged words from OpenAI
    if (flaggedWordsCache.has(word)) {
      return true;
    }
  }
  
  return false;
}

// Learn from OpenAI moderation results
function learnFromModeration(text, moderationResult) {
  const words = extractWords(text);
  
  if (moderationResult.flagged) {
    // Learn flagged words
    words.forEach(word => {
      if (!flaggedWordsCache.has(word)) {
        flaggedWordsCache.set(word, {
          source: 'openai',
          confidence: Math.max(...Object.values(moderationResult.category_scores)),
          categories: Object.keys(moderationResult.categories).filter(cat => moderationResult.categories[cat]),
          timestamp: Date.now()
        });
      }
    });
  } else {
    // Learn safe words (with lower confidence)
    words.forEach(word => {
      if (!forbiddenWordsCache.has(word) && !flaggedWordsCache.has(word)) {
        safeWordsCache.set(word, {
          source: 'openai',
          confidence: 0.1,
          timestamp: Date.now()
        });
      }
    });
  }
  
  // Log cache statistics
  console.log(`Cache stats - Forbidden: ${forbiddenWordsCache.size}, Flagged: ${flaggedWordsCache.size}, Safe: ${safeWordsCache.size}`);
}

// OpenAI Moderation API function
async function checkModeration(text) {
  if (!text || !process.env.OPENAI_API_KEY) {
    return { flagged: false };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: text
      })
    });

    if (!response.ok) {
      console.error('Moderation API error:', response.status);
      return { flagged: false };
    }

    const data = await response.json();
    return data.results[0];
  } catch (error) {
    console.error('Moderation API error:', error);
    return { flagged: false };
  }
}



function clearCache() {
  flaggedWordsCache.clear();
  safeWordsCache.clear();
  console.log('Dynamic cache cleared');
}

async function validateQuizInput(req, res, next) {
  try {
    req.body = quizSchema.parse(req.body);
    
    // Combine topic and subtopic for moderation check
    const contentToCheck = [req.body.topic];
    if (req.body.subtopic) {
      contentToCheck.push(req.body.subtopic);
    }
    const fullText = contentToCheck.join(' ');

    // Enhanced local check with learning cache
    if (containsForbiddenWords(req.body.topic) || containsForbiddenWords(req.body.subtopic)) {
      const err = new Error('Topic contains forbidden word (local cache)');
      err.status = 400;
      err.details = {
        flagged: true,
        source: 'local_cache',
      };
      return next(err);
    }

    // OpenAI Moderation API check (more comprehensive)
    const moderationResult = await checkModeration(fullText);
    
    // Learn from the result to improve local cache
    learnFromModeration(fullText, moderationResult);
    
    if (moderationResult.flagged) {
      const categories = moderationResult.categories;
      const flaggedCategories = Object.keys(categories).filter(cat => categories[cat]);
      
      const err = new Error(`Content flagged for: ${flaggedCategories.join(', ')}`);
      err.status = 400;
      err.details = {
        flagged: true,
        categories: flaggedCategories,
        scores: moderationResult.category_scores,
        source: 'openai',
      };
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

module.exports = { 
  quizSchema, 
  validateQuizInput, 
  clearCache,
  forbiddenWordsCache,
  flaggedWordsCache,
  safeWordsCache
};