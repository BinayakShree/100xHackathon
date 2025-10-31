// Category management
// NOTE: Categories need to be seeded in the database
// For now, using this as a fallback until backend categories are properly set up

export interface Category {
  id: string
  name: string
}

// Common categories for the platform
export const COMMON_CATEGORIES: Category[] = [
  { id: 'cat_arts_crafts', name: 'Arts & Crafts' },
  { id: 'cat_cooking', name: 'Cooking' },
  { id: 'cat_dance', name: 'Dance' },
  { id: 'cat_tours', name: 'Tours' },
  { id: 'cat_music', name: 'Music' },
  { id: 'cat_language', name: 'Language' },
  { id: 'cat_culture', name: 'Culture & Heritage' },
  { id: 'cat_adventure', name: 'Adventure' },
]

// Map category names to IDs (fallback)
export const CATEGORY_NAME_TO_ID: Record<string, string> = {
  'Arts & Crafts': 'cat_arts_crafts',
  'Cooking': 'cat_cooking',
  'Dance': 'cat_dance',
  'Tours': 'cat_tours',
  'Music': 'cat_music',
  'Other': 'cat_other',
}

// Get category ID by name (fallback)
export function getCategoryIdByName(name: string): string {
  return CATEGORY_NAME_TO_ID[name] || 'cat_other'
}

// Get category name by ID
export function getCategoryNameById(id: string): string {
  return COMMON_CATEGORIES.find(cat => cat.id === id)?.name || 'Unknown'
}
