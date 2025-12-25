// Helper utilities for the mobile app

/**
 * Extracts a string value from a multi-language object or returns the value if already a string
 * Handles API responses that return objects like { np: "नेपाली", en: "English" }
 */
export function getLocalizedString(value: string | { np?: string; en?: string } | undefined | null): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    // Prefer Nepali, fallback to English
    return value.np || value.en || '';
  }
  return String(value);
}

/**
 * Format date to Nepali locale string
 */
export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ne-NP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format view count with Nepali text
 */
export function formatViews(count: number | undefined): string {
  if (!count) return '0 पटक';
  return `${count} पटक`;
}
