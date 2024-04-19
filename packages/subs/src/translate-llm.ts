// prompt
import _ from 'lodash';
import { OpenAI } from 'openai';
import { describe, beforeEach, test, expect } from 'vitest';
import {
  map,
  tap,
  takeUntil,
  defaultIfEmpty,
  take,
  toArray,
} from 'rxjs/operators';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

const createPrompt = (
  input: string,
  locale: string = 'Traditional chinese',
) => `
Convert below asr engine output into VTT format

 and translate into ${locale}. No simplified chinese allowed
 ${_.truncate(input, {
   length: 20000000,
 })}
`;

export const translate = async (input: string) => {
  const output = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: createPrompt(input) }],
    stream: false,
  });

  console.log(JSON.stringify(output, null, 4));

  const result = output?.choices?.[0]?.message?.content;
  return result;
};
