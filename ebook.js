// ============================================================
// EBOOK.JS — PROFESSIONAL EBOOK GENERATOR
// 30+ YEAR PRO TOUCH · EVERY SECTION NEW PAGE
// COVER · TITLE · TOC · ABOUT · OVERVIEW · 12 CHAPTERS · EMOTIONAL MESSAGE
// ============================================================

// ============================================================
// 1. SHOW TOAST (Global Access)
// ============================================================
function showToast(message, type = '') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = 'toast';
    if (type) {
        toast.classList.add(type);
    }
    toast.classList.add('show');
    
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================================
// 2. CLOSE MODAL (Global Access)
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
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        document.body.offsetHeight;
                        setTimeout(resolve, 3000);
                    });
                });
            });
        });
    });
}

// ============================================================
// 6. CREATE PAGE BREAK DIV (PROFESSIONAL FIX)
// ============================================================
function createPageBreakDiv() {
    const div = document.createElement('div');
    div.style.cssText = `
        page-break-before: always;
        page-break-after: avoid;
        height: 0;
        margin: 0;
        padding: 0;
        border: 0;
        overflow: hidden;
        display: block;
        visibility: hidden;
    `;
    return div;
}

// ============================================================
// 7. APPLY PROFESSIONAL BOOK STYLES
// ============================================================
function applyProfessionalStyles(clone) {
    clone.querySelectorAll('.chapter p').forEach(el => {
        el.style.color = '#2d2d2d';
        el.style.fontFamily = "'Georgia', 'Times New Roman', serif";
        el.style.fontSize = '14px';
        el.style.lineHeight = '1.9';
        el.style.textAlign = 'justify';
        el.style.marginBottom = '14px';
        el.style.textIndent = '0px';
    });
    
    clone.querySelectorAll('.chapter h3').forEach(el => {
        el.style.color = '#1a1a1a';
        el.style.fontFamily = "'Space Grotesk', 'Arial', sans-serif";
        el.style.fontSize = '24px';
        el.style.fontWeight = '700';
        el.style.textAlign = 'center';
        el.style.marginTop = '0';
        el.style.marginBottom = '8px';
        el.style.letterSpacing = '1.5px';
        el.style.textTransform = 'uppercase';
        
        const text = el.textContent;
        el.textContent = text.replace(/[^\w\s\-\.]/g, '').trim();
    });
    
    clone.querySelectorAll('.chapter h3').forEach(el => {
        const line = document.createElement('div');
        line.style.cssText = `
            width: 100px;
            height: 2px;
            background: linear-gradient(90deg, transparent, #DAA520, transparent);
            margin: 12px auto 25px auto;
        `;
        el.parentNode.insertBefore(line, el.nextSibling);
    });
    
    clone.querySelectorAll('.chapter strong').forEach(el => {
        el.style.color = '#1a1a1a';
        el.style.fontWeight = '700';
    });
    
    clone.querySelectorAll('.chapter ul li').forEach(el => {
        el.style.color = '#2d2d2d';
        el.style.fontFamily = "'Georgia', 'Times New Roman', serif";
        el.style.fontSize = '14px';
        el.style.lineHeight = '1.9';
        el.style.marginBottom = '6px';
    });
    
    clone.querySelectorAll('.quote-box').forEach(el => {
        el.style.color = '#2d2d2d';
        el.style.fontFamily = "'Georgia', 'Times New Roman', serif";
        el.style.fontSize = '18px';
        el.style.lineHeight = '1.8';
        el.style.fontStyle = 'italic';
        el.style.background = 'rgba(218,165,32,0.04)';
        el.style.borderLeft = '4px solid #DAA520';
        el.style.padding = '20px 28px';
        el.style.margin = '24px 0';
        el.style.borderRadius = '4px';
        el.style.textAlign = 'justify';
    });
    
    clone.querySelectorAll('.quote-box .author').forEach(el => {
        el.style.color = '#DAA520';
        el.style.fontWeight = '500';
        el.style.fontStyle = 'normal';
        el.style.textAlign = 'right';
        el.style.marginTop = '10px';
        el.style.fontFamily = "'Space Grotesk', sans-serif";
    });
    
    clone.querySelectorAll('.friend-memory-pdf').forEach(el => {
        el.style.color = '#2d2d2d';
        el.style.fontFamily = "'Georgia', 'Times New Roman', serif";
        el.style.background = 'rgba(218,165,32,0.04)';
        el.style.border = '1px dashed #DAA520';
        el.style.borderRadius = '8px';
        el.style.padding = '24px 28px';
        el.style.margin = '24px 0';
    });
    
    clone.querySelectorAll('.friend-memory-pdf strong').forEach(el => {
        el.style.color = '#DAA520';
    });
    
    clone.querySelectorAll('.reading-time').forEach(el => {
        el.style.color = '#999999';
        el.style.fontFamily = "'Space Grotesk', sans-serif";
        el.style.fontSize = '13px';
        el.style.textAlign = 'right';
        el.style.marginTop = '16px';
        el.style.fontStyle = 'italic';
    });
    
    clone.querySelectorAll('.reading-time span').forEach(el => {
        el.style.color = '#6c5ce7';
    });
    
    clone.querySelectorAll('.family-item').forEach(el => {
        el.style.background = 'rgba(0,0,0,0.02)';
        el.style.border = '1px solid #e8e8e8';
        el.style.borderRadius = '8px';
        el.style.padding = '14px 18px';
        el.style.marginBottom = '6px';
    });
    
    clone.querySelectorAll('.family-item .label').forEach(el => {
        el.style.color = '#999999';
        el.style.fontSize = '11px';
        el.style.textTransform = 'uppercase';
        el.style.letterSpacing = '0.8px';
        el.style.fontFamily = "'Space Grotesk', sans-serif";
    });
    
    clone.querySelectorAll('.family-item .value').forEach(el => {
        el.style.color = '#1a1a1a';
        el.style.fontSize = '15px';
        el.style.fontWeight = '500';
        el.style.fontFamily = "'Space Grotesk', sans-serif";
    });
    
    clone.querySelectorAll('.teacher-tribute').forEach(el => {
        el.style.background = 'rgba(108,92,231,0.04)';
        el.style.border = '1px solid rgba(108,92,231,0.12)';
        el.style.borderRadius = '8px';
        el.style.padding = '20px 24px';
        el.style.margin = '18px 0';
    });
    
    clone.querySelectorAll('.teacher-tribute h4').forEach(el => {
        el.style.color = '#DAA520';
        el.style.fontSize = '17px';
        el.style.fontWeight = '600';
        el.style.fontFamily = "'Space Grotesk', sans-serif";
    });
    
    clone.querySelectorAll('.teacher-tribute p').forEach(el => {
        el.style.color = '#2d2d2d';
        el.style.fontSize = '15px';
        el.style.lineHeight = '1.8';
        el.style.fontFamily = "'Georgia', 'Times New Roman', serif";
    });
}

// ============================================================
// 8. DOWNLOAD EBOOK — ENGLISH
// ============================================================
async function downloadEnglishEbook() {
    await downloadEbook('en', 'English');
}

// ============================================================
// 9. DOWNLOAD EBOOK — HINGLISH
// ============================================================
async function downloadHinglishEbook() {
    await downloadEbook('hi', 'Hinglish');
}

// ============================================================
// 10. MAIN EBOOK GENERATOR (30+ YEAR PRO TOUCH)
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
            ch.style.padding = '50px 70px';
            ch.style.marginTop = '0';
            ch.style.boxShadow = 'none';
        });
    }
    
    // ---- REMOVE PHOTO HINTS ----
    clone.querySelectorAll('.upload-hint').forEach(el => {
        el.textContent = '📸 Photo';
    });
    
    // ---- APPLY PROFESSIONAL STYLES ----
    applyProfessionalStyles(clone);
    
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
    const coverSection = document.createElement('div');
    coverSection.style.cssText = `
        page-break-after: always;
        page-break-before: auto;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #ffffff;
        padding: 0;
        margin: 0;
    `;
    coverSection.innerHTML = `
        <img src="bookcover.jpg" alt="Book Cover" style="width:100%;height:auto;max-width:100%;display:block;margin:0 auto;">
    `;
    pdfDoc.appendChild(coverSection);
    
    // ---- TITLE PAGE ----
    const titleSection = document.createElement('div');
    titleSection.style.cssText = `
        page-break-after: always;
        page-break-before: always;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #ffffff;
        padding: 60px;
        text-align: center;
    `;
    titleSection.innerHTML = `
        <div style="width:100px;height:2px;background:linear-gradient(90deg,transparent,#DAA520,transparent);margin:0 auto 30px auto;"></div>
        <h1 style="font-size:46px;font-weight:700;color:#1a1a1a;font-family:'Space Grotesk',sans-serif;margin-bottom:8px;letter-spacing:2px;">My Autobiography</h1>
        <p style="font-size:18px;color:#999;font-family:'Space Grotesk',sans-serif;margin:15px 0;">—</p>
        <p style="font-size:28px;color:#DAA520;font-family:'Space Grotesk',sans-serif;margin:10px 0;font-weight:500;">Ravi Raj</p>
        <p style="font-size:17px;color:#666;font-style:italic;font-family:'Georgia',serif;margin:10px 0;">"A Boy Who Never Thought"</p>
        <p style="font-size:16px;color:#999;font-family:'Space Grotesk',sans-serif;margin:6px 0;">From Begusarai to the World</p>
        <div style="width:100px;height:2px;background:linear-gradient(90deg,transparent,#DAA520,transparent);margin:35px auto 0 auto;"></div>
        <p style="font-size:15px;color:#aaa;font-family:'Space Grotesk',sans-serif;margin-top:25px;">${new Date().getFullYear()}</p>
    `;
    pdfDoc.appendChild(titleSection);
    
    // ---- TABLE OF CONTENTS ----
    const tocSection = document.createElement('div');
    tocSection.style.cssText = `
        page-break-after: always;
        page-break-before: always;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #ffffff;
        padding: 60px 70px;
    `;
    let tocHTML = `
        <h2 style="font-size:34px;font-weight:700;color:#1a1a1a;text-align:center;font-family:'Space Grotesk',sans-serif;margin-bottom:40px;letter-spacing:3px;">Table of Contents</h2>
        <ul style="list-style:none;padding:0;font-family:'Georgia',serif;font-size:16px;line-height:3;max-width:600px;margin:0 auto;width:100%;">
    `;
    const tocChapters = clone.querySelectorAll('.chapter');
    tocChapters.forEach((ch, idx) => {
        const h3 = ch.querySelector('h3');
        let title = h3 ? h3.textContent.trim() : `Chapter ${idx+1}`;
        const pageNum = idx + 8;
        tocHTML += `
            <li style="border-bottom:1px solid #f0f0f0;padding:4px 0;display:flex;justify-content:space-between;color:#333;">
                <span style="color:#333;font-family:'Space Grotesk',sans-serif;font-size:15px;">${title}</span>
                <span style="color:#999;font-family:'Space Grotesk',sans-serif;font-size:14px;">${pageNum}</span>
            </li>
        `;
    });
    tocHTML += `</ul>`;
    tocSection.innerHTML = tocHTML;
    pdfDoc.appendChild(tocSection);
    
    // ---- ABOUT THE AUTHOR ----
    const aboutSection = document.createElement('div');
    aboutSection.style.cssText = `
        page-break-after: always;
        page-break-before: always;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #ffffff;
        padding: 60px 70px;
        text-align: center;
    `;
    aboutSection.innerHTML = `
        <h2 style="font-size:34px;font-weight:700;color:#1a1a1a;font-family:'Space Grotesk',sans-serif;margin-bottom:30px;letter-spacing:3px;">About the Author</h2>
        <div style="width:130px;height:130px;border-radius:50%;border:3px solid #DAA520;margin:0 auto 18px;overflow:hidden;box-shadow:0 0 40px rgba(218,165,32,0.15);">
            <img src="Singh_ravirajhere.jpeg" alt="Ravi Raj" style="width:100%;height:100%;object-fit:cover;">
        </div>
        <p style="font-size:26px;font-weight:700;color:#1a1a1a;font-family:'Space Grotesk',sans-serif;margin:4px 0;">Ravi Raj</p>
        <p style="font-size:17px;color:#DAA520;font-family:'Space Grotesk',sans-serif;margin-bottom:18px;letter-spacing:1px;">Author · Developer · Dreamer</p>
        <div style="max-width:600px;margin:0 auto;">
            <p style="font-size:16px;line-height:1.9;color:#2d2d2d;font-family:'Georgia',serif;text-align:justify;">
                Ravi Raj was born on 13 March 2008 in Begusarai, Bihar. A self-taught developer, 
                he discovered coding in 2020 and has since built over 5 projects. He is currently 
                learning JavaScript and dreams of launching his own startup. When not coding, 
                he enjoys reading novels and cycling.
            </p>
        </div>
        <div style="width:60px;height:2px;background:linear-gradient(90deg,transparent,#DAA520,transparent);margin:22px auto;"></div>
        <p style="font-size:18px;font-style:italic;color:#6c5ce7;font-family:'Georgia',serif;">
            "Somewhere Between I Want It & I Got It"
        </p>
        <div style="display:flex;justify-content:center;gap:16px;flex-wrap:wrap;margin-top:20px;">
            <span style="background:#f5f5f5;padding:6px 18px;border-radius:25px;font-size:13px;color:#333;font-family:'Space Grotesk',sans-serif;">💻 3+ Years Coding</span>
            <span style="background:#f5f5f5;padding:6px 18px;border-radius:25px;font-size:13px;color:#333;font-family:'Space Grotesk',sans-serif;">🚀 5+ Projects</span>
            <span style="background:#f5f5f5;padding:6px 18px;border-radius:25px;font-size:13px;color:#333;font-family:'Space Grotesk',sans-serif;">📚 Loves Novels</span>
        </div>
    `;
    pdfDoc.appendChild(aboutSection);
    
    // ---- OVERVIEW ----
    const overviewSection = document.createElement('div');
    overviewSection.style.cssText = `
        page-break-after: always;
        page-break-before: always;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #ffffff;
        padding: 60px 70px;
    `;
    overviewSection.innerHTML = `
        <h2 style="font-size:34px;font-weight:700;color:#1a1a1a;text-align:center;font-family:'Space Grotesk',sans-serif;margin-bottom:30px;letter-spacing:3px;">Overview</h2>
        <p style="font-size:17px;line-height:2;color:#2d2d2d;text-align:justify;max-width:600px;margin:0 auto;font-family:'Georgia',serif;">
            This autobiography takes you through the journey of Ravi Raj — from his humble beginnings in Begusarai, 
            Bihar, to becoming a passionate coder and dreamer. It covers childhood memories, school days, family, 
            friendships, struggles, and the joy of building something from nothing. A story of a boy who never 
            thought he would, but did.
        </p>
        <div style="width:60px;height:2px;background:linear-gradient(90deg,transparent,#DAA520,transparent);margin:35px auto;"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;max-width:500px;margin:0 auto;width:100%;">
            <div style="background:#f5f5f5;padding:18px;border-radius:12px;text-align:center;">
                <span style="font-size:28px;font-weight:700;color:#DAA520;font-family:'Space Grotesk',sans-serif;">12</span>
                <p style="font-size:13px;color:#666;margin:2px 0;font-family:'Space Grotesk',sans-serif;">Chapters</p>
            </div>
            <div style="background:#f5f5f5;padding:18px;border-radius:12px;text-align:center;">
                <span style="font-size:28px;font-weight:700;color:#DAA520;font-family:'Space Grotesk',sans-serif;">2008</span>
                <p style="font-size:13px;color:#666;margin:2px 0;font-family:'Space Grotesk',sans-serif;">Year of Birth</p>
            </div>
            <div style="background:#f5f5f5;padding:18px;border-radius:12px;text-align:center;">
                <span style="font-size:28px;font-weight:700;color:#DAA520;font-family:'Space Grotesk',sans-serif;">3+</span>
                <p style="font-size:13px;color:#666;margin:2px 0;font-family:'Space Grotesk',sans-serif;">Years Coding</p>
            </div>
            <div style="background:#f5f5f5;padding:18px;border-radius:12px;text-align:center;">
                <span style="font-size:28px;font-weight:700;color:#DAA520;font-family:'Space Grotesk',sans-serif;">14</span>
                <p style="font-size:13px;color:#666;margin:2px 0;font-family:'Space Grotesk',sans-serif;">Friends</p>
            </div>
        </div>
    `;
    pdfDoc.appendChild(overviewSection);
    
    // ---- ALL CHAPTERS ----
    const chapterElements = clone.querySelectorAll('.chapter');
    chapterElements.forEach((ch, index) => {
        const chapterSection = document.createElement('div');
        chapterSection.style.cssText = `
            page-break-after: always;
            page-break-before: always;
            min-height: 100vh;
            background: #ffffff;
            padding: 50px 70px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
        `;
        
        const chapterClone = ch.cloneNode(true);
        chapterClone.querySelectorAll('.copy-link-btn').forEach(el => el.remove());
        chapterClone.querySelectorAll('.nav-buttons').forEach(el => el.remove());
        chapterClone.querySelectorAll('.upload-hint').forEach(el => {
            el.textContent = '📸 Photo';
        });
        
        chapterSection.appendChild(chapterClone);
        pdfDoc.appendChild(chapterSection);
        
        if (index < chapterElements.length - 1) {
            pdfDoc.appendChild(createPageBreakDiv());
        }
    });
    
    // ---- EMOTIONAL MESSAGE PAGE ----
    const emotionalSection = document.createElement('div');
    emotionalSection.style.cssText = `
        page-break-after: always;
        page-break-before: always;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #fafafa;
        padding: 60px 70px;
        text-align: center;
    `;
    emotionalSection.innerHTML = `
        <div style="font-size:56px;margin-bottom:25px;">❤️</div>
        <p style="font-size:24px;font-weight:400;color:#1a1a1a;font-family:'Georgia',serif;max-width:550px;margin:0 auto;line-height:1.8;font-style:italic;">
            "Thank you for reading my story. Every chapter of this book is a piece of my heart. I hope my journey inspires you to chase your own dreams."
        </p>
        <div style="margin:28px auto 12px auto;max-width:220px;">
            <img src="signature.jpg" alt="Ravi Raj Signature" style="width:100%;height:auto;display:block;">
        </div>
        <p style="font-size:20px;color:#DAA520;margin:8px 0 10px 0;font-family:'Space Grotesk',sans-serif;font-weight:500;">— Ravi Raj</p>
        <div style="width:60px;height:2px;background:linear-gradient(90deg,transparent,#DAA520,transparent);margin:20px auto;"></div>
        <p style="font-size:15px;color:#666;font-family:'Space Grotesk',sans-serif;margin-top:8px;">With love & gratitude ❤️</p>
        <p style="font-size:14px;color:#999;margin-top:6px;font-family:'Space Grotesk',sans-serif;">Ravi Raj · March ${new Date().getFullYear()}</p>
        <p style="font-size:14px;color:#aaa;margin-top:4px;font-family:'Space Grotesk',sans-serif;">📖 From Begusarai to the World</p>
    `;
    pdfDoc.appendChild(emotionalSection);
    
    // ---- ATTACH TO DOM (CRITICAL FIX) ----
    document.body.appendChild(pdfDoc);
    
    // ---- GENERATE PDF ----
    const opt = {
        margin: [20, 20, 20, 20],
        filename: `My_Autobiography_Ravi_Raj_${langLabel}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            letterRendering: false,
            backgroundColor: '#ffffff',
            logging: false
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait' 
        },
        pagebreak: { mode: ['css', 'legacy'] }
    };
    
    html2pdf().set(opt).from(pdfDoc).save().then(() => {
        document.body.removeChild(pdfDoc);
        showToast(`✅ ${langLabel} ebook downloaded!`, 'success');
    }).catch((err) => {
        document.body.removeChild(pdfDoc);
        console.error('PDF Error:', err);
        showToast('❌ Download failed. Please try again.', 'error');
    });
}

// ============================================================
// 11. EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ============================================================
window.downloadEnglishEbook = downloadEnglishEbook;
window.downloadHinglishEbook = downloadHinglishEbook;
window.showToast = showToast;
window.closeModal = closeModal;
