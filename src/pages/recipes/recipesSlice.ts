import { createAsyncThunk, createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { getRecipes, type Recipe } from '@/shared/api/recipesApi';
import type { RootState } from '@/app/store';

export type RecipesState = {
  items: Recipe[];
  total: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  /** Only the latest load may write results; older responses are ignored. */
  requestId: string | null;
  /** Filters the loaded page only; it never triggers a request. */
  query: string;
  page: number;
  pageSize: number;
};

const initialState: RecipesState = {
  items: [],
  total: 0,
  status: 'idle',
  error: null,
  requestId: null,
  query: '',
  page: 1,
  pageSize: 10,
};

export const loadRecipes = createAsyncThunk(
  'recipes/load',
  async (_, { getState, signal }) => {
    const { page, pageSize } = (getState() as RootState).recipes;
    return getRecipes({ limit: pageSize, skip: (page - 1) * pageSize }, signal);
  }
);

const slice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      state.page = 1;
    },
  },
  extraReducers: (b) => {
    b.addCase(loadRecipes.pending, (state, action) => {
      state.requestId = action.meta.requestId;
      state.status = 'loading';
      state.error = null;
    });
    b.addCase(loadRecipes.fulfilled, (state, action) => {
      if (state.requestId !== action.meta.requestId) return;
      state.requestId = null;
      state.status = 'succeeded';
      state.items = action.payload.recipes;
      state.total = action.payload.total;
    });
    b.addCase(loadRecipes.rejected, (state, action) => {
      if (state.requestId !== action.meta.requestId) return;
      state.requestId = null;
      if (action.meta.aborted) { state.status = 'idle'; return; }
      state.status = 'failed';
      state.error = action.error.message ?? 'Request failed';
    });
  },
});

export const recipesReducer = slice.reducer;
export const recipesActions = slice.actions;

export const selectVisibleRecipes = createSelector(
  [(state: RootState) => state.recipes.items, (state: RootState) => state.recipes.query],
  (items, query) => {
    const value = query.trim().toLowerCase();
    return value ? items.filter(recipe => recipe.name.toLowerCase().includes(value)) : items;
  },
);
