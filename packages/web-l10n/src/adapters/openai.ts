import _ from 'lodash';
import { OpenAI } from 'openai';
const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

export const generate = async (prompt: string) => {
  const output = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    stream: false,
    max_tokens: 4000,
  });

  console.log('output');
  // console.log(output?.choices?.[0]?.message?.content);
  console.log(output);

  return output;
};
