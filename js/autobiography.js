/* ============================================================
   AUTOBIOGRAPHY.JS — Full Logic (11 Chapters - 6A/6B Support)
   Ravi Raj / Suraj Anand — "A Boy Who Never Thought"
   Includes: Theme Toggle, Language Switch, Chapter Nav, Progress
   ============================================================ */

/* ============================================================
   GLOBAL STATE
   ============================================================ */
let currentLang = 'en';           // 'en' or 'hi'

// Chapter IDs in order — 11 chapters (6A aur 6B alag hain)
const CHAPTER_LIST = ['1', '2', '3', '4', '5', '6a', '6b', '7', '8', '9', '10'];
const TOTAL_CHAPTERS = CHAPTER_LIST.length; // = 11

let currentChapter = '1';         // chapter ID (string)

/* ============================================================
   HELPER — Chapter Index <-> ID
   ============================================================ */
function getChapterIndex(chapterId) {
    return CHAPTER_LIST.indexOf(String(chapterId).toLowerCase());
}

function getChapterIdByIndex(index) {
    return CHAPTER_LIST[index];
}

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
   2. THEME TOGGLE (Dark / Light)
   ============================================================ */
function applyTheme(theme) {
    // theme: 'light' or 'dark'
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        document.documentElement.setAttribute('data-theme', 'light');
    }

    // Update all theme labels (top-left + navbar)
    const label = document.getElementById('themeLabel');
    if (label) {
        label.textContent = theme === 'dark' ? 'Dark' : 'Light';
    }

    // Save preference
    try {
        localStorage.setItem('autobioTheme', theme);
    } catch (e) {}
}

function toggleTheme() {
    const isDark = document.body.classList.contains('dark-mode');
    const newTheme = isDark ? 'light' : 'dark';
    applyTheme(newTheme);
    showToast(newTheme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode');
}
window.toggleTheme = toggleTheme;

function initThemeToggle() {
    // Restore saved theme, or fall back to system preference
    let savedTheme = null;
    try {
        savedTheme = localStorage.getItem('autobioTheme');
    } catch (e) {}

    if (!savedTheme) {
        // Detect system preference
        const prefersDark = window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches;
        savedTheme = prefersDark ? 'dark' : 'light';
    }

    // Apply saved/system theme
    applyTheme(savedTheme);

    // Attach click handlers to BOTH switches (top-left + navbar)
    const switch1 = document.getElementById('themeSwitch');
    const switch2 = document.getElementById('themeSwitchNav');

    [switch1, switch2].forEach((sw) => {
        if (!sw) return;

        // Click
        sw.addEventListener('click', toggleTheme);

        // Keyboard (Enter / Space) — accessibility
        sw.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
            }
        });
    });

    console.log('🎨 Theme initialised:', savedTheme);
}

/* ============================================================
   3. LANGUAGE SWITCH (English ↔ Hinglish)
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
    goToChapter(lang, '1');

    // Show toast
    showToast(lang === 'en' ? '🇬🇧 English Mode' : '🗣️ Hinglish Mode');

    // Save preference
    try {
        localStorage.setItem('autobioLang', lang);
    } catch (e) {}
}
window.switchLang = switchLang;

/* ============================================================
   4. CHAPTER NAVIGATION
   ============================================================ */
function getChaptersContainer(lang) {
    return document.getElementById(lang === 'en' ? 'chaptersEn' : 'chaptersHi');
}

function getChapterElements(lang) {
    const container = getChaptersContainer(lang);
    if (!container) return [];
    return Array.from(container.querySelectorAll('.chapter'));
}

function goToChapter(lang, chapterId) {
    // Convert to string and lowercase for safety
    const targetId = String(chapterId).toLowerCase();

    // Validate — chapter must exist in list
    if (!CHAPTER_LIST.includes(targetId)) {
        console.warn('⚠️ Invalid chapter:', chapterId);
        return;
    }

    currentLang = lang;
    currentChapter = targetId;

    const chapters = getChapterElements(lang);

    // Hide all, show only the target (match by data-chapter attribute)
    chapters.forEach((ch) => {
        const chId = String(ch.dataset.chapter).toLowerCase();
        if (chId === targetId) {
            ch.classList.add('active');
        } else {
            ch.classList.remove('active');
        }
    });

    // Update progress info
    updateProgressInfo();

    // Update progress dots
    updateProgressDots();

    // Scroll to the active chapter
    const activeChapter = chapters.find(
        (ch) => String(ch.dataset.chapter).toLowerCase() === targetId
    );
    if (activeChapter) {
        requestAnimationFrame(() => {
            const yOffset = -90; // navbar + breathing space
            const y = activeChapter.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        });
    }

    // Save progress
    try {
        localStorage.setItem('autobioChapter', targetId);
        localStorage.setItem('autobioLang', lang);
    } catch (e) {}
}
window.goToChapter = goToChapter;

function nextChapter(lang) {
    const targetLang = lang || currentLang;
    const idx = getChapterIndex(currentChapter);
    if (idx >= 0 && idx < TOTAL_CHAPTERS - 1) {
        goToChapter(targetLang, CHAPTER_LIST[idx + 1]);
    }
}
window.nextChapter = nextChapter;

function prevChapter(lang) {
    const targetLang = lang || currentLang;
    const idx = getChapterIndex(currentChapter);
    if (idx > 0) {
        goToChapter(targetLang, CHAPTER_LIST[idx - 1]);
    }
}
window.prevChapter = prevChapter;

/* ============================================================
   5. PROGRESS INFO UPDATE
   ============================================================ */
function updateProgressInfo() {
    const numDisplay = document.getElementById('chapterNumDisplay');
    const percentDisplay = document.getElementById('chapterPercentDisplay');

    const idx = getChapterIndex(currentChapter);
    const humanNum = idx + 1; // 1-based

    if (numDisplay) {
        // 6A / 6B dikhane ke liye special label
        let label = String(currentChapter).toUpperCase();
        numDisplay.textContent = `Chapter ${label} of ${TOTAL_CHAPTERS}`;
    }

    if (percentDisplay) {
        const percent = Math.round(((humanNum - 1) / (TOTAL_CHAPTERS - 1)) * 100);
        percentDisplay.textContent = `${percent}% complete`;
    }
}

/* ============================================================
   6. PROGRESS DOTS UPDATE
   ============================================================ */
function updateProgressDots() {
    const dots = document.querySelectorAll('#progressDots .dot');
    dots.forEach((dot) => {
        const dotId = String(dot.dataset.dot).toLowerCase();
        if (dotId === currentChapter) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

/* ============================================================
   7. PROGRESS DOTS CLICK HANDLER
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const dots = document.querySelectorAll('#progressDots .dot');
    dots.forEach((dot) => {
        dot.style.cursor = 'pointer';
        dot.addEventListener('click', () => {
            const dotId = String(dot.dataset.dot).toLowerCase();
            goToChapter(currentLang, dotId);
        });
    });
});

/* ============================================================
   8. KEYBOARD NAVIGATION (Arrow keys)
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
   9. GOOGLE TRANSLATE OPENER
   ============================================================ */
function openGoogleTranslate() {
    const url = `https://translate.google.com/?sl=auto&tl=en&op=translate`;
    window.open(url, '_blank', 'noopener');
}
window.openGoogleTranslate = openGoogleTranslate;

/* ============================================================
   10. DOWNLOAD MODAL
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
   11. DOWNLOAD EBOOK HANDLERS
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
    // 1. Theme toggle (dark/light)
    initThemeToggle();

    // 2. Restore language + chapter preference
    let savedLang = 'en';
    let savedChapter = '1';
    try {
        savedLang = localStorage.getItem('autobioLang') || 'en';
        savedChapter = localStorage.getItem('autobioChapter') || '1';
    } catch (e) {}

    // Validate
    if (savedLang !== 'en' && savedLang !== 'hi') savedLang = 'en';
    if (!CHAPTER_LIST.includes(String(savedChapter).toLowerCase())) {
        savedChapter = '1';
    }

    // Apply
    switchLang(savedLang);
    goToChapter(savedLang, savedChapter);

    console.log(
        '✅ Autobiography.js loaded — Chapter',
        savedChapter,
        'in',
        savedLang,
        '| Total:',
        TOTAL_CHAPTERS
    );
});

/* ============================================================
   13. EXPOSE GLOBALS
   ============================================================ */
window.currentLang = currentLang;
window.TOTAL_CHAPTERS = TOTAL_CHAPTERS;
window.CHAPTER_LIST = CHAPTER_LIST;
