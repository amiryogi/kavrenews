import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
  Share,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { newsAPI } from '@/services/api';
import NewsCard from '@/components/NewsCard';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/Colors';
import { getLocalizedString, formatDate, formatViews } from '@/utils/helpers';
import type { News, APIResponse } from '@/types';

export default function NewsDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { width } = useWindowDimensions();

  const { data, isLoading, error } = useQuery<{ data: APIResponse<News> }>({
    queryKey: ['news', slug],
    queryFn: () => newsAPI.getBySlug(slug!),
    enabled: !!slug,
  });

  const news = data?.data?.data;

  const { data: relatedData } = useQuery<{ data: APIResponse<News[]> }>({
    queryKey: ['related-news', news?._id],
    queryFn: () => newsAPI.getRelated(news!._id, 4),
    enabled: !!news?._id,
    staleTime: 1000 * 60 * 5,
  });

  const relatedNews = relatedData?.data?.data || [];

  const handleShare = async () => {
    if (!news) return;
    const title = getLocalizedString(news.title);
    const excerpt = getLocalizedString(news.excerpt);
    try {
      await Share.share({
        title: title,
        message: `${title}\n\n${excerpt}`,
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !news) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.text }]}>
          समाचार लोड गर्न सकिएन
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>पछाडि जानुहोस्</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Extract localized strings
  const title = getLocalizedString(news.title);
  const excerpt = getLocalizedString(news.excerpt);
  const content = getLocalizedString(news.content);
  const categoryName = getLocalizedString(news.category?.name);
  const authorName = getLocalizedString(news.author?.name);
  const dateStr = formatDate(news.publishedAt || news.createdAt);

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#FFFFFF',
          headerRight: () => (
            <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
              <Ionicons name="share-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Featured Image */}
        <Image
          source={{ uri: news.featuredImage?.url }}
          style={[styles.featuredImage, { width }]}
          contentFit="cover"
          transition={300}
        />

        <View style={styles.content}>
          {/* Category Badge */}
          {categoryName ? (
            <View
              style={[styles.categoryBadge, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.categoryText}>{categoryName}</Text>
            </View>
          ) : null}

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

          {/* Meta Info */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
              <Text style={[styles.metaText, { color: colors.textMuted }]}>
                {dateStr}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="eye-outline" size={16} color={colors.textMuted} />
              <Text style={[styles.metaText, { color: colors.textMuted }]}>
                {formatViews(news.viewCount)}
              </Text>
            </View>
          </View>

          {/* Author */}
          {authorName ? (
            <View style={[styles.authorSection, { borderColor: colors.border }]}>
              <Ionicons name="person-circle-outline" size={32} color={colors.textSecondary} />
              <View>
                <Text style={[styles.authorName, { color: colors.text }]}>
                  {authorName}
                </Text>
                <Text style={[styles.authorRole, { color: colors.textSecondary }]}>
                  लेखक
                </Text>
              </View>
            </View>
          ) : null}

          {/* Excerpt */}
          {excerpt ? (
            <Text style={[styles.excerpt, { color: colors.textSecondary }]}>
              {excerpt}
            </Text>
          ) : null}

          {/* Content */}
          <Text style={[styles.contentText, { color: colors.text }]}>
            {content}
          </Text>

          {/* Tags */}
          {news.tags && news.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {news.tags.map((tag, index) => {
                const tagStr = getLocalizedString(tag);
                return (
                  <View
                    key={index}
                    style={[styles.tag, { backgroundColor: colors.surface }]}
                  >
                    <Text style={[styles.tagText, { color: colors.textSecondary }]}>
                      #{tagStr}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          {/* Related News */}
          {relatedNews.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={[styles.relatedTitle, { color: colors.text }]}>
                सम्बन्धित समाचार
              </Text>
              {relatedNews.map((item) => (
                <NewsCard key={item._id} news={item} variant="horizontal" />
              ))}
            </View>
          )}

          {/* Bottom spacing */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: FontSizes.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  retryButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerButton: {
    padding: Spacing.sm,
  },
  featuredImage: {
    height: 250,
  },
  content: {
    padding: Spacing.md,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    lineHeight: 36,
    marginBottom: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaText: {
    fontSize: FontSizes.sm,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: Spacing.lg,
  },
  authorName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  authorRole: {
    fontSize: FontSizes.xs,
  },
  excerpt: {
    fontSize: FontSizes.lg,
    fontStyle: 'italic',
    lineHeight: 28,
    marginBottom: Spacing.lg,
  },
  contentText: {
    fontSize: FontSizes.md,
    lineHeight: 28,
    marginBottom: Spacing.lg,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  tag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  tagText: {
    fontSize: FontSizes.sm,
  },
  relatedSection: {
    marginTop: Spacing.lg,
  },
  relatedTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  bottomSpacing: {
    height: Spacing.xl,
  },
});
