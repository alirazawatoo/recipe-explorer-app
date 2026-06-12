import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { makeStore } from '@/app/store';
import { RecipesPage } from '@/pages/recipes/RecipesPage';
import { RecipeDetailsPage } from '@/pages/recipe-details/RecipeDetailsPage';

export function renderRoute(path: string) {
  const store = makeStore();
  const view = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
  return { store, ...view };
}
