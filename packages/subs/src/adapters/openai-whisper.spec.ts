import tmp from 'tmp';
import { beforeEach, describe, expect, test } from 'vitest';
import { generateTranscript } from './openai-whisper.ts';
import { createAudioStreamWithYtVideo } from './youtube.ts';
import { createAudioFileName, getFile } from '../domain/key.ts';
import path from 'path';
import os from 'os';
import { createReadStream, createWriteStream } from 'fs';

describe('whisper', () => {
  test('#generateTranscript', { timeout: 1000 * 60 * 5 }, async () => {
    const options = {
      apiKey: process.env.OPENAI_API_KEY!,
    };
    const videoId = 'I9XLN52xWMk';
    const fileName = createAudioFileName('youtube', videoId);
    const filePath = getFile(fileName);
    console.log('filePath', filePath);

    const stream = createReadStream(filePath);

    const results = await generateTranscript(stream, options);

    console.log(results);
    //expect(results)
  });
});
