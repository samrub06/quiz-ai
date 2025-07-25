import { useEffect, useState } from 'react';
import QuizHistory from '../components/QuizHistory';
import type { QuizHistory as QuizHistoryType } from '../types/quiz';

export default function QuizHistoryPage() {
  const [history, setHistory] = useState<QuizHistoryType[]>([]);

  useEffect(() => {
    const h = localStorage.getItem('quiz-history');
    if (h) setHistory(JSON.parse(h));
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <QuizHistory history={history} />
    </div>
  );
} 