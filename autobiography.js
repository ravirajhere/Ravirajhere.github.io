/* ============================================================
   AUTOBIOGRAPHY — LANGUAGE TOGGLE + GOOGLE TRANSLATE
   ============================================================ */

function switchLang(lang) {
    const enContent = document.getElementById('contentEn');
    const hiContent = document.getElementById('contentHi');
    const btnEn = document.getElementById('btnEn');
    const btnHi = document.getElementById('btnHi');

    if (lang === 'en') {
        enContent.style.display = 'block';
        hiContent.style.display = 'none';
        btnEn.classList.add('active');
        btnHi.classList.remove('active');
    } else {
        enContent.style.display = 'none';
        hiContent.style.display = 'block';
        btnHi.classList.add('active');
        btnEn.classList.remove('active');
    }
}

function openGoogleTranslate() {
    const url = window.location.href;
    const googleTranslateUrl =
        'https://translate.google.com/translate?sl=en&tl=hi&u=' + encodeURIComponent(url);
    window.open(googleTranslateUrl, '_blank');
}
