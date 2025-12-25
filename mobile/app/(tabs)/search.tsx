import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import NewsCard from '@/components/NewsCard';
import { newsAPI } from '@/services/api';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/Colors';
import type { News, APIResponse } from '@/types';

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  const { data, isLoading, isFetching } = useQuery<{ data: APIResponse<News[]> }>({
    queryKey: ['search', submittedQuery],
    queryFn: () => newsAPI.search({ q: submittedQuery }),
    enabled: submittedQuery.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  const searchResults = data?.data?.data || [];

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      setSubmittedQuery(searchQuery.trim());
      Keyboard.dismiss();
    }
  }, [searchQuery]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSubmittedQuery('');
  }, []);

  const renderEmptyState = () => {
    if (submittedQuery && !isLoading && searchResults.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={64} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            कुनै समाचार फेला परेन
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            "{submittedQuery}" को लागि कुनै नतिजा फेला परेन
          </Text>
        </View>
      );
    }

    if (!submittedQuery) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="newspaper-outline" size={64} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            समाचार खोज्नुहोस्
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            शीर्षक वा विषयको आधारमा समाचार खोज्नुहोस्
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="समाचार खोज्नुहोस्..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: colors.primary }]}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>खोज</Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {isLoading || isFetching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <NewsCard news={item} variant="horizontal" />
            </View>
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          ListHeaderComponent={
            submittedQuery && searchResults.length > 0 ? (
              <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
                {searchResults.length} नतिजा फेला पर्‍यो
              </Text>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.md,
    paddingVertical: Spacing.xs,
  },
  searchButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: FontSizes.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  cardContainer: {
    marginBottom: Spacing.xs,
  },
  resultsCount: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
});
