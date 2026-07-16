// ============================================================
// AUTOBOIOGRAPHY.JS — COMPLETE FUNCTIONALITY
// (Language Toggle · Navigation · Reading Mode · Modal)
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
    if (!container) return;
    
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
    
    // Scroll to top of chapter smoothly
    setTimeout(function() {
        scrollToChapterHeading(lang);
    }, 100);
}

// ============================================================
// 3. SCROLL TO CHAPTER HEADING (SMOOTH)
// ============================================================
function scrollToChapterHeading(lang) {
    const containerId = lang === 'en' ? 'chaptersEn' : 'chaptersHi';
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const chapters = container.querySelectorAll('.chapter');
    
    chapters.forEach((ch) => {
        if (ch.classList.contains('active')) {
            const heading = ch.querySelector('h3');
            if (heading) {
                // Smooth scroll to heading with offset
                const yOffset = -80;
                const y = heading.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
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
    if (!container) return;
    
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
        
        // Scroll to top of new chapter
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
    if (!container) return;
    
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
        
        // Scroll to top of new chapter
        setTimeout(function() {
            scrollToChapterHeading(lang);
        }, 150);
    }
}

// ============================================================
// 6. GO TO SPECIFIC CHAPTER (For Dots)
// ============================================================
function goToChapter(lang, chapterNum) {
    const containerId = lang === 'en' ? 'chaptersEn' : 'chaptersHi';
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const chapters = container.querySelectorAll('.chapter');
    
    chapters.forEach((ch, index) => {
        if (index === chapterNum - 1) {
            ch.classList.add('active');
        } else {
            ch.classList.remove('active');
        }
    });
    
    updateAllButtons(lang);
    updateProgressInfo(lang);
    updateDots(lang);
    
    setTimeout(function() {
        scrollToChapterHeading(lang);
    }, 150);
}

// ============================================================
// 7. UPDATE BUTTON STATES
// ============================================================
function updateAllButtons(lang) {
    const containerId = lang === 'en' ? 'chaptersEn' : 'chaptersHi';
    const container = document.getElementById(containerId);
    if (!container) return;
    
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
// 8. UPDATE CHAPTER PROGRESS INFO
// ============================================================
function updateProgressInfo(lang) {
    const containerId = lang === 'en' ? 'chaptersEn' : 'chaptersHi';
    const container = document.getElementById(containerId);
    if (!container) return;
    
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
// 9. UPDATE PROGRESS DOTS
// ============================================================
function updateDots(lang) {
    const containerId = lang === 'en' ? 'chaptersEn' : 'chaptersHi';
    const container = document.getElementById(containerId);
    if (!container) return;
    
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
// 10. READING MODE TOGGLE
// ============================================================
function toggleReadingMode() {
    document.body.classList.toggle('reading-mode');
    const btn = document.getElementById('readingModeToggle');
    if (document.body.classList.contains('reading-mode')) {
        btn.innerHTML = '☀️ Normal Mode';
        localStorage.setItem('readingMode', 'enabled');
        showToast('📖 Reading Mode Activated', 'success');
    } else {
        btn.innerHTML = '📖 Reading Mode';
        localStorage.setItem('readingMode', 'disabled');
        showToast('☀️ Normal Mode Activated', 'success');
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
// 11. GOOGLE TRANSLATE
// ============================================================
function openGoogleTranslate() {
    const url = window.location.href;
    window.open('https://translate.google.com/translate?sl=auto&tl=hi&u=' + encodeURIComponent(url), '_blank');
    showToast('🌐 Opening Google Translate...', 'success');
}

// ============================================================
// 12. TOAST NOTIFICATION
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
// 13. DOWNLOAD MODAL
// ============================================================
function openModal() {
    const modal = document.getElementById('downloadModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        showToast('📥 Select your language', 'success');
    }
}

function closeModal() {
    const modal = document.getElementById('downloadModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on outside click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('downloadModal');
    if (modal && modal.classList.contains('active')) {
        if (e.target === modal) {
            closeModal();
        }
    }
});

// Close modal on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ============================================================
// 14. HANDLE CHAPTER HASH IN URL
// ============================================================
function handleChapterHash() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#chapter')) {
        const chapterNum = parseInt(hash.replace('#chapter', ''));
        if (!isNaN(chapterNum) && chapterNum >= 1 && chapterNum <= totalChapters) {
            setTimeout(function() {
                goToChapter(currentLang, chapterNum);
            }, 300);
        }
    }
}

// ============================================================
// 15. DOT CLICK NAVIGATION
// ============================================================
function setupDotNavigation() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot) => {
        dot.addEventListener('click', function() {
            const chapterNum = parseInt(this.dataset.dot);
            if (!isNaN(chapterNum)) {
                goToChapter(currentLang, chapterNum);
                showToast(`📖 Chapter ${chapterNum}`, 'success');
            }
        });
    });
}

// ============================================================
// 16. KEYBOARD SHORTCUTS (Arrow Keys)
// ============================================================
document.addEventListener('keydown', function(e) {
    // Arrow Right - Next Chapter
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const containerId = currentLang === 'en' ? 'chaptersEn' : 'chaptersHi';
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const chapters = container.querySelectorAll('.chapter');
        let currentIndex = -1;
        
        chapters.forEach((ch, index) => {
            if (ch.classList.contains('active')) {
                currentIndex = index;
            }
        });
        
        if (currentIndex !== -1 && currentIndex < chapters.length - 1) {
            nextChapter(currentLang);
        }
    }
    
    // Arrow Left - Previous Chapter
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const containerId = currentLang === 'en' ? 'chaptersEn' : 'chaptersHi';
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const chapters = container.querySelectorAll('.chapter');
        let currentIndex = -1;
        
        chapters.forEach((ch, index) => {
            if (ch.classList.contains('active')) {
                currentIndex = index;
            }
        });
        
        if (currentIndex > 0) {
            prevChapter(currentLang);
        }
    }
});

// ============================================================
// 17. SAVE LAST READ CHAPTER
// ============================================================
function saveLastReadChapter(lang, chapterNum) {
    try {
        localStorage.setItem('lastChapter', chapterNum);
        localStorage.setItem('lastLang', lang);
    } catch(e) {
        // Ignore
    }
}

function loadLastReadChapter() {
    try {
        const savedChapter = localStorage.getItem('lastChapter');
        const savedLang = localStorage.getItem('lastLang');
        
        if (savedChapter && savedLang) {
            const chapterNum = parseInt(savedChapter);
            if (!isNaN(chapterNum) && chapterNum >= 1 && chapterNum <= totalChapters) {
                // Switch to saved language
                if (savedLang !== currentLang) {
                    switchLang(savedLang);
                }
                // Go to saved chapter
                setTimeout(function() {
                    goToChapter(savedLang, chapterNum);
                }, 400);
                return true;
            }
        }
    } catch(e) {
        // Ignore
    }
    return false;
}

// Override goToChapter to save last read
const originalGoToChapter = goToChapter;
goToChapter = function(lang, chapterNum) {
    originalGoToChapter(lang, chapterNum);
    saveLastReadChapter(lang, chapterNum);
};

// Override nextChapter to save
const originalNextChapter = nextChapter;
nextChapter = function(lang) {
    originalNextChapter(lang);
    const containerId = lang === 'en' ? 'chaptersEn' : 'chaptersHi';
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const chapters = container.querySelectorAll('.chapter');
    chapters.forEach((ch, index) => {
        if (ch.classList.contains('active')) {
            saveLastReadChapter(lang, index + 1);
        }
    });
};

// Override prevChapter to save
const originalPrevChapter = prevChapter;
prevChapter = function(lang) {
    originalPrevChapter(lang);
    const containerId = lang === 'en' ? 'chaptersEn' : 'chaptersHi';
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const chapters = container.querySelectorAll('.chapter');
    chapters.forEach((ch, index) => {
        if (ch.classList.contains('active')) {
            saveLastReadChapter(lang, index + 1);
        }
    });
};

// Override resetChapters to save
const originalResetChapters = resetChapters;
resetChapters = function(lang) {
    originalResetChapters(lang);
    saveLastReadChapter(lang, 1);
};

// ============================================================
// 18. SWIPE GESTURES FOR MOBILE
// ============================================================
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // Only handle horizontal swipes (ignore vertical)
    if (Math.abs(diffX) < Math.abs(diffY)) return;
    
    if (Math.abs(diffX) > swipeThreshold) {
        if (diffX > 0) {
            // Swipe Left → Next Chapter
            nextChapter(currentLang);
        } else {
            // Swipe Right → Previous Chapter
            prevChapter(currentLang);
        }
    }
}

// ============================================================
// 19. INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    currentLang = 'en';
    
    // Show English chapters by default
    document.getElementById('chaptersEn').style.display = 'block';
    document.getElementById('chaptersHi').style.display = 'none';
    
    // Load reading mode preference
    loadReadingMode();
    
    // Try to load last read chapter
    const hasLastRead = loadLastReadChapter();
    
    // If no last read, reset to chapter 1
    if (!hasLastRead) {
        resetChapters('en');
    }
    
    // Handle URL hash
    handleChapterHash();
    
    // Setup dot navigation
    setupDotNavigation();
    
    // Show welcome toast
    setTimeout(function() {
        showToast('📖 Welcome to My Autobiography!', 'success');
    }, 500);
});

// ============================================================
// 20. EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ============================================================
window.switchLang = switchLang;
window.nextChapter = nextChapter;
window.prevChapter = prevChapter;
window.goToChapter = goToChapter;
window.openGoogleTranslate = openGoogleTranslate;
window.toggleReadingMode = toggleReadingMode;
window.openModal = openModal;
window.closeModal = closeModal;
window.showToast = showToast;
