import _ from 'lodash';

export const createPrompt = (body: string, length = 3000) => {
  const promptStart =
    'Given below HTML. Generate an json for all textual content, where key is css selector and value as string itself. Then generate another json with values translated into tradition chinese.  Be exhaustive. Aggregate them into single json by key of "en", "zh_TW". Return only the json without any other text';

  const prompt = `
  ${promptStart}
  
  html:
  ${_.truncate(body, {
    length,
  })}
 
  `;

  return prompt;
};
