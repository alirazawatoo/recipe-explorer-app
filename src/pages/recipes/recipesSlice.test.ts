import { describe, expect, test } from 'vitest';
import { http, HttpResponse } from 'msw';
import { makeStore } from '@/app/store';
import { loadRecipes, recipesActions, recipesReducer, selectVisibleRecipes } from './recipesSlice';
import { API, server } from '@/test/server';

const initial = recipesReducer(undefined, { type: 'init' });

describe('recipes reducers', () => {
  test('setPageSize returns to the first page', () => {
    const onPage3 = recipesReducer(initial, recipesActions.setPage(3));
    const resized = recipesReducer(onPage3, recipesActions.setPageSize(20));
    expect(resized).toMatchObject({ page: 1, pageSize: 20 });
  });

  test('setQuery keeps the current page', () => {
    const state = recipesReducer(recipesReducer(initial, recipesActions.setPage(2)), recipesActions.setQuery('soup'));
    expect(state).toMatchObject({ page: 2, query: 'soup' });
  });
});

describe('loadRecipes', () => {
  test('requests the slice of the catalogue for the current page', async () => {
    let skip: string | null = null;
    server.use(
      http.get(`${API}/recipes`, ({ request }) => {
        skip = new URL(request.url).searchParams.get('skip');
        return HttpResponse.json({ recipes: [], total: 12, skip: 10, limit: 10 });
      }),
    );
    const store = makeStore();
    store.dispatch(recipesActions.setPage(2));
    await store.dispatch(loadRecipes());

    expect(skip).toBe('10');
    expect(store.getState().recipes).toMatchObject({ status: 'succeeded', total: 12, items: [] });
  });

  test('stores the error message when the request fails', async () => {
    server.use(http.get(`${API}/recipes`, () => new HttpResponse(null, { status: 503 })));
    const store = makeStore();
    await store.dispatch(loadRecipes());

    expect(store.getState().recipes.status).toBe('failed');
    expect(store.getState().recipes.error).toMatch('503');
  });
});

describe('selectVisibleRecipes', () => {
  test('matches names case-insensitively and ignores surrounding spaces', async () => {
    const store = makeStore();
    await store.dispatch(loadRecipes());
    store.dispatch(recipesActions.setQuery('  SOUP '));

    expect(selectVisibleRecipes(store.getState()).map((r) => r.name)).toEqual(['Smoky Lentil Soup']);
  });
});
