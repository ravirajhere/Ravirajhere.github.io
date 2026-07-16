// ============================================================
// GLOBAL.JS — COMMON FUNCTIONS FOR ALL PAGES
// (Theme Toggle, Live Time, Scroll to Top, Keyboard Shortcuts)
// ============================================================

(function() {
    'use strict';

    // ============================================================
    // THEME TOGGLE
    // ============================================================
    const themeSwitch = document.getElementById('themeSwitch');
    const themeLabel = document.getElementById('themeLabel');
    const toast = document.getElementById('toast');
    const html = document.documentElement;

    // Load saved theme
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);
    if (themeLabel) {
        themeLabel.textContent = currentTheme === 'dark' ? 'Dark' : 'Light';
    }

    // Toggle click
    if (themeSwitch) {
        themeSwitch.addEventListener('click', function(e) {
            e.stopPropagation();
            const current = html.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            if (themeLabel) {
                themeLabel.textContent = next === 'dark' ? 'Dark' : 'Light';
            }
            showToast(next === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode');
        });

        // Keyboard support
        themeSwitch.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }

    // ============================================================
    // TOAST FUNCTION
    // ============================================================
    let toastTimer;

    function showToast(message) {
        if (!toast) return;
        clearTimeout(toastTimer);
        toast.textContent = message;
        toast.className = 'toast show';
        toastTimer = setTimeout(function() {
            toast.classList.remove('show');
        }, 2000);
    }

    // ============================================================
    // LIVE TIME — REAL-TIME CLOCK
    // ============================================================
    function updateTime() {
        const now = new Date();
        const options = {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        };
        const timeStr = now.toLocaleString('en-IN', options);
        const liveTimeEl = document.getElementById('live-time');
        if (liveTimeEl) {
            liveTimeEl.textContent = `⏱️ ${timeStr} IST`;
        }
    }
    updateTime();
    setInterval(updateTime, 1000);

    // ============================================================
    // SCROLL TO TOP
    // ============================================================
    const scrollBtn = document.getElementById('scrollTopBtn');

    if (scrollBtn) {
        window.addEventListener('scroll', function() {
            scrollBtn.classList.toggle('visible', window.scrollY > 400);
        });

        scrollBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============================================================
    // PAGE VISIBILITY — PAUSE UPDATES WHEN TAB IS HIDDEN
    // ============================================================
    let timeInterval;

    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            clearInterval(timeInterval);
        } else {
            updateTime();
            timeInterval = setInterval(updateTime, 1000);
        }
    });

    // ============================================================
    // KEYBOARD SHORTCUTS — ESCAPE TO CLOSE
    // ============================================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (window.closeChatbox) {
                window.closeChatbox();
            }
        }
    });

    // ============================================================
    // RESPONSIVE TOGGLE POSITION
    // ============================================================
    function adjustTogglePosition() {
        const wrapper = document.querySelector('.theme-toggle-wrapper');
        if (!wrapper) return;
        if (window.innerWidth <= 480) {
            wrapper.style.top = '10px';
            wrapper.style.right = '10px';
        } else if (window.innerWidth <= 768) {
            wrapper.style.top = '15px';
            wrapper.style.right = '15px';
        } else {
            wrapper.style.top = '20px';
            wrapper.style.right = '20px';
        }
    }

    adjustTogglePosition();
    window.addEventListener('resize', adjustTogglePosition);

    console.log('✅ Global JS Loaded Successfully!');

})();
