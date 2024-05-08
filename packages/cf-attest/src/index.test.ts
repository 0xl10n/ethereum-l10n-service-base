import { test, describe, beforeAll, afterAll, it, expect } from 'vitest';

import { unstable_dev } from 'wrangler';
import type { UnstableDevWorker } from 'wrangler';

describe('Worker', () => {
  let worker: UnstableDevWorker;

  beforeAll(async () => {
    worker = await unstable_dev('src/index.ts', {
      experimental: { disableExperimentalWarning: true },
    });
  });

  afterAll(async () => {
    await worker.stop();
  });

  // test('should return Hello World', async () => {
  //   const resp = await worker.fetch();
  //   const text = await resp.text();
  //   expect(text).toMatchInlineSnapshot(`"Hello"`);
  // });

  test('authorize', async () => {
    // Create an empty context to pass to `worker.fetch()`
    const resp = await worker.fetch('http://example.com/404', {
      headers: {
        Authorization: 'Bearer hihi',
      },
    });
    const token = await resp.text();

    expect(token).toEqual(123);
  });
});
