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
 // ============================================================
// 💚 MATRIX BACKGROUND — GLOBAL (Color Matched)
// ============================================================
(function() {
    'use strict';

    // Canvas create karo
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-bg';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');

    let width, height, columns, drops;

    // Website ke primary color ke hisaab se matrix color
    function getMatrixColor() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        return isDark ? '#00d9ff' : '#0984e3';  // Dark: Cyan, Light: Blue
    }

    // Website ke secondary color ke hisaab se glow
    function getMatrixGlow() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        return isDark ? 'rgba(0, 217, 255, 0.15)' : 'rgba(9, 132, 227, 0.10)';
    }

    function initMatrix() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const fontSize = 14;
        columns = Math.floor(width / fontSize);
        drops = Array(Math.floor(columns)).fill(1);
    }

    function drawMatrix() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const color = getMatrixColor();
        const glow = getMatrixGlow();

        // Trail effect — website ke bg color ke hisaab se
        ctx.fillStyle = isDark ? 'rgba(10, 10, 15, 0.05)' : 'rgba(245, 240, 235, 0.05)';
        ctx.fillRect(0, 0, width, height);

        // Glow effect
        ctx.shadowColor = glow;
        ctx.shadowBlur = 10;

        // Matrix text
        ctx.fillStyle = color;
        ctx.font = '14px Fira Code, monospace';
        ctx.textAlign = 'center';

        const chars = 'rravirajhere';

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            const x = i * 14 + 7;
            const y = drops[i] * 14;

            // Random brightness variation
            const brightness = 0.7 + Math.random() * 0.3;
            ctx.globalAlpha = brightness;

            ctx.fillText(text, x, y);

            if (y > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }

        // Reset shadow
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }

    // Theme change par update
    function updateMatrixTheme() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        canvas.style.opacity = isDark ? '1' : '0.8';
    }

    // Resize handler
    window.addEventListener('resize', function() {
        initMatrix();
    });

    // Theme change listener
    document.addEventListener('themeChanged', updateMatrixTheme);

    // Initial setup
    initMatrix();
    updateMatrixTheme();

    // Animation loop
    let matrixInterval = setInterval(drawMatrix, 35);

    // Performance: Tab hidden ho toh pause
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            clearInterval(matrixInterval);
        } else {
            matrixInterval = setInterval(drawMatrix, 35);
        }
    });

    // Cleanup
    window.addEventListener('beforeunload', function() {
        clearInterval(matrixInterval);
    });

    console.log('💚 Matrix Background Loaded — Color Matched!');

})();
