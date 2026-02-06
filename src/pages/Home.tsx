import { Link } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Bot,
  BarChart3,
  TrendingUp,
  Target,
  ClipboardList,
  Lightbulb,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import './Home.css';

export default function Home() {
  const { userName, riskProfile } = useUser();
  const { t } = useLanguage();

  const features = [
    {
      id: '1',
      titleKey: 'featureChatTitle',
      descKey: 'featureChatDesc',
      icon: Bot,
      link: '/chat',
    },
    {
      id: '2',
      titleKey: 'featureQuizTitle',
      descKey: 'featureQuizDesc',
      icon: BarChart3,
      link: '/quiz',
    },
    {
      id: '3',
      titleKey: 'featureExploreTitle',
      descKey: 'featureExploreDesc',
      icon: TrendingUp,
      link: '/explore',
    },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <Sparkles className="hero-sparkle" size={48} strokeWidth={1.5} />
          <h1 className="hero-title">
            {userName ? t('welcomeBack', { name: userName }) : t('welcomeToApp')}
          </h1>
          <p className="hero-subtitle">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Risk Profile Banner */}
      {riskProfile ? (
        <div className="banner profile-banner">
          <Target className="banner-icon" size={32} strokeWidth={2} />
          <div className="banner-content">
            <h3 className="banner-title">{t('yourRiskProfile')}</h3>
            <p className="banner-text">
              {riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1)} {t('investor')}
            </p>
          </div>
        </div>
      ) : (
        <Link to="/quiz" className="banner cta-banner">
          <ClipboardList className="banner-icon" size={32} strokeWidth={2} />
          <div className="banner-content">
            <h3 className="banner-title">{t('takeQuiz')}</h3>
            <p className="banner-text">
              {t('takeQuizDesc')}
            </p>
          </div>
          <ArrowRight className="banner-arrow" size={20} strokeWidth={2} />
        </Link>
      )}

      {/* Features Grid */}
      <h2 className="section-title">{t('getStarted')}</h2>
      <div className="features-grid">
        {features.map((feature) => (
          <Link key={feature.id} to={feature.link} className="feature-card">
            <div className="feature-icon-wrapper">
              <feature.icon size={32} strokeWidth={2} className="feature-icon" />
            </div>
            <h3 className="feature-title">{t(feature.titleKey)}</h3>
            <p className="feature-description">{t(feature.descKey)}</p>
            <ArrowRight className="feature-arrow" size={18} strokeWidth={2} />
          </Link>
        ))}
      </div>

      {/* Tips Section */}
      <section className="tips-section">
        <h2 className="section-title">
          <Lightbulb size={24} strokeWidth={2} className="section-icon" />
          {t('tipsTitle')}
        </h2>
        <div className="tip-card">
          <h3 className="tip-title">{t('tip1Title')}</h3>
          <p className="tip-text">
            {t('tip1Text')}
          </p>
        </div>
        <div className="tip-card">
          <h3 className="tip-title">{t('tip2Title')}</h3>
          <p className="tip-text">
            {t('tip2Text')}
          </p>
        </div>
      </section>
    </div>
  );
}
