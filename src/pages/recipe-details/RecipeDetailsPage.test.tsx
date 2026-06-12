import { describe, expect, test } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { renderRoute } from '@/test/renderRoute';
import { API, server } from '@/test/server';

describe('RecipeDetailsPage', () => {
  test('shows the ingredients and numbered steps', async () => {
    renderRoute('/recipes/2');

    expect(await screen.findByRole('heading', { level: 1, name: 'Saffron Chickpea Stew' })).toBeTruthy();
    const ingredients = screen.getByRole('region', { name: 'Ingredients' });
    expect(within(ingredients).getAllByRole('listitem')).toHaveLength(3);
    const steps = screen.getByRole('region', { name: 'Instructions' });
    expect(within(steps).getByText('Fold in the lemon and oil.')).toBeTruthy();
  });

  test('a malformed id offers a way back instead of requesting it', async () => {
    let requested = false;
    server.use(http.get(`${API}/recipes/:id`, () => { requested = true; return HttpResponse.json({}); }));
    renderRoute('/recipes/abc');

    expect(screen.getByText('Invalid recipe link')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Back to recipes' }).getAttribute('href')).toBe('/recipes');
    expect(requested).toBe(false);
  });

  test('retry reloads a recipe after an error', async () => {
    const user = userEvent.setup();
    server.use(http.get(`${API}/recipes/:id`, () => new HttpResponse(null, { status: 502 }), { once: true }));
    renderRoute('/recipes/4');

    await screen.findByRole('alert');
    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Smoky Lentil Soup' })).toBeTruthy();
  });

  test('the overview dialog shows the recipe summary', async () => {
    const user = userEvent.setup();
    renderRoute('/recipes/2');
    await screen.findByRole('heading', { level: 1 });

    await user.click(screen.getByRole('button', { name: 'Recipe overview' }));

    const dialog = await screen.findByRole('dialog');
    expect(dialog.textContent).toContain('Name: Saffron Chickpea Stew');
  });
});
