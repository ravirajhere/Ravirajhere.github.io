// ============================================================
// THEME TOGGLE — DARK / LIGHT (2 MODES)
// ============================================================
const switchEl = document.getElementById('themeSwitch');
const themeLabel = document.getElementById('themeLabel');
let darkMode = localStorage.getItem('theme') === 'dark';

function setTheme(dark) {
    darkMode = dark;
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    switchEl.classList.toggle('active', dark);
    themeLabel.textContent = dark ? 'Dark' : 'Light';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
}

switchEl.addEventListener('click', () => setTheme(!darkMode));
switchEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setTheme(!darkMode);
    }
});

// Initialize theme
setTheme(darkMode);

// ============================================================
// LIVE TIME — REAL-TIME CLOCK
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
// INTEREST REVEAL — CLICK TO EXPAND
// ============================================================
function revealInterest(id) {
    const content = document.getElementById(id);
    if (!content) return;
    
    // Close all other hidden contents
    document.querySelectorAll('.hidden-content').forEach(el => {
        if (el.id !== id) {
            el.style.display = 'none';
        }
    });
    
    // Toggle this one
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
}

// ============================================================
// SCROLL TO TOP
// ============================================================
const scrollBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
    if (scrollBtn) {
        scrollBtn.classList.toggle('visible', window.scrollY > 400);
    }
});

if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================================
// SMOOTH SCROLL FOR NAVIGATION LINKS
// ============================================================
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// ============================================================
// KEYBOARD ACCESSIBILITY — Interest & Milestone Cards
// ============================================================
document.querySelectorAll('.interest-card, .milestone-card').forEach(el => {
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            el.click();
        }
    });
});

// ============================================================
// PERFORMANCE — DEBOUNCE SCROLL EVENTS
// ============================================================
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        // Any heavy scroll operations here
    }, 100);
});

// ============================================================
// PAGE VISIBILITY — PAUSE UPDATES WHEN TAB IS HIDDEN
// ============================================================
let timeInterval;

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        clearInterval(timeInterval);
    } else {
        updateTime();
        timeInterval = setInterval(updateTime, 1000);
    }
});

// ============================================================
// CONSOLE WELCOME (Fun Easter Egg)
// ============================================================
console.log('%c👋 Hey there, fellow developer!', 'font-size: 20px; font-weight: bold; color: #0984e3;');
console.log('%cThanks for checking out my site. Built with ❤️ by Ravi Raj', 'font-size: 14px; color: #555;');
console.log('%c📖 Check out my GitHub: https://github.com/ravirajhere', 'font-size: 14px; color: #0984e3;');

// ============================================================
// INITIAL SETUP COMPLETE
// ============================================================
console.log('✅ Ravi Raj Personal Website — Loaded Successfully!');
