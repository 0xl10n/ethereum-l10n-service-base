// for partial extract no support by native ASR
// --download-sections "*10:15-inf"';
import { format } from 'path';
import { Client, MusicClient, Video } from 'youtubei';
import { createReadStream, createWriteStream } from 'fs';
import stream from 'stream';
import { promisify } from 'util';
import { concat, firstValueFrom, from, map, mergeMap, of, tap } from 'rxjs';
import fs from 'fs';
import path from 'path';
import { createAudioStreamWithYtVideo } from './adapters/youtube.ts';
import { PipelineOptions } from './domain/pipeline-options.ts';
import { generateTranscript } from './adapters/openai-whisper.ts';

import {
  createAudioFileName,
  createTranscriptFileName,
  createTranslationWithLocalePairs,
  getFile,
} from './domain/key.ts';
import { Transcription } from 'openai/resources/audio/transcriptions.mjs';
import { Locale } from './domain/locale.ts';
import { translate } from './translate-llm.js';
const pipeline = promisify(stream.pipeline);

/**
 * As individual proces could take a long time (e.g. extract)
 * Make sure we cache result of each step (using filesystem)
 * and skip accordingly
 */
export const generateTranscriptWithYtVideo = (
  videoId: string,
  options: PipelineOptions,
) => {
  const prefix = 'youtube';
  const fileName = getFile(createAudioFileName(prefix, videoId));

  return of(fs.existsSync(fileName)).pipe(
    map((isExists) => {
      if (isExists) {
        return createReadStream(fileName);
      }
      return createAudioStreamWithYtVideo(videoId);
    }),

    mergeMap((stream) => generateTranscript(stream, options)),
    mergeMap(async (transcript) => {
      const transcriptZhTW = await translate(transcript as any as string);
      console.log('transcriptZhTW', transcriptZhTW);
      persistTranscript(
        prefix,
        videoId,
        'els-whisper',
        'zh_TW',
        transcriptZhTW,
      );
      persistTranscript(prefix, videoId, 'els-whisper', 'en', transcript);
    }),
  );
};

export const demo = (videoId: string, options: PipelineOptions) => {
  return generateTranscriptWithYtVideo(videoId, options);
};

export const processTranslation = () => {
  // loadTranscript()=>{
  // }
};

export const persistTranscript = (
  prefix: string,
  videoId: string,
  by: string,
  toLocale: string,
  transcript: Transcription,
) => {
  const key = createTranslationWithLocalePairs(videoId, 'en', toLocale, by);
  console.log('persisting transcript to', key, transcript);

  const fileName = createTranscriptFileName(
    'youtube',
    videoId,
    toLocale as Locale,
  );
  const filePath = getFile(fileName);
  fs.writeFileSync(filePath, transcript as unknown as string);
  return key;
};
