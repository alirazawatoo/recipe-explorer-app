import type { Recipe, RecipesListResponse } from '@/shared/api/recipesApi';

// Synthetic recipes shaped like DummyJSON's; nothing here comes from the live API.
const names = [
  'Charred Corn Salad', 'Saffron Chickpea Stew', 'Lemon Herb Orzo', 'Smoky Lentil Soup', 'Tomato Galette',
  'Ginger Sesame Noodles', 'Roast Squash Bowl', 'Fennel Citrus Slaw', 'Spiced Carrot Fritters', 'Garden Pea Risotto',
  'Miso Glazed Aubergine', 'Herbed Flatbreads',
];

export const TOTAL_RECIPES = names.length;

export function makeRecipe(id: number): Recipe {
  return {
    id,
    name: names[(id - 1) % names.length],
    image: `https://cdn.dummyjson.com/recipe-images/${id}.webp`,
    ingredients: ['2 cups cooked grain', '1 lemon, zested and juiced', '3 tbsp olive oil'],
    instructions: ['Cook the base until just tender.', 'Fold in the lemon and oil.', 'Season and serve warm.'],
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    servings: 4,
  };
}

export function makePage(limit: number, skip: number): RecipesListResponse {
  const count = Math.max(0, Math.min(limit, TOTAL_RECIPES - skip));
  return { recipes: Array.from({ length: count }, (_, i) => makeRecipe(skip + i + 1)), total: TOTAL_RECIPES, skip, limit };
}
