import React from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import type { QuizParams } from '../types/quiz';
import CustomSelect from './CustomSelect';

interface Props {
  params: QuizParams;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  errors?: Record<string, string>;
}

// Zod schema for QuizParams
const quizSchema = z.object({
  topic: z.string().min(2, 'error_topic_required').max(100).trim().regex(/^[^<>]*$/, 'error_invalid_characters'),
  subtopic: z.string().max(100).trim().optional(),
  nbQuestions: z.number().min(1).max(100),
  level: z.string().min(1, 'error_level_required'), 
  lang: z.string().optional(),
  type: z.string().min(1, 'error_type_required'),
});

export default function QuizForm({ params, onChange, onSubmit, loading, errors = {} }: Props) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const [localErrors, setLocalErrors] = React.useState<Record<string, string>>({});

  // Validate and sanitize before submit
  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert nbQuestions to number for validation
    const safeParams = { ...params, nbQuestions: Number(params.nbQuestions) };
    const result = quizSchema.safeParse(safeParams);
    if (!result.success) {
      // Map Zod errors to field errors
      const fieldErrors: Record<string, string> = {};
      (result.error.issues as { path: (string | number)[]; message: string }[]).forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = t(err.message);
      });
      setLocalErrors(fieldErrors);
      return;
    }
    setLocalErrors({});
    onSubmit(e);
  };
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">🎯 {t('start_quiz')}</h2>
          <p className="text-gray-600">{t('quiz_description')}</p>
        </div>
        <form onSubmit={handleValidate} className="space-y-6">
          {/* Topic */}
          <div>
            <label htmlFor="topic" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              {t('topic')} *
            </label>
            <input 
              id="topic"
              name="topic" 
              value={params.topic} 
              onChange={onChange} 
              required
              aria-required="true"
              aria-invalid={!!errors.topic}
              aria-describedby={errors.topic ? 'topic-error' : undefined}
              className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-sm sm:text-base ${errors.topic ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., Mathematics, History..."
            />
            {/* Error message for topic */}
            {(errors.topic || localErrors.topic) && <div id="topic-error" className="text-red-500 text-xs sm:text-sm mt-1" role="alert">{errors.topic || localErrors.topic}</div>}
          </div>

          {/* Subtopic */}
          <div>
            <label htmlFor="subtopic" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              {t('subtopic')}
            </label>
            <input 
              id="subtopic"
              name="subtopic" 
              value={params.subtopic} 
              onChange={onChange}
              aria-invalid={!!errors.subtopic}
              aria-describedby={errors.subtopic ? 'subtopic-error' : undefined}
              className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-sm sm:text-base ${errors.subtopic ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., Algebra, World War II..."
            />
            {/* Error message for subtopic */}
            {(errors.subtopic || localErrors.subtopic) && <div id="subtopic-error" className="text-red-500 text-xs sm:text-sm mt-1" role="alert">{errors.subtopic || localErrors.subtopic}</div>}
          </div>
          {/* Type */}
          <div>
            <label htmlFor="type" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              {t('type')} *
            </label>
            <CustomSelect
              rtl={isRTL}
              id="type"
              name="type"
              value={params.type || ''}
              onChange={onChange}
              required
              aria-required="true"
              aria-invalid={!!errors.type}
              aria-describedby={errors.type ? 'type-error' : undefined}
              className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-sm sm:text-base ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
              placeholder={t('select_type')}
              options={[
                { value: 'mcq', label: t('multiple_choice') },
                { value: 'true_false', label: t('true_false') },
                { value: 'open_ended', label: t('open_ended') },
                { value: 'mix', label: t('mix') },
              ]}
            />
            {/* Error message for type */}
            {(errors.type || localErrors.type) && <div id="type-error" className="text-red-500 text-xs sm:text-sm mt-1" role="alert">{errors.type || localErrors.type}</div>}
          </div>
          {/* Level + Start Quiz Button on the same row */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <div className="sm:flex-1">
              <CustomSelect
                rtl={isRTL}
                name="level"
                value={params.level || ''}
                onChange={onChange}
                placeholder={t('level')}
                options={[
                  { value: 'beginner', label: t('Beginner') },
                  { value: 'intermediate', label: t('Intermediate') },
                  { value: 'expert', label: t('Expert') },
                ]}
                aria-invalid={!!errors.level}
                aria-describedby={errors.level ? 'level-error' : undefined}
                className={`w-full py-2 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-sm sm:text-base ${errors.level ? 'border-red-500' : 'border-gray-300'}`}
              />
              {/* Error message for level */}
              {(errors.level || localErrors.level) && <div id="level-error" className="text-red-500 text-xs sm:text-sm mt-1" role="alert">{errors.level || localErrors.level}</div>}
            </div>
            <div className="sm:flex-[2] flex-1">
              <button 
                type="submit" 
                disabled={loading}
                aria-busy={loading}
                aria-label={t('start_quiz')}
                className="w-full inline-flex items-center justify-center px-4 py-2 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="sr-only">{t('loading')}</span>
                    {t('loading')}
                  </>
                ) : (
                  <>
                    {t('start_quiz')}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error message for lang (displayed at the bottom) */}
          {errors.lang && <div className="text-red-500 text-xs sm:text-sm mt-1" role="alert">{errors.lang}</div>}
          {/* General error (API, etc.) */}
          {errors.general && <div className="text-red-500 text-xs sm:text-sm mt-2 text-center" role="alert">{errors.general}</div>}
        </form>
      </div>
    </div>
  );
} 
