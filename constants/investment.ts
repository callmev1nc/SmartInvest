/**
 * Investment types and risk profile configurations
 */

export type RiskProfile = 'conservative' | 'moderate' | 'growth';

export interface InvestmentType {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  riskLevel: number; // 1-10
  expectedReturn: string;
  liquidity: string;
  suitableProfiles: RiskProfile[];
}

export const INVESTMENT_TYPES: InvestmentType[] = [
  {
    id: 'fixed-deposit',
    name: 'Fixed Deposit',
    description: 'A low-risk investment with guaranteed returns',
    minAmount: 500,
    riskLevel: 1,
    expectedReturn: '4-6% per annum',
    liquidity: 'Low (locked-in period)',
    suitable_profiles: ['conservative', 'moderate'],
  },
  {
    id: 'money-market-fund',
    name: 'Money Market Fund',
    description: 'Low-risk mutual fund investing in short-term debt',
    minAmount: 1000,
    riskLevel: 2,
    expectedReturn: '5-7% per annum',
    liquidity: 'High (easy withdrawal)',
    suitable_profiles: ['conservative', 'moderate'],
  },
  {
    id: 'government-bonds',
    name: 'Government Bonds',
    description: 'Low-risk debt securities issued by governments',
    minAmount: 1000,
    riskLevel: 2,
    expectedReturn: '5-8% per annum',
    liquidity: 'Medium (can be sold)',
    suitable_profiles: ['conservative', 'moderate', 'growth'],
  },
  {
    id: 'balanced-fund',
    name: 'Balanced Mutual Fund',
    description: 'Diversified fund with mix of stocks and bonds',
    minAmount: 2000,
    riskLevel: 4,
    expectedReturn: '8-12% per annum',
    liquidity: 'High (daily NAV)',
    suitable_profiles: ['moderate'],
  },
  {
    id: 'index-fund',
    name: 'Index Fund (ETF)',
    description: 'Passive investment tracking market indices',
    minAmount: 500,
    riskLevel: 5,
    expectedReturn: '10-15% per annum (avg)',
    liquidity: 'High (trade anytime)',
    suitable_profiles: ['moderate', 'growth'],
  },
  {
    id: 'growth-fund',
    name: 'Growth Mutual Fund',
    description: 'Aggressive fund focusing on capital appreciation',
    minAmount: 2000,
    riskLevel: 7,
    expectedReturn: '12-18% per annum',
    liquidity: 'High (daily NAV)',
    suitable_profiles: ['growth'],
  },
  {
    id: 'sector-fund',
    name: 'Sector-Specific Fund',
    description: 'Focused fund investing in specific sectors',
    minAmount: 3000,
    riskLevel: 8,
    expectedReturn: '15-25% per annum (varies)',
    liquidity: 'Medium (depends on fund)',
    suitable_profiles: ['growth'],
  },
];

export interface RiskProfileInfo {
  id: RiskProfile;
  name: string;
  description: string;
  characteristics: string[];
  recommendedAllocation: {
    cash: number;
    bonds: number;
    stocks: number;
  };
}

export const RISK_PROFILES: Record<RiskProfile, RiskProfileInfo> = {
  conservative: {
    id: 'conservative',
    name: 'Conservative',
    description: 'You prioritize capital preservation over high returns',
    characteristics: [
      'Low risk tolerance',
      'Prefer stable, guaranteed returns',
      'Short to medium investment horizon',
      'Peace of mind is important',
    ],
    recommendedAllocation: {
      cash: 30,
      bonds: 50,
      stocks: 20,
    },
  },
  moderate: {
    id: 'moderate',
    name: 'Moderate',
    description: 'You balance growth potential with stability',
    characteristics: [
      'Medium risk tolerance',
      'Comfortable with some volatility',
      'Medium to long investment horizon',
      'Seek balance of growth and safety',
    ],
    recommendedAllocation: {
      cash: 10,
      bonds: 40,
      stocks: 50,
    },
  },
  growth: {
    id: 'growth',
    name: 'Growth-Oriented',
    description: 'You maximize long-term returns with higher risk',
    characteristics: [
      'High risk tolerance',
      'Comfortable with market volatility',
      'Long investment horizon (5+ years)',
      'Seek maximum growth potential',
    ],
    recommendedAllocation: {
      cash: 5,
      bonds: 15,
      stocks: 80,
    },
  },
};

/**
 * Calculate match score for investment type based on risk profile
 */
export function calculateMatchScore(
  investment: InvestmentType,
  userRiskProfile: RiskProfile
): number {
  if (!investment.suitable_profiles.includes(userRiskProfile)) {
    return 0;
  }

  const profile = RISK_PROFILES[userRiskProfile];
  const riskTolerance = userRiskProfile === 'conservative' ? 3 : userRiskProfile === 'moderate' ? 6 : 9;

  // Calculate score based on risk level alignment
  const riskDiff = Math.abs(investment.riskLevel - riskTolerance);
  const riskScore = Math.max(0, 100 - riskDiff * 15);

  return Math.round(riskScore);
}

/**
 * Get investment recommendations based on risk profile
 */
export function getInvestmentRecommendations(
  riskProfile: RiskProfile,
  budget?: number
): Array<{ investment: InvestmentType; matchScore: number }> {
  return INVESTMENT_TYPES
    .filter((inv) => !budget || inv.minAmount <= budget)
    .filter((inv) => inv.suitable_profiles.includes(riskProfile))
    .map((investment) => ({
      investment,
      matchScore: calculateMatchScore(investment, riskProfile),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}
