/**
 * Explore Screen - Investment discovery and educational content
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { getInvestmentRecommendations } from '@/constants/investment';
import { useUser } from '@/contexts/UserContext';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';

export default function ExploreScreen() {
  const { riskProfile } = useUser();

  const recommendations = riskProfile
    ? getInvestmentRecommendations(riskProfile)
    : [];

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

  return (
    <ScrollView style={styles.container}>
      {/* Risk Profile Notice */}
      {!riskProfile && (
        <View style={styles.notice}>
          <Text style={styles.noticeIcon}>💡</Text>
          <Text style={styles.noticeText}>
            Take the risk assessment quiz to get personalized investment recommendations!
          </Text>
        </View>
      )}

      {/* Personalized Recommendations */}
      {riskProfile && recommendations.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          {recommendations.slice(0, 3).map(({ investment, matchScore }) => (
            <View key={investment.id} style={styles.investmentCard}>
              <View style={styles.investmentHeader}>
                <Text style={styles.investmentName}>{investment.name}</Text>
                <View style={styles.matchScore}>
                  <Text style={styles.matchScoreText}>{matchScore}% Match</Text>
                </View>
              </View>
              <Text style={styles.investmentDescription}>{investment.description}</Text>
              <View style={styles.investmentDetails}>
                <Text style={styles.detailText}>💰 Min: ${investment.minAmount}</Text>
                <Text style={styles.detailText}>📊 Risk: {investment.riskLevel}/10</Text>
                <Text style={styles.detailText}>📈 {investment.expectedReturn}</Text>
              </View>
            </View>
          ))}
        </>
      )}

      {/* All Investment Options */}
      <Text style={styles.sectionTitle}>Investment Options</Text>
      {['Conservative', 'Moderate', 'Growth'].map((level) => (
        <TouchableOpacity key={level} style={styles.categoryCard}>
          <Text style={styles.categoryTitle}>{level}</Text>
          <Text style={styles.categoryDescription}>
            {level === 'Conservative' && 'Low risk, stable returns'}
            {level === 'Moderate' && 'Balanced risk and growth'}
            {level === 'Growth' && 'High risk, high potential returns'}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Educational Content */}
      <Text style={styles.sectionTitle}>Learn About Investing</Text>
      {educationalContent.map((content) => (
        <TouchableOpacity key={content.id} style={styles.contentCard}>
          <Text style={styles.contentIcon}>{content.icon}</Text>
          <View style={styles.contentInfo}>
            <Text style={styles.contentTitle}>{content.title}</Text>
            <View style={styles.contentMeta}>
              <Text style={styles.contentCategory}>{content.category}</Text>
              <Text style={styles.contentDuration}>{content.duration}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      {/* Glossary */}
      <Text style={styles.sectionTitle}>Key Terms</Text>
      <View style={styles.glossaryCard}>
        <Text style={styles.term}>Liquidity</Text>
        <Text style={styles.definition}>
          How quickly you can convert an investment to cash without losing value
        </Text>
      </View>
      <View style={styles.glossaryCard}>
        <Text style={styles.term}>Yield</Text>
        <Text style={styles.definition}>
          The income returned on an investment, expressed as a percentage
        </Text>
      </View>
      <View style={styles.glossaryCard}>
        <Text style={styles.term}>Diversification</Text>
        <Text style={styles.definition}>
          Spreading investments across different assets to reduce risk
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  notice: {
    flexDirection: 'row',
    backgroundColor: Colors.info,
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  noticeIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  noticeText: {
    flex: 1,
    ...Typography.bodySmall,
    color: Colors.background,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  investmentCard: {
    backgroundColor: Colors.background,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  investmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  investmentName: {
    ...Typography.h4,
    color: Colors.text,
    flex: 1,
  },
  matchScore: {
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  matchScoreText: {
    ...Typography.caption,
    color: Colors.background,
    fontWeight: '600',
  },
  investmentDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  investmentDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  detailText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  categoryCard: {
    backgroundColor: Colors.background,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  categoryTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  categoryDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  contentCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  contentIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  contentInfo: {
    flex: 1,
  },
  contentTitle: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  contentMeta: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  contentCategory: {
    ...Typography.caption,
    color: Colors.primary,
  },
  contentDuration: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  glossaryCard: {
    backgroundColor: Colors.background,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  term: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  definition: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
