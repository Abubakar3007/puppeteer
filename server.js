const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json({ limit: '10mb' }));

app.post('/generate', async (req, res) => {
  if (!req.body || !req.body.html) {
    return res.status(400).send('HTML missing');
  }

  const { html } = req.body;

  const browser = await puppeteer.launch({
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();

  await page.setViewport({ width: 1080, height: 1080 });

  await page.setContent(html, { waitUntil: 'networkidle0' });

  // 🔥 VERY IMPORTANT DELAY
  await new Promise(resolve => setTimeout(resolve, 3000));

  const buffer = await page.screenshot({ type: 'png' });

  await browser.close();

  res.set({
    'Content-Type': 'image/png',
    'Content-Length': buffer.length
  });

  res.end(buffer);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});