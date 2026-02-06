import { Link, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Home, MessageSquare, ClipboardList, Compass, Hand } from 'lucide-react';
import './Layout.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { userName } = useUser();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">SmartInvest</h1>
          <p className="tagline">Meet Uma, Your AI Investment Advisor</p>
        </div>
      </header>

      <nav className="nav">
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
          <Home size={20} strokeWidth={2} />
          <span>Home</span>
        </Link>
        <Link to="/chat" className={`nav-link ${isActive('/chat') ? 'active' : ''}`}>
          <MessageSquare size={20} strokeWidth={2} />
          <span>Chat with Uma</span>
        </Link>
        <Link to="/quiz" className={`nav-link ${isActive('/quiz') ? 'active' : ''}`}>
          <ClipboardList size={20} strokeWidth={2} />
          <span>Quiz</span>
        </Link>
        <Link to="/explore" className={`nav-link ${isActive('/explore') ? 'active' : ''}`}>
          <Compass size={20} strokeWidth={2} />
          <span>Explore</span>
        </Link>
      </nav>

      {userName && (
        <div className="user-bar">
          <Hand size={16} className="wave-icon" />
          <span className="welcome-text">Hi, {userName}!</span>
        </div>
      )}

      <main className="main">
        {children}
      </main>

      <footer className="footer">
        <p>© 2025 SmartInvest - Making smart investment decisions accessible to everyone</p>
      </footer>
    </div>
  );
}
