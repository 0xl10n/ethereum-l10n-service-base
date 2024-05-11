import playwright from 'playwright';
import cheerio from 'cheerio';
import { gotScraping } from 'got-scraping';

export const scrape = async (url: string) => {
  const browser = await playwright.firefox.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto(url);
  const html = await page.evaluate(() => document.body.innerHTML); // Save the page's HTML to a variable

  const $ = cheerio.load(html); // Use Cheerio to load the page's HTML code

  const body = $('body');

  // const text = body.text();
  const texts: any[] = [];
  $('a,p,h1,h2,h3,h4,h5').each(function (index, element) {
    // collectedText += element.innerText + " ";
    console.log('i', index, $(element).text());
    texts.push($(element).text());
  });

  // // Continue writing your scraper using Cheerio's jQuery syntax
  // const phone = {
  //   name: $('div.m-productCard__heading h1').text().trim(),
  //   memory: $(
  //     'div.composited_product_details_wrapper > div > div > div:nth-child(2) > div.label > span',
  //   )
  //     .text()
  //     .split(' ')
  //     .pop(),
  //   payMonthlyPrice: $('div.composite_price_monthly span').text().trim(),
  //   payTodayPrice: $('div.composite_price > p > ins > span').text().trim(),
  // };

  // console.log(phone);

  await browser.close();

  return {
    texts,
    body,
    html: body.html(),
  };
};

// return gotScraping.get({
//   url: 'https://docs.attest.org/docs/welcome',
//   // proxyUrl: 'http://usernamed:password@myproxy.com:1234',
// });
