import { describe, expect, test } from 'vitest';
import { recipeFacts, totalMinutes } from './recipeFacts';

const base = { id: 1, name: 'Test', image: '' };

describe('recipe facts', () => {
  test('adds prep and cook time', () => {
    expect(totalMinutes({ ...base, prepTimeMinutes: 10, cookTimeMinutes: 25 })).toBe(35);
    expect(totalMinutes({ ...base, cookTimeMinutes: 0 })).toBe(0);
    expect(totalMinutes(base)).toBeNull();
  });

  test('lists only the facts that are present', () => {
    expect(recipeFacts({ ...base, cuisine: 'Thai', prepTimeMinutes: 5, servings: 2 })).toEqual(['Thai', '5 min', 'Serves 2']);
    expect(recipeFacts(base)).toEqual([]);
  });
});
