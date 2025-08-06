import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { QuizQuestion } from '../../types/quiz';
import QuizProgress from './QuizProgress';
import QuizQuestionComp from './QuizQuestion';

interface QuizQuestionsPanelProps {
  questions: QuizQuestion[];
  current: number;
  selected: string | null;
  onSelect: (choice: string) => void;
  onNext: () => void;
  onPrev: () => void;
  showExplanation: boolean;
  nbQuestions: number;
  onShowResult: () => void;
  loading: boolean;
  historySaved: boolean;
  topic: string;
  subtopic: string;
  level: string;
}

// This component handles the display and navigation of quiz questions
const QuizQuestionsPanel: React.FC<QuizQuestionsPanelProps> = ({
  questions,
  current,
  selected,
  onSelect,
  onNext,
  onPrev,
  showExplanation,
  nbQuestions,
  onShowResult,
  loading,
  historySaved,
  topic,
  subtopic,
  level,
}) => {
  const { t } = useTranslation();

  // Allow Enter to go to next question if an answer is selected
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && selected && !loading) {
        if (current + 1 === nbQuestions) {
          onShowResult();
        } else {
          onNext();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selected, current, nbQuestions, onNext, onShowResult, loading]);

  // Display quiz meta info (topic, subtopic, level) above the progression
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col justify-center items-center h-full">
      <div className="w-full max-w-2xl flex flex-col items-center ">
        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
          {topic && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 sm:px-4 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
              Topic: {topic}
            </span>
          )}
          {subtopic && (
            <span className="bg-purple-100 text-purple-800 px-3 py-1 sm:px-4 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
              Subtopic: {subtopic}
            </span>
          )}
          {level && (
            <span className="bg-green-100 text-green-800 px-3 py-1 sm:px-4 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
              Level: {level}
            </span>
          )}
        </div>
      </div>
      {/* Progress and navigation buttons */}
      <div className="w-full max-w-2xl flex flex-col gap-1 mt-2 ">
        {/* Progress at the top */}
        <div className="flex justify-center w-full sm:mb-1  ">
          <QuizProgress current={current + 1} total={nbQuestions} />
        </div>
        {/* Side-by-side navigation buttons on mobile */}
        <div className="flex justify-center min-w-fit gap-2 my-4 w-full">
          <div className="flex-1 flex justify-center">
            {current > 0 && (
              <button
                onClick={onPrev}
                className="w-11/12 sm:w-full h-14 sm:h-16 inline-flex items-center justify-center px-0 sm:px-0 bg-gradient-to-r font-semibold rounded-xl shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 text-base sm:text-lg"
              >
                <span className="mr-2 text-lg sm:text-xl ml-2"></span>
                {t('back') || 'Back'}
              </button>
            )}
          </div>
          <div className="flex-1 flex justify-center">
            <button
              type="button"
              onClick={current + 1 === nbQuestions ? onShowResult : onNext}
              // Allow to finish the quiz even if no answer is selected on last question
              disabled={!questions[current] || (current + 1 === nbQuestions && historySaved)}
              className={`w-11/12 sm:w-full h-14 sm:h-16 inline-flex items-center justify-center px-0 sm:px-0 ${current + 1 === nbQuestions ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'} text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-base sm:text-lg`}
            >
              <span className="mr-2 text-lg sm:text-xl ml-2">{current + 1 === nbQuestions ? '🏆' : ''}</span>
              {current + 1 === nbQuestions ? t('see_score') : t('next_question')}
              {current + 1 !== nbQuestions && (
                <span className="hidden sm:inline ml-2 px-2 py-1 mr-2 bg-blue-100 text-blue-700 rounded text-xs font-mono">Enter</span>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Question */}
      <div className="w-full max-w-2xl">
        {loading && !questions.length ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent border-solid rounded-full animate-spin mb-6"></div>
            <div className="text-gray-600 text-lg font-medium">{t('loading_question')}</div>
            <div className="text-gray-500 text-sm mt-2">{t('please_wait')}</div>
          </div>
        ) : questions[current] ? (
          <QuizQuestionComp
            question={questions[current]}
            selected={selected}
            onSelect={onSelect}
            showExplanation={showExplanation}
            disabled={questions.length <= current + 1}
            isLast={current + 1 === nbQuestions}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">⏳</span>
              </div>
              <div className="text-gray-600 text-lg font-medium">{t('loading_question')}</div>
              <div className="text-gray-500 text-sm mt-2">{t('please_wait')}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizQuestionsPanel; 