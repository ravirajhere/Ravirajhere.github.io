// ============================================================
// SCRIPT.JS — Ravi Raj Portfolio
// Handles: Loader · Theme · Sidebar · Cursor · Interests
//          Stats · Typing · Active-link · Toast · Time · Top
//          Thoughts · Blog Archive · Raw Diary Entries
// ============================================================

(function () {
    'use strict';

    // ============================================================
    // 0. HELPER — Safe querySelector
    // ============================================================
    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    // ============================================================
    // 1. LOADER — Hide on page fully loaded
    // ============================================================
    const loader = $('#loader');
    if (loader) {
        const hideLoader = () => {
            setTimeout(() => loader.classList.add('hidden'), 350);
        };
        if (document.readyState === 'complete') {
            hideLoader();
        } else {
            window.addEventListener('load', hideLoader);
        }
        setTimeout(() => loader.classList.add('hidden'), 3000);
    }

    // ============================================================
    // 2. THEME TOGGLE (Dark default → [data-theme] on <html>)
    // ============================================================
    const root = document.documentElement;
    const THEME_KEY = 'raviraj-theme';
    const themeSwitch = $('#themeSwitchNav');

    const savedTheme = (() => {
        try { return localStorage.getItem(THEME_KEY); } catch { return null; }
    })();
    if (savedTheme === 'light' || savedTheme === 'dark') {
        root.setAttribute('data-theme', savedTheme);
    } else {
        root.setAttribute('data-theme', 'dark');
    }

    function setTheme(theme) {
        root.setAttribute('data-theme', theme);
        try { localStorage.setItem(THEME_KEY, theme); } catch { /* silent */ }
    }

    function toggleTheme() {
        const current = root.getAttribute('data-theme') || 'dark';
        setTheme(current === 'dark' ? 'light' : 'dark');
    }

    if (themeSwitch) {
        themeSwitch.addEventListener('click', toggleTheme);
        themeSwitch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
            }
        });
    }

    // ============================================================
    // 3. HAMBURGER / SIDEBAR
    // ============================================================
    const hamburgerBtn   = $('#hamburgerBtn');
    const sidebar        = $('#sidebar');
    const sidebarOverlay = $('#sidebarOverlay');
    const sidebarClose   = $('#sidebarClose');

    function openSidebar() {
        if (!sidebar) return;
        sidebar.classList.add('open');
        sidebarOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeSidebar() {
        if (!sidebar) return;
        sidebar.classList.remove('open');
        sidebarOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    }
    function toggleSidebar() {
        if (!sidebar) return;
        sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    }

    hamburgerBtn?.addEventListener('click', toggleSidebar);
    sidebarOverlay?.addEventListener('click', closeSidebar);
    sidebarClose?.addEventListener('click', closeSidebar);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar?.classList.contains('open')) {
            closeSidebar();
        }
    });

    $$('.sidebar-menu a').forEach((link) => {
        link.addEventListener('click', () => {
            setTimeout(closeSidebar, 250);
        });
    });

    // ============================================================
    // 4. SMOOTH SCROLL — Internal anchors
    // ============================================================
    $$('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href === '#' || href.length < 2) return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    // ============================================================
    // 5. ACTIVE SIDEBAR LINK — on scroll
    // ============================================================
    const sections = $$('section[id]');
    const sidebarLinks = $$('.sidebar-menu a');

    function updateActiveLink() {
        if (!sections.length) return;
        const scrollPos = window.scrollY + 140;
        let current = '';

        sections.forEach((section) => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            if (scrollPos >= top && scrollPos < bottom) {
                current = section.id;
            }
        });

        sidebarLinks.forEach((link) => {
            const href = link.getAttribute('href') || '';
            link.classList.toggle('active', href === '#' + current);
        });
    }
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    window.addEventListener('load', updateActiveLink);

    // ============================================================
    // 6. INTEREST CARDS — Expand / Collapse
    // ============================================================
    window.revealInterest = function (id) {
        const content = document.getElementById(id);
        if (!content) return;
        const card = content.closest('.interest-card');
        if (!card) return;

        const isOpen = card.classList.contains('revealed');

        $$('.interest-card.revealed').forEach((other) => {
            if (other !== card) other.classList.remove('revealed');
        });

        card.classList.toggle('revealed', !isOpen);
    };

    // ============================================================
    // 7. KEYBOARD ACCESSIBILITY — Clickable cards
    // ============================================================
    $$('.interest-card, .milestone-card').forEach((el) => {
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                el.click();
            }
            if (e.key === 'Escape') {
                el.classList.remove('revealed');
            }
        });
    });

    // ============================================================
    // 8. TYPING ANIMATION — Hero subtitle
    // ============================================================
    function initTyping() {
        const el = $('.hero-subtitle');
        if (!el || el.dataset.typed === 'true') return;

        const originalHTML = el.innerHTML;
        if (/<[a-z]/i.test(originalHTML)) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(8px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 900);
            el.dataset.typed = 'true';
            return;
        }

        const text = originalHTML;
        el.textContent = '';
        el.dataset.typed = 'true';
        let i = 0;
        (function type() {
            if (i < text.length) {
                el.textContent += text.charAt(i++);
                setTimeout(type, 45);
            }
        })();
    }
    document.addEventListener('DOMContentLoaded', () => setTimeout(initTyping, 900));

    // ============================================================
    // 9. FOOTER — Dynamic Year
    // ============================================================
    const yearSpan = $('#current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // ============================================================
    // 10. BACK TO TOP
    // ============================================================
    const backToTop = $('#backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============================================================
    // 11. SKILL BARS — Animate on view
    // ============================================================
    const skillItems = $$('.skill-item');
    if (skillItems.length && 'IntersectionObserver' in window) {
        skillItems.forEach((item) => {
            const fill = $('.skill-fill', item);
            if (!fill) return;
            const w = fill.style.width || getComputedStyle(fill).width;
            fill.dataset.targetWidth = w;
            fill.style.width = '0';
        });

        const skillObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const fill = $('.skill-fill', entry.target);
                if (fill && fill.dataset.targetWidth) {
                    requestAnimationFrame(() => {
                        fill.style.width = fill.dataset.targetWidth;
                    });
                }
                obs.unobserve(entry.target);
            });
        }, { threshold: 0.3 });

        skillItems.forEach((item) => skillObserver.observe(item));
    }

    // ============================================================
    // 12. LIVE TIME — Footer (IST)
    // ============================================================
    const liveTimeEl = $('#live-time');
    if (liveTimeEl) {
        const updateLiveTime = () => {
            const now = new Date();
            const opts = {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            };
            liveTimeEl.textContent = '⏱️ ' + now.toLocaleString('en-IN', opts) + ' IST';
        };
        updateLiveTime();
        setInterval(updateLiveTime, 1000);
    }

    // ============================================================
    // 13. CUSTOM CURSOR — Smooth follow + hover state
    // ============================================================
    const cursor = $('#custom-cursor');
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (cursor && canHover) {
        let mouseX = 0, mouseY = 0;
        let curX = 0, curY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        (function animate() {
            curX += (mouseX - curX) * 0.22;
            curY += (mouseY - curY) * 0.22;
            cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
            requestAnimationFrame(animate);
        })();

        // Hover state on interactive elements (includes raw-toggle & archive button)
        const hoverTargets = 'a, button, .interest-card, .milestone-card, .switch, .project-card, .thought-card, .thought-featured, .raw-toggle, .archive-toggle-btn';
        $$(hoverTargets).forEach((el) => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    } else if (cursor) {
        cursor.style.display = 'none';
    }

    // ============================================================
    // 14. TOAST — Reusable notification
    // ============================================================
    const toastEl = $('#toast');
    let toastTimer = null;

    window.showToast = function (msg, duration = 2400) {
        if (!toastEl) return;
        toastEl.textContent = msg;
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toastEl.classList.remove('show');
        }, duration);
    };

    // ============================================================
    // 15. NAVBAR — Shrink on scroll
    // ============================================================
    const topNav = $('#topNav') || $('.top-nav');
    if (topNav) {
        const onScrollNav = () => {
            topNav.classList.toggle('scrolled', window.scrollY > 40);
        };
        window.addEventListener('scroll', onScrollNav, { passive: true });
        onScrollNav();
    }

    // ============================================================
    // 16. FADE-IN ON SCROLL — Sections & Cards
    // ============================================================
    if ('IntersectionObserver' in window) {
        const revealTargets = $$('.section-block, .stat-card, .project-card, .article-card, .milestone-card, .thought-card, .thought-featured');
        revealTargets.forEach((el) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(24px)';
            el.style.transition = 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        const fadeObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                obs.unobserve(entry.target);
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        revealTargets.forEach((el) => fadeObserver.observe(el));
    }

    // ============================================================
    // 17. HELPER — Close raw-content inside a given card
    // ============================================================
    function closeRawInCard(card) {
        if (!card) return;
        card.querySelectorAll('.raw-content.open').forEach((raw) => {
            raw.classList.remove('open');
            const rawBtn = raw.previousElementSibling;
            if (rawBtn && rawBtn.classList.contains('raw-toggle')) {
                rawBtn.classList.remove('active');
                rawBtn.innerHTML = '📓 Read Original Diary Entry';
            }
        });
    }

    // ============================================================
    // 18. MY THOUGHTS — Expandable blog cards
    //     Click anywhere on card to toggle. Accordion behavior.
    //     Closing a card also closes any open raw-content inside it.
    // ============================================================
    window.toggleThought = function (id) {
        const content = document.getElementById(id);
        if (!content) return;

        const card = content.closest('.thought-featured, .thought-card');
        if (!card) return;

        const isOpen = card.classList.contains('expanded');

        // Close all other expanded cards first (accordion)
        $$('.thought-featured.expanded, .thought-card.expanded').forEach((other) => {
            if (other === card) return;
            other.classList.remove('expanded');

            // Update toggle text of the other card
            const otherToggle = $('.thought-toggle', other);
            if (otherToggle && otherToggle.firstChild) {
                otherToggle.firstChild.nodeValue = 'Read Full Thought ';
            }

            // Close any open raw-content inside the other card
            closeRawInCard(other);
        });

        // Toggle current card
        card.classList.toggle('expanded', !isOpen);

        // Update toggle text (only the leading text node, keep the icon)
        const toggle = $('.thought-toggle', card);
        if (toggle && toggle.firstChild) {
            toggle.firstChild.nodeValue = isOpen
                ? 'Read Full Thought '
                : 'Close Thought ';
        }

        // If closing this card, also close raw-content inside it
        if (isOpen) {
            closeRawInCard(card);
        }

        // Smooth-scroll to card if it just opened
        if (!isOpen) {
            setTimeout(() => {
                const top = card.getBoundingClientRect().top + window.scrollY - 90;
                window.scrollTo({ top, behavior: 'smooth' });
            }, 280);
        }
    };

    // ============================================================
    // 19. BLOG ARCHIVE — Toggle expand/collapse
    // ============================================================
    window.toggleArchive = function () {
        const archive = document.getElementById('blogArchive');
        const btn = document.getElementById('archiveToggleBtn');
        if (!archive || !btn) return;

        const isOpen = archive.classList.contains('open');

        // Toggle
        archive.classList.toggle('open', !isOpen);
        btn.classList.toggle('active', !isOpen);

        // Update button text
        const btnText = $('.archive-btn-text', btn);
        if (btnText) {
            btnText.textContent = isOpen ? 'View Blog Archive' : 'Hide Blog Archive';
        }

        // If collapsing, close any open raw-content inside archive
        if (isOpen) {
            archive.querySelectorAll('.raw-content.open').forEach((raw) => {
                raw.classList.remove('open');
                const rawBtn = raw.previousElementSibling;
                if (rawBtn && rawBtn.classList.contains('raw-toggle')) {
                    rawBtn.classList.remove('active');
                    rawBtn.innerHTML = '📓 Read Original Diary Entry';
                }
            });
        }

        // Smooth scroll to archive button if just opened
        if (!isOpen) {
            setTimeout(() => {
                const top = btn.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top, behavior: 'smooth' });
            }, 400);
        }
    };

    // ============================================================
    // 20. RAW DIARY — Toggle original diary entry
    //     Opens inside an already-expanded thought card.
    //     Uses stopPropagation on the button to prevent card collapse.
    // ============================================================
    window.toggleRaw = function (id) {
        const raw = document.getElementById(id);
        if (!raw) return;

        const btn = raw.previousElementSibling;
        if (!btn || !btn.classList.contains('raw-toggle')) return;

        const isOpen = raw.classList.contains('open');

        // Close any other open raw-content on the page
        $$('.raw-content.open').forEach((other) => {
            if (other === raw) return;
            other.classList.remove('open');
            const otherBtn = other.previousElementSibling;
            if (otherBtn && otherBtn.classList.contains('raw-toggle')) {
                otherBtn.classList.remove('active');
                otherBtn.innerHTML = '📓 Read Original Diary Entry';
            }
        });

        // Toggle current
        raw.classList.toggle('open', !isOpen);
        btn.classList.toggle('active', !isOpen);
        btn.innerHTML = isOpen
            ? '📓 Read Original Diary Entry'
            : '✕ Hide Original Entry';

        // Small smooth scroll to raw content
        if (!isOpen) {
            setTimeout(() => {
                const top = raw.getBoundingClientRect().top + window.scrollY - 120;
                window.scrollTo({ top, behavior: 'smooth' });
            }, 250);
        }
    };

    /* ============================================================
   OPTIONAL PERSONALIZED GREETING (Soft Version)
   ============================================================ */
(function initGreeting() {
    'use strict';

    const heroTitle = document.getElementById('heroTitle');
    const greetingBox = document.getElementById('greetingBox');
    const input = document.getElementById('userNameInput');

    if (!heroTitle || !greetingBox || !input) return;

    // Check saved name
    const savedName = localStorage.getItem('visitorName');
    const skipped = localStorage.getItem('greetingSkipped');

    if (savedName) {
        applyPersonalizedGreeting(savedName, false);
        greetingBox.classList.add('hidden');
        return;
    }

    if (skipped) {
        greetingBox.classList.add('hidden');
        return;
    }

    // Greet user
    window.greetUser = function () {
        const rawName = input.value.trim();

        if (!rawName) {
            input.focus();
            input.style.animation = 'shake 0.4s';
            setTimeout(() => { input.style.animation = ''; }, 400);
            return;
        }

        const cleanName = rawName.replace(/[<>]/g, '').slice(0, 30);
        localStorage.setItem('visitorName', cleanName);
        applyPersonalizedGreeting(cleanName, true);
        greetingBox.classList.add('hidden');
    };

    // Apply name to hero title
    function applyPersonalizedGreeting(name, animate) {
        heroTitle.innerHTML =
            `Hey <span class="user-name-highlight">${escapeHTML(name)}</span>, ` +
            `I'm <span>Ravi Raj</span> 👋`;

        if (animate) {
            heroTitle.classList.add('personalized');
            setTimeout(() => heroTitle.classList.remove('personalized'), 700);
        }
    }

    // Escape HTML (safety)
    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // Enter key support
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            window.greetUser();
        }
    });

})();

/* Shake animation for empty input */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-6px); }
        50% { transform: translateX(6px); }
        75% { transform: translateX(-4px); }
    }
`;
document.head.appendChild(shakeStyle);

    // ============================================================
    // 21. EASTER EGG — Console Welcome
    // ============================================================
    const gold = 'color:#d4a373;font-weight:600;';
    const cream = 'color:#f5ede4;';
    console.log('%c 👋 Hey there, fellow developer!', `font-size:18px;font-weight:700;${gold}`);
    console.log('%c Thanks for peeking under the hood. Built with ❤️ by Ravi Raj', `font-size:13px;${cream}`);
    console.log('%c 📖 https://github.com/ravirajhere', `font-size:13px;${gold}`);
    console.log('%c ✅ Portfolio loaded successfully.', `font-size:12px;${cream}`);

})();
