import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { put, head } from '@vercel/blob';

const CACHE_KEY = 'pdf/resume-v2.pdf';

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

  const { type = 'resume' } = req.body || {};

  if (type !== 'resume') {
    return res.status(400).json({ error: 'Only resume supported in this version' });
  }

  console.log('[pdf] START — type:', type);

  // ============================================================
  // 1. Check cache
  // ============================================================
  try {
    const existing = await head(CACHE_KEY);
    if (existing) {
      const elapsed = Date.now() - startTime;
      console.log('[pdf] Cache hit in', elapsed, 'ms');
      return res.status(200).json({
        url: existing.url,
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
    console.log('[pdf] Launching Chromium…');
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

    console.log('[pdf] Chromium launched in', Date.now() - launchStart, 'ms');

    const page = await browser.newPage();

    page.setDefaultTimeout(60000);
    page.setDefaultNavigationTimeout(60000);

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    const targetUrl = `${baseUrl}/resume-pdf.html`;

    console.log('[pdf] Loading:', targetUrl);
    const navStart = Date.now();

    await page.goto(targetUrl, {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });

    console.log('[pdf] Page loaded in', Date.now() - navStart, 'ms');

    // Wait for fonts
    await page.evaluateHandle('document.fonts.ready');

    // Small delay for render
    await new Promise((r) => setTimeout(r, 800));

    // Generate PDF
    console.log('[pdf] Generating PDF…');
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

    console.log('[pdf] PDF generated in', Date.now() - pdfStart, 'ms, size:', pdfBuffer.length, 'bytes');

    await browser.close();
    browser = null;

    // ============================================================
    // 3. Upload to Blob
    // ============================================================
    console.log('[pdf] Uploading to Blob…');
    const uploadStart = Date.now();

    const blob = await put(CACHE_KEY, pdfBuffer, {
      access: 'public',
      contentType: 'application/pdf',
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    console.log('[pdf] Uploaded in', Date.now() - uploadStart, 'ms:', blob.url);

    const totalElapsed = Date.now() - startTime;
    console.log('[pdf] DONE — total:', totalElapsed, 'ms');

    return res.status(200).json({
      url: blob.url,
      cached: false,
      elapsed: totalElapsed
    });

  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error('[pdf] Error after', elapsed, 'ms:', error.message);
    console.error('[pdf] Stack:', error.stack);

    if (browser) {
      try { await browser.close(); } catch (e) {}
    }

    return res.status(500).json({
      error: 'PDF generation failed',
      details: error.message,
      elapsed
    });
  }
}
