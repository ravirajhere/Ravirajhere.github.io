// ============================================================
// AUTOBIOGRAPHY.JS — SIMPLIFIED & MOBILE-OPTIMIZED
// FIX: Ebook download includes ALL 12 chapters
// ============================================================

// ---- GLOBAL VARIABLES ----
let currentLang = 'en';
const totalChapters = 12;

// ============================================================
// 1. LANGUAGE TOGGLE
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
}

// ============================================================
// 2. RESET CHAPTERS
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
    updateModalChapterName(lang);
}

// ============================================================
// 3. SCROLL TO CHAPTER HEADING (Helper Function)
// ============================================================
function scrollToChapterHeading(lang) {
    const containerId = lang === 'en' ? 'chaptersEn' : 'chaptersHi';
    const container = document.getElementById(containerId);
    const chapters = container.querySelectorAll('.chapter');
    
    chapters.forEach((ch) => {
        if (ch.classList.contains('active')) {
            const heading = ch.querySelector('h3');
            if (heading) {
                heading.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
            return;
        }
    });
}

// ============================================================
// 4. NEXT CHAPTER
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
        updateModalChapterName(lang);
        
        setTimeout(function() {
            scrollToChapterHeading(lang);
        }, 150);
    }
}

// ============================================================
// 5. PREVIOUS CHAPTER
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
        updateModalChapterName(lang);
        
        setTimeout(function() {
            scrollToChapterHeading(lang);
        }, 150);
    }
}

// ============================================================
// 6. UPDATE BUTTON STATES
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
// 7. UPDATE CHAPTER PROGRESS INFO
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
// 8. UPDATE PROGRESS DOTS
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
// 9. UPDATE MODAL CHAPTER NAME
// ============================================================
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

// ============================================================
// 10. READING MODE TOGGLE
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
// 11. COPY CHAPTER LINK
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
// 12. GOOGLE TRANSLATE
// ============================================================
function openGoogleTranslate() {
    const url = window.location.href;
    window.open('https://translate.google.com/translate?sl=auto&tl=hi&u=' + encodeURIComponent(url), '_blank');
}

// ============================================================
// 13. TOAST NOTIFICATION
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
// 14. DOWNLOAD MODAL
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
// 15. LAZY LOAD PDF LIBRARY
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
// 16. MAKE ALL CHAPTERS VISIBLE (Helper for Ebook)
// ============================================================
function makeAllChaptersVisible(lang) {
    const containerId = lang === 'en' ? 'chaptersEn' : 'chaptersHi';
    const container = document.getElementById(containerId);
    const chapters = container.querySelectorAll('.chapter');
    
    // Store current active chapter to restore later
    let activeIndex = -1;
    chapters.forEach((ch, index) => {
        if (ch.classList.contains('active')) {
            activeIndex = index;
        }
        // Make all chapters visible for PDF
        ch.style.display = 'block';
    });
    
    return activeIndex;
}

function restoreChapterVisibility(lang, activeIndex) {
    const containerId = lang === 'en' ? 'chaptersEn' : 'chaptersHi';
    const container = document.getElementById(containerId);
    const chapters = container.querySelectorAll('.chapter');
    
    chapters.forEach((ch, index) => {
        // Restore display based on active state
        if (index === activeIndex) {
            ch.style.display = 'block';
            ch.classList.add('active');
        } else {
            ch.style.display = 'none';
            ch.classList.remove('active');
        }
    });
}

// ============================================================
// 17. DOWNLOAD FULL EBOOK PDF (FIXED — All 12 Chapters)
// ============================================================
async function downloadFullPDF() {
    const wrapper = document.querySelector('.autobio-wrapper');
    if (!wrapper) {
        showToast('❌ Error: Content not found', 'error');
        return;
    }
    
    showToast('📄 Loading PDF library...', 'success');
    closeModal();
    
    await loadPDFLibrary();
    
    showToast('📄 Generating ebook...', 'success');
    
    // ---- STEP 1: Make ALL chapters visible for the current language ----
    const lang = currentLang;
    const activeIndex = makeAllChaptersVisible(lang);
    
    // ---- STEP 2: Clone the page ----
    const clone = wrapper.cloneNode(true);
    
    // ---- STEP 3: Restore original visibility on the LIVE page ----
    restoreChapterVisibility(lang, activeIndex);
    
    // ---- STEP 4: Clean up the clone ----
    const removeSelectors = [
        '.lang-controls', '.download-actions', '.nav-buttons', 
        '.progress-dots', '.chapter-progress-info', '.copy-link-btn',
        '.back-to-top', '.reading-mode-toggle', '.toast', '.modal-overlay'
    ];
    removeSelectors.forEach(selector => {
        clone.querySelectorAll(selector).forEach(el => el.remove());
    });
    
    // ---- STEP 5: Make all chapters visible in clone too ----
    const cloneContainerId = lang === 'en' ? 'chaptersEn' : 'chaptersHi';
    const cloneContainer = clone.querySelector('#' + cloneContainerId);
    if (cloneContainer) {
        const cloneChapters = cloneContainer.querySelectorAll('.chapter');
        cloneChapters.forEach(ch => {
            ch.style.display = 'block';
            ch.classList.add('active');
        });
    }
    
    // ---- STEP 6: Remove photo placeholder hints ----
    clone.querySelectorAll('.upload-hint').forEach(el => {
        el.textContent = '📸 Photo';
    });
    
    // ---- STEP 7: Add Cover Page ----
    const cover = document.createElement('div');
    cover.style.cssText = `
        text-align: center;
        padding: 80px 40px 60px 40px;
        border-bottom: 2px solid #DAA520;
        margin-bottom: 30px;
        page-break-after: always;
    `;
    cover.innerHTML = `
        <h1 style="font-size:48px;color:#6c5ce7;font-family:'Space Grotesk',sans-serif;margin-bottom:20px;">📖 My Autobiography</h1>
        <p style="font-size:28px;color:#DAA520;font-style:italic;margin:10px 0;">"A Boy Who Never Thought"</p>
        <p style="font-size:20px;color:#666;margin:10px 0;">Ravi Raj</p>
        <p style="font-size:18px;color:#999;margin:6px 0;">From Begusarai to the World</p>
        <hr style="margin:40px auto;width:50%;border-color:#DAA520;">
        <p style="font-size:16px;color:#999;margin:6px 0;">March 2008 · Patna, India</p>
        <p style="font-size:14px;color:#aaa;margin-top:20px;">Complete Autobiography · ${new Date().getFullYear()}</p>
    `;
    clone.insertBefore(cover, clone.firstChild);
    
    // ---- STEP 8: Add Title Page ----
    const titlePage = document.createElement('div');
    titlePage.style.cssText = `
        text-align: center;
        padding: 100px 40px;
        page-break-after: always;
        border-bottom: 1px solid #eee;
        margin-bottom: 30px;
    `;
    titlePage.innerHTML = `
        <h1 style="font-size:36px;color:#6c5ce7;font-family:'Space Grotesk',sans-serif;">My Autobiography</h1>
        <p style="font-size:22px;color:#DAA520;margin:15px 0;">Ravi Raj</p>
        <p style="font-size:16px;color:#666;margin:5px 0;">"A Boy Who Never Thought"</p>
        <p style="font-size:16px;color:#666;margin:5px 0;">From Begusarai to the World</p>
        <hr style="margin:30px auto;width:30%;border-color:#DAA520;">
        <p style="font-size:14px;color:#999;">Published in ${new Date().getFullYear()}</p>
    `;
    clone.insertBefore(titlePage, cover.nextSibling);
    
    // ---- STEP 9: Add Table of Contents ----
    const toc = document.createElement('div');
    toc.style.cssText = `
        padding: 40px 40px;
        page-break-after: always;
        border-bottom: 1px solid #eee;
        margin-bottom: 30px;
    `;
    let tocHTML = `<h2 style="font-size:28px;color:#6c5ce7;font-family:'Space Grotesk',sans-serif;text-align:center;margin-bottom:30px;">Table of Contents</h2><ul style="list-style:none;padding:0;font-size:18px;line-height:2.2;">`;
    const tocChapters = clone.querySelectorAll('.chapter');
    tocChapters.forEach((ch, idx) => {
        const h3 = ch.querySelector('h3');
        const title = h3 ? h3.textContent.trim() : `Chapter ${idx+1}`;
        tocHTML += `<li style="border-bottom:1px solid #f0f0f0;padding:6px 0;display:flex;justify-content:space-between;">`;
        tocHTML += `<span style="color:#333;">${title}</span>`;
        tocHTML += `<span style="color:#999;">Page ${idx+7}</span>`;
        tocHTML += `</li>`;
    });
    tocHTML += `</ul>`;
    toc.innerHTML = tocHTML;
    clone.insertBefore(toc, titlePage.nextSibling);
    
    // ---- STEP 10: Add About the Author ----
    const about = document.createElement('div');
    about.style.cssText = `
        padding: 40px 40px;
        page-break-after: always;
        border-bottom: 1px solid #eee;
        margin-bottom: 30px;
        text-align: center;
    `;
    about.innerHTML = `
        <h2 style="font-size:28px;color:#6c5ce7;font-family:'Space Grotesk',sans-serif;margin-bottom:20px;">About the Author</h2>
        <div style="width:120px;height:120px;border-radius:50%;border:3px solid #DAA520;margin:0 auto 20px;overflow:hidden;">
            <img src="Singh_ravirajhere.jpeg" alt="Ravi Raj" style="width:100%;height:100%;object-fit:cover;">
        </div>
        <p style="font-size:20px;font-weight:600;color:#333;">Ravi Raj</p>
        <p style="font-size:16px;color:#666;margin:4px 0;">Born: 13 March 2008 · Begusarai, Bihar</p>
        <p style="font-size:16px;color:#666;margin:4px 0;">From: Patna, India</p>
        <p style="font-size:16px;color:#666;margin:4px 0;font-style:italic;">"A boy who turned his dreams into code."</p>
        <hr style="margin:20px auto;width:30%;border-color:#DAA520;">
        <div style="display:flex;justify-content:center;gap:20px;flex-wrap:wrap;margin-top:15px;">
            <span style="background:#f0f0f0;padding:6px 16px;border-radius:20px;font-size:14px;color:#333;">💻 3+ Years Coding</span>
            <span style="background:#f0f0f0;padding:6px 16px;border-radius:20px;font-size:14px;color:#333;">🚀 5+ Projects</span>
            <span style="background:#f0f0f0;padding:6px 16px;border-radius:20px;font-size:14px;color:#333;">📚 Loves Novels</span>
        </div>
    `;
    clone.insertBefore(about, toc.nextSibling);
    
    // ---- STEP 11: Add Overview ----
    const overview = document.createElement('div');
    overview.style.cssText = `
        padding: 40px 40px;
        page-break-after: always;
        border-bottom: 1px solid #eee;
        margin-bottom: 30px;
    `;
    overview.innerHTML = `
        <h2 style="font-size:28px;color:#6c5ce7;font-family:'Space Grotesk',sans-serif;text-align:center;margin-bottom:20px;">Overview</h2>
        <p style="font-size:18px;line-height:1.8;color:#444;text-align:center;max-width:600px;margin:0 auto;">
            This autobiography takes you through the journey of Ravi Raj — from his humble beginnings in Begusarai, 
            Bihar, to becoming a passionate coder and dreamer. It covers childhood memories, school days, family, 
            friendships, struggles, and the joy of building something from nothing. A story of a boy who never 
            thought he would, but did.
        </p>
        <hr style="margin:30px auto;width:30%;border-color:#DAA520;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:500px;margin:0 auto;">
            <div style="background:#f9f9f9;padding:12px;border-radius:8px;text-align:center;">
                <span style="font-size:22px;font-weight:700;color:#DAA520;">12</span>
                <p style="font-size:14px;color:#666;margin:2px 0;">Chapters</p>
            </div>
            <div style="background:#f9f9f9;padding:12px;border-radius:8px;text-align:center;">
                <span style="font-size:22px;font-weight:700;color:#DAA520;">2008</span>
                <p style="font-size:14px;color:#666;margin:2px 0;">Year of Birth</p>
            </div>
            <div style="background:#f9f9f9;padding:12px;border-radius:8px;text-align:center;">
                <span style="font-size:22px;font-weight:700;color:#DAA520;">3+</span>
                <p style="font-size:14px;color:#666;margin:2px 0;">Years Coding</p>
            </div>
            <div style="background:#f9f9f9;padding:12px;border-radius:8px;text-align:center;">
                <span style="font-size:22px;font-weight:700;color:#DAA520;">14</span>
                <p style="font-size:14px;color:#666;margin:2px 0;">Friends</p>
            </div>
        </div>
    `;
    clone.insertBefore(overview, about.nextSibling);
    
    // ---- STEP 12: Add Last Page ----
    const lastPage = document.createElement('div');
    lastPage.style.cssText = `
        text-align: center;
        padding: 60px 40px;
        border-top: 2px solid #DAA520;
        margin-top: 30px;
        page-break-before: always;
    `;
    lastPage.innerHTML = `
        <h2 style="font-size:28px;color:#6c5ce7;font-family:'Space Grotesk',sans-serif;margin-bottom:20px;">🌟</h2>
        <p style="font-size:22px;font-weight:500;color:#333;font-style:italic;">
            "No regrets in life — that's my biggest achievement."
        </p>
        <p style="font-size:18px;color:#DAA520;margin:20px 0;">— Ravi Raj</p>
        <hr style="margin:40px auto;width:30%;border-color:#DAA520;">
        <p style="font-size:16px;color:#666;">Thank you for reading</p>
        <p style="font-size:14px;color:#999;margin-top:10px;">Ravi Raj · March ${new Date().getFullYear()}</p>
        <p style="font-size:14px;color:#999;margin-top:6px;">📖 From Begusarai to the World</p>
    `;
    clone.appendChild(lastPage);
    
    // ---- STEP 13: Generate PDF ----
    const opt = {
        margin: [15, 15, 15, 15],
        filename: 'My_Autobiography_Ravi_Raj_Ebook.pdf',
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
        showToast('✅ Ebook downloaded!', 'success');
    }).catch(() => {
        showToast('❌ Download failed. Please try again.', 'error');
    });
}

// ============================================================
// 18. HANDLE CHAPTER HASH IN URL
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
            updateModalChapterName(currentLang);
            
            setTimeout(function() {
                scrollToChapterHeading(currentLang);
            }, 300);
        }
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
                updateModalChapterName(currentLang);
                
                setTimeout(function() {
                    scrollToChapterHeading(currentLang);
                }, 150);
            }
        });
    });
}

// ============================================================
// 20. INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    currentLang = 'en';
    
    document.getElementById('chaptersEn').style.display = 'block';
    document.getElementById('chaptersHi').style.display = 'none';
    
    resetChapters('en');
    loadReadingMode();
    handleChapterHash();
    setupDotNavigation();
});

// ============================================================
// 21. EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ============================================================
window.switchLang = switchLang;
window.nextChapter = nextChapter;
window.prevChapter = prevChapter;
window.copyChapterLink = copyChapterLink;
window.openGoogleTranslate = openGoogleTranslate;
window.toggleReadingMode = toggleReadingMode;
window.openModal = openModal;
window.closeModal = closeModal;
window.downloadFullPDF = downloadFullPDF;
window.showToast = showToast;
