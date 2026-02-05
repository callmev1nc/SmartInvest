import { Link, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Colors } from '@/constants/theme';
import './Layout.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { userName } = useUser();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">SmartINvest</h1>
          <p className="tagline">Meet Uma, Your AI Investment Advisor</p>
        </div>
      </header>

      <nav className="nav">
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
          🏠 Home
        </Link>
        <Link to="/chat" className={`nav-link ${isActive('/chat') ? 'active' : ''}`}>
          💬 Chat with Uma
        </Link>
        <Link to="/quiz" className={`nav-link ${isActive('/quiz') ? 'active' : ''}`}>
          📋 Quiz
        </Link>
        <Link to="/explore" className={`nav-link ${isActive('/explore') ? 'active' : ''}`}>
          🧭 Explore
        </Link>
      </nav>

      {userName && (
        <div className="user-bar">
          <span className="welcome-text">Hi, {userName}! 👋</span>
        </div>
      )}

      <main className="main">
        {children}
      </main>

      <footer className="footer">
        <p>© 2025 SmartINvest - Making smart investment decisions accessible to everyone</p>
      </footer>
    </div>
  );
}
