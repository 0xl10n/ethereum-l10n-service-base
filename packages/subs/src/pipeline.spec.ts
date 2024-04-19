import { describe, test } from 'vitest';
import { demo } from './pipeline.ts';
import { firstValueFrom, toArray } from 'rxjs';

describe('pipelines', () => {
  test('#demo', async () => {
    // const videoId = 'HT9PHWloIiU';

    // eas
    // const videoId = 'RsIBqExwsT8';

    //pragma denver
    const videoId = 'I9XLN52xWMk';
    const results = await firstValueFrom(
      demo(videoId, {
        apiKey: process.env.OPENAI_API_KEY!,
      }).pipe(toArray()),
    );

    console.log(results);
  });
});
