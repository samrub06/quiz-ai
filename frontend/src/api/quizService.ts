import type { QuizParams, QuizQuestion } from '../types/quiz';

export async function streamQuiz(
  params: QuizParams,
  onQuestion: (q: QuizQuestion) => void,
  onComplete?: () => void
): Promise<void> {
  console.log('Starting stream with params:', params);
  
  // Add timeout to the fetch request
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout
  
  try {
    const response = await fetch('http://localhost:3000/api/quiz/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      let errorMsg = 'error_loading_quiz';
      try {
        const data = await response.json();
        errorMsg = data.error || errorMsg;
      } catch {
        // Ignore JSON parse errors, use default errorMsg
      }
      throw new Error(errorMsg);
    }
    
    if (!response.body) throw new Error('No response body');
    
    const reader = response.body.getReader();
    let buffer = '';
    let questionCount = 0;
    
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        console.log('Stream done, total questions received:', questionCount);
        break;
      }
      
      buffer += new TextDecoder().decode(value);
      const parts = buffer.split('\n\n');
      buffer = parts.pop() || '';
      
      for (const part of parts) {
        if (part.startsWith('data: ')) {
          const data = part.replace('data: ', '');
          if (data === 'done') {
            console.log('Received done signal');
            if (onComplete) onComplete();
            continue;
          }
          try {
            const question = JSON.parse(data);
            if (
              question &&
              typeof question === 'object' &&
              'question' in question &&
              'correctAnswer' in question &&
              'explanation' in question
            ) {
              questionCount++;
              console.log('Received question:', questionCount, question.question.substring(0, 50) + '...');
              // Accept questions with or without 'choices'
              onQuestion(question);
            }
          } catch {
            console.log('Parse error for chunk:', data.substring(0, 100));
            // Ignore JSON parse errors for incomplete chunks
          }
        }
      }
    }
    
    console.log('Stream completed, calling onComplete');
    if (onComplete) onComplete();
    
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - please try again');
    }
    throw error;
  }
} 