// ============================================================
// GLOBAL.JS — COMPLETE WITH ALL FEATURES
// (Theme, Toast, Live Time, Keyboard Shortcuts, Page Visibility)
// ============================================================

(function() {
    'use strict';

    // ============================================================
    // 1. THEME TOGGLE — Global + Navbar
    // ============================================================
    const themeSwitches = document.querySelectorAll('.switch');
    const toast = document.getElementById('toast');
    const html = document.documentElement;

    // Load saved theme
    const currentTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', currentTheme);

    // Update all toggles based on current theme
    function updateThemeToggles() {
        const isDark = html.getAttribute('data-theme') === 'dark';
        themeSwitches.forEach(function(sw) {
            if (isDark) {
                sw.setAttribute('data-theme', 'dark');
            } else {
                sw.removeAttribute('data-theme');
            }
        });
    }
    updateThemeToggles();

    // Toggle click handler
    themeSwitches.forEach(function(themeSwitch) {
        themeSwitch.addEventListener('click', function(e) {
            e.stopPropagation();
            const current = html.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            updateThemeToggles();
            showToast(next === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode');
        });

        themeSwitch.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // ============================================================
    // 2. TOAST FUNCTION
    // ============================================================
    let toastTimer;

    function showToast(message, type) {
        if (!toast) return;
        clearTimeout(toastTimer);
        toast.textContent = message;
        toast.className = 'toast show';
        if (type) toast.classList.add(type);
        toastTimer = setTimeout(function() {
            toast.classList.remove('show');
        }, 2000);
    }

    // Expose toast globally
    window.showToast = showToast;

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
            liveTimeEl.textContent = '⏱️ ' + timeStr + ' IST';
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
            document.querySelectorAll('.hidden-content').forEach(function(el) {
                el.style.display = 'none';
            });
            // Close chatbox if open
            if (window.closeChatbox) {
                window.closeChatbox();
            }
            // Close sidebar if open
            if (window.closeSidebar) {
                window.closeSidebar();
            }
        }
    });

    // ============================================================
    // 6. CONSOLE WELCOME
    // ============================================================
    console.log('%c 👋 Hey there, fellow developer!', 'font-size: 20px; font-weight: bold; color: #d4a373;');
    console.log('%c Thanks for checking out my site. Built with ❤️ by Ravi Raj', 'font-size: 14px; color: #f5ede4;');
    console.log('%c 📖 GitHub: https://github.com/ravirajhere', 'font-size: 14px; color: #d4a373;');
    console.log('✅ Global JS Loaded Successfully!');

    // ============================================================
    // 7. LOADING SCREEN
    // ============================================================
    (function() {
        const loader = document.getElementById('loader');
        if (!loader) return;

        // Hide loader after 1.5 seconds
        setTimeout(function() {
            loader.classList.add('fade-out');
            setTimeout(function() {
                if (loader.parentNode) loader.remove();
            }, 600);
        }, 1500);

        // Fallback — agar 3 sec mein nahi hata toh force hide
        setTimeout(function() {
            if (loader && !loader.classList.contains('fade-out')) {
                loader.classList.add('fade-out');
                setTimeout(function() {
                    if (loader.parentNode) loader.remove();
                }, 600);
            }
        }, 3000);
    })();

})();
