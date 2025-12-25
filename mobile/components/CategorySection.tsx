import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import NewsCard from './NewsCard';
import { newsAPI } from '../services/api';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/Colors';
import { getLocalizedString } from '../utils/helpers';
import type { Category, News, APIResponse } from '../types';

interface CategorySectionProps {
  category: Category;
}

export default function CategorySection({ category }: CategorySectionProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const categoryName = getLocalizedString(category.name);

  const { data, isLoading } = useQuery<{ data: APIResponse<News[]> }>({
    queryKey: ['category-news', category.slug],
    queryFn: () => newsAPI.getByCategory(category.slug, { limit: 4 }),
    staleTime: 1000 * 60 * 5,
  });

  const news = data?.data?.data || [];

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={[styles.skeletonTitle, { backgroundColor: colors.border }]} />
        </View>
        <View style={styles.skeletonGrid}>
          {[1, 2].map((i) => (
            <View
              key={i}
              style={[styles.skeletonCard, { backgroundColor: colors.border }]}
            />
          ))}
        </View>
      </View>
    );
  }

  if (news.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View
            style={[
              styles.titleAccent,
              { backgroundColor: category.color || colors.primary },
            ]}
          />
          <Text style={[styles.title, { color: colors.text }]}>
            {categoryName}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => router.push(`/category/${category.slug}`)}
        >
          <Text style={[styles.viewAllText, { color: colors.primary }]}>
            सबै हेर्नुहोस्
          </Text>
          <Ionicons name="arrow-forward" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={news}
        renderItem={({ item }) => <NewsCard news={item} variant="horizontal" />}
        keyExtractor={(item) => item._id}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleAccent: {
    width: 4,
    height: 24,
    borderRadius: 2,
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  skeletonTitle: {
    height: 24,
    width: 120,
    borderRadius: BorderRadius.sm,
  },
  skeletonGrid: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  skeletonCard: {
    height: 100,
    borderRadius: BorderRadius.lg,
  },
});
