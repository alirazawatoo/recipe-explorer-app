import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Recipe } from '@/shared/api/recipesApi';
import { getRecipeById } from '@/shared/api/recipesApi';

export type RecipeDetailsState = {
  item: Recipe | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  requestId: string | null;

  // NOTE: caching by ID / normalized entities intentionally NOT implemented (interview challenge).
};

const initialState: RecipeDetailsState = {
  item: null,
  status: 'idle',
  error: null,
  requestId: null,
};

export const loadRecipeDetails = createAsyncThunk('recipeDetails/load', async (id: number, { signal }) => {
  return await getRecipeById(id, signal);
});

const slice = createSlice({
  name: 'recipeDetails',
  initialState,
  reducers: {
    clear(state) {
      state.requestId = null;
      state.item = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(loadRecipeDetails.pending, (state, action) => {
      state.requestId = action.meta.requestId;
      state.item = null;
      state.status = 'loading';
      state.error = null;
    });
    b.addCase(loadRecipeDetails.fulfilled, (state, action) => {
      if (state.requestId !== action.meta.requestId) return;
      state.requestId = null;
      state.status = 'succeeded';
      state.item = action.payload;
    });
    b.addCase(loadRecipeDetails.rejected, (state, action) => {
      if (state.requestId !== action.meta.requestId) return;
      state.requestId = null;
      if (action.meta.aborted) { state.status = 'idle'; return; }
      state.status = 'failed';
      state.error = action.error.message ?? 'Request failed';
    });
  },
});

export const recipeDetailsReducer = slice.reducer;
export const recipeDetailsActions = slice.actions;
