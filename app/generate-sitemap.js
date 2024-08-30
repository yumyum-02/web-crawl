// 1.サイトのURLを張り付け
// 2.node generate-sitemap.js
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const json2csv = require('json2csv').parse;

const startUrl = process.argv[2]; // 開始するURLを指定してください
const sitemapFolder = path.join(__dirname, 'sitemap');

if (!fs.existsSync(sitemapFolder)) {
    fs.mkdirSync(sitemapFolder);
}

const csvPath = path.join(sitemapFolder, 'sitemap.csv');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        defaultViewport: null,
        headless: true // ヘッドレスモードでブラウザを起動
    });
    const page = await browser.newPage();
    const urls = new Set();
    const titles = {};

    async function crawl(url) {
        if (urls.has(url)) return;
        urls.add(url);
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const pageTitle = await page.title();
        titles[url] = pageTitle;

        const links = await page.$$eval('a', anchors => anchors.map(anchor => anchor.href));
        for (const link of links) {
            if (link.startsWith(startUrl)) {
                await crawl(link);
            }
        }
    }

    await crawl(startUrl);
    await browser.close();

    const sitemap = Array.from(urls).map(url => ({
        URL: url,
        Title: titles[url] || 'N/A'
    }));

    const csv = json2csv(sitemap, { header: true });
    fs.writeFileSync(csvPath, csv, 'utf-8');
    console.log(`CSV file saved to ${csvPath}`);
})();
