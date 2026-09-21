/* ==========================================================================
   RAVI RAJ SINGH — PRINT SCRIPT v2
   Fix: robust fetch with fallbacks + detailed error handling
   ========================================================================== */

(function () {
    'use strict';

    // ============================================================
    // 1. CONFIG
    // ============================================================
    const LANG = (function () {
        try {
            const params = new URLSearchParams(window.location.search);
            const l = params.get('lang') || 'en';
            return l === 'hi' ? 'hi' : 'en';
        } catch (e) {
            return 'en';
        }
    })();

    const CHAPTERS_ID = LANG === 'hi' ? 'chaptersHi' : 'chaptersEn';

    // Try multiple URL patterns — Vercel might redirect
    const SOURCE_URLS = [
        '/book.html',
        '/book',
        'book.html',
        window.location.origin + '/book.html'
    ];

    const FIRST_CHAPTER_PAGE = 10;
    const FETCH_TIMEOUT_MS = 10000;

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

    function error(...args) {
        try { console.error('[print]', ...args); } catch (e) {}
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function showError(message, detail) {
        const loadingEl = document.getElementById('loading');
        if (!loadingEl) return;

        loadingEl.innerHTML =
            '<div style="max-width:500px;margin:40px auto;padding:24px;text-align:left;font-family:system-ui,sans-serif;">' +
                '<h2 style="color:#B91C1C;margin:0 0 12px;font-size:18px;">Could not load book</h2>' +
                '<p style="color:#1A1A1A;margin:0 0 8px;font-size:14px;">' + escapeHtml(message) + '</p>' +
                (detail
                    ? '<pre style="background:#F4F1EA;padding:12px;border-radius:4px;font-size:11px;color:#4A423C;overflow-x:auto;white-space:pre-wrap;word-break:break-word;">' + escapeHtml(detail) + '</pre>'
                    : '') +
                '<p style="color:#7A7068;margin:12px 0 0;font-size:12px;">Open the browser console for details.</p>' +
            '</div>';
    }

    // ============================================================
    // 3. FETCH WITH TIMEOUT
    // ============================================================
    function fetchWithTimeout(url, timeout) {
        return new Promise(function (resolve, reject) {
            const controller = new AbortController();
            const timer = setTimeout(function () {
                controller.abort();
                reject(new Error('Timeout after ' + timeout + 'ms'));
            }, timeout);

            fetch(url, {
                method: 'GET',
                cache: 'no-store',
                signal: controller.signal,
                headers: { 'Accept': 'text/html' }
            })
            .then(function (res) {
                clearTimeout(timer);
                resolve(res);
            })
            .catch(function (err) {
                clearTimeout(timer);
                reject(err);
            });
        });
    }

    // ============================================================
    // 4. FETCH book.html — try multiple URLs
    // ============================================================
    async function fetchBookHtml() {
        const errors = [];

        for (let i = 0; i < SOURCE_URLS.length; i++) {
            const url = SOURCE_URLS[i];
            log('Trying URL #' + (i + 1) + ':', url);

            try {
                const res = await fetchWithTimeout(url, FETCH_TIMEOUT_MS);

                if (!res.ok) {
                    errors.push(url + ' → HTTP ' + res.status);
                    continue;
                }

                const text = await res.text();

                if (!text || text.length < 500) {
                    errors.push(url + ' → too short (' + text.length + ' chars)');
                    continue;
                }

                // Sanity check — should contain chapters
                if (text.indexOf('chaptersEn') === -1 && text.indexOf('chaptersHi') === -1) {
                    errors.push(url + ' → no chapters found');
                    continue;
                }

                log('Success with URL #' + (i + 1) + ':', url, '(' + text.length + ' chars)');
                return text;

            } catch (err) {
                errors.push(url + ' → ' + err.message);
                warn('Failed:', url, err.message);
            }
        }

        throw new Error('All URLs failed:\n' + errors.join('\n'));
    }

    // ============================================================
    // 5. IMPORT CHAPTERS
    // ============================================================
    async function importChapters() {
        const html = await fetchBookHtml();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        const container = doc.querySelector('#' + CHAPTERS_ID);
        if (!container) {
            throw new Error('Chapters container #' + CHAPTERS_ID + ' not found in book.html');
        }

        const chapters = Array.prototype.slice.call(
            container.querySelectorAll('article.chapter')
        );

        if (!chapters.length) {
            throw new Error('No article.chapter elements found in #' + CHAPTERS_ID);
        }

        log('Found', chapters.length, 'chapters');
        return chapters;
    }

    // ============================================================
    // 6. BUILD A CHAPTER PAGE
    // ============================================================
    let chapterCount = 0;

    function buildChapterPage(originalChapter, index) {
        const pageNumber = FIRST_CHAPTER_PAGE + index;
        const isLast = index === (chapterCount - 1);

        const clone = originalChapter.cloneNode(true);

        clone.querySelectorAll(
            '.chapter-nav, .menu-btn, .back-link, .lang-switch, .chapter-rule'
        ).forEach(function (el) { el.remove(); });

        const numEl   = clone.querySelector('.chapter-num');
        const titleEl = clone.querySelector('.chapter-title');
        const yearEl  = clone.querySelector('.chapter-year');

        const numText   = numEl   ? numEl.textContent.trim()   : 'Chapter ' + (index + 1);
        const titleText = titleEl ? titleEl.textContent.trim() : '';
        const yearText  = yearEl  ? yearEl.textContent.trim()  : '';

        const head = clone.querySelector('.chapter-head');
        if (head) head.remove();

        const page = document.createElement('section');
        page.className = 'chapter';
        page.id = 'pdf-chapter-' + (index + 1);
        page.setAttribute('data-chapter-num', String(index + 1));

        // Running header
        const runningHeader = document.createElement('div');
        runningHeader.className = 'chapter-running-header';
        runningHeader.innerHTML =
            '<span>Ravi Raj Singh</span>' +
            '<span>' + escapeHtml(titleText) + '</span>';
        page.appendChild(runningHeader);

        // Chapter header block
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

        // Chapter body
        const bodyEl = clone.querySelector('.chapter-body');
        if (bodyEl) {
            const bodyWrapper = document.createElement('div');
            bodyWrapper.className = 'chapter-body';
            while (bodyEl.firstChild) {
                bodyWrapper.appendChild(bodyEl.firstChild);
            }
            page.appendChild(bodyWrapper);
        }

        // Page number
        const pageNum = document.createElement('div');
        pageNum.className = 'chapter-page-number';
        pageNum.textContent = String(pageNumber);
        page.appendChild(pageNum);

        if (isLast) {
            page.classList.add('chapter-last');
        }

        return page;
    }

    // ============================================================
    // 7. BUILD TOC
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
    // 8. MAIN
    // ============================================================
    async function main() {
        const loadingEl = document.getElementById('loading');
        const rootEl    = document.getElementById('book-root');

        log('Starting — lang:', LANG, '| container: #' + CHAPTERS_ID);

        try {
            const chapters = await importChapters();
            chapterCount = chapters.length;

            buildTOC(chapters);

            const contentContainer = document.getElementById('book-content');
            if (!contentContainer) {
                throw new Error('#book-content container not found in print.html');
            }

            contentContainer.innerHTML = '';

            chapters.forEach(function (chapterEl, index) {
                const page = buildChapterPage(chapterEl, index);
                contentContainer.appendChild(page);
            });

            log('All', chapters.length, 'chapters injected');

            // Wait for fonts
            if (document.fonts && document.fonts.ready) {
                try { await document.fonts.ready; } catch (e) {}
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

            await new Promise(function (r) { setTimeout(r, 400); });

            // Reveal
            if (loadingEl) loadingEl.hidden = true;
            if (rootEl) {
                rootEl.hidden = false;
                rootEl.classList.add('ready');
            }
            document.body.classList.add('print-ready');

            log('Print ready — done');

        } catch (err) {
            error('Failed:', err);
            showError(err.message || 'Unknown error', err.stack || '');
        }
    }

    // ============================================================
    // 9. INIT
    // ============================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();
