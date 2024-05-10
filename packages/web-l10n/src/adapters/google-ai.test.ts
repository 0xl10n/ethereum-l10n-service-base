import _ from 'lodash';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { generate } from './google-ai';
import { easContent } from './site.fixture';
import { createPrompt } from '../app/prompt';

describe('google', () => {
  test.only('#generate', async () => {
    const body = easContent;

    const prompt = createPrompt(body, 10000);

    const content = await generate(prompt);

    expect(_.keys(JSON.parse(content)['en']) as any).toEqual(123);
  });
});
