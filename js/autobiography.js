/* ==========================================
   SURAJ ANAND — "A Boy Who Never Thought"
   JavaScript File — autobiography.js
   ========================================== */

/* ------------------------------------------
   1. LANGUAGE TOGGLE (EN ⇄ HI)
------------------------------------------ */
let currentLang = 'en'; // Default language

function setLang(lang) {
  currentLang = lang;

  // Update all elements with data-en / data-hi
  const elements = document.querySelectorAll('[data-en][data-hi]');
  elements.forEach(el => {
    const text = el.getAttribute('data-' + lang);
    if (text) {
      el.textContent = text;
    }
  });

  // Update active button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('active');
    }
  });

  // Save preference
  localStorage.setItem('preferredLang', lang);

  // Update HTML lang attribute
  document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
}

/* ------------------------------------------
   2. AUTO-LOAD SAVED LANGUAGE
------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('preferredLang');
  if (savedLang && savedLang !== 'en') {
    setLang(savedLang);
  }
});

/* ------------------------------------------
   3. SCROLL ANIMATION (Fade-in entries)
------------------------------------------ */
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const entryObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Unobserve after animation (once visible, stays visible)
      entryObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all timeline entries
document.addEventListener('DOMContentLoaded', () => {
  const entries = document.querySelectorAll('.entry');
  entries.forEach((entry, index) => {
    // Stagger animation slightly
    entry.style.transitionDelay = (index % 3) * 0.1 + 's';
    entryObserver.observe(entry);
  });
});

/* ------------------------------------------
   4. GALLERY LIGHTBOX (Click to enlarge)
------------------------------------------ */
function createLightbox() {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <span class="lightbox-close">&times;</span>
      <img src="" alt="Enlarged" class="lightbox-img">
      <p class="lightbox-caption"></p>
    </div>
  `;
  document.body.appendChild(lightbox);

  // Close on click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  return lightbox;
}

document.addEventListener('DOMContentLoaded', () => {
  const lightbox = createLightbox();
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');

  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('.gallery-caption');

      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = caption ? caption.textContent : '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
});

/* ------------------------------------------
   5. SMOOTH SCROLL FOR SCROLL INDICATOR
------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const timeline = document.querySelector('.timeline');
      if (timeline) {
        timeline.scrollIntoView({ behavior: 'smooth' });
      }
    });
    scrollIndicator.style.cursor = 'pointer';
  }
});

/* ------------------------------------------
   6. HERO PARALLAX EFFECT (Subtle)
------------------------------------------ */
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-content');
  if (hero) {
    const scrolled = window.pageYOffset;
    if (scrolled < window.innerHeight) {
      hero.style.transform = `translateY(${scrolled * 0.3}px)`;
      hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
    }
  }
});

/* ------------------------------------------
   7. KEYBOARD NAVIGATION (Arrow keys)
------------------------------------------ */
document.addEventListener('keydown', (e) => {
  // Press "L" to toggle language
  if (e.key === 'l' || e.key === 'L') {
    if (!e.target.matches('input, textarea')) {
      setLang(currentLang === 'en' ? 'hi' : 'en');
    }
  }
});

/* ------------------------------------------
   8. ACTIVE NAV HIGHLIGHT (If you add nav later)
------------------------------------------ */
// Placeholder for future navigation

/* ------------------------------------------
   9. CONSOLE MESSAGE (Nice touch)
------------------------------------------ */
console.log('%c🌞 Suraj Anand', 'font-size: 20px; color: #e6b800; font-weight: bold;');
console.log('%cA Boy Who Never Thought', 'font-size: 14px; color: #a0a0b0; font-style: italic;');
console.log('%cSafar se safar tak — गुंजते सन्नाटे', 'font-size: 14px; color: #ffb347;');
console.log('%c💡 Tip: Press "L" to toggle language!', 'font-size: 12px; color: #e6b800;');

/* ------------------------------------------
   10. INITIALIZE ON LOAD
------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ autobiography.js loaded successfully!');
});
