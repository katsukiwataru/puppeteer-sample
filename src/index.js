const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  // page URL トップページへ
  await page.goto('https://www.nttdocomo.co.jp/support/shop/');

  const allShopInfo = {}

  // button ref　地図のボタンクリック
  await page.click('#psearcherr2');

  // top page selector
  const topPageSelector =　"div.mod-shop-map > div.item > div.list > div > a";

  // get prefecture URL　都道府県のURL取得
  const prefectureURLList = await page.evaluate((selector) => {
    const list = Array.from(document.querySelectorAll(selector));
    return list.map(data => data.href);
  }, topPageSelector);

  // move to prefecture page　都道府県のページへ
  await page.goto(prefectureURLList[0]);

  // prefecture page selector
  const localPageSelector =　".s-col4-block > li > a";

  // get district URL　店舗取得
  const districtURLList = await page.evaluate((selector) => {
    const list = Array.from(document.querySelectorAll(selector));
    return list.map(data => data.href);
  }, localPageSelector);

  // move to district page　
  await page.goto(districtURLList[0]);

  // prefecture page selector
  const shopPageSelector =　".table-cmn > tbody > tr";

  // get district URL　店舗取得
  const shopList = await page.evaluate((selector) => {
    const list = Array.from(document.querySelectorAll(selector));
    return list.map(data => data.textContent.split('\n').filter(Boolean))[0];
  }, shopPageSelector);

  console.log(shopList);

  await browser.close();
})();
