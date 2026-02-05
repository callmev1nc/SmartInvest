import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { RISK_PROFILES, type RiskProfile } from '@/constants/investment';
import './Quiz.css';

export default function Quiz() {
  const { riskProfile, setRiskProfile } = useUser();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const questions = [
    {
      id: 1,
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
      question: 'How would you react if your investments dropped 20% in a month?',
      options: [
        'Sell everything to prevent further losses',
        'Sell some investments',
        'Hold and wait for recovery',
        'Buy more at lower prices',
      ],
    },
    {
      id: 3,
      question: 'What is your investment timeframe?',
      options: [
        'Less than 2 years',
        '2-5 years',
        '5-10 years',
        'More than 10 years',
      ],
    },
    {
      id: 4,
      question: 'How much investment experience do you have?',
      options: [
        'None, this is my first time',
        'Limited (some basic knowledge)',
        'Moderate (familiar with stocks/bonds)',
        'Extensive (experienced investor)',
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
    const conservativeCount = Object.values(answers).filter(
      (a, i) => questions[i].options.indexOf(a) <= 1
    ).length;

    let profile: RiskProfile;
    if (conservativeCount >= 3) {
      profile = 'conservative';
    } else if (conservativeCount >= 1) {
      profile = 'moderate';
    } else {
      profile = 'growth';
    }

    setRiskProfile(profile);
    setCurrentQuestion(0);
    setAnswers({});
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
  };

  if (riskProfile) {
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

          <button className="reset-button" onClick={resetQuiz}>
            Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

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

        {/* Question */}
        <div className="question-card">
          <h2 className="question">{questions[currentQuestion].question}</h2>

          <div className="options">
            {questions[currentQuestion].options.map((option, index) => (
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

        <button className="skip-button" onClick={resetQuiz}>
          Start Over
        </button>
      </div>
    </div>
  );
}
