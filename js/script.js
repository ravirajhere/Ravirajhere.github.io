// ============================================================
// SCRIPT.JS — PREMIUM EDITION
// (Smooth Scroll, Active Nav, Interest Reveal, Typing Animation, Ripple Effect)
// ============================================================

// ============================================================
// 1. SMOOTH SCROLL — All Internal Links
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
// 2. ACTIVE NAV LINK
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
// 3. INTEREST REVEAL — CLICK TO EXPAND
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
// 5. TYPING ANIMATION FOR HERO SUBTITLE
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
// 6. RIPPLE EFFECT ON HERO IMAGE
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const imageWrapper = document.querySelector('.hero-image-wrapper');
    if (!imageWrapper) return;
    
    imageWrapper.addEventListener('click', function(e) {
        // Create ripple element
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        
        // Position ripple at click point
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 800);
    });
});

// ============================================================
// 7. DYNAMIC FOOTER YEAR
// ============================================================
const yearSpan = document.getElementById('current-year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// ============================================================
// 8. BACK TO TOP
// ============================================================
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================================
// 9. CONSOLE WELCOME (Extra)
// ============================================================
console.log('%c 🔥 Premium Scripts Loaded! ', 'background: #c9a84c; color: #1a1a1a; font-size: 14px; font-weight: bold; padding: 6px 16px; border-radius: 4px;');
console.log('✅ Features: Smooth Scroll • Active Nav • Interest Reveal • Typing • Ripple • Dynamic Year');
