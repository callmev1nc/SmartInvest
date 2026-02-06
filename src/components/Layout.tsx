import { Link, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Home, MessageSquare, ClipboardList, Compass, Hand, Languages } from 'lucide-react';
import './Layout.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { userName } = useUser();
  const { language, setLanguage, t } = useLanguage();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">{t('appName')}</h1>
          <p className="tagline">{t('tagline')}</p>
        </div>
        <div className="language-selector">
          <Languages size={18} strokeWidth={2} className="language-icon" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="language-dropdown"
          >
            <option value="en">English</option>
            <option value="zh">中文</option>
            <option value="vi">Tiếng Việt</option>
          </select>
        </div>
      </header>

      <nav className="nav">
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
          <Home size={20} strokeWidth={2} />
          <span>{t('navHome')}</span>
        </Link>
        <Link to="/chat" className={`nav-link ${isActive('/chat') ? 'active' : ''}`}>
          <MessageSquare size={20} strokeWidth={2} />
          <span>{t('navChat')}</span>
        </Link>
        <Link to="/quiz" className={`nav-link ${isActive('/quiz') ? 'active' : ''}`}>
          <ClipboardList size={20} strokeWidth={2} />
          <span>{t('navQuiz')}</span>
        </Link>
        <Link to="/explore" className={`nav-link ${isActive('/explore') ? 'active' : ''}`}>
          <Compass size={20} strokeWidth={2} />
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
