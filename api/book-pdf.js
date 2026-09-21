import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { put, head } from '@vercel/blob';

const CACHE_VERSION = 'v1';

export default async function handler(req, res) {
  const startTime = Date.now();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { lang = 'en' } = req.body || {};

  if (lang !== 'en' && lang !== 'hi') {
    return res.status(400).json({ error: 'Invalid lang. Use "en" or "hi".' });
  }

  const cacheKey = `pdf/book-${lang}-${CACHE_VERSION}.pdf`;

  console.log('[book-pdf] START — lang:', lang);

  // ============================================================
  // 1. Check cache
  // ============================================================
  try {
    const existing = await head(cacheKey);
    if (existing) {
      const elapsed = Date.now() - startTime;
      console.log('[book-pdf] Cache hit in', elapsed, 'ms');
      return res.status(200).json({
        url: existing.url,
        lang,
        cached: true,
        elapsed
      });
    }
  } catch (err) {
    // Not cached, continue
  }

  // ============================================================
  // 2. Generate PDF
  // ============================================================
  let browser = null;

  try {
    console.log('[book-pdf] Launching Chromium…');
    const launchStart = Date.now();

    browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--single-process',
        '--no-zygote',
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    console.log('[book-pdf] Chromium launched in', Date.now() - launchStart, 'ms');

    const page = await browser.newPage();

    // Longer timeout for book (25 pages + chapters fetch)
    page.setDefaultTimeout(90000);
    page.setDefaultNavigationTimeout(90000);

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    const targetUrl = `${baseUrl}/print.html?lang=${lang}`;

    console.log('[book-pdf] Loading:', targetUrl);
    const navStart = Date.now();

    await page.goto(targetUrl, {
      waitUntil: 'networkidle0',
      timeout: 90000,
    });

    console.log('[book-pdf] Page loaded in', Date.now() - navStart, 'ms');

    // Wait for print.js to finish (book-root becomes visible)
    console.log('[book-pdf] Waiting for book-root.ready…');
    const readyStart = Date.now();

    await page.waitForFunction(
      () => {
        const root = document.getElementById('book-root');
        return root && !root.hidden && root.classList.contains('ready');
      },
      { timeout: 90000, polling: 500 }
    );

    console.log('[book-pdf] Book ready in', Date.now() - readyStart, 'ms');

    // Wait for fonts
    await page.evaluateHandle('document.fonts.ready');

    // Small delay for final render
    await new Promise((r) => setTimeout(r, 1000));

    // Generate PDF
    console.log('[book-pdf] Generating PDF…');
    const pdfStart = Date.now();

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm',
      },
      preferCSSPageSize: true,
      displayHeaderFooter: false,
    });

    console.log('[book-pdf] PDF generated in', Date.now() - pdfStart, 'ms, size:', pdfBuffer.length, 'bytes');

    await browser.close();
    browser = null;

    // ============================================================
    // 3. Upload to Blob
    // ============================================================
    console.log('[book-pdf] Uploading to Blob…');
    const uploadStart = Date.now();

    const blob = await put(cacheKey, pdfBuffer, {
      access: 'public',
      contentType: 'application/pdf',
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    console.log('[book-pdf] Uploaded in', Date.now() - uploadStart, 'ms:', blob.url);

    const totalElapsed = Date.now() - startTime;
    console.log('[book-pdf] DONE — total:', totalElapsed, 'ms');

    return res.status(200).json({
      url: blob.url,
      lang,
      cached: false,
      elapsed: totalElapsed
    });

  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error('[book-pdf] Error after', elapsed, 'ms:', error.message);
    console.error('[book-pdf] Stack:', error.stack);

    if (browser) {
      try { await browser.close(); } catch (e) {}
    }

    return res.status(500).json({
      error: 'Book PDF generation failed',
      details: error.message,
      elapsed,
      lang
    });
  }
}
