import { useUser } from '@/contexts/UserContext';
import { INVESTMENT_TYPES, RISK_PROFILES } from '@/constants/investment';
import './Explore.css';

export default function Explore() {
  const { riskProfile } = useUser();

  const educationalContent = [
    // BEGINNER TOPICS
    {
      id: '1',
      title: 'What is a Fixed Deposit?',
      category: 'Beginner',
      duration: '5 min read',
      icon: '📖',
      youtubeVideo: {
        title: 'Fixed Deposits Explained',
        videoId: 'qvUMWvP0r3o', // Example video ID
      },
      article: {
        title: 'Understanding Fixed Deposits',
        url: 'https://www.investopedia.com/terms/f/fixeddeposit.asp',
      },
    },
    {
      id: '2',
      title: 'Stock Market Basics for Beginners',
      category: 'Beginner',
      duration: '15 min watch',
      icon: '📈',
      youtubeVideo: {
        title: 'Stock Market Explained',
        videoId: 'p7HKvqRI_Bo', // "Stock Market Basics for Beginners" by MoneyWeek
      },
    },
    {
      id: '3',
      title: 'Understanding Bond Funds',
      category: 'Beginner',
      duration: '8 min read',
      icon: '📚',
      article: {
        title: 'Bond Funds Explained',
        url: 'https://www.investopedia.com/terms/b/bondfund.asp',
      },
      youtubeVideo: {
        title: 'Bond Funds for Beginners',
        videoId: 'MnY9Jc5ZQTM',
      },
    },
    {
      id: '4',
      title: 'Risk vs. Return Explained',
      category: 'Beginner',
      duration: '10 min watch',
      icon: '⚖️',
      youtubeVideo: {
        title: 'Risk and Return in Investing',
        videoId: 'qtRqBZnMJAk', // "Risk and Return" by Two Cents
      },
      article: {
        title: 'The Risk-Return Tradeoff',
        url: 'https://www.investopedia.com/terms/r/riskreturntradeoff.asp',
      },
    },
    {
      id: '5',
      title: 'How to Start Investing with Little Money',
      category: 'Beginner',
      duration: '12 min watch',
      icon: '💰',
      youtubeVideo: {
        title: 'Investing with Small Amounts',
        videoId: 'NncKXqWC_Og', // "How to Invest with Little Money" by The Plain Bagel
      },
    },
    {
      id: '6',
      title: 'Power of Compound Interest',
      category: 'Beginner',
      duration: '8 min watch',
      icon: '🔄',
      youtubeVideo: {
        title: 'Compound Interest Explained',
        videoId: 'WFmQVzws0kM', // "Compound Interest" by Two Cents
      },
      article: {
        title: 'Understanding Compound Interest',
        url: 'https://www.investopedia.com/terms/c/compoundinterest.asp',
      },
    },

    // INTERMEDIATE TOPICS
    {
      id: '7',
      title: 'ETF vs Mutual Funds',
      category: 'Intermediate',
      duration: '12 min watch',
      icon: '🎯',
      youtubeVideo: {
        title: 'ETF vs Mutual Funds',
        videoId: 'iKpYlT45-Ew', // "ETF vs Mutual Funds" by The Plain Bagel
      },
      article: {
        title: 'ETFs vs Mutual Funds',
        url: 'https://www.investopedia.com/articles/mutualfund/07/etf_vs_mf.asp',
      },
    },
    {
      id: '8',
      title: 'Diversification Strategies',
      category: 'Intermediate',
      duration: '10 min read',
      icon: '🔀',
      article: {
        title: 'Diversification Explained',
        url: 'https://www.investopedia.com/terms/d/diversification.asp',
      },
      youtubeVideo: {
        title: 'Why Diversify Your Portfolio',
        videoId: 'T_PdqpuGkn0',
      },
    },
    {
      id: '9',
      title: 'Index Funds and Passive Investing',
      category: 'Intermediate',
      duration: '15 min watch',
      icon: '📊',
      youtubeVideo: {
        title: 'Index Funds Explained',
        videoId: 'YSPtr4R_2Ds', // "Index Funds" by Two Cents
      },
    },
    {
      id: '10',
      title: 'Understanding P/E Ratio',
      category: 'Intermediate',
      duration: '10 min watch',
      icon: '📐',
      youtubeVideo: {
        title: 'P/E Ratio Explained',
        videoId: '2XsUF9f7qLg', // "P/E Ratio" by The Plain Bagel
      },
      article: {
        title: 'Price-to-Earnings Ratio',
        url: 'https://www.investopedia.com/terms/p/pe-ratio.asp',
      },
    },
    {
      id: '11',
      title: 'Dividend Investing Basics',
      category: 'Intermediate',
      duration: '12 min watch',
      icon: '💵',
      youtubeVideo: {
        title: 'Dividend Investing Explained',
        videoId: 'm1zRoPLRW9k', // "Dividend Investing" by The Plain Bagel
      },
      article: {
        title: 'Dividend Investing Guide',
        url: 'https://www.investopedia.com/terms/d/dividend.asp',
      },
    },
    {
      id: '12',
      title: 'Asset Allocation Strategies',
      category: 'Intermediate',
      duration: '14 min read',
      icon: '🎨',
      article: {
        title: 'Guide to Asset Allocation',
        url: 'https://www.investopedia.com/terms/a/assetallocation.asp',
      },
      youtubeVideo: {
        title: 'Asset Allocation Explained',
        videoId: '9TcXGdqPk2E',
      },
    },

    // ADVANCED TOPICS
    {
      id: '13',
      title: 'REITs - Real Estate Investment Trusts',
      category: 'Advanced',
      duration: '15 min watch',
      icon: '🏠',
      youtubeVideo: {
        title: 'REITs Explained',
        videoId: 'p2zn1taL5Ro', // "REITs Explained" by The Plain Bagel
      },
      article: {
        title: 'Understanding REITs',
        url: 'https://www.investopedia.com/terms/r/reit.asp',
      },
    },
    {
      id: '14',
      title: 'Dollar-Cost Averaging Strategy',
      category: 'Advanced',
      duration: '11 min watch',
      icon: '💲',
      youtubeVideo: {
        title: 'Dollar Cost Averaging',
        videoId: '5TblzYJL_Z4', // "DCA Strategy" by Two Cents
      },
      article: {
        title: 'Dollar-Cost Averaging Guide',
        url: 'https://www.investopedia.com/terms/d/dollarcostaveraging.asp',
      },
    },
    {
      id: '15',
      title: 'Understanding Market Volatility',
      category: 'Advanced',
      duration: '13 min watch',
      icon: '📉',
      youtubeVideo: {
        title: 'Market Volatility Explained',
        videoId: 'qIz_YQbq7Mk', // "Market Volatility" by Benjamin
      },
    },
    {
      id: '16',
      title: 'Tax-Efficient Investing',
      category: 'Advanced',
      duration: '10 min read',
      icon: '📋',
      article: {
        title: 'Tax Strategies for Investors',
        url: 'https://www.investopedia.com/articles/personal-finance/1122014-tax-strategies-investors.asp',
      },
      youtubeVideo: {
        title: 'Tax Efficient Investing',
        videoId: 'OQgmNrJcKWk',
      },
    },
    {
      id: '17',
      title: 'Rebalancing Your Portfolio',
      category: 'Advanced',
      duration: '12 min read',
      icon: '⚖️',
      article: {
        title: 'Portfolio Rebalancing Guide',
        url: 'https://www.investopedia.com/terms/p/rebalancing.asp',
      },
      youtubeVideo: {
        title: 'Rebalancing Your Portfolio',
        videoId: 'i7P7r3SglrU',
      },
    },
    {
      id: '18',
      title: 'Understanding Market Cycles',
      category: 'Advanced',
      duration: '15 min watch',
      icon: '🔄',
      youtubeVideo: {
        title: 'Market Cycles Explained',
        videoId: 'kMJ6gM_zF68', // "Market Cycles" by The Plain Bagel
      },
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
    {
      term: 'Dividend',
      definition: 'A portion of company profits distributed to shareholders',
    },
    {
      term: 'Market Cap',
      definition: 'Total value of a company\'s outstanding shares of stock',
    },
    {
      term: 'Bull Market',
      definition: 'A period of rising stock prices and optimism',
    },
    {
      term: 'Bear Market',
      definition: 'A period of falling stock prices and pessimism',
    },
    {
      term: 'P/E Ratio',
      definition: 'Price-to-Earnings ratio - measures stock value relative to earnings',
    },
    {
      term: 'Volatility',
      definition: 'How much an investment\'s price fluctuates over time',
    },
    {
      term: 'Index Fund',
      definition: 'A fund that tracks a market index like the S&P 500',
    },
    {
      term: 'REIT',
      definition: 'Real Estate Investment Trust - company owning income-producing real estate',
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
      <p className="section-subtitle">
        Curated educational content from top financial educators - from beginner basics to advanced strategies
      </p>

      {/* Beginner Section */}
      <h3 className="subsection-title">🌱 Beginner Topics</h3>
      <div className="content-grid">
        {educationalContent.filter(c => c.category === 'Beginner').map((content) => (
          <div key={content.id} className="content-card-expanded">
            <span className="content-icon">{content.icon}</span>
            <div className="content-info">
              <h3 className="content-title">{content.title}</h3>
              <div className="content-meta">
                <span className="content-category">{content.category}</span>
                <span className="content-duration">{content.duration}</span>
              </div>

              {/* YouTube Video */}
              {content.youtubeVideo && (
                <div className="content-resource">
                  <a
                    href={`https://www.youtube.com/watch?v=${content.youtubeVideo.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="video-link"
                  >
                    <span className="resource-icon">▶️</span>
                    <span className="resource-text">Watch on YouTube</span>
                  </a>
                </div>
              )}

              {/* Article */}
              {content.article && (
                <div className="content-resource">
                  <a
                    href={content.article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="article-link"
                  >
                    <span className="resource-icon">📄</span>
                    <span className="resource-text">Read Article</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Intermediate Section */}
      <h3 className="subsection-title">📈 Intermediate Topics</h3>
      <div className="content-grid">
        {educationalContent.filter(c => c.category === 'Intermediate').map((content) => (
          <div key={content.id} className="content-card-expanded">
            <span className="content-icon">{content.icon}</span>
            <div className="content-info">
              <h3 className="content-title">{content.title}</h3>
              <div className="content-meta">
                <span className="content-category">{content.category}</span>
                <span className="content-duration">{content.duration}</span>
              </div>

              {content.youtubeVideo && (
                <div className="content-resource">
                  <a
                    href={`https://www.youtube.com/watch?v=${content.youtubeVideo.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="video-link"
                  >
                    <span className="resource-icon">▶️</span>
                    <span className="resource-text">Watch on YouTube</span>
                  </a>
                </div>
              )}

              {content.article && (
                <div className="content-resource">
                  <a
                    href={content.article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="article-link"
                  >
                    <span className="resource-icon">📄</span>
                    <span className="resource-text">Read Article</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Section */}
      <h3 className="subsection-title">🚀 Advanced Topics</h3>
      <div className="content-grid">
        {educationalContent.filter(c => c.category === 'Advanced').map((content) => (
          <div key={content.id} className="content-card-expanded">
            <span className="content-icon">{content.icon}</span>
            <div className="content-info">
              <h3 className="content-title">{content.title}</h3>
              <div className="content-meta">
                <span className="content-category">{content.category}</span>
                <span className="content-duration">{content.duration}</span>
              </div>

              {content.youtubeVideo && (
                <div className="content-resource">
                  <a
                    href={`https://www.youtube.com/watch?v=${content.youtubeVideo.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="video-link"
                  >
                    <span className="resource-icon">▶️</span>
                    <span className="resource-text">Watch on YouTube</span>
                  </a>
                </div>
              )}

              {content.article && (
                <div className="content-resource">
                  <a
                    href={content.article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="article-link"
                  >
                    <span className="resource-icon">📄</span>
                    <span className="resource-text">Read Article</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Glossary */}
      <h2 className="section-title">Key Investment Terms</h2>
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
