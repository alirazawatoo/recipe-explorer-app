import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Dialog from 'rc-dialog';
import 'rc-dialog/assets/index.css';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { StatusBlock } from '@/shared/ui/StatusBlock/StatusBlock';
import { loadRecipeDetails, recipeDetailsActions } from './recipeDetailsSlice';

import styles from './RecipeDetailsPage.module.scss';

export function RecipeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const recipeId = Number(id);

  const dispatch = useAppDispatch();
  const { item, status, error } = useAppSelector((s) => s.recipeDetails);

  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (!Number.isSafeInteger(recipeId) || recipeId < 1) return;
    const request = dispatch(loadRecipeDetails(recipeId));
    if (!Number.isSafeInteger(recipeId) || recipeId < 1) return <StatusBlock variant="error" title="Invalid recipe link" description="Choose a recipe from the list." action={<Link to="/recipes">Back to recipes</Link>} />;
  return () => {
      request.abort();
      dispatch(recipeDetailsActions.clear());
    };
  }, [dispatch, recipeId]);

  const title = item?.name ?? `Recipe #${recipeId}`;

  return (
    <div className={styles.root}>
      <div className={styles.topbar}>
        <Link to="/recipes">← Back</Link>
        <button type="button" disabled={!item} onClick={() => setShowDialog(true)}>
          Recipe overview
        </button>
      </div>

      {status === 'loading' && (
        <StatusBlock variant="loading" title="Loading" description="Fetching recipe…" />
      )}

      {status === 'failed' && (
        <StatusBlock
          variant="error"
          title="Error"
          description={error ?? 'Something went wrong'}
          action={
            <button type="button" onClick={() => dispatch(loadRecipeDetails(recipeId))}>
              Retry
            </button>
          }
        />
      )}

      {status === 'succeeded' && item && (
        <div className={styles.content}>
          <h1 className={styles.h1}>{title}</h1>
          {item.image && <img className={styles.hero} src={item.image} alt={title} />}
          <section><h2>Ingredients</h2><ul>{item.ingredients?.map((value, index) => <li key={index}>{value}</li>)}</ul></section>
          <section><h2>Instructions</h2><ol>{item.instructions?.map((value, index) => <li key={index}>{value}</li>)}</ol></section>
        </div>
      )}

      <Dialog visible={showDialog} title={title} onClose={() => setShowDialog(false)} footer={null}>
        <div className={styles.dialogBody}>
          <div className={styles.dialogHint}>
            A quick view of the selected recipe.
          </div>
          {status === 'succeeded' && item ? (
            <div className={styles.dialogGrid}>
              {item.image && <img className={styles.dialogImage} src={item.image} alt={title} />}
              <div>
                <div>
                  <b>ID:</b> {item.id}
                </div>
                <div>
                  <b>Name:</b> {item.name}
                </div>
                <div className={styles.todo}>
                  Ingredients and instructions are shown on the recipe page.
                </div>
              </div>
            </div>
          ) : (
            <div>Loading…</div>
          )}
        </div>
      </Dialog>
    </div>
  );
}
