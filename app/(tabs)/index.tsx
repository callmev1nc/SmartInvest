/**
 * Home Screen - Main dashboard screen
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { userName, riskProfile } = useUser();

  const features = [
    {
      id: '1',
      title: 'Chat with Uma',
      description: 'Get personalized investment advice',
      icon: '🤖',
      route: '/uma',
    },
    {
      id: '2',
      title: 'Risk Assessment',
      description: 'Discover your investor profile',
      icon: '📊',
      route: '/quiz',
    },
    {
      id: '3',
      title: 'Investment Options',
      description: 'Explore investment opportunities',
      icon: '💰',
      route: '/explore',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.greeting}>
          {userName ? `Hi, ${userName}! 👋` : 'Welcome! 👋'}
        </Text>
        <Text style={styles.subtitle}>
          Your personal AI investment advisor is ready to help
        </Text>
      </View>

      {/* Risk Profile Banner */}
      {riskProfile ? (
        <View style={[styles.banner, styles.profileBanner]}>
          <Text style={styles.bannerIcon}>🎯</Text>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Your Risk Profile</Text>
            <Text style={styles.bannerText}>
              {riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1)} Investor
            </Text>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.banner, styles.ctaBanner]}
          onPress={() => router.push('/quiz')}
        >
          <Text style={styles.bannerIcon}>📋</Text>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Take the Quiz</Text>
            <Text style={styles.bannerText}>
              Discover your investor profile in 5 minutes
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Features Grid */}
      <Text style={styles.sectionTitle}>Get Started</Text>
      <View style={styles.featuresGrid}>
        {features.map((feature) => (
          <TouchableOpacity
            key={feature.id}
            style={styles.featureCard}
            onPress={() => router.push(feature.route as any)}
          >
            <Text style={styles.featureIcon}>{feature.icon}</Text>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tips Section */}
      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>💡 Tips for Your Savings</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Start Small, Think Big</Text>
          <Text style={styles.tipText}>
            Even small investments can grow significantly over time. The key is consistency
            and starting early.
          </Text>
        </View>
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Diversify Your Portfolio</Text>
          <Text style={styles.tipText}>
            Don't put all your eggs in one basket. Spread investments across different
            asset classes to manage risk.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  welcomeSection: {
    padding: Spacing.lg,
    backgroundColor: Colors.background,
  },
  greeting: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  profileBanner: {
    backgroundColor: Colors.primaryLight,
  },
  ctaBanner: {
    backgroundColor: Colors.secondary,
  },
  bannerIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    ...Typography.h4,
    color: Colors.background,
    marginBottom: Spacing.xs,
  },
  bannerText: {
    ...Typography.body,
    color: Colors.background,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  featureCard: {
    width: '100%',
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  featureTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  featureDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  tipsSection: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  tipCard: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  tipTitle: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  tipText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
