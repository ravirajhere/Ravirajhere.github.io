import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { put, head } from '@vercel/blob';

const CACHE_KEY = 'pdf/resume-v1.pdf';

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

  const { type = 'resume' } = req.body || {};

  if (type !== 'resume') {
    return res.status(400).json({ error: 'Only resume supported in this version' });
  }

  try {
    const existing = await head(CACHE_KEY);
    if (existing) {
      return res.status(200).json({
        url: existing.url,
        cached: true
      });
    }
  } catch (err) {
    // Not cached
  }

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

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    const targetUrl = `${baseUrl}/resume-pdf.html`;

    await page.goto(targetUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    await page.evaluateHandle('document.fonts.ready');
    await new Promise((r) => setTimeout(r, 500));

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '16mm',
        right: '18mm',
        bottom: '16mm',
        left: '18mm',
      },
      displayHeaderFooter: false,
      preferCSSPageSize: false,
    });

    await browser.close();
    browser = null;

    const blob = await put(CACHE_KEY, pdfBuffer, {
      access: 'public',
      contentType: 'application/pdf',
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    return res.status(200).json({
      url: blob.url,
      cached: false
    });

  } catch (error) {
    console.error('[pdf] Error:', error);

    if (browser) {
      try { await browser.close(); } catch (e) {}
    }

    return res.status(500).json({
      error: 'PDF generation failed',
      details: error.message
    });
  }
}
