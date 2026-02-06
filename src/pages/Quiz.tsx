import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { RISK_PROFILES, type RiskProfile } from '@/constants/investment';
import './Quiz.css';

export default function Quiz() {
  const { riskProfile, setRiskProfile } = useUser();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(!!riskProfile);

  const questions = [
    {
      id: 1,
      category: 'Goals',
      question: 'What is your primary investment goal?',
      options: [
        'Preserve my capital',
        'Generate steady income',
        'Balance growth and stability',
        'Maximize long-term growth',
      ],
    },
    {
      id: 2,
      category: 'Goals',
      question: 'When do you plan to withdraw this money?',
      options: [
        'Within 1 year',
        '1-3 years',
        '3-5 years',
        'More than 5 years',
      ],
    },
    {
      id: 3,
      category: 'Risk Tolerance',
      question: 'How would you react if your investments dropped 20% in a month?',
      options: [
        'Sell everything to prevent further losses',
        'Sell some investments',
        'Hold and wait for recovery',
        'Buy more at lower prices',
      ],
    },
    {
      id: 4,
      category: 'Risk Tolerance',
      question: 'Which statement best describes your attitude toward risk?',
      options: [
        'I prefer safety over high returns',
        'I accept small risks for better returns',
        'I accept moderate risks for good returns',
        'I accept high risks for maximum returns',
      ],
    },
    {
      id: 5,
      category: 'Risk Tolerance',
      question: 'What is the maximum loss you could tolerate in a year?',
      options: [
        '0% - I cannot afford any losses',
        '1-5% loss',
        '5-10% loss',
        '10% or more loss',
      ],
    },
    {
      id: 6,
      category: 'Time Horizon',
      question: 'What is your investment timeframe?',
      options: [
        'Less than 2 years',
        '2-5 years',
        '5-10 years',
        'More than 10 years',
      ],
    },
    {
      id: 7,
      category: 'Time Horizon',
      question: 'How old are you?',
      options: [
        'Under 30',
        '30-45',
        '45-60',
        'Over 60',
      ],
    },
    {
      id: 8,
      category: 'Experience',
      question: 'How much investment experience do you have?',
      options: [
        'None, this is my first time',
        'Limited (some basic knowledge)',
        'Moderate (familiar with stocks/bonds)',
        'Extensive (experienced investor)',
      ],
    },
    {
      id: 9,
      category: 'Experience',
      question: 'Which investments have you owned before?',
      options: [
        'None / Only savings accounts',
        'Bonds or fixed deposits',
        'Mutual funds or ETFs',
        'Individual stocks or options',
      ],
    },
    {
      id: 10,
      category: 'Financial Situation',
      question: 'What percentage of your income can you invest monthly?',
      options: [
        'Less than 5%',
        '5-10%',
        '10-20%',
        'More than 20%',
      ],
    },
    {
      id: 11,
      category: 'Financial Situation',
      question: 'Do you have an emergency fund (3-6 months of expenses)?',
      options: [
        'No',
        'Less than 3 months',
        '3-6 months',
        'More than 6 months',
      ],
    },
    {
      id: 12,
      category: 'Investment Knowledge',
      question: 'How do you feel about market volatility?',
      options: [
        'Very uncomfortable, I lose sleep',
        'Somewhat uncomfortable',
        'Neutral, it doesn\'t bother me',
        'Comfortable, I see opportunities',
      ],
    },
    {
      id: 13,
      category: 'Investment Knowledge',
      question: 'How closely do you follow financial news?',
      options: [
        'Never',
        'Occasionally',
        'Weekly',
        'Daily',
      ],
    },
    {
      id: 14,
      category: 'Strategy',
      question: 'Which investment approach appeals to you most?',
      options: [
        'Guaranteed returns (CDs, bonds)',
        'Steady growth (blue-chip stocks)',
        'Balanced portfolio (mix of stocks and bonds)',
        'Aggressive growth (emerging markets, tech)',
      ],
    },
    {
      id: 15,
      category: 'Strategy',
      question: 'How would you invest a $10,000 bonus?',
      options: [
        'Put it all in savings',
        'Mostly in safe investments, some risk',
        'Balanced mix of investments',
        'Mostly in high-growth investments',
      ],
    },
    {
      id: 16,
      category: 'Psychology',
      question: 'Have you ever sold investments during a market downturn?',
      options: [
        'Yes, sold most of them',
        'Yes, sold some',
        'No, held everything',
        'No, bought more',
      ],
    },
    {
      id: 17,
      category: 'Psychology',
      question: 'What would you do if your friend doubled their money in a risky investment?',
      options: [
        'Stay away, too risky for me',
        'Invest a very small amount',
        'Invest a moderate amount',
        'Invest heavily to maximize gains',
      ],
    },
    {
      id: 18,
      category: 'Goals',
      question: 'What is your main purpose for investing?',
      options: [
        'Save for a specific short-term goal',
        'Build a retirement fund',
        'Generate passive income',
        'Build long-term wealth',
      ],
    },
  ];

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateAndSaveProfile();
    }
  };

  const calculateAndSaveProfile = () => {
    // Calculate score based on answers
    // First two options = conservative (0-1 points)
    // Middle options = moderate (2 points)
    // Last option = growth (3 points)
    let totalScore = 0;

    Object.values(answers).forEach((answer, answerIndex) => {
      const question = questions[answerIndex];
      const optionIndex = question.options.indexOf(answer);
      totalScore += optionIndex;
    });

    // Score range: 0 to (18 questions * 3) = 0-54
    // Conservative: 0-18
    // Moderate: 19-36
    // Growth: 37-54
    let profile: RiskProfile;
    if (totalScore <= 18) {
      profile = 'conservative';
    } else if (totalScore <= 36) {
      profile = 'moderate';
    } else {
      profile = 'growth';
    }

    setRiskProfile(profile);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    // Don't clear riskProfile from context, just hide results
  };

  const startOver = () => {
    resetQuiz();
  };

  if (showResults && riskProfile) {
    const profile = RISK_PROFILES[riskProfile];

    return (
      <div className="quiz">
        <div className="quiz-result">
          <span className="result-emoji">🎯</span>
          <h1 className="result-title">Your Risk Profile</h1>
          <div className="result-badge">{riskProfile.toUpperCase()}</div>
          <p className="result-description">{profile.description}</p>

          <div className="characteristics">
            <h3>Characteristics:</h3>
            <ul>
              {profile.characteristics.map((char, index) => (
                <li key={index}>{char}</li>
              ))}
            </ul>
          </div>

          <div className="allocation">
            <h3>Recommended Allocation:</h3>
            <div className="allocation-breakdown">
              <div className="allocation-item">
                <span className="allocation-label">Cash</span>
                <div className="allocation-bar">
                  <div
                    className="allocation-fill"
                    style={{ width: `${profile.recommendedAllocation.cash}%` }}
                  ></div>
                </div>
                <span className="allocation-percent">{profile.recommendedAllocation.cash}%</span>
              </div>
              <div className="allocation-item">
                <span className="allocation-label">Bonds</span>
                <div className="allocation-bar">
                  <div
                    className="allocation-fill"
                    style={{ width: `${profile.recommendedAllocation.bonds}%` }}
                  ></div>
                </div>
                <span className="allocation-percent">{profile.recommendedAllocation.bonds}%</span>
              </div>
              <div className="allocation-item">
                <span className="allocation-label">Stocks</span>
                <div className="allocation-bar">
                  <div
                    className="allocation-fill"
                    style={{ width: `${profile.recommendedAllocation.stocks}%` }}
                  ></div>
                </div>
                <span className="allocation-percent">{profile.recommendedAllocation.stocks}%</span>
              </div>
            </div>
          </div>

          <button className="reset-button" onClick={resetQuiz}>
            Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <div className="quiz">
      <div className="quiz-container">
        <h1 className="quiz-title">Risk Assessment</h1>
        <p className="quiz-subtitle">
          Answer {questions.length} questions to discover your investor profile
        </p>

        {/* Progress bar */}
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="progress-text">
          Question {currentQuestion + 1} of {questions.length}
        </p>

        {/* Category tag */}
        <div className="category-tag">{currentQ.category}</div>

        {/* Question */}
        <div className="question-card">
          <h2 className="question">{currentQ.question}</h2>

          <div className="options">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                className="option"
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <button className="skip-button" onClick={startOver}>
          Start Over
        </button>
      </div>
    </div>
  );
}
