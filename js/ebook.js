// ============================================================
// EBOOK.JS — PAGE-SPECIFIC LOGIC FOR AUTOBIOGRAPHY.HTML
// (Ebook Generator, PDF Creation, QR Code, Resource Validator)
// ============================================================

// ============================================================
// CONFIGURATION
// ============================================================
const EBOOK_CONFIG = {
    author: 'Ravi Raj Singh',
    title: 'My Autobiography',
    subtitle: 'A Boy Who Never Thought',
    birthYear: 2008,
    birthplace: 'Begusarai, Bihar',
    currentYear: new Date().getFullYear(),
    images: {
        cover: 'assets/images/bookcover.jpg',
        author: 'assets/images/formal.jpg',
        signature: 'assets/images/signature.jpg'
    },
    social: {},
    qr: {
        url: 'https://ravirajhere.github.io',
        size: 120
    },
    pdf: {
        scale: 1.5,
        quality: 0.85,
        format: 'a4',
        margin: 15,
        batchSize: 3
    }
};

// ============================================================
// HELPER: number to word
// ============================================================
function numberToWord(num) {
    const map = {
        '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four', '5': 'Five',
        '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine', '10': 'Ten',
        '11': 'Eleven', '12': 'Twelve', '13': 'Thirteen', '14': 'Fourteen',
        '15': 'Fifteen'
    };
    return map[String(num)] || num;
}

// ============================================================
// PDF PROGRESS PILL HELPERS
// ============================================================
function showPdfProgress(percent, label) {
    const pill = document.getElementById('pdfProgressPill');
    const text = document.getElementById('pdfPillText');
    const pct = document.getElementById('pdfPillPercent');
    const fill = document.getElementById('pdfPillFill');
    
    if (!pill) return;
    
    pill.classList.add('active');
    
    const p = Math.max(0, Math.min(100, Math.round(percent)));
    
    if (text && label) text.textContent = label;
    if (pct) pct.textContent = p + '%';
    if (fill) fill.style.width = p + '%';
}

function hidePdfProgress() {
    const pill = document.getElementById('pdfProgressPill');
    if (pill) pill.classList.remove('active');
    
    setTimeout(() => {
        const pct = document.getElementById('pdfPillPercent');
        const fill = document.getElementById('pdfPillFill');
        const text = document.getElementById('pdfPillText');
        if (pct) pct.textContent = '0%';
        if (fill) fill.style.width = '0%';
        if (text) text.textContent = 'Generating PDF';
    }, 400);
}

window.showPdfProgress = showPdfProgress;
window.hidePdfProgress = hidePdfProgress;

// ============================================================
// 1. TOAST MANAGER
// ============================================================
class ToastManager {
    constructor() {
        this.toast = document.getElementById('toast');
        this.timeout = null;
        this.queue = [];
        this.isShowing = false;
    }

    show(message, type = 'info', duration = 3000) {
        this.queue.push({ message, type, duration });
        if (!this.isShowing) {
            this.processQueue();
        }
    }

    processQueue() {
        if (this.queue.length === 0) {
            this.isShowing = false;
            return;
        }

        this.isShowing = true;
        const { message, type, duration } = this.queue.shift();
        
        if (!this.toast) return;
        
        this.toast.textContent = message;
        this.toast.className = 'toast';
        if (type) this.toast.classList.add(type);
        this.toast.classList.add('show');
        
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.toast.classList.remove('show');
            setTimeout(() => this.processQueue(), 300);
        }, duration);
    }

    error(message) { this.show('❌ ' + message, 'error', 4000); }
    success(message) { this.show('✅ ' + message, 'success', 3000); }
    info(message) { this.show('ℹ️ ' + message, 'info', 2500); }
    warning(message) { this.show('⚠️ ' + message, 'warning', 3500); }
}

const toast = new ToastManager();

// ============================================================
// 2. MODAL MANAGER
// ============================================================
class ModalManager {
    constructor() {
        this.modal = document.getElementById('downloadModal');
        this.isOpen = false;
    }

    open() {
        if (!this.modal) return;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.isOpen = true;
    }

    close() {
        if (!this.modal) return;
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.isOpen = false;
    }
}

const modal = new ModalManager();

// ============================================================
// 3. RESOURCE VALIDATOR
// ============================================================
class ResourceValidator {
    static async validateImage(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 400;
                canvas.height = 400;
                const ctx = canvas.getContext('2d');
                
                const gradient = ctx.createLinearGradient(0, 0, 400, 400);
                gradient.addColorStop(0, '#f0f0f0');
                gradient.addColorStop(1, '#e0e0e0');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 400, 400);
                
                ctx.fillStyle = '#999';
                ctx.font = '60px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('📷', 200, 200);
                
                ctx.fillStyle = '#666';
                ctx.font = '16px Arial';
                ctx.fillText('Image not found', 200, 280);
                
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.src = src;
        });
    }

    static async validateAllImages() {
        const results = {};
        for (const [key, src] of Object.entries(EBOOK_CONFIG.images)) {
            results[key] = await this.validateImage(src);
        }
        return results;
    }
}

// ============================================================
// 4. LIBRARY LOADER WITH RETRY
// ============================================================
class LibraryLoader {
    static async loadScript(src, retries = 3) {
        if (src.includes('html2canvas') && typeof html2canvas !== 'undefined') return true;
        if (src.includes('jspdf') && typeof jspdf !== 'undefined') return true;
        if (src.includes('qrcode') && typeof QRCode !== 'undefined') return true;

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = src;
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
                return true;
            } catch (error) {
                if (attempt === retries) {
                    throw new Error(`Failed to load ${src} after ${retries} attempts`);
                }
                await new Promise(r => setTimeout(r, 1000 * attempt));
            }
        }
        return false;
    }

    static async loadAll() {
        const libraries = [
            'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
        ];

        const loaded = libraries.map(src => {
            if (src.includes('html2canvas') && typeof html2canvas !== 'undefined') return true;
            if (src.includes('jspdf') && typeof jspdf !== 'undefined') return true;
            if (src.includes('qrcode') && typeof QRCode !== 'undefined') return true;
            return false;
        });

        const toLoad = libraries.filter((_, i) => !loaded[i]);
        
        if (toLoad.length === 0) return true;

        for (const src of toLoad) {
            await this.loadScript(src);
        }
        
        return true;
    }
}

// ============================================================
// 5. QR CODE GENERATOR WITH RETRY
// ============================================================
class QRGenerator {
    static async generate(data, size = 120) {
        return new Promise((resolve) => {
            try {
                const container = document.createElement('div');
                container.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    position: absolute;
                    left: -9999px;
                    top: -9999px;
                `;
                document.body.appendChild(container);

                new QRCode(container, {
                    text: data,
                    width: size,
                    height: size,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.H
                });

                let attempts = 0;
                const maxAttempts = 10;
                
                const checkCanvas = setInterval(() => {
                    attempts++;
                    const canvas = container.querySelector('canvas');
                    if (canvas) {
                        clearInterval(checkCanvas);
                        const dataUrl = canvas.toDataURL('image/png');
                        document.body.removeChild(container);
                        resolve(dataUrl);
                    } else if (attempts >= maxAttempts) {
                        clearInterval(checkCanvas);
                        document.body.removeChild(container);
                        resolve(null);
                    }
                }, 100);
            } catch (error) {
                resolve(null);
            }
        });
    }
}

// ============================================================
// 6. APPLY PROFESSIONAL BOOK STYLES (PDF CLEAN VERSION)
// ============================================================
function applyProfessionalBookStyles(clone, isPdfMode = true) {
    // ---- ALL PARAGRAPHS (compact for PDF) ----
    clone.querySelectorAll('.chapter p').forEach(el => {
        el.style.color = '#1a1a1a';
        el.style.fontFamily = "'Lora', 'Georgia', 'Times New Roman', serif";
        el.style.fontSize = '12.5px';
        el.style.lineHeight = '1.6';
        el.style.textAlign = 'justify';
        el.style.marginBottom = '8px';
        el.style.fontWeight = '450';
        el.style.letterSpacing = '0.2px';
        if (isPdfMode) el.style.background = 'transparent';
    });
    
    // ---- STRONG TEXT ----
    clone.querySelectorAll('.chapter strong').forEach(el => {
        el.style.color = '#000000';
        el.style.fontWeight = '700';
        el.style.fontFamily = "'Lora', 'Georgia', 'Times New Roman', serif";
        if (isPdfMode) el.style.background = 'transparent';
    });
    
    // ---- LIST ITEMS ----
    clone.querySelectorAll('.chapter ul li').forEach(el => {
        el.style.color = '#1a1a1a';
        el.style.fontFamily = "'Lora', 'Georgia', 'Times New Roman', serif";
        el.style.fontSize = '12.5px';
        el.style.lineHeight = '1.6';
        el.style.marginBottom = '5px';
        el.style.fontWeight = '450';
        el.style.letterSpacing = '0.2px';
        if (isPdfMode) el.style.background = 'transparent';
    });
    
    // ---- QUOTES (compact) ----
    clone.querySelectorAll('.quote-box').forEach(el => {
        el.style.color = '#1a1a1a';
        el.style.fontFamily = "'Playfair Display', 'Georgia', 'Times New Roman', serif";
        el.style.fontSize = '13px';
        el.style.lineHeight = '1.5';
        el.style.fontStyle = 'italic';
        el.style.borderLeft = '3px solid #DAA520';
        el.style.padding = '12px 18px';
        el.style.margin = '12px 0';
        el.style.fontWeight = '400';
        el.style.letterSpacing = '0.3px';
        el.style.textAlign = 'center';
        if (isPdfMode) el.style.background = 'transparent';
    });
    
    clone.querySelectorAll('.quote-box .author').forEach(el => {
        el.style.color = '#DAA520';
        el.style.fontWeight = '600';
        el.style.fontStyle = 'normal';
        el.style.textAlign = 'right';
        el.style.marginTop = '6px';
        el.style.fontSize = '11px';
        el.style.fontFamily = "'Playfair Display', 'Georgia', 'Times New Roman', serif";
        el.style.letterSpacing = '0.5px';
        if (isPdfMode) el.style.background = 'transparent';
    });
    
    // ---- FAMILY ITEMS ----
    clone.querySelectorAll('.family-item').forEach(el => {
        el.style.background = isPdfMode ? 'transparent' : '#fafafa';
        el.style.border = isPdfMode ? 'none' : '1px solid #e8e8e8';
        el.style.borderRadius = isPdfMode ? '0' : '8px';
        el.style.padding = isPdfMode ? '4px 0' : '14px 18px';
        el.style.marginBottom = '6px';
    });
    
    clone.querySelectorAll('.family-item .label').forEach(el => {
        el.style.color = '#999999';
        el.style.fontSize = '11px';
        el.style.textTransform = 'uppercase';
        el.style.letterSpacing = '0.8px';
        el.style.fontFamily = "'Playfair Display', 'Georgia', 'Times New Roman', serif";
        el.style.fontWeight = '400';
        if (isPdfMode) el.style.background = 'transparent';
    });
    
    clone.querySelectorAll('.family-item .value').forEach(el => {
        el.style.color = '#000000';
        el.style.fontSize = '12.5px';
        el.style.fontWeight = '600';
        el.style.fontFamily = "'Lora', 'Georgia', 'Times New Roman', serif";
        el.style.letterSpacing = '0.3px';
        if (isPdfMode) el.style.background = 'transparent';
    });
    
    // ---- TEACHER TRIBUTE ----
    clone.querySelectorAll('.teacher-tribute').forEach(el => {
        if (isPdfMode) {
            el.style.background = 'transparent';
            el.style.border = 'none';
            el.style.borderRadius = '0';
            el.style.padding = '8px 0';
        } else {
            el.style.background = 'rgba(108,92,231,0.04)';
            el.style.border = '1px solid rgba(108,92,231,0.12)';
            el.style.borderRadius = '8px';
            el.style.padding = '20px 24px';
        }
        el.style.margin = '14px 0';
    });
    
    clone.querySelectorAll('.teacher-tribute h4').forEach(el => {
        el.style.color = '#DAA520';
        el.style.fontSize = '14px';
        el.style.fontWeight = '600';
        el.style.fontFamily = "'Playfair Display', 'Georgia', 'Times New Roman', serif";
        el.style.letterSpacing = '0.5px';
        if (isPdfMode) el.style.background = 'transparent';
    });
    
    clone.querySelectorAll('.teacher-tribute p').forEach(el => {
        el.style.color = '#1a1a1a';
        el.style.fontSize = '12.5px';
        el.style.lineHeight = '1.6';
        el.style.fontFamily = "'Lora', 'Georgia', 'Times New Roman', serif";
        el.style.fontWeight = '450';
        el.style.letterSpacing = '0.3px';
        if (isPdfMode) el.style.background = 'transparent';
    });
    
    // ---- FRIEND MEMORY ----
    clone.querySelectorAll('.friend-memory-pdf').forEach(el => {
        el.style.color = '#1a1a1a';
        el.style.fontFamily = "'Lora', 'Georgia', 'Times New Roman', serif";
        el.style.fontWeight = '450';
        el.style.letterSpacing = '0.3px';
        el.style.lineHeight = '1.6';
        if (isPdfMode) {
            el.style.background = 'transparent';
            el.style.border = 'none';
            el.style.borderRadius = '0';
            el.style.padding = '8px 0';
        } else {
            el.style.background = '#ffffff';
            el.style.border = '1px dashed #DAA520';
            el.style.borderRadius = '8px';
            el.style.padding = '24px 28px';
        }
        el.style.margin = '14px 0';
    });
    
    clone.querySelectorAll('.friend-memory-pdf strong').forEach(el => {
        el.style.color = '#DAA520';
        el.style.fontWeight = '700';
        el.style.fontFamily = "'Lora', 'Georgia', 'Times New Roman', serif";
        if (isPdfMode) el.style.background = 'transparent';
    });
}

// ============================================================
// 7. MAIN EBOOK GENERATOR
// ============================================================
class EbookGenerator {
    constructor() {
        this.pdf = null;
        this.pages = [];
        this.currentPage = 0;
        this.totalPages = 0;
        this.isGenerating = false;
        this.cancelled = false;
        this.resources = null;
    }

    async generate(lang, langLabel) {
        if (this.isGenerating) return;

        this.isGenerating = true;
        this.cancelled = false;
        this.currentPage = 0;

        // ✅ Show progress pill
        showPdfProgress(0, 'Preparing...');

        try {
            this.resources = await ResourceValidator.validateAllImages();
            await LibraryLoader.loadAll();

            showPdfProgress(5, 'Building pages...');

            const content = this.getContent(lang);
            if (!content) {
                throw new Error('Content not found');
            }

            this.pages = await this.buildPages(content, lang);
            this.totalPages = this.pages.length;

            showPdfProgress(40, 'Rendering PDF...');

            await this.generatePDF(langLabel);

            showPdfProgress(100, 'Saving...');

            const filename = `My_Autobiography_${EBOOK_CONFIG.author.replace(/\s/g, '_')}_${langLabel}.pdf`;
            this.pdf.save(filename);
            
            toast.success(`${langLabel} ebook downloaded successfully!`);
        } catch (error) {
            console.error('Ebook generation failed:', error);
            toast.error(`Failed: ${error.message}`);
        } finally {
            this.isGenerating = false;
            // ✅ Hide progress pill (after short delay)
            setTimeout(() => hidePdfProgress(), 800);
            this.cleanup();
        }
    }

    // ========================================================
    // ✅ getContent() — Silent, no DOM touch
    // ========================================================
    getContent(lang) {
        const wrapper = document.querySelector('.autobio-wrapper');
        if (!wrapper) return null;

        // Clone the wrapper — DO NOT modify actual DOM
        const clonedWrapper = wrapper.cloneNode(true);

        const containerId = lang === 'en' ? 'chaptersEn' : 'chaptersHi';
        const otherId = lang === 'en' ? 'chaptersHi' : 'chaptersEn';

        const clonedCurrent = clonedWrapper.querySelector('#' + containerId);
        const clonedOther = clonedWrapper.querySelector('#' + otherId);

        if (clonedCurrent) clonedCurrent.style.display = 'block';
        if (clonedOther) clonedOther.style.display = 'none';

        let clonedChapters = [];
        if (clonedCurrent) {
            clonedChapters = clonedCurrent.querySelectorAll('.chapter');
            clonedChapters.forEach(ch => {
                ch.style.display = 'block';
                ch.classList.add('active');
            });
        }

        return {
            wrapper: clonedWrapper,
            chapters: clonedChapters,
            containerId: containerId
        };
    }

    async buildPages(content, lang) {
        const pages = [];
        const clone = content.wrapper;
        const containerId = content.containerId;

        this.cleanClone(clone);

        const cloneContainer = clone.querySelector('#' + containerId);
        const cloneChapters = cloneContainer ? cloneContainer.querySelectorAll('.chapter') : [];

        applyProfessionalBookStyles(clone, true);

        const qrDataUrl = await QRGenerator.generate(EBOOK_CONFIG.qr.url, EBOOK_CONFIG.qr.size);

        const pageBuilders = this.getPageBuilders(cloneChapters, qrDataUrl);
        
        for (const builder of pageBuilders) {
            if (this.cancelled) break;
            
            const page = await builder();
            if (page) {
                pages.push(page);
                this.currentPage++;
                this.updateProgress();
            }
        }

        return pages;
    }

    getPageBuilders(chapters, qrDataUrl) {
        const builders = [];
        const images = this.resources;

        builders.push(async () => this.createCoverPage(images.cover));
        builders.push(async () => this.createTitlePage());
        builders.push(async () => this.createCopyrightPage());
        builders.push(async () => this.createDedicationPage());
        builders.push(async () => this.createEpigraphPage());
        builders.push(async () => this.createPrefacePage());
        builders.push(async () => this.createAcknowledgementsPage());
        builders.push(async () => this.createTOCPage(chapters));
        builders.push(async () => this.createOverviewPage());

        chapters.forEach((ch, index) => {
            builders.push(async () => this.createChapterPage(ch, index));
        });

        builders.push(async () => this.createConclusionPage());
        builders.push(async () => this.createAboutPage(images.author, qrDataUrl));
        builders.push(async () => this.createEmotionalPage(images.signature));
        builders.push(async () => this.createColophonPage());

        return builders;
    }

    createCoverPage(coverImage) {
        const div = document.createElement('div');
        div.style.cssText = `
            padding: 0;
            margin: 0;
            background: #ffffff;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        div.innerHTML = `<img src="${coverImage}" alt="Book Cover" style="width:100%;height:100%;object-fit:contain;">`;
        return div;
    }

    createTitlePage() {
        const div = document.createElement('div');
        div.style.cssText = `
            padding: 60px 40px;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: 100%;
            text-align: center;
        `;
        div.innerHTML = `
            <div style="max-width:500px;margin:0 auto;width:100%;">
                <div style="width:80px;height:2px;background:#DAA520;margin:0 auto 30px auto;"></div>
                <h1 style="font-size:36px;font-weight:700;color:#000000;font-family:'Playfair Display','Georgia','Times New Roman',serif;margin-bottom:10px;letter-spacing:2px;">${EBOOK_CONFIG.title}</h1>
                <p style="font-size:18px;color:#999;font-family:'Lora','Georgia','Times New Roman',serif;margin:15px 0;">—</p>
                <p style="font-size:24px;color:#DAA520;font-family:'Playfair Display','Georgia','Times New Roman',serif;margin:10px 0;font-weight:500;">${EBOOK_CONFIG.author}</p>
                <p style="font-size:16px;color:#666;font-style:italic;font-family:'Lora','Georgia','Times New Roman',serif;margin:10px 0;">"${EBOOK_CONFIG.subtitle}"</p>
                <p style="font-size:15px;color:#999;font-family:'Lora','Georgia','Times New Roman',serif;margin:6px 0;">From ${EBOOK_CONFIG.birthplace} to the World</p>
                <div style="width:80px;height:2px;background:#DAA520;margin:30px auto;"></div>
                <p style="font-size:14px;color:#aaa;font-family:'Playfair Display','Georgia','Times New Roman',serif;">${EBOOK_CONFIG.currentYear}</p>
            </div>
        `;
        return div;
    }

    createCopyrightPage() {
        const div = document.createElement('div');
        div.style.cssText = `
            padding: 60px 40px;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: 100%;
        `;
        div.innerHTML = `
            <div style="max-width:450px;margin:0 auto;width:100%;">
                <h2 style="font-size:14px;font-weight:700;color:#000000;font-family:'Playfair Display','Georgia','Times New Roman',serif;letter-spacing:2px;margin-bottom:20px;">COPYRIGHT</h2>
                <p style="font-size:13px;line-height:1.8;color:#333;font-family:'Lora','Georgia','Times New Roman',serif;margin-bottom:16px;">© 2024 ${EBOOK_CONFIG.author}<br>All rights reserved.</p>
                <p style="font-size:13px;line-height:1.8;color:#333;font-family:'Lora','Georgia','Times New Roman',serif;margin-bottom:16px;">No part of this book may be reproduced, stored in a retrieval system, or transmitted in any form or by any means, without the prior written permission of the author.</p>
                <p style="font-size:13px;line-height:1.8;color:#333;font-family:'Lora','Georgia','Times New Roman',serif;margin-bottom:16px;"><strong>Published by</strong><br>${EBOOK_CONFIG.author.toUpperCase()} PUBLICATION<br>Patna, India</p>
                <p style="font-size:13px;line-height:1.8;color:#333;font-family:'Lora','Georgia','Times New Roman',serif;margin-bottom:16px;">This book is not for sale.<br>For personal use only.</p>
                <p style="font-size:13px;line-height:1.8;color:#333;font-family:'Lora','Georgia','Times New Roman',serif;margin-bottom:8px;">ISBN: 2026-9102224871</p>
                <p style="font-size:13px;line-height:1.8;color:#333;font-family:'Lora','Georgia','Times New Roman',serif;margin-bottom:16px;">(India · Fiction · Autobiography)</p>
                <p style="font-size:13px;line-height:1.8;color:#333;font-family:'Lora','Georgia','Times New Roman',serif;margin-bottom:4px;">First Edition: 2024</p>
                <p style="font-size:13px;line-height:1.8;color:#333;font-family:'Lora','Georgia','Times New Roman',serif;margin-bottom:4px;">Published on 26th March 2024</p>
                <p style="font-size:13px;line-height:1.8;color:#333;font-family:'Lora','Georgia','Times New Roman',serif;">Second Impression: 2026</p>
            </div>
        `;
        return div;
    }

    createDedicationPage() {
        const div = document.createElement('div');
        div.style.cssText = `
            padding: 60px 40px;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: 100%;
            text-align: center;
        `;
        div.innerHTML = `
            <div style="max-width:500px;margin:0 auto;width:100%;">
                <p style="font-size:20px;font-weight:400;color:#1a1a1a;font-family:'Lora','Georgia','Times New Roman',serif;line-height:2;font-style:italic;">To my parents, who gave me the courage to dream.</p>
                <p style="font-size:20px;font-weight:400;color:#1a1a1a;font-family:'Lora','Georgia','Times New Roman',serif;line-height:2;font-style:italic;">To my siblings, who taught me patience and love.</p>
                <p style="font-size:20px;font-weight:400;color:#1a1a1a;font-family:'Lora','Georgia','Times New Roman',serif;line-height:2;font-style:italic;">To my friends, who never let me feel alone.</p>
                <div style="width:60px;height:2px;background:#DAA520;margin:30px auto;"></div>
                <p style="font-size:18px;color:#DAA520;font-family:'Playfair Display','Georgia','Times New Roman',serif;">— ${EBOOK_CONFIG.author}</p>
            </div>
        `;
        return div;
    }

    createEpigraphPage() {
        const div = document.createElement('div');
        div.style.cssText = `
            padding: 60px 40px;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: 100%;
            text-align: center;
        `;
        div.innerHTML = `
            <div style="max-width:550px;margin:0 auto;width:100%;">
                <div style="width:60px;height:2px;background:#DAA520;margin:0 auto 30px auto;"></div>
                <p style="font-size:20px;font-weight:400;color:#1a1a1a;font-family:'Lora','Georgia','Times New Roman',serif;line-height:1.7;font-style:italic;margin-bottom:16px;">"The only impossible journey is the one you never begin."</p>
                <p style="font-size:16px;color:#DAA520;font-family:'Playfair Display','Georgia','Times New Roman',serif;">— Tony Robbins</p>
                <div style="width:60px;height:2px;background:#DAA520;margin:30px auto 0 auto;"></div>
            </div>
        `;
        return div;
    }

    createPrefacePage() {
        const div = document.createElement('div');
        div.style.cssText = `
            padding: 60px 40px;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: 100%;
        `;
        div.innerHTML = `
            <div style="max-width:550px;margin:0 auto;width:100%;">
                <h2 style="font-size:28px;font-weight:700;color:#000000;font-family:'Playfair Display','Georgia','Times New Roman',serif;margin-bottom:20px;letter-spacing:2px;">Preface</h2>
                <p style="font-size:16px;line-height:1.7;color:#1a1a1a;font-family:'Lora','Georgia','Times New Roman',serif;text-align:justify;margin-bottom:16px;font-weight:450;letter-spacing:0.3px;">This book is a collection of my memories, thoughts, and experiences from my journey so far. I wrote this to share my story with the world and to inspire others to chase their dreams.</p>
                <p style="font-size:16px;line-height:1.7;color:#1a1a1a;font-family:'Lora','Georgia','Times New Roman',serif;text-align:justify;margin-bottom:16px;font-weight:450;letter-spacing:0.3px;">Life is a beautiful journey, and every chapter of this book is a piece of my heart. I hope you enjoy reading it as much as I enjoyed writing it.</p>
                <div style="width:60px;height:2px;background:#DAA520;margin:20px 0;"></div>
                <p style="font-size:16px;color:#DAA520;font-family:'Playfair Display','Georgia','Times New Roman',serif;">— ${EBOOK_CONFIG.author}</p>
            </div>
        `;
        return div;
    }

    createAcknowledgementsPage() {
        const div = document.createElement('div');
        div.style.cssText = `
            padding: 60px 40px;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: 100%;
        `;
        div.innerHTML = `
            <div style="max-width:550px;margin:0 auto;width:100%;">
                <h2 style="font-size:28px;font-weight:700;color:#000000;font-family:'Playfair Display','Georgia','Times New Roman',serif;margin-bottom:20px;letter-spacing:2px;">Acknowledgements</h2>
                <p style="font-size:16px;line-height:1.7;color:#1a1a1a;font-family:'Lora','Georgia','Times New Roman',serif;text-align:justify;margin-bottom:16px;font-weight:450;letter-spacing:0.3px;">First and foremost, I would like to thank my parents for their unwavering support and encouragement.</p>
                <p style="font-size:16px;line-height:1.7;color:#1a1a1a;font-family:'Lora','Georgia','Times New Roman',serif;text-align:justify;margin-bottom:16px;font-weight:450;letter-spacing:0.3px;">I am also grateful to my teachers who guided me and shaped my thinking.</p>
                <p style="font-size:16px;line-height:1.7;color:#1a1a1a;font-family:'Lora','Georgia','Times New Roman',serif;text-align:justify;margin-bottom:16px;font-weight:450;letter-spacing:0.3px;">A special thanks to my friends who stood by me through thick and thin.</p>
                <p style="font-size:16px;line-height:1.7;color:#1a1a1a;font-family:'Lora','Georgia','Times New Roman',serif;text-align:justify;font-weight:450;letter-spacing:0.3px;">And to everyone who believed in me when I didn't believe in myself.</p>
                <div style="width:60px;height:2px;background:#DAA520;margin:20px 0;"></div>
                <p style="font-size:16px;color:#DAA520;font-family:'Playfair Display','Georgia','Times New Roman',serif;">— ${EBOOK_CONFIG.author}</p>
            </div>
        `;
        return div;
    }

    createTOCPage(chapters) {
        const div = document.createElement('div');
        div.style.cssText = `
            padding: 60px 40px;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: 100%;
        `;
        
        let tocHTML = `
            <h2 style="font-size:28px;font-weight:700;color:#000000;text-align:center;font-family:'Playfair Display','Georgia','Times New Roman',serif;margin-bottom:30px;letter-spacing:2px;">Table of Contents</h2>
            <ul style="list-style:none;padding:0;font-family:'Lora','Georgia','Times New Roman',serif;font-size:15px;line-height:2.8;max-width:550px;margin:0 auto;width:100%;">
        `;
        
        let pageNum = 12;
        chapters.forEach((ch, idx) => {
            const h3 = ch.querySelector('h3');
            let title = h3 ? h3.textContent.trim() : `Chapter ${idx+1}`;
            title = title.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
            title = title.replace(/[^\w\s\-\.:]/g, '').trim();
            tocHTML += `
                <li style="border-bottom:1px solid #f0f0f0;padding:4px 0;display:flex;justify-content:space-between;">
                    <span style="color:#1a1a1a;font-family:'Lora','Georgia','Times New Roman',serif;font-size:14px;font-weight:450;letter-spacing:0.3px;">${title}</span>
                    <span style="color:#999;font-family:'Playfair Display','Georgia','Times New Roman',serif;font-size:13px;">${pageNum + idx}</span>
                </li>
            `;
        });
        tocHTML += `</ul>`;
        div.innerHTML = tocHTML;
        return div;
    }

    createOverviewPage() {
        const div = document.createElement('div');
        div.style.cssText = `
            padding: 60px 40px;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: 100%;
        `;
        div.innerHTML = `
            <div style="max-width:550px;margin:0 auto;width:100%;">
                <h2 style="font-size:28px;font-weight:700;color:#000000;text-align:center;font-family:'Playfair Display','Georgia','Times New Roman',serif;margin-bottom:20px;letter-spacing:2px;">Overview</h2>
                <p style="font-size:16px;line-height:1.7;color:#1a1a1a;text-align:justify;font-family:'Lora','Georgia','Times New Roman',serif;margin-bottom:20px;font-weight:450;letter-spacing:0.3px;">This autobiography takes you through the journey of ${EBOOK_CONFIG.author} — from his humble beginnings in ${EBOOK_CONFIG.birthplace}, to becoming a passionate coder and dreamer. It covers childhood memories, school days, family, friendships, struggles, and the joy of building something from nothing. A story of a boy who never thought he would, but did.</p>
                <div style="width:60px;height:2px;background:#DAA520;margin:20px auto;"></div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;max-width:450px;margin:0 auto;width:100%;">
                    <div style="background:#f5f5f5;padding:14px;border-radius:10px;text-align:center;">
                        <span style="font-size:22px;font-weight:700;color:#DAA520;font-family:'Playfair Display','Georgia','Times New Roman',serif;">10</span>
                        <p style="font-size:12px;color:#666;margin:2px 0;font-family:'Lora','Georgia','Times New Roman',serif;">Chapters</p>
                    </div>
                    <div style="background:#f5f5f5;padding:14px;border-radius:10px;text-align:center;">
                        <span style="font-size:22px;font-weight:700;color:#DAA520;font-family:'Playfair Display','Georgia','Times New Roman',serif;">${EBOOK_CONFIG.birthYear}</span>
                        <p style="font-size:12px;color:#666;margin:2px 0;font-family:'Lora','Georgia','Times New Roman',serif;">Year of Birth</p>
                    </div>
                    <div style="background:#f5f5f5;padding:14px;border-radius:10px;text-align:center;">
                        <span style="font-size:22px;font-weight:700;color:#DAA520;font-family:'Playfair Display','Georgia','Times New Roman',serif;">3+</span>
                        <p style="font-size:12px;color:#666;margin:2px 0;font-family:'Lora','Georgia','Times New Roman',serif;">Years Coding</p>
                    </div>
                    <div style="background:#f5f5f5;padding:14px;border-radius:10px;text-align:center;">
                        <span style="font-size:22px;font-weight:700;color:#DAA520;font-family:'Playfair Display','Georgia','Times New Roman',serif;">14</span>
                        <p style="font-size:12px;color:#666;margin:2px 0;font-family:'Lora','Georgia','Times New Roman',serif;">Friends</p>
                    </div>
                </div>
            </div>
        `;
        return div;
    }

    // ========================================================
    // ✅ createChapterPage() — Textbook Style
    // - Left: Number circle (72px)
    // - Right: Chapter name + year (~ 2013)
    // - Full-width divider below
    // - Content: 12.5px justify
    // - Photo: content ke neeche (1:1, 170x170)
    // - Page number bottom center
    // ========================================================
    createChapterPage(chapter, index) {
        const div = document.createElement('div');
        div.style.cssText = `
            padding: 45px 55px 60px 55px;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            min-height: 100%;
            box-sizing: border-box;
            position: relative;
            font-family: 'Lora', 'Georgia', 'Times New Roman', serif;
        `;

        const clone = chapter.cloneNode(true);

        clone.querySelectorAll('.nav-buttons, .copy-link-btn, .upload-hint').forEach(el => el.remove());

        const h3 = clone.querySelector('h3');
        let fullTitle = h3 ? h3.textContent.trim() : `Chapter ${index + 1}`;
        fullTitle = fullTitle.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();

        let chapterNum = index + 1;
        let chapterName = fullTitle;
        let chapterYear = '';

        // Extract year
        const yearMatch = fullTitle.match(/\((\d{4}(?:[–-]\d{4})?)\)/);
        if (yearMatch) {
            chapterYear = yearMatch[1];
            chapterName = chapterName.replace(yearMatch[0], '').trim();
        }

        // Extract chapter number + name
        const chapterMatch = chapterName.match(/^Chapter\s+(\d+|One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|Eleven|Twelve|Thirteen)[:\s-]+(.*)$/i);
        if (chapterMatch) {
            const num = chapterMatch[1];
            const numMap = {
                'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
                'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
                'eleven': 11, 'twelve': 12, 'thirteen': 13
            };
            chapterNum = parseInt(num) || numMap[String(num).toLowerCase()] || (index + 1);
            chapterName = chapterMatch[2].trim();
        } else if (/^Epilogue/i.test(chapterName)) {
            chapterName = chapterName.replace(/^Epilogue[:\s-]*/i, '').trim() || 'To Be Continued...';
            chapterNum = 'E';
        }

        if (h3) h3.remove();

        // Extract photo
        const photoPlaceholder = clone.querySelector('.chapter-photo-placeholder');
        let photoHTML = '';
        if (photoPlaceholder) {
            const img = photoPlaceholder.querySelector('img');
            if (img) {
                const src = img.getAttribute('src');
                photoHTML = `
                    <div style="text-align:center;margin:24px auto 0 auto;">
                        <img src="${src}" 
                             style="width:170px;height:170px;object-fit:cover;border-radius:6px;border:1px solid #e0e0e0;display:block;margin:0 auto;"
                             crossorigin="anonymous">
                    </div>
                `;
            }
            photoPlaceholder.remove();
        }

        // ===== Textbook-style header with ROW layout =====
        const headerHTML = `
            <div style="margin-bottom:24px;">
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 16px;
                ">
                    <!-- Big number circle (left) -->
                    <div style="
                        flex-shrink: 0;
                        width: 72px;
                        height: 72px;
                        border-radius: 50%;
                        background: #f0f0f0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border: 3px solid #ffffff;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    ">
                        <span style="
                            font-family: 'Playfair Display', 'Georgia', serif;
                            font-size: 38px;
                            font-weight: 800;
                            color: #1a1a1a;
                            line-height: 1;
                            letter-spacing: -1px;
                        ">${chapterNum}</span>
                    </div>

                    <!-- Title + year (right) -->
                    <div style="flex: 1;">
                        <h2 style="
                            font-family: 'Playfair Display', 'Georgia', serif;
                            font-size: 24px;
                            font-weight: 700;
                            color: #000000;
                            margin: 0;
                            letter-spacing: 0.5px;
                            line-height: 1.25;
                        ">${chapterName}</h2>
                        ${chapterYear ? `
                            <p style="
                                font-family: 'Lora', 'Georgia', serif;
                                font-size: 13px;
                                color: #888888;
                                font-style: italic;
                                margin: 4px 0 0 0;
                                letter-spacing: 1px;
                            ">~ ${chapterYear}</p>
                        ` : ''}
                    </div>
                </div>

                <!-- Full-width divider -->
                <div style="
                    width: 100%;
                    height: 1px;
                    background: #d0d0d0;
                "></div>
            </div>
        `;

        const bodyDiv = document.createElement('div');

        clone.querySelectorAll('p').forEach(el => {
            el.style.color = '#1a1a1a';
            el.style.fontFamily = "'Lora', 'Georgia', 'Times New Roman', serif";
            el.style.fontSize = '12.5px';
            el.style.lineHeight = '1.6';
            el.style.textAlign = 'justify';
            el.style.marginBottom = '8px';
            el.style.fontWeight = '450';
            el.style.letterSpacing = '0.2px';
            el.style.background = 'transparent';
            el.style.textIndent = '0';
        });

        clone.querySelectorAll('strong').forEach(el => {
            el.style.color = '#000000';
            el.style.fontWeight = '700';
        });

        clone.querySelectorAll('em').forEach(el => {
            el.style.color = '#1a1a1a';
            el.style.fontStyle = 'italic';
        });

        clone.querySelectorAll('.quote-box').forEach(el => {
            el.style.padding = '10px 16px';
            el.style.margin = '12px 0';
            el.style.fontSize = '13px';
            el.style.fontStyle = 'italic';
            el.style.borderLeft = '3px solid #1a1a1a';
            el.style.background = '#f8f8f8';
            el.style.textAlign = 'left';
            el.style.fontFamily = "'Lora', 'Georgia', serif";
            el.style.lineHeight = '1.5';
            el.style.borderRadius = '4px';
        });

        clone.querySelectorAll('.quote-box .author').forEach(el => {
            el.style.fontSize = '11px';
            el.style.marginTop = '6px';
            el.style.color = '#666';
            el.style.fontStyle = 'normal';
            el.style.textAlign = 'right';
        });

        clone.querySelectorAll('.friend-memory-pdf').forEach(el => {
            el.style.padding = '10px 14px';
            el.style.margin = '12px 0';
            el.style.background = '#f8f8f8';
            el.style.border = '1px solid #e8e8e8';
            el.style.borderRadius = '6px';
        });

        clone.querySelectorAll('.pdf-label').forEach(el => el.remove());

        while (clone.firstChild) {
            bodyDiv.appendChild(clone.firstChild);
        }

        const photoDiv = document.createElement('div');
        photoDiv.innerHTML = photoHTML;

        const pageNum = document.createElement('div');
        pageNum.style.cssText = `
            position: absolute;
            bottom: 22px;
            left: 0;
            right: 0;
            text-align: center;
            font-family: 'Playfair Display', 'Georgia', serif;
            font-size: 11px;
            color: #999999;
            letter-spacing: 2px;
        `;
        pageNum.textContent = '— ' + (index + 1) + ' —';

        div.innerHTML = headerHTML;
        div.appendChild(bodyDiv);
        div.appendChild(photoDiv);
        div.appendChild(pageNum);

        return div;
    }

    createConclusionPage() {
        const div = document.createElement('div');
        div.style.cssText = `
            padding: 60px 40px;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: 100%;
        `;
        div.innerHTML = `
            <div style="max-width:550px;margin:0 auto;width:100%;">
                <h2 style="font-size:28px;font-weight:700;color:#000000;font-family:'Playfair Display','Georgia','Times New Roman',serif;margin-bottom:20px;letter-spacing:2px;">Conclusion</h2>
                <p style="font-size:16px;line-height:1.7;color:#1a1a1a;font-family:'Lora','Georgia','Times New Roman',serif;text-align:justify;margin-bottom:16px;font-weight:450;letter-spacing:0.3px;">As I look back on my journey, I realize that life is not about where you start, but about how far you are willing to go.</p>
                <p style="font-size:16px;line-height:1.7;color:#1a1a1a;font-family:'Lora','Georgia','Times New Roman',serif;text-align:justify;margin-bottom:16px;font-weight:450;letter-spacing:0.3px;">Every struggle made me stronger. Every failure taught me something new. Every success reminded me why I started.</p>
                <p style="font-size:16px;line-height:1.7;color:#1a1a1a;font-family:'Lora','Georgia','Times New Roman',serif;text-align:justify;margin-bottom:16px;font-weight:450;letter-spacing:0.3px;">This is not the end of my story. It is just the beginning.</p>
                <p style="font-size:16px;line-height:1.7;color:#1a1a1a;font-family:'Lora','Georgia','Times New Roman',serif;text-align:justify;font-weight:450;letter-spacing:0.3px;">The best is yet to come.</p>
                <div style="width:60px;height:2px;background:#DAA520;margin:20px 0;"></div>
                <p style="font-size:16px;color:#DAA520;font-family:'Playfair Display','Georgia','Times New Roman',serif;">— ${EBOOK_CONFIG.author}</p>
            </div>
        `;
        return div;
    }

    createAboutPage(authorImage, qrDataUrl) {
        const div = document.createElement('div');
        div.style.cssText = `
            padding: 60px 40px;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: 100%;
            text-align: center;
        `;
        
        const qrHTML = qrDataUrl ? `
            <div style="margin:14px auto 0 auto;">
                <img src="${qrDataUrl}" alt="QR Code" style="width:120px;height:120px;display:block;margin:0 auto;border:2px solid #DAA520;border-radius:8px;padding:4px;">
                <p style="font-size:10px;color:#999;font-family:'Lora','Georgia','Times New Roman',serif;margin-top:4px;">Scan to visit my portfolio</p>
            </div>
        ` : '';
        
        div.innerHTML = `
            <div style="max-width:550px;margin:0 auto;width:100%;">
                <h2 style="font-size:28px;font-weight:700;color:#000000;font-family:'Playfair Display','Georgia','Times New Roman',serif;margin-bottom:20px;letter-spacing:2px;">About the Author</h2>
                <div style="width:120px;height:120px;border-radius:50%;border:3px solid #DAA520;margin:0 auto 16px;overflow:hidden;">
                    <img src="${authorImage}" alt="${EBOOK_CONFIG.author}" style="width:100%;height:100%;object-fit:cover;">
                </div>
                <p style="font-size:22px;font-weight:700;color:#000000;font-family:'Playfair Display','Georgia','Times New Roman',serif;margin:4px 0;">${EBOOK_CONFIG.author}</p>
                <p style="font-size:15px;color:#DAA520;font-family:'Playfair Display','Georgia','Times New Roman',serif;margin-bottom:14px;letter-spacing:1px;">Author · Developer · Dreamer</p>
                <div style="max-width:500px;margin:0 auto;">
                    <p style="font-size:15px;line-height:1.7;color:#1a1a1a;font-family:'Lora','Georgia','Times New Roman',serif;text-align:justify;font-weight:450;letter-spacing:0.3px;">${EBOOK_CONFIG.author} was born in March ${EBOOK_CONFIG.birthYear} in ${EBOOK_CONFIG.birthplace}. A self-taught developer, he discovered coding in 2020 and has since built over 5 projects. He is currently learning JavaScript and dreams of launching his own startup. When not coding, he enjoys reading novels and cycling.</p>
                </div>
                <div style="width:60px;height:2px;background:#DAA520;margin:16px auto;"></div>
                <p style="font-size:16px;font-style:italic;color:#6c5ce7;font-family:'Lora','Georgia','Times New Roman',serif;">"Somewhere Between I Want It & I Got It"</p>
                
                <div style="width:60px;height:2px;background:#DAA520;margin:16px auto;"></div>
                <div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:4px;">
                    <span style="background:#f5f5f5;padding:4px 14px;border-radius:20px;font-size:12px;color:#333;font-family:'Lora','Georgia','Times New Roman',serif;">💻 3+ Years Coding</span>
                    <span style="background:#f5f5f5;padding:4px 14px;border-radius:20px;font-size:12px;color:#333;font-family:'Lora','Georgia','Times New Roman',serif;">🚀 5+ Projects</span>
                    <span style="background:#f5f5f5;padding:4px 14px;border-radius:20px;font-size:12px;color:#333;font-family:'Lora','Georgia','Times New Roman',serif;">📚 Loves Novels</span>
                </div>
                
                ${qrHTML}
            </div>
        `;
        return div;
    }

    createEmotionalPage(signatureImage) {
        const div = document.createElement('div');
        div.style.cssText = `
            padding: 60px 40px;
            background: #fafafa;
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: 100%;
            text-align: center;
        `;
        div.innerHTML = `
            <div style="max-width:500px;margin:0 auto;width:100%;">
                <div style="font-size:48px;margin-bottom:20px;">❤️</div>
                <p style="font-size:20px;font-weight:400;color:#1a1a1a;font-family:'Lora','Georgia','Times New Roman',serif;line-height:1.7;font-style:italic;">"Thank you for reading my story. Every chapter of this book is a piece of my heart. I hope my journey inspires you to chase your own dreams."</p>
                <div style="margin:24px auto 10px auto;max-width:200px;">
                    <img src="${signatureImage}" alt="${EBOOK_CONFIG.author} Signature" style="width:100%;height:auto;display:block;">
                </div>
                <p style="font-size:18px;color:#DAA520;margin:6px 0 12px 0;font-family:'Playfair Display','Georgia','Times New Roman',serif;">— ${EBOOK_CONFIG.author}</p>
                <div style="width:60px;height:2px;background:#DAA520;margin:16px auto;"></div>
                <p style="font-size:14px;color:#666;font-family:'Lora','Georgia','Times New Roman',serif;">With love & gratitude ❤️</p>
                <p style="font-size:13px;color:#999;margin-top:6px;font-family:'Lora','Georgia','Times New Roman',serif;">${EBOOK_CONFIG.author} · ${EBOOK_CONFIG.currentYear}</p>
                <p style="font-size:13px;color:#aaa;margin-top:4px;font-family:'Lora','Georgia','Times New Roman',serif;">📖 From ${EBOOK_CONFIG.birthplace} to the World</p>
            </div>
        `;
        return div;
    }

    createColophonPage() {
        const div = document.createElement('div');
        div.style.cssText = `
            padding: 60px 40px;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: 100%;
            text-align: center;
        `;
        div.innerHTML = `
            <div style="max-width:450px;margin:0 auto;width:100%;">
                <div style="width:60px;height:2px;background:#DAA520;margin:0 auto 30px auto;"></div>
                <p style="font-size:14px;font-weight:400;color:#1a1a1a;font-family:'Lora','Georgia','Times New Roman',serif;line-height:2;margin-bottom:8px;">This book was written with love,</p>
                <p style="font-size:14px;font-weight:400;color:#1a1a1a;font-family:'Lora','Georgia','Times New Roman',serif;line-height:2;margin-bottom:8px;">Designed in Begusarai, Bihar,</p>
                <p style="font-size:14px;font-weight:400;color:#1a1a1a;font-family:'Lora','Georgia','Times New Roman',serif;line-height:2;margin-bottom:20px;">Printed in India, 2026</p>
                <div style="width:60px;height:2px;background:#DAA520;margin:0 auto 20px auto;"></div>
                <p style="font-size:12px;color:#999;font-family:'Lora','Georgia','Times New Roman',serif;line-height:1.8;">Fonts: Lora · Playfair Display</p>
                <p style="font-size:12px;color:#999;font-family:'Lora','Georgia','Times New Roman',serif;line-height:1.8;">Paper: Premium Offset</p>
                <p style="font-size:12px;color:#999;font-family:'Lora','Georgia','Times New Roman',serif;line-height:1.8;">Cover: Matte Finish</p>
                <div style="width:60px;height:2px;background:#DAA520;margin:20px auto;"></div>
                <p style="font-size:11px;color:#aaa;font-family:'Lora','Georgia','Times New Roman',serif;font-style:italic;">"A story from the heart"</p>
            </div>
        `;
        return div;
    }

    cleanClone(clone) {
        const removeSelectors = [
            '.lang-controls', '.download-actions', '.nav-buttons', 
            '.progress-dots', '.chapter-progress-info', '.copy-link-btn',
            '.back-to-top', '.reading-mode-toggle', '.toast', '.modal-overlay',
            '.pdf-progress-pill', '.theme-toggle-wrapper'
        ];
        removeSelectors.forEach(selector => {
            clone.querySelectorAll(selector).forEach(el => el.remove());
        });
    }

    async generatePDF(langLabel) {
        const { jsPDF } = window.jspdf;
        const config = EBOOK_CONFIG.pdf;
        
        this.pdf = new jsPDF({
            unit: 'mm',
            format: config.format,
            orientation: 'portrait',
            compress: true
        });

        this.pdf.setProperties({
            title: EBOOK_CONFIG.title,
            author: EBOOK_CONFIG.author,
            subject: 'Autobiography',
            keywords: 'autobiography, life story, memoir, inspiration',
            creator: `${EBOOK_CONFIG.author} Publishing`
        });

        const pageWidth = 210;
        const pageHeight = 297;
        const margin = config.margin;
        const contentWidth = pageWidth - (margin * 2);
        const contentHeight = pageHeight - (margin * 2);

        let isFirstPage = true;
        const batchSize = config.batchSize || 3;

        for (let i = 0; i < this.pages.length; i += batchSize) {
            if (this.cancelled) break;

            const batch = this.pages.slice(i, i + batchSize);
            const batchPromises = batch.map((page) => {
                return this.renderPage(page, contentWidth, contentHeight);
            });

            const results = await Promise.all(batchPromises);
            
            for (const result of results) {
                if (result) {
                    if (!isFirstPage) {
                        this.pdf.addPage();
                    }
                    isFirstPage = false;
                    
                    this.pdf.addImage(
                        result,
                        'JPEG',
                        margin,
                        margin,
                        contentWidth,
                        contentHeight,
                        undefined,
                        'FAST'
                    );
                }
            }

            const progress = Math.min(100, Math.round(((i + batch.length) / this.pages.length) * 100));
            this.updateProgress(progress);
            
            await new Promise(r => setTimeout(r, 50));
        }
    }

    async renderPage(element, width, height) {
        try {
            const container = document.createElement('div');
            container.style.cssText = `
                position: absolute;
                left: -9999px;
                top: -9999px;
                width: ${width}mm;
                background: #ffffff;
                padding: 0;
                margin: 0;
            `;
            
            const clone = element.cloneNode(true);
            clone.style.width = '100%';
            clone.style.height = '100%';
            clone.style.background = '#ffffff';
            container.appendChild(clone);
            document.body.appendChild(container);

            await new Promise(r => setTimeout(r, 50));

            const canvas = await html2canvas(container, {
                scale: EBOOK_CONFIG.pdf.scale,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                width: width * 3.78,
                height: height * 3.78
            });

            document.body.removeChild(container);

            if (canvas) {
                return canvas.toDataURL('image/jpeg', EBOOK_CONFIG.pdf.quality);
            }
            return null;
        } catch (error) {
            console.error('Page rendering failed:', error);
            return null;
        }
    }

    updateProgress(percent) {
        const progressBar = document.querySelector('.progress-bar');
        const progressText = document.querySelector('.progress-text');
        
        const p = Math.min(100, percent || 
            Math.round((this.currentPage / this.totalPages) * 100));
        
        if (progressBar) progressBar.style.width = p + '%';
        if (progressText) progressText.textContent = `${p}%`;

        // ✅ Update floating pill (map 0-100 → 40-100)
        const visualPercent = 40 + Math.round((p / 100) * 60);
        showPdfProgress(visualPercent, 'Generating PDF');
    }

    cleanup() {
        document.querySelectorAll('div[style*="left: -9999px"]').forEach(el => el.remove());
        document.querySelectorAll('canvas').forEach(el => {
            if (el.width > 1000) el.remove();
        });
        this.pages = [];
        this.pdf = null;
        if (window.gc) window.gc();
    }

    cancel() {
        this.cancelled = true;
        this.isGenerating = false;
        toast.warning('Generation cancelled');
        hidePdfProgress();
        this.cleanup();
    }
}

// ============================================================
// 8. EXPOSE FUNCTIONS
// ============================================================
const ebookGenerator = new EbookGenerator();

window.downloadEnglishEbook = async function() {
    await ebookGenerator.generate('en', 'English');
};

window.downloadHinglishEbook = async function() {
    await ebookGenerator.generate('hi', 'Hinglish');
};

window.cancelEbookGeneration = function() {
    ebookGenerator.cancel();
};

window.showToast = function(message, type = 'info') {
    toast.show(message, type);
};

window.closeModal = function() {
    modal.close();
};

// ============================================================
// 9. KEYBOARD SHORTCUTS
// ============================================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (modal.isOpen) modal.close();
        if (ebookGenerator.isGenerating) ebookGenerator.cancel();
    }
});

// ============================================================
// 10. PROGRESS INDICATOR SETUP
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const progressContainer = document.querySelector('.progress-container');
    if (progressContainer) {
        progressContainer.innerHTML = `
            <div class="progress-bar-wrapper" style="width:100%;background:#f0f0f0;border-radius:8px;overflow:hidden;height:8px;">
                <div class="progress-bar" style="width:0%;height:100%;background:#DAA520;transition:width 0.3s ease;"></div>
            </div>
            <p class="progress-text" style="text-align:center;font-size:12px;color:#666;margin-top:4px;">0%</p>
        `;
    }
});

console.log('✅ Ebook Generator loaded successfully!');
console.log('📖 Use downloadEnglishEbook() or downloadHinglishEbook()');
