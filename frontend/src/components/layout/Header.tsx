import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import CustomSelect from '../common/CustomSelect';

interface HeaderProps {
  isRTL: boolean;
  language: string;
  onLangChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Header: React.FC<HeaderProps> = ({ isRTL, language, onLangChange }) => {
  const { t } = useTranslation();
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16 relative">
          <div className="flex items-center space-x-2 min-w-[80px]">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex space-x-4 sm:space-x-6 gap-4 sm:gap-4">
              <Link to="/quiz" className="text-blue-600 hover:underline font-medium text-sm sm:text-base">
                {t('home')}
              </Link>
              <Link to="/history" className="text-blue-600 hover:underline font-medium text-sm sm:text-base">
                {t('quiz_history')}
              </Link>
            </div>
          </div>
          <div className="flex items-center ml-6 min-w-[120px] justify-end">
            <div className="">
              <CustomSelect
                value={language}
                onChange={onLangChange}
                rtl={isRTL}
                options={[
                  { value: 'en', label: `🇺🇸` },
                  { value: 'he', label: `🇮🇱` },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 