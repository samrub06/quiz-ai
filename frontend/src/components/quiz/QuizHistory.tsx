import { useTranslation } from 'react-i18next';
import type { QuizHistory } from '../../types/quiz';

interface Props {
  history: QuizHistory[];
}

export default function QuizHistory({ history }: Props) {
  const { t, i18n } = useTranslation();
  
  // Determine text direction based on language
  const isRTL = i18n.language === 'he';
  
  if (history.length === 0) return null;
  
  return (
    <div className="max-w-4xl mx-auto p-6 mb-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className={`flex items-center mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center ${isRTL ? 'ml-4' : 'mr-4'}`}>
            <span className="text-white font-bold text-lg">📊</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{t('quiz_history')}</h3>
        </div>
        
        <div className="space-y-4">
          {history.slice(0, 5).map((h, i) => {
            const percentage = Math.round((h.score / h.total) * 100);
            const isPerfect = h.score === h.total;
            const isGood = percentage >= 80;
            
            return (
              <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      isPerfect ? 'bg-yellow-500' : isGood ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                      {isPerfect ? '🏆' : isGood ? '🎉' : '📝'}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {h.params.topic} {h.params.level && `(${h.params.level})`}
                      </div>
                      <div className="text-sm text-gray-600">{h.date}</div>
                    </div>
                  </div>
                  
                  <div className={`text-right ${isRTL ? 'text-left' : ''}`}>
                    <div className="text-2xl font-bold text-gray-800">
                      {h.score}/{h.total}
                    </div>
                    <div className="text-sm text-gray-600">{percentage}%</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isPerfect ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                      isGood ? 'bg-gradient-to-r from-green-400 to-green-600' :
                      'bg-gradient-to-r from-blue-400 to-blue-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                <details className="group">
                  <summary className={`cursor-pointer text-blue-600 hover:text-blue-800 font-medium flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className={isRTL ? 'ml-2' : 'mr-2'}>👁️</span>
                    {t('show_answers')}
                    <svg className={`w-4 h-4 transform group-open:rotate-180 transition-transform duration-200 ${isRTL ? 'mr-2' : 'ml-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  
                  <div className="mt-4 space-y-3">
                    {h.answers.map((a, j) => {
                      const isCorrect = a.userAnswer === a.correctAnswer;
                      return (
                        <div key={j} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className={`flex items-start space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                              isCorrect ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                              {isCorrect ? '✓' : '✗'}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-800 mb-2 break-words" /* Ensure long questions wrap and do not overlap on mobile */>
                                {a.questionNumber && (
                                  <span className="font-semibold mr-2">{t('question')} {a.questionNumber}:</span>
                                )}
                               {a.question}
                              </div>
                              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm ${isRTL ? 'text-right' : ''}`}>
                                <div>
                                  <span className="font-medium text-gray-600">{t('your_answer')}:</span>
                                  <span className={`ml-1 font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                    {a.userAnswer}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-600">{t('correct_answer')}:</span>
                                  <span className="ml-1 font-semibold text-green-600">{a.correctAnswer}</span>
                                </div>
                              </div>
                              <div className="mt-2 text-sm">
                                <span className="font-medium text-gray-600">{t('explanation')}:</span>
                                <span className="ml-1 text-gray-800">{a.explanation}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </details>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 