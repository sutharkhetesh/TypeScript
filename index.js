const puppeteer = require('puppeteer');
const { load } = require('cheerio')
const { writeFile, readFile } = require('fs/promises')
async function main() {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: { width: 1024, height: 768 } });
  const page = await browser.newPage();
  await page.goto('https://homeedge.co.in/');
  await page.click(".header__search")
  await page.type("#Search-In-Modal", 'sofa')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(5000)

  // await browser.close();
  const productsData = []
  const $ = load(await page.content())
  $('#product-grid > ul > li [class="card__content"] [class="card__heading h5"] a').each((_, el) => {
    // console.log($(el).text());
    productsData.push({
      name: $(el).text()
    })
  })
  writeFile('products.json', JSON.stringify(productsData, null, 2))
  browser.close();
}
main();