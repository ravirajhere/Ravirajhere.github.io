// ============================================================
// SCRIPT.JS — PAGE-SPECIFIC LOGIC FOR INDEX.HTML
// (Interest Reveal, Smooth Scroll, Accessibility, Console Welcome)
// ============================================================

// ============================================================
// 1. INTEREST REVEAL — CLICK TO EXPAND
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
// 2. SMOOTH SCROLL — ALL INTERNAL LINKS
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// ============================================================
// 3. ACTIVE NAV LINK HIGHLIGHT
// ============================================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveLink() {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveLink);
window.addEventListener('load', updateActiveLink);

// ============================================================
// 4. KEYBOARD ACCESSIBILITY — Interest & Milestone Cards
// ============================================================
document.querySelectorAll('.interest-card, .milestone-card').forEach(el => {
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            el.click();
        }
        if (e.key === 'Escape') {
            const hidden = el.querySelector('.hidden-content');
            if (hidden) hidden.style.display = 'none';
        }
    });
});

// ============================================================
// 5. DYNAMIC FOOTER YEAR
// ============================================================
const yearSpan = document.getElementById('current-year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// ============================================================
// 6. BACK TO TOP (Footer Link)
// ============================================================
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================================
// 7. TYPING ANIMATION FOR HERO SUBTITLE
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const typingElement = document.querySelector('.hero .subtitle');
    if (!typingElement) return;
    
    const text = typingElement.textContent;
    typingElement.textContent = '';
    let index = 0;
    
    function typeWriter() {
        if (index < text.length) {
            typingElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Start typing after 1 second
    setTimeout(typeWriter, 1000);
});

// ============================================================
// 8. CONSOLE WELCOME (Fun Easter Egg)
// ============================================================
console.log('%c👋 Hey there, fellow developer!', 'font-size: 20px; font-weight: bold; color: #c9a84c;');
console.log('%cThanks for checking out my site. Built with ❤️ by Ravi Raj', 'font-size: 14px; color: #1a2a3a;');
console.log('%c📖 GitHub: https://github.com/ravirajhere', 'font-size: 14px; color: #c9a84c;');

// ============================================================
// 9. INITIAL SETUP COMPLETE
// ============================================================
console.log('✅ Ravi Raj Personal Website — Loaded Successfully!');
