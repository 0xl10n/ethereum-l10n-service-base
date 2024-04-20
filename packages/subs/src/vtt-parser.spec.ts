import _ from 'lodash';
import { describe, beforeEach, test, expect } from 'vitest';
import { map, tap, toArray } from 'rxjs/operators';
import { firstValueFrom, from, timer } from 'rxjs';
import { VTTCue } from 'videojs-vtt.js';
import { parseForCues } from './vtt-parser.ts';
import { vttBasic } from './subs.fixture.ts';

/**
 * @vitest-environment jsdom
 */
describe('@jsdom webvtt', () => {
  // Not being turn on by default. use  --env jsdom at command
  beforeEach(() => {
    global.window.VTTCue = VTTCue;
  });

  test('#parseForCues', async () => {
    const vtt = vttBasic;
    const cues = parseForCues(window, vtt);

    const cuesAll = await firstValueFrom(
      cues.pipe(tap(console.log), toArray()),
    );

    expect(cuesAll.length).toEqual(2);

    expect(!!cuesAll[0].text.match('Never drink')).toEqual(true);
    expect(cuesAll[0].id).toEqual('0');
  });
});
