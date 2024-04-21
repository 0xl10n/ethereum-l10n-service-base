import _ from 'lodash';
import { fromEventPattern, of, pipe, Observable } from 'rxjs';

import { WebVTT, VTTCue } from 'videojs-vtt.js';
import {
  map,
  filter,
  takeUntil,
  flatMap,
  toArray,
  tap,
  shareReplay,
  bufferCount,
  distinct,
} from 'rxjs/operators';

const timestampPattern = /<[\/]*\d\d:\d\d:[^<]+>/;

// up to client to decide
export const SPEAKER_UNKNOWN = 'unknown';

type VTTCue = any;

/**
 * ideally observable to support progressive loading
 * now we simplify just output whole array
 * also no direct solidjs rxjs mapping, need more thoughts
 *
 * WebVTT requires window
 */

export const combineCues = ({
  cues,
  durationLimit = 15,
  wordCountLimit = 3,
  sentencesLimit = 3,
}: {
  cues: VTTCue[];
  durationLimit: number;
  wordCountLimit: number;
  sentencesLimit: number;
}): VTTCue[] => {
  const cuesByGroup = _.groupBy(cues, (cue: VTTCue) => {
    const timeBucket = (cue.startTime / durationLimit).toFixed(0);

    // speaker tag might not be avaiable. in such case generically unknown speker
    return [cue.speaker || SPEAKER_UNKNOWN, timeBucket].join('-');
  });

  return _.flatMap(cuesByGroup, (cues: VTTCue[]) => {
    const [cue] = cues;

    return _.merge(cue, {
      endTime: _.last(cues).endTime,
      text: cues.map((c) => c.text).join(' '),
    });
  });
};

// assume starts with cue w/ timestamp
// need a sliding window for rxjs style
// https://stackoverflow.com/questions/15256557/trouble-implementing-a-sliding-window-in-rx

export const isContainTimestampTags = (raw: string) =>
  raw.search(timestampPattern) !== -1;

export const combineCuesWithTimestamps = (cues: Observable<VTTCue>) =>
  cues.pipe(
    bufferCount(3, 2),
    map((cues: VTTCue[]) => {
      if (cues[1]) {
        return _.merge(cues[1], {
          text: (cues[1].text || '').replace(/\s*\n\s*\n/g, '\n'),
          startTime: cues[0].startTime,
        });
      }
    }),
    filter((cue: VTTCue) => {
      const text = _.get(cue, 'text');

      return _.isString(text) && !text.match(/^\s*\n/);
    }),
  );

export const extractVttTextTags = (_text: string) => {
  const text = _text
    .replace(new RegExp(timestampPattern, 'g'), '')
    .replace(/<[\/]*c>/g, '');

  return {
    text,
  };
};

export const cleanLinebreaks = (s: string) =>
  (s || '').replace(/(\r|\n)/g, ' ');

export const parseForCues = (
  window = global.window,
  _vtt: string,
): Observable<VTTCue | null> => {
  console.log('parseForCues');
  // fix incorrect linebreak for auto youtube-gen
  const vtt = _.trim(_vtt.replace('0%\n\n', '0%\n').replace(/\r/g, ''));
  if (!window) {
    console.log('window is required for webvtt');

    return of(null);
  }
  const parser = new WebVTT.Parser(window, WebVTT.StringDecoder());
  const cues = fromEventPattern((handler: any) => {
    parser.oncue = handler;
  });

  // instead of mozilla version due to this
  // https://github.com/videojs/vtt.js/pull/32

  const error = fromEventPattern((handler: any) => {
    parser.onparsingerror = handler;
  });
  const flushed = fromEventPattern((handler: any) => {
    parser.onflush = handler;
  });

  const allCues = cues.pipe(
    takeUntil(flushed),
    map((cue: VTTCue, id: number) => {
      cue.id = id.toString();
      // cant use ...cue destructure for VTTCue
      return cue;
    }),
    // take in processor so client can decide, esp if post-processed
    shareReplay(),
  );
  // we use hack of share, proper way is to define callback based subscriber
  allCues.subscribe();
  parser.parse(vtt);
  parser.flush();

  // start parsing only when subscribed
  return allCues;
};
