const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
const os = require('os');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/sitemap', express.static(path.join(__dirname, 'app/sitemap')));
app.use('/screenshots', express.static(path.join(os.tmpdir(), 'screenshots')));

app.post('/screenshot', (req, res) => {
    const url = req.body.url;
    exec(`node app/crawl-and-screenshot.js ${url}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ message: 'スクリーンショットの作成に失敗しました。' });
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        res.json({ message: 'スクリーンショットが正常に作成されました。' });
    });
});

app.post('/sitemap', (req, res) => {
    const url = req.body.url;
    exec(`node app/generate-sitemap.js ${url}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ message: 'サイトマップの作成に失敗しました。' });
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        res.json({ message: 'サイトマップが正常に作成されました。' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});