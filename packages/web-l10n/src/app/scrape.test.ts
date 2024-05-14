import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { scrape } from './scape';
import fs from 'fs';

describe('scrape', () => {
  test('#scrape body', async () => {
    const url = 'https://docs.attest.org/docs/welcome';
    const { texts, html } = await scrape(url);

    fs.writeFileSync('scrape.html', html || '');
    console.log('texts', texts);

    fs.writeFileSync('scrape.txt', texts.join('<EOE>') || '');
    expect(!!html?.match(/div/)).toEqual(true);
  });
});
