import tmp from 'tmp';
import os from 'os';
import got from 'got';
import path from 'path';
import { Locale } from './locale.ts';

// deterministic naming convention such that systems can work tgt
export const createAudioKey = () => {};

export const createTranslationStringKey = (
  fromLocale: string,
  toLocale: string,
) => {
  return [fromLocale, toLocale].join('-');
};

export const createTranscriptFileName = (
  prefix: string,
  videoId: string,
  toLocale: Locale,
) => {
  return [createAudioFileName(prefix, videoId), toLocale].join('-') + '.vtt';
};

export const createAudioFileName = (prefix: string, videoId: string) => {
  return [prefix, videoId].join('-') + '.mp3';
};

// TODO consider using tmp package for folder but we need deterministic for filename
export const getFile = (fileName: string) => {
  return path.join(os.tmpdir(), fileName);
};

export const createTranslationWithLocalePairs = (
  videoId: string,
  fromLocale: string,
  toLocale: string,
  by: string,
) => {
  return [videoId, createTranslationStringKey(fromLocale, toLocale), by].join(
    '-',
  );
};
