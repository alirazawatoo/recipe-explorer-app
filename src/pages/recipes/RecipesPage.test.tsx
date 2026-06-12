import { describe, expect, test } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { renderRoute } from '@/test/renderRoute';
import { API, server } from '@/test/server';

describe('RecipesPage', () => {
  test('lists the first page with links to each recipe', async () => {
    renderRoute('/recipes');

    const link = await screen.findByRole('link', { name: /Charred Corn Salad/ });
    expect(link.getAttribute('href')).toBe('/recipes/1');
    expect(screen.getAllByRole('listitem')).toHaveLength(10);
    expect(screen.getByText('1 / 2')).toBeTruthy();
  });

  test('the next button loads the second page', async () => {
    const user = userEvent.setup();
    renderRoute('/recipes');
    await screen.findByRole('link', { name: /Charred Corn Salad/ });

    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(await screen.findByRole('link', { name: /Herbed Flatbreads/ })).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  test('a filter with no match on this page shows the empty state', async () => {
    const user = userEvent.setup();
    renderRoute('/recipes');
    await screen.findByRole('link', { name: /Charred Corn Salad/ });

    await user.type(screen.getByRole('searchbox'), 'pancake');

    expect(await screen.findByText('No results')).toBeTruthy();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  test('retry recovers from a failed load', async () => {
    const user = userEvent.setup();
    server.use(http.get(`${API}/recipes`, () => new HttpResponse(null, { status: 500 }), { once: true }));
    renderRoute('/recipes');

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toMatch('status code 500');

    await user.click(screen.getByRole('button', { name: 'Retry' }));
    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(10));
  });
});
