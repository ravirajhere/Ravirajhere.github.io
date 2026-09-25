/* ==========================================================================
   RAVI RAJ — PORTFOLIO SCRIPT
   Version: 4.2 (Milestones · Mobile-safe K · Live Stats fix)
   ========================================================================== */

(function () {
    'use strict';

    /* ======================================================================
       1. HELPERS
       ====================================================================== */
    const $  = (sel, ctx) => (ctx || document).querySelector(sel);
    const $$ = (sel, ctx) => Array.prototype.slice.call(
        (ctx || document).querySelectorAll(sel)
    );

    const prefersReduced = (function () {
        try {
            return window.matchMedia &&
                   window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        } catch (e) {
            return false;
        }
    })();

    /* Mobile detection (matches CSS breakpoint) */
    const isMobile = (function () {
        try {
            return window.matchMedia('(max-width: 768px)').matches;
        } catch (e) {
            return false;
        }
    })();

    const FOCUSABLE = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    function sessionGet(key) {
        try { return sessionStorage.getItem(key); }
        catch (e) { return null; }
    }
    function sessionSet(key, value) {
        try { sessionStorage.setItem(key, value); return true; }
        catch (e) { return false; }
    }

    /* ======================================================================
       2. ELEMENT REFERENCES
       ====================================================================== */
    const cmdPalette    = $('#cmdPalette');
    const cmdOverlay    = $('#cmdOverlay');
    const cmdInput      = $('#cmdInput');
    const cmdList       = $('#cmdList');

    const menuBtn       = $('#menuBtn');
    const mobileNav     = $('#mobileNav');
    const mobileOverlay = $('#mobileOverlay');
    const mobileClose   = $('#mobileNavClose');

    const header        = $('#siteHeader');
    const yearEl        = $('#year');
    const kbdHint       = $('#kbdHint');
    const copyBtn       = $('#copyEmail');
    const emailTxt      = $('#emailText');
    const scrollCue     = $('.scroll-cue');

    const sections      = $$('section[id]');

    /* Auto-derive nav links from href (works with or without data-nav) */
    const navLinks      = $$('.primary-nav a[href^="#"]');

    /* ======================================================================
       3. YEAR IN FOOTER
       ====================================================================== */
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    /* ======================================================================
       4. FOCUS TRAP
       ====================================================================== */
    let activeTrap = null;

    function handleTrapKey(e) {
        if (e.key !== 'Tab' || !activeTrap) return;

        const focusables = $$(FOCUSABLE, activeTrap).filter(function (el) {
            return el.offsetParent !== null || el === document.activeElement;
        });
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

    function trapFocus(container) {
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

    /* ======================================================================
       5. MOBILE MENU
       ====================================================================== */
    let lastFocusedMenu = null;

    function openMenu() {
        if (!mobileNav || !mobileOverlay) return;
        lastFocusedMenu = document.activeElement;

        mobileNav.hidden = false;
        mobileOverlay.hidden = false;
        void mobileNav.offsetHeight;

        mobileNav.dataset.open = 'true';
        mobileOverlay.dataset.open = 'true';

        document.body.style.overflow = 'hidden';
        if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
        mobileNav.setAttribute('aria-hidden', 'false');
        mobileOverlay.setAttribute('aria-hidden', 'false');

        setTimeout(function () {
            const firstLink = $('a', mobileNav);
            if (firstLink && typeof firstLink.focus === 'function') {
                try { firstLink.focus(); } catch (e) {}
            }
        }, 100);

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

        setTimeout(function () {
            mobileNav.hidden = true;
            mobileOverlay.hidden = true;
        }, 500);

        releaseFocus();

        if (lastFocusedMenu && typeof lastFocusedMenu.focus === 'function') {
            try { lastFocusedMenu.focus(); } catch (e) {}
        }
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', function () {
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

    $$('#mobileNav a').forEach(function (link) {
        link.addEventListener('click', function () {
            setTimeout(closeMenu, 60);
        });
    });

    /* ======================================================================
       6. COMMAND PALETTE
       ====================================================================== */
    let cmdItems = cmdList ? $$('li[role="option"]', cmdList) : [];
    let activeIndex = 0;
    let lastFocusedCmd = null;

    function openCmd() {
        if (!cmdPalette) return;
        lastFocusedCmd = document.activeElement;

        cmdPalette.hidden = false;
        void cmdPalette.offsetHeight;
        cmdPalette.dataset.open = 'true';

        document.body.style.overflow = 'hidden';

        if (cmdInput) {
            cmdInput.value = '';
            setTimeout(function () {
                if (typeof cmdInput.focus === 'function') {
                    try { cmdInput.focus(); } catch (e) {}
                }
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

        setTimeout(function () {
            cmdPalette.hidden = true;
        }, 300);

        releaseFocus();

        if (lastFocusedCmd && typeof lastFocusedCmd.focus === 'function') {
            try { lastFocusedCmd.focus(); } catch (e) {}
        }
    }

    function setActiveCmd(index) {
        if (!cmdItems.length) return;
        activeIndex = (index + cmdItems.length) % cmdItems.length;

        cmdItems.forEach(function (el, i) {
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

        cmdItems.forEach(function (el, i) {
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

        setTimeout(function () {
            if (target.charAt(0) === '#') {
                const el = document.querySelector(target);
                if (el) {
                    const offset = 100;
                    const top = el.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({
                        top: top,
                        behavior: prefersReduced ? 'auto' : 'smooth'
                    });
                    el.setAttribute('tabindex', '-1');
                    try { el.focus({ preventScroll: true }); } catch (e) {}
                }
            } else {
                window.location.href = target;
            }
        }, 120);
    }

    /* K key — DESKTOP ONLY */
    document.addEventListener('keydown', function (e) {
        /* Mobile pe K key kaam nahi karega */
        if (isMobile) return;

        const active = document.activeElement;
        const tag = ((active && active.tagName) || '').toLowerCase();
        const isTyping = tag === 'input' ||
                         tag === 'textarea' ||
                         (active && active.isContentEditable);

        const key = String(e.key || '').toLowerCase();

        if (key === 'k' && !isTyping && !e.metaKey && !e.ctrlKey && !e.altKey) {
            if (mobileNav && mobileNav.dataset.open === 'true') {
                return;
            }
            e.preventDefault();
            if (cmdPalette && cmdPalette.dataset.open === 'true') {
                closeCmd();
            } else {
                openCmd();
            }
        }
    });

    if (kbdHint) kbdHint.addEventListener('click', openCmd);
    if (cmdOverlay) cmdOverlay.addEventListener('click', closeCmd);

    if (cmdInput) {
        cmdInput.addEventListener('input', function (e) {
            filterCmd(e.target.value);
        });

        cmdInput.addEventListener('keydown', function (e) {
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

    cmdItems.forEach(function (el, i) {
        el.addEventListener('mouseenter', function () { setActiveCmd(i); });
        el.addEventListener('click', function () {
            if (el.dataset) runCmd(el.dataset.target);
        });
    });

    /* ======================================================================
       7. SMOOTH SCROLL
       ====================================================================== */
    $$('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            const href = link.getAttribute('href');
            if (!href || href === '#' || href.length < 2) return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const top = target.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({
                top: top,
                behavior: prefersReduced ? 'auto' : 'smooth'
            });

            try { history.pushState(null, '', href); } catch (err) {}
        });
    });

    /* ======================================================================
       8. COPY EMAIL
       ====================================================================== */
    function showCopyState(label) {
        if (!copyBtn || !emailTxt) return;
        const prev = emailTxt.textContent;
        emailTxt.textContent = label;
        setTimeout(function () {
            emailTxt.textContent = prev;
        }, 1600);
    }

    function copyEmail() {
        if (!emailTxt) return;
        const text = emailTxt.textContent.trim();

        try {
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(
                    function () { showCopyState('Copied ✓'); },
                    function () { showCopyState('Copy failed'); }
                );
            } else {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.setAttribute('readonly', '');
                ta.style.position = 'absolute';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                showCopyState('Copied ✓');
            }
        } catch (err) {
            showCopyState('Copy failed');
        }
    }

    if (copyBtn) copyBtn.addEventListener('click', copyEmail);

    /* ======================================================================
       9. ACTIVE NAV ON SCROLL (auto-derive from href)
       ====================================================================== */
    function updateActiveNav() {
        if (!sections.length || !navLinks.length) return;

        const scrollY = window.scrollY + 140;
        let currentId = '';

        for (let i = 0; i < sections.length; i++) {
            const s = sections[i];
            const top = s.offsetTop;
            const bottom = top + s.offsetHeight;
            if (scrollY >= top && scrollY < bottom) {
                currentId = s.id;
                break;
            }
        }

        navLinks.forEach(function (link) {
            const href = link.getAttribute('href') || '';
            const navKey = href.charAt(0) === '#' ? href.slice(1) : '';
            const isActive = navKey === currentId;
            link.classList.toggle('is-active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'true');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    let navRaf = null;
    window.addEventListener('scroll', function () {
        if (navRaf) return;
        navRaf = requestAnimationFrame(function () {
            updateActiveNav();
            navRaf = null;
        });
    }, { passive: true });

    window.addEventListener('load', updateActiveNav);
    updateActiveNav();

    /* ======================================================================
       10. SCROLL CUE FADE
       ====================================================================== */
    if (scrollCue) {
        let cueRaf = null;

        const fadeCue = function () {
            const opacity = Math.max(0, 1 - window.scrollY / 300);
            scrollCue.style.opacity = String(opacity);
            scrollCue.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
        };

        window.addEventListener('scroll', function () {
            if (cueRaf) return;
            cueRaf = requestAnimationFrame(function () {
                fadeCue();
                cueRaf = null;
            });
        }, { passive: true });

        fadeCue();
    }

    /* ======================================================================
       11. EXTERNAL LINKS SECURITY
       ====================================================================== */
    $$('a[target="_blank"]').forEach(function (link) {
        const rel = link.getAttribute('rel') || '';
        if (rel.indexOf('noopener') === -1) {
            link.setAttribute('rel', (rel + ' noopener noreferrer').trim());
        }
    });

    /* ======================================================================
       12. CONSOLE GREETING
       ====================================================================== */
    const hasGreeted = sessionGet('rr-greeted');
    if (!hasGreeted) {
        const accent = 'color:#b45309;font-weight:600;';
        const soft   = 'color:#737373;';

        console.log('%cRavi Raj — Portfolio', 'font-size:14px;font-weight:700;' + accent);
        console.log('%cHi, fellow developer. Thanks for opening the console.', 'font-size:12px;' + soft);
        console.log('%cCode: https://github.com/ravirajhere', 'font-size:12px;' + soft);
        console.log('%cPress K anywhere to jump around the site.', 'font-size:12px;' + accent);

        sessionSet('rr-greeted', '1');
    }

    /* ======================================================================
       13. LIVE GITHUB STATS (FIXED selector)
       ====================================================================== */
    (function initLiveStats() {
        /* Aapke HTML me: <span class="tb-commits" id="tbCommits" data-live="last-commit"> */
        const lastCommitEl = $('[data-live="last-commit"]');

        if (!lastCommitEl) return;

        fetch('/api/stats')
            .then(function (res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.json();
            })
            .then(function (data) {
                if (!data || !data.lastCommit) return;

                const days = data.lastCommit.daysAgo;
                /* Text element dhundho (dot ke alawa) */
                const textEl = lastCommitEl.querySelector('.tb-commits-text') || lastCommitEl;

                if (days === 0) {
                    textEl.textContent = 'Committed today';
                } else if (days === 1) {
                    textEl.textContent = 'Last commit: yesterday';
                } else if (days !== null && days >= 0) {
                    textEl.textContent = 'Last commit: ' + days + 'd ago';
                }

                console.log('[stats] Live data loaded:', data);
            })
            .catch(function (err) {
                console.warn('[stats] Failed to load:', err.message);
                /* Silent fail — static "Committed today" remains */
            });
    })();

})();
