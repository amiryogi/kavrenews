import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/Colors';
import { getLocalizedString, formatDate } from '../utils/helpers';
import type { News } from '../types';

interface NewsCardProps {
  news: News;
  variant?: 'default' | 'compact' | 'horizontal';
}

export default function NewsCard({ news, variant = 'default' }: NewsCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const handlePress = () => {
    router.push(`/news/${news.slug}`);
  };

  const categoryName = getLocalizedString(news.category?.name);
  const title = getLocalizedString(news.title);
  const excerpt = getLocalizedString(news.excerpt);
  const dateStr = formatDate(news.publishedAt || news.createdAt);

  if (variant === 'horizontal') {
    return (
      <TouchableOpacity
        style={[styles.horizontalCard, { backgroundColor: colors.surface }]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: news.featuredImage?.url }}
          style={styles.horizontalImage}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.horizontalContent}>
          {categoryName ? (
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={styles.categoryText}>{categoryName}</Text>
            </View>
          ) : null}
          <Text
            style={[styles.horizontalTitle, { color: colors.text }]}
            numberOfLines={2}
          >
            {title}
          </Text>
          <Text style={[styles.date, { color: colors.textMuted }]}>
            {dateStr}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'compact') {
    return (
      <TouchableOpacity
        style={[styles.compactCard, { backgroundColor: colors.surface }]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: news.featuredImage?.url }}
          style={styles.compactImage}
          contentFit="cover"
          transition={200}
        />
        <Text
          style={[styles.compactTitle, { color: colors.text }]}
          numberOfLines={2}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: news.featuredImage?.url }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.content}>
        {categoryName ? (
          <View
            style={[styles.categoryBadge, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.categoryText}>{categoryName}</Text>
          </View>
        ) : null}
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {title}
        </Text>
        <Text
          style={[styles.excerpt, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {excerpt}
        </Text>
        <Text style={[styles.date, { color: colors.textMuted }]}>
          {dateStr}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Default card styles
  card: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: Spacing.md,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
    lineHeight: 24,
  },
  excerpt: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  date: {
    fontSize: FontSizes.xs,
  },

  // Horizontal card styles
  horizontalCard: {
    flexDirection: 'row',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  horizontalImage: {
    width: 120,
    height: 100,
  },
  horizontalContent: {
    flex: 1,
    padding: Spacing.sm,
    justifyContent: 'center',
  },
  horizontalTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    lineHeight: 22,
  },

  // Compact card styles
  compactCard: {
    width: 150,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginRight: Spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  compactImage: {
    width: '100%',
    height: 100,
  },
  compactTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    padding: Spacing.sm,
    lineHeight: 18,
  },
});
