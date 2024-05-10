import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { scrape } from './scape';

describe('scrape', () => {
  test('#attest translations', async () => {
    const body = await scrape();

    expect(body).toEqual(123);
  });
});
