// ============================================================
// GLOBAL.JS — COMPLETE WITH ALL FEATURES
// (Theme, Toast, Live Time, Keyboard Shortcuts, Page Visibility)
// ============================================================

(function() {
    'use strict';

    // ============================================================
    // 1. THEME TOGGLE
    // ============================================================
    const themeSwitch = document.getElementById('themeSwitch');
    const toast = document.getElementById('toast');
    const html = document.documentElement;

    // Load saved theme
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);

    if (themeSwitch) {
        themeSwitch.addEventListener('click', function(e) {
            e.stopPropagation();
            const current = html.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            showToast(next === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode');
        });

        themeSwitch.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }

    // ============================================================
    // 2. TOAST FUNCTION
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
    // 3. LIVE TIME — REAL-TIME CLOCK
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
    let timeInterval = setInterval(updateTime, 1000);

    // ============================================================
    // 4. PAGE VISIBILITY — PAUSE UPDATES WHEN TAB IS HIDDEN
    // ============================================================
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            clearInterval(timeInterval);
        } else {
            updateTime();
            timeInterval = setInterval(updateTime, 1000);
        }
    });

    // ============================================================
    // 5. KEYBOARD SHORTCUTS — ESCAPE TO CLOSE
    // ============================================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close all interest hidden contents
            document.querySelectorAll('.hidden-content').forEach(el => {
                el.style.display = 'none';
            });
            // Close chatbox if open
            if (window.closeChatbox) {
                window.closeChatbox();
            }
        }
    });

    // ============================================================
    // 6. CONSOLE WELCOME
    // ============================================================
    console.log('%c👋 Hey there, fellow developer!', 'font-size: 20px; font-weight: bold; color: #c9a84c;');
    console.log('%cThanks for checking out my site. Built with ❤️ by Ravi Raj', 'font-size: 14px; color: #1a2a3a;');
    console.log('%c📖 GitHub: https://github.com/ravirajhere', 'font-size: 14px; color: #c9a84c;');
    console.log('✅ Global JS Loaded Successfully!');

})();
