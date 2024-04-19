const youtubedl = require('youtube-dl-exec');
import { createReadStream, createWriteStream } from 'fs';
import stream from 'stream';
import { promisify } from 'util';
import { concat, firstValueFrom, from } from 'rxjs';
import tmp from 'tmp';
import got from 'got';
import path from 'path';
import os from 'os';
import { createAudioFileName } from '../domain/key.ts';

const pipeline = promisify(stream.pipeline);

export const asYoutubeUrl = (videoId: string) => {
  return 'https://www.youtube.com/watch?v=' + videoId;
};

export const asKey = (videoId: string) => 'youtube-' + videoId;

// export const createYoutubeDlClientFactory = () => {
//   const client = create(constants?.YOUTUBE_DL_PATH);
//   return client;
// };

export const createAudioStreamWithYtVideo = (videoId: string) => {
  return youtubedl(asYoutubeUrl(videoId), {
    dumpSingleJson: true,
    noCheckCertificates: true,
    verbose: true,
    preferFreeFormats: true,
    audioFormat: 'mp3',
    downloader: 'ffmpeg',
    extractAudio: true,
    addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
    'download-sections': '*1:30-2:30',
  } as any).then(async (output: any) => {
    const url = output.url!;
    console.time('extract');
    // time consuming, use deterministic name

    const fileName = createAudioFileName('youtube', videoId);
    const filePath = path.join(os.tmpdir(), fileName);
    // const filePath = tmp.fileSync({ name: fileName })?.name;
    await pipeline(got.stream(url), createWriteStream(filePath));
    console.timeEnd('extract');
    console.log('extract file', videoId, filePath);
    return createReadStream(filePath);
  });
};
