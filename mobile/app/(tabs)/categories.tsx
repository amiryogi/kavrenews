import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { categoryAPI } from '@/services/api';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/Colors';
import { getLocalizedString } from '@/utils/helpers';
import type { Category, APIResponse } from '@/types';

// Category icons mapping
const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  'राजनीति': 'flag',
  'खेलकुद': 'football',
  'मनोरञ्जन': 'musical-notes',
  'अर्थ': 'cash',
  'प्रविधि': 'hardware-chip',
  'स्वास्थ्य': 'fitness',
  'शिक्षा': 'school',
  'समाज': 'people',
  default: 'newspaper',
};

export default function CategoriesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const { data, isLoading } = useQuery<{ data: APIResponse<Category[]> }>({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getAll(),
    staleTime: 1000 * 60 * 10,
  });

  const categories = data?.data?.data || [];

  const getCategoryName = (item: Category): string => {
    return getLocalizedString(item.name);
  };

  const getIconName = (categoryName: string) => {
    return categoryIcons[categoryName] || categoryIcons.default;
  };

  const renderItem = ({ item }: { item: Category }) => {
    const name = getCategoryName(item);
    const description = getLocalizedString(item.description);
    
    return (
      <TouchableOpacity
        style={[styles.categoryCard, { backgroundColor: colors.surface }]}
        onPress={() => router.push(`/category/${item.slug}`)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: item.color || colors.primary },
          ]}
        >
          <Ionicons name={getIconName(name)} size={28} color="#FFFFFF" />
        </View>
        <Text style={[styles.categoryName, { color: colors.text }]}>
          {name}
        </Text>
        {description ? (
          <Text
            style={[styles.categoryDescription, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {description}
          </Text>
        ) : null}
        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
  listContent: {
    padding: Spacing.md,
  },
  row: {
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  categoryName: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  categoryDescription: {
    fontSize: FontSizes.xs,
    lineHeight: 16,
  },
  arrowContainer: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
  },
});
