import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { newsAPI } from '../services/api';
import { Colors, Spacing, FontSizes } from '../constants/Colors';
import { getLocalizedString } from '../utils/helpers';
import type { News, APIResponse } from '../types';

export default function BreakingNewsTicker() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;

  const { data, isLoading } = useQuery<{ data: APIResponse<News[]> }>({
    queryKey: ['breaking-news'],
    queryFn: () => newsAPI.getBreaking(5),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const breakingNews = data?.data?.data || [];

  useEffect(() => {
    if (breakingNews.length === 0) return;

    const totalWidth = breakingNews.length * 300;
    
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scrollX, {
          toValue: -totalWidth,
          duration: breakingNews.length * 8000,
          useNativeDriver: true,
        }),
        Animated.timing(scrollX, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [breakingNews.length, scrollX]);

  if (isLoading || breakingNews.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <View style={styles.labelContainer}>
        <Ionicons name="flash" size={16} color="#FFFFFF" />
        <Text style={styles.label}>ताजा</Text>
      </View>
      <View style={styles.tickerContainer}>
        <Animated.View
          style={[
            styles.tickerContent,
            { transform: [{ translateX: scrollX }] },
          ]}
        >
          {[...breakingNews, ...breakingNews].map((news, index) => {
            const title = getLocalizedString(news.title);
            return (
              <TouchableOpacity
                key={`${news._id}-${index}`}
                onPress={() => router.push(`/news/${news.slug}`)}
                style={styles.tickerItem}
              >
                <Text style={styles.tickerText} numberOfLines={1}>
                  {title}
                </Text>
                <Text style={styles.separator}>•</Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    overflow: 'hidden',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.2)',
    height: '100%',
    gap: 4,
  },
  label: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: FontSizes.sm,
  },
  tickerContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  tickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  tickerText: {
    color: '#FFFFFF',
    fontSize: FontSizes.sm,
    maxWidth: 280,
  },
  separator: {
    color: 'rgba(255,255,255,0.7)',
    marginLeft: Spacing.sm,
    fontSize: FontSizes.sm,
  },
});
