/* ==========================================================================
   RAVI RAJ — SITE SCRIPT
   Version: 3.0
   Handles: Year · Mobile Menu · Command Palette (K) · Smooth Scroll
            Copy Email · Active Nav · Scroll Cue · Reduced Motion
   No dependencies. No frameworks. ~230 lines.
   ========================================================================== */

(function () {
    'use strict';

    /* ======================================================================
       0. HELPERS + PREFERENCES
       ====================================================================== */
    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const focusableSelector = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    /* ======================================================================
       1. YEAR IN FOOTER
       ====================================================================== */
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ======================================================================
       2. MOBILE MENU
       ====================================================================== */
    const menuBtn       = $('#menuBtn');
    const mobileNav     = $('#mobileNav');
    const mobileOverlay = $('#mobileOverlay');
    const mobileClose   = $('#mobileNavClose');

    let lastFocused = null;

    function openMenu() {
        if (!mobileNav || !mobileOverlay) return;
        lastFocused = document.activeElement;

        mobileNav.hidden = false;
        mobileOverlay.hidden = false;

        // force reflow for transition
        requestAnimationFrame(() => {
            mobileNav.dataset.open = 'true';
            mobileOverlay.dataset.open = 'true';
        });

        document.body.style.overflow = 'hidden';
        menuBtn?.setAttribute('aria-expanded', 'true');

        // Focus first link
        requestAnimationFrame(() => {
            const firstLink = $('a', mobileNav);
            firstLink?.focus();
        });

        trapFocus(mobileNav);
    }

    function closeMenu() {
        if (!mobileNav || !mobileOverlay) return;

        mobileNav.dataset.open = 'false';
        mobileOverlay.dataset.open = 'false';
        menuBtn?.setAttribute('aria-expanded', 'false');

        document.body.style.overflow = '';

        setTimeout(() => {
            mobileNav.hidden = true;
            mobileOverlay.hidden = true;
        }, 400);

        releaseFocus();

        if (lastFocused && typeof lastFocused.focus === 'function') {
            lastFocused.focus();
        }
    }

    menuBtn?.addEventListener('click', () => {
        const isOpen = mobileNav?.dataset.open === 'true';
        isOpen ? closeMenu() : openMenu();
    });

    mobileClose?.addEventListener('click', closeMenu);
    mobileOverlay?.addEventListener('click', closeMenu);

    // Close on link click
    $$('#mobileNav a').forEach((link) => {
        link.addEventListener('click', () => {
            setTimeout(closeMenu, 50);
        });
    });

    /* ======================================================================
       3. FOCUS TRAP (for mobile nav & command palette)
       ====================================================================== */
    let activeTrap = null;

    function trapFocus(container) {
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
            (el) => el.offsetParent !== null
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
        if (mobileNav?.dataset.open === 'true') {
            closeMenu();
        }
        if (cmdPalette?.dataset.open === 'true') {
            closeCmd();
        }
    }

    /* ======================================================================
       4. COMMAND PALETTE (K key)
       ====================================================================== */
    const cmdPalette = $('#cmdPalette');
    const cmdOverlay = $('#cmdOverlay');
    const cmdInput   = $('#cmdInput');
    const cmdList    = $('#cmdList');

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
            setTimeout(() => cmdInput.focus(), 80);
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
            lastFocusedCmd.focus();
        }
    }

    function setActiveCmd(index) {
        if (!cmdItems.length) return;
        activeIndex = (index + cmdItems.length) % cmdItems.length;
        cmdItems.forEach((el, i) => {
            el.classList.toggle('is-active', i === activeIndex);
            el.setAttribute('aria-selected', i === activeIndex ? 'true' : 'false');
        });
        const active = cmdItems[activeIndex];
        if (active) {
            active.scrollIntoView({ block: 'nearest' });
        }
    }

    function filterCmd(query) {
        const q = query.trim().toLowerCase();
        let firstVisible = -1;

        cmdItems.forEach((el, i) => {
            const text = el.textContent.toLowerCase();
            const match = !q || text.includes(q);
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
            if (target.startsWith('#')) {
                const el = document.querySelector(target);
                if (el) {
                    const offset = 100;
                    const top = el.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({
                        top,
                        behavior: prefersReduced ? 'auto' : 'smooth'
                    });
                    el.setAttribute('tabindex', '-1');
                    el.focus({ preventScroll: true });
                }
            } else {
                window.location.href = target;
            }
        }, 120);
    }

    // Open palette with K
    document.addEventListener('keydown', (e) => {
        const tag = (document.activeElement?.tagName || '').toLowerCase();
        const isTyping = tag === 'input' || tag === 'textarea' || document.activeElement?.isContentEditable;

        if (e.key === 'k' && !isTyping && !e.metaKey && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            if (cmdPalette?.dataset.open === 'true') {
                closeCmd();
            } else {
                openCmd();
            }
        }
    });

    // Kbd hint button
    $('#kbdHint')?.addEventListener('click', openCmd);

    // Overlay close
    cmdOverlay?.addEventListener('click', closeCmd);

    // Input filter
    cmdInput?.addEventListener('input', (e) => {
        filterCmd(e.target.value);
    });

    // Keyboard nav inside palette
    cmdInput?.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveCmd(activeIndex + 1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveCmd(activeIndex - 1);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const active = cmdItems[activeIndex];
            if (active) {
                runCmd(active.dataset.target);
            }
        }
    });

    // Item click
    cmdItems.forEach((el, i) => {
        el.addEventListener('mouseenter', () => setActiveCmd(i));
        el.addEventListener('click', () => runCmd(el.dataset.target));
    });

    /* ======================================================================
       5. SMOOTH SCROLL (internal anchors, respects header height)
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

            // Update URL without jump
            history.pushState(null, '', href);
        });
    });

    /* ======================================================================
       6. COPY EMAIL TO CLIPBOARD
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
        if (!copyBtn) return;
        const original = copyBtn.getAttribute('data-label') || emailTxt?.textContent || '';
        copyBtn.setAttribute('data-label', original);

        // Replace visual text briefly
        const span = $('#emailText');
        if (span) {
            const prev = span.textContent;
            span.textContent = label;
            setTimeout(() => {
                span.textContent = prev;
            }, 1600);
        }
    }

    copyBtn?.addEventListener('click', copyEmail);

    /* ======================================================================
       7. ACTIVE NAV ON SCROLL
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
    window.addEventListener(
        'scroll',
        () => {
            if (navScrollRaf) return;
            navScrollRaf = requestAnimationFrame(() => {
                updateActiveNav();
                navScrollRaf = null;
            });
        },
        { passive: true }
    );

    window.addEventListener('load', updateActiveNav);
    updateActiveNav();

    /* ======================================================================
       8. HEADER TRANSITION ON SCROLL (dark → adapts when light section visible)
       ====================================================================== */
    const header = $('#siteHeader');
    const lightSections = $$('.section-light, .site-footer');

    function updateHeaderTheme() {
        if (!header || !lightSections.length) return;

        const headerBottom = header.getBoundingClientRect().bottom;
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
    window.addEventListener(
        'scroll',
        () => {
            if (headerRaf) return;
            headerRaf = requestAnimationFrame(() => {
                updateHeaderTheme();
                headerRaf = null;
            });
        },
        { passive: true }
    );

    window.addEventListener('load', updateHeaderTheme);
    updateHeaderTheme();

    /* ======================================================================
       9. SCROLL CUE FADE
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
       10. EXTERNAL LINKS — Security + A11y
       ====================================================================== */
    $$('a[target="_blank"]').forEach((link) => {
        if (!link.hasAttribute('rel')) {
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });

    /* ======================================================================
       11. CONSOLE GREETING (Once, tasteful)
       ====================================================================== */
    const hasGreeted = sessionStorage.getItem('rr-greeted');
    if (!hasGreeted) {
        const accent = 'color:#b45309;font-weight:600;';
        const soft   = 'color:#737373;';

        console.log('%cRavi Raj — Portfolio', `font-size:14px;font-weight:700;${accent}`);
        console.log('%cHi, fellow developer. Thanks for opening the console.', `font-size:12px;${soft}`);
        console.log('%cCode: https://github.com/ravirajhere', `font-size:12px;${soft}`);
        console.log('%cPress K anywhere to jump around the site.', `font-size:12px;${accent}`);

        try { sessionStorage.setItem('rr-greeted', '1'); } catch (e) {}
    }

})();
