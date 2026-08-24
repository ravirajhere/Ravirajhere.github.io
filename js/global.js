// ============================================================
// GLOBAL.JS — PREMIUM EDITION
// (Loader, Custom Cursor, Theme, Toast, Live Time)
// ============================================================

(function() {
    'use strict';

    // ============================================================
    // 1. LOADER
    // ============================================================
    const loader = document.getElementById('loader');
    
    if (loader) {
        // Hide loader after 1.5 seconds
        setTimeout(function() {
            loader.classList.add('hidden');
        }, 1500);

        // Fallback — agar 3 sec mein nahi hata toh force hide
        setTimeout(function() {
            if (loader && !loader.classList.contains('hidden')) {
                loader.classList.add('hidden');
            }
        }, 3000);
    }

    // ============================================================
    // 2. CUSTOM CURSOR
    // ============================================================
    const cursor = document.getElementById('custom-cursor');
    
    if (cursor && window.innerWidth > 768) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // Hover effect on clickable elements
        document.querySelectorAll('a, button, .btn, .clickable, .interest-card, .project-card, .milestone-card, .social-links a').forEach(el => {
            el.addEventListener('mouseenter', function() {
                cursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', function() {
                cursor.classList.remove('hover');
            });
        });

        // Click effect
        document.addEventListener('mousedown', function() {
            cursor.classList.add('click');
        });
        document.addEventListener('mouseup', function() {
            cursor.classList.remove('click');
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', function() {
            cursor.style.opacity = '0';
        });
        document.addEventListener('mouseenter', function() {
            cursor.style.opacity = '1';
        });
    }

    // ============================================================
    // 3. THEME TOGGLE
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
    // 4. TOAST
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
    // 5. LIVE TIME
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
    // 6. PAGE VISIBILITY
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
    // 7. KEYBOARD SHORTCUTS — ESCAPE
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
    // 8. CONSOLE WELCOME
    // ============================================================
    console.log('%c ✨ RAVI RAJ | Premium Portfolio ✨ ', 'background: #c9a84c; color: #1a1a1a; font-size: 20px; font-weight: bold; padding: 12px 24px; border-radius: 8px;');
    console.log('%c 🚀 Student • Author • Web Developer ', 'color: #c9a84c; font-size: 14px;');
    console.log('%c 📍 Begusarai, Bihar | 🇮🇳 Jai Hind ', 'color: #8a8a8a; font-size: 13px;');
    console.log('%c 🔥 Premium Features: Loader • Custom Cursor • Smooth Scroll • Animations ', 'color: #4a4a4a; font-size: 13px;');
    console.log('✅ Global JS Loaded Successfully!');

})();
