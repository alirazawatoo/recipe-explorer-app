import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import debounce from 'lodash/debounce';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { StatusBlock } from '@/shared/ui/StatusBlock/StatusBlock';
import { loadRecipes, recipesActions, selectVisibleRecipes } from './recipesSlice';

import styles from './RecipesPage.module.scss';

export function RecipesPage() {
  const dispatch = useAppDispatch();
  const { status, error, page, pageSize, total, query } = useAppSelector((s) => s.recipes);
  const items = useAppSelector(selectVisibleRecipes);

  useEffect(() => {
    const request = dispatch(loadRecipes());
    return () => request.abort();
  }, [dispatch, page, pageSize]);

  const debouncedSetQuery = useMemo(
    () => debounce((value: string) => dispatch(recipesActions.setQuery(value)), 300),
    [dispatch],
  );

  useEffect(() => () => debouncedSetQuery.cancel(), [debouncedSetQuery]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));


  return (
    <div className={styles.root}>
      <h1>Recipes to explore</h1>
      <p className={styles.intro}>Browse sample recipes, filter the current page and open an ingredient list.</p>
      <div className={styles.toolbar}>
        <input
          className={styles.search}
          defaultValue={query}
          aria-label="Filter this page"
          placeholder="Filter this page by name…"
          onChange={(e) => {
            debouncedSetQuery(e.target.value);
          }}
        />

        <button className={styles.sortBtn} type="button" disabled title="Sorting is not implemented">Sorting unavailable</button>
      </div>

      {status === 'loading' && (
        <StatusBlock variant="loading" title="Loading" description="Fetching recipes…" />
      )}

      {status === 'failed' && (
        <StatusBlock
          variant="error"
          title="Error"
          description={error ?? 'Something went wrong'}
          action={
            <button type="button" onClick={() => dispatch(loadRecipes())}>
              Retry
            </button>
          }
        />
      )}

      {status === 'succeeded' && items.length === 0 && (
        <StatusBlock variant="empty" title="No results" description="No recipes on this page match the filter. Clear it or browse another page." />
      )}

      {status === 'succeeded' && items.length > 0 && (
        <>
          <ul className={styles.grid}>
            {items.map((r) => (
              <li key={r.id} className={clsx(styles.card)}>
                <Link to={`/recipes/${r.id}`} className={styles.cardLink}>
                  <img className={styles.image} src={r.image} alt="" onError={(event) => { if (!event.currentTarget.src.endsWith("/recipe-placeholder.svg")) event.currentTarget.src = "/recipe-placeholder.svg"; }} loading="lazy" />
                  <div className={styles.name}>{r.name}</div>
                </Link>
              </li>
            ))}
          </ul>

        </>
      )}
      {status === 'succeeded' && (
          <div className={styles.pager}>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => dispatch(recipesActions.setPage(page - 1))}
            >
              Prev
            </button>
            <span className={styles.pageInfo}>
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => dispatch(recipesActions.setPage(page + 1))}
            >
              Next
            </button>
          </div>
      )}
    </div>
  );
}
