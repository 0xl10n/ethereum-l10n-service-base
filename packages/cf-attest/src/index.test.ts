import { test, describe, beforeAll, afterAll, it, expect } from 'vitest';

import { unstable_dev } from 'wrangler';
import type { UnstableDevWorker } from 'wrangler';

describe('Worker', () => {
  let worker: UnstableDevWorker;

  const TEST_TOKEN =
    'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImE2eTcwSU1tM3dxTlFpdkt0QXBDLW92cDFfd0gtaGZhMXB6UjAzZ0o1bG8ifQ.eyJzaWQiOiJjbHZ0dm95YzgwNXYzMTI5dXlsNW5oN3VjIiwiaXNzIjoicHJpdnkuaW8iLCJpYXQiOjE3MTUxNjA0MDAsImF1ZCI6ImNsdjhnYXpxMjA0ZXhpMW84cnlqaGUzeHciLCJzdWIiOiJkaWQ6cHJpdnk6Y2x2dHZveWQ4MDV2NTEyOXV6ZjY0bmxzbCIsImV4cCI6MTcxNTE2NDAwMH0.ZRx5zQZoHnUYPM4hoAnIeCrqNKZdgk2g_NvW1MwEMdiUSZNCuNSoOuPj7ekxY0gUpI_fzvwQ8FsowMUk3Mt-lw';

  beforeAll(async () => {
    worker = await unstable_dev('src/index.ts', {
      experimental: { disableExperimentalWarning: true },
    });
  });

  afterAll(async () => {
    await worker.stop();
  });

  test('should return Hello World', async () => {
    const resp = await worker.fetch('http://example.com/404', {
      headers: {
        Authorization: 'Bearer ' + TEST_TOKEN,
      },
    });
    const text = await resp.text();
    expect(text).toMatchInlineSnapshot(`"Hello"`);
  });

  test('authorize legit token', async () => {
    const resp = await worker.fetch('http://example.com/404', {
      headers: {
        Authorization: 'Bearer ' + TEST_TOKEN,
      },
    });
    const results = await resp.json();
    expect(results).toMatchInlineSnapshot(`"Hello"`);
    // expect(results?.iss).toEqual('privy.io');
  });
  test('authorize wrong token', async () => {
    // Create an empty context to pass to `worker.fetch()`
    const resp = await worker.fetch('http://example.com/404', {
      headers: {
        Authorization: 'Bearer abc',
      },
    });
    expect(resp.status).toEqual(401);
  });
});
