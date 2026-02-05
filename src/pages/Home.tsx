import { Link } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Colors } from '@/constants/theme';
import './Home.css';

export default function Home() {
  const { userName, riskProfile } = useUser();

  const features = [
    {
      id: '1',
      title: 'Chat with Uma',
      description: 'Get personalized investment advice',
      icon: '🤖',
      link: '/chat',
    },
    {
      id: '2',
      title: 'Risk Assessment',
      description: 'Discover your investor profile',
      icon: '📊',
      link: '/quiz',
    },
    {
      id: '3',
      title: 'Investment Options',
      description: 'Explore investment opportunities',
      icon: '💰',
      link: '/explore',
    },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">
          {userName ? `Welcome back, ${userName}!` : 'Welcome to SmartINvest'}
        </h1>
        <p className="hero-subtitle">
          Your personal AI investment advisor is ready to help
        </p>
      </section>

      {/* Risk Profile Banner */}
      {riskProfile ? (
        <div className="banner profile-banner">
          <span className="banner-icon">🎯</span>
          <div className="banner-content">
            <h3 className="banner-title">Your Risk Profile</h3>
            <p className="banner-text">
              {riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1)} Investor
            </p>
          </div>
        </div>
      ) : (
        <Link to="/quiz" className="banner cta-banner">
          <span className="banner-icon">📋</span>
          <div className="banner-content">
            <h3 className="banner-title">Take the Quiz</h3>
            <p className="banner-text">
              Discover your investor profile in 5 minutes
            </p>
          </div>
        </Link>
      )}

      {/* Features Grid */}
      <h2 className="section-title">Get Started</h2>
      <div className="features-grid">
        {features.map((feature) => (
          <Link key={feature.id} to={feature.link} className="feature-card">
            <span className="feature-icon">{feature.icon}</span>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </Link>
        ))}
      </div>

      {/* Tips Section */}
      <section className="tips-section">
        <h2 className="section-title">💡 Tips for Your Savings</h2>
        <div className="tip-card">
          <h3 className="tip-title">Start Small, Think Big</h3>
          <p className="tip-text">
            Even small investments can grow significantly over time. The key is consistency
            and starting early.
          </p>
        </div>
        <div className="tip-card">
          <h3 className="tip-title">Diversify Your Portfolio</h3>
          <p className="tip-text">
            Don't put all your eggs in one basket. Spread investments across different
            asset classes to manage risk.
          </p>
        </div>
      </section>
    </div>
  );
}
