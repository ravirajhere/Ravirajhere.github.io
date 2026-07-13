/* ============================================
   SCRIPT.JS - COMPLETE PORTFOLIO FUNCTIONALITY (FIXED)
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
        contactForm: document.getElementById('contact-form'),
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
   TYPEWRITER EFFECT - FIXED
   ============================================ */
class TypewriterEffect {
    constructor(elements, speed) {
        this.elements = elements;
        this.speed = speed;
        this.observer = null;
        this.init();
    }

    init() {
        // FIX: Convert NodeList to Array
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
            this.bars.forEach(bar => {
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

            this.bars.forEach(bar => {
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
       THEME MANAGER - FIXED
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

            // Load saved theme
            if (localStorage.getItem('theme') === 'light') {
                this.body.classList.add('light-mode');
                this.button.textContent = '☀️';
            } else {
                this.button.textContent = '🌙';
            }

            // Toggle on click
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
            this.links.forEach(anchor => {
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
            this.links.forEach(anchor => {
                anchor.removeEventListener('click', () => {});
            });
        }
    }

    /* ============================================
       CONTACT FORM
       ============================================ */
    class ContactForm {
        constructor(form) {
            this.form = form;
            this.submitBtn = null;
            this.spinner = null;
            this.isSubmitting = false;

            if (this.form) {
                this.init();
            }
        }

        init() {
            this.submitBtn = this.form.querySelector('button[type="submit"]');
            this.spinner = this.form.querySelector('.btn-spinner');
            
            if (typeof emailjs !== 'undefined') {
                emailjs.init("ZKEUMnGSjznurORAI");
            }

            this.form.addEventListener('submit', (e) => {
                this.handleSubmit(e);
            });

            this.form.querySelectorAll('input, textarea').forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
            });
        }

        validateField(input) {
            if (input.hasAttribute('required') && !input.value.trim()) {
                input.style.borderColor = '#ff4444';
                return false;
            }
            
            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    input.style.borderColor = '#ff4444';
                    return false;
                }
            }
            
            input.style.borderColor = '';
            return true;
        }

        handleSubmit(e) {
            e.preventDefault();

            if (this.isSubmitting) return;

            let isValid = true;
            this.form.querySelectorAll('input, textarea').forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                alert('Please fill all required fields correctly.');
                return;
            }

            this.setLoading(true);

            const templateParams = {
                name: this.form.from_name.value.trim(),
                email: this.form.from_email.value.trim(),
                message: this.form.message.value.trim(),
                time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
            };

            emailjs.send('service_kc0c1i5', 'template_s53pk7r', templateParams)
                .then(() => {
                    this.showSuccess();
                })
                .catch((error) => {
                    this.showError(error);
                })
                .finally(() => {
                    this.setLoading(false);
                });
        }

        setLoading(loading) {
            this.isSubmitting = loading;
            this.submitBtn.disabled = loading;
            
            if (loading) {
                this.submitBtn.querySelector('span:first-child').textContent = 'Sending...';
                this.spinner.style.display = 'inline';
            } else {
                this.submitBtn.querySelector('span:first-child').textContent = 'Send Message';
                this.spinner.style.display = 'none';
            }
        }

        showSuccess() {
            alert('✅ Message sent successfully! I\'ll get back to you within 24 hours.');
            this.form.reset();
            
            this.form.querySelectorAll('input, textarea').forEach(input => {
                input.style.borderColor = '';
            });
        }

        showError(error) {
            console.error('EmailJS Error:', error);
            alert('❌ Failed to send message. Please try again later or contact me directly via social media.');
        }

        destroy() {
            if (this.form) {
                this.form.removeEventListener('submit', () => {});
            }
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
       PHOTO ANIMATION - FIXED
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

        // Initialize all components
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

        // Theme Manager - NOW FIXED
        const themeManager = new ThemeManager(
            DOM.themeToggle,
            DOM.body
        );

        const smoothScroll = new SmoothScroll(DOM.navLinks);

        const contactForm = new ContactForm(DOM.contactForm);

        const liveDateTime = new LiveDateTime(DOM.timeDisplay);

        setLastUpdated(DOM.lastUpdated);
        setupPhotoAnimation(DOM.heroPhoto);

        // Cleanup on page unload
        window.addEventListener('beforeunload', function() {
            matrix.destroy();
            typewriter.destroy();
            skillBars.destroy();
            themeManager.destroy();
            smoothScroll.destroy();
            contactForm.destroy();
            liveDateTime.destroy();
        });

        window.addEventListener('error', function(e) {
            console.error('Global error caught:', e.message);
        });

        console.log('✅ All systems ready!');
    });

})();

/* ============================================
   SOCIAL TOGGLE - CLICK KARNE PAR ICONS
   ============================================ */
document.addEventListener('DOMContentLoaded', function() {
    const trigger = document.getElementById('triggerBtn');
    const grid = document.getElementById('socialGrid');

    if (trigger && grid) {
        // Toggle grid on trigger click
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            grid.classList.toggle('show');
        });

        // Close grid when clicking outside
        document.addEventListener('click', function(e) {
            if (!trigger.contains(e.target) && !grid.contains(e.target)) {
                trigger.classList.remove('active');
                grid.classList.remove('show');
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                trigger.classList.remove('active');
                grid.classList.remove('show');
            }
        });
    }
});
