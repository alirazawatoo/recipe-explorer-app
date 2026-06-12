import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import debounce from 'lodash/debounce';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { recipeFacts } from '@/shared/lib/recipeFacts';
import { RecipeImage } from '@/shared/ui/RecipeImage/RecipeImage';
import { StatusBlock } from '@/shared/ui/StatusBlock/StatusBlock';
import { loadRecipes, recipesActions, selectVisibleRecipes } from './recipesSlice';

import styles from './RecipesPage.module.scss';

export function RecipesPage() {
  const dispatch = useAppDispatch();
  const { status, error, page, pageSize, total, query } = useAppSelector((s) => s.recipes);
  const items = useAppSelector(selectVisibleRecipes);
  // Bumping this re-runs the effect, so a retry is aborted on unmount like the first load.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const request = dispatch(loadRecipes());
    return () => request.abort();
  }, [dispatch, page, pageSize, attempt]);

  const debouncedSetQuery = useMemo(
    () => debounce((value: string) => dispatch(recipesActions.setQuery(value)), 300),
    [dispatch],
  );

  useEffect(() => () => debouncedSetQuery.cancel(), [debouncedSetQuery]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className={styles.root}>
      <div className={styles.intro}>
        <h1 className={styles.title}>Find something to cook</h1>
        <p className={styles.lede}>
          Browse the catalogue ten recipes at a time. The filter narrows the page you are on; open a card for its
          ingredients and method.
        </p>
      </div>

      <div className={styles.toolbar}>
        <label htmlFor="recipe-filter" className={styles.filterLabel}>
          Filter this page
        </label>
        <input
          id="recipe-filter"
          type="search"
          className={styles.search}
          defaultValue={query}
          placeholder="Try soup, salad, noodles…"
          onChange={(e) => {
            debouncedSetQuery(e.target.value);
          }}
        />
      </div>

      {status === 'loading' && (
        <>
          <StatusBlock variant="loading" title="Loading recipes" description="Fetching this page of the catalogue…" />
          <div className={styles.grid} aria-hidden="true">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        </>
      )}

      {status === 'failed' && (
        <StatusBlock
          variant="error"
          title="Recipes could not be loaded"
          description={error ?? 'Something went wrong'}
          action={
            <button type="button" className="button" onClick={() => setAttempt((n) => n + 1)}>
              Retry
            </button>
          }
        />
      )}

      {status === 'succeeded' && items.length === 0 && (
        <StatusBlock
          variant="empty"
          title="No results"
          description="No recipes on this page match the filter. Clear it or browse another page."
        />
      )}

      {status === 'succeeded' && items.length > 0 && (
        <ul className={styles.grid}>
          {items.map((r) => (
            <li key={r.id} className={styles.card}>
              <Link to={`/recipes/${r.id}`} className={styles.cardLink}>
                <RecipeImage className={styles.image} src={r.image} alt="" loading="lazy" />
                <span className={styles.cardBody}>
                  <span className={styles.name}>{r.name}</span>
                  <span className={styles.facts}>{recipeFacts(r).join(' · ')}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {status === 'succeeded' && (
        <nav className={styles.pager} aria-label="Pages">
          <button
            type="button"
            className="button"
            disabled={page <= 1}
            onClick={() => dispatch(recipesActions.setPage(page - 1))}
          >
            <span aria-hidden="true">←</span> Previous
          </button>
          <span className={styles.pageInfo} aria-live="polite">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            className="button"
            disabled={page >= totalPages}
            onClick={() => dispatch(recipesActions.setPage(page + 1))}
          >
            Next <span aria-hidden="true">→</span>
          </button>
        </nav>
      )}
    </div>
  );
}
