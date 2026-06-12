import React from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router';
import { RecipesPage } from './pages/recipes/RecipesPage';
import { RecipeDetailsPage } from './pages/recipe-details/RecipeDetailsPage';
import styles from './App.module.scss';

export function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <Link to="/recipes" className={styles.brand}>
              Recipes <span className={styles.brandMark}>Explorer</span>
            </Link>
            <span className={styles.tagline}>Weeknight ideas, one page at a time</span>
          </div>
        </header>

        <main className={styles.main}>
          <Routes>
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
            <Route path="*" element={<Navigate to="/recipes" replace />} />
          </Routes>
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            Recipe data comes from the public{' '}
            <a href="https://dummyjson.com/docs/recipes">DummyJSON sample API</a>.
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
