import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { generate } from './openai';
import { easContent } from './site.fixture';

describe('openai', () => {
  test('#generate', async () => {
    const body = easContent;

    const content = await generate(body);

    expect(content).toEqual(123);
  });
});
