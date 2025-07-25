import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import QuizHistoryPage from './pages/QuizHistoryPage';
import QuizPage from './pages/QuizPage';

function App() {
  const { i18n } = useTranslation();
  useEffect(() => {
    const lang = localStorage.getItem('lang');
    if (lang) i18n.changeLanguage(lang);
  }, [i18n]);

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
    localStorage.setItem('lang', e.target.value);
  };

  const isRTL = i18n.language === 'he';

  return (
    <Router>
      <Layout isRTL={isRTL} language={i18n.language} onLangChange={handleLangChange}>
        <Routes>
          <Route path="/" element={<Navigate to="/quiz" replace />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/history" element={<QuizHistoryPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
