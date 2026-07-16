// ============================================================
// SCRIPT.JS — PAGE-SPECIFIC LOGIC FOR INDEX.HTML
// (Interest Reveal, Smooth Scroll, Accessibility, Console Welcome)
// ============================================================

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
// CONSOLE WELCOME (Fun Easter Egg)
// ============================================================
console.log('%c👋 Hey there, fellow developer!', 'font-size: 20px; font-weight: bold; color: #0984e3;');
console.log('%cThanks for checking out my site. Built with ❤️ by Ravi Raj', 'font-size: 14px; color: #555;');
console.log('%c📖 Check out my GitHub: https://github.com/ravirajhere', 'font-size: 14px; color: #0984e3;');

// ============================================================
// INITIAL SETUP COMPLETE
// ============================================================
console.log('✅ Ravi Raj Personal Website — Loaded Successfully!');
