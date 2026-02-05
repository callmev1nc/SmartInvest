/**
 * Quiz Screen - Risk profile assessment
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useUser } from '@/contexts/UserContext';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';

export default function QuizScreen() {
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
    // Simple calculation logic
    const conservativeCount = Object.values(answers).filter(
      (a, i) => questions[i].options.indexOf(a) <= 1
    ).length;

    let profile: 'conservative' | 'moderate' | 'growth';
    if (conservativeCount >= 3) {
      profile = 'conservative';
    } else if (conservativeCount >= 1) {
      profile = 'moderate';
    } else {
      profile = 'growth';
    }

    setRiskProfile(profile);

    Alert.alert(
      'Assessment Complete!',
      `Your risk profile is: ${profile.toUpperCase()}\n\nUma will now provide personalized recommendations based on your profile.`,
      [{ text: 'OK', onPress: () => setCurrentQuestion(0) }]
    );
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
  };

  if (riskProfile) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.emoji}>🎯</Text>
          <Text style={styles.title}>Your Risk Profile</Text>
          <View style={styles.resultCard}>
            <Text style={styles.resultText}>{riskProfile.toUpperCase()}</Text>
          </View>
          <Text style={styles.description}>
            {riskProfile === 'conservative' &&
              'You prioritize capital preservation and prefer stable, low-risk investments.'}
            {riskProfile === 'moderate' &&
              'You balance growth potential with stability through diversified investments.'}
            {riskProfile === 'growth' &&
              'You seek maximum long-term returns and are comfortable with higher volatility.'}
          </Text>
          <TouchableOpacity style={styles.button} onPress={resetQuiz}>
            <Text style={styles.buttonText}>Retake Assessment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Risk Assessment</Text>
        <Text style={styles.subtitle}>
          Answer {questions.length} questions to discover your investor profile
        </Text>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>

        {/* Question */}
        <View style={styles.questionCard}>
          <Text style={styles.question}>{questions[currentQuestion].question}</Text>

          {questions[currentQuestion].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={() => handleAnswer(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.skipButton} onPress={resetQuiz}>
          <Text style={styles.skipButtonText}>Start Over</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  content: {
    padding: Spacing.lg,
  },
  emoji: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  progressContainer: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  progressText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  questionCard: {
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  question: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  option: {
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  optionText: {
    ...Typography.body,
    color: Colors.text,
  },
  resultCard: {
    backgroundColor: Colors.primary,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginVertical: Spacing.lg,
  },
  resultText: {
    ...Typography.h1,
    color: Colors.background,
    textAlign: 'center',
    fontWeight: '700',
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  buttonText: {
    ...Typography.h4,
    color: Colors.background,
    fontWeight: '600',
  },
  skipButton: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  skipButtonText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
});
