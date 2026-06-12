import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { RecipesPage } from './pages/recipes/RecipesPage';
import { RecipeDetailsPage } from './pages/recipe-details/RecipeDetailsPage';
import styles from './App.module.scss';

export function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <header className={styles.header}>
          <div className={styles.brand}>Recipes Explorer</div>
        </header>

        <main className={styles.main}>
          <Routes>
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
            <Route path="*" element={<Navigate to="/recipes" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
