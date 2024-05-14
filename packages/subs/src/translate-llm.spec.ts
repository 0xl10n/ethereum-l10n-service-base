import { beforeEach, describe, test } from 'vitest';
import { translate } from './translate-llm';
import { VTT_WHISPER_EN } from './subs.fixture';

describe('#translate', () => {
  test('vtt prmopt', async () => {
    const fixture = VTT_WHISPER_EN;
    const results = await translate(fixture);

    console.log('translate', results);
  });
});
