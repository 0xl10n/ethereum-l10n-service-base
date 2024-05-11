import _ from 'lodash';
// Return only the json without any other text
export const createPrompt = (body: string, text: string, length = 3000) => {
  const promptStart =
    'Given below HTML, and input text.  Generate an json for all these strings, where key is unique, full selector that work with document.querySelector to uniquely selecting that text in html and value as string itself. Then generate another json with values translated into tradition chinese.  Aggregate them into single json by key of "en", "zh_TW"';

  const prompt = `

  ${promptStart}
  
  html:
  ${_.truncate(body, {
    length,
  })}


  text:
  ${text}
 
  `;

  return prompt;
};
