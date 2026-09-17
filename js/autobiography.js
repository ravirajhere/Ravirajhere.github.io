/* ============================================================
   autobiography.js
   My Autobiography — Ravi Raj
   Handles: Theme, Sidebar, Language, Chapters, Modal, Toast
   ============================================================ */

(function () {
    'use strict';

    /* ============================================================
       1. CONFIG & STATE
       ============================================================ */
    const TOTAL_CHAPTERS = 11;

    // Chapter order (matches data-chapter attributes in HTML)
    const CHAPTER_ORDER = ['1', '2', '3', '4', '5', '6a', '6b', '7', '8', '9', '10'];

    const state = {
        currentChapter: '1',
        currentLang: 'en',       // 'en' | 'hi'
        theme: 'light'           // 'light' | 'dark'
    };

    /* ============================================================
       2. DOM HELPERS
       ============================================================ */
    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    /* ============================================================
       3. TOAST
       ============================================================ */
    let toastTimer = null;
    function showToast(message, duration = 2500) {
        const toast = $('#toast');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
    }

    /* ============================================================
       4. THEME TOGGLE (Light / Dark)
       ============================================================ */
    function applyTheme(theme) {
        state.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        document.body.classList.toggle('dark-mode', theme === 'dark');

        // Update label (sidebar one, if exists)
        const label = $('#themeLabel');
        if (label) label.textContent = theme === 'dark' ? 'Dark' : 'Light';

        // Sync both switches (sidebar + nav)
        $$('.switch').forEach(sw => {
            sw.classList.toggle('active', theme === 'dark');
            sw.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
        });

        // Persist
        try { localStorage.setItem('autobio-theme', theme); } catch (e) {}
    }

    function toggleTheme() {
        applyTheme(state.theme === 'dark' ? 'light' : 'dark');
    }

    function initTheme() {
        let saved = null;
        try { saved = localStorage.getItem('autobio-theme'); } catch (e) {}

        if (!saved) {
            const prefersDark = window.matchMedia &&
                window.matchMedia('(prefers-color-scheme: dark)').matches;
            saved = prefersDark ? 'dark' : 'light';
        }
        applyTheme(saved);

        // Bind both switches
        ['#themeSwitch', '#themeSwitchNav'].forEach(id => {
            const sw = $(id);
            if (!sw) return;
            sw.addEventListener('click', toggleTheme);
            sw.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleTheme();
                }
            });
        });
    }

    /* ============================================================
       5. SIDEBAR (open / close)
       ============================================================ */
    function openSidebar() {
        const sidebar = $('#sidebar');
        const overlay = $('#sidebarOverlay');
        if (sidebar) sidebar.classList.add('open');
        if (overlay) overlay.classList.add('active');
        document.body.classList.add('sidebar-open');
    }

    function closeSidebar() {
        const sidebar = $('#sidebar');
        const overlay = $('#sidebarOverlay');
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    }

    function initSidebar() {
        const hamburger = $('#hamburgerBtn');
        const closeBtn  = $('#sidebarClose');
        const overlay   = $('#sidebarOverlay');

        if (hamburger) hamburger.addEventListener('click', openSidebar);
        if (closeBtn)  closeBtn.addEventListener('click', closeSidebar);
        if (overlay)   overlay.addEventListener('click', closeSidebar);

        // ESC closes sidebar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeSidebar();
        });
    }

    /* ============================================================
       6. LANGUAGE SWITCH
       ============================================================ */
    function switchLang(lang) {
        if (lang !== 'en' && lang !== 'hi') return;
        state.currentLang = lang;

        // Toggle active button
        const btnEn = $('#btnEn');
        const btnHi = $('#btnHi');
        if (btnEn) btnEn.classList.toggle('active', lang === 'en');
        if (btnHi) btnHi.classList.toggle('active', lang === 'hi');

        // Toggle chapters containers
        const enBox = $('#chaptersEn');
        const hiBox = $('#chaptersHi');
        if (enBox) enBox.style.display = lang === 'en' ? '' : 'none';
        if (hiBox) hiBox.style.display = lang === 'hi' ? '' : 'none';

        // Show only current chapter in the active language
        showChapter(state.currentChapter, false);

        // Persist
        try { localStorage.setItem('autobio-lang', lang); } catch (e) {}

        showToast(lang === 'en' ? '🇬🇧 English' : '🗣️ Hinglish');
    }

    /* ============================================================
       7. CHAPTERS
       ============================================================ */
    function getActiveContainer() {
        return state.currentLang === 'en' ? $('#chaptersEn') : $('#chaptersHi');
    }

    function showChapter(chapterId, scroll = true) {
        chapterId = String(chapterId);
        state.currentChapter = chapterId;

        const container = getActiveContainer();
        if (!container) return;

        // Hide all chapters in this container, show the matching one
        $$('.chapter', container).forEach(ch => {
            const match = ch.dataset.chapter === chapterId;
            ch.classList.toggle('active', match);
            ch.style.display = match ? '' : 'none';
        });

        // Also hide all chapters in the *other* language container
        const otherContainer = state.currentLang === 'en'
            ? $('#chaptersHi')
            : $('#chaptersEn');
        if (otherContainer) {
            $$('.chapter', otherContainer).forEach(ch => {
                ch.classList.remove('active');
                ch.style.display = 'none';
            });
        }

        updateNavButtons(chapterId);
        updateProgress(chapterId);
        highlightSidebar(chapterId);

        if (scroll) {
            const wrapper = $('.autobio-wrapper');
            if (wrapper) {
                window.scrollTo({
                    top: wrapper.offsetTop - 60,
                    behavior: 'smooth'
                });
            }
        }

        try { localStorage.setItem('autobio-chapter', chapterId); } catch (e) {}
    }

    function updateNavButtons(chapterId) {
        const container = getActiveContainer();
        if (!container) return;

        const idx = CHAPTER_ORDER.indexOf(chapterId);
        const activeCh = $('.chapter.active', container);
        if (!activeCh) return;

        const prevBtn = $('.prev-btn', activeCh);
        const nextBtn = $('.next-btn', activeCh);

        if (prevBtn) prevBtn.disabled = idx <= 0;
        if (nextBtn) nextBtn.disabled = idx >= CHAPTER_ORDER.length - 1;
    }

    function prevChapter() {
        const idx = CHAPTER_ORDER.indexOf(state.currentChapter);
        if (idx > 0) showChapter(CHAPTER_ORDER[idx - 1]);
    }

    function nextChapter() {
        const idx = CHAPTER_ORDER.indexOf(state.currentChapter);
        if (idx < CHAPTER_ORDER.length - 1) showChapter(CHAPTER_ORDER[idx + 1]);
    }

    function updateProgress(chapterId) {
        const idx = CHAPTER_ORDER.indexOf(chapterId);
        const numDisplay = $('#chapterNumDisplay');
        const pctDisplay = $('#chapterPercentDisplay');

        if (numDisplay) {
            numDisplay.textContent = `Chapter ${idx + 1} of ${TOTAL_CHAPTERS}`;
        }
        if (pctDisplay) {
            const pct = Math.round(((idx + 1) / TOTAL_CHAPTERS) * 100);
            pctDisplay.textContent = `${pct}% complete`;
        }

        $$('#progressDots .dot').forEach(dot => {
            const dotId = dot.dataset.dot;
            const dotIdx = CHAPTER_ORDER.indexOf(dotId);
            dot.classList.toggle('active', dotId === chapterId);
            dot.classList.toggle('done', dotIdx < idx);
        });
    }

    function highlightSidebar(chapterId) {
        $$('#chapterSidebarMenu a').forEach(a => {
            a.classList.toggle('active', a.dataset.chapter === chapterId);
        });
    }

    /* ---------- CLICK HANDLERS (single source of truth) ---------- */
    function initChapterClicks() {
        // ✅ FIX: inline onclick hata do taaki double firing na ho
        // (HTML me agar onclick="nextChapter()" / "prevChapter()" / "showChapter()" hai,
        //  wo JS handler ke saath milkar 2 step jump karata tha)
        $$('.nav-btn, .prev-btn, .next-btn, #chapterSidebarMenu a, #progressDots .dot')
            .forEach(el => {
                el.removeAttribute('onclick');
                el.onclick = null;
            });

        // Sidebar chapter links
        $$('#chapterSidebarMenu a').forEach(a => {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                const ch = a.dataset.chapter;
                if (ch) {
                    showChapter(ch);
                    closeSidebar();
                }
            });
        });

        // Progress dots
        $$('#progressDots .dot').forEach(dot => {
            dot.addEventListener('click', () => {
                const ch = dot.dataset.dot;
                if (ch) showChapter(ch);
            });
        });

        // Prev/Next buttons — event delegation
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.nav-btn');
            if (!btn) return;

            // Safety: agar kahin inline onclick bach gaya ho to skip
            if (btn.hasAttribute('onclick')) return;

            if (btn.classList.contains('prev-btn')) prevChapter();
            else if (btn.classList.contains('next-btn')) nextChapter();
        });

        // Keyboard: Left / Right arrows (only if modal/sidebar not open)
        document.addEventListener('keydown', (e) => {
            if (document.body.classList.contains('sidebar-open')) return;
            const modal = $('#downloadModal');
            if (modal && modal.classList.contains('active')) return;

            if (e.key === 'ArrowLeft')  prevChapter();
            if (e.key === 'ArrowRight') nextChapter();
        });
    }

    /* ============================================================
       8. MODAL (Download Ebook)
       ============================================================ */
    function openModal() {
        const modal = $('#downloadModal');
        if (!modal) return;
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    function closeModal() {
        const modal = $('#downloadModal');
        if (!modal) return;
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }

    function initModal() {
        const modal = $('#downloadModal');
        if (!modal) return;

        // Click on overlay (not content) closes
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // ESC closes
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }

    /* ============================================================
       9. EBOOK DOWNLOAD HELPERS
       ============================================================ */
    function downloadEnglishEbook() {
        if (typeof window.generateEbook === 'function') {
            window.generateEbook('en');
        } else if (typeof window.generateEbookEn === 'function') {
            window.generateEbookEn();
        } else {
            showToast('📄 Opening print dialog...');
            setTimeout(() => window.print(), 400);
        }
        closeModal();
    }

    function downloadHinglishEbook() {
        if (typeof window.generateEbook === 'function') {
            window.generateEbook('hi');
        } else if (typeof window.generateEbookHi === 'function') {
            window.generateEbookHi();
        } else {
            showToast('📄 Opening print dialog...');
            setTimeout(() => window.print(), 400);
        }
        closeModal();
    }

    /* ============================================================
       10. RESTORE STATE
       ============================================================ */
    function restoreState() {
        let savedLang = null;
        try { savedLang = localStorage.getItem('autobio-lang'); } catch (e) {}
        if (savedLang === 'hi' || savedLang === 'en') {
            state.currentLang = savedLang;
        }

        let savedCh = null;
        try { savedCh = localStorage.getItem('autobio-chapter'); } catch (e) {}
        if (savedCh && CHAPTER_ORDER.includes(String(savedCh))) {
            state.currentChapter = String(savedCh);
        }
    }

    /* ============================================================
       11. INIT
       ============================================================ */
    function init() {
        restoreState();
        initTheme();
        initSidebar();
        initModal();
        initChapterClicks();

        // Apply language + chapter after DOM ready
        switchLang(state.currentLang);
        showChapter(state.currentChapter, false);

        // Language buttons — use onclick = to also wipe any old inline handler
        const btnEn = $('#btnEn');
        const btnHi = $('#btnHi');
        if (btnEn) btnEn.onclick = () => switchLang('en');
        if (btnHi) btnHi.onclick = () => switchLang('hi');

        document.body.classList.add('js-ready');
    }

    /* ============================================================
       12. EXPOSE GLOBALS (console / debug ke liye)
       ============================================================ */
    window.openModal            = openModal;
    window.closeModal           = closeModal;
    window.switchLang           = switchLang;
    window.showChapter          = showChapter;
    window.prevChapter          = prevChapter;
    window.nextChapter          = nextChapter;
    window.downloadEnglishEbook = downloadEnglishEbook;
    window.downloadHinglishEbook= downloadHinglishEbook;
    window.toggleTheme          = toggleTheme;
    window.showToast            = showToast;

    /* ============================================================
       13. BOOT
       ============================================================ */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
