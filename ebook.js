// ============================================================
// EBOOK.JS — PROFESSIONAL BOOK GENERATOR (PREMIUM QUALITY)
// HEADER + FOOTER · PAGE NUMBERS · CLICKABLE SOCIAL LINKS · QR CODE
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
// 3. LAZY LOAD LIBRARIES
// ============================================================
function loadLibraries() {
    return new Promise((resolve) => {
        let loaded = 0;
        const total = 3;
        
        function checkDone() {
            loaded++;
            if (loaded === total) resolve();
        }
        
        if (typeof html2canvas !== 'undefined') {
            loaded++;
        } else {
            const script1 = document.createElement('script');
            script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            script1.onload = checkDone;
            document.head.appendChild(script1);
        }
        
        if (typeof jspdf !== 'undefined') {
            loaded++;
        } else {
            const script2 = document.createElement('script');
            script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script2.onload = checkDone;
            document.head.appendChild(script2);
        }
        
        if (typeof QRCode !== 'undefined') {
            loaded++;
        } else {
            const script3 = document.createElement('script');
            script3.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
            script3.onload = checkDone;
            document.head.appendChild(script3);
        }
        
        if (loaded === total) resolve();
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
        setTimeout(resolve, 2500);
    });
}

// ============================================================
// 6. GENERATE QR CODE
// ============================================================
function generateQRCode(data, size = 100) {
    return new Promise((resolve) => {
        const container = document.createElement('div');
        container.style.width = size + 'px';
        container.style.height = size + 'px';
        
        try {
            new QRCode(container, {
                text: data,
                width: size,
                height: size,
                colorDark: '#1a1a1a',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
            
            // Wait for QR to render
            setTimeout(() => {
                const canvas = container.querySelector('canvas');
                if (canvas) {
                    resolve(canvas.toDataURL('image/png'));
                } else {
                    resolve(null);
                }
            }, 200);
        } catch (e) {
            resolve(null);
        }
    });
}

// ============================================================
// 7. APPLY PROFESSIONAL BOOK STYLES
// ============================================================
function applyProfessionalBookStyles(clone) {
    clone.querySelectorAll('.chapter p').forEach(el => {
        el.style.color = '#1a1a1a';
        el.style.fontFamily = "'Georgia', 'Times New Roman', serif";
        el.style.fontSize = '14px';
        el.style.lineHeight = '1.9';
        el.style.textAlign = 'justify';
        el.style.marginBottom = '14px';
        el.style.fontWeight = '400';
    });
    
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
    
    clone.querySelectorAll('.chapter strong').forEach(el => {
        el.style.color = '#1a1a1a';
        el.style.fontWeight = '700';
    });
    
    clone.querySelectorAll('.chapter ul li').forEach(el => {
        el.style.color = '#1a1a1a';
        el.style.fontFamily = "'Georgia', 'Times New Roman', serif";
        el.style.fontSize = '14px';
        el.style.lineHeight = '1.9';
        el.style.marginBottom = '6px';
    });
    
    clone.querySelectorAll('.quote-box').forEach(el => {
        el.style.color = '#1a1a1a';
        el.style.fontFamily = "'Georgia', 'Times New Roman', serif";
        el.style.fontSize = '18px';
        el.style.lineHeight = '1.8';
        el.style.fontStyle = 'italic';
        el.style.background = 'rgba(218,165,32,0.04)';
        el.style.borderLeft = '4px solid #DAA520';
        el.style.padding = '18px 24px';
        el.style.margin = '20px 0';
        el.style.fontWeight = '400';
    });
    
    clone.querySelectorAll('.quote-box .author').forEach(el => {
        el.style.color = '#DAA520';
        el.style.fontWeight = '600';
        el.style.fontStyle = 'normal';
        el.style.textAlign = 'right';
        el.style.marginTop = '8px';
        el.style.fontFamily = "'Space Grotesk', sans-serif";
    });
    
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
        el.style.color = '#1a1a1a';
        el.style.fontSize = '15px';
        el.style.lineHeight = '1.8';
        el.style.fontFamily = "'Georgia', 'Times New Roman', serif";
    });
    
    clone.querySelectorAll('.friend-memory-pdf').forEach(el => {
        el.style.color = '#1a1a1a';
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
// 10. MAIN EBOOK GENERATOR (WITH HEADER, FOOTER, QR CODE)
// ============================================================
async function downloadEbook(lang, langLabel) {
    const wrapper = document.querySelector('.autobio-wrapper');
    if (!wrapper) {
        showToast('❌ Error: Content not found', 'error');
        return;
    }
    
    showToast(`📄 Loading libraries... (${langLabel})`, 'success');
    closeModal();
    
    await loadLibraries();
    
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
        if (cloneHiContainer) cloneHiContainer.remove();
        if (cloneEnContainer) cloneEnContainer.style.display = 'block';
    } else {
        if (cloneEnContainer) cloneEnContainer.remove();
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
            ch.style.position = 'relative';
        });
    }
    
    // ---- REMOVE PHOTO HINTS ----
    clone.querySelectorAll('.upload-hint').forEach(el => {
        el.textContent = '📸 Photo';
    });
    
    // ---- APPLY UNIFORM DARK STYLES ----
    applyProfessionalBookStyles(clone);
    
    // ---- GENERATE QR CODE ----
    const qrDataUrl = await generateQRCode('https://raviraj2k09.github.io', 120);
    
    // ---- CREATE SECTIONS ----
    const sections = [];
    let pageNum = 1;
    const totalPages = 19; // Approximate, will be updated later
    
    // Helper to add header and footer
    function addHeaderFooter(element, chapterTitle = '', isCover = false, isTitlePage = false, isTOC = false, isAbout = false, isOverview = false, isEmotional = false) {
        if (isCover) return;
        
        // ---- HEADER ----
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            font-size: 9px;
            color: #999999;
            font-family: 'Space Grotesk', sans-serif;
            padding-bottom: 8px;
            margin-bottom: 12px;
            border-bottom: 1px solid #e8e8e8;
            letter-spacing: 0.5px;
        `;
        header.innerHTML = `
            <span>My Autobiography — Ravi Raj</span>
            <span>${chapterTitle || ' '}</span>
        `;
        element.insertBefore(header, element.firstChild);
        
        // ---- FOOTER ----
        const footer = document.createElement('div');
        footer.style.cssText = `
            display: flex;
            justify-content: space-between;
            font-size: 9px;
            color: #999999;
            font-family: 'Space Grotesk', sans-serif;
            padding-top: 8px;
            margin-top: 12px;
            border-top: 1px solid #e8e8e8;
            letter-spacing: 0.5px;
        `;
        footer.innerHTML = `
            <span>Ravi Raj</span>
            <span>Page ${pageNum}</span>
        `;
        element.appendChild(footer);
    }
    
    // 1. Cover
    const cover = document.createElement('div');
    cover.style.cssText = `padding:0;margin:0;background:#ffffff;`;
    cover.innerHTML = `<img src="bookcover.jpg" alt="Book Cover" style="width:100%;height:auto;display:block;">`;
    sections.push(cover);
    pageNum++;
    
    // 2. Title Page
    const title = document.createElement('div');
    title.style.cssText = `text-align:center;padding:80px 50px;background:#ffffff;display:flex;flex-direction:column;justify-content:center;min-height:842px;`;
    title.innerHTML = `
        <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
            <div style="width:80px;height:2px;background:#DAA520;margin:0 auto 30px auto;"></div>
            <h1 style="font-size:42px;font-weight:700;color:#1a1a1a;font-family:'Space Grotesk',sans-serif;margin-bottom:10px;letter-spacing:2px;">My Autobiography</h1>
            <p style="font-size:18px;color:#999;font-family:'Space Grotesk',sans-serif;margin:15px 0;">—</p>
            <p style="font-size:28px;color:#DAA520;font-family:'Space Grotesk',sans-serif;margin:10px 0;font-weight:500;">Ravi Raj</p>
            <p style="font-size:17px;color:#666;font-style:italic;font-family:'Georgia',serif;margin:10px 0;">"A Boy Who Never Thought"</p>
            <p style="font-size:16px;color:#999;font-family:'Space Grotesk',sans-serif;margin:6px 0;">From Begusarai to the World</p>
            <div style="width:80px;height:2px;background:#DAA520;margin:30px auto;"></div>
            <p style="font-size:15px;color:#aaa;font-family:'Space Grotesk',sans-serif;">${new Date().getFullYear()}</p>
        </div>
    `;
    addHeaderFooter(title, '', false, true);
    sections.push(title);
    pageNum++;
    
    // 3. Table of Contents
    const toc = document.createElement('div');
    toc.style.cssText = `padding:60px 50px;background:#ffffff;display:flex;flex-direction:column;justify-content:center;min-height:842px;`;
    let tocHTML = `
        <h2 style="font-size:32px;font-weight:700;color:#1a1a1a;text-align:center;font-family:'Space Grotesk',sans-serif;margin-bottom:30px;letter-spacing:2px;">Table of Contents</h2>
        <ul style="list-style:none;padding:0;font-family:'Georgia',serif;font-size:16px;line-height:2.8;max-width:550px;margin:0 auto;width:100%;">
    `;
    const tocChapters = clone.querySelectorAll('.chapter');
    tocChapters.forEach((ch, idx) => {
        const h3 = ch.querySelector('h3');
        let titleText = h3 ? h3.textContent.trim() : `Chapter ${idx+1}`;
        titleText = titleText.replace(/[^\w\s\-\.]/g, '').trim();
        const pageNumDisplay = idx + 9;
        const dots = '.'.repeat(Math.max(40 - titleText.length - pageNumDisplay.toString().length, 10));
        tocHTML += `
            <li style="border-bottom:1px solid #f0f0f0;padding:4px 0;display:flex;justify-content:space-between;">
                <span style="color:#1a1a1a;font-family:'Space Grotesk',sans-serif;font-size:15px;">${titleText}</span>
                <span style="color:#999;font-family:'Space Grotesk',sans-serif;font-size:14px;">${pageNumDisplay}</span>
            </li>
        `;
    });
    tocHTML += `</ul>`;
    toc.innerHTML = tocHTML;
    addHeaderFooter(toc, 'Table of Contents', false, false, true);
    sections.push(toc);
    pageNum++;
    
    // 4. About the Author (WITH SOCIAL LINKS + QR CODE)
    const about = document.createElement('div');
    about.style.cssText = `text-align:center;padding:60px 50px;background:#ffffff;display:flex;flex-direction:column;justify-content:center;min-height:842px;`;
    const qrImg = qrDataUrl ? `<img src="${qrDataUrl}" alt="QR Code" style="width:120px;height:120px;display:block;margin:0 auto;border:2px solid #DAA520;border-radius:8px;padding:4px;">` : '';
    about.innerHTML = `
        <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
            <h2 style="font-size:32px;font-weight:700;color:#1a1a1a;font-family:'Space Grotesk',sans-serif;margin-bottom:20px;letter-spacing:2px;">About the Author</h2>
            <div style="width:120px;height:120px;border-radius:50%;border:3px solid #DAA520;margin:0 auto 16px;overflow:hidden;">
                <img src="Singh_ravirajhere.jpeg" alt="Ravi Raj" style="width:100%;height:100%;object-fit:cover;">
            </div>
            <p style="font-size:24px;font-weight:700;color:#1a1a1a;font-family:'Space Grotesk',sans-serif;margin:4px 0;">Ravi Raj</p>
            <p style="font-size:16px;color:#DAA520;font-family:'Space Grotesk',sans-serif;margin-bottom:14px;letter-spacing:1px;">Author · Developer · Dreamer</p>
            <div style="max-width:550px;margin:0 auto;">
                <p style="font-size:16px;line-height:1.8;color:#1a1a1a;font-family:'Georgia',serif;text-align:justify;">
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
            
            <!-- SOCIAL LINKS -->
            <div style="width:60px;height:2px;background:#DAA520;margin:20px auto;"></div>
            <p style="font-size:16px;font-weight:600;color:#1a1a1a;font-family:'Space Grotesk',sans-serif;margin-bottom:12px;letter-spacing:1px;">CONNECT WITH ME</p>
            <div style="display:flex;flex-direction:column;align-items:center;gap:6px;max-width:350px;margin:0 auto;font-size:14px;color:#1a1a1a;font-family:'Space Grotesk',sans-serif;">
                <div style="display:flex;justify-content:space-between;width:100%;padding:4px 0;border-bottom:1px solid #f0f0f0;">
                    <span>📸 Instagram</span>
                    <a href="https://instagram.com/rravirajhere" style="color:#DAA520;text-decoration:none;">@rravirajhere</a>
                </div>
                <div style="display:flex;justify-content:space-between;width:100%;padding:4px 0;border-bottom:1px solid #f0f0f0;">
                    <span>💼 LinkedIn</span>
                    <a href="https://linkedin.com/in/ravirajhere" style="color:#DAA520;text-decoration:none;">@ravirajhere</a>
                </div>
                <div style="display:flex;justify-content:space-between;width:100%;padding:4px 0;border-bottom:1px solid #f0f0f0;">
                    <span>🌐 Website</span>
                    <a href="https://raviraj2k09.github.io" style="color:#DAA520;text-decoration:none;">raviraj2k09.github.io</a>
                </div>
                <div style="display:flex;justify-content:space-between;width:100%;padding:4px 0;">
                    <span>💬 WhatsApp</span>
                    <a href="https://wa.me/91XXXXXXXXXX" style="color:#DAA520;text-decoration:none;">@singh_ravirajhere</a>
                </div>
            </div>
            
            <!-- QR CODE -->
            <div style="margin:16px auto 0 auto;">
                ${qrImg}
                <p style="font-size:11px;color:#999;font-family:'Space Grotesk',sans-serif;margin-top:4px;">Scan to visit my website</p>
            </div>
            
            <div style="width:60px;height:2px;background:#DAA520;margin:20px auto;"></div>
            <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:8px;">
                <span style="background:#f5f5f5;padding:4px 16px;border-radius:20px;font-size:13px;color:#333;font-family:'Space Grotesk',sans-serif;">💻 3+ Years Coding</span>
                <span style="background:#f5f5f5;padding:4px 16px;border-radius:20px;font-size:13px;color:#333;font-family:'Space Grotesk',sans-serif;">🚀 5+ Projects</span>
                <span style="background:#f5f5f5;padding:4px 16px;border-radius:20px;font-size:13px;color:#333;font-family:'Space Grotesk',sans-serif;">📚 Loves Novels</span>
            </div>
        </div>
    `;
    addHeaderFooter(about, 'About the Author', false, false, false, true);
    sections.push(about);
    pageNum++;
    
    // 5. Overview
    const overview = document.createElement('div');
    overview.style.cssText = `padding:60px 50px;background:#ffffff;display:flex;flex-direction:column;justify-content:center;min-height:842px;`;
    overview.innerHTML = `
        <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
            <h2 style="font-size:32px;font-weight:700;color:#1a1a1a;text-align:center;font-family:'Space Grotesk',sans-serif;margin-bottom:20px;letter-spacing:2px;">Overview</h2>
            <p style="font-size:17px;line-height:1.9;color:#1a1a1a;text-align:justify;max-width:550px;margin:0 auto;font-family:'Georgia',serif;">
                This autobiography takes you through the journey of Ravi Raj — from his humble beginnings in Begusarai, 
                Bihar, to becoming a passionate coder and dreamer. It covers childhood memories, school days, family, 
                friendships, struggles, and the joy of building something from nothing. A story of a boy who never 
                thought he would, but did.
            </p>
            <div style="width:60px;height:2px;background:#DAA520;margin:30px auto;"></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;max-width:450px;margin:0 auto;width:100%;">
                <div style="background:#f5f5f5;padding:14px;border-radius:10px;text-align:center;">
                    <span style="font-size:24px;font-weight:700;color:#DAA520;font-family:'Space Grotesk',sans-serif;">12</span>
                    <p style="font-size:13px;color:#666;margin:2px 0;font-family:'Space Grotesk',sans-serif;">Chapters</p>
                </div>
                <div style="background:#f5f5f5;padding:14px;border-radius:10px;text-align:center;">
                    <span style="font-size:24px;font-weight:700;color:#DAA520;font-family:'Space Grotesk',sans-serif;">2008</span>
                    <p style="font-size:13px;color:#666;margin:2px 0;font-family:'Space Grotesk',sans-serif;">Year of Birth</p>
                </div>
                <div style="background:#f5f5f5;padding:14px;border-radius:10px;text-align:center;">
                    <span style="font-size:24px;font-weight:700;color:#DAA520;font-family:'Space Grotesk',sans-serif;">3+</span>
                    <p style="font-size:13px;color:#666;margin:2px 0;font-family:'Space Grotesk',sans-serif;">Years Coding</p>
                </div>
                <div style="background:#f5f5f5;padding:14px;border-radius:10px;text-align:center;">
                    <span style="font-size:24px;font-weight:700;color:#DAA520;font-family:'Space Grotesk',sans-serif;">14</span>
                    <p style="font-size:13px;color:#666;margin:2px 0;font-family:'Space Grotesk',sans-serif;">Friends</p>
                </div>
            </div>
        </div>
    `;
    addHeaderFooter(overview, 'Overview', false, false, false, false, true);
    sections.push(overview);
    pageNum++;
    
    // 6. Chapters
    const chapterElements = clone.querySelectorAll('.chapter');
    chapterElements.forEach((ch, index) => {
        const section = document.createElement('div');
        section.style.cssText = `padding:40px 50px;background:#ffffff;display:flex;flex-direction:column;min-height:842px;`;
        
        const chapterClone = ch.cloneNode(true);
        chapterClone.querySelectorAll('.copy-link-btn').forEach(el => el.remove());
        chapterClone.querySelectorAll('.nav-buttons').forEach(el => el.remove());
        chapterClone.querySelectorAll('.upload-hint').forEach(el => {
            el.textContent = '📸 Photo';
        });
        
        // Get chapter title for header
        const h3 = chapterClone.querySelector('h3');
        let chapterTitle = h3 ? h3.textContent.trim() : `Chapter ${index+1}`;
        chapterTitle = chapterTitle.replace(/[^\w\s\-\.]/g, '').trim();
        
        section.appendChild(chapterClone);
        addHeaderFooter(section, chapterTitle);
        sections.push(section);
        pageNum++;
    });
    
    // 7. Emotional Message
    const emotional = document.createElement('div');
    emotional.style.cssText = `text-align:center;padding:80px 50px;background:#fafafa;display:flex;flex-direction:column;justify-content:center;min-height:842px;`;
    emotional.innerHTML = `
        <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
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
        </div>
    `;
    addHeaderFooter(emotional, 'The End', false, false, false, false, false, true);
    sections.push(emotional);
    
    // ---- GENERATE PDF ----
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
    });
    
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    const contentHeight = pageHeight - (margin * 2);
    
    let isFirstPage = true;
    
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        
        section.style.position = 'absolute';
        section.style.left = '-9999px';
        section.style.top = '0';
        section.style.width = contentWidth + 'mm';
        section.style.background = '#ffffff';
        document.body.appendChild(section);
        
        await new Promise(resolve => setTimeout(resolve, 150));
        
        const canvas = await html2canvas(section, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            width: contentWidth * 3.78,
            height: contentHeight * 3.78
        });
        
        document.body.removeChild(section);
        
        if (canvas) {
            if (!isFirstPage) {
                pdf.addPage();
            }
            isFirstPage = false;
            
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, contentHeight);
        }
    }
    
    pdf.save(`My_Autobiography_Ravi_Raj_${langLabel}.pdf`);
    showToast(`✅ ${langLabel} ebook downloaded!`, 'success');
}

// ============================================================
// 11. EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ============================================================
window.downloadEnglishEbook = downloadEnglishEbook;
window.downloadHinglishEbook = downloadHinglishEbook;
window.showToast = showToast;
window.closeModal = closeModal;
