// ============================================================
// AUTOBIOGRAPHY.JS — MOBILE-OPTIMIZED VERSION
// ============================================================

// ---- GLOBAL VARIABLES ----
let currentLang = 'en';
const totalChapters = 12;
let isMobile = window.innerWidth < 768;
let qrGenerated = false;
let pdfLoaded = false;
let scrollTimeout = null;

// ============================================================
// 1. MOBILE DETECTION
// ============================================================
function checkMobile() {
    isMobile = window.innerWidth < 768;
    return isMobile;
}

// ============================================================
// 2. LAZY LOAD QR (Only when needed)
// ============================================================
function loadQRCodeLibrary() {
    return new Promise((resolve) => {
        if (typeof QRCode !== 'undefined') {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
        script.onload = resolve;
        document.head.appendChild(script);
    });
}

// ============================================================
// 3. LAZY LOAD PDF LIBRARY (Only on download click)
// ============================================================
function loadPDFLibrary() {
    return new Promise((resolve) => {
        if (typeof html2pdf !== 'undefined') {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = resolve;
        document.head.appendChild(script);
    });
}

// ============================================================
// 4. LANGUAGE TOGGLE
// ============================================================
function switchLang(lang) {
    currentLang = lang;
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
    
    // Regenerate QR only if user scrolls to gallery
    qrGenerated = false;
}

// ============================================================
// 5. RESET CHAPTERS
// ============================================================
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
    
    updateAllButtons(lang);
    updateProgressInfo(lang);
    updateDots(lang);
    updateReadingProgress(lang);
    updateModalChapterName(lang);
}

// ============================================================
// 6. NEXT CHAPTER
// ============================================================
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
        updateAllButtons(lang);
        updateProgressInfo(lang);
        updateDots(lang);
        updateReadingProgress(lang);
        updateModalChapterName(lang);
        
        // Mobile: smooth scroll only if needed
        const wrapper = document.querySelector('.autobio-wrapper');
        if (wrapper && !isMobile) {
            wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (wrapper) {
            wrapper.scrollIntoView({ block: 'start' });
        }
    }
}

// ============================================================
// 7. PREVIOUS CHAPTER
// ============================================================
function prevChapter(lang) {
    const containerId = lang === 'en' ? 'chaptersEn' : 'chaptersHi';
    const container = document.getElementById(containerId);
    const chapters = container.querySelectorAll('.chapter');
    let currentIndex = -1;

    chapters.forEach((ch, index) => {
        if (ch.classList.contains('active')) {
            currentIndex = index;
        }
    });

    if (currentIndex > 0) {
        chapters[currentIndex].classList.remove('active');
        chapters[currentIndex - 1].classList.add('active');
        updateAllButtons(lang);
        updateProgressInfo(lang);
        updateDots(lang);
        updateReadingProgress(lang);
        updateModalChapterName(lang);
        
        const wrapper = document.querySelector('.autobio-wrapper');
        if (wrapper && !isMobile) {
            wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (wrapper) {
            wrapper.scrollIntoView({ block: 'start' });
        }
    }
}

// ============================================================
// 8. UPDATE BUTTON STATES
// ============================================================
function updateAllButtons(lang) {
    const containerId = lang === 'en' ? 'chaptersEn' : 'chaptersHi';
    const container = document.getElementById(containerId);
    const chapters = container.querySelectorAll('.chapter');
    const total = chapters.length;
    
    chapters.forEach((ch, index) => {
        if (ch.classList.contains('active')) {
            const prevBtn = ch.querySelector('.prev-btn');
            const nextBtn = ch.querySelector('.next-btn');
            
            if (prevBtn) {
                prevBtn.disabled = (index === 0);
            }
            if (nextBtn) {
                nextBtn.disabled = (index === total - 1);
            }
        }
    });
}

// ============================================================
// 9. UPDATE CHAPTER PROGRESS INFO
// ============================================================
function updateProgressInfo(lang) {
    const containerId = lang === 'en' ? 'chaptersEn' : 'chaptersHi';
    const container = document.getElementById(containerId);
    const chapters = container.querySelectorAll('.chapter');
    let currentIndex = -1;
    
    chapters.forEach((ch, index) => {
        if (ch.classList.contains('active')) {
            currentIndex = index;
        }
    });
    
    if (currentIndex !== -1) {
        const chapterNum = currentIndex + 1;
        const percent = Math.round((chapterNum / totalChapters) * 100);
        
        const numDisplay = document.getElementById('chapterNumDisplay');
        const percentDisplay = document.getElementById('chapterPercentDisplay');
        
        if (numDisplay) {
            numDisplay.textContent = `Chapter ${chapterNum} of ${totalChapters}`;
        }
        if (percentDisplay) {
            percentDisplay.textContent = `${percent}% complete`;
        }
    }
}

// ============================================================
// 10. UPDATE PROGRESS DOTS
// ============================================================
function updateDots(lang) {
    const containerId = lang === 'en' ? 'chaptersEn' : 'chaptersHi';
    const container = document.getElementById(containerId);
    const chapters = container.querySelectorAll('.chapter');
    let currentIndex = -1;
    
    chapters.forEach((ch, index) => {
        if (ch.classList.contains('active')) {
            currentIndex = index;
        }
    });
    
    if (currentIndex !== -1) {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
}

// ============================================================
// 11. UPDATE READING PROGRESS BAR (Throttled)
// ============================================================
function updateReadingProgress(lang) {
    const containerId = lang === 'en' ? 'chaptersEn' : 'chaptersHi';
    const container = document.getElementById(containerId);
    const chapters = container.querySelectorAll('.chapter');
    let currentIndex = -1;
    
    chapters.forEach((ch, index) => {
        if (ch.classList.contains('active')) {
            currentIndex = index;
        }
    });
    
    if (currentIndex !== -1) {
        const percent = ((currentIndex + 1) / totalChapters) * 100;
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
    }
}

// ============================================================
// 12. SCROLL PROGRESS BAR (Throttled for mobile)
// ============================================================
function updateScrollProgress() {
    if (scrollTimeout) return;
    
    scrollTimeout = setTimeout(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            const chapterPercent = parseFloat(progressBar.style.width) || 0;
            if (scrollPercent > 0 && scrollPercent > chapterPercent) {
                progressBar.style.width = Math.min(scrollPercent, 100) + '%';
            }
        }
        scrollTimeout = null;
    }, isMobile ? 200 : 100);
}

// ============================================================
// 13. BACK TO TOP
// ============================================================
function toggleBackToTop() {
    const btn = document.getElementById('backToTop');
    if (window.scrollY > 400) {
        btn.classList.add('visible');
    } else {
        btn.classList.remove('visible');
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToQRGallery() {
    const gallery = document.getElementById('qrGallery');
    if (gallery) {
        gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Generate QR only when user scrolls to gallery
        if (!qrGenerated) {
            setTimeout(generateGalleryQRs, 300);
        }
    }
}

// ============================================================
// 14. READING MODE TOGGLE
// ============================================================
function toggleReadingMode() {
    document.body.classList.toggle('reading-mode');
    const btn = document.getElementById('readingModeToggle');
    if (document.body.classList.contains('reading-mode')) {
        btn.innerHTML = '☀️ Normal Mode';
        localStorage.setItem('readingMode', 'enabled');
    } else {
        btn.innerHTML = '📖 Reading Mode';
        localStorage.setItem('readingMode', 'disabled');
    }
}

function loadReadingMode() {
    const savedMode = localStorage.getItem('readingMode');
    if (savedMode === 'enabled') {
        document.body.classList.add('reading-mode');
        const btn = document.getElementById('readingModeToggle');
        if (btn) {
            btn.innerHTML = '☀️ Normal Mode';
        }
    }
}

// ============================================================
// 15. SURPRISE ME
// ============================================================
function surpriseMe() {
    const randomChapter = Math.floor(Math.random() * totalChapters) + 1;
    const lang = currentLang || 'en';
    
    const containerId = lang === 'en' ? 'chaptersEn' : 'chaptersHi';
    const container = document.getElementById(containerId);
    const chapters = container.querySelectorAll('.chapter');
    
    chapters.forEach((ch, index) => {
        if (index === randomChapter - 1) {
            ch.classList.add('active');
        } else {
            ch.classList.remove('active');
        }
    });
    
    updateAllButtons(lang);
    updateProgressInfo(lang);
    updateDots(lang);
    updateReadingProgress(lang);
    updateModalChapterName(lang);
    
    const wrapper = document.querySelector('.autobio-wrapper');
    if (wrapper) {
        wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    showToast(`🎲 Surprise! Chapter ${randomChapter}`, 'success');
}

// ============================================================
// 16. COPY CHAPTER LINK
// ============================================================
function copyChapterLink(chapterNum) {
    const url = window.location.href.split('#')[0] + `#chapter${chapterNum}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            showCopyFeedback(chapterNum);
        }).catch(() => {
            fallbackCopy(url, chapterNum);
        });
    } else {
        fallbackCopy(url, chapterNum);
    }
}

function fallbackCopy(text, chapterNum) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showCopyFeedback(chapterNum);
}

function showCopyFeedback(chapterNum) {
    const containerId = currentLang === 'en' ? 'chaptersEn' : 'chaptersHi';
    const container = document.getElementById(containerId);
    const chapter = container.querySelector(`.chapter[data-chapter="${chapterNum}"]`);
    
    if (chapter) {
        const btn = chapter.querySelector('.copy-link-btn');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '✅ Copied!';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('copied');
            }, 2000);
        }
    }
    showToast('✅ Link copied!', 'success');
}

// ============================================================
// 17. GOOGLE TRANSLATE
// ============================================================
function openGoogleTranslate() {
    const url = window.location.href;
    window.open('https://translate.google.com/translate?sl=auto&tl=hi&u=' + encodeURIComponent(url), '_blank');
}

// ============================================================
// 18. KEYBOARD SHORTCUTS (Mobile friendly)
// ============================================================
function handleKeyboardShortcuts(e) {
    if (isMobile) return; // Disable keyboard shortcuts on mobile
    
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevChapter(currentLang);
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextChapter(currentLang);
    } else if (e.key === 'Home') {
        e.preventDefault();
        const containerId = currentLang === 'en' ? 'chaptersEn' : 'chaptersHi';
        const container = document.getElementById(containerId);
        const chapters = container.querySelectorAll('.chapter');
        chapters.forEach((ch, index) => {
            if (index === 0) {
                ch.classList.add('active');
            } else {
                ch.classList.remove('active');
            }
        });
        updateAllButtons(currentLang);
        updateProgressInfo(currentLang);
        updateDots(currentLang);
        updateReadingProgress(currentLang);
        updateModalChapterName(currentLang);
    } else if (e.key === 'End') {
        e.preventDefault();
        const containerId = currentLang === 'en' ? 'chaptersEn' : 'chaptersHi';
        const container = document.getElementById(containerId);
        const chapters = container.querySelectorAll('.chapter');
        chapters.forEach((ch, index) => {
            if (index === chapters.length - 1) {
                ch.classList.add('active');
            } else {
                ch.classList.remove('active');
            }
        });
        updateAllButtons(currentLang);
        updateProgressInfo(currentLang);
        updateDots(currentLang);
        updateReadingProgress(currentLang);
        updateModalChapterName(currentLang);
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        nextChapter(currentLang);
    }
}

// ============================================================
// 19. DOT CLICK NAVIGATION
// ============================================================
function setupDotNavigation() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot) => {
        dot.addEventListener('click', function() {
            const chapterNum = parseInt(this.dataset.dot);
            if (!isNaN(chapterNum)) {
                const containerId = currentLang === 'en' ? 'chaptersEn' : 'chaptersHi';
                const container = document.getElementById(containerId);
                const chapters = container.querySelectorAll('.chapter');
                
                chapters.forEach((ch, index) => {
                    if (index === chapterNum - 1) {
                        ch.classList.add('active');
                    } else {
                        ch.classList.remove('active');
                    }
                });
                
                updateAllButtons(currentLang);
                updateProgressInfo(currentLang);
                updateDots(currentLang);
                updateReadingProgress(currentLang);
                updateModalChapterName(currentLang);
            }
        });
    });
}

// ============================================================
// 20. HANDLE CHAPTER HASH
// ============================================================
function handleChapterHash() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#chapter')) {
        const chapterNum = parseInt(hash.replace('#chapter', ''));
        if (!isNaN(chapterNum) && chapterNum >= 1 && chapterNum <= totalChapters) {
            const containerId = currentLang === 'en' ? 'chaptersEn' : 'chaptersHi';
            const container = document.getElementById(containerId);
            const chapters = container.querySelectorAll('.chapter');
            
            chapters.forEach((ch, index) => {
                if (index === chapterNum - 1) {
                    ch.classList.add('active');
                } else {
                    ch.classList.remove('active');
                }
            });
            
            updateAllButtons(currentLang);
            updateProgressInfo(currentLang);
            updateDots(currentLang);
            updateReadingProgress(currentLang);
            updateModalChapterName(currentLang);
        }
    }
}

// ============================================================
// 21. SWIPE SUPPORT (Mobile only)
// ============================================================
let touchStartX = 0;
let touchEndX = 0;
let isSwiping = false;

function setupSwipeSupport() {
    if (!isMobile) return;
    
    const wrapper = document.querySelector('.autobio-wrapper');
    if (!wrapper) return;
    
    wrapper.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        isSwiping = false;
    }, { passive: true });
    
    wrapper.addEventListener('touchmove', function(e) {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 20) {
            isSwiping = true;
        }
    }, { passive: true });
    
    wrapper.addEventListener('touchend', function(e) {
        if (!isSwiping) return;
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextChapter(currentLang);
        } else {
            prevChapter(currentLang);
        }
    }
}

// ============================================================
// 22. TOAST NOTIFICATION
// ============================================================
function showToast(message, type = '') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = 'toast';
    if (type) {
        toast.classList.add(type);
    }
    toast.classList.add('show');
    
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================================
// 23. DOWNLOAD MODAL
// ============================================================
function openModal() {
    const modal = document.getElementById('downloadModal');
    if (modal) {
        modal.classList.add('active');
        updateModalChapterName(currentLang);
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('downloadModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function updateModalChapterName(lang) {
    const containerId = lang === 'en' ? 'chaptersEn' : 'chaptersHi';
    const container = document.getElementById(containerId);
    const chapters = container.querySelectorAll('.chapter');
    let chapterTitle = '';
    
    chapters.forEach((ch) => {
        if (ch.classList.contains('active')) {
            const h3 = ch.querySelector('h3');
            if (h3) {
                chapterTitle = h3.textContent.trim();
            }
        }
    });
    
    const modalName = document.getElementById('modalChapterName');
    if (modalName && chapterTitle) {
        modalName.textContent = chapterTitle;
    }
}

// Close modal on backdrop click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('downloadModal');
    if (modal && modal.classList.contains('active')) {
        if (e.target === modal) {
            closeModal();
        }
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ============================================================
// 24. DOWNLOAD FULL BOOK PDF (Loads library on demand)
// ============================================================
async function downloadFullPDF() {
    const wrapper = document.querySelector('.autobio-wrapper');
    if (!wrapper) {
        showToast('❌ Error: Content not found', 'error');
        return;
    }
    
    showToast('📄 Loading PDF library...', 'success');
    closeModal();
    
    // Load PDF library only when needed
    await loadPDFLibrary();
    
    showToast('📄 Generating PDF...', 'success');
    
    // Clone wrapper for PDF generation
    const clone = wrapper.cloneNode(true);
    
    // Remove interactive elements from clone
    const removeSelectors = [
        '.lang-controls', '.download-actions', '.nav-buttons', 
        '.progress-dots', '.chapter-progress-info', '.copy-link-btn',
        '.chapter-qr', '.qr-gallery', '.back-to-top', '.reading-mode-toggle',
        '.progress-bar', '.toast', '.modal-overlay'
    ];
    removeSelectors.forEach(selector => {
        clone.querySelectorAll(selector).forEach(el => el.remove());
    });
    
    // Add cover page
    const cover = document.createElement('div');
    cover.style.cssText = `
        text-align: center;
        padding: 60px 40px;
        border-bottom: 2px solid #DAA520;
        margin-bottom: 30px;
    `;
    cover.innerHTML = `
        <h1 style="font-size:36px;color:#6c5ce7;font-family:'Space Grotesk',sans-serif;">📖 My Autobiography</h1>
        <p style="font-size:24px;color:#DAA520;font-style:italic;margin:10px 0;">"A Boy Who Never Thought"</p>
        <p style="font-size:18px;color:#666;margin:6px 0;">From Begusarai to the World</p>
        <p style="font-size:16px;color:#999;">Ravi Raj · March 2008 · Patna, India</p>
        <hr style="margin:30px 0;border-color:#eee;">
        <p style="font-size:14px;color:#999;">All 12 Chapters · Complete Autobiography</p>
        <p style="font-size:14px;color:#999;">Generated: ${new Date().toLocaleDateString()}</p>
    `;
    clone.insertBefore(cover, clone.firstChild);
    
    // Remove photo placeholder hints
    clone.querySelectorAll('.upload-hint').forEach(el => {
        el.textContent = '📸 Photo';
    });
    
    // Generate PDF
    const opt = {
        margin: [15, 15, 15, 15],
        filename: 'My_Autobiography_Ravi_Raj_Full.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            letterRendering: true,
            backgroundColor: '#ffffff'
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait' 
        },
        pagebreak: { mode: ['css', 'legacy'] }
    };
    
    html2pdf().set(opt).from(clone).save().then(() => {
        showToast('✅ Full book downloaded!', 'success');
    }).catch(() => {
        showToast('❌ Download failed. Please try again.', 'error');
    });
}

// ============================================================
// 25. DOWNLOAD CHAPTER PDF (Loads library on demand)
// ============================================================
async function downloadChapterPDF() {
    const containerId = currentLang === 'en' ? 'chaptersEn' : 'chaptersHi';
    const container = document.getElementById(containerId);
    const chapters = container.querySelectorAll('.chapter');
    let activeChapter = null;
    let chapterNum = 0;
    
    chapters.forEach((ch, index) => {
        if (ch.classList.contains('active')) {
            activeChapter = ch;
            chapterNum = index + 1;
        }
    });
    
    if (!activeChapter) {
        showToast('❌ No chapter found', 'error');
        return;
    }
    
    showToast('📄 Loading PDF library...', 'success');
    closeModal();
    
    // Load PDF library only when needed
    await loadPDFLibrary();
    
    showToast('📄 Generating chapter PDF...', 'success');
    
    // Clone chapter
    const clone = activeChapter.cloneNode(true);
    
    // Remove interactive elements
    clone.querySelectorAll('.copy-link-btn, .chapter-qr, .nav-buttons').forEach(el => el.remove());
    clone.querySelectorAll('.upload-hint').forEach(el => {
        el.textContent = '📸 Photo';
    });
    
    // Add header
    const header = document.createElement('div');
    header.style.cssText = `
        text-align: center;
        padding: 20px 0 30px 0;
        border-bottom: 2px solid #DAA520;
        margin-bottom: 20px;
    `;
    const title = clone.querySelector('h3');
    const titleText = title ? title.textContent : `Chapter ${chapterNum}`;
    header.innerHTML = `
        <h1 style="font-size:24px;color:#6c5ce7;font-family:'Space Grotesk',sans-serif;">📖 My Autobiography</h1>
        <p style="font-size:18px;color:#DAA520;margin:4px 0;">${titleText}</p>
        <p style="font-size:12px;color:#999;">Ravi Raj · ${new Date().toLocaleDateString()}</p>
    `;
    clone.insertBefore(header, clone.firstChild);
    
    // Generate PDF
    const opt = {
        margin: [15, 15, 15, 15],
        filename: `Chapter_${chapterNum}_Ravi_Raj.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            letterRendering: true,
            backgroundColor: '#ffffff'
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait' 
        }
    };
    
    html2pdf().set(opt).from(clone).save().then(() => {
        showToast(`✅ Chapter ${chapterNum} downloaded!`, 'success');
    }).catch(() => {
        showToast('❌ Download failed. Please try again.', 'error');
    });
}

// ============================================================
// 26. DOWNLOAD TXT
// ============================================================
function downloadTXT() {
    const containerId = currentLang === 'en' ? 'chaptersEn' : 'chaptersHi';
    const container = document.getElementById(containerId);
    const chapters = container.querySelectorAll('.chapter');
    let text = '';
    const langLabel = currentLang === 'en' ? 'English' : 'Hinglish';
    
    text += '========================================\n';
    text += '📖 MY AUTOBIOGRAPHY — RAVI RAJ\n';
    text += `Language: ${langLabel}\n`;
    text += `Generated: ${new Date().toLocaleString()}\n`;
    text += '========================================\n\n';
    
    chapters.forEach((ch, index) => {
        const h3 = ch.querySelector('h3');
        const title = h3 ? h3.textContent.trim() : `Chapter ${index + 1}`;
        text += `\n--- ${title} ---\n\n`;
        
        const paragraphs = ch.querySelectorAll('p');
        paragraphs.forEach(p => {
            if (p.textContent.trim() && !p.textContent.includes('min read')) {
                text += p.textContent.trim() + '\n\n';
            }
        });
        
        const quotes = ch.querySelectorAll('.quote-box');
        quotes.forEach(q => {
            text += q.textContent.trim() + '\n\n';
        });
        
        text += '\n' + '─'.repeat(40) + '\n';
    });
    
    text += '\n========================================\n';
    text += 'End of Autobiography\n';
    text += `📖 ${totalChapters} Chapters · ${new Date().getFullYear()}\n`;
    text += '========================================\n';
    
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `My_Autobiography_Ravi_Raj_${currentLang.toUpperCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    closeModal();
    showToast('✅ TXT downloaded!', 'success');
}

// ============================================================
// 27. PRINT
// ============================================================
function printBook() {
    closeModal();
    setTimeout(() => {
        window.print();
    }, 300);
}

// ============================================================
// 28. QR CODE GENERATION (Only when needed)
// ============================================================
async function generateQR(containerId, chapterNum) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Clear existing QR
    container.innerHTML = '';
    
    const url = window.location.href.split('#')[0] + `#chapter${chapterNum}`;
    
    // Load QR library only when needed
    await loadQRCodeLibrary();
    
    try {
        new QRCode(container, {
            text: url,
            width: isMobile ? 60 : 80,
            height: isMobile ? 60 : 80,
            colorDark: '#DAA520',
            colorLight: '#0a0a0f',
            correctLevel: QRCode.CorrectLevel.H
        });
    } catch (e) {
        container.innerHTML = `<span style="font-size:10px;color:var(--text3);">📱 QR</span>`;
    }
}

// ============================================================
// 29. GENERATE GALLERY QR (Lazy load on scroll)
// ============================================================
let galleryQRGenerated = false;

async function generateGalleryQRs() {
    if (galleryQRGenerated) return;
    galleryQRGenerated = true;
    
    // Load QR library first
    await loadQRCodeLibrary();
    
    const grid = document.getElementById('qrGrid');
    if (!grid) return;
    
    // Clear grid first
    grid.innerHTML = '';
    
    for (let i = 1; i <= totalChapters; i++) {
        const item = document.createElement('div');
        item.className = 'qr-item';
        
        const number = document.createElement('span');
        number.className = 'qr-number';
        number.textContent = `Chapter ${i}`;
        item.appendChild(number);
        
        const qrContainer = document.createElement('div');
        qrContainer.id = `qr-gallery-${i}`;
        qrContainer.style.cssText = 'display:flex;justify-content:center;';
        item.appendChild(qrContainer);
        
        const label = document.createElement('span');
        label.className = 'qr-label-small';
        label.textContent = '📱 Scan to read';
        item.appendChild(label);
        
        grid.appendChild(item);
        
        // Generate QR for gallery
        const url = window.location.href.split('#')[0] + `#chapter${i}`;
        try {
            new QRCode(qrContainer, {
                text: url,
                width: isMobile ? 80 : 100,
                height: isMobile ? 80 : 100,
                colorDark: '#DAA520',
                colorLight: '#0a0a0f',
                correctLevel: QRCode.CorrectLevel.H
            });
        } catch (e) {
            qrContainer.innerHTML = `<span style="font-size:12px;color:var(--text3);">📱 QR</span>`;
        }
    }
}

// ============================================================
// 30. DOWNLOAD ALL QR CODES
// ============================================================
function downloadAllQR() {
    showToast('📱 Generating QR codes...', 'success');
    
    const canvases = [];
    const galleryItems = document.querySelectorAll('.qr-item');
    
    galleryItems.forEach((item, index) => {
        const canvas = item.querySelector('canvas');
        if (canvas) {
            canvases.push({
                canvas: canvas,
                name: `Chapter_${index + 1}_QR.png`
            });
        }
    });
    
    if (canvases.length === 0) {
        showToast('❌ No QR codes found', 'error');
        return;
    }
    
    canvases.forEach((item, idx) => {
        setTimeout(() => {
            const link = document.createElement('a');
            link.download = item.name;
            link.href = item.canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }, idx * 300);
    });
    
    setTimeout(() => {
        showToast(`✅ ${canvases.length} QR codes downloaded!`, 'success');
    }, canvases.length * 300 + 500);
}

// ============================================================
// 31. INTERSECTION OBSERVER FOR QR (Mobile performance)
// ============================================================
function setupQRIntersectionObserver() {
    if (!isMobile) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const gallery = document.getElementById('qrGallery');
                if (gallery && !galleryQRGenerated) {
                    generateGalleryQRs();
                }
            }
        });
    }, { threshold: 0.1 });
    
    const gallery = document.getElementById('qrGallery');
    if (gallery) {
        observer.observe(gallery);
    }
}

// ============================================================
// 32. INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    // Check mobile
    checkMobile();
    
    currentLang = 'en';
    
    document.getElementById('chaptersEn').style.display = 'block';
    document.getElementById('chaptersHi').style.display = 'none';
    
    resetChapters('en');
    loadReadingMode();
    handleChapterHash();
    setupDotNavigation();
    setupSwipeSupport();
    
    // Keyboard shortcuts (only desktop)
    if (!isMobile) {
        document.addEventListener('keydown', handleKeyboardShortcuts);
    }
    
    // Scroll events with throttling
    window.addEventListener('scroll', function() {
        toggleBackToTop();
        updateScrollProgress();
    }, { passive: true });
    
    // Generate chapter QR only when needed (lazy)
    // Instead of generating all 24 QR, generate on demand
    
    // Setup QR gallery observer for mobile
    setupQRIntersectionObserver();
    
    // Update scroll progress on load
    setTimeout(updateScrollProgress, 600);
    
    // Update mobile status on resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const wasMobile = isMobile;
            checkMobile();
            if (wasMobile !== isMobile) {
                // Mobile status changed
                if (isMobile) {
                    document.removeEventListener('keydown', handleKeyboardShortcuts);
                } else {
                    document.addEventListener('keydown', handleKeyboardShortcuts);
                }
            }
        }, 300);
    }, { passive: true });
});

// ============================================================
// 33. EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ============================================================
window.switchLang = switchLang;
window.nextChapter = nextChapter;
window.prevChapter = prevChapter;
window.surpriseMe = surpriseMe;
window.copyChapterLink = copyChapterLink;
window.openGoogleTranslate = openGoogleTranslate;
window.toggleReadingMode = toggleReadingMode;
window.scrollToTop = scrollToTop;
window.scrollToQRGallery = scrollToQRGallery;
window.openModal = openModal;
window.closeModal = closeModal;
window.downloadFullPDF = downloadFullPDF;
window.downloadChapterPDF = downloadChapterPDF;
window.downloadTXT = downloadTXT;
window.printBook = printBook;
window.downloadAllQR = downloadAllQR;
window.generateGalleryQRs = generateGalleryQRs;
window.showToast = showToast;
