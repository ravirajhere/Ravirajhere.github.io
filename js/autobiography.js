/* ============================================================
   AUTOBIOGRAPHY.JS — Full Logic
   Ravi Raj / Suraj Anand — "A Boy Who Never Thought"
   ============================================================ */

/* ============================================================
   GLOBAL STATE
   ============================================================ */
let currentLang = 'en';           // 'en' or 'hi'
let currentChapter = 1;           // 1 to 10
const TOTAL_CHAPTERS = 10;

/* ============================================================
   1. TOAST NOTIFICATION
   ============================================================ */
function showToast(message, duration = 2500) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}
window.showToast = showToast;

/* ============================================================
   2. LANGUAGE SWITCH (English ↔ Hinglish)
   ============================================================ */
function switchLang(lang) {
    currentLang = lang;

    // Toggle chapter containers
    const enBox = document.getElementById('chaptersEn');
    const hiBox = document.getElementById('chaptersHi');

    if (lang === 'en') {
        if (enBox) enBox.style.display = 'block';
        if (hiBox) hiBox.style.display = 'none';
    } else {
        if (enBox) enBox.style.display = 'none';
        if (hiBox) hiBox.style.display = 'block';
    }

    // Toggle active class on lang buttons
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(lang === 'en' ? 'btnEn' : 'btnHi');
    if (activeBtn) activeBtn.classList.add('active');

    // Reset to chapter 1 of the selected language
    goToChapter(lang, 1);

    // Show toast
    showToast(lang === 'en' ? '🇬🇧 English Mode' : '🗣️ Hinglish Mode');

    // Save preference
    try {
        localStorage.setItem('autobioLang', lang);
    } catch (e) {}
}
window.switchLang = switchLang;

/* ============================================================
   3. CHAPTER NAVIGATION
   ============================================================ */
function getChaptersContainer(lang) {
    return document.getElementById(lang === 'en' ? 'chaptersEn' : 'chaptersHi');
}

function getChapterElements(lang) {
    const container = getChaptersContainer(lang);
    if (!container) return [];
    return Array.from(container.querySelectorAll('.chapter'));
}

function goToChapter(lang, chapterNum) {
    if (chapterNum < 1 || chapterNum > TOTAL_CHAPTERS) return;

    currentLang = lang;
    currentChapter = chapterNum;

    const chapters = getChapterElements(lang);

    // Hide all, show only the target
    chapters.forEach((ch, idx) => {
        if (idx === chapterNum - 1) {
            ch.classList.add('active');
        } else {
            ch.classList.remove('active');
        }
    });

    // Update progress info
    updateProgressInfo();

    // Update progress dots
    updateProgressDots();

    // ✅ FIXED: Scroll to the active CHAPTER HEADING (not wrapper top)
    const activeChapter = chapters[chapterNum - 1];
    if (activeChapter) {
        requestAnimationFrame(() => {
            const yOffset = -90; // navbar + breathing space
            const y = activeChapter.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        });
    }

    // Save progress
    try {
        localStorage.setItem('autobioChapter', chapterNum);
        localStorage.setItem('autobioLang', lang);
    } catch (e) {}
}
window.goToChapter = goToChapter;

function nextChapter(lang) {
    const targetLang = lang || currentLang;
    if (currentChapter < TOTAL_CHAPTERS) {
        goToChapter(targetLang, currentChapter + 1);
    }
}
window.nextChapter = nextChapter;

function prevChapter(lang) {
    const targetLang = lang || currentLang;
    if (currentChapter > 1) {
        goToChapter(targetLang, currentChapter - 1);
    }
}
window.prevChapter = prevChapter;

/* ============================================================
   4. PROGRESS INFO UPDATE
   ============================================================ */
function updateProgressInfo() {
    const numDisplay = document.getElementById('chapterNumDisplay');
    const percentDisplay = document.getElementById('chapterPercentDisplay');

    if (numDisplay) {
        numDisplay.textContent = `Chapter ${currentChapter} of ${TOTAL_CHAPTERS}`;
    }

    if (percentDisplay) {
        const percent = Math.round(((currentChapter - 1) / (TOTAL_CHAPTERS - 1)) * 100);
        percentDisplay.textContent = `${percent}% complete`;
    }
}

/* ============================================================
   5. PROGRESS DOTS UPDATE
   ============================================================ */
function updateProgressDots() {
    const dots = document.querySelectorAll('#progressDots .dot');
    dots.forEach((dot, idx) => {
        if (idx === currentChapter - 1) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

/* ============================================================
   6. PROGRESS DOTS CLICK HANDLER
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const dots = document.querySelectorAll('#progressDots .dot');
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            goToChapter(currentLang, idx + 1);
        });
    });
});

/* ============================================================
   7. KEYBOARD NAVIGATION (Arrow keys)
   ============================================================ */
document.addEventListener('keydown', (e) => {
    // Ignore if typing in input/textarea
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;

    // Ignore if modal or sidebar open
    const modal = document.getElementById('downloadModal');
    const sidebar = document.getElementById('sidebar');
    if (modal && modal.classList.contains('active')) return;
    if (sidebar && sidebar.classList.contains('open')) return;

    if (e.key === 'ArrowRight') {
        nextChapter(currentLang);
    } else if (e.key === 'ArrowLeft') {
        prevChapter(currentLang);
    }
});

/* ============================================================
   8. GOOGLE TRANSLATE OPENER
   ============================================================ */
function openGoogleTranslate() {
    const url = `https://translate.google.com/?sl=auto&tl=en&op=translate`;
    window.open(url, '_blank', 'noopener');
}
window.openGoogleTranslate = openGoogleTranslate;

/* ============================================================
   9. DOWNLOAD MODAL
   ============================================================ */
function openModal() {
    const modal = document.getElementById('downloadModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}
window.openModal = openModal;

function closeModal() {
    const modal = document.getElementById('downloadModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}
window.closeModal = closeModal;

// Close modal on overlay click
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('downloadModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Close modal on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const m = document.getElementById('downloadModal');
            if (m && m.classList.contains('active')) closeModal();
        }
    });
});

/* ============================================================
   10. DOWNLOAD EBOOK HANDLERS (placeholder — ebook.js handles actual)
   ============================================================ */
function downloadEnglishEbook() {
    if (typeof window.downloadEbook === 'function') {
        window.downloadEbook('en');
    } else {
        showToast('📥 English eBook download starting...');
        setTimeout(() => closeModal(), 800);
    }
}
window.downloadEnglishEbook = downloadEnglishEbook;

function downloadHinglishEbook() {
    if (typeof window.downloadEbook === 'function') {
        window.downloadEbook('hi');
    } else {
        showToast('📥 Hinglish eBook download starting...');
        setTimeout(() => closeModal(), 800);
    }
}
window.downloadHinglishEbook = downloadHinglishEbook;

/* ============================================================
   12. INITIALISE ON LOAD
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    // Theme
    initThemeToggle();

    // Restore language preference
    let savedLang = 'en';
    let savedChapter = 1;
    try {
        savedLang = localStorage.getItem('autobioLang') || 'en';
        savedChapter = parseInt(localStorage.getItem('autobioChapter')) || 1;
    } catch (e) {}

    // Validate
    if (savedLang !== 'en' && savedLang !== 'hi') savedLang = 'en';
    if (isNaN(savedChapter) || savedChapter < 1 || savedChapter > TOTAL_CHAPTERS) {
        savedChapter = 1;
    }

    // Apply
    switchLang(savedLang);
    goToChapter(savedLang, savedChapter);

    console.log('✅ Autobiography.js loaded successfully — Chapter', savedChapter, 'in', savedLang);
});

/* ============================================================
   13. EXPOSE GLOBALS FOR INLINE HANDLERS
   ============================================================ */
window.currentLang = currentLang;
window.TOTAL_CHAPTERS = TOTAL_CHAPTERS;
