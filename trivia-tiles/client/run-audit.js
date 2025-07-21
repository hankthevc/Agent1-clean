const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const fs = require('fs');
const { URL } = require('url');

const port = 3000;
const url = `http://localhost:${port}`;

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto(url);

  const { lhr } = await lighthouse(url, {
    port: (new URL(browser.wsEndpoint())).port,
    output: 'json',
    onlyCategories: ['accessibility'],
  });

  fs.writeFileSync('accessibility-audit.json', JSON.stringify(lhr, null, 2));

  console.log(`Accessibility score: ${lhr.categories.accessibility.score * 100}`);

  await browser.close();
})(); 