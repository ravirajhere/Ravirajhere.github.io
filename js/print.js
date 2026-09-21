/* ==========================================================================
   RAVI RAJ SINGH — PRINT SCRIPT
   For: print.html · used by api/pdf.js for server-side book PDF
   Handles: Chapter import from book.html · TOC generation · Page numbers
   ========================================================================== */

(function () {
    'use strict';

    // ============================================================
    // 1. CONFIG
    // ============================================================
    const LANG = (function () {
        const params = new URLSearchParams(window.location.search);
        const l = params.get('lang') || 'en';
        return l === 'hi' ? 'hi' : 'en';
    })();

    const CHAPTERS_SOURCE = '/book.html';
    const CHAPTERS_ID = LANG === 'hi' ? 'chaptersHi' : 'chaptersEn';

    // Front matter pages that come BEFORE chapters
    // page-cover, page-half-title, page-frontispiece, page-title,
    // page-copyright, page-dedication, page-note, page-toc, page-how-to-read
    // = 9 pages. Chapters start at page 10.
    const FIRST_CHAPTER_PAGE = 10;

    // ============================================================
    // 2. HELPERS
    // ============================================================
    const $ = (sel, ctx) => (ctx || document).querySelector(sel);
    const $$ = (sel, ctx) => Array.prototype.slice.call(
        (ctx || document).querySelectorAll(sel)
    );

    function log(...args) {
        try { console.log('[print]', ...args); } catch (e) {}
    }

    function warn(...args) {
        try { console.warn('[print]', ...args); } catch (e) {}
    }

    // ============================================================
    // 3. IMPORT CHAPTERS FROM book.html
    // ============================================================
    async function importChapters() {
        log('Fetching chapters from', CHAPTERS_SOURCE);

        const res = await fetch(CHAPTERS_SOURCE, { cache: 'no-store' });
        if (!res.ok) {
            throw new Error('Failed to fetch book.html: ' + res.status);
        }

        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        const container = doc.querySelector('#' + CHAPTERS_ID);
        if (!container) {
            throw new Error('Chapters container not found: #' + CHAPTERS_ID);
        }

        const chapters = Array.prototype.slice.call(
            container.querySelectorAll('article.chapter')
        );

        if (!chapters.length) {
            throw new Error('No chapters found in ' + CHAPTERS_ID);
        }

        log('Found', chapters.length, 'chapters');

        return chapters;
    }

    // ============================================================
    // 4. BUILD A CHAPTER PAGE
    // ============================================================
    function buildChapterPage(originalChapter, index) {
        const pageNumber = FIRST_CHAPTER_PAGE + index;
        const isLast = index === (getChapterCount() - 1);

        // Clone original chapter
        const clone = originalChapter.cloneNode(true);

        // Remove interactive nav and other UI elements
        clone.querySelectorAll(
            '.chapter-nav, .menu-btn, .back-link, .lang-switch, .chapter-rule'
        ).forEach(function (el) { el.remove(); });

        // Extract original metadata
        const numEl   = clone.querySelector('.chapter-num');
        const titleEl = clone.querySelector('.chapter-title');
        const yearEl  = clone.querySelector('.chapter-year');

        const numText   = numEl   ? numEl.textContent.trim()   : 'Chapter ' + (index + 1);
        const titleText = titleEl ? titleEl.textContent.trim() : '';
        const yearText  = yearEl  ? yearEl.textContent.trim()  : '';

        // Remove original head (we'll rebuild it)
        const head = clone.querySelector('.chapter-head');
        if (head) head.remove();

        // Build our own page wrapper
        const page = document.createElement('section');
        page.className = 'chapter';
        page.id = 'pdf-chapter-' + (index + 1);
        page.setAttribute('data-chapter-num', String(index + 1));

        // -------- Running header --------
        const runningHeader = document.createElement('div');
        runningHeader.className = 'chapter-running-header';
        runningHeader.innerHTML =
            '<span>Ravi Raj Singh</span>' +
            '<span>' + escapeHtml(titleText) + '</span>';
        page.appendChild(runningHeader);

        // -------- Chapter header block --------
        const headerBlock = document.createElement('div');
        headerBlock.className = 'chapter-header';

        const displayNum = (index === 10) ? '—' : String(index + 1);

        headerBlock.innerHTML =
            '<div class="chapter-number-circle">' +
                '<span>' + displayNum + '</span>' +
            '</div>' +
            '<div class="chapter-header-text">' +
                '<p class="chapter-number">' + escapeHtml(numText) + '</p>' +
                '<h2 class="chapter-title">' + escapeHtml(titleText) + '</h2>' +
                (yearText
                    ? '<p class="chapter-year">' + escapeHtml(yearText) + '</p>'
                    : '') +
            '</div>';

        page.appendChild(headerBlock);

        // -------- Chapter body --------
        const bodyEl = clone.querySelector('.chapter-body');
        if (bodyEl) {
            const bodyWrapper = document.createElement('div');
            bodyWrapper.className = 'chapter-body';
            while (bodyEl.firstChild) {
                bodyWrapper.appendChild(bodyEl.firstChild);
            }
            page.appendChild(bodyWrapper);
        }

        // -------- Page number --------
        const pageNum = document.createElement('div');
        pageNum.className = 'chapter-page-number';
        pageNum.textContent = String(pageNumber);
        page.appendChild(pageNum);

        // -------- Mark last --------
        if (isLast) {
            page.classList.add('chapter-last');
        }

        return page;
    }

    // ============================================================
    // 5. HELPERS
    // ============================================================
    let chapterCount = 0;
    function getChapterCount() { return chapterCount; }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // ============================================================
    // 6. BUILD TOC
    // ============================================================
    function buildTOC(chapters) {
        const tocList = document.getElementById('toc-list');
        if (!tocList) {
            warn('TOC list not found');
            return;
        }

        tocList.innerHTML = '';

        chapters.forEach(function (chapterEl, index) {
            const titleEl = chapterEl.querySelector('.chapter-title');
            const yearEl  = chapterEl.querySelector('.chapter-year');

            const title = titleEl ? titleEl.textContent.trim() : 'Chapter ' + (index + 1);
            const year  = yearEl  ? yearEl.textContent.trim()  : '';

            const label = (index === 10) ? 'Epilogue' : 'Chapter ' + (index + 1);
            const pageNum = FIRST_CHAPTER_PAGE + index;

            const li = document.createElement('li');
            li.innerHTML =
                '<span class="toc-num">' + escapeHtml(label) + '</span>' +
                '<span class="toc-title">' + escapeHtml(title) + '</span>' +
                (year ? '<span class="toc-year">' + escapeHtml(year) + '</span>' : '') +
                '<span class="toc-page-num">' + pageNum + '</span>';

            tocList.appendChild(li);
        });

        log('TOC built with', chapters.length, 'items');
    }

    // ============================================================
    // 7. MAIN
    // ============================================================
    async function main() {
        const loadingEl = document.getElementById('loading');
        const rootEl    = document.getElementById('book-root');

        try {
            // Import chapters from book.html
            const chapters = await importChapters();
            chapterCount = chapters.length;

            // Build TOC (uses original chapters for metadata)
            buildTOC(chapters);

            // Inject chapter pages into #book-content
            const contentContainer = document.getElementById('book-content');
            if (!contentContainer) {
                throw new Error('#book-content container not found');
            }

            contentContainer.innerHTML = '';

            chapters.forEach(function (chapterEl, index) {
                const page = buildChapterPage(chapterEl, index);
                contentContainer.appendChild(page);
            });

            log('All', chapters.length, 'chapters injected');

            // Wait for fonts
            if (document.fonts && document.fonts.ready) {
                await document.fonts.ready;
            }

            // Wait for images
            await Promise.all(
                Array.prototype.slice.call(document.images).map(function (img) {
                    if (img.complete) return Promise.resolve();
                    return new Promise(function (resolve) {
                        img.onload = img.onerror = function () { resolve(); };
                    });
                })
            );

            // Small delay for layout stabilization
            await new Promise(function (r) { setTimeout(r, 300); });

            // Reveal
            if (loadingEl) loadingEl.hidden = true;
            if (rootEl) {
                rootEl.hidden = false;
                rootEl.classList.add('ready');
                document.body.classList.add('print-ready');
            }

            log('Print ready');

        } catch (error) {
            console.error('[print] Failed:', error);

            if (loadingEl) {
                loadingEl.innerHTML =
                    '<p style="color:#B91C1C;">Failed to load book.</p>' +
                    '<p style="font-size:12px;color:#7A7068;margin-top:8px;">' +
                        escapeHtml(error.message) +
                    '</p>';
            }
        }
    }

    // ============================================================
    // 8. INIT
    // ============================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();
