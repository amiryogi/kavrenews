import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  useColorScheme,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { newsAPI } from '../services/api';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/Colors';
import { getLocalizedString } from '../utils/helpers';
import type { News, APIResponse } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_HEIGHT = 240;

export default function HeroCarousel() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const { data, isLoading } = useQuery<{ data: APIResponse<News[]> }>({
    queryKey: ['featured-news'],
    queryFn: () => newsAPI.getFeatured(5),
    staleTime: 1000 * 60 * 5,
  });

  const featuredNews = data?.data?.data || [];

  const handleScroll = (event: any) => {
    const slideWidth = SCREEN_WIDTH - Spacing.md * 2;
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / slideWidth);
    setActiveIndex(index);
  };

  const renderItem = ({ item }: { item: News }) => {
    const title = getLocalizedString(item.title);
    const categoryName = getLocalizedString(item.category?.name);
    
    return (
      <TouchableOpacity
        style={styles.slide}
        activeOpacity={0.9}
        onPress={() => router.push(`/news/${item.slug}`)}
      >
        <Image
          source={{ uri: item.featuredImage?.url }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          {categoryName ? (
            <View
              style={[styles.categoryBadge, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.categoryText}>{categoryName}</Text>
            </View>
          ) : null}
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.skeleton]}>
        <View style={styles.skeletonContent} />
      </View>
    );
  }

  if (featuredNews.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={featuredNews}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        snapToInterval={SCREEN_WIDTH - Spacing.md * 2 + Spacing.sm}
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContent}
      />
      
      {/* Pagination dots */}
      <View style={styles.pagination}>
        {featuredNews.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === activeIndex ? colors.primary : 'rgba(255,255,255,0.5)',
                width: index === activeIndex ? 20 : 8,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: CAROUSEL_HEIGHT,
    marginBottom: Spacing.md,
  },
  flatListContent: {
    paddingHorizontal: Spacing.md,
  },
  slide: {
    width: SCREEN_WIDTH - Spacing.md * 2,
    height: CAROUSEL_HEIGHT,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginRight: Spacing.sm,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    justifyContent: 'flex-end',
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
    color: '#FFFFFF',
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: Spacing.md,
    left: 0,
    right: 0,
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  skeleton: {
    backgroundColor: '#E5E7EB',
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.md,
  },
  skeletonContent: {
    flex: 1,
  },
});
