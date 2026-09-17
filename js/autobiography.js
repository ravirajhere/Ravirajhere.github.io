/* ============================================================
   autobiography.js
   My Autobiography — Ravi Raj
   Handles: Theme, Sidebar, Language, Chapters, Modal, Toast,
            Reader Wizard, Webcam, Footnotes, Audio Narration,
            Age-based Voice Journey
   ============================================================ */

(function () {
    'use strict';

    /* ============================================================
       1. CONFIG & STATE
       ============================================================ */
    const TOTAL_CHAPTERS = 11;

    const CHAPTER_ORDER = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];

    const state = {
        currentChapter: '1',
        currentLang: 'en',
        theme: 'light'
    };

    /* ============================================================
       ⭐ VOICE JOURNEY CONFIG — Age-based pitch/rate per chapter
       ============================================================ */
    const VOICE_CONFIG = {
        '1':  { pitch: 1.55, rate: 0.86 },   // Newborn (2008) — high pitch, slow
        '2':  { pitch: 1.50, rate: 0.88 },   // 1 year (2009)
        '3':  { pitch: 1.45, rate: 0.90 },   // 3-4 years (2010-12)
        '4':  { pitch: 1.40, rate: 0.92 },   // 5 years (2013)
        '5':  { pitch: 1.30, rate: 0.95 },   // 7-8 years (2014-16)
        '6':  { pitch: 1.20, rate: 0.98 },   // 9 years (2017)
        '7':  { pitch: 1.15, rate: 1.00 },   // 9 years (2017)
        '8':  { pitch: 1.08, rate: 1.02 },   // 10 years (2018)
        '9':  { pitch: 1.00, rate: 1.05 },   // 10-11 years (2018-19)
        '10': { pitch: 0.95, rate: 1.08 },   // 11 years (2019)
        '11': { pitch: 0.90, rate: 1.10 }    // Present (Epilogue) — mature, thoughtful
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
       4. THEME TOGGLE
       ============================================================ */
    function applyTheme(theme) {
        state.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        document.body.classList.toggle('dark-mode', theme === 'dark');

        const label = $('#themeLabel');
        if (label) label.textContent = theme === 'dark' ? 'Dark' : 'Light';

        $$('.switch').forEach(sw => {
            sw.classList.toggle('active', theme === 'dark');
            sw.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
        });

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
       5. SIDEBAR
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

        const btnEn = $('#btnEn');
        const btnHi = $('#btnHi');
        if (btnEn) btnEn.classList.toggle('active', lang === 'en');
        if (btnHi) btnHi.classList.toggle('active', lang === 'hi');

        const enBox = $('#chaptersEn');
        const hiBox = $('#chaptersHi');
        if (enBox) enBox.style.display = lang === 'en' ? '' : 'none';
        if (hiBox) hiBox.style.display = lang === 'hi' ? '' : 'none';

        showChapter(state.currentChapter, false);

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

        stopAudioIfPlaying();

        const container = getActiveContainer();
        if (!container) return;

        $$('.chapter', container).forEach(ch => {
            const match = ch.dataset.chapter === chapterId;
            ch.classList.toggle('active', match);
            ch.style.display = match ? '' : 'none';
        });

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
            const activeCh = $('.chapter.active', container);
            if (activeCh) {
                requestAnimationFrame(() => {
                    const topNavHeight = 70;
                    const extraGap = 12;
                    const rect = activeCh.getBoundingClientRect();
                    const absoluteTop = rect.top + window.pageYOffset;
                    window.scrollTo({
                        top: absoluteTop - topNavHeight - extraGap,
                        behavior: 'smooth'
                    });
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

    function initChapterClicks() {
        $$('.nav-btn, .prev-btn, .next-btn, #chapterSidebarMenu a, #progressDots .dot')
            .forEach(el => {
                el.removeAttribute('onclick');
                el.onclick = null;
            });

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

        $$('#progressDots .dot').forEach(dot => {
            dot.addEventListener('click', () => {
                const ch = dot.dataset.dot;
                if (ch) showChapter(ch);
            });
        });

        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.nav-btn');
            if (!btn) return;
            if (btn.hasAttribute('onclick')) return;

            if (btn.classList.contains('prev-btn')) prevChapter();
            else if (btn.classList.contains('next-btn')) nextChapter();
        });

        document.addEventListener('keydown', (e) => {
            if (document.body.classList.contains('sidebar-open')) return;
            const modal = $('#downloadModal');
            if (modal && modal.classList.contains('active')) return;

            if (e.key === 'ArrowLeft')  prevChapter();
            if (e.key === 'ArrowRight') nextChapter();
        });
    }

    /* ============================================================
       8. MODAL
       ============================================================ */
    function openModal() {
        const modal = $('#downloadModal');
        if (!modal) return;
        modal.classList.add('active');
        document.body.classList.add('modal-open');

        resetWizard();
        goToStep(1);
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

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }

    /* ============================================================
       9. EBOOK DOWNLOAD HELPERS (legacy)
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
       9B. READER WIZARD
       ============================================================ */

    const readerData = {
        name: '',
        gender: 'neutral',
        photo: null,
        language: 'en'
    };

    let webcamStream = null;
    let webcamActive = false;

    function goToStep(stepNum) {
        $$('.modal-step').forEach(step => step.classList.remove('active'));

        const targetId = 'step' + stepNum;
        const target = $('#' + targetId);
        if (target) target.classList.add('active');

        if (stepNum === 2) {
            setTimeout(() => {
                const nameInput = $('#readerName');
                if (nameInput) nameInput.focus();
            }, 300);
        }
    }

    function selectLanguage(lang) {
        readerData.language = lang;
        goToStep(2);
    }

    function goToStep3() {
        const nameInput = $('#readerName');
        const name = nameInput ? nameInput.value.trim() : '';

        if (!name) {
            showToast('Please enter your name');
            if (nameInput) nameInput.focus();
            return;
        }
        if (name.length < 2) {
            showToast('Name must be at least 2 characters');
            if (nameInput) nameInput.focus();
            return;
        }

        readerData.name = name;

        const genderRadio = document.querySelector('input[name="gender"]:checked');
        readerData.gender = genderRadio ? genderRadio.value : 'neutral';

        goToStep(3);
    }

    function triggerCamera() {
        openWebcam();
    }

    function triggerUpload() {
        const input = $('#uploadInput');
        if (input) input.click();
    }

    function handlePhotoSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast('Please select an image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            showToast('Image too large. Please select under 5MB');
            return;
        }

        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            const base64 = e.target.result;
            readerData.photo = base64;

            const previewBox = $('#photoPreviewBox');
            if (previewBox) {
                previewBox.innerHTML = `<img src="${base64}" alt="Reader photo" />`;
                previewBox.classList.add('has-photo');
            }
        };
        fileReader.readAsDataURL(file);
    }

    function initPhotoInputs() {
        const uploadInput = $('#uploadInput');
        if (uploadInput) uploadInput.addEventListener('change', handlePhotoSelect);

        const nameInput = $('#readerName');
        if (nameInput) {
            nameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    goToStep3();
                }
            });
        }
    }

    /* ============================================================
       9C. WEBCAM
       ============================================================ */

    async function openWebcam() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showToast('Camera not supported on this browser');
            triggerUpload();
            return;
        }

        goToStep('Camera');

        const video = $('#webcamVideo');
        const loading = $('#webcamLoading');
        const error = $('#webcamError');
        const controls = $('#webcamControls');
        const fallback = $('#webcamFallback');
        const captureBtn = $('#captureBtn');

        if (loading) loading.style.display = 'flex';
        if (error) error.style.display = 'none';
        if (controls) controls.style.display = 'flex';
        if (fallback) fallback.style.display = 'none';
        if (captureBtn) captureBtn.disabled = true;

        try {
            webcamStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 720 },
                    height: { ideal: 720 }
                },
                audio: false
            });

            if (video) {
                video.srcObject = webcamStream;
                video.onloadedmetadata = () => {
                    video.play();
                    webcamActive = true;
                    if (loading) loading.style.display = 'none';
                    if (captureBtn) captureBtn.disabled = false;
                };
            }

        } catch (err) {
            console.warn('Webcam error:', err);
            showWebcamError(err);
        }
    }

    function showWebcamError(err) {
        const loading = $('#webcamLoading');
        const error = $('#webcamError');
        const errorMsg = $('#webcamErrorMsg');
        const controls = $('#webcamControls');
        const fallback = $('#webcamFallback');

        if (loading) loading.style.display = 'none';
        if (error) error.style.display = 'flex';
        if (controls) controls.style.display = 'none';
        if (fallback) fallback.style.display = 'flex';

        let msg = 'Please allow camera access or use Gallery instead.';

        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            msg = 'Camera permission was denied. Please allow access in your browser settings.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            msg = 'No camera found on this device. Please use Gallery instead.';
        } else if (err.name === 'NotReadableError') {
            msg = 'Camera is in use by another app. Close it and try again.';
        } else if (err.name === 'OverconstrainedError') {
            msg = 'Camera does not meet requirements. Please use Gallery instead.';
        }

        if (errorMsg) errorMsg.textContent = msg;
    }

    function capturePhoto() {
        if (!webcamActive) return;

        const video = $('#webcamVideo');
        const container = document.querySelector('.webcam-container');
        if (!video) return;

        const canvas = document.createElement('canvas');
        const videoWidth = video.videoWidth || 720;
        const videoHeight = video.videoHeight || 720;

        canvas.width = videoWidth;
        canvas.height = videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

        if (container) {
            container.classList.add('captured');
            setTimeout(() => container.classList.remove('captured'), 400);
        }

        readerData.photo = dataUrl;

        const previewBox = $('#photoPreviewBox');
        if (previewBox) {
            previewBox.innerHTML = `<img src="${dataUrl}" alt="Reader photo" />`;
            previewBox.classList.add('has-photo');
        }

        setTimeout(() => {
            closeWebcam();
            goToStep(3);
            showToast('📸 Photo captured!');
        }, 300);
    }

    function closeWebcam() {
        if (webcamStream) {
            webcamStream.getTracks().forEach(track => track.stop());
            webcamStream = null;
        }

        const video = $('#webcamVideo');
        if (video) video.srcObject = null;

        webcamActive = false;

        const loading = $('#webcamLoading');
        const error = $('#webcamError');
        const controls = $('#webcamControls');
        const fallback = $('#webcamFallback');
        const captureBtn = $('#captureBtn');

        if (loading) loading.style.display = 'flex';
        if (error) error.style.display = 'none';
        if (controls) controls.style.display = 'flex';
        if (fallback) fallback.style.display = 'none';
        if (captureBtn) captureBtn.disabled = true;

        goToStep(3);
    }

    function resetWizard() {
        if (webcamStream) {
            webcamStream.getTracks().forEach(track => track.stop());
            webcamStream = null;
        }
        webcamActive = false;

        readerData.name = '';
        readerData.gender = 'neutral';
        readerData.photo = null;
        readerData.language = 'en';

        const previewBox = $('#photoPreviewBox');
        if (previewBox) {
            previewBox.classList.remove('has-photo');
            previewBox.innerHTML = `
                <span class="photo-placeholder-icon">📷</span>
                <span class="photo-placeholder-text">No photo selected</span>
            `;
        }

        const nameInput = $('#readerName');
        if (nameInput) nameInput.value = '';

        const neutralRadio = document.querySelector('input[name="gender"][value="neutral"]');
        if (neutralRadio) neutralRadio.checked = true;

        const uploadInput = $('#uploadInput');
        if (uploadInput) uploadInput.value = '';
    }

    function buildReaderMessage(name, gender) {
        let pronoun, possessive, objectPronoun;

        if (gender === 'male') {
            pronoun = 'he'; possessive = 'his'; objectPronoun = 'him';
        } else if (gender === 'female') {
            pronoun = 'she'; possessive = 'her'; objectPronoun = 'her';
        } else {
            pronoun = 'they'; possessive = 'their'; objectPronoun = 'them';
        }

        return `${name} is someone who is easy to write about, because there is no pretence at all.

Less talk, more action — that's who ${pronoun} is. Even in a crowd, ${pronoun} stands out, not because of clothes or style, but because of ${possessive} nature.

The best thing about ${name} is that ${pronoun} understands. Without being told, ${pronoun} knows when to be there and when to stay quiet. People like this are rare these days.

Hardworking and determined — once ${pronoun} sets ${possessive} mind on something, ${pronoun} gets it done. ${pronoun.charAt(0).toUpperCase() + pronoun.slice(1)} has a pure heart, which is why it feels safe to be around ${objectPronoun}.

Some people come into life and leave, some become a memory. ${name} is one of those who doesn't just become a memory, but becomes a part of life.`;
    }

    async function startPDFGeneration() {
        if (!readerData.name) {
            showToast('Name is missing. Please go back.');
            goToStep(2);
            return;
        }
        if (!readerData.photo) {
            showToast('Please select a photo first');
            return;
        }

        goToStep(4);
        updateModalProgress(0, 'Preparing ebook...');

        try {
            if (typeof window.generateEbookWithReader !== 'function') {
                throw new Error('Ebook generator not ready');
            }

            await window.generateEbookWithReader(readerData, (percent, message) => {
                updateModalProgress(percent, message);
            });

            updateModalProgress(100, '✅ Your ebook is ready!');

            setTimeout(() => {
                closeModal();
                showToast('Ebook downloaded successfully! 🎉');
            }, 1200);

        } catch (error) {
            console.error('PDF generation failed:', error);
            updateModalProgress(0, '❌ Something went wrong');
            showToast('PDF generation failed. Please try again.');

            setTimeout(() => goToStep(3), 2000);
        }
    }

    function updateModalProgress(percent, message) {
        const fill = $('#modalProgressFill');
        const text = $('#modalProgressText');
        const hint = $('#modalHint');

        if (fill) fill.style.width = percent + '%';
        if (text) text.textContent = Math.round(percent) + '%';
        if (hint && message) hint.textContent = message;
    }

    window.buildReaderMessage = buildReaderMessage;

    /* ============================================================
       9D. FOOTNOTES
       ============================================================ */

    function initFootnotes() {
        let tooltip = document.querySelector('.footnote-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'footnote-tooltip';
            document.body.appendChild(tooltip);
        }

        let sheet = document.querySelector('.footnote-sheet');
        let overlay = document.querySelector('.footnote-sheet-overlay');

        if (!sheet) {
            overlay = document.createElement('div');
            overlay.className = 'footnote-sheet-overlay';
            document.body.appendChild(overlay);

            sheet = document.createElement('div');
            sheet.className = 'footnote-sheet';
            sheet.innerHTML = `
                <div class="footnote-sheet-header">
                    <div class="footnote-sheet-label" id="footnoteSheetLabel"></div>
                    <button class="footnote-sheet-close" id="footnoteSheetClose" aria-label="Close">✕</button>
                </div>
                <div class="footnote-sheet-text" id="footnoteSheetText"></div>
            `;
            document.body.appendChild(sheet);

            const closeSheet = () => {
                sheet.classList.remove('active');
                overlay.classList.remove('active');
            };
            overlay.addEventListener('click', closeSheet);
            sheet.querySelector('#footnoteSheetClose').addEventListener('click', closeSheet);
        }

        const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

        document.addEventListener('mouseover', (e) => {
            const el = e.target.closest('.footnote');
            if (!el || isMobile()) return;
            const note = el.dataset.note;
            if (!note) return;

            tooltip.textContent = note;
            tooltip.classList.add('visible');

            const rect = el.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            let top = rect.top - tooltipRect.height - 10;
            if (left < 10) left = 10;
            if (left + tooltipRect.width > window.innerWidth - 10) {
                left = window.innerWidth - tooltipRect.width - 10;
            }
            if (top < 10) top = rect.bottom + 10;
            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
        });

        document.addEventListener('mouseout', (e) => {
            const el = e.target.closest('.footnote');
            if (!el || isMobile()) return;
            tooltip.classList.remove('visible');
        });

        document.addEventListener('click', (e) => {
            const el = e.target.closest('.footnote');
            if (!el) return;
            const note = el.dataset.note;
            if (!note) return;
            e.preventDefault();

            if (isMobile()) {
                const label = el.textContent.trim();
                const labelEl = sheet.querySelector('#footnoteSheetLabel');
                const textEl = sheet.querySelector('#footnoteSheetText');
                if (labelEl) labelEl.textContent = label;
                if (textEl) textEl.textContent = note;
                sheet.classList.add('active');
                overlay.classList.add('active');
            } else {
                tooltip.textContent = note;
                tooltip.classList.add('visible');
                const rect = el.getBoundingClientRect();
                const tooltipRect = tooltip.getBoundingClientRect();
                let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                let top = rect.top - tooltipRect.height - 10;
                if (left < 10) left = 10;
                if (left + tooltipRect.width > window.innerWidth - 10) {
                    left = window.innerWidth - tooltipRect.width - 10;
                }
                if (top < 10) top = rect.bottom + 10;
                tooltip.style.left = left + 'px';
                tooltip.style.top = top + 'px';
                clearTimeout(window._footnoteTimeout);
                window._footnoteTimeout = setTimeout(() => tooltip.classList.remove('visible'), 4000);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            const el = document.activeElement;
            if (!el || !el.classList.contains('footnote')) return;
            e.preventDefault();
            el.click();
        });

        document.querySelectorAll('.footnote').forEach(el => {
            if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
        });
    }

    /* ============================================================
       9E. AUDIO NARRATION — with Age-based Voice Journey
       ============================================================ */

    let currentUtterance = null;
    let currentAudioBtn = null;
    let currentChapterEl = null;
    let currentSpeed = 1;

    function getBestVoice(lang) {
        if (!('speechSynthesis' in window)) return null;
        const voices = window.speechSynthesis.getVoices();
        if (!voices.length) return null;
        if (lang === 'hi') {
            return voices.find(v => v.lang === 'hi-IN')
                || voices.find(v => v.lang.startsWith('hi'))
                || voices.find(v => v.lang === 'en-IN')
                || voices.find(v => v.lang.startsWith('en'))
                || voices[0];
        }
        return voices.find(v => v.lang === 'en-IN')
            || voices.find(v => v.lang.startsWith('en-IN'))
            || voices.find(v => v.lang === 'en-GB')
            || voices.find(v => v.lang.startsWith('en'))
            || voices[0];
    }

    function extractChapterText(chapterEl) {
        const paragraphs = chapterEl.querySelectorAll('p');
        const texts = [];
        paragraphs.forEach(p => {
            const text = p.textContent.trim();
            if (text.length > 5) texts.push(text);
        });
        return texts.join('. ');
    }

    function toggleChapterAudio(btn) {
        if (!('speechSynthesis' in window)) {
            showToast('Audio not supported on this browser');
            return;
        }
        const chapterEl = btn.closest('.chapter');
        if (!chapterEl) return;
        const player = btn.closest('.audio-player');
        if (!player) return;

        const progressArea = player.querySelector('.audio-player-progress');
        const progressFill = player.querySelector('.audio-progress-fill');
        const statusEl = player.querySelector('.audio-status');
        const lang = player.dataset.lang || 'en';

        if (currentAudioBtn === btn && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            btn.innerHTML = '▶ Resume';
            btn.classList.remove('playing');
            if (statusEl) statusEl.textContent = 'Paused';
            return;
        }

        if (currentAudioBtn === btn && window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            btn.innerHTML = '⏸ Pause';
            btn.classList.add('playing');
            if (statusEl) statusEl.textContent = 'Playing...';
            return;
        }

        if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();

        if (currentAudioBtn && currentAudioBtn !== btn) {
            currentAudioBtn.innerHTML = '▶ Play';
            currentAudioBtn.classList.remove('playing');
            const prevPlayer = currentAudioBtn.closest('.audio-player');
            if (prevPlayer) {
                const prevProgress = prevPlayer.querySelector('.audio-player-progress');
                if (prevProgress) prevProgress.style.display = 'none';
            }
        }

        const text = extractChapterText(chapterEl);
        if (!text) {
            showToast('No text to read');
            return;
        }

        // ⭐ Get chapter-wise voice config (age-based)
        const chapterNum = chapterEl.dataset.chapter || '1';
        const voiceCfg = VOICE_CONFIG[chapterNum] || { pitch: 1, rate: 1 };

        currentUtterance = new SpeechSynthesisUtterance(text);
        currentUtterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
        // ⭐ Combine user speed with chapter rate
        currentUtterance.rate = Math.max(0.1, Math.min(2, currentSpeed * voiceCfg.rate));
        // ⭐ Chapter-wise pitch (age feel)
        currentUtterance.pitch = Math.max(0, Math.min(2, voiceCfg.pitch));
        currentUtterance.volume = 1;

        const voice = getBestVoice(lang);
        if (voice) currentUtterance.voice = voice;

        const words = text.split(/\s+/).length;
        // Adjust duration estimate by combined rate
        const estimatedDuration = (words / 150) * 60 / (currentSpeed * voiceCfg.rate);
        const startTime = Date.now();

        btn.innerHTML = '⏸ Pause';
        btn.classList.add('playing');
        if (progressArea) progressArea.style.display = 'block';
        if (statusEl) statusEl.textContent = `Playing... (~${Math.ceil(estimatedDuration / 60)} min)`;
        if (progressFill) progressFill.style.width = '0%';

        currentAudioBtn = btn;
        currentChapterEl = chapterEl;

        const progressInterval = setInterval(() => {
            if (!window.speechSynthesis.speaking || window.speechSynthesis.paused) return;
            const elapsed = (Date.now() - startTime) / 1000;
            const percent = Math.min((elapsed / estimatedDuration) * 100, 99);
            if (progressFill) progressFill.style.width = percent + '%';
        }, 500);

        currentUtterance.onend = () => {
            clearInterval(progressInterval);
            btn.innerHTML = '▶ Play';
            btn.classList.remove('playing');
            if (progressFill) progressFill.style.width = '100%';
            if (statusEl) statusEl.textContent = 'Finished';
            setTimeout(() => {
                if (progressArea) progressArea.style.display = 'none';
                if (progressFill) progressFill.style.width = '0%';
            }, 2000);
            currentAudioBtn = null;
            currentUtterance = null;
        };

        currentUtterance.onerror = (e) => {
            clearInterval(progressInterval);
            console.warn('Speech error:', e);
            btn.innerHTML = '▶ Play';
            btn.classList.remove('playing');
            if (progressArea) progressArea.style.display = 'none';
            if (statusEl) statusEl.textContent = 'Error';
            currentAudioBtn = null;
            currentUtterance = null;
        };

        window.speechSynthesis.speak(currentUtterance);
    }

    function initAudioControls() {
        document.addEventListener('click', (e) => {
            const speedBtn = e.target.closest('.audio-speed-btn');
            if (!speedBtn) return;
            const speed = parseFloat(speedBtn.dataset.speed);
            if (!speed) return;
            const controls = speedBtn.closest('.audio-speed-controls');
            if (controls) {
                controls.querySelectorAll('.audio-speed-btn').forEach(b => b.classList.remove('active'));
                speedBtn.classList.add('active');
            }
            currentSpeed = speed;
            if (window.speechSynthesis.speaking && currentChapterEl) {
                const wasBtn = currentAudioBtn;
                window.speechSynthesis.cancel();
                if (wasBtn) {
                    wasBtn.innerHTML = '▶ Play';
                    wasBtn.classList.remove('playing');
                }
                setTimeout(() => { if (wasBtn) toggleChapterAudio(wasBtn); }, 100);
            }
            showToast(`Speed: ${speed}x`);
        });
    }

    function stopAudioIfPlaying() {
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            if (currentAudioBtn) {
                currentAudioBtn.innerHTML = '▶ Play';
                currentAudioBtn.classList.remove('playing');
                const progressArea = currentAudioBtn.closest('.audio-player')?.querySelector('.audio-player-progress');
                if (progressArea) progressArea.style.display = 'none';
            }
            currentAudioBtn = null;
            currentUtterance = null;
        }
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
        initPhotoInputs();
        initFootnotes();
        initAudioControls();

        switchLang(state.currentLang);
        showChapter(state.currentChapter, false);

        const btnEn = $('#btnEn');
        const btnHi = $('#btnHi');
        if (btnEn) btnEn.onclick = () => switchLang('en');
        if (btnHi) btnHi.onclick = () => switchLang('hi');

        document.body.classList.add('js-ready');
    }

    /* ============================================================
       12. EXPOSE GLOBALS
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

    // Wizard
    window.goToStep             = goToStep;
    window.selectLanguage       = selectLanguage;
    window.goToStep3            = goToStep3;
    window.triggerCamera        = triggerCamera;
    window.triggerUpload        = triggerUpload;
    window.startPDFGeneration   = startPDFGeneration;

    // Webcam
    window.openWebcam           = openWebcam;
    window.closeWebcam          = closeWebcam;
    window.capturePhoto         = capturePhoto;

    // Audio
    window.toggleChapterAudio   = toggleChapterAudio;

    /* ============================================================
       13. BOOT
       ============================================================ */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
