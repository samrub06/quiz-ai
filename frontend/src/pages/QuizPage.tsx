import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { streamQuiz } from '../api/quizService';
import QuizForm from '../components/QuizForm';
import QuizQuestionsPanel from '../components/QuizQuestionsPanel';
import QuizResult from '../components/QuizResult';
import type { QuizParams, QuizQuestion } from '../types/quiz';

export default function QuizPage() {
  const { i18n, t } = useTranslation();
  // Step: 'form' | 'quiz' | 'result'
  const [step, setStep] = useState<'form' | 'quiz' | 'result'>('form');
  const [params, setParams] = useState<QuizParams>({
    topic: '',
    subtopic: '',
    nbQuestions: 10,
    level: '',
    lang: i18n.language,
  });
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ userAnswer: string; correctAnswer: string; question: string; explanation: string }[]>([]);
  const [historySaved, setHistorySaved] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setParams(prev => ({ ...prev, lang: i18n.language }));
  }, [i18n.language]);

  useEffect(() => {
    restart();
  }, [location.key]);

  // Centralized state reset for quiz
  const resetState = () => {
    setQuestions([]);
    setCurrent(0);
    setSelected(null);
    setShowExplanation(false);
    setScore(0);
    setUserAnswers([]);
    setHistorySaved(false);
    setError(null);
  };

  // Launching the quiz from the form
  const handleStartQuiz = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    resetState(); // Use centralized reset
    setLoading(true);
    setStep('quiz');
    try {
      await streamQuiz(
        params, 
        (question) => {
          setQuestions(qs => {
            if (qs.length === 0) {
              setLoading(false); // loader off at first question
            }
            return [...qs, question];
          });
        },
        () => {
          // Stream completed
          setLoading(false);
        }
      );
    } catch (err: unknown) {
      console.error('Error fetching quiz:', err);
      setError(err instanceof Error ? err.message : 'Error fetching quiz');
      setLoading(false);
      setStep('form');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: name === 'nbQuestions' ? Number(value) : value
    }));
  };

  const handleSelect = (choice: string) => {
    if (selected !== null) return;
    setSelected(choice);
    setShowExplanation(true);
    setUserAnswers(ans => {
      // Update the answer for the current question if it exists, otherwise add it
      const updated = [...ans];
      if (updated[current]) {
        updated[current] = {
          userAnswer: choice,
          correctAnswer: questions[current].correctAnswer,
          question: questions[current].question,
          explanation: questions[current].explanation,
        };
      } else {
        updated[current] = {
          userAnswer: choice,
          correctAnswer: questions[current].correctAnswer,
          question: questions[current].question,
          explanation: questions[current].explanation,
        };
      }
      return updated;
    });
    if (choice === questions[current].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (current + 1 >= params.nbQuestions) return;
    if (selected === null) {
      setUserAnswers(ans => {
        // If no answer was selected, mark as unanswered for the current question
        const updated = [...ans];
        if (!updated[current]) {
          updated[current] = {
            userAnswer: '',
            correctAnswer: questions[current].correctAnswer,
            question: questions[current].question,
            explanation: questions[current].explanation,
          };
        }
        return updated;
      });
    }
    setCurrent(c => c + 1);
    setSelected(null);
    setShowExplanation(false);
  };

  const prevQuestion = () => {
    // Just navigate back, do not remove answers
    if (current > 0) {
      setCurrent(c => c - 1);
      setSelected(userAnswers[current - 1]?.userAnswer || null);
      setShowExplanation(true);
    }
  };

  const restart = () => {
    resetState(); // Use centralized reset
    setStep('form');
  };

  const regenerate = () => {
    restart();
    setStep('quiz');
    handleStartQuiz();
  };

  const handleShowResult = () => {
    setStep('result');
    // Save QuizHistory array in localStorage with error handling
    try {
      const prevHistory = JSON.parse(localStorage.getItem('quiz-history') || '[]');
      const newEntry = {
        date: new Date().toLocaleString(),
        params,
        score,
        total: questions.length,
        answers: userAnswers.map((a, idx) => ({ ...a, questionNumber: idx + 1 }))
      };
      localStorage.setItem('quiz-history', JSON.stringify([newEntry, ...prevHistory]));
      setHistorySaved(true);
    } catch {
      // If localStorage fails, show an error message (could be improved for UX)
      setError('localStorage_error');
    }
  };

  return (
    <div className="flex flex-row gap-6 max-w-7xl mx-auto w-full py-2 transition-all duration-300">
      <div className="flex-1 flex flex-col items-center transition-all duration-300">
        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto p-6" role="alert" aria-live="assertive">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3" aria-hidden="true"></div>
                <div className="text-red-800 font-medium">{t(error)}</div>
              </div>
            </div>
          </div>
        )}
        {/* Configuration form */}
        {step === 'form' && (
          <div className="w-full max-w-2xl mx-auto">
            <QuizForm params={params} onChange={handleChange} onSubmit={handleStartQuiz} loading={loading} />
          </div>
        )}
        {/* Loader while loading the first question */}
        {step === 'quiz' && loading && questions.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 w-full " role="status" aria-live="polite">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent border-solid rounded-full animate-spin mb-6" aria-hidden="true"></div>
            <div className="text-gray-600 text-lg font-medium">{t('loading_first_question')}</div>
            <div className="text-gray-500 text-sm mt-2">{t('please_wait')}</div>
          </div>
        )}
        {/* Quiz */}
        {step === 'quiz' && questions.length > 0 && (
          <QuizQuestionsPanel
            questions={questions}
            current={current}
            selected={selected}
            onSelect={handleSelect}
            onNext={nextQuestion}
            onPrev={prevQuestion}
            showExplanation={showExplanation}
            nbQuestions={params.nbQuestions}
            onShowResult={handleShowResult}
            loading={loading}
            historySaved={historySaved}
            topic={params.topic || ''}
            subtopic={params.subtopic || ''}
            level={params.level || ''}
          />
        )}
        {/* Result */}
        {step === 'result' && (
          <QuizResult
            questions={questions}
            userAnswers={userAnswers}
            score={score}
            onRestart={restart}
            onRegenerate={regenerate}
          />
        )}
      </div>
    </div>
  );
} 