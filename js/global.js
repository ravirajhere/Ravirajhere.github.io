// ============================================================
// GLOBAL.JS — COMPLETE WITH ALL FEATURES
// (Theme, Loading, Progress, Social, WhatsApp, Cursor, Trail, Bubbles, Matrix, etc.)
// ============================================================

(function() {
    'use strict';

    // ============================================================
    // 1. THEME TOGGLE
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
            document.dispatchEvent(new Event('themeChanged'));
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
        }, 2500);
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
    setInterval(updateTime, 1000);

    // ============================================================
    // 4. SCROLL TO TOP
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
    // 5. PAGE VISIBILITY — PAUSE UPDATES WHEN TAB IS HIDDEN
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
    // 6. KEYBOARD SHORTCUTS — ESCAPE TO CLOSE
    // ============================================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (window.closeChatbox) {
                window.closeChatbox();
            }
        }
    });

    // ============================================================
    // 7. RESPONSIVE TOGGLE POSITION
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

    // ============================================================
    // 8. LOADING SCREEN
    // ============================================================
    (function() {
        const loader = document.createElement('div');
        loader.id = 'loader';
        loader.innerHTML = `
            <div class="spinner"></div>
            <div class="loader-text">Loading...</div>
        `;
        document.body.prepend(loader);

        window.addEventListener('load', function() {
            setTimeout(function() {
                loader.classList.add('fade-out');
                setTimeout(function() {
                    if (loader.parentNode) loader.remove();
                }, 600);
            }, 400);
        });

        // Fallback — agar load na ho toh 3 sec mein chala jaaye
        setTimeout(function() {
            if (loader && !loader.classList.contains('fade-out')) {
                loader.classList.add('fade-out');
                setTimeout(function() {
                    if (loader.parentNode) loader.remove();
                }, 600);
            }
        }, 3000);
    })();

    // ============================================================
    // 9. READING PROGRESS BAR
    // ============================================================
    (function() {
        const progressBar = document.createElement('div');
        progressBar.id = 'progress-bar';
        document.body.prepend(progressBar);

        window.addEventListener('scroll', function() {
            const scrollTop = window.scrollY;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const progress = height > 0 ? (scrollTop / height) * 100 : 0;
            progressBar.style.width = progress + '%';
        });
    })();

    // ============================================================
    // 10. FLOATING SOCIAL ICONS (Left Side)
    // ============================================================
    (function() {
        const socials = document.createElement('div');
        socials.className = 'floating-socials';
        socials.innerHTML = `
            <a href="https://github.com/ravirajhere" target="_blank" aria-label="GitHub"><i class="fab fa-github"></i></a>
            <a href="https://linkedin.com/in/Ravirajhere" target="_blank" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
            <a href="https://twitter.com/Raviraj2k09" target="_blank" aria-label="Twitter"><i class="fab fa-x-twitter"></i></a>
            <a href="https://youtube.com/@Ravirajhere" target="_blank" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
        `;
        document.body.appendChild(socials);
    })();

    // ============================================================
    // 11. FLOATING WHATSAPP BUTTON (Right Side)
    // ============================================================
    (function() {
        const wa = document.createElement('div');
        wa.className = 'floating-whatsapp';
        wa.innerHTML = `
            <a href="https://wa.me/919102224971?text=Hi%20Ravi%2C%20I%20visited%20your%20website%20and%20wanted%20to%20connect%21" 
               target="_blank" 
               aria-label="WhatsApp"
               title="Chat on WhatsApp">
                <i class="fab fa-whatsapp"></i>
            </a>
        `;
        document.body.appendChild(wa);
    })();

    // ============================================================
    // 12. CUSTOM CURSOR
    // ============================================================
    (function() {
        // Only on non-touch devices
        if ('ontouchstart' in window) return;

        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // Hover effect on clickable elements
        document.querySelectorAll('a, button, .btn, .clickable, .interest-card, .project-card, .milestone-card').forEach(el => {
            el.addEventListener('mouseenter', function() {
                cursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', function() {
                cursor.classList.remove('hover');
            });
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', function() {
            cursor.style.opacity = '0';
        });
        document.addEventListener('mouseenter', function() {
            cursor.style.opacity = '1';
        });
    })();

    // ============================================================
    // 13. MOUSE TRAIL EFFECT
    // ============================================================
    (function() {
        if ('ontouchstart' in window) return;

        const trail = [];
        const trailCount = 12;

        for (let i = 0; i < trailCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'trail-dot';
            dot.style.opacity = 0.1 + (i / trailCount) * 0.4;
            document.body.appendChild(dot);
            trail.push({ el: dot, x: 0, y: 0 });
        }

        let index = 0;
        document.addEventListener('mousemove', function(e) {
            const x = e.clientX;
            const y = e.clientY;

            const current = trail[index % trailCount];
            current.x = x;
            current.y = y;
            current.el.style.left = x + 'px';
            current.el.style.top = y + 'px';

            index++;
        });
    })();

    // ============================================================
    // 14. FLOATING BUBBLES
    // ============================================================
    (function() {
        const bubbleCount = 15;
        const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)'];

        for (let i = 0; i < bubbleCount; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            const size = 20 + Math.random() * 60;
            bubble.style.width = size + 'px';
            bubble.style.height = size + 'px';
            bubble.style.left = Math.random() * 100 + '%';
            bubble.style.background = colors[Math.floor(Math.random() * colors.length)];
            bubble.style.animationDuration = 15 + Math.random() * 25 + 's';
            bubble.style.animationDelay = Math.random() * 20 + 's';
            document.body.appendChild(bubble);
        }
    })();

    /*
    // ============================================================
    // 15. MATRIX BACKGROUND — GLOBAL (Color Matched)
    // ============================================================
    (function() {
        // Check if canvas already exists
        if (document.getElementById('matrix-bg')) return;

        const canvas = document.createElement('canvas');
        canvas.id = 'matrix-bg';
        document.body.prepend(canvas);

        const ctx = canvas.getContext('2d');

        let width, height, columns, drops;

        function getMatrixColor() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            return isDark ? '#00d9ff' : '#0984e3';
        }

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

            ctx.fillStyle = isDark ? 'rgba(10, 10, 15, 0.05)' : 'rgba(245, 240, 235, 0.05)';
            ctx.fillRect(0, 0, width, height);

            ctx.shadowColor = glow;
            ctx.shadowBlur = 10;

            ctx.fillStyle = color;
            ctx.font = '14px Fira Code, monospace';
            ctx.textAlign = 'center';

            const chars = 'rravirajhere';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                const x = i * 14 + 7;
                const y = drops[i] * 14;

                const brightness = 0.7 + Math.random() * 0.3;
                ctx.globalAlpha = brightness;

                ctx.fillText(text, x, y);

                if (y > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }

            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        }

        function updateMatrixTheme() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            canvas.style.opacity = isDark ? '1' : '0.9';
        }

        window.addEventListener('resize', function() {
            initMatrix();
        });

        document.addEventListener('themeChanged', function() {
            updateMatrixTheme();
        });

        initMatrix();
        updateMatrixTheme();

        let matrixInterval = setInterval(drawMatrix, 35);

        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                clearInterval(matrixInterval);
            } else {
                matrixInterval = setInterval(drawMatrix, 35);
            }
        });

        window.addEventListener('beforeunload', function() {
            clearInterval(matrixInterval);
        });

        console.log('💚 Matrix Background Loaded — Color Matched!');
    })();
    */

    console.log('✅ All Global Features Loaded Successfully!');
    console.log('🔥 Features: Theme, Loading, Progress, Social, WhatsApp, Cursor, Trail, Bubbles, Matrix, and more!');

})();
