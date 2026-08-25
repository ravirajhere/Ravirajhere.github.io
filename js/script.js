// ============================================================
// SCRIPT.JS — COMPLETE (Hamburger Menu + New Theme + All Features)
// ============================================================

// ============================================================
// 1. HAMBURGER MENU TOGGLE
// ============================================================
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarClose = document.getElementById('sidebarClose');

function toggleSidebar() {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
}

function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Open on hamburger click
if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleSidebar);
}

// Close on overlay click
if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
}

// Close on close button
if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
}

// Close on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
        closeSidebar();
    }
});

// Close on menu item click (for smooth scroll)
document.querySelectorAll('.sidebar-menu a').forEach(function(link) {
    link.addEventListener('click', function() {
        // Close sidebar after a small delay for smooth scroll
        setTimeout(closeSidebar, 300);
    });
});

// ============================================================
// 2. SMOOTH SCROLL — ALL INTERNAL LINKS
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
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
// 3. ACTIVE NAV LINK (Sidebar)
// ============================================================
const sections = document.querySelectorAll('section[id]');
const sidebarLinks = document.querySelectorAll('.sidebar-menu a');

function updateActiveLink() {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(function(section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    // Update sidebar links
    sidebarLinks.forEach(function(link) {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === '#' + current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveLink);
window.addEventListener('load', updateActiveLink);

// ============================================================
// 4. INTEREST REVEAL — CLICK TO EXPAND
// ============================================================
function revealInterest(id) {
    const content = document.getElementById(id);
    if (!content) return;
    
    // Close all other hidden contents
    document.querySelectorAll('.hidden-content').forEach(function(el) {
        if (el.id !== id) {
            el.style.display = 'none';
        }
    });
    
    // Toggle this one
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
}

// ============================================================
// 5. KEYBOARD ACCESSIBILITY — Interest & Milestone Cards
// ============================================================
document.querySelectorAll('.interest-card, .milestone-card').forEach(function(el) {
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.addEventListener('keydown', function(e) {
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
// 6. TYPING ANIMATION FOR HERO SUBTITLE
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const typingElement = document.querySelector('.hero-subtitle');
    if (!typingElement) return;
    
    // Check if it's already typed (to avoid re-typing)
    if (typingElement.dataset.typed === 'true') return;
    
    const originalText = typingElement.textContent;
    typingElement.textContent = '';
    let index = 0;
    typingElement.dataset.typed = 'true';
    
    function typeWriter() {
        if (index < originalText.length) {
            typingElement.textContent += originalText.charAt(index);
            index++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Start typing after 1 second
    setTimeout(typeWriter, 1000);
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
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================================
// 9. SKILL BARS — ANIMATE ON SCROLL
// ============================================================
const skillObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            const bars = entry.target.querySelectorAll('.skill-bar-fill');
            bars.forEach(function(bar) {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(function() {
                    bar.style.width = width;
                }, 100);
            });
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-box').forEach(function(box) {
    skillObserver.observe(box);
});

// ============================================================
// 10. CONSOLE WELCOME (Easter Egg)
// ============================================================
console.log('%c 👋 Hey there, fellow developer!', 'font-size: 20px; font-weight: bold; color: #d4a373;');
console.log('%c Thanks for checking out my site. Built with ❤️ by Ravi Raj', 'font-size: 14px; color: #f5ede4;');
console.log('%c 📖 GitHub: https://github.com/ravirajhere', 'font-size: 14px; color: #d4a373;');

// ============================================================
// 11. LIVE TIME — FOOTER
// ============================================================
function updateLiveTime() {
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
        liveTimeEl.textContent = '⏱️ ' + timeStr + ' IST';
    }
}

updateLiveTime();
setInterval(updateLiveTime, 1000);

// ============================================================
// 12. INITIAL SETUP COMPLETE
// ============================================================
console.log('✅ Ravi Raj Personal Website — Loaded Successfully!');
