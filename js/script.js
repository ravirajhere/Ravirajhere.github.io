// ============================================================
// SCRIPT.JS — Ravi Raj Portfolio
// Handles: Loader · Theme · Sidebar · Cursor · Interests
//          Stats · Typing · Active-link · Toast · Time · Top
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
            // Small delay for perceived smoothness
            setTimeout(() => loader.classList.add('hidden'), 350);
        };
        if (document.readyState === 'complete') {
            hideLoader();
        } else {
            window.addEventListener('load', hideLoader);
        }
        // Safety fallback (in case 'load' never fires)
        setTimeout(() => loader.classList.add('hidden'), 3000);
    }

    // ============================================================
    // 2. THEME TOGGLE (Dark default → [data-theme] on <html>)
    // ============================================================
    const root = document.documentElement;
    const THEME_KEY = 'raviraj-theme';
    const themeSwitch = $('#themeSwitchNav');

    // Restore saved theme
    const savedTheme = (() => {
        try { return localStorage.getItem(THEME_KEY); } catch { return null; }
    })();
    if (savedTheme === 'light' || savedTheme === 'dark') {
        root.setAttribute('data-theme', savedTheme);
    } else {
        // Default = dark
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
        // Keyboard accessibility
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

    // ESC key closes sidebar
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar?.classList.contains('open')) {
            closeSidebar();
        }
    });

    // Close sidebar when any menu link is clicked (for smooth scroll)
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
    //    Uses .revealed class (matches new CSS transition)
    // ============================================================
    window.revealInterest = function (id) {
        const content = document.getElementById(id);
        if (!content) return;
        const card = content.closest('.interest-card');
        if (!card) return;

        const isOpen = card.classList.contains('revealed');

        // Close all other cards first
        $$('.interest-card.revealed').forEach((other) => {
            if (other !== card) other.classList.remove('revealed');
        });

        // Toggle current
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

        // Preserve inner HTML structure by only typing text nodes
        const originalHTML = el.innerHTML;
        // Skip if it contains tags like <span> — keep as-is for safety
        if (/<[a-z]/i.test(originalHTML)) {
            // If subtitle has markup, animate opacities instead
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
    //    Uses .skill-item / .skill-fill (matches new CSS)
    // ============================================================
    const skillItems = $$('.skill-item');
    if (skillItems.length && 'IntersectionObserver' in window) {
        // Cache target widths
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
                    // Small stagger for nice reveal
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

        // Smooth lerp animation
        (function animate() {
            curX += (mouseX - curX) * 0.22;
            curY += (mouseY - curY) * 0.22;
            cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
            requestAnimationFrame(animate);
        })();

        // Hover state on interactive elements
        const hoverTargets = 'a, button, .interest-card, .milestone-card, .switch, .project-card';
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
        const revealTargets = $$('.section-block, .stat-card, .project-card, .article-card, .milestone-card');
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
    // 17. EASTER EGG — Console Welcome
    // ============================================================
    const gold = 'color:#d4a373;font-weight:600;';
    const cream = 'color:#f5ede4;';
    console.log('%c 👋 Hey there, fellow developer!', `font-size:18px;font-weight:700;${gold}`);
    console.log('%c Thanks for peeking under the hood. Built with ❤️ by Ravi Raj', `font-size:13px;${cream}`);
    console.log('%c 📖 https://github.com/ravirajhere', `font-size:13px;${gold}`);
    console.log('%c ✅ Portfolio loaded successfully.', `font-size:12px;${cream}`);

})();
