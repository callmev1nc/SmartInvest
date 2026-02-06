/**
 * Daily Investment Updates Service
 * Uses Google Gemini AI to provide daily market insights and recommendations
 */

import { GoogleGenAI } from '@google/genai';
import { getGreeting } from '@/constants/uma';
import type { RiskProfile } from '@/constants/investment';

export interface DailyUpdate {
  date: string;
  riskProfile: RiskProfile | null;
  markets: {
    stocks: MarketUpdate;
    crypto: MarketUpdate;
    realEstate: MarketUpdate;
    international: MarketUpdate;
    alternativeInvestments: MarketUpdate;
  };
  opportunities: InvestmentOpportunity[];
  summary: string;
}

export interface MarketUpdate {
  trend: 'up' | 'down' | 'neutral';
  summary: string;
  keyPoints: string[];
}

export interface InvestmentOpportunity {
  category: string;
  name: string;
  description: string;
  riskLevel: number;
  expectedReturn: string;
  timeHorizon: string;
  action: 'buy' | 'hold' | 'sell' | 'watch';
  reason: string;
}

/**
 * Get the API client
 */
function getAIClient() {
  const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not set');
  }

  return new GoogleGenAI({ apiKey });
}

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Generate personalized daily investment updates using Gemini AI
 */
export async function generateDailyUpdates(
  riskProfile: RiskProfile | null
): Promise<DailyUpdate> {
  try {
    const ai = getAIClient();

    const prompt = `You are an expert financial analyst providing daily investment updates for ${new Date().toLocaleDateString()}.

User's Risk Profile: ${riskProfile ? riskProfile.toUpperCase() : 'Not assessed yet'}

Please analyze and provide updates for the following investment categories:

1. **STOCKS** - Major indices (S&P 500, NASDAQ, Dow Jones)
2. **CRYPTO** - Bitcoin, Ethereum, and major cryptocurrencies
3. **REAL ESTATE** - REITs and property market
4. **INTERNATIONAL** - Global markets, forex, emerging markets
5. **ALTERNATIVE INVESTMENTS** - NFTs, commodities, collectibles

For each category, provide:
- Current trend (up/down/neutral)
- Brief 2-sentence summary
- 2-3 key bullet points

Then provide:
- 3-5 specific investment opportunities personalized for a ${riskProfile || 'moderate'} investor
- Each opportunity should include: category, name, description, risk level (1-10), expected return, time horizon, action (buy/hold/sell/watch), and reasoning

IMPORTANT:
- Be conservative and educational, not advisory
- Include appropriate disclaimers
- If risk profile is unknown, suggest moderate investments
- Keep responses concise and actionable
- Format as JSON with this exact structure:
{
  "summary": "Overall market summary (2-3 sentences)",
  "stocks": {"trend": "up/down/neutral", "summary": "...", "keyPoints": ["...", "..."]},
  "crypto": {"trend": "up/down/neutral", "summary": "...", "keyPoints": ["...", "..."]},
  "realEstate": {"trend": "up/down/neutral", "summary": "...", "keyPoints": ["...", "..."]},
  "international": {"trend": "up/down/neutral", "summary": "...", "keyPoints": ["...", "..."]},
  "alternativeInvestments": {"trend": "up/down/neutral", "summary": "...", "keyPoints": ["...", "..."]},
  "opportunities": [
    {"category": "...", "name": "...", "description": "...", "riskLevel": 5, "expectedReturn": "...", "timeHorizon": "...", "action": "buy", "reason": "..."}
  ]
}

Respond ONLY with valid JSON, no additional text.`;

    const config = {
      thinkingConfig: {
        thinkingLevel: 'HIGH',
      },
      tools: [
        {
          googleSearch: {},
        },
      ],
    };

    const contents = [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ];

    const response = await ai.models.generateContentStream({
      model: 'gemini-3-pro-preview',
      config,
      contents,
    });

    let fullResponse = '';
    for await (const chunk of response) {
      fullResponse += chunk.text;
    }

    // Parse JSON response
    const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }

    const aiData = JSON.parse(jsonMatch[0]);

    return {
      date: getTodayDate(),
      riskProfile,
      markets: {
        stocks: aiData.stocks || { trend: 'neutral', summary: 'Market data unavailable', keyPoints: [] },
        crypto: aiData.crypto || { trend: 'neutral', summary: 'Market data unavailable', keyPoints: [] },
        realEstate: aiData.realEstate || { trend: 'neutral', summary: 'Market data unavailable', keyPoints: [] },
        international: aiData.international || { trend: 'neutral', summary: 'Market data unavailable', keyPoints: [] },
        alternativeInvestments: aiData.alternativeInvestments || { trend: 'neutral', summary: 'Market data unavailable', keyPoints: [] },
      },
      opportunities: aiData.opportunities || [],
      summary: aiData.summary || 'Market update for today',
    };
  } catch (error) {
    console.error('Error generating daily updates:', error);

    // Return fallback data
    return getFallbackDailyUpdates(riskProfile);
  }
}

/**
 * Get fallback daily updates if AI fails
 */
function getFallbackDailyUpdates(riskProfile: RiskProfile | null): DailyUpdate {
  return {
    date: getTodayDate(),
    riskProfile,
    markets: {
      stocks: {
        trend: 'neutral',
        summary: 'Markets are showing mixed signals today. Stay diversified and focused on long-term goals.',
        keyPoints: [
          'S&P 500 holding steady',
          'Tech stocks showing volatility',
          'Consider dollar-cost averaging',
        ],
      },
      crypto: {
        trend: 'neutral',
        summary: 'Crypto markets remain volatile. Only invest what you can afford to lose.',
        keyPoints: [
          'Bitcoin testing key levels',
          'Ethereum showing strength',
          'High volatility continues',
        ],
      },
      realEstate: {
        trend: 'up',
        summary: 'Real estate and REITs showing resilience. Good for income-focused investors.',
        keyPoints: [
          'REIT dividends remain attractive',
          'Commercial sector recovering',
          'Residential market stable',
        ],
      },
      international: {
        trend: 'neutral',
        summary: 'Global markets offer diversification benefits but carry currency risk.',
        keyPoints: [
          'Emerging markets showing growth',
          'European markets cautious',
          'Asian markets mixed',
        ],
      },
      alternativeInvestments: {
        trend: 'neutral',
        summary: 'Alternative investments like NFTs remain highly speculative.',
        keyPoints: [
          'NFT market cooling down',
          'Commodities stabilizing',
          'High risk, high reward category',
        ],
      },
    },
    opportunities: [
      {
        category: 'Stocks',
        name: 'S&P 500 Index Fund',
        description: 'Diversified exposure to 500 largest US companies',
        riskLevel: riskProfile === 'conservative' ? 4 : riskProfile === 'moderate' ? 5 : 6,
        expectedReturn: '8-10% annually',
        timeHorizon: '5+ years',
        action: 'buy',
        reason: 'Broad market exposure with solid long-term track record',
      },
      {
        category: 'Crypto',
        name: 'Bitcoin',
        description: 'Digital gold and store of value',
        riskLevel: 9,
        expectedReturn: 'Highly variable',
        timeHorizon: '3+ years',
        action: riskProfile === 'growth' ? 'watch' : 'hold',
        reason: riskProfile === 'growth' ? 'Only for aggressive growth investors' : 'Too volatile for your profile',
      },
      {
        category: 'Real Estate',
        name: 'REIT Index Fund',
        description: 'Real Estate Investment Trust for passive income',
        riskLevel: 5,
        expectedReturn: '4-7% dividends + appreciation',
        timeHorizon: '5+ years',
        action: 'buy',
        reason: 'Good income generation with inflation hedge',
      },
    ],
    summary: 'Daily market update: Markets are navigating through uncertainty. Stay focused on your long-term investment goals and maintain proper diversification.',
  };
}

/**
 * Get cached daily updates from localStorage
 */
export function getCachedDailyUpdates(riskProfile: RiskProfile | null): DailyUpdate | null {
  try {
    const today = getTodayDate();
    const cacheKey = `daily_updates_${riskProfile || 'default'}_${today}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    return null;
  } catch (error) {
    console.error('Error reading cached updates:', error);
    return null;
  }
}

/**
 * Cache daily updates in localStorage
 */
export function cacheDailyUpdates(updates: DailyUpdate): void {
  try {
    const cacheKey = `daily_updates_${updates.riskProfile || 'default'}_${updates.date}`;
    localStorage.setItem(cacheKey, JSON.stringify(updates));

    // Clean old cache entries (keep only last 7 days)
    cleanOldCache();
  } catch (error) {
    console.error('Error caching updates:', error);
  }
}

/**
 * Clean cache entries older than 7 days
 */
function cleanOldCache(): void {
  try {
    const keys = Object.keys(localStorage);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    keys.forEach((key) => {
      if (key.startsWith('daily_updates_')) {
        const dateMatch = key.match(/\d{4}-\d{2}-\d{2}/);
        if (dateMatch) {
          const cacheDate = new Date(dateMatch[0]);
          if (cacheDate < sevenDaysAgo) {
            localStorage.removeItem(key);
          }
        }
      }
    });
  } catch (error) {
    console.error('Error cleaning cache:', error);
  }
}

/**
 * Check if updates are available for today
 */
export function hasTodaysUpdates(riskProfile: RiskProfile | null): boolean {
  return getCachedDailyUpdates(riskProfile) !== null;
}

/**
 * Get daily updates with automatic refresh if needed
 */
export async function getDailyUpdates(
  riskProfile: RiskProfile | null,
  forceRefresh = false
): Promise<DailyUpdate> {
  // Check cache first
  if (!forceRefresh) {
    const cached = getCachedDailyUpdates(riskProfile);
    if (cached) {
      return cached;
    }
  }

  // Generate new updates
  const updates = await generateDailyUpdates(riskProfile);

  // Cache the updates
  cacheDailyUpdates(updates);

  return updates;
}
