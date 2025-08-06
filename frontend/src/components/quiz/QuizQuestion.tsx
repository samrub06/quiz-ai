import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { QUIZ_TYPES } from '../../constants/quizTypes';
import type { QuizQuestion } from '../../types/quiz';

interface Props {
  question: QuizQuestion;
  selected: string | null;
  onSelect: (choice: string) => void;
  showExplanation: boolean;
  disabled: boolean;
  isLast: boolean;
  onNext?: () => void;
  onFinish?: () => void;
  nextOnTop?: boolean;
  backEnabled?: boolean;
  onBack?: () => void;
}

export default function QuizQuestion({
  question, selected, onSelect, showExplanation, disabled, isLast, onNext, onFinish, nextOnTop, backEnabled, onBack
}: Props) {
  const { t } = useTranslation();

  // Keyboard navigation state
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const choicesRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [openAnswer, setOpenAnswer] = useState('');
  // State for open answer error
  const [openAnswerError, setOpenAnswerError] = useState<string | null>(null);

  useEffect(() => {
    setOpenAnswer('');
  }, [question]);

  // Focus the selected or first choice on mount or when question changes
  useEffect(() => {
    if (selected && question.choices && question.choices.length > 0) {
      const idx = question.choices.findIndex(c => c === selected);
      setFocusedIndex(idx >= 0 ? idx : 0);
    } else {
      setFocusedIndex(0);
    }
  }, [question, selected]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selected || disabled) return;
      if (!question.choices || question.choices.length === 0) return;

      const key = event.key.toUpperCase();
      
      // Handle A, B, C, D keys for direct selection
      if (["A", "B", "C", "D"].includes(key) && question.choices) {
        const index = key.charCodeAt(0) - 65; // Convert A=0, B=1, C=2, D=3
        if (index >= 0 && index < question.choices.length) {
          event.preventDefault();
          onSelect(question.choices[index]);
        }
        return;
      }
      // Handle arrow keys for navigation
      if ((event.key === 'ArrowDown' || event.key === 'ArrowRight') && question.choices) {
        event.preventDefault();
        setFocusedIndex(prev => (prev + 1) % question.choices!.length);
      } else if ((event.key === 'ArrowUp' || event.key === 'ArrowLeft') && question.choices) {
        event.preventDefault();
        setFocusedIndex(prev => (prev - 1 + question.choices!.length) % question.choices!.length);
      }
      // Handle Enter/Space for selection
      if ((event.key === 'Enter' || event.key === ' ') && question.choices) {
        event.preventDefault();
        onSelect(question.choices[focusedIndex]);
      }

      // Handle N for next
      if (event.key === 'N' && onNext && !disabled) {
        event.preventDefault();
        onNext();
      }

      // Handle B for back
      if (event.key === 'B' && onBack && backEnabled) {
        event.preventDefault();
        onBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selected, disabled, focusedIndex, question.choices, onSelect, onNext, onFinish, onBack, backEnabled]);


  

  const getChoiceStyle = (choice: string) => {
    if (!selected) {
      return "w-full p-3 sm:p-4 text-left border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer text-sm sm:text-base";
    }
    if (choice === question.correctAnswer) {
      return "w-full p-3 sm:p-4 text-left border-2 border-green-500 bg-green-50 rounded-xl cursor-default text-sm sm:text-base";
    }
    if (choice === selected) {
      return "w-full p-3 sm:p-4 text-left border-2 border-red-500 bg-red-50 rounded-xl cursor-default text-sm sm:text-base";
    }
    return "w-full p-3 sm:p-4 text-left border-2 border-gray-200 bg-gray-50 rounded-xl cursor-default opacity-60 text-sm sm:text-base";
  };

  // Zod schema for open answer (simple sanitation: non-empty, no < >)
  const openAnswerSchema = z.string().min(1, 'Answer required').max(200, 'Too long').regex(/^[^<>]*$/, 'Invalid characters');

  // Render Next/Finish button with keyboard shortcut icon
  const renderNextButton = () => (
    !isLast ? (
      <button
        onClick={onNext}
        disabled={disabled}
        className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-4 text-sm sm:text-base"
      >
        <span className="mr-2">➡️</span>
        {t('next_question')}
        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-mono">N</span>
      </button>
    ) : (
      <button
        onClick={onFinish}
        className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 mb-4 text-sm sm:text-base"
      >
        <span className="mr-2">🏆</span>
        {t('see_score')}
        <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-mono">N</span>
      </button>
    )
  );

  // Display according question type
  let content;
  if (question.type === QUIZ_TYPES.OPEN_ENDED) {
    content = (
      <form
        onSubmit={e => {
          e.preventDefault();
          // Validate and sanitize open answer
          const result = openAnswerSchema.safeParse(openAnswer.trim());
          if (!selected && openAnswer.trim()) {
            if (!result.success) {
              setOpenAnswerError(result.error.issues[0].message);
              return;
            }
            setOpenAnswerError(null);
            onSelect(result.data);
          }
        }}
        className="space-y-4"
      >
        <input
          type="text"
          value={openAnswer}
          onChange={e => {
            setOpenAnswer(e.target.value);
            setOpenAnswerError(null); // Clear error on change
          }}
          disabled={!!selected}
          className={`w-full p-3 sm:p-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${openAnswerError ? 'border-red-500' : 'border-gray-200'}`}
          placeholder={t('your_answer') || 'Your answer'}
          aria-invalid={!!openAnswerError}
          aria-describedby={openAnswerError ? 'open-answer-error' : undefined}
        />
        {/* Error message for open answer */}
        {openAnswerError && (
          <div id="open-answer-error" className="text-red-500 text-xs sm:text-sm mt-1" role="alert">{openAnswerError}</div>
        )}
        <button
          type="submit"
          disabled={!!selected || !openAnswer.trim()}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-4 text-sm sm:text-base"
        >
          {isLast ? t('see_score') : t('next_question')}
        </button>
      </form>
    );
  } else if (question.type === QUIZ_TYPES.TRUE_FALSE) {
    content = (
      <div className="space-y-4" role="listbox" aria-label={t('choices')}>
        {['True', 'False'].map((choice, index) => (
          <button
            key={index}
            ref={el => { choicesRefs.current[index] = el; }}
            disabled={!!selected}
            className={getChoiceStyle(choice) + (focusedIndex === index && !selected ? ' ring-2 ring-blue-400 ring-offset-2' : '')}
            onClick={() => onSelect(choice)}
            tabIndex={selected ? -1 : 0}
            aria-selected={selected ? (selected === choice) : (focusedIndex === index)}
            role="option"
          >
            <div className="flex items-center">
              <span className="text-lg">{choice}</span>
            </div>
          </button>
        ))}
      </div>
    );
  } else {
    // mcq ou fallback
    content = (
      <div className="space-y-4" role="listbox" aria-label={t('choices')}>
        {question.choices && question.choices.map((choice, index) => (
          <button
            key={index}
            ref={el => { choicesRefs.current[index] = el; }}
            disabled={!!selected}
            className={getChoiceStyle(choice) + (focusedIndex === index && !selected ? ' ring-2 ring-blue-400 ring-offset-2' : '')}
            onClick={() => onSelect(choice)}
            tabIndex={selected ? -1 : 0}
            aria-selected={selected ? (selected === choice) : (focusedIndex === index)}
            role="option"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-4 text-sm font-semibold text-gray-600">
                {String.fromCharCode(65 + index)}
              </div>
              <span className="text-lg">{choice}</span>
              <span className="ml-4 mr-4 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-mono">{String.fromCharCode(65 + index)}</span>
              {focusedIndex === index && !selected && (
                <span className="ml-2 px-2 py-1 bg-blue-200 text-blue-700 rounded text-xs font-mono animate-pulse">{String.fromCharCode(65 + index)} {t('select')}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-0">
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 border border-gray-100">
        {/* Next/Finish button on top if nextOnTop is true */}
        {nextOnTop && (
          <div className="flex justify-between items-center mb-4 gap-2">
            <div className="flex-1">
              {backEnabled && onBack && (
                <button
                  onClick={onBack}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-300 to-gray-500 text-white font-semibold rounded-xl shadow-lg hover:from-gray-400 hover:to-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 mb-4"
                >
                  <span className="mr-2">⬅️</span>
                  {t('back') || 'Back'}
                  <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-mono">B</span>
                </button>
              )}
            </div>
            <div className="flex-1 flex justify-end">
              {renderNextButton()}
            </div>
          </div>
        )}
        {/* Question */}
        <div className="mb-8">
          <div className="flex justify-center items-center mb-4">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800 leading-relaxed">
              {question.question}
            </h2>
          </div>
        </div>
        {/* Display according to the type question*/}
        {content}
        {/* Explication */}
        {showExplanation && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mb-6 animate-fade-in">
            <div className="flex items-center mb-4">
              {selected === question.correctAnswer ? (
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">✓</span>
                </div>
              ) : (
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">✗</span>
                </div>
              )}
              <h3 className="text-lg font-semibold">
                {selected === question.correctAnswer ? (
                  <span className="text-green-600">🎉 {t('correct_answer')}!</span>
                ) : (
                  <span className="text-red-600 mr-2">😅 {t('your_answer')} {t('incorrect') || 'Incorrect'}</span>
                )}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="font-semibold text-green-700 mb-1">{t('correct_answer')}:</div>
                <div className="text-gray-800">{question.correctAnswer}</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="font-semibold text-blue-700 mb-1">{t('explanation')}:</div>
                <div className="text-gray-800">{question.explanation}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 