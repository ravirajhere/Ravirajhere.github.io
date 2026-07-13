/* ============================================
   SCRIPT.JS - COMPLETE PORTFOLIO FUNCTIONALITY (IMPROVED)
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
       PHOTO ANIMATION
       ============================================ */
    function setupPhotoAnimation(photo) {
        if (!photo) return;

        setTimeout(() => {
            photo.classList.add('fly-in-photo');
        }, CONFIG.animation.delay);
    }

    /* ============================================
       PORTFOLIO PDF DOWNLOAD (CV STYLE)
       ============================================ */
    function downloadPortfolioPDF() {
        const content = document.createElement('div');
        content.innerHTML = `
        <div style="padding:50px;font-family:'Segoe UI',Arial,sans-serif;max-width:900px;margin:auto;color:#000;background:#fff;line-height:1.6;border:1px solid #ddd;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.05);">

            <!-- Header -->
            <div style="text-align:center;border-bottom:3px solid #0055aa;padding-bottom:20px;">
                <h1 style="color:#0055aa;font-size:36px;margin:0;">Ravi Raj</h1>
                <p style="font-size:18px;color:#333;margin:4px 0;">Student | Web Developer</p>
                <p style="font-size:14px;color:#555;">Begusarai, Bihar | rravirajhere@gmail.com</p>
            </div>

            <!-- About -->
            <div style="margin-top:20px;">
                <h2 style="color:#0055aa;border-bottom:2px solid #0055aa;padding-bottom:6px;">📌 About Me</h2>
                <p style="font-size:15px;color:#222;">Passionate 12th-grade student building modern web experiences with HTML, CSS, and Python. I turn ideas into code and love learning new technologies every day.</p>
            </div>

            <!-- Education -->
            <div style="margin-top:20px;">
                <h2 style="color:#0055aa;border-bottom:2px solid #0055aa;padding-bottom:6px;">🎓 Education</h2>
                <ul style="font-size:15px;color:#222;padding-left:20px;">
                    <li><strong>12th (2024–2026):</strong> Udaan International School, Begusarai — Physics, Chemistry, Maths</li>
                    <li><strong>10th (2019–2024):</strong> Mother's Pride International School, Begusarai</li>
                    <li><strong>Primary (2014–2019):</strong> Gautam Buddha Global School, Begusarai</li>
                </ul>
            </div>

            <!-- Skills -->
            <div style="margin-top:20px;">
                <h2 style="color:#0055aa;border-bottom:2px solid #0055aa;padding-bottom:6px;">💻 Skills</h2>
                <ul style="font-size:15px;color:#222;padding-left:20px;">
                    <li><strong>HTML5:</strong> 75%</li>
                    <li><strong>CSS3:</strong> 80%</li>
                    <li><strong>JavaScript:</strong> 50%</li>
                    <li><strong>Python:</strong> 50%</li>
                    <li><strong>Responsive Design:</strong> 70%</li>
                    <li><strong>Tools:</strong> VS Code, Git & GitHub, Chrome DevTools</li>
                </ul>
            </div>

            <!-- Projects -->
            <div style="margin-top:20px;">
                <h2 style="color:#0055aa;border-bottom:2px solid #0055aa;padding-bottom:6px;">🚀 Projects</h2>
                <ul style="font-size:15px;color:#222;padding-left:20px;">
                    <li><strong>Portfolio v2.0:</strong> Modern, responsive portfolio website with Matrix animation, smooth scrolling, and dark/light theme.</li>
                    <li><strong>Modern Landing Page:</strong> Responsive design with smooth animations, gradient effects, and optimized performance.</li>
                </ul>
            </div>

            <!-- Achievements -->
            <div style="margin-top:20px;">
                <h2 style="color:#0055aa;border-bottom:2px solid #0055aa;padding-bottom:6px;">🏆 Achievements</h2>
                <ul style="font-size:15px;color:#222;padding-left:20px;">
                    <li>Built first portfolio website at 17</li>
                    <li>100+ hours of coding practice</li>
                    <li>Completed HTML, CSS, JavaScript courses</li>
                    <li>Helped 10+ friends learn coding</li>
                </ul>
            </div>

            <!-- Contact -->
            <div style="margin-top:20px;padding-top:10px;border-top:2px solid #0055aa;text-align:center;font-size:14px;color:#555;">
                <p>📧 rravirajhere@gmail.com | 🐦 @Raviraj2k09 | 💼 linkedin.com/in/Ravirajhere</p>
                <p style="margin-top:4px;">© 2026 Ravi Raj — Built with ❤️</p>
            </div>

        </div>
        `;

        const win = window.open('', '_blank');
        if (win) {
            win.document.write(content.innerHTML);
            win.document.close();
            win.focus();
            win.print();
        } else {
            alert('Popup blocked! Please allow popups for this site.');
        }
    }

    /* ============================================
       INITIALIZATION
       ============================================ */
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🚀 Portfolio v2.0 - Ravi Raj');
        console.log('📅 Loaded:', new Date().toLocaleString());

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
        const contactForm = new ContactForm(DOM.contactForm);
        const liveDateTime = new LiveDateTime(DOM.timeDisplay);

        setLastUpdated(DOM.lastUpdated);
        setupPhotoAnimation(DOM.heroPhoto);

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

// Close modal on outside click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('rjModal');
    if (modal && e.target === modal) {
        closeRJModal();
    }
});

// Close modal on Escape key
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
// ============================================
// CONTACT OPTIONS FUNCTIONS
// ============================================

function showContactOptions() {
    document.getElementById('contactOptionsModal').style.display = 'flex';
}

function closeContactOptions() {
    document.getElementById('contactOptionsModal').style.display = 'none';
}

function openEmailForm() {
    closeContactOptions();
    document.getElementById('emailFormModal').style.display = 'flex';
}

function closeEmailForm() {
    document.getElementById('emailFormModal').style.display = 'none';
}

// ============================================
// EMAILJS FORM SUBMIT
// ============================================

document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const status = document.getElementById('formStatus');
    status.style.display = 'block';
    status.innerHTML = '⏳ Sending...';
    status.style.color = 'var(--text-secondary, #aaa)';
    
    emailjs.sendForm(
        'YOUR_SERVICE_ID',    // Apna service ID
        'YOUR_TEMPLATE_ID',   // Apna template ID
        this,
        'YOUR_PUBLIC_KEY'     // Apna public key
    )
    .then(function() {
        status.innerHTML = '✅ Message sent successfully!';
        status.style.color = '#00ff88';
        document.getElementById('contactForm').reset();
        setTimeout(() => {
            closeEmailForm();
            status.style.display = 'none';
        }, 3000);
    })
    .catch(function(error) {
        status.innerHTML = '❌ Failed to send. Try again.';
        status.style.color = '#ff4444';
        console.log('EmailJS Error:', error);
    });
});
