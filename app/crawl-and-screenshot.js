const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const os = require('os');
const archiver = require('archiver');

const screenshotDir = path.join(os.tmpdir(), 'screenshots');

if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir);
    console.log(`Created directory: ${screenshotDir}`);
}

const VIEWPORTS = [
    { width: 1920, height: 1080, deviceScaleFactor: 2 },
    { width: 375, height: 667, deviceScaleFactor: 2 }
];

(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        defaultViewport: null,
        headless: true // ヘッドレスモードでブラウザを起動
    });
    const page = await browser.newPage();

    const startUrl = process.argv[2]; // 開始するURLを指定してください
    const visitedUrls = new Set();
    const urlsToVisit = [startUrl]; 

    while (urlsToVisit.length > 0) {
        const url = urlsToVisit.shift();
        if (visitedUrls.has(url)) {
            continue;
        }
        visitedUrls.add(url);

        for (const viewport of VIEWPORTS) {
            await page.setViewport(viewport);

            try {
                await page.goto(url, { waitUntil: 'networkidle2' });
                console.log(`Visiting: ${url} with viewport ${viewport.width}x${viewport.height}`);

                // ファイル名を生成
                let fileName;
                if (url === startUrl) {
                    fileName = 'top.png';
                } else {
                    const relativePath = url.replace(startUrl, '');
                    fileName = relativePath.replace(/\//g, '_').replace(/\?.*$/, '').replace(/#.*$/, '') + '.png';
                    if (fileName.startsWith('_')) {
                        fileName = fileName.slice(1); // 先頭の余分なアンダースコアを削除
                    }
                    fileName = '_' + fileName; // 先頭にアンダースコアを追加
                    if (fileName === '_.png') {
                        fileName = '_index.png';
                    }
                }

                const screenshotPath = path.join(screenshotDir, fileName);
                await page.screenshot({ path: screenshotPath, fullPage: true });
                console.log(`Screenshot taken for ${url} and saved as ${screenshotPath}`);

            } catch (err) {
                console.error(`Error visiting ${url} with viewport ${viewport.width}x${viewport.height}:`, err);
            }
        }

        // ページ内のリンクを収集
        const links = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('a'))
                .map(anchor => anchor.href)
                .filter(href => href.startsWith('http') || href.startsWith('/'));
        });

        // 新しいリンクを訪問予定に追加
        for (const link of links) {
            const absoluteLink = new URL(link, url).href;
            if (!visitedUrls.has(absoluteLink) && !urlsToVisit.includes(absoluteLink) && absoluteLink.startsWith(startUrl)) {
                urlsToVisit.push(absoluteLink);
            }
        }
    }

    await browser.close();
    console.log('Crawling and screenshot process completed.');

    // ZIPファイルを作成
    const zipPath = path.join(screenshotDir, 'screenshots.zip');
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
        zlib: { level: 9 }
    });

    output.on('close', () => {
        console.log(`ZIP file created: ${zipPath}`);
    });

    archive.pipe(output);
    archive.directory(screenshotDir, false);
    await archive.finalize();
})();