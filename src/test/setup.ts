import { afterAll, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { http as client } from '@/shared/api/http';
import { server } from './server';

// jsdom ships its own XMLHttpRequest, which MSW's Node interceptors cannot see,
// so tests send axios requests through its Node adapter instead.
client.defaults.adapter = 'http';

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());
