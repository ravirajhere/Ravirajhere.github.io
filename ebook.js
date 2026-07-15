// ============================================================
// EBOOK.JS — PROFESSIONAL BOOK GENERATOR (FINAL)
// TEXT-BASED PDF · SELECTABLE TEXT · CLICKABLE LINKS
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
        
        if (typeof jspdf !== 'undefined') {
            loaded++;
        } else {
            const script1 = document.createElement('script');
            script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script1.onload = checkDone;
            document.head.appendChild(script1);
        }
        
        if (typeof html2canvas !== 'undefined') {
            loaded++;
        } else {
            const script2 = document.createElement('script');
            script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
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
function generateQRCode(data, size = 120) {
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
        el.style.background = '#ffffff';
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
        el.style.background = '#ffffff';
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
        el.style.background = '#ffffff';
    });
    
    clone.querySelectorAll('.chapter ul li').forEach(el => {
        el.style.color = '#1a1a1a';
        el.style.fontFamily = "'Georgia', 'Times New Roman', serif";
        el.style.fontSize = '14px';
        el.style.lineHeight = '1.9';
        el.style.marginBottom = '6px';
        el.style.background = '#ffffff';
    });
    
    clone.querySelectorAll('.quote-box').forEach(el => {
        el.style.color = '#1a1a1a';
        el.style.fontFamily = "'Georgia', 'Times New Roman', serif";
        el.style.fontSize = '18px';
        el.style.lineHeight = '1.8';
        el.style.fontStyle = 'italic';
        el.style.background = '#ffffff';
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
        el.style.background = '#ffffff';
    });
    
    clone.querySelectorAll('.reading-time').forEach(el => {
        el.style.color = '#999999';
        el.style.fontFamily = "'Space Grotesk', sans-serif";
        el.style.fontSize = '13px';
        el.style.textAlign = 'right';
        el.style.marginTop = '12px';
        el.style.fontStyle = 'italic';
        el.style.background = '#ffffff';
    });
    
    clone.querySelectorAll('.reading-time span').forEach(el => {
        el.style.color = '#6c5ce7';
        el.style.background = '#ffffff';
    });
    
    clone.querySelectorAll('.family-item').forEach(el => {
        el.style.background = '#fafafa';
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
        el.style.background = '#ffffff';
    });
    
    clone.querySelectorAll('.friend-memory-pdf').forEach(el => {
        el.style.color = '#1a1a1a';
        el.style.fontFamily = "'Georgia', 'Times New Roman', serif";
        el.style.background = '#ffffff';
        el.style.border = '1px dashed #DAA520';
        el.style.borderRadius = '8px';
        el.style.padding = '24px 28px';
        el.style.margin = '24px 0';
    });
    
    clone.querySelectorAll('.friend-memory-pdf strong').forEach(el => {
        el.style.color = '#DAA520';
        el.style.background = '#ffffff';
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
// 10. MAIN EBOOK GENERATOR (FINAL)
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
            ch.classList.add('pdf-page-break');
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
    
    // ---- CREATE FINAL HTML FOR PDF ----
    const container = document.createElement('div');
    container.style.cssText = `
        max-width: 100%;
        margin: 0 auto;
        background: #ffffff;
        font-family: 'Georgia', 'Times New Roman', serif;
        padding: 0;
    `;
    
    function addPageBreak(element) {
        element.classList.add('pdf-page-break');
    }
    
    function createHeaderFooter(content, chapterTitle = '', isCover = false, noHeaderFooter = false) {
        if (isCover || noHeaderFooter) return content;
        
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            padding: 40px 50px;
            background: #ffffff;
            min-height: 842px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            position: relative;
        `;
        
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
            width: 100%;
        `;
        header.innerHTML = `
            <span>My Autobiography — Ravi Raj</span>
            <span>${chapterTitle || ' '}</span>
        `;
        wrapper.appendChild(header);
        wrapper.appendChild(content);
        
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
            width: 100%;
        `;
        footer.innerHTML = `<span>Ravi Raj</span><span></span>`;
        wrapper.appendChild(footer);
        
        return wrapper;
    }
    
    // ---- PAGE 1: COVER ----
    const coverPage = document.createElement('div');
    coverPage.style.cssText = `padding:0;margin:0;background:#ffffff;`;
    coverPage.innerHTML = `<img src="bookcover.jpg" alt="Book Cover" style="width:100%;height:auto;display:block;">`;
    container.appendChild(coverPage);
    
    // ---- PAGE 2: TITLE PAGE (Half Title Hata Diya) ----
    const titleContent = document.createElement('div');
    titleContent.style.cssText = `text-align:center;padding:80px 50px;display:flex;flex-direction:column;justify-content:center;min-height:842px;`;
    titleContent.innerHTML = `
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
    const titlePage = createHeaderFooter(titleContent, '', false, true);
    addPageBreak(titlePage);
    container.appendChild(titlePage);
    
    // ---- PAGE 3: COPYRIGHT ----
    const copyrightContent = document.createElement('div');
    copyrightContent.style.cssText = `padding:80px 50px;display:flex;flex-direction:column;justify-content:center;min-height:842px;`;
    copyrightContent.innerHTML = `
        <div style="flex:1;display:flex;flex-direction:column;justify-content:center;max-width:450px;margin:0 auto;">
            <h2 style="font-size:14px;font-weight:700;color:#1a1a1a;font-family:'Space Grotesk',sans-serif;letter-spacing:2px;margin-bottom:20px;">COPYRIGHT</h2>
            <p style="font-size:13px;line-height:1.8;color:#333;font-family:'Georgia',serif;margin-bottom:16px;">© 2026 Ravi Raj<br>All rights reserved.</p>
            <p style="font-size:13px;line-height:1.8;color:#333;font-family:'Georgia',serif;margin-bottom:16px;">No part of this book may be reproduced, stored in a retrieval system, or transmitted in any form or by any means, without the prior written permission of the author.</p>
            <p style="font-size:13px;line-height:1.8;color:#333;font-family:'Georgia',serif;margin-bottom:16px;"><strong>Published by</strong><br>RAVI RAJ PUBLICATION<br>Patna, India</p>
            <p style="font-size:13px;line-height:1.8;color:#333;font-family:'Georgia',serif;margin-bottom:16px;">This book is not for sale.<br>For personal use only.</p>
            <p style="font-size:13px;line-height:1.8;color:#333;font-family:'Georgia',serif;">First Edition: ${new Date().getFullYear()}</p>
        </div>
    `;
    const copyright = createHeaderFooter(copyrightContent, 'Copyright', false, true);
    addPageBreak(copyright);
    container.appendChild(copyright);
    
    // ---- PAGE 4: DEDICATION ----
    const dedicationContent = document.createElement('div');
    dedicationContent.style.cssText = `text-align:center;padding:100px 50px;display:flex;flex-direction:column;justify-content:center;min-height:842px;`;
    dedicationContent.innerHTML = `
        <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
            <p style="font-size:22px;font-weight:400;color:#1a1a1a;font-family:'Georgia',serif;line-height:2;max-width:500px;margin:0 auto;font-style:italic;">To my parents, who gave me the courage to dream.</p>
            <p style="font-size:22px;font-weight:400;color:#1a1a1a;font-family:'Georgia',serif;line-height:2;max-width:500px;margin:20px auto;font-style:italic;">To my siblings, who taught me patience and love.</p>
            <p style="font-size:22px;font-weight:400;color:#1a1a1a;font-family:'Georgia',serif;line-height:2;max-width:500px;margin:0 auto 30px auto;font-style:italic;">To my friends, who never let me feel alone.</p>
            <div style="width:60px;height:2px;background:#DAA520;margin:20px auto;"></div>
            <p style="font-size:18px;color:#DAA520;font-family:'Space Grotesk',sans-serif;">— Ravi Raj</p>
        </div>
    `;
    const dedication = createHeaderFooter(dedicationContent, 'Dedication', false, true);
    addPageBreak(dedication);
    container.appendChild(dedication);
    
    // ---- PAGE 5: PREFACE ----
    const prefaceContent = document.createElement('div');
    prefaceContent.style.cssText = `padding:60px 50px;display:flex;flex-direction:column;justify-content:center;min-height:842px;`;
    prefaceContent.innerHTML = `
        <div style="flex:1;display:flex;flex-direction:column;justify-content:center;max-width:550px;margin:0 auto;">
            <h2 style="font-size:28px;font-weight:700;color:#1a1a1a;font-family:'Space Grotesk',sans-serif;margin-bottom:20px;letter-spacing:2px;">Preface</h2>
            <p style="font-size:16px;line-height:1.9;color:#1a1a1a;font-family:'Georgia',serif;text-align:justify;margin-bottom:16px;">This book is a collection of my memories, thoughts, and experiences from my journey so far. I wrote this to share my story with the world and to inspire others to chase their dreams.</p>
            <p style="font-size:16px;line-height:1.9;color:#1a1a1a;font-family:'Georgia',serif;text-align:justify;margin-bottom:16px;">Life is a beautiful journey, and every chapter of this book is a piece of my heart. I hope you enjoy reading it as much as I enjoyed writing it.</p>
            <div style="width:60px;height:2px;background:#DAA520;margin:20px 0;"></div>
            <p style="font-size:16px;color:#DAA520;font-family:'Space Grotesk',sans-serif;">— Ravi Raj</p>
        </div>
    `;
    const preface = createHeaderFooter(prefaceContent, 'Preface', false, true);
    addPageBreak(preface);
    container.appendChild(preface);
    
    // ---- PAGE 6: ACKNOWLEDGEMENTS ----
    const ackContent = document.createElement('div');
    ackContent.style.cssText = `padding:60px 50px;display:flex;flex-direction:column;justify-content:center;min-height:842px;`;
    ackContent.innerHTML = `
        <div style="flex:1;display:flex;flex-direction:column;justify-content:center;max-width:550px;margin:0 auto;">
            <h2 style="font-size:28px;font-weight:700;color:#1a1a1a;font-family:'Space Grotesk',sans-serif;margin-bottom:20px;letter-spacing:2px;">Acknowledgements</h2>
            <p style="font-size:16px;line-height:1.9;color:#1a1a1a;font-family:'Georgia',serif;text-align:justify;margin-bottom:16px;">First and foremost, I would like to thank my parents for their unwavering support and encouragement.</p>
            <p style="font-size:16px;line-height:1.9;color:#1a1a1a;font-family:'Georgia',serif;text-align:justify;margin-bottom:16px;">I am also grateful to my teachers who guided me and shaped my thinking.</p>
            <p style="font-size:16px;line-height:1.9;color:#1a1a1a;font-family:'Georgia',serif;text-align:justify;margin-bottom:16px;">A special thanks to my friends who stood by me through thick and thin.</p>
            <p style="font-size:16px;line-height:1.9;color:#1a1a1a;font-family:'Georgia',serif;text-align:justify;">And to everyone who believed in me when I didn't believe in myself.</p>
            <div style="width:60px;height:2px;background:#DAA520;margin:20px 0;"></div>
            <p style="font-size:16px;color:#DAA520;font-family:'Space Grotesk',sans-serif;">— Ravi Raj</p>
        </div>
    `;
    const acknowledgements = createHeaderFooter(ackContent, 'Acknowledgements', false, true);
    addPageBreak(acknowledgements);
    container.appendChild(acknowledgements);
    
    // ---- PAGE 7: TABLE OF CONTENTS ----
    const tocContent = document.createElement('div');
    tocContent.style.cssText = `padding:60px 50px;display:flex;flex-direction:column;justify-content:center;min-height:842px;`;
    let tocHTML = `
        <h2 style="font-size:32px;font-weight:700;color:#1a1a1a;text-align:center;font-family:'Space Grotesk',sans-serif;margin-bottom:30px;letter-spacing:2px;">Table of Contents</h2>
        <ul style="list-style:none;padding:0;font-family:'Georgia',serif;font-size:16px;line-height:2.8;max-width:550px;margin:0 auto;width:100%;">
    `;
    const tocChapters = clone.querySelectorAll('.chapter');
    tocChapters.forEach((ch, idx) => {
        const h3 = ch.querySelector('h3');
        let titleText = h3 ? h3.textContent.trim() : `Chapter ${idx+1}`;
        titleText = titleText.replace(/[^\w\s\-\.]/g, '').trim();
        const pageNumDisplay = idx + 14;
        tocHTML += `
            <li style="border-bottom:1px solid #f0f0f0;padding:4px 0;display:flex;justify-content:space-between;">
                <span style="color:#1a1a1a;font-family:'Space Grotesk',sans-serif;font-size:15px;">${titleText}</span>
                <span style="color:#999;font-family:'Space Grotesk',sans-serif;font-size:14px;">${pageNumDisplay}</span>
            </li>
        `;
    });
    tocHTML += `</ul>`;
    tocContent.innerHTML = tocHTML;
    const toc = createHeaderFooter(tocContent, 'Table of Contents', false, true);
    addPageBreak(toc);
    container.appendChild(toc);
    
    // ---- PAGE 8: OVERVIEW ----
    const overviewContent = document.createElement('div');
    overviewContent.style.cssText = `padding:60px 50px;display:flex;flex-direction:column;justify-content:center;min-height:842px;`;
    overviewContent.innerHTML = `
        <div style="flex:1;display:flex;flex-direction:column;justify-content:center;max-width:550px;margin:0 auto;">
            <h2 style="font-size:32px;font-weight:700;color:#1a1a1a;text-align:center;font-family:'Space Grotesk',sans-serif;margin-bottom:20px;letter-spacing:2px;">Overview</h2>
            <p style="font-size:17px;line-height:1.9;color:#1a1a1a;text-align:justify;font-family:'Georgia',serif;margin-bottom:20px;">This autobiography takes you through the journey of Ravi Raj — from his humble beginnings in Begusarai, Bihar, to becoming a passionate coder and dreamer. It covers childhood memories, school days, family, friendships, struggles, and the joy of building something from nothing. A story of a boy who never thought he would, but did.</p>
            <div style="width:60px;height:2px;background:#DAA520;margin:20px auto;"></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;max-width:450px;margin:0 auto;width:100%;">
                <div style="background:#f5f5f5;padding:14px;border-radius:10px;text-align:center;"><span style="font-size:24px;font-weight:700;color:#DAA520;font-family:'Space Grotesk',sans-serif;">12</span><p style="font-size:13px;color:#666;margin:2px 0;font-family:'Space Grotesk',sans-serif;">Chapters</p></div>
                <div style="background:#f5f5f5;padding:14px;border-radius:10px;text-align:center;"><span style="font-size:24px;font-weight:700;color:#DAA520;font-family:'Space Grotesk',sans-serif;">2008</span><p style="font-size:13px;color:#666;margin:2px 0;font-family:'Space Grotesk',sans-serif;">Year of Birth</p></div>
                <div style="background:#f5f5f5;padding:14px;border-radius:10px;text-align:center;"><span style="font-size:24px;font-weight:700;color:#DAA520;font-family:'Space Grotesk',sans-serif;">3+</span><p style="font-size:13px;color:#666;margin:2px 0;font-family:'Space Grotesk',sans-serif;">Years Coding</p></div>
                <div style="background:#f5f5f5;padding:14px;border-radius:10px;text-align:center;"><span style="font-size:24px;font-weight:700;color:#DAA520;font-family:'Space Grotesk',sans-serif;">14</span><p style="font-size:13px;color:#666;margin:2px 0;font-family:'Space Grotesk',sans-serif;">Friends</p></div>
            </div>
        </div>
    `;
    const overview = createHeaderFooter(overviewContent, 'Overview', false, true);
    addPageBreak(overview);
    container.appendChild(overview);
    
    // ---- PAGES 9-20: CHAPTERS 1 TO 12 ----
    const chapterElements = clone.querySelectorAll('.chapter');
    chapterElements.forEach((ch, index) => {
        const chapterClone = ch.cloneNode(true);
        chapterClone.querySelectorAll('.copy-link-btn').forEach(el => el.remove());
        chapterClone.querySelectorAll('.nav-buttons').forEach(el => el.remove());
        chapterClone.querySelectorAll('.upload-hint').forEach(el => {
            el.textContent = '📸 Photo';
        });
        
        const h3 = chapterClone.querySelector('h3');
        let chapterTitle = h3 ? h3.textContent.trim() : `Chapter ${index+1}`;
        chapterTitle = chapterTitle.replace(/[^\w\s\-\.]/g, '').trim();
        
        const chapterContent = document.createElement('div');
        chapterContent.style.cssText = `padding:40px 50px;display:flex;flex-direction:column;min-height:842px;`;
        chapterContent.appendChild(chapterClone);
        
        const chapterPage = createHeaderFooter(chapterContent, chapterTitle);
        addPageBreak(chapterPage);
        container.appendChild(chapterPage);
    });
    
    // ---- PAGE 21: CONCLUSION ----
    const conclusionContent = document.createElement('div');
    conclusionContent.style.cssText = `padding:60px 50px;display:flex;flex-direction:column;justify-content:center;min-height:842px;`;
    conclusionContent.innerHTML = `
        <div style="flex:1;display:flex;flex-direction:column;justify-content:center;max-width:550px;margin:0 auto;">
            <h2 style="font-size:28px;font-weight:700;color:#1a1a1a;font-family:'Space Grotesk',sans-serif;margin-bottom:20px;letter-spacing:2px;">Conclusion</h2>
            <p style="font-size:16px;line-height:1.9;color:#1a1a1a;font-family:'Georgia',serif;text-align:justify;margin-bottom:16px;">As I look back on my journey, I realize that life is not about where you start, but about how far you are willing to go.</p>
            <p style="font-size:16px;line-height:1.9;color:#1a1a1a;font-family:'Georgia',serif;text-align:justify;margin-bottom:16px;">Every struggle made me stronger. Every failure taught me something new. Every success reminded me why I started.</p>
            <p style="font-size:16px;line-height:1.9;color:#1a1a1a;font-family:'Georgia',serif;text-align:justify;margin-bottom:16px;">This is not the end of my story. It is just the beginning.</p>
            <p style="font-size:16px;line-height:1.9;color:#1a1a1a;font-family:'Georgia',serif;text-align:justify;">The best is yet to come.</p>
            <div style="width:60px;height:2px;background:#DAA520;margin:20px 0;"></div>
            <p style="font-size:16px;color:#DAA520;font-family:'Space Grotesk',sans-serif;">— Ravi Raj</p>
        </div>
    `;
    const conclusion = createHeaderFooter(conclusionContent, 'Conclusion', false, true);
    addPageBreak(conclusion);
    container.appendChild(conclusion);
    
    // ---- PAGE 22: ABOUT THE AUTHOR ----
    const qrImg = qrDataUrl ? `<img src="${qrDataUrl}" alt="QR Code" style="width:120px;height:120px;display:block;margin:0 auto;border:2px solid #DAA520;border-radius:8px;padding:4px;">` : '';
    const aboutContent = document.createElement('div');
    aboutContent.style.cssText = `text-align:center;padding:60px 50px;display:flex;flex-direction:column;justify-content:center;min-height:842px;`;
    aboutContent.innerHTML = `
        <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
            <h2 style="font-size:32px;font-weight:700;color:#1a1a1a;font-family:'Space Grotesk',sans-serif;margin-bottom:20px;letter-spacing:2px;">About the Author</h2>
            <div style="width:120px;height:120px;border-radius:50%;border:3px solid #DAA520;margin:0 auto 16px;overflow:hidden;">
                <img src="Singh_ravirajhere.jpeg" alt="Ravi Raj" style="width:100%;height:100%;object-fit:cover;">
            </div>
            <p style="font-size:24px;font-weight:700;color:#1a1a1a;font-family:'Space Grotesk',sans-serif;margin:4px 0;">Ravi Raj</p>
            <p style="font-size:16px;color:#DAA520;font-family:'Space Grotesk',sans-serif;margin-bottom:14px;letter-spacing:1px;">Author · Developer · Dreamer</p>
            <div style="max-width:550px;margin:0 auto;">
                <p style="font-size:16px;line-height:1.8;color:#1a1a1a;font-family:'Georgia',serif;text-align:justify;">Ravi Raj was born on 13 March 2008 in Begusarai, Bihar. A self-taught developer, he discovered coding in 2020 and has since built over 5 projects. He is currently learning JavaScript and dreams of launching his own startup. When not coding, he enjoys reading novels and cycling.</p>
            </div>
            <div style="width:60px;height:2px;background:#DAA520;margin:16px auto;"></div>
            <p style="font-size:18px;font-style:italic;color:#6c5ce7;font-family:'Georgia',serif;">"Somewhere Between I Want It & I Got It"</p>
            
            <div style="width:60px;height:2px;background:#DAA520;margin:16px auto;"></div>
            <p style="font-size:15px;font-weight:600;color:#1a1a1a;font-family:'Space Grotesk',sans-serif;margin-bottom:10px;letter-spacing:1px;">CONNECT WITH ME</p>
            <div style="display:flex;flex-direction:column;align-items:center;gap:5px;max-width:350px;margin:0 auto;font-size:14px;color:#1a1a1a;font-family:'Space Grotesk',sans-serif;">
                <div style="display:flex;justify-content:space-between;width:100%;padding:3px 0;border-bottom:1px solid #f0f0f0;">
                    <span>📸 Instagram</span>
                    <a href="https://instagram.com/rravirajhere" style="color:#DAA520;text-decoration:none;">@rravirajhere</a>
                </div>
                <div style="display:flex;justify-content:space-between;width:100%;padding:3px 0;border-bottom:1px solid #f0f0f0;">
                    <span>💼 LinkedIn</span>
                    <a href="https://linkedin.com/in/ravirajhere" style="color:#DAA520;text-decoration:none;">@ravirajhere</a>
                </div>
                <div style="display:flex;justify-content:space-between;width:100%;padding:3px 0;border-bottom:1px solid #f0f0f0;">
                    <span>🌐 Website</span>
                    <a href="https://raviraj2k09.github.io" style="color:#DAA520;text-decoration:none;">raviraj2k09.github.io</a>
                </div>
                <div style="display:flex;justify-content:space-between;width:100%;padding:3px 0;">
                    <span>💬 WhatsApp</span>
                    <a href="https://wa.me/91XXXXXXXXXX" style="color:#DAA520;text-decoration:none;">@singh_ravirajhere</a>
                </div>
            </div>
            
            ${qrImg ? `<div style="margin:14px auto 0 auto;">${qrImg}<p style="font-size:10px;color:#999;font-family:'Space Grotesk',sans-serif;margin-top:4px;">Scan to visit my website</p></div>` : ''}
            
            <div style="width:60px;height:2px;background:#DAA520;margin:16px auto;"></div>
            <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:4px;">
                <span style="background:#f5f5f5;padding:4px 16px;border-radius:20px;font-size:13px;color:#333;font-family:'Space Grotesk',sans-serif;">💻 3+ Years Coding</span>
                <span style="background:#f5f5f5;padding:4px 16px;border-radius:20px;font-size:13px;color:#333;font-family:'Space Grotesk',sans-serif;">🚀 5+ Projects</span>
                <span style="background:#f5f5f5;padding:4px 16px;border-radius:20px;font-size:13px;color:#333;font-family:'Space Grotesk',sans-serif;">📚 Loves Novels</span>
            </div>
        </div>
    `;
    const about = createHeaderFooter(aboutContent, 'About the Author', false, true);
    addPageBreak(about);
    container.appendChild(about);
    
    // ---- PAGE 23: EMOTIONAL MESSAGE ----
    const emotionalContent = document.createElement('div');
    emotionalContent.style.cssText = `text-align:center;padding:80px 50px;background:#fafafa;display:flex;flex-direction:column;justify-content:center;min-height:842px;`;
    emotionalContent.innerHTML = `
        <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
            <div style="font-size:48px;margin-bottom:20px;">❤️</div>
            <p style="font-size:22px;font-weight:400;color:#1a1a1a;font-family:'Georgia',serif;max-width:500px;margin:0 auto;line-height:1.8;font-style:italic;">"Thank you for reading my story. Every chapter of this book is a piece of my heart. I hope my journey inspires you to chase your own dreams."</p>
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
    const emotional = createHeaderFooter(emotionalContent, 'The End', false, true);
    addPageBreak(emotional);
    container.appendChild(emotional);
    
    // ---- ATTACH TO DOM AND GENERATE PDF ----
    document.body.appendChild(container);
    
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
    });
    
    await pdf.html(container, {
        callback: function (pdf) {
            const totalPages = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(10);
                pdf.setTextColor('#666666');
                pdf.text(`Page ${i} of ${totalPages}`, 105, 285, { align: 'center' });
            }
            pdf.save(`My_Autobiography_Ravi_Raj_${langLabel}.pdf`);
            document.body.removeChild(container);
            showToast(`✅ ${langLabel} ebook downloaded!`, 'success');
        },
        margin: [15, 15, 15, 15],
        autoPaging: 'text',
        html2canvas: { 
            scale: 2, 
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false
        },
        pagebreak: { mode: ['css', 'legacy'] },
        x: 0,
        y: 0,
        width: 180
    });
}

// ============================================================
// 11. EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ============================================================
window.downloadEnglishEbook = downloadEnglishEbook;
window.downloadHinglishEbook = downloadHinglishEbook;
window.showToast = showToast;
window.closeModal = closeModal;
