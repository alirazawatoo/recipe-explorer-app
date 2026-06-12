import { configureStore } from '@reduxjs/toolkit';
import { recipesReducer } from '@/pages/recipes/recipesSlice';
import { recipeDetailsReducer } from '@/pages/recipe-details/recipeDetailsSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      recipes: recipesReducer,
      recipeDetails: recipeDetailsReducer,
    },
  });

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
