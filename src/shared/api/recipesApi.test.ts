import { describe, expect, test } from 'vitest';
import { http, HttpResponse } from 'msw';
import { getRecipeById, getRecipes } from './recipesApi';
import { API, server } from '@/test/server';

describe('recipes API', () => {
  test('getRecipes sends limit and skip and returns the page body', async () => {
    let seen: URLSearchParams | undefined;
    server.use(
      http.get(`${API}/recipes`, ({ request }) => {
        seen = new URL(request.url).searchParams;
        return HttpResponse.json({ recipes: [], total: 0, skip: 20, limit: 10 });
      }),
    );

    const page = await getRecipes({ limit: 10, skip: 20 });

    expect(seen?.get('limit')).toBe('10');
    expect(seen?.get('skip')).toBe('20');
    expect(page).toEqual({ recipes: [], total: 0, skip: 20, limit: 10 });
  });

  test('getRecipeById requests the recipe by id', async () => {
    const recipe = await getRecipeById(3);
    expect(recipe).toMatchObject({ id: 3, name: 'Lemon Herb Orzo' });
  });

  test('a non-2xx response rejects with the status in the message', async () => {
    await expect(getRecipeById(999)).rejects.toThrow('status code 404');
  });

  test('an aborted signal cancels the request', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(getRecipes({ limit: 10, skip: 0 }, controller.signal)).rejects.toMatchObject({ name: 'CanceledError' });
  });
});
