const fetch = require('node-fetch');

async function streamQuizToRes(params, res) {
  const { topic, subtopic, nbQuestions, level, lang, type = 'mcq' } = params;
  // Estimate: 80 tokens per question + 20% margin
  const estimatedTokensPerQuestion = 80;
  const margin = 1.2;
  const max_tokens = Math.ceil(nbQuestions * estimatedTokensPerQuestion * margin);

  // System prompt: global instructions for quiz generation
  const systemPrompt =
    'You are a quiz generator. For each question, return exactly one JSON object per line, with the fields: question, correctAnswer, explanation, type. If the type is "mcq", add a "choices" array (4 options exactly). If the type is "true_false" or "open_ended", do NOT include the "choices" field at all. No extra text, no array, no explanation, no extra line, only one JSON object per line. If the topic or request is abusive, racist, sexual, adult, or inappropriate for people under 18, respond with a single line: {"error": "inappropriate content"}.';

  // User prompt: only the specific request
  let typeLabel = type === 'mix' ? 'mcq, true_false, open_ended' : type;
  let userPrompt = `Generate exactly ${nbQuestions} questions of type "${typeLabel}" on the topic "${topic}"`;
  if (subtopic) userPrompt += `, subtopic "${subtopic}"`;
  if (level) userPrompt += `, level "${level}"`;
  userPrompt += ".";
  if (lang && lang !== 'en') userPrompt += ` The questions must be in ${lang}.`;

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      stream: true,
      max_tokens: max_tokens
    })
  });

  let buffer = '';
  let ndjsonBuffer = '';
  let questionCount = 0;

  for await (const chunk of openaiRes.body) {
    buffer += chunk.toString();
    const lines = buffer.split('\n').filter(line => line.trim() !== '');
    buffer = '';
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.replace('data: ', '');
        if (data === '[DONE]') {
          console.log(`Stream completed. Generated ${questionCount} questions out of ${nbQuestions} requested.`);
          
          // Check if we need to generate missing questions
          if (questionCount < nbQuestions) {
            console.log(`Generating ${nbQuestions - questionCount} missing questions...`);
            await generateMissingQuestions(params, res, questionCount, nbQuestions);
          } else {
            res.write('event: end\ndata: done\n\n');
            res.end();
          }
          return;
        }
        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta?.content || '';
          ndjsonBuffer += delta;

          // Check if we have a complete JSON object (same number of { and })
          let openBraces = (ndjsonBuffer.match(/{/g) || []).length;
          let closeBraces = (ndjsonBuffer.match(/}/g) || []).length;
          if (openBraces > 0 && openBraces === closeBraces) {
            try {
              const question = JSON.parse(ndjsonBuffer);
              // Check for inappropriate content error from the AI
              if (question && question.error === 'inappropriate content') {
                res.write('event: error\ndata: inappropriate content\n\n');
                res.end();
                return;
              }
              if (
                question &&
                typeof question === 'object' &&
                'question' in question &&
                'explanation' in question
              ) {
                // Ensure type is present
                if (!('type' in question)) {
                  question.type = type;
                }
                // Remove choices if not an array (never send choices: null or choices for true_false/open_ended)
                if (!Array.isArray(question.choices)) {
                  delete question.choices;
                }
                // Ensure choices is always an array for mcq
                if (question.type === 'mcq' && question.choices && typeof question.choices === 'object' && !Array.isArray(question.choices)) {
                  question.choices = Object.values(question.choices);
                }
                questionCount++;
                console.log(`Sending question ${questionCount}/${nbQuestions} to frontend:`, question.question.substring(0, 50) + '...');
                res.write(`data: ${JSON.stringify(question)}\n\n`);
                
                // If we have all questions, end the stream
                if (questionCount >= nbQuestions) {
                  console.log(`All ${nbQuestions} questions generated. Ending stream.`);
                  res.write('event: end\ndata: done\n\n');
                  res.end();
                  return;
                }
              }
            } catch (e) {
              // Ignore parse errors
            }
            ndjsonBuffer = '';
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }
  
  // If we reach here, the stream ended but we might not have all questions
  console.log(`Stream ended. Generated ${questionCount} questions out of ${nbQuestions} requested.`);
  
  // Check if we need to generate missing questions
  if (questionCount < nbQuestions) {
    console.log(`Generating ${nbQuestions - questionCount} missing questions...`);
    await generateMissingQuestions(params, res, questionCount, nbQuestions);
  } else {
    res.write('event: end\ndata: done\n\n');
    res.end();
  }
}

// Helper function to generate missing questions
async function generateMissingQuestions(params, res, currentCount, targetCount) {
  const { topic, subtopic, level, lang, type = 'mcq' } = params;
  const missingCount = targetCount - currentCount;

  // System prompt: global instructions for quiz generation
  const systemPrompt =
    'You are a quiz generator. For each question, return exactly one JSON object per line, with the fields: question, correctAnswer, explanation, type. If the type is "mcq", add a "choices" array (4 options exactly). If the type is "true_false" or "open_ended", do NOT include the "choices" field at all. No extra text, no array, no explanation, no extra line, only one JSON object per line. If the topic or request is abusive, racist, sexual, adult, or inappropriate for people under 18, respond with a single line: {"error": "inappropriate content"}.';

  // User prompt: only the specific request for missing questions
  let typeLabel = type === 'mix' ? 'mcq, true_false, open_ended' : type;
  let userPrompt = `Generate exactly ${missingCount} additional questions of type "${typeLabel}" on the topic "${topic}"`;
  if (subtopic) userPrompt += `, subtopic "${subtopic}"`;
  if (level) userPrompt += `, level "${level}"`;
  userPrompt += ".";
  if (lang && lang !== 'en') userPrompt += ` The questions must be in ${lang}.`;

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        stream: false,
        max_tokens: 2000
      })
    });

    const data = await openaiRes.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Parse the response and extract questions
    const lines = content.split('\n').filter(line => line.trim() !== '');
    let generatedCount = 0;
    
    for (const line of lines) {
      if (generatedCount >= missingCount) break;
      
      try {
        const question = JSON.parse(line.trim());
        // Check for inappropriate content error from the AI
        if (question && question.error === 'inappropriate content') {
          res.write('event: error\ndata: inappropriate content\n\n');
          res.end();
          return;
        }
        if (
          question &&
          typeof question === 'object' &&
          'question' in question &&
          'explanation' in question
        ) {
          // Ensure type is present
          if (!('type' in question)) {
            question.type = type;
          }
          // Remove choices if not an array
          if (!Array.isArray(question.choices)) {
            delete question.choices;
          }
          // Ensure choices is always an array for mcq
          if (question.type === 'mcq' && question.choices && typeof question.choices === 'object' && !Array.isArray(question.choices)) {
            question.choices = Object.values(question.choices);
          }
          
          generatedCount++;
          currentCount++;
          console.log(`Sending fallback question ${currentCount}/${targetCount} to frontend:`, question.question.substring(0, 50) + '...');
          res.write(`data: ${JSON.stringify(question)}\n\n`);
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    console.log(`Fallback completed. Generated ${generatedCount} additional questions.`);
  } catch (error) {
    console.error('Error generating fallback questions:', error);
  }
  
  res.write('event: end\ndata: done\n\n');
  res.end();
}

async function streamMockQuizToRes(params, res) {
  const { topic = 'Math', subtopic = 'Algebra', nbQuestions = 10, level = '', lang = 'en', type = 'mcq' } = params;
  for (let i = 1; i <= nbQuestions; i++) {
    let question;
    if (type === 'mix') {
      if (i % 3 === 1) {
        question = {
          question: `Sample MCQ question ${i} about ${topic}${subtopic ? ' (' + subtopic + ')' : ''}`,
          choices: [
            `Choice A${i}`,
            `Choice B${i}`,
            `Choice C${i}`,
            `Choice D${i}`
          ],
          correctAnswer: `Choice A${i}`,
          explanation: `This is a mock explanation for question ${i}.`,
          type: 'mcq'
        };
      } else if (i % 3 === 2) {
        question = {
          question: `Sample true/false question ${i} about ${topic}${subtopic ? ' (' + subtopic + ')' : ''}`,
          choices: ["True", "False"],
          correctAnswer: i % 2 === 0 ? "True" : "False",
          explanation: `This is a mock explanation for question ${i}.`,
          type: 'true_false'
        };
      } else {
        question = {
          question: `Sample open-ended question ${i} about ${topic}${subtopic ? ' (' + subtopic + ')' : ''}`,
          correctAnswer: `Sample answer for question ${i}`,
          explanation: `This is a mock explanation for question ${i}.`,
          type: 'open_ended'
        };
      }
    } else if (type === 'mcq') {
      question = {
        question: `Sample MCQ question ${i} about ${topic}${subtopic ? ' (' + subtopic + ')' : ''}`,
        choices: [
          `Choice A${i}`,
          `Choice B${i}`,
          `Choice C${i}`,
          `Choice D${i}`
        ],
        correctAnswer: `Choice A${i}`,
        explanation: `This is a mock explanation for question ${i}.`,
        type: 'mcq'
      };
    } else if (type === 'true_false') {
      question = {
        question: `Sample true/false question ${i} about ${topic}${subtopic ? ' (' + subtopic + ')' : ''}`,
        choices: ["True", "False"],
        correctAnswer: i % 2 === 0 ? "True" : "False",
        explanation: `This is a mock explanation for question ${i}.`,
        type: 'true_false'
      };
    } else if (type === 'open_ended') {
      question = {
        question: `Sample open-ended question ${i} about ${topic}${subtopic ? ' (' + subtopic + ')' : ''}`,
        correctAnswer: `Sample answer for question ${i}`,
        explanation: `This is a mock explanation for question ${i}.`,
        type: 'open_ended'
      };
    }
    await new Promise(r => setTimeout(r, 300));
    res.write(`data: ${JSON.stringify(question)}\n\n`);
  }
  res.write('event: end\ndata: done\n\n');
  res.end();
}

module.exports = { streamQuizToRes, streamMockQuizToRes }; 