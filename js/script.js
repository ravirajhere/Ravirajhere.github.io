/* ==========================================================================
   RAVI RAJ — SITE SCRIPT
   Version: 3.1 (Error-Free)
   Handles: Year · Mobile Menu · Command Palette (K) · Smooth Scroll
            Copy Email · Active Nav · Header Adaptive · Scroll Cue
            External Links · Console Greeting · Reduced Motion
   No dependencies. No frameworks. ~260 lines.
   ========================================================================== */

(function () {
    'use strict';

    /* ======================================================================
       0. HELPERS + PREFERENCES
       ====================================================================== */
    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    const prefersReduced = (() => {
        try {
            return window.matchMedia &&
                   window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        } catch (e) {
            return false;
        }
    })();

    const focusableSelector = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    /* ======================================================================
       1. SAFE STORAGE WRAPPERS
       ====================================================================== */
    const safeStorage = {
        get(key) {
            try { return localStorage.getItem(key); }
            catch (e) { return null; }
        },
        set(key, value) {
            try { localStorage.setItem(key, value); return true; }
            catch (e) { return false; }
        },
        sessionGet(key) {
            try { return sessionStorage.getItem(key); }
            catch (e) { return null; }
        },
        sessionSet(key, value) {
            try { sessionStorage.setItem(key, value); return true; }
            catch (e) { return false; }
        }
    };

    /* ======================================================================
       2. COMMAND PALETTE ELEMENTS — declared early for ESC handler
       ====================================================================== */
    const cmdPalette = $('#cmdPalette');
    const cmdOverlay = $('#cmdOverlay');
    const cmdInput   = $('#cmdInput');
    const cmdList    = $('#cmdList');

    /* ======================================================================
       3. MOBILE MENU ELEMENTS — declared early too
       ====================================================================== */
    const menuBtn       = $('#menuBtn');
    const mobileNav     = $('#mobileNav');
    const mobileOverlay = $('#mobileOverlay');
    const mobileClose   = $('#mobileNavClose');

    /* ======================================================================
       4. YEAR IN FOOTER
       ====================================================================== */
    const yearEl = $('#year');
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    /* ======================================================================
       5. FOCUS TRAP (shared between mobile nav & command palette)
       ====================================================================== */
    let activeTrap = null;

    function trapFocus(container) {
        // Release any prior trap first
        releaseFocus();
        activeTrap = container;
        container.addEventListener('keydown', handleTrapKey);
        document.addEventListener('keydown', handleGlobalEscape);
    }

    function releaseFocus() {
        if (activeTrap) {
            activeTrap.removeEventListener('keydown', handleTrapKey);
            activeTrap = null;
        }
        document.removeEventListener('keydown', handleGlobalEscape);
    }

    function handleTrapKey(e) {
        if (e.key !== 'Tab' || !activeTrap) return;

        const focusables = $$(focusableSelector, activeTrap).filter(
            (el) => el.offsetParent !== null || el === document.activeElement
        );
        if (!focusables.length) return;

        const first = focusables[0];
        const last  = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    function handleGlobalEscape(e) {
        if (e.key !== 'Escape') return;

        if (mobileNav && mobileNav.dataset.open === 'true') {
            closeMenu();
            return;
        }
        if (cmdPalette && cmdPalette.dataset.open === 'true') {
            closeCmd();
        }
    }

    /* ======================================================================
       6. MOBILE MENU
       ====================================================================== */
    let lastFocusedMenu = null;

    function openMenu() {
        if (!mobileNav || !mobileOverlay) return;
        lastFocusedMenu = document.activeElement;

        mobileNav.hidden = false;
        mobileOverlay.hidden = false;

        requestAnimationFrame(() => {
            mobileNav.dataset.open = 'true';
            mobileOverlay.dataset.open = 'true';
        });

        document.body.style.overflow = 'hidden';
        if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
        mobileNav.setAttribute('aria-hidden', 'false');
        mobileOverlay.setAttribute('aria-hidden', 'false');

        requestAnimationFrame(() => {
            const firstLink = $('a', mobileNav);
            if (firstLink && typeof firstLink.focus === 'function') {
                firstLink.focus();
            }
        });

        trapFocus(mobileNav);
    }

    function closeMenu() {
        if (!mobileNav || !mobileOverlay) return;

        mobileNav.dataset.open = 'false';
        mobileOverlay.dataset.open = 'false';
        if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileOverlay.setAttribute('aria-hidden', 'true');

        document.body.style.overflow = '';

        setTimeout(() => {
            mobileNav.hidden = true;
            mobileOverlay.hidden = true;
        }, 400);

        releaseFocus();

        if (lastFocusedMenu && typeof lastFocusedMenu.focus === 'function') {
            try { lastFocusedMenu.focus(); } catch (e) { /* noop */ }
        }
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            const isOpen = mobileNav && mobileNav.dataset.open === 'true';
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    if (mobileClose) mobileClose.addEventListener('click', closeMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);

    // Close on link click (with slight delay for visual feedback)
    $$('#mobileNav a').forEach((link) => {
        link.addEventListener('click', () => {
            setTimeout(closeMenu, 60);
        });
    });

    /* ======================================================================
       7. COMMAND PALETTE (K key)
       ====================================================================== */
    let cmdItems = [];
    let activeIndex = 0;
    let lastFocusedCmd = null;

    if (cmdList) {
        cmdItems = $$('li[role="option"]', cmdList);
    }

    function openCmd() {
        if (!cmdPalette) return;
        lastFocusedCmd = document.activeElement;

        cmdPalette.hidden = false;
        requestAnimationFrame(() => {
            cmdPalette.dataset.open = 'true';
        });

        document.body.style.overflow = 'hidden';

        if (cmdInput) {
            cmdInput.value = '';
            setTimeout(() => {
                if (typeof cmdInput.focus === 'function') cmdInput.focus();
            }, 80);
        }

        setActiveCmd(0);
        filterCmd('');
        trapFocus(cmdPalette);
    }

    function closeCmd() {
        if (!cmdPalette) return;

        cmdPalette.dataset.open = 'false';
        document.body.style.overflow = '';

        setTimeout(() => {
            cmdPalette.hidden = true;
        }, 300);

        releaseFocus();

        if (lastFocusedCmd && typeof lastFocusedCmd.focus === 'function') {
            try { lastFocusedCmd.focus(); } catch (e) { /* noop */ }
        }
    }

    function setActiveCmd(index) {
        if (!cmdItems.length) return;
        activeIndex = (index + cmdItems.length) % cmdItems.length;

        cmdItems.forEach((el, i) => {
            const isActive = i === activeIndex;
            el.classList.toggle('is-active', isActive);
            el.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        const active = cmdItems[activeIndex];
        if (active && typeof active.scrollIntoView === 'function') {
            active.scrollIntoView({ block: 'nearest' });
        }
    }

    function filterCmd(query) {
        const q = String(query || '').trim().toLowerCase();
        let firstVisible = -1;

        cmdItems.forEach((el, i) => {
            const text = (el.textContent || '').toLowerCase();
            const match = !q || text.indexOf(q) !== -1;
            el.style.display = match ? '' : 'none';
            if (match && firstVisible === -1) firstVisible = i;
        });

        if (firstVisible !== -1) {
            setActiveCmd(firstVisible);
        }
    }

    function runCmd(target) {
        if (!target) return;
        closeCmd();

        setTimeout(() => {
            if (target.charAt(0) === '#') {
                const el = document.querySelector(target);
                if (el) {
                    const offset = 100;
                    const top = el.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({
                        top,
                        behavior: prefersReduced ? 'auto' : 'smooth'
                    });
                    el.setAttribute('tabindex', '-1');
                    try { el.focus({ preventScroll: true }); } catch (e) { /* noop */ }
                }
            } else {
                window.location.href = target;
            }
        }, 120);
    }

    // Open palette with K
    document.addEventListener('keydown', (e) => {
        const active = document.activeElement;
        const tag = ((active && active.tagName) || '').toLowerCase();
        const isTyping = tag === 'input' ||
                         tag === 'textarea' ||
                         (active && active.isContentEditable);

        if (e.key === 'k' && !isTyping && !e.metaKey && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            if (cmdPalette && cmdPalette.dataset.open === 'true') {
                closeCmd();
            } else {
                openCmd();
            }
        }
    });

    // Kbd hint button opens palette
    const kbdHint = $('#kbdHint');
    if (kbdHint) kbdHint.addEventListener('click', openCmd);

    // Overlay close
    if (cmdOverlay) cmdOverlay.addEventListener('click', closeCmd);

    // Input filter
    if (cmdInput) {
        cmdInput.addEventListener('input', (e) => {
            filterCmd(e.target.value);
        });

        // Keyboard nav inside palette
        cmdInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveCmd(activeIndex + 1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveCmd(activeIndex - 1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const active = cmdItems[activeIndex];
                if (active && active.dataset) {
                    runCmd(active.dataset.target);
                }
            }
        });
    }

    // Item mouse + click events
    cmdItems.forEach((el, i) => {
        el.addEventListener('mouseenter', () => setActiveCmd(i));
        el.addEventListener('click', () => {
            if (el.dataset) runCmd(el.dataset.target);
        });
    });

    /* ======================================================================
       8. SMOOTH SCROLL (internal anchors)
       ====================================================================== */
    $$('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href === '#' || href.length < 2) return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const top = target.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({
                top,
                behavior: prefersReduced ? 'auto' : 'smooth'
            });

            try {
                history.pushState(null, '', href);
            } catch (err) {
                // Sandboxed iframe or file:// — ignore
            }
        });
    });

    /* ======================================================================
       9. COPY EMAIL TO CLIPBOARD
       ====================================================================== */
    const copyBtn  = $('#copyEmail');
    const emailTxt = $('#emailText');

    async function copyEmail() {
        if (!emailTxt) return;
        const text = emailTxt.textContent.trim();

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for older browsers / non-HTTPS
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.setAttribute('readonly', '');
                ta.style.position = 'absolute';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }
            showCopyState('Copied ✓');
        } catch (err) {
            showCopyState('Copy failed');
        }
    }

    function showCopyState(label) {
        if (!copyBtn || !emailTxt) return;
        const prev = emailTxt.textContent;
        emailTxt.textContent = label;
        setTimeout(() => {
            emailTxt.textContent = prev;
        }, 1600);
    }

    if (copyBtn) copyBtn.addEventListener('click', copyEmail);

    /* ======================================================================
       10. ACTIVE NAV ON SCROLL
       ====================================================================== */
    const sections = $$('section[id]');
    const navLinks = $$('.primary-nav a[href^="#"]');

    function updateActiveNav() {
        if (!sections.length || !navLinks.length) return;

        const scrollY = window.scrollY + 140;
        let currentId = '';

        sections.forEach((section) => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            if (scrollY >= top && scrollY < bottom) {
                currentId = section.id;
            }
        });

        navLinks.forEach((link) => {
            const href = link.getAttribute('href') || '';
            const isActive = href === '#' + currentId;
            link.classList.toggle('is-active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'true');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    let navScrollRaf = null;
    window.addEventListener('scroll', () => {
        if (navScrollRaf) return;
        navScrollRaf = requestAnimationFrame(() => {
            updateActiveNav();
            navScrollRaf = null;
        });
    }, { passive: true });

    window.addEventListener('load', updateActiveNav);
    updateActiveNav();

    /* ======================================================================
       11. HEADER ADAPTIVE (dark → light when over light sections)
       ====================================================================== */
    const header = $('#siteHeader');
    const lightSections = $$('.section-light, .site-footer');

    function updateHeaderTheme() {
        if (!header || !lightSections.length) return;

        const headerRect = header.getBoundingClientRect();
        const headerBottom = headerRect.bottom;
        let overLight = false;

        lightSections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= headerBottom && rect.bottom >= 0) {
                overLight = true;
            }
        });

        header.classList.toggle('is-over-light', overLight);
    }

    let headerRaf = null;
    window.addEventListener('scroll', () => {
        if (headerRaf) return;
        headerRaf = requestAnimationFrame(() => {
            updateHeaderTheme();
            headerRaf = null;
        });
    }, { passive: true });

    window.addEventListener('load', updateHeaderTheme);
    updateHeaderTheme();

    /* ======================================================================
       12. SCROLL CUE FADE
       ====================================================================== */
    const scrollCue = $('.scroll-cue');
    if (scrollCue) {
        const fadeCue = () => {
            const opacity = Math.max(0, 1 - window.scrollY / 300);
            scrollCue.style.opacity = String(opacity);
            scrollCue.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
        };

        window.addEventListener('scroll', fadeCue, { passive: true });
        fadeCue();
    }

    /* ======================================================================
       13. EXTERNAL LINKS — Security
       ====================================================================== */
    $$('a[target="_blank"]').forEach((link) => {
        const rel = link.getAttribute('rel') || '';
        if (rel.indexOf('noopener') === -1) {
            link.setAttribute('rel', (rel + ' noopener noreferrer').trim());
        }
    });

    /* ======================================================================
       14. CONSOLE GREETING (Once per session, tasteful)
       ====================================================================== */
    const hasGreeted = safeStorage.sessionGet('rr-greeted');
    if (!hasGreeted) {
        const accent = 'color:#b45309;font-weight:600;';
        const soft   = 'color:#737373;';

        console.log('%cRavi Raj — Portfolio', `font-size:14px;font-weight:700;${accent}`);
        console.log('%cHi, fellow developer. Thanks for opening the console.', `font-size:12px;${soft}`);
        console.log('%cCode: https://github.com/ravirajhere', `font-size:12px;${soft}`);
        console.log('%cPress K anywhere to jump around the site.', `font-size:12px;${accent}`);

        safeStorage.sessionSet('rr-greeted', '1');
    }

})();
