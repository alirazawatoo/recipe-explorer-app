import { beforeEach, expect, test, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { getRecipes, getRecipeById } from '@/shared/api/recipesApi';
import { recipesReducer, recipesActions, loadRecipes, selectVisibleRecipes } from '@/pages/recipes/recipesSlice';
import { recipeDetailsReducer, recipeDetailsActions, loadRecipeDetails } from '@/pages/recipe-details/recipeDetailsSlice';

vi.mock('@/shared/api/recipesApi', () => ({ getRecipes: vi.fn(), getRecipeById: vi.fn() }));
const list = vi.mocked(getRecipes);
const details = vi.mocked(getRecipeById);
const fixture = (name: string) => ({recipes:[{id:1,name,image:''}],total:1,limit:10,skip:0});
function store() { return configureStore({reducer:{recipes:recipesReducer,recipeDetails:recipeDetailsReducer}}); }
beforeEach(() => { list.mockReset(); details.mockReset(); });

test('late old list response cannot replace the newer page', async () => {
  let resolveOld!: (value: any) => void;
  list.mockImplementationOnce(() => new Promise(resolve => { resolveOld = resolve; }));
  list.mockResolvedValueOnce(fixture('New page'));
  const state = store();
  const old = state.dispatch(loadRecipes());
  state.dispatch(recipesActions.setPage(2));
  await state.dispatch(loadRecipes());
  resolveOld(fixture('Old page')); await old;
  expect(state.getState().recipes.items[0].name).toBe('New page');
  expect(state.getState().recipes.page).toBe(2);
});

test('late old failure cannot turn a newer successful result into an error', async () => {
  let rejectOld!: (error: Error) => void;
  list.mockImplementationOnce(() => new Promise((_resolve,reject) => { rejectOld = reject; }));
  list.mockResolvedValueOnce(fixture('New page'));
  const state = store();const old = state.dispatch(loadRecipes());
  await state.dispatch(loadRecipes());rejectOld(new Error('old request failed'));await old;
  expect(state.getState().recipes.status).toBe('succeeded');
  expect(state.getState().recipes.error).toBeNull();
});

test('abort propagates to the API and is not displayed as a user-facing error', async () => {
  list.mockImplementationOnce(() => new Promise(() => {}));
  const state = store();const pending = state.dispatch(loadRecipes());
  const signal = list.mock.calls[0][1];
  expect(signal?.aborted).toBe(false);
  pending.abort();await pending;
  expect(signal?.aborted).toBe(true);
  expect(state.getState().recipes.status).toBe('idle');
  expect(state.getState().recipes.error).toBeNull();
});

test('cleared detail state ignores a later response', async () => {
  let resolveOld!: (value: any) => void;
  details.mockImplementationOnce(() => new Promise(resolve => { resolveOld = resolve; }));
  const state = store();const pending = state.dispatch(loadRecipeDetails(1));
  state.dispatch(recipeDetailsActions.clear());
  resolveOld({id:1,name:'Old details',image:''});await pending;
  expect(state.getState().recipeDetails.item).toBeNull();
  expect(state.getState().recipeDetails.status).toBe('idle');
});

test('a page-local filter keeps the page and memoizes unchanged results', async () => {
  list.mockResolvedValueOnce(fixture('Synthetic Bowl'));
  const state = store();state.dispatch(recipesActions.setPage(2));await state.dispatch(loadRecipes());
  state.dispatch(recipesActions.setQuery('bowl'));
  expect(state.getState().recipes.page).toBe(2);
  const first = selectVisibleRecipes(state.getState());
  expect(first).toHaveLength(1);
  expect(selectVisibleRecipes(state.getState())).toBe(first);
});
