import type { Recipe } from '@/shared/api/recipesApi';

export function totalMinutes(recipe: Recipe): number | null {
  const { prepTimeMinutes: prep, cookTimeMinutes: cook } = recipe;
  if (prep == null && cook == null) return null;
  return (prep ?? 0) + (cook ?? 0);
}

/** Short facts for a recipe card, skipping any the API did not send. */
export function recipeFacts(recipe: Recipe): string[] {
  const minutes = totalMinutes(recipe);
  return [
    recipe.cuisine,
    minutes != null ? `${minutes} min` : undefined,
    recipe.servings != null ? `Serves ${recipe.servings}` : undefined,
  ].filter((fact): fact is string => Boolean(fact));
}
