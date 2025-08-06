import React from 'react';
import Header from './Header';

interface LayoutProps {
  isRTL: boolean;
  language: string;
  onLangChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}

// Layout component that includes the Header and wraps the main content
const Layout: React.FC<LayoutProps> = ({ isRTL, language, onLangChange, children }) => {
  const textDirection = isRTL ? 'rtl' : 'ltr';
  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={textDirection}>
      <Header isRTL={isRTL} language={language} onLangChange={onLangChange} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout; 