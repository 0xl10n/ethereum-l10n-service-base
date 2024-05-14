import _ from 'lodash';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { generate } from './google-ai';
import { easContent, easTxt, easDoc } from './site.fixture';
import { createPrompt } from '../app/prompt';

describe('google', () => {
  test('#generate, easDoc', async () => {
    const body = easDoc;

    const text = easTxt;

    const prompt = createPrompt(body, text, 10000);

    const content = await generate(prompt);

    const results = content.replace('```json', '').replace('```', '');
    console.log(content);

    // expect(_.keys(JSON.parse(content)['en']).length > 0).toEqual(true);
  });
});
