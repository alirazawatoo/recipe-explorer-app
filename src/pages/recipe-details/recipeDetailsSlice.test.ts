import { describe, expect, test } from 'vitest';
import { makeStore } from '@/app/store';
import { loadRecipeDetails } from './recipeDetailsSlice';

describe('loadRecipeDetails', () => {
  test('stores the loaded recipe', async () => {
    const store = makeStore();
    await store.dispatch(loadRecipeDetails(2));
    expect(store.getState().recipeDetails).toMatchObject({ status: 'succeeded', error: null, item: { id: 2 } });
  });

  test('a new request drops the previous recipe while it loads', async () => {
    const store = makeStore();
    await store.dispatch(loadRecipeDetails(2));
    const next = store.dispatch(loadRecipeDetails(3));

    expect(store.getState().recipeDetails).toMatchObject({ status: 'loading', item: null });
    await next;
    expect(store.getState().recipeDetails.item?.id).toBe(3);
  });

  test('a missing recipe ends in the failed state with a message', async () => {
    const store = makeStore();
    await store.dispatch(loadRecipeDetails(999));
    expect(store.getState().recipeDetails.status).toBe('failed');
    expect(store.getState().recipeDetails.error).toMatch('404');
  });
});
