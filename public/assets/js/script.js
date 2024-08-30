document.getElementById('screenshotButton').addEventListener('click', () => {
    const url = document.getElementById('urlInput').value;
    toggleLoading(true);
    fetch('/screenshot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
    })
    .then(response => response.json())
    .then(data => {
        toggleLoading(false);
        showDownloadButton('screenshots/screenshots.zip');
    })
    .catch(error => {
        console.error('Error:', error);
        toggleLoading(false);
    });
});

document.getElementById('sitemapButton').addEventListener('click', () => {
    const url = document.getElementById('urlInput').value;
    toggleLoading(true);
    fetch('/sitemap', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
    })
    .then(response => response.json())
    .then(data => {
        toggleLoading(false);
        showDownloadButton('sitemap/sitemap.csv');
    })
    .catch(error => {
        console.error('Error:', error);
        toggleLoading(false);
    });
});

function toggleLoading(isLoading) {
    document.getElementById('screenshotButton').style.display = isLoading ? 'none' : 'inline-block';
    document.getElementById('sitemapButton').style.display = isLoading ? 'none' : 'inline-block';
    document.querySelector('.loader-area').style.display = isLoading ? 'block' : 'none';
    document.getElementById('downloadButton').style.display = 'none';
}

function showDownloadButton(downloadPath) {
    document.getElementById('screenshotButton').style.display = 'none';
    document.getElementById('sitemapButton').style.display = 'none';
    document.querySelector('.loader-area').style.display = 'none';
    const downloadButton = document.getElementById('downloadButton');
    downloadButton.style.display = 'inline-block';
    downloadButton.onclick = () => {
        window.location.href = `/${downloadPath}`;
    };
}