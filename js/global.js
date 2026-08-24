// ============================================================
// GLOBAL.JS — Theme, Toast, Live Time, Keyboard Shortcuts
// ============================================================

(function() {
    'use strict';

    // ============================================================
    // 1. THEME TOGGLE
    // ============================================================
    const themeSwitch = document.getElementById('themeSwitch');
    const toast = document.getElementById('toast');
    const html = document.documentElement;

    const currentTheme = localStorage.getItem('theme') || 'dark';
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
    // 2. TOAST
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
    // 3. LIVE TIME
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
    // 4. PAGE VISIBILITY
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
    // 5. KEYBOARD SHORTCUTS — ESCAPE
    // ============================================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.hidden-content').forEach(el => {
                el.style.display = 'none';
            });
            if (window.closeChatbox) {
                window.closeChatbox();
            }
        }
    });

    // ============================================================
    // 6. CONSOLE WELCOME
    // ============================================================
    console.log('%c RAVIRAJ SINGH | Frontend Developer ', 'background: #00d9ff; color: #0a0a0f; font-size: 20px; font-weight: bold; padding: 10px;');
    console.log('%c Status: Ready to Code | Location: Begusarai, Bihar ', 'color: #00ff88; font-size: 14px;');
    console.log('✅ Global JS Loaded Successfully!');

})();
