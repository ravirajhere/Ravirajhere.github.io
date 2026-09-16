/* ============================================================
   ebook.js — A Boy Who Never Thought
   PDF Generator with English / Hinglish toggle
   ============================================================ */

/* ---------- CONFIG ---------- */
const BOOK = {
  title: 'A Boy Who Never Thought',
  subtitle: 'Safar se safar tak — गुंजते सन्नाटे',
  author: 'Suraj Anand Singh',
  aka: 'Ravi Raj',
  year: 2026,
  location: 'Begusarai, Bihar',
  email: 'raviraj2k09@gmail.com',
  website: 'ravirajhere.github.io',
  websiteUrl: 'https://ravirajhere.github.io'
};

/* ---------- COMMON PAGES TEXT (English, dono PDFs mein same) ---------- */
const COMMON = {
  title: 'AN AUTOBIOGRAPHY',
  copyright: `© 2026 ${BOOK.author}. All rights reserved.<br><br>
    No part of this publication may be reproduced, distributed, or transmitted
    in any form or by any means without the prior written permission of the author.<br><br>
    <em>First Edition — 2026</em><br>
    Published independently by the author.<br>
    ${BOOK.location}, India.`,

  dedication: `To my parents, my siblings, and my friends —<br>
    For shaping the person I am today.`,

  epigraph: `"Safar se safar tak — गुंजते सन्नाटे"<br><br>
    <em>— A journey within a journey, echoing silences.</em>`,

  preface: `This book is a collection of memories from my early years — from my birth
    in 2006 to the end of my fifth class in 2019. It is not merely a story; it is a
    reflection of a childhood lived in a small town, in a family that struggled,
    loved, and endured.<br><br>
    I have written this as honestly as I remember. Some names may have faded, some
    dates may blur, but the emotions remain as vivid as ever.<br><br>
    <em>— ${BOOK.author}</em>`,

  acknowledgements: `I would like to express my deepest gratitude to:<br><br>
    <strong>My Mummy</strong> — for being my first teacher, my inspiration, and my strength.<br><br>
    <strong>Ujjwal Sir</strong> — for making Mathematics not just a subject, but a passion.<br><br>
    <strong>My sisters, Richa and my elder sister</strong> — for being my protectors and companions.<br><br>
    <strong>My teachers of GBGS</strong> — for believing in me when I was still learning to believe in myself.<br><br>
    <strong>My friends</strong> — for the laughter, the fights, and the memories.<br><br>
    And to everyone who, knowingly or unknowingly, became a part of this story.`,

  conclusion: `As I close the first chapter of my life, I do so with gratitude and hope.
    The road ahead is long, and the story far from over.<br><br>
    But if there is one thing I have learned, it is this:<br><br>
    <strong>The best is yet to come.</strong>`,

  thankyou: `Thank you for reading.<br><br>
    Your time, your attention, and your heart —<br>
    I do not take them for granted.<br><br>
    ❤️`,

  colophon: `This book was written, designed, and produced with love.<br><br>
    Made with ❤️<br>
    ${BOOK.location}<br>
    ${BOOK.year}`,

  aboutBio: `${BOOK.author}, known by his pen name ${BOOK.aka}, is a young writer and
    self-taught web developer from ${BOOK.location}. Currently based in Patna, he is
    a student of Senior Secondary (Class 12, CBSE) with a focus on Physics, Chemistry,
    and Mathematics.<br><br>
    With over two years of self-learning in web development, he has built several
    projects — including this very autobiography website, which inspired the book you
    now hold. He aspires to become an engineer, a dream planted in him by his mother,
    and continues to explore full-stack development alongside his studies.<br><br>
    <em>'A Boy Who Never Thought'</em> is his first autobiographical work, capturing
    the innocence, struggles, and dreams of his early years.<br><br>
    He is open to freelance opportunities and collaborations.`
};

/* ---------- CHAPTER DATA (English + Hinglish) ---------- */
/* Ye HTML se auto-extract hoga, par backup ke liye yahan bhi rakh sakte ho */
/* Filhaal HTML se hi uthayenge */

/* ---------- HTML BUILDER ---------- */
function buildPage(content, className = '') {
  return `<div class="pdf-page ${className}">${content}</div>`;
}

function buildCoverPage() {
  return `
    <div class="pdf-page pdf-cover">
      <div class="pdf-cover-inner">
        <p class="pdf-cover-label">${COMMON.title}</p>
        <h1 class="pdf-cover-author">${BOOK.author}</h1>
        <p class="pdf-cover-aka">~ ${BOOK.aka}</p>
        <div class="pdf-cover-divider"></div>
        <h2 class="pdf-cover-title">${BOOK.title}</h2>
        <p class="pdf-cover-sub">${BOOK.subtitle}</p>
        <p class="pdf-cover-year">${BOOK.year}</p>
      </div>
    </div>`;
}

function buildTitlePage() {
  return buildPage(`
    <div class="pdf-center-page">
      <p class="pdf-small-label">${COMMON.title}</p>
      <h1 class="pdf-big-title">${BOOK.title}</h1>
      <p class="pdf-sub">${BOOK.subtitle}</p>
      <div class="pdf-divider"></div>
      <p class="pdf-author-name">${BOOK.author}</p>
      <p class="pdf-author-aka">~ ${BOOK.aka}</p>
      <p class="pdf-year">${BOOK.year}</p>
    </div>
  `);
}

function buildCopyrightPage() {
  return buildPage(`
    <div class="pdf-center-page pdf-copyright-page">
      <p>${COMMON.copyright}</p>
    </div>
  `);
}

function buildDedicationPage() {
  return buildPage(`
    <div class="pdf-kalam-page">
      <p>${COMMON.dedication}</p>
    </div>
  `);
}

function buildEpigraphPage() {
  return buildPage(`
    <div class="pdf-kalam-page">
      <p>${COMMON.epigraph}</p>
    </div>
  `);
}

function buildPrefacePage() {
  return buildPage(`
    <div class="pdf-text-page">
      <h2 class="pdf-section-title">Preface</h2>
      <p>${COMMON.preface}</p>
    </div>
  `);
}

function buildAcknowledgementsPage() {
  return buildPage(`
    <div class="pdf-text-page">
      <h2 class="pdf-section-title">Acknowledgements</h2>
      <p>${COMMON.acknowledgements}</p>
    </div>
  `);
}

function buildTOCPage(chapters) {
  const items = chapters.map((ch, i) =>
    `<li><span>${i + 1}. ${ch.title}</span></li>`
  ).join('');
  return buildPage(`
    <div class="pdf-text-page">
      <h2 class="pdf-section-title">Contents</h2>
      <ol class="pdf-toc">${items}</ol>
    </div>
  `);
}

function buildChapterPage(chapter, index) {
  const paragraphs = chapter.paragraphs
    .map(p => `<p>${p}</p>`)
    .join('');
  return buildPage(`
    <div class="pdf-chapter-page">
      <p class="pdf-chapter-num">CHAPTER ${numberToWord(index + 1).toUpperCase()}</p>
      <h2 class="pdf-chapter-title">${chapter.title}</h2>
      ${chapter.year ? `<p class="pdf-chapter-year">${chapter.year}</p>` : ''}
      <div class="pdf-chapter-body">${paragraphs}</div>
    </div>
  `);
}

function buildEpiloguePage(epilogue) {
  const paragraphs = epilogue.paragraphs.map(p => `<p>${p}</p>`).join('');
  return buildPage(`
    <div class="pdf-chapter-page">
      <p class="pdf-chapter-num">EPILOGUE</p>
      <h2 class="pdf-chapter-title">${epilogue.title}</h2>
      <div class="pdf-chapter-body">${paragraphs}</div>
    </div>
  `);
}

function buildConclusionPage() {
  return buildPage(`
    <div class="pdf-text-page pdf-conclusion">
      <h2 class="pdf-section-title">Conclusion</h2>
      <p>${COMMON.conclusion}</p>
    </div>
  `);
}

function buildAboutPage() {
  return buildPage(`
    <div class="pdf-text-page">
      <h2 class="pdf-section-title">About the Author</h2>
      <div class="pdf-about-grid">
        <div class="pdf-about-photo">
          <div class="pdf-photo-placeholder">📷</div>
        </div>
        <div class="pdf-about-info">
          <h3>${BOOK.author}</h3>
          <p class="pdf-about-aka">~ ${BOOK.aka}</p>
          <p>${COMMON.aboutBio}</p>
          <ul class="pdf-about-details">
            <li>📍 Patna, Bihar, India</li>
            <li>✉️ ${BOOK.email}</li>
            <li>🌐 ${BOOK.website}</li>
            <li>🎓 Class 12 (CBSE) — PCM</li>
            <li>💻 Web Developer | Writer</li>
            <li>🗣️ Hindi (Native), English (Professional)</li>
          </ul>
          <div class="pdf-qr" id="pdfQR"></div>
        </div>
      </div>
    </div>
  `);
}

function buildThankYouPage() {
  return buildPage(`
    <div class="pdf-kalam-page pdf-thankyou">
      <p>${COMMON.thankyou}</p>
    </div>
  `);
}

function buildColophonPage() {
  return buildPage(`
    <div class="pdf-center-page pdf-colophon">
      <p>${COMMON.colophon}</p>
    </div>
  `);
}

function numberToWord(n) {
  const words = ['One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten'];
  return words[n - 1] || n;
}

/* ============================================================
   PART 2 — CSS, Language Filter, PDF Generator, Progress Bar
   ============================================================ */

/* ---------- PDF STYLES (inject karenge) ---------- */
const PDF_STYLES = `
  .pdf-page {
    width: 148mm;
    min-height: 210mm;
    padding: 18mm 15mm;
    box-sizing: border-box;
    background: #fdfaf3;
    color: #1a1a1a;
    font-family: 'EB Garamond', Georgia, serif;
    font-size: 12pt;
    line-height: 1.75;
    page-break-after: always;
    position: relative;
    overflow: hidden;
  }
  .pdf-cover {
    background: #0d0d1a;
    color: #d4af37;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 8px double #d4af37;
    padding: 20mm;
  }
  .pdf-cover-inner { text-align: center; }
  .pdf-cover-label {
    font-family: 'EB Garamond', serif;
    letter-spacing: 6px;
    font-size: 10pt;
    color: #d4af37;
    margin-bottom: 20mm;
  }
  .pdf-cover-author {
    font-family: 'EB Garamond', serif;
    font-size: 26pt;
    color: #d4af37;
    margin: 0;
    letter-spacing: 2px;
  }
  .pdf-cover-aka {
    font-style: italic;
    font-size: 12pt;
    color: #b8942e;
    margin: 4mm 0 12mm;
  }
  .pdf-cover-divider {
    width: 60mm;
    height: 1px;
    background: #d4af37;
    margin: 0 auto 12mm;
  }
  .pdf-cover-title {
    font-family: 'EB Garamond', serif;
    font-size: 20pt;
    color: #fdfaf3;
    margin: 0 0 6mm;
    font-weight: 600;
  }
  .pdf-cover-sub {
    font-style: italic;
    font-size: 11pt;
    color: #c9b37e;
    margin-bottom: 20mm;
  }
  .pdf-cover-year {
    font-size: 10pt;
    color: #d4af37;
    letter-spacing: 3px;
  }

  .pdf-center-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: 174mm;
  }
  .pdf-small-label {
    letter-spacing: 5px;
    font-size: 10pt;
    color: #8b7355;
    margin-bottom: 10mm;
  }
  .pdf-big-title {
    font-family: 'EB Garamond', serif;
    font-size: 28pt;
    color: #1a1a1a;
    margin: 0 0 6mm;
    font-weight: 600;
    line-height: 1.2;
  }
  .pdf-sub {
    font-style: italic;
    font-size: 12pt;
    color: #555;
    margin-bottom: 15mm;
  }
  .pdf-divider {
    width: 40mm;
    height: 1px;
    background: #d4af37;
    margin: 0 auto 15mm;
  }
  .pdf-author-name {
    font-size: 16pt;
    font-weight: 600;
    margin: 0;
  }
  .pdf-author-aka {
    font-style: italic;
    color: #777;
    margin: 2mm 0 15mm;
  }
  .pdf-year {
    font-size: 11pt;
    color: #555;
    letter-spacing: 3px;
  }

  .pdf-copyright-page {
    font-size: 10pt;
    color: #444;
    line-height: 1.9;
  }

  .pdf-kalam-page {
    font-family: 'Kalam', cursive;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: 174mm;
    font-size: 14pt;
    line-height: 2;
    color: #2c2c2c;
    padding: 20mm 15mm;
  }

  .pdf-text-page {
    padding-top: 5mm;
  }
  .pdf-section-title {
    font-family: 'EB Garamond', serif;
    font-size: 22pt;
    text-align: center;
    margin: 0 0 12mm;
    color: #1a1a1a;
    font-weight: 600;
    letter-spacing: 1px;
  }
  .pdf-section-title::after {
    content: '';
    display: block;
    width: 30mm;
    height: 1px;
    background: #d4af37;
    margin: 6mm auto 0;
  }
  .pdf-text-page p {
    text-align: justify;
    text-indent: 0;
    margin: 0 0 5mm;
    orphans: 3;
    widows: 3;
  }

  .pdf-toc {
    list-style: none;
    padding: 0;
    font-size: 12pt;
  }
  .pdf-toc li {
    padding: 4mm 0;
    border-bottom: 1px dotted #c9b37e;
    font-family: 'EB Garamond', serif;
  }

  .pdf-chapter-page {
    padding-top: 10mm;
  }
  .pdf-chapter-num {
    text-align: center;
    letter-spacing: 5px;
    font-size: 10pt;
    color: #8b7355;
    margin-bottom: 6mm;
  }
  .pdf-chapter-title {
    font-family: 'EB Garamond', serif;
    font-size: 24pt;
    text-align: center;
    margin: 0 0 4mm;
    color: #1a1a1a;
    font-weight: 600;
    line-height: 1.3;
  }
  .pdf-chapter-year {
    text-align: center;
    font-style: italic;
    color: #777;
    font-size: 11pt;
    margin-bottom: 12mm;
  }
  .pdf-chapter-body p {
    text-align: justify;
    text-indent: 0;
    margin: 0 0 5mm;
    orphans: 3;
    widows: 3;
  }
  .pdf-chapter-body p:first-of-type::first-letter {
    font-family: 'EB Garamond', serif;
    font-size: 3em;
    float: left;
    line-height: 0.9;
    padding: 2mm 3mm 0 0;
    color: #d4af37;
    font-weight: 600;
  }

  .pdf-conclusion {
    text-align: center;
  }
  .pdf-conclusion p {
    text-align: center;
    font-size: 13pt;
    line-height: 2;
  }

  .pdf-about-grid {
    display: flex;
    gap: 8mm;
    align-items: flex-start;
  }
  .pdf-about-photo {
    flex-shrink: 0;
  }
  .pdf-photo-placeholder {
    width: 40mm;
    height: 50mm;
    background: #e8dcc0;
    border: 2px solid #d4af37;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30pt;
    color: #8b7355;
    border-radius: 2mm;
  }
  .pdf-about-info h3 {
    font-family: 'EB Garamond', serif;
    font-size: 16pt;
    margin: 0 0 2mm;
    color: #1a1a1a;
  }
  .pdf-about-aka {
    font-style: italic;
    color: #777;
    margin: 0 0 5mm;
    font-size: 11pt;
  }
  .pdf-about-info p {
    font-size: 10.5pt;
    line-height: 1.7;
    text-align: justify;
    margin-bottom: 4mm;
  }
  .pdf-about-details {
    list-style: none;
    padding: 0;
    font-size: 10pt;
    line-height: 1.9;
    margin: 4mm 0;
    color: #333;
  }
  .pdf-qr {
    margin-top: 5mm;
    display: flex;
    justify-content: flex-start;
  }
  .pdf-qr img, .pdf-qr canvas {
    width: 28mm !important;
    height: 28mm !important;
    border: 1px solid #d4af37;
    padding: 2mm;
    background: #fff;
  }

  .pdf-thankyou {
    font-size: 16pt;
  }

  .pdf-colophon {
    font-size: 11pt;
    line-height: 2;
    color: #555;
    letter-spacing: 1px;
  }
`;

/* ---------- LANGUAGE FILTER ---------- */
function getChapterData(lang) {
  const chapters = [];
  const chapterSections = document.querySelectorAll('section.chapter:not(.epilogue)');

  chapterSections.forEach((section, idx) => {
    const titleEn = section.querySelector('.chapter-title')?.getAttribute('data-en')
                 || section.querySelector('.chapter-title')?.textContent.trim();
    const titleHi = section.querySelector('.chapter-title')?.getAttribute('data-hi')
                 || titleEn;
    const year = section.querySelector('.chapter-year')?.textContent.trim() || '';

    const contentDiv = section.querySelector(`.chapter-content[data-lang-content="${lang}"]`)
                    || section.querySelector('.chapter-content');
    const paragraphs = contentDiv
      ? Array.from(contentDiv.querySelectorAll('p')).map(p => p.innerHTML.trim())
      : [];

    chapters.push({
      title: lang === 'hi' ? titleHi : titleEn,
      year,
      paragraphs
    });
  });

  return chapters;
}

function getEpilogueData(lang) {
  const ep = document.querySelector('section.epilogue');
  if (!ep) return { title: 'To Be Continued...', paragraphs: [] };

  const titleEn = ep.querySelector('.chapter-title')?.getAttribute('data-en') || 'To Be Continued...';
  const titleHi = ep.querySelector('.chapter-title')?.getAttribute('data-hi') || titleEn;

  const contentDiv = ep.querySelector(`.chapter-content[data-lang-content="${lang}"]`)
                  || ep.querySelector('.chapter-content');
  const paragraphs = contentDiv
    ? Array.from(contentDiv.querySelectorAll('p')).map(p => p.innerHTML.trim())
    : [];

  return {
    title: lang === 'hi' ? titleHi : titleEn,
    paragraphs
  };
}

/* ---------- FULL BOOK HTML BUILDER ---------- */
function buildFullBookHTML(lang) {
  const chapters = getChapterData(lang);
  const epilogue = getEpilogueData(lang);

  let html = '';
  html += buildCoverPage();
  html += buildTitlePage();
  html += buildCopyrightPage();
  html += buildDedicationPage();
  html += buildEpigraphPage();
  html += buildPrefacePage();
  html += buildAcknowledgementsPage();
  html += buildTOCPage(chapters);
  chapters.forEach((ch, i) => { html += buildChapterPage(ch, i); });
  html += buildEpiloguePage(epilogue);
  html += buildConclusionPage();
  html += buildAboutPage();
  html += buildThankYouPage();
  html += buildColophonPage();

  return html;
}

/* ---------- RENDER HIDDEN CONTAINER ---------- */
function createHiddenRenderContainer(html) {
  const old = document.getElementById('pdfRenderContainer');
  if (old) old.remove();

  const container = document.createElement('div');
  container.id = 'pdfRenderContainer';
  container.style.position = 'fixed';
  container.style.left = '-99999px';
  container.style.top = '0';
  container.style.width = '148mm';
  container.style.background = '#fff';
  container.innerHTML = `<style>${PDF_STYLES}</style>` + html;
  document.body.appendChild(container);

  return container;
}

/* ---------- PROGRESS BAR UI ---------- */
function showProgress(current, total) {
  let box = document.getElementById('pdfProgressBox');
  if (!box) {
    box = document.createElement('div');
    box.id = 'pdfProgressBox';
    box.innerHTML = `
      <div class="pdf-progress-inner">
        <p class="pdf-progress-title">📖 Generating your eBook...</p>
        <div class="pdf-progress-bar-wrap">
          <div class="pdf-progress-bar" id="pdfProgressBar"></div>
        </div>
        <p class="pdf-progress-text" id="pdfProgressText">Page ${current} / ${total}</p>
      </div>
    `;
    document.body.appendChild(box);

    if (!document.getElementById('pdfProgressStyles')) {
      const st = document.createElement('style');
      st.id = 'pdfProgressStyles';
      st.textContent = `
        #pdfProgressBox {
          position: fixed;
          inset: 0;
          background: rgba(13,13,26,0.85);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'EB Garamond', serif;
        }
        .pdf-progress-inner {
          background: #fdfaf3;
          padding: 30px 40px;
          border-radius: 8px;
          border: 2px solid #d4af37;
          text-align: center;
          min-width: 320px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.4);
        }
        .pdf-progress-title {
          color: #1a1a1a;
          font-size: 16pt;
          margin: 0 0 20px;
        }
        .pdf-progress-bar-wrap {
          width: 100%;
          height: 10px;
          background: #e8dcc0;
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: 14px;
        }
        .pdf-progress-bar {
          height: 100%;
          width: 0%;
          background: linear-gradient(90deg, #d4af37, #f4d97a);
          transition: width 0.3s ease;
        }
        .pdf-progress-text {
          color: #555;
          font-size: 11pt;
          margin: 0;
          font-style: italic;
        }
      `;
      document.head.appendChild(st);
    }
  }

  const bar = document.getElementById('pdfProgressBar');
  const txt = document.getElementById('pdfProgressText');
  const pct = Math.round((current / total) * 100);
  if (bar) bar.style.width = pct + '%';
  if (txt) txt.textContent = `Page ${current} / ${total}`;
}

function hideProgress() {
  const box = document.getElementById('pdfProgressBox');
  if (box) box.remove();
}

/* ---------- TOAST ---------- */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ---------- QR CODE GENERATION ---------- */
function generateQRCode(container) {
  const qrDiv = container.querySelector('#pdfQR');
  if (!qrDiv) return;
  qrDiv.innerHTML = '';
  if (typeof QRCode !== 'undefined') {
    new QRCode(qrDiv, {
      text: BOOK.websiteUrl,
      width: 110,
      height: 110,
      colorDark: '#0d0d1a',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
  } else {
    qrDiv.textContent = BOOK.website;
    qrDiv.style.fontSize = '8pt';
  }
}

/* ---------- MAIN PDF GENERATOR ---------- */
async function generatePDF(lang) {
  const langLabel = lang === 'hi' ? 'Hinglish' : 'English';

  try {
    closeDownloadModal();

    if (typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
      showToast('❌ PDF libraries load nahi hui. Page refresh karein.');
      return;
    }

    showProgress(1, 21);

    const html = buildFullBookHTML(lang);
    const container = createHiddenRenderContainer(html);

    await document.fonts.ready;
    await new Promise(r => setTimeout(r, 400));

    generateQRCode(container);
    await new Promise(r => setTimeout(r, 300));

    const pages = container.querySelectorAll('.pdf-page');
    const total = pages.length;

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5',
      compress: true
    });

    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < pages.length; i++) {
      showProgress(i + 1, total);
      await new Promise(r => setTimeout(r, 30));

      const canvas = await html2canvas(pages[i], {
        scale: 2,
        useCORS: true,
        backgroundColor: '#fdfaf3',
        logging: false,
        windowWidth: pages[i].scrollWidth,
        windowHeight: pages[i].scrollHeight
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      const imgW = pdfW;
      const imgH = (canvas.height * imgW) / canvas.width;

      if (i > 0) pdf.addPage();

      let finalW = imgW;
      let finalH = imgH;
      if (imgH > pdfH) {
        finalH = pdfH;
        finalW = (canvas.width * finalH) / canvas.height;
      }

      const x = (pdfW - finalW) / 2;
      const y = 0;
      pdf.addImage(imgData, 'JPEG', x, y, finalW, finalH, undefined, 'FAST');
    }

    const filename = `Suraj-Anand-Autobiography-${langLabel}.pdf`;
    pdf.save(filename);

    container.remove();
    hideProgress();
    showToast(`✅ ${langLabel} PDF downloaded!`);
  } catch (err) {
    console.error('PDF Error:', err);
    hideProgress();
    showToast('❌ PDF banane mein error aaya. Console check karein.');
  }
}

/* ---------- MODAL CONTROL ---------- */
function openDownloadModal() {
  const m = document.getElementById('downloadModal');
  if (m) m.classList.add('active');
}

function closeDownloadModal() {
  const m = document.getElementById('downloadModal');
  if (m) m.classList.remove('active');
}

/* ---------- EVENT LISTENERS ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const topBtn = document.getElementById('downloadBtn');
  const botBtn = document.getElementById('downloadBtnBottom');
  const enBtn = document.getElementById('modalDownloadEn');
  const hiBtn = document.getElementById('modalDownloadHi');
  const overlay = document.getElementById('downloadModal');

  if (topBtn) topBtn.addEventListener('click', openDownloadModal);
  if (botBtn) botBtn.addEventListener('click', openDownloadModal);
  if (enBtn) enBtn.addEventListener('click', () => generatePDF('en'));
  if (hiBtn) hiBtn.addEventListener('click', () => generatePDF('hi'));

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeDownloadModal();
    });
  }

  window.openDownloadModal = openDownloadModal;
  window.closeDownloadModal = closeDownloadModal;
  window.generatePDF = generatePDF;
});

/* ---------- LIBRARY LOADER (agar HTML mein CDN nahi hai) ---------- */
(function loadLibraries() {
  const libs = [
    { test: () => typeof html2canvas !== 'undefined',
      src: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js' },
    { test: () => typeof window.jspdf !== 'undefined',
      src: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js' },
    { test: () => typeof QRCode !== 'undefined',
      src: 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js' }
  ];

  libs.forEach(lib => {
    if (!lib.test()) {
      const s = document.createElement('script');
      s.src = lib.src;
      s.async = false;
      document.head.appendChild(s);
    }
  });
})();
