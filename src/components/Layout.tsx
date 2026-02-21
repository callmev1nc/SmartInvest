import { Link, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Home, MessageSquare, ClipboardList, Compass, Hand, Languages, Moon, Sun } from 'lucide-react';
import './Layout.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { userName } = useUser();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">{t('appName')}</h1>
          <p className="tagline">{t('tagline')}</p>
        </div>
        <div className="header-actions">
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <div className="language-selector">
            <Languages size={18} strokeWidth={2} className="language-icon" aria-hidden="true" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="language-dropdown"
              aria-label="Select language"
            >
              <option value="en">English</option>
              <option value="zh">中文</option>
              <option value="vi">Tiếng Việt</option>
            </select>
          </div>
        </div>
      </header>

      <nav className="nav" aria-label="Main navigation">
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} aria-label="Go to home page">
          <Home size={20} strokeWidth={2} aria-hidden="true" />
          <span>{t('navHome')}</span>
        </Link>
        <Link to="/chat" className={`nav-link ${isActive('/chat') ? 'active' : ''}`} aria-label="Go to chat page">
          <MessageSquare size={20} strokeWidth={2} aria-hidden="true" />
          <span>{t('navChat')}</span>
        </Link>
        <Link to="/quiz" className={`nav-link ${isActive('/quiz') ? 'active' : ''}`} aria-label="Go to risk assessment quiz">
          <ClipboardList size={20} strokeWidth={2} aria-hidden="true" />
          <span>{t('navQuiz')}</span>
        </Link>
        <Link to="/explore" className={`nav-link ${isActive('/explore') ? 'active' : ''}`} aria-label="Go to explore page">
          <Compass size={20} strokeWidth={2} aria-hidden="true" />
          <span>{t('navExplore')}</span>
        </Link>
      </nav>

      {userName && (
        <div className="user-bar">
          <Hand size={16} className="wave-icon" />
          <span className="welcome-text">{t('welcome', { name: userName })}</span>
        </div>
      )}

      <main className="main">
        {children}
      </main>

      <footer className="footer">
        <p>{t('footer')}</p>
      </footer>
    </div>
  );
}
