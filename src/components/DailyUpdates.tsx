/**
 * Daily Investment Updates Component
 * Displays AI-powered daily market analysis and personalized recommendations
 */

import { useState, useEffect } from 'react';
import { getDailyUpdates, type DailyUpdate, type MarketUpdate } from '@/services/dailyUpdates';
import { translateText } from '@/services/translation';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import './DailyUpdates.css';

export function DailyUpdates() {
  const { riskProfile } = useUser();
  const { language } = useLanguage();
  const [updates, setUpdates] = useState<DailyUpdate | null>(null);
  const [translatedUpdates, setTranslatedUpdates] = useState<DailyUpdate | null>(null);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadUpdates(false);
  }, [riskProfile]);

  // Translate updates when language or updates change
  useEffect(() => {
    if (updates && language !== 'en') {
      translateUpdates(updates, language);
    } else {
      setTranslatedUpdates(updates);
    }
  }, [updates, language]);

  const loadUpdates = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      if (forceRefresh) setRefreshing(true);

      const data = await getDailyUpdates(riskProfile, forceRefresh);
      setUpdates(data);
    } catch (err) {
      setError('Failed to load daily updates');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const translateUpdates = async (data: DailyUpdate, targetLanguage: string) => {
    try {
      setTranslating(true);

      // Translate summary
      const translatedSummary = await translateText(data.summary, targetLanguage as any);

      // Translate market updates
      const translatedMarkets = {
        stocks: await translateMarketUpdate(data.markets.stocks, targetLanguage),
        crypto: await translateMarketUpdate(data.markets.crypto, targetLanguage),
        realEstate: await translateMarketUpdate(data.markets.realEstate, targetLanguage),
        international: await translateMarketUpdate(data.markets.international, targetLanguage),
        alternativeInvestments: await translateMarketUpdate(data.markets.alternativeInvestments, targetLanguage),
      };

      // Translate opportunities
      const translatedOpportunities = await Promise.all(
        data.opportunities.map(async (opp) => ({
          ...opp,
          category: await translateText(opp.category, targetLanguage as any),
          name: opp.name, // Keep investment names in English
          description: await translateText(opp.description, targetLanguage as any),
          expectedReturn: opp.expectedReturn, // Keep return format
          timeHorizon: await translateText(opp.timeHorizon, targetLanguage as any),
          reason: await translateText(opp.reason, targetLanguage as any),
        }))
      );

      setTranslatedUpdates({
        ...data,
        summary: translatedSummary,
        markets: translatedMarkets,
        opportunities: translatedOpportunities,
      });
    } catch (error) {
      console.error('Translation error:', error);
      // Fall back to original data if translation fails
      setTranslatedUpdates(data);
    } finally {
      setTranslating(false);
    }
  };

  const translateMarketUpdate = async (market: MarketUpdate, targetLanguage: string): Promise<MarketUpdate> => {
    const translatedSummary = await translateText(market.summary, targetLanguage as any);
    const translatedKeyPoints = await Promise.all(
      market.keyPoints.map(point => translateText(point, targetLanguage as any))
    );

    return {
      ...market,
      summary: translatedSummary,
      keyPoints: translatedKeyPoints,
    };
  };

  const handleRefresh = () => {
    loadUpdates(true);
  };

  // Use translated updates if available, otherwise use original
  const displayUpdates = translatedUpdates || updates;

  if (loading) {
    return (
      <div className="daily-updates">
        <div className="updates-header">
          <h2 className="updates-title">📊 Daily Market Updates</h2>
        </div>
        <div className="updates-loading">
          <div className="spinner"></div>
          <p>Analyzing markets with AI...</p>
        </div>
      </div>
    );
  }

  if (error || !displayUpdates) {
    return (
      <div className="daily-updates">
        <div className="updates-header">
          <h2 className="updates-title">📊 Daily Market Updates</h2>
        </div>
        <div className="updates-error">
          <p>{error || 'Unable to load updates'}</p>
          <button onClick={() => loadUpdates(true)} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="daily-updates" role="region" aria-label="Daily Market Updates">
      <div className="updates-header">
        <h2 className="updates-title">📊 Daily Market Updates</h2>
        <div className="updates-meta">
          <span className="updates-date">
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            {' • '}
            <span className="updates-time">
              {currentTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
              })}
            </span>
            {translating && <span className="translating-badge">Translating...</span>}
          </span>
          <button
            onClick={handleRefresh}
            disabled={refreshing || translating}
            className="refresh-button"
            aria-label={refreshing ? 'Refreshing market updates...' : 'Refresh market updates'}
          >
            {refreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="updates-summary" role="region" aria-label="Market summary">
        <p>{displayUpdates.summary}</p>
        <p className="disclaimer">
          💡 AI-powered analysis based on current market data. Not financial advice.
        </p>
      </div>

      {/* Market Overview */}
      <div className="markets-grid" role="region" aria-label="Market overview">
        <MarketCard market={displayUpdates.markets.stocks} title="Stocks" icon="📈" />
        <MarketCard market={displayUpdates.markets.crypto} title="Crypto" icon="₿" />
        <MarketCard market={displayUpdates.markets.realEstate} title="Real Estate" icon="🏠" />
        <MarketCard market={displayUpdates.markets.international} title="International" icon="🌍" />
        <MarketCard market={displayUpdates.markets.alternativeInvestments} title="Alternatives" icon="🎨" />
      </div>

      {/* Opportunities */}
      {displayUpdates.opportunities.length > 0 && (
        <div className="opportunities-section">
          <h3 className="opportunities-title">
            🎯 Top Opportunities for {riskProfile ? riskProfile.toUpperCase() : 'MODERATE'} Investors
          </h3>
          <div className="opportunities-grid">
            {displayUpdates.opportunities.map((opp, index) => (
              <OpportunityCard key={index} opportunity={opp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface MarketCardProps {
  market: MarketUpdate;
  title: string;
  icon: string;
}

function MarketCard({ market, title, icon }: MarketCardProps) {
  const trendColor = market.trend === 'up' ? '#10B981' : market.trend === 'down' ? '#EF4444' : '#6B7280';
  const trendArrow = market.trend === 'up' ? '↑' : market.trend === 'down' ? '↓' : '→';

  return (
    <div className="market-card" role="region" aria-label={`${title} market update`}>
      <div className="market-header">
        <span className="market-icon" aria-hidden="true">{icon}</span>
        <h4 className="market-title">{title}</h4>
        <span className="market-trend" style={{ color: trendColor }} aria-label={`Trend: ${market.trend}`}>
          {trendArrow} {market.trend.toUpperCase()}
        </span>
      </div>
      <p className="market-summary">{market.summary}</p>
      {market.keyPoints.length > 0 && (
        <ul className="market-points">
          {market.keyPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface OpportunityCardProps {
  opportunity: {
    category: string;
    name: string;
    description: string;
    riskLevel: number;
    expectedReturn: string;
    timeHorizon: string;
    action: 'buy' | 'hold' | 'sell' | 'watch';
    reason: string;
  };
}

function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const actionColors = {
    buy: '#10B981',
    hold: '#F59E0B',
    sell: '#EF4444',
    watch: '#6B7280',
  };

  const riskColor = opportunity.riskLevel <= 3 ? '#10B981' : opportunity.riskLevel <= 6 ? '#F59E0B' : '#EF4444';

  return (
    <div className="opportunity-card">
      <div className="opportunity-header">
        <span className="opportunity-category">{opportunity.category}</span>
        <span
          className="opportunity-action"
          style={{ backgroundColor: actionColors[opportunity.action] }}
        >
          {opportunity.action.toUpperCase()}
        </span>
      </div>
      <h4 className="opportunity-name">{opportunity.name}</h4>
      <p className="opportunity-description">{opportunity.description}</p>

      <div className="opportunity-details">
        <div className="detail-item">
          <span className="detail-label">Risk Level:</span>
          <span className="detail-value" style={{ color: riskColor }}>
            {opportunity.riskLevel}/10
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Expected Return:</span>
          <span className="detail-value">{opportunity.expectedReturn}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Time Horizon:</span>
          <span className="detail-value">{opportunity.timeHorizon}</span>
        </div>
      </div>

      <div className="opportunity-reason">
        <span className="reason-label">Why: </span>
        <span className="reason-text">{opportunity.reason}</span>
      </div>

      <div className="opportunity-disclaimer">
        ⚠️ This is not financial advice. Do your own research.
      </div>
    </div>
  );
}
