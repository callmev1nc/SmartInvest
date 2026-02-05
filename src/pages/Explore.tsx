import { useUser } from '@/contexts/UserContext';
import { INVESTMENT_TYPES, type RiskProfile, RISK_PROFILES } from '@/constants/investment';
import './Explore.css';

export default function Explore() {
  const { riskProfile } = useUser();

  const educationalContent = [
    {
      id: '1',
      title: 'What is a Fixed Deposit?',
      category: 'Basics',
      duration: '5 min read',
      icon: '📖',
    },
    {
      id: '2',
      title: 'Understanding Bond Funds',
      category: 'Intermediate',
      duration: '8 min read',
      icon: '📚',
    },
    {
      id: '3',
      title: 'Risk vs. Return Explained',
      category: 'Basics',
      duration: '6 min read',
      icon: '🎯',
    },
    {
      id: '4',
      title: 'ETF vs Mutual Funds',
      category: 'Intermediate',
      duration: '10 min read',
      icon: '⚖️',
    },
  ];

  const glossary = [
    {
      term: 'Liquidity',
      definition: 'How quickly you can convert an investment to cash without losing value',
    },
    {
      term: 'Yield',
      definition: 'The income returned on an investment, expressed as a percentage',
    },
    {
      term: 'Diversification',
      definition: 'Spreading investments across different assets to reduce risk',
    },
    {
      term: 'Asset Allocation',
      definition: 'The mix of different investments in your portfolio',
    },
  ];

  return (
    <div className="explore">
      {/* Risk Profile Notice */}
      {!riskProfile && (
        <div className="notice">
          <span className="notice-icon">💡</span>
          <p className="notice-text">
            Take the risk assessment quiz to get personalized investment recommendations!
          </p>
        </div>
      )}

      {/* All Investment Options */}
      <h2 className="section-title">Investment Options</h2>
      <div className="investment-categories">
        {Object.values(RISK_PROFILES).map((profile) => (
          <div key={profile.id} className="category-card">
            <h3 className="category-title">{profile.name}</h3>
            <p className="category-description">{profile.description}</p>
          </div>
        ))}
      </div>

      {/* Investment Types */}
      <h2 className="section-title">Available Investments</h2>
      <div className="investments-grid">
        {INVESTMENT_TYPES.map((investment) => (
          <div key={investment.id} className="investment-card">
            <div className="investment-header">
              <h3 className="investment-name">{investment.name}</h3>
              <span className="risk-badge" style={{
                background: investment.riskLevel <= 2 ? '#10B981' :
                           investment.riskLevel <= 5 ? '#F59E0B' : '#EF4444'
              }}>
                Risk: {investment.riskLevel}/10
              </span>
            </div>
            <p className="investment-description">{investment.description}</p>
            <div className="investment-details">
              <div className="detail">
                <span className="detail-label">💰 Min:</span>
                <span className="detail-value">${investment.minAmount}</span>
              </div>
              <div className="detail">
                <span className="detail-label">📈 Return:</span>
                <span className="detail-value">{investment.expectedReturn}</span>
              </div>
              <div className="detail">
                <span className="detail-label">🔄 Liquidity:</span>
                <span className="detail-value">{investment.liquidity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Educational Content */}
      <h2 className="section-title">Learn About Investing</h2>
      <div className="content-grid">
        {educationalContent.map((content) => (
          <div key={content.id} className="content-card">
            <span className="content-icon">{content.icon}</span>
            <div className="content-info">
              <h3 className="content-title">{content.title}</h3>
              <div className="content-meta">
                <span className="content-category">{content.category}</span>
                <span className="content-duration">{content.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Glossary */}
      <h2 className="section-title">Key Terms</h2>
      <div className="glossary-grid">
        {glossary.map((item, index) => (
          <div key={index} className="glossary-card">
            <h4 className="glossary-term">{item.term}</h4>
            <p className="glossary-definition">{item.definition}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
