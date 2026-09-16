/* ============================================================
   ebook.js — A Boy Who Never Thought
   Fast PDF Generator (A4, batch rendering, scale 1.5)
   Cover: assets/images/bookcover.jpg (with fallback)
   ============================================================ */

/* ---------- CONFIG ---------- */
const EBOOK_CONFIG = {
  author: 'Suraj Anand Singh',
  aka: 'Ravi Raj',
  title: 'A Boy Who Never Thought',
  subtitle: 'Safar se safar tak — गुंजते सन्नाटे',
  birthYear: 2006,
  birthplace: 'Begusarai, Bihar',
  email: 'raviraj2k09@gmail.com',
  website: 'ravirajhere.github.io',
  websiteUrl: 'https://ravirajhere.github.io',
  currentYear: new Date().getFullYear(),
  coverImage: 'assets/images/bookcover.jpg',
  qr: {
    url: 'https://ravirajhere.github.io',
    size: 120
  },
  pdf: {
    scale: 1.5,
    quality: 0.85,
    format: 'a4',
    margin: 15,
    batchSize: 3
  }
};

/* ---------- COMMON PAGES TEXT ---------- */
const COMMON = {
  dedication: `To my parents, my siblings, and my friends —<br>For shaping the person I am today.`,
  epigraph: `"Safar se safar tak — गुंजते सन्नाटे"<br><br><em>— A journey within a journey, echoing silences.</em>`,
  preface: `This book is a collection of memories from my early years — from my birth in 2006 to the end of my fifth class in 2019. It is not merely a story; it is a reflection of a childhood lived in a small town, in a family that struggled, loved, and endured.<br><br>
    I have written this as honestly as I remember. Some names may have faded, some dates may blur, but the emotions remain as vivid as ever.<br><br>
    <em>— Suraj Anand Singh</em>`,
  acknowledgements: `I would like to express my deepest gratitude to:<br><br>
    <strong>My Mummy</strong> — for being my first teacher, my inspiration, and my strength.<br><br>
    <strong>Ujjwal Sir</strong> — for making Mathematics not just a subject, but a passion.<br><br>
    <strong>My sisters, Richa and my elder sister</strong> — for being my protectors and companions.<br><br>
    <strong>My teachers of GBGS</strong> — for believing in me when I was still learning to believe in myself.<br><br>
    <strong>My friends</strong> — for the laughter, the fights, and the memories.<br><br>
    And to everyone who, knowingly or unknowingly, became a part of this story.`,
  conclusion: `As I close the first chapter of my life, I do so with gratitude and hope. The road ahead is long, and the story far from over.<br><br>
    But if there is one thing I have learned, it is this:<br><br>
    <strong>The best is yet to come.</strong>`,
  thankyou: `Thank you for reading.<br><br>
    Your time, your attention, and your heart —<br>I do not take them for granted.<br><br>❤️`,
  colophon: `This book was written, designed, and produced with love.<br><br>
    Made with ❤️<br>Begusarai, Bihar<br>${new Date().getFullYear()}`,
  aboutBio: `Suraj Anand Singh, known by his pen name Ravi Raj, is a young writer and self-taught web developer from Begusarai, Bihar. Currently based in Patna, he is a student of Senior Secondary (Class 12, CBSE) with a focus on Physics, Chemistry, and Mathematics.<br><br>
    With over two years of self-learning in web development, he has built several projects — including this very autobiography website, which inspired the book you now hold. He aspires to become an engineer, a dream planted in him by his mother, and continues to explore full-stack development alongside his studies.<br><br>
    <em>'A Boy Who Never Thought'</em> is his first autobiographical work, capturing the innocence, struggles, and dreams of his early years.<br><br>
    He is open to freelance opportunities and collaborations.`
};

/* ============================================================
   1. TOAST MANAGER
   ============================================================ */
class ToastManager {
  constructor() {
    this.toast = document.getElementById('toast');
    this.timeout = null;
    this.queue = [];
    this.isShowing = false;
  }
  show(message, type = 'info', duration = 3000) {
    this.queue.push({ message, type, duration });
    if (!this.isShowing) this.processQueue();
  }
  processQueue() {
    if (this.queue.length === 0) { this.isShowing = false; return; }
    this.isShowing = true;
    const { message, type, duration } = this.queue.shift();
    if (!this.toast) return;
    this.toast.textContent = message;
    this.toast.className = 'toast';
    if (type) this.toast.classList.add(type);
    this.toast.classList.add('show');
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.toast.classList.remove('show');
      setTimeout(() => this.processQueue(), 300);
    }, duration);
  }
  error(msg) { this.show('❌ ' + msg, 'error', 4000); }
  success(msg) { this.show('✅ ' + msg, 'success', 3000); }
  info(msg) { this.show('ℹ️ ' + msg, 'info', 2500); }
  warning(msg) { this.show('⚠️ ' + msg, 'warning', 3500); }
}
const toast = new ToastManager();

/* ============================================================
   2. MODAL MANAGER
   ============================================================ */
class ModalManager {
  constructor() {
    this.modal = document.getElementById('downloadModal');
    this.isOpen = false;
  }
  open() {
    if (!this.modal) return;
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.isOpen = true;
  }
  close() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    this.isOpen = false;
  }
}
const modal = new ModalManager();

/* ============================================================
   3. LIBRARY LOADER
   ============================================================ */
class LibraryLoader {
  static async loadScript(src, retries = 3) {
    if (src.includes('html2canvas') && typeof html2canvas !== 'undefined') return true;
    if (src.includes('jspdf') && typeof window.jspdf !== 'undefined') return true;
    if (src.includes('qrcode') && typeof QRCode !== 'undefined') return true;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
        return true;
      } catch (error) {
        if (attempt === retries) throw new Error(`Failed to load ${src}`);
        await new Promise(r => setTimeout(r, 1000 * attempt));
      }
    }
    return false;
  }
  static async loadAll() {
    const libraries = [
      'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
    ];
    for (const src of libraries) {
      const isLoaded =
        (src.includes('html2canvas') && typeof html2canvas !== 'undefined') ||
        (src.includes('jspdf') && typeof window.jspdf !== 'undefined') ||
        (src.includes('qrcode') && typeof QRCode !== 'undefined');
      if (!isLoaded) await this.loadScript(src);
    }
    return true;
  }
}

/* ============================================================
   4. QR CODE GENERATOR
   ============================================================ */
class QRGenerator {
  static async generate(data, size = 120) {
    return new Promise((resolve) => {
      try {
        const container = document.createElement('div');
        container.style.cssText = `width:${size}px;height:${size}px;position:absolute;left:-9999px;top:-9999px;`;
        document.body.appendChild(container);
        new QRCode(container, {
          text: data, width: size, height: size,
          colorDark: '#000000', colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        });
        let attempts = 0;
        const checkCanvas = setInterval(() => {
          attempts++;
          const canvas = container.querySelector('canvas');
          if (canvas) {
            clearInterval(checkCanvas);
            const dataUrl = canvas.toDataURL('image/png');
            document.body.removeChild(container);
            resolve(dataUrl);
          } else if (attempts >= 10) {
            clearInterval(checkCanvas);
            document.body.removeChild(container);
            resolve(null);
          }
        }, 100);
      } catch (error) {
        resolve(null);
      }
    });
  }
}

/* ============================================================
   5. IMAGE LOADER (with fallback)
   ============================================================ */
class ImageLoader {
  static async load(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(src);
      img.onerror = () => {
        console.warn(`Image not found: ${src} — using fallback`);
        resolve(null);
      };
      img.src = src;
    });
  }
}

/* ============================================================
   6. NUMBER TO WORD
   ============================================================ */
function numberToWord(n) {
  const words = ['One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten'];
  return words[n - 1] || n;
}

/* ============================================================
   7. MAIN EBOOK GENERATOR
   ============================================================ */
class EbookGenerator {
  constructor() {
    this.pdf = null;
    this.pages = [];
    this.currentPage = 0;
    this.totalPages = 0;
    this.isGenerating = false;
    this.cancelled = false;
    this.currentLang = 'en';
    this.coverImageAvailable = false;
  }

  async generate(lang, langLabel) {
    if (this.isGenerating) {
      toast.warning('Already generating, please wait');
      return;
    }
    this.isGenerating = true;
    this.cancelled = false;
    this.currentPage = 0;
    this.currentLang = lang;

    try {
      toast.info(`Preparing ${langLabel} eBook...`);
      await LibraryLoader.loadAll();

      // Check if cover image exists
      const coverSrc = await ImageLoader.load(EBOOK_CONFIG.coverImage);
      this.coverImageAvailable = !!coverSrc;

      const content = this.extractContent(lang);
      if (!content || content.chapters.length === 0) {
        throw new Error('Content not found');
      }

      toast.info(`Building ${langLabel} eBook...`);
      this.pages = await this.buildPages(content, lang);
      this.totalPages = this.pages.length;

      toast.info(`Generating PDF (${this.totalPages} pages)...`);
      await this.generatePDF(langLabel);

      const filename = `Suraj-Anand-Autobiography-${langLabel}.pdf`;
      this.pdf.save(filename);
      toast.success(`${langLabel} eBook downloaded!`);
    } catch (error) {
      console.error('Ebook generation failed:', error);
      toast.error(`Failed: ${error.message}`);
    } finally {
      this.isGenerating = false;
      this.cleanup();
    }
  }

  /* ---------- Extract chapters from HTML ---------- */
  extractContent(lang) {
    const chapters = [];
    const sections = document.querySelectorAll('section.chapter');

    sections.forEach(section => {
      const titleEl = section.querySelector('.chapter-title');
      const title = lang === 'hi'
        ? (titleEl?.getAttribute('data-hi') || titleEl?.textContent.trim())
        : (titleEl?.getAttribute('data-en') || titleEl?.textContent.trim());

      const year = section.querySelector('.chapter-year')?.textContent.trim() || '';

      const contentDiv = section.querySelector(`.chapter-content[data-lang-content="${lang}"]`)
                       || section.querySelector('.chapter-content');

      const paragraphs = contentDiv
        ? Array.from(contentDiv.querySelectorAll('p')).map(p => p.innerHTML.trim())
        : [];

      const isEpilogue = section.classList.contains('epilogue');

      chapters.push({ title, year, paragraphs, isEpilogue });
    });

    return { chapters };
  }

  /* ---------- Build all pages ---------- */
  async buildPages(content, lang) {
    const pages = [];
    const chapters = content.chapters;
    const qrDataUrl = await QRGenerator.generate(EBOOK_CONFIG.qr.url, EBOOK_CONFIG.qr.size);

    const builders = [
      () => this.createCoverPage(),
      () => this.createTitlePage(),
      () => this.createCopyrightPage(),
      () => this.createDedicationPage(),
      () => this.createEpigraphPage(),
      () => this.createPrefacePage(),
      () => this.createAcknowledgementsPage(),
      () => this.createTOCPage(chapters),
      ...chapters.map((ch, i) => () => this.createChapterPage(ch, i)),
      () => this.createConclusionPage(),
      () => this.createAboutPage(qrDataUrl),
      () => this.createThankYouPage(),
      () => this.createColophonPage()
    ];

    for (const builder of builders) {
      if (this.cancelled) break;
      const page = await builder();
      if (page) {
        pages.push(page);
        this.currentPage++;
        this.updateProgress();
      }
    }
    return pages;
  }

  /* ---------- PAGE BUILDERS ---------- */

  createPageWrap(inner, extraStyle = '') {
    const div = document.createElement('div');
    div.style.cssText = `
      padding: 60px 50px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      min-height: 100%;
      ${extraStyle}
    `;
    div.innerHTML = inner;
    return div;
  }

  /* ---------- COVER PAGE — IMAGE BASED ---------- */
  createCoverPage() {
    const div = document.createElement('div');
    div.style.cssText = `
      padding: 0;
      margin: 0;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100%;
      width: 100%;
      overflow: hidden;
    `;

    if (this.coverImageAvailable) {
      // Use uploaded cover image
      div.innerHTML = `
        <img 
          src="${EBOOK_CONFIG.coverImage}" 
          alt="A Boy Who Never Thought — Cover" 
          crossorigin="anonymous"
          style="width:100%;height:100%;object-fit:contain;display:block;"
        >
      `;
    } else {
      // Fallback — dark theme CSS cover
      div.innerHTML = `
        <div style="
          width:100%;height:100%;
          background:#0d0d1a;
          padding:80px 60px;
          display:flex;flex-direction:column;
          align-items:center;justify-content:center;
          text-align:center;
          border:12px double #DAA520;
          box-sizing:border-box;
        ">
          <p style="letter-spacing:8px;font-size:14px;color:#DAA520;font-family:'EB Garamond',serif;margin-bottom:60px;">AN AUTOBIOGRAPHY</p>
          <h1 style="font-family:'EB Garamond',serif;font-size:52px;color:#DAA520;letter-spacing:3px;margin:0;">${EBOOK_CONFIG.author}</h1>
          <p style="font-style:italic;font-size:18px;color:#b8942e;margin:18px 0 50px;">~ ${EBOOK_CONFIG.aka}</p>
          <div style="width:120px;height:1px;background:#DAA520;margin-bottom:50px;"></div>
          <h2 style="font-family:'EB Garamond',serif;font-size:32px;color:#fdfaf3;font-weight:600;margin:0 0 20px;line-height:1.3;">${EBOOK_CONFIG.title}</h2>
          <p style="font-style:italic;font-size:16px;color:#c9b37e;margin-bottom:70px;">${EBOOK_CONFIG.subtitle}</p>
          <p style="font-size:14px;color:#DAA520;letter-spacing:5px;">${EBOOK_CONFIG.currentYear}</p>
        </div>
      `;
    }
    return div;
  }

  createTitlePage() {
    return this.createPageWrap(`
      <div style="text-align:center;margin:auto 0;">
        <p style="letter-spacing:6px;font-size:13px;color:#8b7355;margin-bottom:50px;">AN AUTOBIOGRAPHY</p>
        <h1 style="font-family:'EB Garamond',serif;font-size:48px;color:#1a1a1a;font-weight:600;margin:0 0 20px;line-height:1.2;">${EBOOK_CONFIG.title}</h1>
        <p style="font-style:italic;font-size:18px;color:#555;margin-bottom:60px;">${EBOOK_CONFIG.subtitle}</p>
        <div style="width:80px;height:1px;background:#DAA520;margin:0 auto 60px;"></div>
        <p style="font-size:24px;font-weight:600;color:#1a1a1a;margin:0;">${EBOOK_CONFIG.author}</p>
        <p style="font-style:italic;color:#777;margin:10px 0 60px;">~ ${EBOOK_CONFIG.aka}</p>
        <p style="font-size:14px;color:#555;letter-spacing:4px;">${EBOOK_CONFIG.currentYear}</p>
      </div>
    `, 'justify-content:center;text-align:center;');
  }

  createCopyrightPage() {
    return this.createPageWrap(`
      <div style="margin:auto 0;max-width:500px;">
        <p style="font-size:12px;line-height:2;color:#333;font-family:'EB Garamond',serif;">
          © ${EBOOK_CONFIG.currentYear} ${EBOOK_CONFIG.author}. All rights reserved.<br><br>
          No part of this publication may be reproduced, distributed, or transmitted in any form or by any means without the prior written permission of the author.<br><br>
          <em>First Edition — ${EBOOK_CONFIG.currentYear}</em><br>
          Published independently by the author.<br>
          ${EBOOK_CONFIG.birthplace}, India.
        </p>
      </div>
    `, 'justify-content:center;');
  }

  createDedicationPage() {
    return this.createPageWrap(`
      <div style="margin:auto 0;text-align:center;">
        <p style="font-family:'Kalam',cursive;font-size:22px;line-height:2.2;color:#2c2c2c;">${COMMON.dedication}</p>
      </div>
    `, 'justify-content:center;');
  }

  createEpigraphPage() {
    return this.createPageWrap(`
      <div style="margin:auto 0;text-align:center;">
        <p style="font-family:'Kalam',cursive;font-size:20px;line-height:2;color:#2c2c2c;">${COMMON.epigraph}</p>
      </div>
    `, 'justify-content:center;');
  }

  createPrefacePage() {
    return this.createPageWrap(`
      <div style="max-width:550px;margin:0 auto;width:100%;">
        <h2 style="font-family:'EB Garamond',serif;font-size:32px;text-align:center;color:#1a1a1a;margin-bottom:40px;font-weight:600;">Preface</h2>
        <p style="text-align:justify;font-size:16px;line-height:1.9;color:#1a1a1a;font-family:'EB Garamond',serif;">${COMMON.preface}</p>
      </div>
    `);
  }

  createAcknowledgementsPage() {
    return this.createPageWrap(`
      <div style="max-width:550px;margin:0 auto;width:100%;">
        <h2 style="font-family:'EB Garamond',serif;font-size:32px;text-align:center;color:#1a1a1a;margin-bottom:40px;font-weight:600;">Acknowledgements</h2>
        <p style="text-align:justify;font-size:16px;line-height:1.9;color:#1a1a1a;font-family:'EB Garamond',serif;">${COMMON.acknowledgements}</p>
      </div>
    `);
  }

  createTOCPage(chapters) {
    let items = '';
    chapters.forEach((ch, i) => {
      const num = ch.isEpilogue ? 'Epilogue' : `${i + 1}.`;
      items += `
        <li style="padding:8px 0;border-bottom:1px dotted #c9b37e;font-family:'EB Garamond',serif;font-size:17px;color:#1a1a1a;">
          ${num} ${ch.title}
        </li>`;
    });
    return this.createPageWrap(`
      <div style="max-width:550px;margin:0 auto;width:100%;">
        <h2 style="font-family:'EB Garamond',serif;font-size:32px;text-align:center;color:#1a1a1a;margin-bottom:40px;font-weight:600;">Contents</h2>
        <ul style="list-style:none;padding:0;">${items}</ul>
      </div>
    `);
  }

  createChapterPage(chapter, index) {
    const paras = chapter.paragraphs.map((p, i) => {
      if (i === 0 && p.length > 0) {
        const firstChar = p.replace(/<[^>]*>/g, '').charAt(0);
        const rest = p.replace(/<[^>]*>/g, '').slice(1);
        return `<p style="text-align:justify;font-size:17px;line-height:1.9;color:#1a1a1a;font-family:'EB Garamond',serif;margin-bottom:18px;">
          <span style="font-family:'EB Garamond',serif;font-size:56px;font-weight:600;color:#DAA520;float:left;line-height:1;margin-right:8px;margin-top:4px;">${firstChar}</span>${rest}
        </p>`;
      }
      return `<p style="text-align:justify;font-size:17px;line-height:1.9;color:#1a1a1a;font-family:'EB Garamond',serif;margin-bottom:18px;">${p}</p>`;
    }).join('');

    const chapterLabel = chapter.isEpilogue ? 'EPILOGUE' : `CHAPTER ${numberToWord(index + 1).toUpperCase()}`;

    return this.createPageWrap(`
      <div style="text-align:center;margin-bottom:50px;">
        <p style="letter-spacing:6px;font-size:13px;color:#8b7355;margin-bottom:15px;">${chapterLabel}</p>
        <h2 style="font-family:'EB Garamond',serif;font-size:34px;color:#1a1a1a;font-weight:600;margin:0 0 12px;line-height:1.3;">${chapter.title}</h2>
        ${chapter.year ? `<p style="font-style:italic;color:#777;font-size:15px;">${chapter.year}</p>` : ''}
        <div style="width:80px;height:1px;background:#DAA520;margin:25px auto 0;"></div>
      </div>
      <div>${paras}</div>
    `, 'padding-top:50px;');
  }

  createConclusionPage() {
    return this.createPageWrap(`
      <div style="max-width:550px;margin:0 auto;width:100%;text-align:center;">
        <h2 style="font-family:'EB Garamond',serif;font-size:32px;color:#1a1a1a;margin-bottom:40px;font-weight:600;">Conclusion</h2>
        <p style="font-size:17px;line-height:2;color:#1a1a1a;font-family:'EB Garamond',serif;">${COMMON.conclusion}</p>
      </div>
    `, 'justify-content:center;');
  }

  createAboutPage(qrDataUrl) {
    const qrBlock = qrDataUrl
      ? `<div style="margin-top:20px;text-align:center;">
           <img src="${qrDataUrl}" alt="QR" style="width:120px;height:120px;border:2px solid #DAA520;padding:4px;background:#fff;">
           <p style="font-size:11px;color:#999;margin-top:6px;">Scan to visit my portfolio</p>
         </div>` : '';

    return this.createPageWrap(`
      <div style="max-width:550px;margin:0 auto;width:100%;">
        <h2 style="font-family:'EB Garamond',serif;font-size:32px;text-align:center;color:#1a1a1a;margin-bottom:30px;font-weight:600;">About the Author</h2>
        <h3 style="font-family:'EB Garamond',serif;font-size:22px;color:#1a1a1a;margin:0 0 4px;">${EBOOK_CONFIG.author}</h3>
        <p style="font-style:italic;color:#777;font-size:15px;margin-bottom:18px;">~ ${EBOOK_CONFIG.aka}</p>
        <p style="text-align:justify;font-size:15px;line-height:1.8;color:#1a1a1a;font-family:'EB Garamond',serif;margin-bottom:20px;">${COMMON.aboutBio}</p>
        <ul style="list-style:none;padding:0;font-size:14px;line-height:2;color:#333;font-family:'EB Garamond',serif;">
          <li>📍 Patna, Bihar, India</li>
          <li>✉️ ${EBOOK_CONFIG.email}</li>
          <li>🌐 ${EBOOK_CONFIG.website}</li>
          <li>🎓 Class 12 (CBSE) — PCM</li>
          <li>💻 Web Developer | Writer</li>
        </ul>
        ${qrBlock}
      </div>
    `);
  }

  createThankYouPage() {
    return this.createPageWrap(`
      <div style="margin:auto 0;text-align:center;">
        <p style="font-family:'Kalam',cursive;font-size:24px;line-height:2.2;color:#2c2c2c;">${COMMON.thankyou}</p>
      </div>
    `, 'justify-content:center;');
  }

  createColophonPage() {
    return this.createPageWrap(`
      <div style="margin:auto 0;text-align:center;color:#555;font-size:15px;line-height:2.2;font-family:'EB Garamond',serif;">
        ${COMMON.colophon}
      </div>
    `, 'justify-content:center;');
  }

  /* ---------- PDF GENERATION (FAST) ---------- */
  async generatePDF(langLabel) {
    const { jsPDF } = window.jspdf;
    const config = EBOOK_CONFIG.pdf;

    this.pdf = new jsPDF({
      unit: 'mm',
      format: config.format,
      orientation: 'portrait',
      compress: true
    });

    this.pdf.setProperties({
      title: EBOOK_CONFIG.title,
      author: EBOOK_CONFIG.author,
      subject: 'Autobiography',
      creator: `${EBOOK_CONFIG.author} Publishing`
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = config.margin;
    const contentWidth = pageWidth - (margin * 2);
    const contentHeight = pageHeight - (margin * 2);

    let isFirstPage = true;
    const batchSize = config.batchSize || 3;

    for (let i = 0; i < this.pages.length; i += batchSize) {
      if (this.cancelled) break;
      const batch = this.pages.slice(i, i + batchSize);

      const results = await Promise.all(
        batch.map(page => this.renderPage(page, contentWidth, contentHeight))
      );

      for (const result of results) {
        if (result) {
          if (!isFirstPage) this.pdf.addPage();
          isFirstPage = false;
          this.pdf.addImage(result, 'JPEG', margin, margin, contentWidth, contentHeight, undefined, 'FAST');
        }
      }

      const progress = Math.min(100, Math.round(((i + batch.length) / this.pages.length) * 100));
      this.updateProgress(progress);

      await new Promise(r => setTimeout(r, 30));
    }
  }

  async renderPage(element, width, height) {
    try {
      const container = document.createElement('div');
      container.style.cssText = `position:absolute;left:-9999px;top:-9999px;width:${width}mm;background:#ffffff;padding:0;margin:0;`;
      const clone = element.cloneNode(true);
      clone.style.width = '100%';
      clone.style.background = '#ffffff';
      container.appendChild(clone);
      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        scale: EBOOK_CONFIG.pdf.scale,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: width * 3.78,
        height: height * 3.78
      });

      document.body.removeChild(container);
      if (canvas) return canvas.toDataURL('image/jpeg', EBOOK_CONFIG.pdf.quality);
      return null;
    } catch (error) {
      console.error('Page rendering failed:', error);
      return null;
    }
  }

  updateProgress(percent) {
    const bar = document.querySelector('.progress-bar');
    const text = document.querySelector('.progress-text');
    const p = Math.min(100, percent || Math.round((this.currentPage / this.totalPages) * 100));
    if (bar) bar.style.width = p + '%';
    if (text) text.textContent = p + '%';
  }

  cleanup() {
    document.querySelectorAll('div[style*="left: -9999px"]').forEach(el => el.remove());
    this.pages = [];
    this.pdf = null;
  }

  cancel() {
    this.cancelled = true;
    this.isGenerating = false;
    toast.warning('Generation cancelled');
    this.cleanup();
  }
}

/* ============================================================
   8. EXPOSE FUNCTIONS
   ============================================================ */
const ebookGenerator = new EbookGenerator();
window.downloadEnglishEbook = async () => await ebookGenerator.generate('en', 'English');
window.downloadHinglishEbook = async () => await ebookGenerator.generate('hi', 'Hinglish');
window.cancelEbookGeneration = () => ebookGenerator.cancel();

/* ============================================================
   9. EVENT LISTENERS
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const topBtn = document.getElementById('downloadBtn');
  const bottomBtn = document.getElementById('downloadBtnBottom');
  const enBtn = document.getElementById('modalDownloadEn');
  const hiBtn = document.getElementById('modalDownloadHi');
  const overlay = document.getElementById('downloadModal');

  if (topBtn) topBtn.addEventListener('click', () => modal.open());
  if (bottomBtn) bottomBtn.addEventListener('click', () => modal.open());
  if (enBtn) enBtn.addEventListener('click', () => { modal.close(); ebookGenerator.generate('en', 'English'); });
  if (hiBtn) hiBtn.addEventListener('click', () => { modal.close(); ebookGenerator.generate('hi', 'Hinglish'); });
  if (overlay) overlay.addEventListener('click', (e) => {
    if (e.target === overlay) modal.close();
  });

  const progressContainer = document.querySelector('.progress-container');
  if (progressContainer) {
    progressContainer.innerHTML = `
      <div style="width:100%;background:#f0f0f0;border-radius:8px;overflow:hidden;height:8px;">
        <div class="progress-bar" style="width:0%;height:100%;background:#DAA520;transition:width 0.3s ease;"></div>
      </div>
      <p class="progress-text" style="text-align:center;font-size:12px;color:#666;margin-top:6px;">0%</p>
    `;
  }

  const origGenerate = ebookGenerator.generate.bind(ebookGenerator);
  ebookGenerator.generate = async function(lang, label) {
    if (progressContainer) progressContainer.style.display = 'block';
    try {
      await origGenerate(lang, label);
    } finally {
      setTimeout(() => { if (progressContainer) progressContainer.style.display = 'none'; }, 1500);
    }
  };
});

/* ============================================================
   10. KEYBOARD SHORTCUTS
   ============================================================ */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modal.isOpen) modal.close();
    if (ebookGenerator.isGenerating) ebookGenerator.cancel();
  }
});

console.log('✅ ebook.js loaded — Cover uses assets/images/bookcover.jpg');
