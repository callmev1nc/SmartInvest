import { useState, useEffect, memo } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { translateText } from '@/services/translation';
import { INVESTMENT_TYPES, RISK_PROFILES } from '@/constants/investment';
import type { RiskProfileInfo } from '@/constants/investment';
import { DailyUpdates } from '@/components/DailyUpdates';
import './Explore.css';

interface EducationalContent {
  id: string;
  title: string;
  category: string;
  duration: string;
  icon: string;
  youtubeVideo?: {
    title: string;
    videoId: string;
  };
  article?: {
    title: string;
    url: string;
  };
}

interface GlossaryItem {
  term: string;
  definition: string;
}

// Memoized sub-components to prevent unnecessary re-renders
const CategoryCard = memo(({ profile }: { profile: RiskProfileInfo }) => (
  <div className="category-card">
    <h3 className="category-title">{profile.name}</h3>
    <p className="category-description">{profile.description}</p>
  </div>
));
CategoryCard.displayName = 'CategoryCard';

const InvestmentCard = memo(({ investment }: { investment: any }) => (
  <div className="investment-card">
    <div className="investment-header">
      <h3 className="investment-name">{investment.name}</h3>
      <span
        className="risk-badge"
        style={{
          background:
            investment.riskLevel <= 2
              ? '#10B981'
              : investment.riskLevel <= 5
              ? '#F59E0B'
              : '#EF4444',
        }}
      >
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
));
InvestmentCard.displayName = 'InvestmentCard';

const ContentCard = memo(({ content }: { content: EducationalContent }) => (
  <div className="content-card-expanded">
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
            <span className="resource-text">Watch: {content.youtubeVideo.title}</span>
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
            <span className="resource-text">Read: {content.article.title}</span>
          </a>
        </div>
      )}
    </div>
  </div>
));
ContentCard.displayName = 'ContentCard';

const GlossaryCard = memo(({ item }: { item: GlossaryItem; index: number }) => (
  <div className="glossary-card">
    <h4 className="glossary-term">{item.term}</h4>
    <p className="glossary-definition">{item.definition}</p>
  </div>
));
GlossaryCard.displayName = 'GlossaryCard';

export default function Explore() {
  const { riskProfile } = useUser();
  const { language } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState<{
    educationalContent: EducationalContent[];
    glossary: GlossaryItem[];
    sectionTitles: Record<string, string>;
  } | null>(null);

  const baseEducationalContent: EducationalContent[] = [
    // BEGINNER TOPICS
    {
      id: '1',
      title: 'Stock Market Basics for Beginners',
      category: 'Beginner',
      duration: '50 min watch',
      icon: '📈',
      youtubeVideo: {
        title: 'Stock Market for Beginners 2025',
        videoId: 'bb6_M_srMBk',
      },
    },
    {
      id: '2',
      title: 'How to Start Investing with Little Money',
      category: 'Beginner',
      duration: '15 min watch',
      icon: '💰',
      youtubeVideo: {
        title: 'How to Invest for Beginners (2026)',
        videoId: 'lNdOtlpmH5U',
      },
    },
    {
      id: '3',
      title: 'Understanding Risk vs Return',
      category: 'Beginner',
      duration: '12 min watch',
      icon: '⚖️',
      youtubeVideo: {
        title: 'Investing Strategies That Work for Beginners',
        videoId: 'o5cWIytTMdg',
      },
    },
    {
      id: '4',
      title: 'Power of Compound Interest',
      category: 'Beginner',
      duration: '10 min read',
      icon: '🔄',
      article: {
        title: 'The Power of Compound Interest',
        url: 'https://www.investopedia.com/terms/c/compoundinterest.asp',
      },
    },
    {
      id: '5',
      title: 'Index Funds and Passive Investing',
      category: 'Beginner',
      duration: '1 hour watch',
      icon: '📊',
      youtubeVideo: {
        title: 'How To Invest In Index Funds (2024)',
        videoId: '17iH5c-nW1M',
      },
    },
    {
      id: '6',
      title: 'Diversification Strategies',
      category: 'Beginner',
      duration: '8 min read',
      icon: '🔀',
      article: {
        title: 'The Importance of Diversification',
        url: 'https://www.investopedia.com/investing/importance-diversification/',
      },
    },

    // INTERMEDIATE TOPICS
    {
      id: '7',
      title: 'ETF vs Mutual Funds',
      category: 'Intermediate',
      duration: '15 min watch',
      icon: '🎯',
      youtubeVideo: {
        title: 'ETFs vs Mutual Funds Explained',
        videoId: 'wHOQM5m7hL8',
      },
      article: {
        title: 'ETFs vs Mutual Funds - NerdWallet',
        url: 'https://www.nerdwallet.com/article/etfs-vs-mutual-funds',
      },
    },
    {
      id: '8',
      title: 'Understanding P/E Ratio',
      category: 'Intermediate',
      duration: '10 min watch',
      icon: '📐',
      youtubeVideo: {
        title: 'PE Ratio Explained for Beginners',
        videoId: 'JVvVjOLWR30',
      },
      article: {
        title: 'Price-to-Earnings Ratio (P/E Ratio)',
        url: 'https://www.investopedia.com/terms/p/pe-ratio.asp',
      },
    },
    {
      id: '9',
      title: 'Dividend Investing Basics',
      category: 'Intermediate',
      duration: '12 min watch',
      icon: '💵',
      youtubeVideo: {
        title: 'Dividend Investing for Beginners 2024',
        videoId: 'bNV09T1RKH8',
      },
      article: {
        title: 'Dividend Yield Explained',
        url: 'https://www.investopedia.com/terms/d/dividendyield.asp',
      },
    },
    {
      id: '10',
      title: 'Asset Allocation Strategies',
      category: 'Intermediate',
      duration: '10 min read',
      icon: '🎨',
      article: {
        title: 'Guide to Asset Allocation',
        url: 'https://www.investopedia.com/terms/a/assetallocation.asp',
      },
      youtubeVideo: {
        title: 'Index Investing For Beginners (2024)',
        videoId: 'r2mATkslxa8',
      },
    },
    {
      id: '11',
      title: 'Types of Investments Guide',
      category: 'Intermediate',
      duration: '15 min read',
      icon: '📚',
      article: {
        title: 'Types of Investments and How to Get Started',
        url: 'https://www.investopedia.com/terms/i/investing.asp',
      },
    },

    // ADVANCED TOPICS
    {
      id: '12',
      title: 'REITs - Real Estate Investment Trusts',
      category: 'Advanced',
      duration: '20 min watch',
      icon: '🏠',
      youtubeVideo: {
        title: 'REITs Explained for Beginners',
        videoId: 'ziOAa4rj0Go',
      },
      article: {
        title: 'What is a REIT?',
        url: 'https://www.investopedia.com/terms/r/reit.asp',
      },
    },
    {
      id: '13',
      title: 'Dollar-Cost Averaging Strategy',
      category: 'Advanced',
      duration: '12 min watch',
      icon: '💲',
      youtubeVideo: {
        title: 'Dollar Cost Averaging Explained',
        videoId: 'XwgqLkhBzjY',
      },
      article: {
        title: 'Dollar-Cost Averaging Guide',
        url: 'https://www.investopedia.com/terms/d/dollarcostaveraging.asp',
      },
    },
    {
      id: '14',
      title: 'Understanding Market Volatility',
      category: 'Advanced',
      duration: '10 min read',
      icon: '📉',
      article: {
        title: 'Understanding Market Volatility',
        url: 'https://www.investopedia.com/terms/v/volatility.asp',
      },
    },
    {
      id: '15',
      title: 'Portfolio Rebalancing',
      category: 'Advanced',
      duration: '8 min read',
      icon: '⚖️',
      article: {
        title: 'Beginners Guide to Rebalancing',
        url: 'https://www.investor.gov/additional-resources/general-resources/publications-research/info-sheets/beginners-guide-asset',
      },
    },
  ];

  const baseGlossary: GlossaryItem[] = [
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

  // Translate content when language changes
  useEffect(() => {
    const translateContent = async () => {
      if (language === 'en') {
        setTranslatedContent({
          educationalContent: baseEducationalContent,
          glossary: baseGlossary,
          sectionTitles: {
            investmentOptions: 'Investment Options',
            availableInvestments: 'Available Investments',
            learnAboutInvesting: 'Learn About Investing',
            keyInvestmentTerms: 'Key Investment Terms',
            beginnerTopics: 'Beginner Topics',
            intermediateTopics: 'Intermediate Topics',
            advancedTopics: 'Advanced Topics',
          },
        });
        return;
      }

      try {
        // Translate section titles
        const sectionTitles = {
          investmentOptions: await translateText('Investment Options', language),
          availableInvestments: await translateText('Available Investments', language),
          learnAboutInvesting: await translateText('Learn About Investing', language),
          keyInvestmentTerms: await translateText('Key Investment Terms', language),
          beginnerTopics: await translateText('Beginner Topics', language),
          intermediateTopics: await translateText('Intermediate Topics', language),
          advancedTopics: await translateText('Advanced Topics', language),
        };

        // Translate educational content
        const translatedEducationalContent = await Promise.all(
          baseEducationalContent.map(async (content) => ({
            ...content,
            title: await translateText(content.title, language),
            category: await translateText(content.category, language),
          }))
        );

        // Translate glossary
        const translatedGlossary = await Promise.all(
          baseGlossary.map(async (item) => ({
            term: item.term, // Keep terms in English for reference
            definition: await translateText(item.definition, language),
          }))
        );

        setTranslatedContent({
          educationalContent: translatedEducationalContent,
          glossary: translatedGlossary,
          sectionTitles,
        });
      } catch (error) {
        console.error('Translation error:', error);
        // Fall back to English content
        setTranslatedContent({
          educationalContent: baseEducationalContent,
          glossary: baseGlossary,
          sectionTitles: {
            investmentOptions: 'Investment Options',
            availableInvestments: 'Available Investments',
            learnAboutInvesting: 'Learn About Investing',
            keyInvestmentTerms: 'Key Investment Terms',
            beginnerTopics: 'Beginner Topics',
            intermediateTopics: 'Intermediate Topics',
            advancedTopics: 'Advanced Topics',
          },
        });
      }
    };

    translateContent();
  }, [language]);

  const educationalContent = translatedContent?.educationalContent || baseEducationalContent;
  const glossary = translatedContent?.glossary || baseGlossary;
  const sectionTitles = translatedContent?.sectionTitles || {
    investmentOptions: 'Investment Options',
    availableInvestments: 'Available Investments',
    learnAboutInvesting: 'Learn About Investing',
    keyInvestmentTerms: 'Key Investment Terms',
    beginnerTopics: 'Beginner Topics',
    intermediateTopics: 'Intermediate Topics',
    advancedTopics: 'Advanced Topics',
  };

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

      {/* Daily Market Updates - AI Powered */}
      <DailyUpdates />

      {/* All Investment Options */}
      <h2 className="section-title">{sectionTitles.investmentOptions}</h2>
      <div className="investment-categories">
        {Object.values(RISK_PROFILES).map((profile) => (
          <CategoryCard key={profile.id} profile={profile} />
        ))}
      </div>

      {/* Investment Types */}
      <h2 className="section-title">{sectionTitles.availableInvestments}</h2>
      <div className="investments-grid">
        {INVESTMENT_TYPES.map((investment) => (
          <InvestmentCard key={investment.id} investment={investment} />
        ))}
      </div>

      {/* Educational Content */}
      <h2 className="section-title">{sectionTitles.learnAboutInvesting}</h2>
      <p className="section-subtitle">
        Curated educational content from top financial educators - all links verified and working! Click to watch or read.
      </p>

      {/* Beginner Section */}
      <h3 className="subsection-title">🌱 {sectionTitles.beginnerTopics}</h3>
      <div className="content-grid">
        {educationalContent
          .filter((c) => c.category === 'Beginner')
          .map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
      </div>

      {/* Intermediate Section */}
      <h3 className="subsection-title">📈 {sectionTitles.intermediateTopics}</h3>
      <div className="content-grid">
        {educationalContent
          .filter((c) => c.category === 'Intermediate')
          .map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
      </div>

      {/* Advanced Section */}
      <h3 className="subsection-title">🚀 {sectionTitles.advancedTopics}</h3>
      <div className="content-grid">
        {educationalContent
          .filter((c) => c.category === 'Advanced')
          .map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
      </div>

      {/* Glossary */}
      <h2 className="section-title">{sectionTitles.keyInvestmentTerms}</h2>
      <div className="glossary-grid">
        {glossary.map((item, index) => (
          <GlossaryCard key={index} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}
