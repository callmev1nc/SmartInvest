/**
 * Daily Investment Updates Component
 * Displays AI-powered daily market analysis and personalized recommendations
 */

import { useState, useEffect } from 'react';
import { getDailyUpdates, type DailyUpdate, type MarketUpdate } from '@/services/dailyUpdates';
import { useUser } from '@/contexts/UserContext';
import './DailyUpdates.css';

export function DailyUpdates() {
  const { riskProfile } = useUser();
  const [updates, setUpdates] = useState<DailyUpdate | null>(null);
  const [loading, setLoading] = useState(true);
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

  const handleRefresh = () => {
    loadUpdates(true);
  };

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

  if (error || !updates) {
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
    <div className="daily-updates">
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
          </span>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="refresh-button"
          >
            {refreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="updates-summary">
        <p>{updates.summary}</p>
        <p className="disclaimer">
          💡 AI-powered analysis based on current market data. Not financial advice.
        </p>
      </div>

      {/* Market Overview */}
      <div className="markets-grid">
        <MarketCard market={updates.markets.stocks} title="Stocks" icon="📈" />
        <MarketCard market={updates.markets.crypto} title="Crypto" icon="₿" />
        <MarketCard market={updates.markets.realEstate} title="Real Estate" icon="🏠" />
        <MarketCard market={updates.markets.international} title="International" icon="🌍" />
        <MarketCard market={updates.markets.alternativeInvestments} title="Alternatives" icon="🎨" />
      </div>

      {/* Opportunities */}
      {updates.opportunities.length > 0 && (
        <div className="opportunities-section">
          <h3 className="opportunities-title">
            🎯 Top Opportunities for {riskProfile ? riskProfile.toUpperCase() : 'MODERATE'} Investors
          </h3>
          <div className="opportunities-grid">
            {updates.opportunities.map((opp, index) => (
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
    <div className="market-card">
      <div className="market-header">
        <span className="market-icon">{icon}</span>
        <h4 className="market-title">{title}</h4>
        <span className="market-trend" style={{ color: trendColor }}>
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
