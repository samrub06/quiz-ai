import { useTranslation } from 'react-i18next';
import type { QuizQuestion } from '../../types/quiz';

interface Props {
  questions: QuizQuestion[];
  userAnswers: { userAnswer: string; correctAnswer: string; question: string; explanation: string }[];
  score: number;
  onRestart: () => void;
  onRegenerate: () => void;
}

export default function QuizResult({ questions, userAnswers, score, onRestart, onRegenerate }: Props) {
  const { t } = useTranslation();
  const percentage = Math.round((score / questions.length) * 100);
  const isPerfect = score === questions.length;
  const isGood = percentage >= 80;
  const isAverage = percentage >= 60;
  
  const getScoreEmoji = () => {
    if (isPerfect) return "🏆";
    if (isGood) return "🎉";
    if (isAverage) return "👍";
    return "💪";
  };
  
  const getScoreColor = () => {
    if (isPerfect) return "from-yellow-400 to-yellow-600";
    if (isGood) return "from-green-400 to-green-600";
    if (isAverage) return "from-blue-400 to-blue-600";
    return "from-red-400 to-red-600";
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Score Header */}
        <div className="text-center mb-8">
          <div className="text-4xl sm:text-6xl mb-4">{getScoreEmoji()}</div>
          <h2 className="text-xl sm:text-4xl font-bold text-gray-800 mb-2">
            {t('score')}: {score} / {questions.length}
          </h2>
         
          
          {/* Progress Circle */}
          <div className="relative w-20 h-20 sm:w-32 sm:h-32 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeDasharray={`${percentage}, 100`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" className={`text-${getScoreColor().split('-')[1]}`} />
                  <stop offset="100%" className={`text-${getScoreColor().split('-')[3]}`} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-700">{percentage}%</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
            <button 
              onClick={onRestart}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-xl shadow-lg hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
            >
              {t('restart')}
            </button>
            <button 
              onClick={onRegenerate}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
            >
              {t('regenerate')}
            </button>
          </div>
        </div>
        
        {/* Questions Review */}
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-lg sm:text-2xl font-bold text-gray-800 text-center mb-4 sm:mb-6">
            📋 {t('question')} Review
          </h3>
          
          {questions.map((q, i) => {
            const isCorrect = userAnswers[i]?.userAnswer === q.correctAnswer;
            return (
              <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-start space-x-2 sm:space-x-4">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm ml-1 sm:ml-2 ${
                    isCorrect ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {isCorrect ? '✓' : '✗'}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800  sm:h-10 py-0.5 items-center text-sm sm:text-base">
                      {t('question')} {i + 1}: {q.question}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                      <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                        <div className="font-medium text-gray-700 mb-1 text-xs sm:text-sm">{t('your_answer')}:</div>
                        <div className={`font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'} text-sm sm:text-base`}>
                          {userAnswers[i]?.userAnswer}
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                        <div className="font-medium text-gray-700 mb-1 text-xs sm:text-sm">{t('correct_answer')}:</div>
                        <div className="font-semibold text-green-600 text-sm sm:text-base">
                          {q.correctAnswer}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 sm:mt-4 bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
                      <div className="font-medium text-blue-700 mb-1 text-xs sm:text-sm">{t('explanation')}:</div>
                      <div className="text-gray-800 text-sm sm:text-base">{q.explanation}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 