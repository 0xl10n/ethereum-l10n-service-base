import { OpenAI } from 'openai';
import { Stream } from 'openai/streaming.mjs';
import { Observable, flatMap, from, fromEventPattern, of } from 'rxjs';
import { PipelineOptions } from '../domain/pipeline-options.ts';

export const createOpenAi = (apiKey: string) => {
  return new OpenAI({
    apiKey,
  });
};

export const createClient = (apiKey: string) => {
  return createOpenAi(apiKey);
};

export const generateTranscript = async (
  audioStream: any,
  options: PipelineOptions,
) => {
  const { apiKey } = options;
  console.log('Generating transcript');
  console.time('asr:whisper');
  const transcription = await createClient(apiKey).audio.transcriptions.create({
    file: audioStream,
    model: 'whisper-1',
    response_format: 'vtt',
    // response_format: 'verbose_json',
    // timestamp_granularities: ['word'], // segment
    language: 'en', // this is optional but helps the model
  });
  console.timeEnd('asr:whisper');
  console.log('transcription', transcription);

  return transcription;
};

export const fromStream = (stream: Stream<any>): Observable<string> => {
  // fix incorrect linebreak for auto youtube-gen

  // TODO
  //   https://stackoverflow.com/questions/41537504/how-to-convert-node-readable-stream-to-rx-observable

  return of('');
};
