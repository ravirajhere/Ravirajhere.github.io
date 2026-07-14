// ============================================================
// EBOOK.JS — PROFESSIONAL BOOK GENERATOR (30+ YEAR PRO TOUCH)
// NO DOM ATTACH · NO BLANK PAGES · BOOK STANDARD
// ============================================================

// ============================================================
// 1. SHOW TOAST
// ============================================================
function showToast(message, type = '') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'toast';
    if (type) toast.classList.add(type);
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================================
// 2. CLOSE MODAL
// ============================================================
function closeModal() {
    const modal = document.getElementById('downloadModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============================================================
// 3. LAZY LOAD PDF LIBRARY
// ============================================================
function loadPDFLibrary() {
    return new Promise((resolve) => {
        if (typeof html2pdf !== 'undefined') {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = resolve;
        document.head.appendChild(script);
    });
}

// ============================================================
// 4. MAKE ALL CHAPTERS VISIBLE
// ============================================================
function makeAllChaptersVisible(lang) {
    const enContainer = document.getElementById('chaptersEn');
    const hiContainer = document.getElementById('chaptersHi');
    
    if (lang === 'en') {
        enContainer.style.display = 'block';
        hiContainer.style.display = 'none';
    } else {
        enContainer.style.display = 'none';
        hiContainer.style.display = 'block';
    }
    
    const containerId = lang === 'en' ? 'chaptersEn' : 'chaptersHi';
    const container = document.getElementById(containerId);
    const chapters = container.querySelectorAll('.chapter');
    
    let activeIndex = -1;
    chapters.forEach((ch, index) => {
        if (ch.classList.contains('active')) {
            activeIndex = index;
        }
        ch.style.display = 'block';
    });
    
    return activeIndex;
}

function restoreChapterVisibility(lang, activeIndex) {
    const containerId = lang === 'en' ? 'chaptersEn' : 'chaptersHi';
    const container = document.getElementById(containerId);
    const chapters = container.querySelectorAll('.chapter');
    
    chapters.forEach((ch, index) => {
        if (index === activeIndex) {
            ch.style.display = 'block';
            ch.classList.add('active');
        } else {
            ch.style.display = 'none';
            ch.classList.remove('active');
        }
    });
    
    const enContainer = document.getElementById('chaptersEn');
    const hiContainer = document.getElementById('chaptersHi');
    if (lang === 'en') {
        enContainer.style.display = 'block';
        hiContainer.style.display = 'none';
    } else {
        enContainer.style.display = 'none';
        hiContainer.style.display = 'block';
    }
}

// ============================================================
// 5. WAIT FOR RENDER
// ============================================================
function waitForRender() {
    return new Promise((resolve) => {
        setTimeout(resolve, 3000);
    });
}

// ============================================================
// 6. APPLY PROFESSIONAL BOOK STYLES
// ============================================================
function applyProfessionalBookStyles(clone) {
    // Paragraphs
    clone.querySelectorAll('.chapter p').forEach(el => {
        el.style.color = '#2d2d2d';
        el.style.fontFamily = "'Georgia', 'Times New Roman', serif";
        el.style.fontSize = '14px';
        el.style.lineHeight = '1.9';
        el.style.textAlign = 'justify';
        el.style.marginBottom = '14px';
    });
    
    // Chapter Headings
    clone.querySelectorAll('.chapter h3').forEach(el => {
        el.style.color = '#1a1a1a';
        el.style.fontFamily = "'Space Grotesk', 'Arial', sans-serif";
        el.style.fontSize = '24px';
        el.style.fontWeight = '700';
        el.style.textAlign = 'center';
        el.style.marginTop = '0';
        el.style.marginBottom = '10px';
        el.style.letterSpacing = '1.5px';
    });
    
    // Gold line under heading
    clone.querySelectorAll('.chapter h3').forEach(el => {
        const line = document.createElement('div');
        line.style.cssText = `
            width: 80px;
            height: 2px;
            background: #DAA520;
            margin: 8px auto 20px auto;
        `;
        el.parentNode.insertBefore(line, el.nextSibling);
    });
    
    // Strong
    clone.querySelectorAll('.chapter strong').forEach(el => {
        el.style.color = '#1a1a1a';
        el.style.fontWeight = '700';
    });
    
    // Quotes
    clone.querySelectorAll('.quote-box').forEach(el => {
        el.style.color = '#2d2d2d';
        el.style.fontFamily = "'Georgia', 'Times New Roman', serif";
        el.style.fontSize = '18px';
        el.style.lineHeight = '1.8';
        el.style.fontStyle = 'italic';
        el.style.background = 'rgba(218,165,32,0.04)';
        el.style.borderLeft = '4px solid #DAA520';
        el.style.padding = '18px 24px';
        el.style.margin = '20px 0';
    });
    
    clone.querySelectorAll('.quote-box .author').forEach(el => {
        el.style.color = '#DAA520';
        el.style.fontWeight = '500';
        el.style.fontStyle = 'normal';
        el.style.textAlign = 'right';
        el.style.marginTop = '8px';
        el.style.fontFamily = "'Space Grotesk', sans-serif";
    });
    
    // Reading time
    clone.querySelectorAll('.reading-time').forEach(el => {
        el.style.color = '#999999';
        el.style.fontFamily = "'Space Grotesk', sans-serif";
        el.style.fontSize = '13px';
        el.style.textAlign = 'right';
        el.style.marginTop = '12px';
        el.style.fontStyle = 'italic';
    });
    
    clone.querySelectorAll('.reading-time span').forEach(el => {
        el.style.color = '#6c5ce7';
    });
}

// ============================================================
// 7. DOWNLOAD EBOOK — ENGLISH
// ============================================================
async function downloadEnglishEbook() {
    await downloadEbook('en', 'English');
}

// ============================================================
// 8. DOWNLOAD EBOOK — HINGLISH
// ============================================================
async function downloadHinglishEbook() {
    await downloadEbook('hi', 'Hinglish');
}

// ============================================================
// 9. MAIN EBOOK GENERATOR (PROFESSIONAL BOOK)
// ============================================================
async function downloadEbook(lang, langLabel) {
    const wrapper = document.querySelector('.autobio-wrapper');
    if (!wrapper) {
        showToast('❌ Error: Content not found', 'error');
        return;
    }
    
    showToast(`📄 Loading PDF library... (${langLabel})`, 'success');
    closeModal();
    
    await loadPDFLibrary();
    
    showToast(`📄 Generating ${langLabel} ebook...`, 'success');
    
    const activeIndex = makeAllChaptersVisible(lang);
    await waitForRender();
    
    const clone = wrapper.cloneNode(true);
    restoreChapterVisibility(lang, activeIndex);
    
    // ---- CLEAN CLONE ----
    const removeSelectors = [
        '.lang-controls', '.download-actions', '.nav-buttons', 
        '.progress-dots', '.chapter-progress-info', '.copy-link-btn',
        '.back-to-top', '.reading-mode-toggle', '.toast', '.modal-overlay'
    ];
    removeSelectors.forEach(selector => {
        clone.querySelectorAll(selector).forEach(el => el.remove());
    });
    
    // ---- LANGUAGE ISOLATION ----
    const cloneEnContainer = clone.querySelector('#chaptersEn');
    const cloneHiContainer = clone.querySelector('#chaptersHi');
    if (lang === 'en') {
        if (cloneEnContainer) cloneEnContainer.style.display = 'block';
        if (cloneHiContainer) cloneHiContainer.style.display = 'none';
    } else {
        if (cloneEnContainer) cloneEnContainer.style.display = 'none';
        if (cloneHiContainer) cloneHiContainer.style.display = 'block';
    }
    
    // ---- FORMAT CHAPTERS ----
    const cloneContainerId = lang === 'en' ? 'chaptersEn' : 'chaptersHi';
    const cloneContainer = clone.querySelector('#' + cloneContainerId);
    if (cloneContainer) {
        const cloneChapters = cloneContainer.querySelectorAll('.chapter');
        cloneChapters.forEach(ch => {
            ch.style.display = 'block';
            ch.classList.add('active');
            ch.style.background = '#ffffff';
            ch.style.border = 'none';
            ch.style.borderRadius = '0';
            ch.style.padding = '40px 50px';
            ch.style.marginTop = '0';
            ch.style.boxShadow = 'none';
            ch.style.pageBreakInside = 'avoid';
        });
    }
    
    // ---- REMOVE PHOTO HINTS ----
    clone.querySelectorAll('.upload-hint').forEach(el => {
        el.textContent = '📸 Photo';
    });
    
    // ---- APPLY PROFESSIONAL STYLES ----
    applyProfessionalBookStyles(clone);
    
    // ---- CREATE PDF DOCUMENT ----
    const pdfDoc = document.createElement('div');
    pdfDoc.style.cssText = `
        max-width: 100%;
        margin: 0 auto;
        background: #ffffff;
        font-family: 'Georgia', 'Times New Roman', serif;
        padding: 0;
    `;
    
    // ---- COVER PAGE ----
    const cover = document.createElement('div');
    cover.style.cssText = `page-break-after: always;`;
    cover.innerHTML = `<img src="bookcover.jpg" alt="Book Cover" style="width:100%;height:auto;display:block;">`;
    pdfDoc.appendChild(cover);
    
    // ---- TITLE PAGE ----
    const title = document.createElement('div');
    title.style.cssText = `page-break-before: always; page-break-after: always; text-align: center; padding: 80px 50px;`;
    title.innerHTML = `
        <h1 style="font-size:42px;font-weight:700;color:#1a1a1a;font-family:'Space Grotesk',sans-serif;margin-bottom:10px;">My Autobiography</h1>
        <p style="font-size:18px;color:#999;font-family:'Space Grotesk',sans-serif;margin:10px 0;">—</p>
        <p style="font-size:28px;color:#DAA520;font-family:'Space Grotesk',sans-serif;margin:10px 0;">Ravi Raj</p>
        <p style="font-size:17px;color:#666;font-style:italic;font-family:'Georgia',serif;margin:10px 0;">"A Boy Who Never Thought"</p>
        <p style="font-size:16px;color:#999;font-family:'Space Grotesk',sans-serif;margin:6px 0;">From Begusarai to the World</p>
        <div style="width:80px;height:2px;background:#DAA520;margin:30px auto;"></div>
        <p style="font-size:15px;color:#aaa;font-family:'Space Grotesk',sans-serif;">${new Date().getFullYear()}</p>
    `;
    pdfDoc.appendChild(title);
    
    // ---- TABLE OF CONTENTS ----
    const toc = document.createElement('div');
    toc.style.cssText = `page-break-before: always; page-break-after: always; padding: 60px 50px;`;
    let tocHTML = `
        <h2 style="font-size:32px;font-weight:700;color:#1a1a1a;text-align:center;font-family:'Space Grotesk',sans-serif;margin-bottom:30px;">Table of Contents</h2>
        <ul style="list-style:none;padding:0;font-family:'Georgia',serif;font-size:16px;line-height:2.8;max-width:550px;margin:0 auto;">
    `;
    const tocChapters = clone.querySelectorAll('.chapter');
    tocChapters.forEach((ch, idx) => {
        const h3 = ch.querySelector('h3');
        let titleText = h3 ? h3.textContent.trim() : `Chapter ${idx+1}`;
        titleText = titleText.replace(/[^\w\s\-\.]/g, '').trim();
        const pageNum = idx + 8;
        tocHTML += `
            <li style="border-bottom:1px solid #f0f0f0;padding:4px 0;display:flex;justify-content:space-between;">
                <span style="color:#333;font-family:'Space Grotesk',sans-serif;">${titleText}</span>
                <span style="color:#999;font-family:'Space Grotesk',sans-serif;">${pageNum}</span>
            </li>
        `;
    });
    tocHTML += `</ul>`;
    toc.innerHTML = tocHTML;
    pdfDoc.appendChild(toc);
    
    // ---- ABOUT THE AUTHOR ----
    const about = document.createElement('div');
    about.style.cssText = `page-break-before: always; page-break-after: always; text-align: center; padding: 60px 50px;`;
    about.innerHTML = `
        <h2 style="font-size:32px;font-weight:700;color:#1a1a1a;font-family:'Space Grotesk',sans-serif;margin-bottom:20px;">About the Author</h2>
        <div style="width:120px;height:120px;border-radius:50%;border:3px solid #DAA520;margin:0 auto 16px;overflow:hidden;">
            <img src="Singh_ravirajhere.jpeg" alt="Ravi Raj" style="width:100%;height:100%;object-fit:cover;">
        </div>
        <p style="font-size:24px;font-weight:700;color:#1a1a1a;font-family:'Space Grotesk',sans-serif;margin:4px 0;">Ravi Raj</p>
        <p style="font-size:16px;color:#DAA520;font-family:'Space Grotesk',sans-serif;margin-bottom:14px;">Author · Developer · Dreamer</p>
        <div style="max-width:550px;margin:0 auto;">
            <p style="font-size:16px;line-height:1.8;color:#2d2d2d;font-family:'Georgia',serif;text-align:justify;">
                Ravi Raj was born on 13 March 2008 in Begusarai, Bihar. A self-taught developer, 
                he discovered coding in 2020 and has since built over 5 projects. He is currently 
                learning JavaScript and dreams of launching his own startup. When not coding, 
                he enjoys reading novels and cycling.
            </p>
        </div>
        <div style="width:60px;height:2px;background:#DAA520;margin:20px auto;"></div>
        <p style="font-size:18px;font-style:italic;color:#6c5ce7;font-family:'Georgia',serif;">
            "Somewhere Between I Want It & I Got It"
        </p>
        <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:16px;">
            <span style="background:#f5f5f5;padding:4px 16px;border-radius:20px;font-size:13px;color:#333;">💻 3+ Years Coding</span>
            <span style="background:#f5f5f5;padding:4px 16px;border-radius:20px;font-size:13px;color:#333;">🚀 5+ Projects</span>
            <span style="background:#f5f5f5;padding:4px 16px;border-radius:20px;font-size:13px;color:#333;">📚 Loves Novels</span>
        </div>
    `;
    pdfDoc.appendChild(about);
    
    // ---- OVERVIEW ----
    const overview = document.createElement('div');
    overview.style.cssText = `page-break-before: always; page-break-after: always; padding: 60px 50px;`;
    overview.innerHTML = `
        <h2 style="font-size:32px;font-weight:700;color:#1a1a1a;text-align:center;font-family:'Space Grotesk',sans-serif;margin-bottom:20px;">Overview</h2>
        <p style="font-size:17px;line-height:1.9;color:#2d2d2d;text-align:justify;max-width:550px;margin:0 auto;font-family:'Georgia',serif;">
            This autobiography takes you through the journey of Ravi Raj — from his humble beginnings in Begusarai, 
            Bihar, to becoming a passionate coder and dreamer. It covers childhood memories, school days, family, 
            friendships, struggles, and the joy of building something from nothing. A story of a boy who never 
            thought he would, but did.
        </p>
        <div style="width:60px;height:2px;background:#DAA520;margin:30px auto;"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;max-width:450px;margin:0 auto;">
            <div style="background:#f5f5f5;padding:14px;border-radius:10px;text-align:center;">
                <span style="font-size:24px;font-weight:700;color:#DAA520;font-family:'Space Grotesk',sans-serif;">12</span>
                <p style="font-size:13px;color:#666;margin:2px 0;">Chapters</p>
            </div>
            <div style="background:#f5f5f5;padding:14px;border-radius:10px;text-align:center;">
                <span style="font-size:24px;font-weight:700;color:#DAA520;font-family:'Space Grotesk',sans-serif;">2008</span>
                <p style="font-size:13px;color:#666;margin:2px 0;">Year of Birth</p>
            </div>
            <div style="background:#f5f5f5;padding:14px;border-radius:10px;text-align:center;">
                <span style="font-size:24px;font-weight:700;color:#DAA520;font-family:'Space Grotesk',sans-serif;">3+</span>
                <p style="font-size:13px;color:#666;margin:2px 0;">Years Coding</p>
            </div>
            <div style="background:#f5f5f5;padding:14px;border-radius:10px;text-align:center;">
                <span style="font-size:24px;font-weight:700;color:#DAA520;font-family:'Space Grotesk',sans-serif;">14</span>
                <p style="font-size:13px;color:#666;margin:2px 0;">Friends</p>
            </div>
        </div>
    `;
    pdfDoc.appendChild(overview);
    
    // ---- ALL CHAPTERS ----
    const chapterElements = clone.querySelectorAll('.chapter');
    chapterElements.forEach((ch, index) => {
        const section = document.createElement('div');
        section.style.cssText = `page-break-before: always; page-break-after: always; padding: 40px 50px; background: #ffffff;`;
        
        const chapterClone = ch.cloneNode(true);
        chapterClone.querySelectorAll('.copy-link-btn').forEach(el => el.remove());
        chapterClone.querySelectorAll('.nav-buttons').forEach(el => el.remove());
        chapterClone.querySelectorAll('.upload-hint').forEach(el => {
            el.textContent = '📸 Photo';
        });
        
        section.appendChild(chapterClone);
        pdfDoc.appendChild(section);
    });
    
    // ---- EMOTIONAL MESSAGE ----
    const emotional = document.createElement('div');
    emotional.style.cssText = `page-break-before: always; text-align: center; padding: 80px 50px; background: #fafafa;`;
    emotional.innerHTML = `
        <div style="font-size:48px;margin-bottom:20px;">❤️</div>
        <p style="font-size:22px;font-weight:400;color:#1a1a1a;font-family:'Georgia',serif;max-width:500px;margin:0 auto;line-height:1.8;font-style:italic;">
            "Thank you for reading my story. Every chapter of this book is a piece of my heart. I hope my journey inspires you to chase your own dreams."
        </p>
        <div style="margin:24px auto 10px auto;max-width:200px;">
            <img src="signature.jpg" alt="Ravi Raj Signature" style="width:100%;height:auto;display:block;">
        </div>
        <p style="font-size:18px;color:#DAA520;margin:6px 0 12px 0;font-family:'Space Grotesk',sans-serif;">— Ravi Raj</p>
        <div style="width:60px;height:2px;background:#DAA520;margin:16px auto;"></div>
        <p style="font-size:14px;color:#666;font-family:'Space Grotesk',sans-serif;">With love & gratitude ❤️</p>
        <p style="font-size:13px;color:#999;margin-top:6px;font-family:'Space Grotesk',sans-serif;">Ravi Raj · March ${new Date().getFullYear()}</p>
        <p style="font-size:13px;color:#aaa;margin-top:4px;font-family:'Space Grotesk',sans-serif;">📖 From Begusarai to the World</p>
    `;
    pdfDoc.appendChild(emotional);
    
    // ---- GENERATE PDF ----
    const opt = {
        margin: [20, 25, 20, 25],
        filename: `My_Autobiography_Ravi_Raj_${langLabel}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait' 
        }
    };
    
    html2pdf().set(opt).from(pdfDoc).save().then(() => {
        showToast(`✅ ${langLabel} ebook downloaded!`, 'success');
    }).catch((err) => {
        console.error('PDF Error:', err);
        showToast('❌ Download failed. Please try again.', 'error');
    });
}

// ============================================================
// 10. EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ============================================================
window.downloadEnglishEbook = downloadEnglishEbook;
window.downloadHinglishEbook = downloadHinglishEbook;
window.showToast = showToast;
window.closeModal = closeModal;
