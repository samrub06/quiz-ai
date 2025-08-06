import { useTranslation } from 'react-i18next';

interface Props {
  current: number;
  total: number;
}

export default function QuizProgress({ current, total }: Props) {
  const { t } = useTranslation();
  const percentage = (current / total) * 100;
  
  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
          {t('question')} {current} / {total}
        </h3>
        <span className="text-xs sm:text-sm font-medium text-gray-600">
          {Math.round(percentage)}%
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
    
    </div>
  );
} 