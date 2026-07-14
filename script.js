/* ============================================
   SCRIPT.JS - COMPLETE PORTFOLIO FUNCTIONALITY
   ============================================ */

(function() {
    'use strict';

    /* ============================================
       CONFIGURATION
       ============================================ */
    const CONFIG = {
        matrix: {
            chars: 'rravirajhere',
            fontSize: 14,
            interval: 35
        },
        typewriter: {
            speed: 15,
            threshold: 0.3
        },
        animation: {
            delay: 5000,
            duration: 1000
        }
    };

    /* ============================================
       DOM CACHE
       ============================================ */
    const DOM = {
        matrixCanvas: document.getElementById('matrix-bg'),
        heroPhoto: document.getElementById('hero-photo'),
        skillBars: document.querySelectorAll('.skill-bar-fill'),
        navLinks: document.querySelectorAll('a[href^="#"]'),
        themeToggle: document.getElementById('theme-toggle'),
        lastUpdated: document.getElementById('lastUpdated'),
        timeDisplay: document.getElementById('current-date-time'),
        body: document.body
    };

    /* ============================================
       MATRIX RAIN EFFECT
       ============================================ */
    class MatrixEffect {
        constructor(canvas, chars, fontSize) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.chars = chars;
            this.fontSize = fontSize;
            this.drops = [];
            this.intervalId = null;
            this.isActive = true;

            this.init();
            this.start();
            this.bindEvents();
        }

        init() {
            this.resizeCanvas();
            const columns = Math.floor(this.canvas.width / this.fontSize);
            this.drops = Array(columns).fill(1);
        }

        resizeCanvas() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        draw() {
            if (!this.isActive) return;

            const ctx = this.ctx;
            ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            ctx.fillStyle = '#00d9ff';
            ctx.font = `${this.fontSize}px Fira Code`;

            for (let i = 0; i < this.drops.length; i++) {
                const char = this.chars[Math.floor(Math.random() * this.chars.length)];
                const x = i * this.fontSize;
                const y = this.drops[i] * this.fontSize;

                ctx.fillText(char, x, y);

                if (y > this.canvas.height && Math.random() > 0.975) {
                    this.drops[i] = 0;
                }
                this.drops[i]++;
            }
        }

        start() {
            this.intervalId = setInterval(() => this.draw(), CONFIG.matrix.interval);
        }

        stop() {
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        }

        toggle(active) {
            this.isActive = active;
            if (active) {
                this.start();
            } else {
                this.stop();
            }
        }

        bindEvents() {
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    this.resizeCanvas();
                    this.init();
                }, 250);
            });

            document.addEventListener('visibilitychange', () => {
                this.toggle(!document.hidden);
            });
        }

        destroy() {
            this.stop();
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    /* ============================================
       TYPEWRITER EFFECT
       ============================================ */
    class TypewriterEffect {
        constructor(elements, speed) {
            this.elements = elements;
            this.speed = speed;
            this.observer = null;
            this.init();
        }

        init() {
            const targets = Array.from(this.elements).filter(el => 
                ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(el.tagName)
            );

            targets.forEach(el => {
                const text = el.textContent.trim();
                if (text) {
                    el.dataset.text = text;
                    el.textContent = '';
                    el.style.opacity = '0';
                }
            });

            this.setupObserver(targets);
        }

        setupObserver(elements) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.classList.contains('typed')) {
                        entry.target.classList.add('typed');
                        this.typeWriter(entry.target);
                    }
                });
            }, { threshold: CONFIG.typewriter.threshold });

            elements.forEach(el => {
                if (el.dataset.text) {
                    this.observer.observe(el);
                }
            });
        }

        typeWriter(element) {
            const text = element.dataset.text;
            let index = 0;
            element.style.opacity = '1';

            function typing() {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    index++;
                    setTimeout(typing, CONFIG.typewriter.speed);
                }
            }

            typing();
        }

        destroy() {
            if (this.observer) {
                this.observer.disconnect();
            }
        }
    }

    /* ============================================
       SKILL BARS ANIMATION
       ============================================ */
    class SkillBars {
        constructor(bars) {
            this.bars = bars;
            this.observer = null;
            this.init();
        }

        init() {
            Array.from(this.bars).forEach(bar => {
                const width = bar.style.width;
                bar.dataset.width = width;
                bar.style.width = '0%';
            });

            this.setupObserver();
        }

        setupObserver() {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const bar = entry.target;
                        bar.style.width = bar.dataset.width;
                    }
                });
            }, { threshold: 0.5 });

            Array.from(this.bars).forEach(bar => {
                this.observer.observe(bar);
            });
        }

        destroy() {
            if (this.observer) {
                this.observer.disconnect();
            }
        }
    }

    /* ============================================
       THEME MANAGER
       ============================================ */
    class ThemeManager {
        constructor(button, body) {
            this.button = button;
            this.body = body;
            this.init();
        }

        init() {
            if (!this.button) {
                console.log('Theme button not found');
                return;
            }

            if (localStorage.getItem('theme') === 'light') {
                this.body.classList.add('light-mode');
                this.button.textContent = '☀️';
            } else {
                this.button.textContent = '🌙';
            }

            this.button.addEventListener('click', () => {
                this.toggle();
            });
        }

        toggle() {
            this.body.classList.toggle('light-mode');
            if (this.body.classList.contains('light-mode')) {
                this.button.textContent = '☀️';
                localStorage.setItem('theme', 'light');
            } else {
                this.button.textContent = '🌙';
                localStorage.setItem('theme', 'dark');
            }
            console.log('Theme toggled!');
        }

        destroy() {
            if (this.button) {
                this.button.removeEventListener('click', this.toggle);
            }
        }
    }

    /* ============================================
       SMOOTH SCROLL
       ============================================ */
    class SmoothScroll {
        constructor(links) {
            this.links = links;
            this.init();
        }

        init() {
            Array.from(this.links).forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = anchor.getAttribute('href');
                    const target = document.querySelector(targetId);
                    
                    if (target) {
                        target.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start' 
                        });
                        history.pushState(null, '', targetId);
                    }
                });
            });
        }

        destroy() {
            Array.from(this.links).forEach(anchor => {
                anchor.removeEventListener('click', () => {});
            });
        }
    }

    /* ============================================
       LIVE DATE TIME
       ============================================ */
    class LiveDateTime {
        constructor(displayElement) {
            this.display = displayElement;
            this.intervalId = null;

            if (this.display) {
                this.start();
            }
        }

        update() {
            try {
                const now = new Date();
                const day = String(now.getDate()).padStart(2, '0');
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const month = monthNames[now.getMonth()];
                const year = now.getFullYear();
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const seconds = String(now.getSeconds()).padStart(2, '0');

                this.display.textContent = `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
            } catch (error) {
                console.error('Error updating time:', error);
                this.display.textContent = 'Time unavailable';
            }
        }

        start() {
            this.update();
            this.intervalId = setInterval(() => this.update(), 1000);
        }

        stop() {
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        }

        destroy() {
            this.stop();
        }
    }

    /* ============================================
       LAST UPDATED
       ============================================ */
    function setLastUpdated(element) {
        if (!element) return;
        
        try {
            const date = new Date(document.lastModified);
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            element.textContent = date.toLocaleDateString('en-US', options);
        } catch (error) {
            console.error('Error setting last updated:', error);
            element.textContent = 'Today';
        }
    }

    /* ============================================
       PHOTO ANIMATION
       ============================================ */
    function setupPhotoAnimation(photo) {
        if (!photo) return;

        setTimeout(() => {
            photo.classList.add('fly-in-photo');
        }, CONFIG.animation.delay);
    }

    /* ============================================
   INITIALIZATION
   ============================================ */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Portfolio v2.0 - Ravi Raj');
    console.log('📅 Loaded:', new Date().toLocaleString());

    // ============================================
    // 🆕 AUTO-DETECT SYSTEM PREFERENCE (YAHAN DAALO)
    // ============================================
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const themeToggle = document.getElementById('theme-toggle');
    
    if (!localStorage.getItem('theme')) {
        if (prefersDark) {
            document.body.classList.remove('light-mode');
            if (themeToggle) themeToggle.textContent = '🌙';
        } else {
            document.body.classList.add('light-mode');
            if (themeToggle) themeToggle.textContent = '☀️';
        }
    }

    const matrix = new MatrixEffect(
        DOM.matrixCanvas,
        CONFIG.matrix.chars,
        CONFIG.matrix.fontSize
    );

    const typewriter = new TypewriterEffect(
        document.querySelectorAll('h1, h2, h3, h4, h5, h6'),
        CONFIG.typewriter.speed
    );

    const skillBars = new SkillBars(DOM.skillBars);
    const themeManager = new ThemeManager(DOM.themeToggle, DOM.body);
    const smoothScroll = new SmoothScroll(DOM.navLinks);
    const liveDateTime = new LiveDateTime(DOM.timeDisplay);

    setLastUpdated(DOM.lastUpdated);
    setupPhotoAnimation(DOM.heroPhoto);

    window.addEventListener('beforeunload', function() {
        matrix.destroy();
        typewriter.destroy();
        skillBars.destroy();
        themeManager.destroy();
        smoothScroll.destroy();
        liveDateTime.destroy();
    });

    window.addEventListener('error', function(e) {
        console.error('Global error caught:', e.message);
    });

    console.log('✅ All systems ready!');
});

/* ============================================
   SOCIAL TOGGLE - CLICK KARNE PAR ICONS
   ============================================ */
document.addEventListener('DOMContentLoaded', function() {
    const trigger = document.getElementById('triggerBtn');
    const grid = document.getElementById('socialGrid');

    if (trigger && grid) {
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            grid.classList.toggle('show');
        });

        document.addEventListener('click', function(e) {
            if (!trigger.contains(e.target) && !grid.contains(e.target)) {
                trigger.classList.remove('active');
                grid.classList.remove('show');
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                trigger.classList.remove('active');
                grid.classList.remove('show');
            }
        });
    }
});

/* ============================================
   RJ ACHIEVE MODAL - FUNCTIONS
   ============================================ */

function openRJModal() {
    const modal = document.getElementById('rjModal');
    if (modal) modal.classList.add('active');
}

function closeRJModal() {
    const modal = document.getElementById('rjModal');
    if (modal) modal.classList.remove('active');
}

function openAchieveModal(type) {
    const body = document.getElementById('achieveModalBody');
    if (!body) {
        console.warn('⚠️ achieveModalBody not found! Creating fallback...');
        const modalContent = document.querySelector('.rj-modal-content');
        if (modalContent) {
            const newBody = document.createElement('div');
            newBody.id = 'achieveModalBody';
            modalContent.appendChild(newBody);
        }
        return;
    }

    const content = {
        'experience': {
            title: '💼 My Experience',
            sub: 'Coming soon — I\'m currently updating this section.',
            details: ['📌 Available Soon', '🛠️ I\'m working on adding my professional journey here.', '⏳ Please check back later!']
        },
        'memories': {
            title: '📸 Photo Gallery',
            sub: 'Coming soon — I\'m collecting my favorite moments.',
            details: ['📌 Available Soon', '🛠️ This section is under development.', '⏳ Stay tuned for updates!']
        },
        'autobiography': {
            title: '📖 Autobiography',
            sub: 'Coming soon — my life story in words.',
            details: ['📝 Coming Soon', '🛠️ I\'m currently writing my autobiography.', '⏳ Please check back later for updates!']
        }
    };

    const data = content[type];
    if (!data) {
        body.innerHTML = `<p style="color: var(--gray);">❌ Section not found.</p>`;
        return;
    }

    body.innerHTML = `
        <h2>${data.title}</h2>
        <p class="sub">${data.sub}</p>
        ${data.details.map(item => `<div class="detail-item">${item}</div>`).join('')}
    `;
}

// Close RJ Modal on outside click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('rjModal');
    if (modal && e.target === modal) {
        closeRJModal();
    }
});

// Close RJ Modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeRJModal();
    }
});

/* ============================================
   OPEN CHATBOX — LET'S TALK BUTTON
   ============================================ */
function openChatbox() {
    const container = document.getElementById('chatbox-container');
    if (!container) {
        alert('❌ Chatbox container not found!');
        return;
    }

    if (container.innerHTML.trim() !== '') {
        container.style.display = 'block';
        container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    fetch('chatbox.html')
        .then(res => {
            if (!res.ok) throw new Error('File not found (404)');
            return res.text();
        })
        .then(html => {
            container.innerHTML = html;
            container.style.display = 'block';
            container.scrollIntoView({ behavior: 'smooth', block: 'center' });
            console.log('✅ Chatbox loaded!');
        })
        .catch(err => {
            console.error('❌ Chatbox load failed:', err);
            alert('❌ Chatbox could not load. Please check console for details.');
            container.innerHTML = `<p style="color:var(--gray);text-align:center;padding:20px;">❌ Chatbox could not load.</p>`;
            container.style.display = 'block';
        });
}

/* ============================================
   CONTACT MODAL FUNCTIONS (Same as RJ Achieve)
   ============================================ */

function showContactOptions() {
    const modal = document.getElementById('contactModal');
    if (modal) modal.classList.add('active');
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) modal.classList.remove('active');
}

// Close Contact Modal on outside click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('contactModal');
    if (modal && e.target === modal) {
        closeContactModal();
    }
});

// Close Contact Modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeContactModal();
    }
});
