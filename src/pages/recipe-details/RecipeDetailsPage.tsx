import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import Dialog from 'rc-dialog';
import 'rc-dialog/assets/index.css';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { totalMinutes } from '@/shared/lib/recipeFacts';
import { RecipeImage } from '@/shared/ui/RecipeImage/RecipeImage';
import { StatusBlock } from '@/shared/ui/StatusBlock/StatusBlock';
import { loadRecipeDetails, recipeDetailsActions } from './recipeDetailsSlice';

import styles from './RecipeDetailsPage.module.scss';

export function RecipeDetailsPage() {
  const { id } = useParams();
  const recipeId = Number(id);

  const dispatch = useAppDispatch();
  const { item, status, error } = useAppSelector((s) => s.recipeDetails);

  const [showDialog, setShowDialog] = useState(false);
  // Bumping this re-runs the effect, so a retry is aborted on unmount like the first load.
  const [attempt, setAttempt] = useState(0);
  const isValidId = Number.isSafeInteger(recipeId) && recipeId >= 1;

  useEffect(() => {
    if (!isValidId) return;
    const request = dispatch(loadRecipeDetails(recipeId));
    return () => {
      request.abort();
      dispatch(recipeDetailsActions.clear());
    };
  }, [dispatch, recipeId, isValidId, attempt]);

  if (!isValidId) {
    return (
      <StatusBlock
        variant="error"
        title="Invalid recipe link"
        description="Choose a recipe from the list."
        action={<Link to="/recipes">Back to recipes</Link>}
      />
    );
  }

  const title = item?.name ?? `Recipe #${recipeId}`;
  const minutes = item ? totalMinutes(item) : null;
  const facts = item
    ? [
        ['Prep', item.prepTimeMinutes != null ? `${item.prepTimeMinutes} min` : null],
        ['Cook', item.cookTimeMinutes != null ? `${item.cookTimeMinutes} min` : null],
        ['Total', minutes != null ? `${minutes} min` : null],
        ['Serves', item.servings ?? null],
        ['Level', item.difficulty ?? null],
      ].filter(([, value]) => value != null)
    : [];

  return (
    <article className={styles.root}>
      <div className={styles.topbar}>
        <Link to="/recipes" className={styles.back}>
          <span aria-hidden="true">←</span> All recipes
        </Link>
        <button type="button" className="button" disabled={!item} onClick={() => setShowDialog(true)}>
          Recipe overview
        </button>
      </div>

      {status === 'loading' && (
        <StatusBlock variant="loading" title="Loading recipe" description="Fetching ingredients and method…" />
      )}

      {status === 'failed' && (
        <StatusBlock
          variant="error"
          title="This recipe could not be loaded"
          description={error ?? 'Something went wrong'}
          action={
            <button type="button" className="button" onClick={() => setAttempt((n) => n + 1)}>
              Retry
            </button>
          }
        />
      )}

      {status === 'succeeded' && item && (
        <>
          <header className={styles.hero}>
            <div className={styles.heroText}>
              {item.cuisine && <p className={styles.kicker}>{item.cuisine}</p>}
              <h1 className={styles.h1}>{title}</h1>
              {facts.length > 0 && (
                <dl className={styles.facts}>
                  {facts.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
            <RecipeImage className={styles.heroImage} src={item.image} alt={title} />
          </header>

          <div className={styles.body}>
            <section aria-labelledby="ingredients-heading" className={styles.ingredients}>
              <h2 id="ingredients-heading">Ingredients</h2>
              <ul>
                {item.ingredients?.map((value, index) => (
                  <li key={index}>{value}</li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="instructions-heading" className={styles.instructions}>
              <h2 id="instructions-heading">Instructions</h2>
              <ol>
                {item.instructions?.map((value, index) => (
                  <li key={index}>{value}</li>
                ))}
              </ol>
            </section>
          </div>
        </>
      )}

      <Dialog visible={showDialog} title={title} onClose={() => setShowDialog(false)} footer={null}>
        <div className={styles.dialogBody}>
          <p className={styles.dialogHint}>A quick view of the selected recipe.</p>
          {status === 'succeeded' && item ? (
            <div className={styles.dialogGrid}>
              <RecipeImage className={styles.dialogImage} src={item.image} alt="" />
              <div>
                <div>
                  <b>ID:</b> {item.id}
                </div>
                <div>
                  <b>Name:</b> {item.name}
                </div>
                <p className={styles.dialogNote}>Ingredients and instructions are shown on the recipe page.</p>
              </div>
            </div>
          ) : (
            <div>Loading…</div>
          )}
        </div>
      </Dialog>
    </article>
  );
}
