# web-crawl

【できること】
・サイトのスクショ（1920px×1080pxと375px×667px）
・サイトマップをExcelで作成するようにcsvにtitleとURLを出力

【使い方】
1. app/crawl-and-screenshot.jsとgenerate-sitemap.jsの以下の行を自分のPCのchrome.exeのパスに書き換え
executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',

2. ターミナルで node server.js を実行する
例：my-puppeteer-project> node server.js

3. 画面に処理をしたいサイトのURLを入力し「スクリーンショットを撮る」か「サイトマップを作成」ボタンを押す

4.処理が完了したらダウンロードボタンを押してダウンロード！
（次の処理をする場合は画面を再読み込みして使用）

【注意】
・10ページ程度のサイトでスクショに５分程度時間がかかります
