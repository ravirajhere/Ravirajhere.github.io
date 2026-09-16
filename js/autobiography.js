/* ==========================================
   SURAJ ANAND — "A Boy Who Never Thought"
   Safar se safar tak — गुंजते सन्नाटे
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

  // Update chapter contents (big blocks)
  document.querySelectorAll('[data-lang-content]').forEach(block => {
    if (block.getAttribute('data-lang-content') === lang) {
      block.style.display = 'block';
    } else {
      block.style.display = 'none';
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
   3. SCROLL ANIMATION (Fade-in chapters)
------------------------------------------ */
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -80px 0px'
};

const chapterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      chapterObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Set initial state and observe all chapters
document.addEventListener('DOMContentLoaded', () => {
  const chapters = document.querySelectorAll('.chapter, .special-card, .timeline-point');
  chapters.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    chapterObserver.observe(el);
  });
});

/* ------------------------------------------
   4. GALLERY LIGHTBOX
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

  // Close on click outside / close button
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
   5. SMOOTH SCROLL FOR COVER SCROLL INDICATOR
------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  const scrollIndicator = document.querySelector('.cover-scroll');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const firstChapter = document.querySelector('#chapter-1');
      if (firstChapter) {
        firstChapter.scrollIntoView({ behavior: 'smooth' });
      }
    });
    scrollIndicator.style.cursor = 'pointer';
  }
});

/* ------------------------------------------
   6. KEYBOARD SHORTCUT — Press "L" to toggle language
   (NOTE: Download eBook button handled by ebook.js)
------------------------------------------ */
document.addEventListener('keydown', (e) => {
  if ((e.key === 'l' || e.key === 'L') && !e.target.matches('input, textarea')) {
    setLang(currentLang === 'en' ? 'hi' : 'en');
  }
});

/* ------------------------------------------
   7. PARALLAX EFFECT ON COVER (Subtle)
------------------------------------------ */
window.addEventListener('scroll', () => {
  const coverContent = document.querySelector('.cover-content');
  if (coverContent) {
    const scrolled = window.pageYOffset;
    if (scrolled < window.innerHeight) {
      coverContent.style.transform = `translateY(${scrolled * 0.2}px)`;
      coverContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.7;
    }
  }
});

/* ------------------------------------------
   8. CONSOLE MESSAGE
------------------------------------------ */
console.log('%c📖 Suraj Anand', 'font-size: 22px; color: #b8860b; font-weight: bold; font-family: Georgia;');
console.log('%cA Boy Who Never Thought', 'font-size: 14px; color: #b0a890; font-style: italic; font-family: Georgia;');
console.log('%cSafar se safar tak — गुंजते सन्नाटे', 'font-size: 14px; color: #8b6f47; font-family: Georgia;');
console.log('%c💡 Tip: Press "L" to toggle language!', 'font-size: 12px; color: #b8860b;');

/* ------------------------------------------
   9. INIT ON LOAD
------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ autobiography.js loaded successfully!');
  console.log('📥 Download eBook handled by ebook.js');
});
