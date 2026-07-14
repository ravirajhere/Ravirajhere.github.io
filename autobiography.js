// ============================================================
// AUTOBIOGRAPHY.JS — BOOK-STYLE NAVIGATION
// ============================================================

// ---- LANGUAGE TOGGLE ----
function switchLang(lang) {
    const enChapters = document.getElementById('chaptersEn');
    const hiChapters = document.getElementById('chaptersHi');
    const btnEn = document.getElementById('btnEn');
    const btnHi = document.getElementById('btnHi');

    if (lang === 'en') {
        enChapters.style.display = 'block';
        hiChapters.style.display = 'none';
        btnEn.classList.add('active');
        btnHi.classList.remove('active');
        resetChapters('en');
    } else {
        enChapters.style.display = 'none';
        hiChapters.style.display = 'block';
        btnHi.classList.add('active');
        btnEn.classList.remove('active');
        resetChapters('hi');
    }
}

// ---- RESET CHAPTERS ----
function resetChapters(lang) {
    const containerId = lang === 'en' ? 'chaptersEn' : 'chaptersHi';
    const container = document.getElementById(containerId);
    const chapters = container.querySelectorAll('.chapter');
    chapters.forEach((ch, index) => {
        if (index === 0) {
            ch.classList.add('active');
        } else {
            ch.classList.remove('active');
        }
    });
}

// ---- NEXT CHAPTER ----
function nextChapter(lang) {
    const containerId = lang === 'en' ? 'chaptersEn' : 'chaptersHi';
    const container = document.getElementById(containerId);
    const chapters = container.querySelectorAll('.chapter');
    let currentIndex = -1;

    chapters.forEach((ch, index) => {
        if (ch.classList.contains('active')) {
            currentIndex = index;
        }
    });

    if (currentIndex !== -1 && currentIndex < chapters.length - 1) {
        chapters[currentIndex].classList.remove('active');
        chapters[currentIndex + 1].classList.add('active');
    }
}

// ---- GOOGLE TRANSLATE ----
function openGoogleTranslate() {
    const url = window.location.href;
    window.open('https://translate.google.com/translate?sl=auto&tl=hi&u=' + encodeURIComponent(url), '_blank');
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', function() {
    resetChapters('en');
    document.getElementById('chaptersEn').style.display = 'block';
    document.getElementById('chaptersHi').style.display = 'none';
});
