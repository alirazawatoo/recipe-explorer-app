import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { makePage, makeRecipe, TOTAL_RECIPES } from './fixtures';

export const API = 'https://dummyjson.com';

export const handlers = [
  http.get(`${API}/recipes`, ({ request }) => {
    const url = new URL(request.url);
    return HttpResponse.json(makePage(Number(url.searchParams.get('limit')), Number(url.searchParams.get('skip'))));
  }),
  http.get(`${API}/recipes/:id`, ({ params }) => {
    const id = Number(params.id);
    if (id > TOTAL_RECIPES) return HttpResponse.json({ message: `Recipe with id '${id}' not found` }, { status: 404 });
    return HttpResponse.json(makeRecipe(id));
  }),
];

export const server = setupServer(...handlers);
