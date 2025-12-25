import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { newsAPI } from '../services/api';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/Colors';
import { getLocalizedString, formatViews } from '../utils/helpers';
import type { News, APIResponse } from '../types';

export default function TrendingSection() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const { data, isLoading } = useQuery<{ data: APIResponse<News[]> }>({
    queryKey: ['trending-news'],
    queryFn: () => newsAPI.getTrending(5),
    staleTime: 1000 * 60 * 5,
  });

  const trendingNews = data?.data?.data || [];

  const renderItem = ({ item, index }: { item: News; index: number }) => {
    const title = getLocalizedString(item.title);
    
    return (
      <TouchableOpacity
        style={[styles.item, { backgroundColor: colors.surface }]}
        onPress={() => router.push(`/news/${item.slug}`)}
        activeOpacity={0.7}
      >
        <View style={[styles.rank, { backgroundColor: colors.primary }]}>
          <Text style={styles.rankText}>{index + 1}</Text>
        </View>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {title}
          </Text>
          <View style={styles.meta}>
            <Ionicons name="eye-outline" size={12} color={colors.textMuted} />
            <Text style={[styles.views, { color: colors.textMuted }]}>
              {formatViews(item.viewCount)}
            </Text>
          </View>
        </View>
        <Image
          source={{ uri: item.featuredImage?.url }}
          style={styles.thumbnail}
          contentFit="cover"
          transition={200}
        />
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <View style={styles.header}>
          <View style={[styles.skeletonTitle, { backgroundColor: colors.border }]} />
        </View>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[styles.skeletonItem, { backgroundColor: colors.border }]}
          />
        ))}
      </View>
    );
  }

  if (trendingNews.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Ionicons name="trending-up" size={20} color={colors.primary} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          लोकप्रिय समाचार
        </Text>
      </View>
      <FlatList
        data={trendingNews}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  rank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  rankText: {
    color: '#FFFFFF',
    fontSize: FontSizes.xs,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  views: {
    fontSize: FontSizes.xs,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.md,
  },
  skeletonTitle: {
    height: 20,
    width: 120,
    borderRadius: BorderRadius.sm,
  },
  skeletonItem: {
    height: 70,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
});
