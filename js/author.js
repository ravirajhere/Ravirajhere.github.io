/* ============================================================
   author.js — Ravi Raj Singh · Author Website
   Handles: Header scroll state, Mobile menu, Smooth scroll
   ============================================================ */

(function () {
    'use strict';

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    /* ------------------------------------------------------------
       1. HEADER — solid on scroll
       ------------------------------------------------------------ */
    function initHeader() {
        const header = $('#siteHeader');
        if (!header) return;

        let ticking = false;

        const update = () => {
            const scrolled = window.scrollY > 40;
            header.classList.toggle('is-scrolled', scrolled);
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });

        update();
    }

    /* ------------------------------------------------------------
       2. MOBILE MENU
       ------------------------------------------------------------ */
    function initMobileMenu() {
        const toggle = $('#menuToggle');
        const menu = $('#mobileMenu');
        if (!toggle || !menu) return;

        const open = () => {
            toggle.setAttribute('aria-expanded', 'true');
            toggle.setAttribute('aria-label', 'Close menu');
            menu.classList.add('is-open');
            document.body.classList.add('menu-open');
        };

        const close = () => {
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Open menu');
            menu.classList.remove('is-open');
            document.body.classList.remove('menu-open');
        };

        toggle.addEventListener('click', () => {
            const isOpen = toggle.getAttribute('aria-expanded') === 'true';
            isOpen ? close() : open();
        });

        // Close on link click
        $$('#mobileMenu a').forEach(link => {
            link.addEventListener('click', close);
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('is-open')) {
                close();
                toggle.focus();
            }
        });

        // Close on resize to desktop
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 640) close();
            }, 150);
        });
    }

    /* ------------------------------------------------------------
       3. SMOOTH SCROLL for nav links
       (native CSS handles most; this fixes iOS + focus)
       ------------------------------------------------------------ */
    function initSmoothScroll() {
        $$('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (!href || href === '#' || href.length < 2) return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                const header = $('#siteHeader');
                const offset = header ? header.offsetHeight + 8 : 0;

                const targetTop = target.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: targetTop,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                if (history.replaceState) {
                    history.replaceState(null, '', href);
                }

                // Move focus for accessibility
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
                target.addEventListener('blur', function onBlur() {
                    target.removeAttribute('tabindex');
                    target.removeEventListener('blur', onBlur);
                });
            });
        });
    }

    /* ------------------------------------------------------------
       4. INIT
       ------------------------------------------------------------ */
    function init() {
        const safe = (name, fn) => {
            try { fn(); }
            catch (e) { console.warn('[author.js] ' + name + ' failed:', e); }
        };

        safe('initHeader',       initHeader);
        safe('initMobileMenu',   initMobileMenu);
        safe('initSmoothScroll', initSmoothScroll);

        document.body.classList.add('js-ready');
        console.log('✅ author.js loaded');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
