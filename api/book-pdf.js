import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { put, head } from '@vercel/blob';

const CACHE_VERSION = 'v1';

export default async function handler(req, res) {
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

  // ============================================================
  // 1. Check cache
  // ============================================================
  try {
    const existing = await head(cacheKey);
    if (existing) {
      return res.status(200).json({
        url: existing.url,
        lang,
        cached: true
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
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    // Longer timeout for book (25 pages + chapters fetch)
    page.setDefaultTimeout(60000);
    page.setDefaultNavigationTimeout(60000);

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    const targetUrl = `${baseUrl}/print.html?lang=${lang}`;

    console.log('[book-pdf] Loading:', targetUrl);

    await page.goto(targetUrl, {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });

    // Wait for print.js to finish (book-root becomes visible)
    await page.waitForFunction(
      () => {
        const root = document.getElementById('book-root');
        return root && !root.hidden && root.classList.contains('ready');
      },
      { timeout: 30000 }
    );

    console.log('[book-pdf] Book ready, generating PDF…');

    // Wait for fonts
    await page.evaluateHandle('document.fonts.ready');

    // Small delay for final render
    await new Promise((r) => setTimeout(r, 800));

    // Generate PDF
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

    await browser.close();
    browser = null;

    console.log('[book-pdf] PDF generated, size:', pdfBuffer.length, 'bytes');

    // ============================================================
    // 3. Upload to Blob
    // ============================================================
    const blob = await put(cacheKey, pdfBuffer, {
      access: 'public',
      contentType: 'application/pdf',
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    console.log('[book-pdf] Uploaded:', blob.url);

    return res.status(200).json({
      url: blob.url,
      lang,
      cached: false
    });

  } catch (error) {
    console.error('[book-pdf] Error:', error);

    if (browser) {
      try { await browser.close(); } catch (e) {}
    }

    return res.status(500).json({
      error: 'Book PDF generation failed',
      details: error.message
    });
  }
}
