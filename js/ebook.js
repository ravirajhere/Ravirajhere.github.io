/* ==========================================================================
   RAVI RAJ SINGH — EBOOK GENERATOR v2
   Generates a print-quality PDF of "A Boy Who Never Thought"
   Companion: book.html · book.js · book.css
   Version: 2.0
   No wizard. No fluff. Honest content only.
   ========================================================================== */

// ============================================================
// CONFIGURATION
// ============================================================
const EBOOK_CONFIG = {
    author: 'Ravi Raj Singh',
    title: 'A Boy Who Never Thought',
    subtitle: 'Safar Se Safar Tak',
    birthYear: 2008,
    birthplace: 'Begusarai, Bihar',
    currentYear: new Date().getFullYear(),
    images: {
        cover: 'assets/images/bookcover.jpg',
        author: 'assets/images/casual.jpg',
        signature: 'assets/images/signature.jpg'
    },
    qr: {
        url: 'https://ravirajhere.github.io/author.html',
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

// ============================================================
// 1. PROGRESS PILL
// ============================================================
function showPdfProgress(percent, label) {
    const pill = document.getElementById('pdfProgressPill');
    const text = document.getElementById('pdfPillText');
    const pct  = document.getElementById('pdfPillPercent');
    const fill = document.getElementById('pdfPillFill');

    if (!pill) return;

    pill.classList.add('active');

    const p = Math.max(0, Math.min(100, Math.round(percent)));
    if (text && label) text.textContent = label;
    if (pct)  pct.textContent = p + '%';
    if (fill) fill.style.width = p + '%';
}

function hidePdfProgress() {
    const pill = document.getElementById('pdfProgressPill');
    if (pill) pill.classList.remove('active');

    setTimeout(function () {
        const pct  = document.getElementById('pdfPillPercent');
        const fill = document.getElementById('pdfPillFill');
        const text = document.getElementById('pdfPillText');
        if (pct)  pct.textContent = '0%';
        if (fill) fill.style.width = '0%';
        if (text) text.textContent = 'Generating PDF';
    }, 400);
}

window.showPdfProgress = showPdfProgress;
window.hidePdfProgress = hidePdfProgress;

// ============================================================
// 2. TOAST (minimal — falls back to console)
// ============================================================
function showToast(message, type) {
    if (typeof window.showToast === 'function' && window.showToast !== showToast) {
        // avoid recursion
    }
    // Simple: use native alert-free approach — console only
    try {
        if (type === 'error') console.error('[ebook]', message);
        else console.log('[ebook]', message);
    } catch (e) {}

    // Attempt to show a lightweight toast if container exists
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.style.cssText = [
            'position:fixed',
            'left:50%',
            'bottom:32px',
            'transform:translateX(-50%) translateY(16px)',
            'background:#1A1A1A',
            'color:#FAFAF7',
            'padding:12px 20px',
            'border-radius:4px',
            'font-family:Inter,system-ui,sans-serif',
            'font-size:13px',
            'letter-spacing:0.02em',
            'box-shadow:0 8px 24px rgba(0,0,0,0.18)',
            'opacity:0',
            'pointer-events:none',
            'transition:opacity .25s ease, transform .25s ease',
            'z-index:9999'
        ].join(';');
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(function () {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(16px)';
    }, 2800);
}

window.showToast = showToast;

// ============================================================
// 3. RESOURCE VALIDATOR
// ============================================================
class ResourceValidator {
    static validateImage(src) {
        return new Promise(function (resolve) {
            const img = new Image();
            img.onload  = function () { resolve(src); };
            img.onerror = function () {
                const canvas = document.createElement('canvas');
                canvas.width  = 400;
                canvas.height = 400;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#f0f0f0';
                ctx.fillRect(0, 0, 400, 400);
                ctx.fillStyle = '#999';
                ctx.font = '60px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('📷', 200, 200);
                ctx.fillStyle = '#666';
                ctx.font = '16px Arial';
                ctx.fillText('Image not found', 200, 280);
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.src = src;
        });
    }

    static async validateAll() {
        const results = {};
        const entries = Object.entries(EBOOK_CONFIG.images);
        for (let i = 0; i < entries.length; i++) {
            const key = entries[i][0];
            const src = entries[i][1];
            results[key] = await this.validateImage(src);
        }
        return results;
    }
}

// ============================================================
// 4. LIBRARY LOADER
// ============================================================
class LibraryLoader {
    static loadScript(src, retries) {
        retries = retries || 3;
        return new Promise(function (resolve, reject) {
            (function attempt(n) {
                const script = document.createElement('script');
                script.src = src;
                script.onload  = function () { resolve(true); };
                script.onerror = function () {
                    if (n >= retries) reject(new Error('Failed to load ' + src));
                    else setTimeout(function () { attempt(n + 1); }, 800 * n);
                };
                document.head.appendChild(script);
            })(1);
        });
    }

    static async loadAll() {
        const libs = [
            { test: function () { return typeof html2canvas !== 'undefined'; },
              src: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js' },
            { test: function () { return typeof window.jspdf !== 'undefined' || typeof jspdf !== 'undefined'; },
              src: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js' },
            { test: function () { return typeof QRCode !== 'undefined'; },
              src: 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js' }
        ];

        for (let i = 0; i < libs.length; i++) {
            if (!libs[i].test()) {
                await this.loadScript(libs[i].src, 3);
            }
        }
        return true;
    }
}

// ============================================================
// 5. QR GENERATOR
// ============================================================
class QRGenerator {
    static generate(data, size) {
        size = size || 120;
        return new Promise(function (resolve) {
            try {
                const container = document.createElement('div');
                container.style.cssText = [
                    'width:' + size + 'px',
                    'height:' + size + 'px',
                    'position:absolute',
                    'left:-9999px',
                    'top:-9999px'
                ].join(';');
                document.body.appendChild(container);

                new QRCode(container, {
                    text: data,
                    width: size,
                    height: size,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.H
                });

                let attempts = 0;
                const check = setInterval(function () {
                    attempts++;
                    const canvas = container.querySelector('canvas');
                    if (canvas) {
                        clearInterval(check);
                        const dataUrl = canvas.toDataURL('image/png');
                        document.body.removeChild(container);
                        resolve(dataUrl);
                    } else if (attempts >= 12) {
                        clearInterval(check);
                        if (container.parentNode) document.body.removeChild(container);
                        resolve(null);
                    }
                }, 100);
            } catch (e) {
                resolve(null);
            }
        });
    }
}

// ============================================================
// 6. STYLE HELPERS (for PDF page content)
// ============================================================
const PDF_STYLES = {
    serifHead:   "'Playfair Display', 'Georgia', 'Times New Roman', serif",
    serifBody:   "'Lora', 'Georgia', 'Times New Roman', serif",
    gold:        '#8B6F3F',
    ink:         '#1A1A1A',
    soft:        '#4A423C',
    muted:       '#7A7068',
    line:        '#E5DED2'
};

function makePage() {
    const div = document.createElement('div');
    div.style.cssText = [
        'padding:60px 50px',
        'background:#ffffff',
        'display:flex',
        'flex-direction:column',
        'justify-content:center',
        'min-height:100%',
        'box-sizing:border-box',
        'font-family:' + PDF_STYLES.serifBody
    ].join(';');
    return div;
}

function makeHeading(text) {
    return '<h2 style="font-family:' + PDF_STYLES.serifHead + ';' +
        'font-size:26px;' +
        'font-weight:700;' +
        'color:#000000;' +
        'letter-spacing:2px;' +
        'text-align:center;' +
        'margin:0 0 24px 0;">' + text + '</h2>';
}

function makeGoldRule(center) {
    return '<div style="width:50px;height:1px;background:' + PDF_STYLES.gold + ';' +
        'margin:0 ' + (center ? 'auto' : '0') + ' 24px ' + (center ? 'auto' : '0') + ';"></div>';
}

function makeBodyParagraph(text) {
    return '<p style="font-family:' + PDF_STYLES.serifBody + ';' +
        'font-size:13px;' +
        'line-height:1.75;' +
        'color:' + PDF_STYLES.ink + ';' +
        'text-align:justify;' +
        'margin:0 0 14px 0;">' + text + '</p>';
}

function makeSignature(author) {
    return '<div style="width:50px;height:1px;background:' + PDF_STYLES.gold + ';margin:24px 0;"></div>' +
        '<p style="font-family:' + PDF_STYLES.serifHead + ';font-size:15px;color:' + PDF_STYLES.gold + ';margin:0;">— ' + author + '</p>';
}

// ============================================================
// 7. MAIN EBOOK GENERATOR
// ============================================================
class EbookGenerator {
    constructor() {
        this.pdf = null;
        this.pages = [];
        this.currentPage = 0;
        this.totalPages = 0;
        this.isGenerating = false;
        this.cancelled = false;
        this.resources = null;
    }

    async generate(lang, langLabel) {
        if (this.isGenerating) return;

        this.isGenerating = true;
        this.cancelled = false;
        this.currentPage = 0;

        const report = (percent, msg) => {
            showPdfProgress(percent, msg || 'Generating PDF');
        };

        report(0, 'Preparing…');

        try {
            this.resources = await ResourceValidator.validateAll();
            await LibraryLoader.loadAll();

            report(10, 'Building pages…');

            const content = this.getContent(lang);
            if (!content) throw new Error('Content not found. Is book.html open?');

            this.pages = await this.buildPages(content);
            this.totalPages = this.pages.length;

            report(45, 'Rendering PDF…');

            await this.generatePDF(langLabel, report);

            report(100, 'Saving…');

            const filename = 'A_Boy_Who_Never_Thought_' + langLabel + '.pdf';
            this.pdf.save(filename);

            showToast(langLabel + ' edition downloaded.');
        } catch (error) {
            console.error('Ebook generation failed:', error);
            showToast('Failed: ' + error.message, 'error');
            throw error;
        } finally {
            this.isGenerating = false;
            setTimeout(hidePdfProgress, 800);
            this.cleanup();
        }
    }

    // --------------------------------------------------------
    // getContent — clones .reading-main, picks language, unhides all chapters
    // --------------------------------------------------------
    getContent(lang) {
        const wrapper = document.querySelector('.reading-main');
        if (!wrapper) return null;

        const clone = wrapper.cloneNode(true);

        const currentId = lang === 'hi' ? 'chaptersHi' : 'chaptersEn';
        const otherId   = lang === 'hi' ? 'chaptersEn' : 'chaptersHi';

        const current = clone.querySelector('#' + currentId);
        const other   = clone.querySelector('#' + otherId);

        if (other) other.remove();
        if (!current) return null;

        current.hidden = false;

        const chapters = Array.prototype.slice.call(
            current.querySelectorAll('article.chapter')
        );

        chapters.forEach(function (ch) {
            ch.hidden = false;
            ch.style.display = 'block';
        });

        return {
            wrapper: clone,
            chapters: chapters
        };
    }

    // --------------------------------------------------------
    // buildPages — sequence of 22 pages
    // --------------------------------------------------------
    async buildPages(content) {
        const pages = [];
        const images = this.resources;
        const qrDataUrl = await QRGenerator.generate(
            EBOOK_CONFIG.qr.url,
            EBOOK_CONFIG.qr.size
        );

        const add = (fn) => pages.push(fn());

        // ---- FRONT MATTER ----
        add(() => this.pageCover(images.cover));
        add(() => this.pageTitle());
        add(() => this.pageCopyright());
        add(() => this.pageDedication());
        add(() => this.pageAuthorsNote());
        add(() => this.pageTOC(content.chapters));
        add(() => this.pageHowToRead());

        // ---- CHAPTERS ----
        content.chapters.forEach((ch, i) => {
            add(() => this.pageChapter(ch, i));
        });

        // ---- BACK MATTER ----
        add(() => this.pageStoryBehind());
        add(() => this.pageAboutAuthor(images.author, qrDataUrl));
        add(() => this.pageColophon());
        add(() => this.pageBlank());

        return pages;
    }

    // ========================================================
    // PAGE BUILDERS
    // ========================================================

    pageCover(coverImage) {
        const div = document.createElement('div');
        div.style.cssText = 'padding:0;margin:0;background:#ffffff;width:100%;height:100%;display:flex;align-items:center;justify-content:center;';
        div.innerHTML = '<img src="' + coverImage + '" alt="Book Cover" style="width:100%;height:100%;object-fit:contain;">';
        return div;
    }

    pageTitle() {
        const div = makePage();
        div.style.textAlign = 'center';
        div.innerHTML =
            '<div style="max-width:520px;margin:0 auto;width:100%;">' +
                '<div style="width:60px;height:1px;background:' + PDF_STYLES.gold + ';margin:0 auto 32px auto;"></div>' +
                '<p style="font-family:' + PDF_STYLES.serifBody + ';font-size:11px;letter-spacing:3px;text-transform:uppercase;color:' + PDF_STYLES.muted + ';margin:0 0 12px 0;">A Book by</p>' +
                '<h1 style="font-family:' + PDF_STYLES.serifHead + ';font-size:34px;font-weight:700;color:#000000;letter-spacing:1px;line-height:1.2;margin:0 0 16px 0;">' + EBOOK_CONFIG.title + '</h1>' +
                '<p style="font-family:' + PDF_STYLES.serifBody + ';font-size:16px;font-style:italic;color:' + PDF_STYLES.soft + ';margin:0 0 6px 0;">' + EBOOK_CONFIG.subtitle + '</p>' +
                '<p style="font-family:' + PDF_STYLES.serifBody + ';font-size:14px;color:' + PDF_STYLES.muted + ';margin:0 0 32px 0;">गुंजते सन्नाटे</p>' +
                '<div style="width:60px;height:1px;background:' + PDF_STYLES.gold + ';margin:0 auto 24px auto;"></div>' +
                '<p style="font-family:' + PDF_STYLES.serifHead + ';font-size:20px;font-weight:600;color:#000000;letter-spacing:1px;margin:0 0 6px 0;">' + EBOOK_CONFIG.author + '</p>' +
                '<p style="font-family:' + PDF_STYLES.serifBody + ';font-size:12px;color:' + PDF_STYLES.muted + ';letter-spacing:2px;text-transform:uppercase;margin:0;">Patna, India · ' + EBOOK_CONFIG.currentYear + '</p>' +
            '</div>';
        return div;
    }

    pageCopyright() {
        const div = makePage();
        div.innerHTML =
            '<div style="max-width:440px;margin:0 auto;width:100%;">' +
                '<p style="font-family:' + PDF_STYLES.serifHead + ';font-size:12px;letter-spacing:3px;text-transform:uppercase;color:' + PDF_STYLES.muted + ';margin:0 0 20px 0;">Copyright</p>' +
                makeBodyParagraph('© 2024 ' + EBOOK_CONFIG.author + '. All rights reserved.') +
                makeBodyParagraph('No part of this book may be reproduced or transmitted in any form without prior written permission from the author.') +
                makeBodyParagraph('This book is not for sale. For personal reading only.') +
                makeBodyParagraph('First written in 2024. Ongoing.') +
                '<div style="width:50px;height:1px;background:' + PDF_STYLES.gold + ';margin:24px 0;"></div>' +
                '<p style="font-family:' + PDF_STYLES.serifBody + ';font-size:12px;color:' + PDF_STYLES.muted + ';margin:0;">' + EBOOK_CONFIG.author + '<br>Patna, India</p>' +
            '</div>';
        return div;
    }

    pageDedication() {
        const div = makePage();
        div.style.textAlign = 'center';
        div.innerHTML =
            '<div style="max-width:480px;margin:0 auto;width:100%;">' +
                '<p style="font-family:' + PDF_STYLES.serifBody + ';font-size:16px;font-style:italic;color:' + PDF_STYLES.soft + ';line-height:2;margin:0 0 6px 0;">To my parents, who gave me the courage to dream.</p>' +
                '<p style="font-family:' + PDF_STYLES.serifBody + ';font-size:16px;font-style:italic;color:' + PDF_STYLES.soft + ';line-height:2;margin:0 0 6px 0;">To my sisters, who taught me patience.</p>' +
                '<p style="font-family:' + PDF_STYLES.serifBody + ';font-size:16px;font-style:italic;color:' + PDF_STYLES.soft + ';line-height:2;margin:0;">To the friends who stayed.</p>' +
                '<div style="width:50px;height:1px;background:' + PDF_STYLES.gold + ';margin:32px auto 16px auto;"></div>' +
                '<p style="font-family:' + PDF_STYLES.serifHead + ';font-size:15px;color:' + PDF_STYLES.gold + ';margin:0;">— ' + EBOOK_CONFIG.author + '</p>' +
            '</div>';
        return div;
    }

    pageAuthorsNote() {
        const div = makePage();
        div.innerHTML =
            '<div style="max-width:520px;margin:0 auto;width:100%;">' +
                makeHeading("Author's Note") +
                makeBodyParagraph('This book is not fiction. Every name, every date, every memory is real. I wrote it for my parents, my sisters, and for the boy I used to be.') +
                makeBodyParagraph('Some memories are painful. Some are joyful. All of them are mine.') +
                makeBodyParagraph('I have tried to be honest. I have tried to remember things exactly as they happened — though memory, like everything, fades with time.') +
                makeBodyParagraph('If you find yourself in these pages, know that you mattered. You still do.') +
                makeSignature(EBOOK_CONFIG.author) +
            '</div>';
        return div;
    }

    pageTOC(chapters) {
        const div = makePage();
        let rows = '';

        chapters.forEach(function (ch, i) {
            const numEl   = ch.querySelector('.chapter-num');
            const titleEl = ch.querySelector('.chapter-title');
            const yearEl  = ch.querySelector('.chapter-year');

            const title = titleEl ? titleEl.textContent.trim() : 'Chapter ' + (i + 1);
            const year  = yearEl ? yearEl.textContent.trim() : '';

            const label = (i === 10) ? 'Epilogue' : ('Chapter ' + (i + 1));

            rows +=
                '<div style="display:flex;justify-content:space-between;gap:16px;padding:10px 0;border-bottom:1px solid #f0f0f0;">' +
                    '<div style="flex:1;min-width:0;">' +
                        '<span style="font-family:' + PDF_STYLES.serifBody + ';font-size:11px;letter-spacing:2px;text-transform:uppercase;color:' + PDF_STYLES.muted + ';margin-right:10px;">' + label + '</span>' +
                        '<span style="font-family:' + PDF_STYLES.serifBody + ';font-size:14px;color:' + PDF_STYLES.ink + ';">' + title + '</span>' +
                    '</div>' +
                    '<div style="font-family:' + PDF_STYLES.serifBody + ';font-size:12px;color:' + PDF_STYLES.muted + ';white-space:nowrap;">' + year + '</div>' +
                '</div>';
        });

        div.innerHTML =
            '<div style="max-width:520px;margin:0 auto;width:100%;">' +
                makeHeading('Table of Contents') +
                rows +
            '</div>';
        return div;
    }

    pageHowToRead() {
        const div = makePage();
        div.innerHTML =
            '<div style="max-width:520px;margin:0 auto;width:100%;">' +
                makeHeading('How to Read This Book') +
                makeBodyParagraph('This is a memoir — a true story of a boy growing up in Begusarai, Bihar. It covers the years 2008 to 2019, across eleven chapters.') +
                makeBodyParagraph('You can read it in order, or begin anywhere. Each chapter is a self-contained memory. The Hinglish edition is available alongside the English.') +
                '<div style="width:50px;height:1px;background:' + PDF_STYLES.gold + ';margin:24px auto 20px auto;"></div>' +
                '<p style="font-family:' + PDF_STYLES.serifHead + ';font-style:italic;font-size:14px;color:' + PDF_STYLES.gold + ';text-align:center;line-height:1.7;margin:0;">Begin anywhere. Read slowly.<br>This story belongs to you now.</p>' +
            '</div>';
        return div;
    }

    pageChapter(chapterEl, index) {
        const div = document.createElement('div');
        div.style.cssText = [
            'padding:50px 55px 60px 55px',
            'background:#ffffff',
            'display:flex',
            'flex-direction:column',
            'min-height:100%',
            'box-sizing:border-box',
            'position:relative',
            'font-family:' + PDF_STYLES.serifBody
        ].join(';');

        const clone = chapterEl.cloneNode(true);

        // Remove navigation & UI elements not needed in PDF
        clone.querySelectorAll('.chapter-nav, .menu-btn, .back-link, .lang-switch').forEach(function (el) {
            el.remove();
        });

        // Extract head info
        const numEl   = clone.querySelector('.chapter-num');
        const titleEl = clone.querySelector('.chapter-title');
        const yearEl  = clone.querySelector('.chapter-year');

        const numText   = numEl ? numEl.textContent.trim() : 'Chapter ' + (index + 1);
        const titleText = titleEl ? titleEl.textContent.trim() : '';
        const yearText  = yearEl ? yearEl.textContent.trim() : '';

        // Remove head + rule from body clone
        const head = clone.querySelector('.chapter-head');
        if (head) head.remove();

        const rule = clone.querySelector('.chapter-rule');
        if (rule) rule.remove();

        // Extract body
        const bodyEl = clone.querySelector('.chapter-body') || clone;

        // Force clean typography for PDF
        bodyEl.querySelectorAll('p').forEach(function (el) {
            el.style.color = PDF_STYLES.ink;
            el.style.fontFamily = PDF_STYLES.serifBody;
            el.style.fontSize = '12.5px';
            el.style.lineHeight = '1.7';
            el.style.textAlign = 'justify';
            el.style.marginBottom = '10px';
            el.style.letterSpacing = '0.2px';
            el.style.background = 'transparent';
        });

        bodyEl.querySelectorAll('strong').forEach(function (el) {
            el.style.color = '#000000';
            el.style.fontWeight = '700';
        });

        bodyEl.querySelectorAll('em').forEach(function (el) {
            el.style.color = PDF_STYLES.soft;
            el.style.fontStyle = 'italic';
        });

        bodyEl.querySelectorAll('.pull-quote').forEach(function (el) {
            el.style.borderLeft = '3px solid ' + PDF_STYLES.gold;
            el.style.paddingLeft = '16px';
            el.style.margin = '16px 0';
            el.style.background = 'transparent';
            const p = el.querySelector('p');
            if (p) {
                p.style.fontFamily = PDF_STYLES.serifHead;
                p.style.fontSize = '14px';
                p.style.fontStyle = 'italic';
                p.style.color = PDF_STYLES.ink;
                p.style.lineHeight = '1.5';
                p.style.textAlign = 'left';
                p.style.margin = '0 0 6px 0';
            }
            const f = el.querySelector('footer');
            if (f) {
                f.style.fontFamily = PDF_STYLES.serifBody;
                f.style.fontSize = '10px';
                f.style.fontStyle = 'normal';
                f.style.color = PDF_STYLES.gold;
                f.style.letterSpacing = '1.5px';
                f.style.textTransform = 'uppercase';
                f.style.margin = '0';
            }
        });

        bodyEl.querySelectorAll('.chapter-photo').forEach(function (el) {
            el.style.margin = '20px auto';
            el.style.textAlign = 'center';
            el.style.maxWidth = '380px';
            const img = el.querySelector('img');
            if (img) {
                img.style.width = '100%';
                img.style.height = 'auto';
                img.style.borderRadius = '4px';
                img.style.border = '1px solid #E5DED2';
            }
            const cap = el.querySelector('figcaption');
            if (cap) {
                cap.style.fontFamily = PDF_STYLES.serifBody;
                cap.style.fontSize = '10px';
                cap.style.color = PDF_STYLES.muted;
                cap.style.letterSpacing = '1px';
                cap.style.textTransform = 'uppercase';
                cap.style.marginTop = '8px';
                cap.style.textAlign = 'center';
            }
        });

        // Footnotes — convert to inline superscript-ish
        bodyEl.querySelectorAll('.footnote').forEach(function (el) {
            el.style.color = PDF_STYLES.gold;
            el.style.borderBottom = 'none';
            el.style.cursor = 'auto';
        });

        // Chapter header
        const displayNum = (index === 10) ? '—' : String(index + 1);

        const headerHTML =
            '<div style="margin-bottom:24px;">' +
                '<div style="display:flex;align-items:center;gap:18px;margin-bottom:14px;">' +
                    '<div style="flex-shrink:0;width:64px;height:64px;border-radius:50%;background:#F4F1EA;display:flex;align-items:center;justify-content:center;">' +
                        '<span style="font-family:' + PDF_STYLES.serifHead + ';font-size:30px;font-weight:700;color:#000000;line-height:1;">' + displayNum + '</span>' +
                    '</div>' +
                    '<div style="flex:1;">' +
                        '<p style="font-family:' + PDF_STYLES.serifBody + ';font-size:11px;letter-spacing:3px;text-transform:uppercase;color:' + PDF_STYLES.muted + ';margin:0 0 4px 0;">' + numText + '</p>' +
                        '<h2 style="font-family:' + PDF_STYLES.serifHead + ';font-size:22px;font-weight:700;color:#000000;line-height:1.25;letter-spacing:0.3px;margin:0;">' + titleText + '</h2>' +
                        (yearText ? '<p style="font-family:' + PDF_STYLES.serifBody + ';font-style:italic;font-size:12px;color:' + PDF_STYLES.muted + ';margin:4px 0 0 0;">' + yearText + '</p>' : '') +
                    '</div>' +
                '</div>' +
                '<div style="width:100%;height:1px;background:#E5DED2;"></div>' +
            '</div>';

        const headerWrap = document.createElement('div');
        headerWrap.innerHTML = headerHTML;

        const bodyWrap = document.createElement('div');
        while (bodyEl.firstChild) bodyWrap.appendChild(bodyEl.firstChild);

        const pageNum = document.createElement('div');
        pageNum.style.cssText = 'position:absolute;bottom:22px;left:0;right:0;text-align:center;font-family:' + PDF_STYLES.serifHead + ';font-size:10px;color:#B0AAA2;letter-spacing:3px;';
        pageNum.textContent = String(index + 1);

        div.appendChild(headerWrap);
        div.appendChild(bodyWrap);
        div.appendChild(pageNum);

        return div;
    }

    pageStoryBehind() {
        const div = makePage();
        div.innerHTML =
            '<div style="max-width:520px;margin:0 auto;width:100%;">' +
                makeHeading('The Story Behind the Story') +
                makeBodyParagraph("I didn't plan to write a book. I started writing — one memory at a time. One evening. One cup of chai.") +
                makeBodyParagraph('It began as a diary. Then it became a way to understand myself.') +
                makeBodyParagraph('I wrote about my childhood because I wanted to remember it. I wrote about my struggles because I wanted to survive them. And I wrote about my dreams because I still believe in them.') +
                makeBodyParagraph('This book is not the end. It is the beginning of a longer conversation — with myself, and with you.') +
                makeSignature(EBOOK_CONFIG.author) +
            '</div>';
        return div;
    }

    pageAboutAuthor(authorImage, qrDataUrl) {
        const div = makePage();
        div.style.textAlign = 'center';

        const qrHTML = qrDataUrl ? (
            '<div style="margin:20px auto 0 auto;">' +
                '<img src="' + qrDataUrl + '" alt="QR Code" style="width:110px;height:110px;display:block;margin:0 auto;border:2px solid ' + PDF_STYLES.gold + ';border-radius:6px;padding:6px;background:#ffffff;">' +
                '<p style="font-family:' + PDF_STYLES.serifBody + ';font-size:10px;color:' + PDF_STYLES.muted + ';margin-top:8px;letter-spacing:1px;text-transform:uppercase;">Scan to visit</p>' +
            '</div>'
        ) : '';

        div.innerHTML =
            '<div style="max-width:520px;margin:0 auto;width:100%;">' +
                makeHeading('About the Author') +
                '<div style="width:110px;height:110px;border-radius:50%;border:2px solid ' + PDF_STYLES.gold + ';margin:0 auto 18px;overflow:hidden;">' +
                    '<img src="' + authorImage + '" alt="' + EBOOK_CONFIG.author + '" style="width:100%;height:100%;object-fit:cover;">' +
                '</div>' +
                '<p style="font-family:' + PDF_STYLES.serifHead + ';font-size:20px;font-weight:700;color:#000000;margin:0 0 4px 0;">' + EBOOK_CONFIG.author + '</p>' +
                '<p style="font-family:' + PDF_STYLES.serifBody + ';font-size:11px;color:' + PDF_STYLES.gold + ';letter-spacing:3px;text-transform:uppercase;margin:0 0 24px 0;">Author</p>' +
                '<div style="text-align:left;">' +
                    makeBodyParagraph('Ravi Raj Singh is a writer based in Patna, India. He has kept a personal diary since childhood, and began writing online around 2023–24.') +
                    makeBodyParagraph('<em>"A Boy Who Never Thought"</em> is his first book. It grew out of that habit. The book is written in both English and Hinglish, and remains in progress.') +
                    makeBodyParagraph('His writing focuses on ordinary lives, small moments, and the quiet ways a person grows.') +
                '</div>' +
                '<div style="width:50px;height:1px;background:' + PDF_STYLES.gold + ';margin:24px auto;"></div>' +
                qrHTML +
            '</div>';
        return div;
    }

    pageColophon() {
        const div = makePage();
        div.style.textAlign = 'center';
        div.innerHTML =
            '<div style="max-width:440px;margin:0 auto;width:100%;">' +
                '<div style="width:50px;height:1px;background:' + PDF_STYLES.gold + ';margin:0 auto 30px auto;"></div>' +
                '<p style="font-family:' + PDF_STYLES.serifBody + ';font-size:13px;color:' + PDF_STYLES.soft + ';line-height:2;margin:0;">Written in Patna, India</p>' +
                '<p style="font-family:' + PDF_STYLES.serifBody + ';font-size:13px;color:' + PDF_STYLES.soft + ';line-height:2;margin:0 0 20px 0;">' + EBOOK_CONFIG.currentYear + '</p>' +
                '<div style="width:50px;height:1px;background:' + PDF_STYLES.gold + ';margin:0 auto 20px auto;"></div>' +
                '<p style="font-family:' + PDF_STYLES.serifBody + ';font-size:11px;color:' + PDF_STYLES.muted + ';line-height:1.9;margin:0;">Set in Playfair Display &amp; Lora</p>' +
                '<p style="font-family:' + PDF_STYLES.serifBody + ';font-size:11px;color:' + PDF_STYLES.muted + ';line-height:1.9;margin:0;">Typeset by hand</p>' +
                '<p style="font-family:' + PDF_STYLES.serifBody + ';font-size:11px;color:' + PDF_STYLES.muted + ';line-height:1.9;margin:0;">No frameworks</p>' +
            '</div>';
        return div;
    }

    pageBlank() {
        const div = makePage();
        div.style.textAlign = 'center';
        div.innerHTML =
            '<p style="font-family:' + PDF_STYLES.serifBody + ';font-size:11px;color:#C0BAB1;font-style:italic;letter-spacing:2px;margin:0;">This page is intentionally left blank.</p>';
        return div;
    }

    // ========================================================
    // PDF RENDERING
    // ========================================================
    async generatePDF(langLabel, report) {
        const jsPDFCtor = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
        if (!jsPDFCtor) throw new Error('jsPDF not available');

        const config = EBOOK_CONFIG.pdf;

        this.pdf = new jsPDFCtor({
            unit: 'mm',
            format: config.format,
            orientation: 'portrait',
            compress: true
        });

        this.pdf.setProperties({
            title: EBOOK_CONFIG.title,
            author: EBOOK_CONFIG.author,
            subject: 'Autobiography',
            keywords: 'autobiography, memoir, Bihar, India',
            creator: EBOOK_CONFIG.author
        });

        const pageWidth  = 210;
        const pageHeight = 297;
        const margin = config.margin;
        const contentWidth  = pageWidth  - (margin * 2);
        const contentHeight = pageHeight - (margin * 2);

        let isFirstPage = true;
        const batchSize = config.batchSize || 3;

        for (let i = 0; i < this.pages.length; i += batchSize) {
            if (this.cancelled) break;

            const batch = this.pages.slice(i, i + batchSize);
            const results = await Promise.all(
                batch.map((page) => this.renderPage(page, contentWidth, contentHeight))
            );

            results.forEach((dataUrl) => {
                if (!dataUrl) return;
                if (!isFirstPage) this.pdf.addPage();
                isFirstPage = false;
                this.pdf.addImage(dataUrl, 'JPEG', margin, margin, contentWidth, contentHeight, undefined, 'FAST');
            });

            const pct = Math.min(100, Math.round(((i + batch.length) / this.pages.length) * 100));
            const visual = Math.max(45, 45 + Math.round((pct / 100) * 55));
            report(visual, 'Rendering PDF…');

            await new Promise((r) => setTimeout(r, 40));
        }
    }

    async renderPage(element, width, height) {
        try {
            const container = document.createElement('div');
            container.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:' + width + 'mm;background:#ffffff;padding:0;margin:0;';

            const clone = element.cloneNode(true);
            clone.style.width = '100%';
            clone.style.height = '100%';
            clone.style.background = '#ffffff';
            container.appendChild(clone);
            document.body.appendChild(container);

            await new Promise((r) => setTimeout(r, 60));

            const canvas = await html2canvas(container, {
                scale: EBOOK_CONFIG.pdf.scale,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false
            });

            if (container.parentNode) container.parentNode.removeChild(container);

            if (canvas) return canvas.toDataURL('image/jpeg', EBOOK_CONFIG.pdf.quality);
            return null;
        } catch (error) {
            console.error('Page render failed:', error);
            return null;
        }
    }

    cleanup() {
        document.querySelectorAll('div[style*="left: -9999px"], div[style*="left:-9999px"]').forEach(function (el) {
            if (el.parentNode) el.parentNode.removeChild(el);
        });
        this.pages = [];
        this.pdf = null;
    }

    cancel() {
        this.cancelled = true;
        this.isGenerating = false;
        hidePdfProgress();
        this.cleanup();
    }
}

// ============================================================
// 8. PUBLIC API
// ============================================================
const ebookGenerator = new EbookGenerator();

window.downloadEnglishEbook = async function () {
    await ebookGenerator.generate('en', 'English');
};

window.downloadHinglishEbook = async function () {
    await ebookGenerator.generate('hi', 'Hinglish');
};

window.cancelEbookGeneration = function () {
    ebookGenerator.cancel();
};

// ============================================================
// 9. KEYBOARD SHORTCUT
// ============================================================
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && ebookGenerator && ebookGenerator.isGenerating) {
        ebookGenerator.cancel();
    }
});

// ============================================================
// 10. PROGRESS PILL — inject if missing
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('pdfProgressPill')) {
        const pill = document.createElement('div');
        pill.id = 'pdfProgressPill';
        pill.style.cssText = [
            'position:fixed',
            'bottom:24px',
            'right:24px',
            'background:#1A1A1A',
            'color:#FAFAF7',
            'padding:14px 18px',
            'border-radius:6px',
            'min-width:220px',
            'font-family:Inter,system-ui,sans-serif',
            'font-size:12px',
            'letter-spacing:0.02em',
            'box-shadow:0 8px 24px rgba(0,0,0,0.2)',
            'opacity:0',
            'transform:translateY(12px)',
            'transition:opacity .3s ease, transform .3s ease',
            'z-index:9998',
            'pointer-events:none'
        ].join(';');
        pill.innerHTML =
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
                '<span id="pdfPillText" style="font-weight:500;">Generating PDF</span>' +
                '<span id="pdfPillPercent" style="color:#8B6F3F;font-weight:600;">0%</span>' +
            '</div>' +
            '<div style="width:100%;height:2px;background:rgba(255,255,255,0.15);border-radius:2px;overflow:hidden;">' +
                '<div id="pdfPillFill" style="width:0%;height:100%;background:#8B6F3F;transition:width .25s ease;"></div>' +
            '</div>';
        document.body.appendChild(pill);

        // Ensure 'active' class toggles visibility
        const style = document.createElement('style');
        style.textContent = '#pdfProgressPill.active{opacity:1 !important;transform:translateY(0) !important;}';
        document.head.appendChild(style);
    }
});

// ============================================================
console.log('✅ ebook.js v2 loaded — honest content, 22 pages');
