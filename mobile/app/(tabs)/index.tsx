import React from 'react';
import {
  ScrollView,
  StyleSheet,
  RefreshControl,
  useColorScheme,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import BreakingNewsTicker from '@/components/BreakingNewsTicker';
import HeroCarousel from '@/components/HeroCarousel';
import TrendingSection from '@/components/TrendingSection';
import CategorySection from '@/components/CategorySection';
import { categoryAPI } from '@/services/api';
import { Colors, Spacing } from '@/constants/Colors';
import type { Category, APIResponse } from '@/types';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const {
    data: categoriesData,
    isLoading,
    refetch,
    isRefetching,
    error,
  } = useQuery<{ data: APIResponse<Category[]> }>({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getAll(),
    staleTime: 1000 * 60 * 10,
  });

  const categories = categoriesData?.data?.data || [];

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          समाचार लोड हुँदैछ...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorEmoji]}>😕</Text>
        <Text style={[styles.errorText, { color: colors.text }]}>
          समाचार लोड गर्न सकिएन
        </Text>
        <Text style={[styles.errorSubtext, { color: colors.textSecondary }]}>
          कृपया इन्टरनेट जडान जाँच गर्नुहोस्
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Breaking News Ticker */}
      <BreakingNewsTicker />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Hero Carousel */}
        <View style={styles.section}>
          <HeroCarousel />
        </View>

        {/* Trending Section */}
        <View style={styles.paddedSection}>
          <TrendingSection />
        </View>

        {/* Category Sections */}
        {categories.slice(0, 6).map((category) => (
          <CategorySection key={category._id} category={category} />
        ))}

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: Spacing.md,
  },
  paddedSection: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  bottomSpacing: {
    height: Spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});
