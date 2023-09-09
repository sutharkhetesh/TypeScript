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
  $('#product-grid > ul > li ').each((_, el) => {
    // console.log($(el).text());
    const price = $('[class="card__content"] [class="price__container"] [class="price__regular"] [class="price-item price-item--regular"]', el).text()
    const name = $('[class="card__content"] [class="card__heading h5"] a', el).text()
    productsData.push({
      name
      , price
    })
  })
  writeFile('products.json', JSON.stringify(productsData, null, 2))
  browser.close();
}
main();