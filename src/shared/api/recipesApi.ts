import { http } from './http';

export type Recipe = {
  id: number;
  name: string;
  image: string;
  ingredients?: string[];
  instructions?: string[];
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  servings?: number;
};

export type RecipesListResponse = {
  recipes: Recipe[];
  total: number;
  skip: number;
  limit: number;
};

export async function getRecipes(params: { limit: number; skip: number }, signal?: AbortSignal) {
  const res = await http.get<RecipesListResponse>('/recipes', { params, signal });
  return res.data;
}

export async function getRecipeById(id: number, signal?: AbortSignal) {
  const res = await http.get<Recipe>(`/recipes/${id}`, { signal });
  return res.data;
}
