// ============================================================
// EBOOK.JS — FINAL VERSION
// PDF Download + 7 Improvements (Meta AI Suggestions)
// ============================================================

const EBOOK_CONFIG = {
    author: 'Suraj Anand',
    aka: 'Raviraj',
    title: 'A Boy Who Never Thought',
    subtitle: 'Safar se safar tak — गुंजते सन्नाटे',
    birthYear: 2006,
    birthplace: 'Begusarai, Bihar',
    currentYear: new Date().getFullYear(),
    images: {
        cover: 'images/bookcover.jpg',
        author: 'images/author.jpg',
        signature: 'images/signature.jpg'
    },
    qr: {
        url: 'https://ravirajhere.github.io',
        size: 120
    },
    pdf: {
        scale: 1.5,
        quality: 0.85,
        format: 'a4',
        margin: 20,          // ✅ Improvement 2: 15 → 20
        batchSize: 2
    }
};

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
        if (!this.isShowing) this.processQueue();
    }

    processQueue() {
        if (this.queue.length === 0) {
            this.isShowing = false;
            return;
        }

        this.isShowing = true;
        const { message, type, duration } = this.queue.shift();
        
        if (!this.toast) {
            console.warn('Toast:', message);
            this.isShowing = false;
            return;
        }
        
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
        if (!this.modal) {
            console.warn('Modal not found, generating English PDF...');
            window.downloadEbook('en');
            return;
        }
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
                canvas.className = 'ebook-canvas';  // ✅ Improvement 3: Class for cleanup
                canvas.width = 600;
                canvas.height = 800;
                const ctx = canvas.getContext('2d');
                
                ctx.fillStyle = '#fdfbf5';
                ctx.fillRect(0, 0, 600, 800);
                
                ctx.strokeStyle = '#b8860b';
                ctx.lineWidth = 3;
                ctx.strokeRect(30, 30, 540, 740);
                
                ctx.fillStyle = '#1a1a1a';
                ctx.font = 'bold 32px Georgia, serif';
                ctx.textAlign = 'center';
                ctx.fillText('A BOY WHO', 300, 350);
                ctx.fillText('NEVER THOUGHT', 300, 400);
                
                ctx.fillStyle = '#b8860b';
                ctx.font = '24px Georgia, serif';
                ctx.fillText('Suraj Anand', 300, 480);
                
                resolve(canvas.toDataURL('image/jpeg', 0.9));
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
// 4. LIBRARY LOADER
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
                    // ✅ Improvement 6: CDN fail toast
                    toast.error('Internet check karo — library load nahi hui');
                    throw new Error(`Failed to load ${src}`);
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

        for (const src of libraries) {
            await this.loadScript(src);
        }
        return true;
    }
}

// ============================================================
// 5. QR CODE GENERATOR
// ============================================================
class QRGenerator {
    static async generate(data, size = 120) {
        return new Promise((resolve) => {
            try {
                if (typeof QRCode === 'undefined') { resolve(null); return; }
                
                const container = document.createElement('div');
                container.style.cssText = `width:${size}px;height:${size}px;position:absolute;left:-9999px;top:-9999px;`;
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
                const checkCanvas = setInterval(() => {
                    attempts++;
                    const canvas = container.querySelector('canvas');
                    if (canvas) {
                        canvas.className = 'ebook-canvas';  // ✅ Improvement 3
                        clearInterval(checkCanvas);
                        const dataUrl = canvas.toDataURL('image/png');
                        document.body.removeChild(container);
                        resolve(dataUrl);
                    } else if (attempts >= 10) {
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
// 6. APPLY PROFESSIONAL BOOK STYLES
// ============================================================
function applyProfessionalBookStyles(clone, isPdfMode = true) {
    clone.querySelectorAll('.chapter-content p, .chapter p').forEach(el => {
        el.style.color = '#1a1a1a';
        el.style.fontFamily = "'EB Garamond', 'Georgia', 'Times New Roman', serif";
        el.style.fontSize = '16px';
        el.style.lineHeight = '1.75';
        el.style.textAlign = 'justify';
        el.style.marginBottom = '14px';
        el.style.fontWeight = '400';
        el.style.letterSpacing = '0.2px';
        if (isPdfMode) el.style.background = 'transparent';
    });
    
    clone.querySelectorAll('.chapter-title, .chapter h2').forEach(el => {
        el.style.color = '#000000';
        el.style.fontFamily = "'Playfair Display', 'Georgia', 'Times New Roman', serif";
        el.style.fontSize = '28px';
        el.style.fontWeight = '600';
        el.style.textAlign = 'center';
        el.style.marginTop = '0';
        el.style.marginBottom = '8px';
        el.style.letterSpacing = '1.5px';
        el.style.lineHeight = '1.3';
        if (isPdfMode) el.style.background = 'transparent';
    });
    
    clone.querySelectorAll('.chapter-number').forEach(el => {
        el.style.color = '#8b6f47';
        el.style.fontFamily = "'EB Garamond', 'Georgia', serif";
        el.style.fontSize = '11px';
        el.style.fontWeight = '500';
        el.style.textAlign = 'center';
        el.style.letterSpacing = '5px';
        el.style.textTransform = 'uppercase';
        el.style.marginBottom = '10px';
        if (isPdfMode) el.style.background = 'transparent';
    });
    
    clone.querySelectorAll('.chapter-year').forEach(el => {
        el.style.color = '#6a6a6a';
        el.style.fontFamily = "'EB Garamond', 'Georgia', serif";
        el.style.fontSize = '13px';
        el.style.fontStyle = 'italic';
        el.style.textAlign = 'center';
        el.style.letterSpacing = '3px';
        el.style.marginBottom = '30px';
        if (isPdfMode) el.style.background = 'transparent';
    });
    
    clone.querySelectorAll('.chapter-header').forEach(el => {
        el.style.textAlign = 'center';
        el.style.marginBottom = '40px';
        el.style.paddingBottom = '20px';
        el.style.borderBottom = '1px solid #d4c9b0';
        if (isPdfMode) el.style.background = 'transparent';
    });
    
    clone.querySelectorAll('.chapter-content strong, .chapter strong').forEach(el => {
        el.style.color = '#000000';
        el.style.fontWeight = '700';
        if (isPdfMode) el.style.background = 'transparent';
    });
    
    clone.querySelectorAll('.chapter-content em, .chapter em').forEach(el => {
        el.style.color = '#5c4a2e';
        el.style.fontFamily = "'EB Garamond', 'Georgia', serif";
        el.style.fontSize = '17px';
        el.style.fontStyle = 'italic';
        el.style.textAlign = 'center';
        el.style.display = 'block';
        el.style.margin = '24px auto';
        el.style.padding = '14px 24px';
        el.style.borderTop = '1px solid #d4c9b0';
        el.style.borderBottom = '1px solid #d4c9b0';
        if (isPdfMode) el.style.background = 'transparent';
    });
}

// ============================================================
// 7. AUDIO (TTS) MANAGER
// ============================================================
class AudioManager {
    constructor() {
        this.synth = window.speechSynthesis;
        this.isPlaying = false;
        this.currentUtterance = null;
    }

    readChapter(chapterElement, lang = 'en') {
        if (!('speechSynthesis' in window)) {
            toast.warning('Audio not supported in this browser');
            return;
        }

        if (this.isPlaying) {
            this.stop();
            return;
        }

        const text = chapterElement.textContent.trim();
        if (!text) return;

        this.currentUtterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
        this.currentUtterance.rate = 0.9;
        this.currentUtterance.pitch = 1;
        this.currentUtterance.volume = 1;

        this.currentUtterance.onend = () => {
            this.isPlaying = false;
            toast.info('Audio finished');
        };

        this.currentUtterance.onerror = (e) => {
            this.isPlaying = false;
            console.error('TTS error:', e);
        };

        this.synth.speak(this.currentUtterance);
        this.isPlaying = true;
        toast.info('🔊 Reading aloud...');
    }

    stop() {
        if (this.synth) {
            this.synth.cancel();
            this.isPlaying = false;
            toast.info('Audio stopped');
        }
    }
}

const audioManager = new AudioManager();

// ============================================================
// 8. BOOKMARK MANAGER
// ============================================================
class BookmarkManager {
    constructor() {
        this.bookmarks = JSON.parse(localStorage.getItem('ebookBookmarks') || '[]');
    }

    toggle(chapterId, chapterTitle) {
        const idx = this.bookmarks.findIndex(b => b.id === chapterId);
        
        if (idx > -1) {
            this.bookmarks.splice(idx, 1);
            toast.info(`Removed bookmark: ${chapterTitle}`);
        } else {
            this.bookmarks.push({
                id: chapterId,
                title: chapterTitle,
                date: new Date().toISOString()
            });
            toast.success(`Bookmarked: ${chapterTitle}`);
        }
        
        localStorage.setItem('ebookBookmarks', JSON.stringify(this.bookmarks));
        this.updateBookmarkIcons();
    }

    isBookmarked(chapterId) {
        return this.bookmarks.some(b => b.id === chapterId);
    }

    updateBookmarkIcons() {
        document.querySelectorAll('.bookmark-btn').forEach(btn => {
            const chapterId = btn.getAttribute('data-chapter-id');
            if (this.isBookmarked(chapterId)) {
                btn.textContent = '🔖';
                btn.classList.add('bookmarked');
                btn.title = 'Remove bookmark';
            } else {
                btn.textContent = '☆';
                btn.classList.remove('bookmarked');
                btn.title = 'Bookmark this chapter';
            }
        });
    }

    injectButtons() {
        document.querySelectorAll('.chapter').forEach((ch, idx) => {
            const chapterId = ch.id || `chapter-${idx + 1}`;
            const titleEl = ch.querySelector('.chapter-title');
            const title = titleEl ? titleEl.textContent : `Chapter ${idx + 1}`;
            
            if (ch.querySelector('.bookmark-btn')) return;
            
            const btn = document.createElement('button');
            btn.className = 'bookmark-btn';
            btn.setAttribute('data-chapter-id', chapterId);
            btn.setAttribute('data-chapter-title', title);
            btn.textContent = '☆';
            btn.title = 'Bookmark this chapter';
            
            btn.style.cssText = `
                position: absolute;
                top: 20px;
                right: 20px;
                background: transparent;
                border: 1px solid #d4c9b0;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                font-size: 20px;
                cursor: pointer;
                color: #b8860b;
                transition: all 0.3s ease;
                z-index: 10;
            `;
            
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggle(chapterId, title);
            });
            
            const header = ch.querySelector('.chapter-header');
            if (header) {
                header.style.position = 'relative';
                header.appendChild(btn);
            }
        });
        
        this.updateBookmarkIcons();
    }
}

const bookmarkManager = new BookmarkManager();

// ============================================================
// 9. MAIN EBOOK GENERATOR
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
        this.renderContainer = null;  // ✅ Improvement 5: Reusable container
    }

    // ✅ Improvement 5: Create reusable container once
    getRenderContainer() {
        if (!this.renderContainer) {
            this.renderContainer = document.createElement('div');
            this.renderContainer.className = 'ebook-render-container';
            this.renderContainer.style.cssText = `
                position: absolute;
                left: -9999px;
                top: -9999px;
                background: #ffffff;
                padding: 0;
                margin: 0;
                pointer-events: none;
            `;
            document.body.appendChild(this.renderContainer);
        }
        return this.renderContainer;
    }

    async generate(lang, langLabel) {
        if (this.isGenerating) {
            toast.warning('Already generating, please wait');
            return;
        }

        this.isGenerating = true;
        this.cancelled = false;
        this.currentPage = 0;

        try {
            toast.info(`Preparing ${langLabel} ebook...`);
            
            this.resources = await ResourceValidator.validateAllImages();
            await LibraryLoader.loadAll();

            const content = this.getContent(lang);
            if (!content) throw new Error('Content not found');

            this.pages = await this.buildPages(content, lang);
            this.totalPages = this.pages.length;

            await this.generatePDF(langLabel);

            // ✅ PURANA METHOD — DIRECT SAVE
            const filename = `A_Boy_Who_Never_Thought_Suraj_Anand_${langLabel}.pdf`;
            this.pdf.save(filename);
            
            toast.success(`${langLabel} ebook downloaded successfully!`);
        } catch (error) {
            console.error('Ebook generation failed:', error);
            toast.error(`Failed: ${error.message}`);
        } finally {
            this.isGenerating = false;
            this.cleanup();
        }
    }

    getContent(lang) {
        const bookBody = document.querySelector('.book-body');
        if (!bookBody) {
            console.error('book-body not found');
            return null;
        }

        const chapters = bookBody.querySelectorAll('.chapter');
        if (!chapters.length) {
            console.error('No chapters found');
            return null;
        }

        return {
            wrapper: bookBody.cloneNode(true),
            chapters: chapters,
            lang: lang
        };
    }

    async buildPages(content, lang) {
        const pages = [];
        const clone = content.wrapper;

        this.cleanClone(clone);

        const cloneChapters = [];
        const originalChapters = document.querySelectorAll('.book-body .chapter');

        originalChapters.forEach((origCh, idx) => {
            const cloneCh = clone.querySelectorAll('.chapter')[idx];
            if (!cloneCh) return;

            cloneCh.querySelectorAll('[data-lang-content]').forEach(block => {
                if (block.getAttribute('data-lang-content') === lang) {
                    block.style.display = 'block';
                } else {
                    block.remove();
                }
            });

            cloneChapters.push(cloneCh);
        });

        applyProfessionalBookStyles(clone, true);

        const qrDataUrl = await QRGenerator.generate(EBOOK_CONFIG.qr.url, EBOOK_CONFIG.qr.size);
        const images = this.resources;

        const pageBuilders = [];

        pageBuilders.push(async () => this.createCoverPage(images.cover));
        pageBuilders.push(async () => this.createTitlePage());
        pageBuilders.push(async () => this.createCopyrightPage());
        pageBuilders.push(async () => this.createDedicationPage());
        pageBuilders.push(async () => this.createEpigraphPage());
        pageBuilders.push(async () => this.createPrefacePage());
        pageBuilders.push(async () => this.createAcknowledgementsPage());
        pageBuilders.push(async () => this.createTOCPage(cloneChapters));

        cloneChapters.forEach((ch, index) => {
            pageBuilders.push(async () => this.createChapterPage(ch, index, lang));
        });

        pageBuilders.push(async () => this.createConclusionPage());
        pageBuilders.push(async () => this.createAboutPage(images.author, qrDataUrl));
        pageBuilders.push(async () => this.createEmotionalPage(images.signature));
        pageBuilders.push(async () => this.createColophonPage());

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

    createCoverPage(coverImage) {
        const div = document.createElement('div');
        div.style.cssText = `padding:0;margin:0;background:#ffffff;width:100%;height:100%;display:flex;align-items:center;justify-content:center;`;
        div.innerHTML = `<img src="${coverImage}" alt="Book Cover" style="width:100%;height:100%;object-fit:contain;">`;
        return div;
    }

    createTitlePage() {
        const div = document.createElement('div');
        div.style.cssText = `padding:60px 40px;background:#ffffff;display:flex;flex-direction:column;justify-content:center;min-height:100%;text-align:center;`;
        div.innerHTML = `
            <div style="max-width:500px;margin:0 auto;width:100%;">
                <div style="width:80px;height:2px;background:#b8860b;margin:0 auto 30px auto;"></div>
                <p style="font-size:12px;color:#8b6f47;font-family:'EB Garamond',Georgia,serif;letter-spacing:5px;margin-bottom:20px;">AN AUTOBIOGRAPHY</p>
                <h1 style="font-size:38px;font-weight:600;color:#000000;font-family:'Playfair Display','Georgia','Times New Roman',serif;margin-bottom:8px;letter-spacing:1.5px;line-height:1.2;">${EBOOK_CONFIG.title}</h1>
                <p style="font-size:16px;color:#8b6f47;font-family:'EB Garamond',Georgia,serif;margin:15px 0;font-style:italic;">${EBOOK_CONFIG.subtitle}</p>
                <div style="width:80px;height:2px;background:#b8860b;margin:30px auto;"></div>
                <p style="font-size:28px;color:#b8860b;font-family:'Playfair Display','Georgia','Times New Roman',serif;margin:10px 0;font-weight:500;">${EBOOK_CONFIG.author}</p>
                <p style="font-size:13px;color:#6a6a6a;font-family:'EB Garamond',Georgia,serif;letter-spacing:3px;">A.K.A ${EBOOK_CONFIG.aka}</p>
                <div style="width:80px;height:2px;background:#b8860b;margin:30px auto;"></div>
                <p style="font-size:14px;color:#999;font-family:'EB Garamond',Georgia,serif;">${EBOOK_CONFIG.currentYear}</p>
            </div>
        `;
        return div;
    }

    createCopyrightPage() {
        const div = document.createElement('div');
        div.style.cssText = `padding:60px 40px;background:#ffffff;display:flex;flex-direction:column;justify-content:center;min-height:100%;`;
        div.innerHTML = `
            <div style="max-width:450px;margin:0 auto;width:100%;">
                <h2 style="font-size:14px;font-weight:700;color:#000000;font-family:'Playfair Display',Georgia,serif;letter-spacing:2px;margin-bottom:20px;">COPYRIGHT</h2>
                <p style="font-size:13px;line-height:1.8;color:#333;font-family:'EB Garamond',Georgia,serif;margin-bottom:16px;">© ${EBOOK_CONFIG.currentYear} ${EBOOK_CONFIG.author}<br>All rights reserved.</p>
                <p style="font-size:13px;line-height:1.8;color:#333;font-family:'EB Garamond',Georgia,serif;margin-bottom:16px;">No part of this book may be reproduced, stored in a retrieval system, or transmitted in any form or by any means, without the prior written permission of the author.</p>
                <p style="font-size:13px;line-height:1.8;color:#333;font-family:'EB Garamond',Georgia,serif;margin-bottom:16px;"><strong>Published by</strong><br>${EBOOK_CONFIG.author.toUpperCase()} PUBLICATION<br>${EBOOK_CONFIG.birthplace}</p>
                <p style="font-size:13px;line-height:1.8;color:#333;font-family:'EB Garamond',Georgia,serif;margin-bottom:16px;">This book is not for sale.<br>For personal use only.</p>
                <p style="font-size:13px;line-height:1.8;color:#333;font-family:'EB Garamond',Georgia,serif;margin-bottom:8px;">ISBN: 2026-9102224871</p>
                <p style="font-size:13px;line-height:1.8;color:#333;font-family:'EB Garamond',Georgia,serif;margin-bottom:16px;">(India · Memoir · Autobiography)</p>
                <p style="font-size:13px;line-height:1.8;color:#333;font-family:'EB Garamond',Georgia,serif;margin-bottom:4px;">First Edition: ${EBOOK_CONFIG.currentYear}</p>
                <p style="font-size:13px;line-height:1.8;color:#333;font-family:'EB Garamond',Georgia,serif;">Published on 26th March ${EBOOK_CONFIG.currentYear}</p>
            </div>
        `;
        return div;
    }

    createDedicationPage() {
        const div = document.createElement('div');
        div.style.cssText = `padding:60px 40px;background:#ffffff;display:flex;flex-direction:column;justify-content:center;min-height:100%;text-align:center;`;
        div.innerHTML = `
            <div style="max-width:500px;margin:0 auto;width:100%;">
                <p style="font-size:19px;font-weight:400;color:#1a1a1a;font-family:'EB Garamond',Georgia,serif;line-height:2;font-style:italic;">To my parents, who gave me the courage to dream.</p>
                <p style="font-size:19px;font-weight:400;color:#1a1a1a;font-family:'EB Garamond',Georgia,serif;line-height:2;font-style:italic;">To my siblings, who taught me patience and love.</p>
                <p style="font-size:19px;font-weight:400;color:#1a1a1a;font-family:'EB Garamond',Georgia,serif;line-height:2;font-style:italic;">To my friends, who never let me feel alone.</p>
                <div style="width:60px;height:2px;background:#b8860b;margin:30px auto;"></div>
                <p style="font-size:17px;color:#b8860b;font-family:'Playfair Display',Georgia,serif;">— ${EBOOK_CONFIG.author}</p>
            </div>
        `;
        return div;
    }

    createEpigraphPage() {
        const div = document.createElement('div');
        div.style.cssText = `padding:60px 40px;background:#ffffff;display:flex;flex-direction:column;justify-content:center;min-height:100%;text-align:center;`;
        div.innerHTML = `
            <div style="max-width:550px;margin:0 auto;width:100%;">
                <div style="width:60px;height:2px;background:#b8860b;margin:0 auto 30px auto;"></div>
                <p style="font-size:19px;font-weight:400;color:#1a1a1a;font-family:'EB Garamond',Georgia,serif;line-height:1.8;font-style:italic;margin-bottom:16px;">"Safar se safar tak — गुंजते सन्नाटे"</p>
                <p style="font-size:15px;color:#b8860b;font-family:'Playfair Display',Georgia,serif;">— ${EBOOK_CONFIG.author}</p>
                <div style="width:60px;height:2px;background:#b8860b;margin:30px auto 0 auto;"></div>
            </div>
        `;
        return div;
    }

    createPrefacePage() {
        const div = document.createElement('div');
        div.style.cssText = `padding:60px 40px;background:#ffffff;display:flex;flex-direction:column;justify-content:center;min-height:100%;`;
        div.innerHTML = `
            <div style="max-width:550px;margin:0 auto;width:100%;">
                <h2 style="font-size:26px;font-weight:600;color:#000000;font-family:'Playfair Display',Georgia,serif;margin-bottom:20px;letter-spacing:1.5px;">Preface</h2>
                <p style="font-size:16px;line-height:1.75;color:#1a1a1a;font-family:'EB Garamond',Georgia,serif;text-align:justify;margin-bottom:16px;">This book is a collection of my memories, thoughts, and experiences from my journey so far. I wrote this to share my story with the world — and to inspire others to chase their dreams, no matter where they start.</p>
                <p style="font-size:16px;line-height:1.75;color:#1a1a1a;font-family:'EB Garamond',Georgia,serif;text-align:justify;margin-bottom:16px;">Life is a beautiful journey, and every chapter of this book is a piece of my heart. I hope you enjoy reading it as much as I enjoyed writing it.</p>
                <div style="width:60px;height:2px;background:#b8860b;margin:20px 0;"></div>
                <p style="font-size:16px;color:#b8860b;font-family:'Playfair Display',Georgia,serif;">— ${EBOOK_CONFIG.author}</p>
            </div>
        `;
        return div;
    }

    createAcknowledgementsPage() {
        const div = document.createElement('div');
        div.style.cssText = `padding:60px 40px;background:#ffffff;display:flex;flex-direction:column;justify-content:center;min-height:100%;`;
        div.innerHTML = `
            <div style="max-width:550px;margin:0 auto;width:100%;">
                <h2 style="font-size:26px;font-weight:600;color:#000000;font-family:'Playfair Display',Georgia,serif;margin-bottom:20px;letter-spacing:1.5px;">Acknowledgements</h2>
                <p style="font-size:16px;line-height:1.75;color:#1a1a1a;font-family:'EB Garamond',Georgia,serif;text-align:justify;margin-bottom:16px;">First and foremost, I would like to thank my parents — especially my Mummy, whose strength and sacrifice taught me what it means to never give up.</p>
                <p style="font-size:16px;line-height:1.75;color:#1a1a1a;font-family:'EB Garamond',Georgia,serif;text-align:justify;margin-bottom:16px;">I am also grateful to my teachers — especially Ujjwal Sir, who made me fall in love with Maths.</p>
                <p style="font-size:16px;line-height:1.75;color:#1a1a1a;font-family:'EB Garamond',Georgia,serif;text-align:justify;margin-bottom:16px;">A special thanks to my friends who stood by me through thick and thin.</p>
                <p style="font-size:16px;line-height:1.75;color:#1a1a1a;font-family:'EB Garamond',Georgia,serif;text-align:justify;">And to everyone who believed in me when I didn't believe in myself.</p>
                <div style="width:60px;height:2px;background:#b8860b;margin:20px 0;"></div>
                <p style="font-size:16px;color:#b8860b;font-family:'Playfair Display',Georgia,serif;">— ${EBOOK_CONFIG.author}</p>
            </div>
        `;
        return div;
    }

    createTOCPage(chapters) {
        const div = document.createElement('div');
        div.style.cssText = `padding:60px 40px;background:#ffffff;display:flex;flex-direction:column;justify-content:center;min-height:100%;`;
        
        let tocHTML = `<h2 style="font-size:26px;font-weight:600;color:#000000;text-align:center;font-family:'Playfair Display',Georgia,serif;margin-bottom:30px;letter-spacing:2px;">Table of Contents</h2>
            <ul style="list-style:none;padding:0;font-family:'EB Garamond',Georgia,serif;font-size:16px;line-height:2.4;max-width:550px;margin:0 auto;width:100%;">`;
        
        let pageNum = 10;
        chapters.forEach((ch, idx) => {
            const h2 = ch.querySelector('.chapter-title, h2');
            const chNum = ch.querySelector('.chapter-number');
            let title = h2 ? h2.textContent.trim() : `Chapter ${idx+1}`;
            let numLabel = chNum ? chNum.textContent.trim() : `CHAPTER ${idx+1}`;
            if (idx === chapters.length - 1 && title.toLowerCase().includes('continued')) {
                numLabel = 'EPILOGUE';
            }
            tocHTML += `
                <li style="border-bottom:1px solid #f0f0f0;padding:6px 0;display:flex;justify-content:space-between;">
                    <span style="color:#1a1a1a;font-family:'EB Garamond',Georgia,serif;font-size:15px;">${numLabel}: ${title}</span>
                    <span style="color:#999;font-family:'Playfair Display',Georgia,serif;font-size:14px;">${pageNum + idx}</span>
                </li>
            `;
        });
        tocHTML += `</ul>`;
        div.innerHTML = tocHTML;
        return div;
    }

    createChapterPage(chapter, index, lang) {
        const div = document.createElement('div');
        div.style.cssText = `padding:50px 50px 40px 50px;background:#ffffff;display:flex;flex-direction:column;min-height:100%;position:relative;`;
        
        const clone = chapter.cloneNode(true);
        
        // Remove bookmark button from PDF
        clone.querySelectorAll('.bookmark-btn').forEach(b => b.remove());
        
        const firstP = clone.querySelector('.chapter-content p');
        if (firstP && firstP.textContent.trim().length > 0) {
            const text = firstP.textContent;
            const firstChar = text.charAt(0);
            const restText = text.slice(1);
            firstP.innerHTML = `<span style="font-family:'Playfair Display',Georgia,serif;font-size:44px;font-weight:600;color:#b8860b;float:left;line-height:1;margin-right:6px;margin-top:2px;">${firstChar}</span>${restText}`;
        }
        
        const heading = clone.querySelector('.chapter-title, h2');
        if (heading) {
            const quotes = [
                '"Every ending is a new beginning." — Unknown',
                '"Childhood is the most beautiful of all life\'s seasons." — Unknown',
                '"The greatest glory in living lies not in never falling, but in rising every time we fall." — Nelson Mandela',
                '"In the middle of difficulty lies opportunity." — Albert Einstein',
                '"Success is not final, failure is not fatal: it is the courage to continue that counts." — Winston Churchill',
                '"The only way to do great work is to love what you do." — Steve Jobs',
                '"Life is what happens when you\'re busy making other plans." — John Lennon',
                '"The future belongs to those who believe in the beauty of their dreams." — Eleanor Roosevelt',
                '"Believe you can and you\'re halfway there." — Theodore Roosevelt',
                '"To live is the rarest thing in the world. Most people exist, that is all." — Oscar Wilde'
            ];
            
            const quote = quotes[index % quotes.length];
            const quoteDiv = document.createElement('div');
            quoteDiv.style.cssText = `font-family:'EB Garamond',Georgia,serif;font-size:14px;font-style:italic;color:#b8860b;text-align:center;margin:6px 0 24px 0;`;
            quoteDiv.textContent = quote;
            
            const header = clone.querySelector('.chapter-header');
            if (header) {
                header.appendChild(quoteDiv);
            }
        }
        
        const paragraphs = clone.querySelectorAll('.chapter-content p');
        if (paragraphs.length > 4) {
            const midPoint = Math.floor(paragraphs.length / 2);
            const targetP = paragraphs[midPoint];
            if (targetP) {
                const breakDiv = document.createElement('div');
                breakDiv.style.cssText = `font-family:'Playfair Display',Georgia,serif;font-size:14px;color:#b8860b;text-align:center;letter-spacing:4px;margin:16px 0;`;
                breakDiv.textContent = '✦ ✦ ✦';
                targetP.parentNode.insertBefore(breakDiv, targetP);
            }
        }

        // ✅ PAGE NUMBER
        const pageNumDiv = document.createElement('div');
        pageNumDiv.style.cssText = `position:absolute;bottom:20px;right:50px;font-family:'EB Garamond',Georgia,serif;font-size:12px;color:#999;letter-spacing:2px;`;
        pageNumDiv.textContent = `${index + 10}`;
        clone.appendChild(pageNumDiv);
        
        div.appendChild(clone);
        return div;
    }

    createConclusionPage() {
        const div = document.createElement('div');
        div.style.cssText = `padding:60px 40px;background:#ffffff;display:flex;flex-direction:column;justify-content:center;min-height:100%;`;
        div.innerHTML = `
            <div style="max-width:550px;margin:0 auto;width:100%;">
                <h2 style="font-size:26px;font-weight:600;color:#000000;font-family:'Playfair Display',Georgia,serif;margin-bottom:20px;letter-spacing:1.5px;">Conclusion</h2>
                <p style="font-size:16px;line-height:1.75;color:#1a1a1a;font-family:'EB Garamond',Georgia,serif;text-align:justify;margin-bottom:16px;">As I look back on my journey, I realize that life is not about where you start, but about how far you are willing to go.</p>
                <p style="font-size:16px;line-height:1.75;color:#1a1a1a;font-family:'EB Garamond',Georgia,serif;text-align:justify;margin-bottom:16px;">Every struggle made me stronger. Every failure taught me something new. Every success reminded me why I started.</p>
                <p style="font-size:16px;line-height:1.75;color:#1a1a1a;font-family:'EB Garamond',Georgia,serif;text-align:justify;margin-bottom:16px;">This is not the end of my story. It is just the beginning.</p>
                <p style="font-size:16px;line-height:1.75;color:#1a1a1a;font-family:'EB Garamond',Georgia,serif;text-align:justify;">The best is yet to come.</p>
                <div style="width:60px;height:2px;background:#b8860b;margin:20px 0;"></div>
                <p style="font-size:16px;color:#b8860b;font-family:'Playfair Display',Georgia,serif;">— ${EBOOK_CONFIG.author}</p>
            </div>
        `;
        return div;
    }

    createAboutPage(authorImage, qrDataUrl) {
        const div = document.createElement('div');
        div.style.cssText = `padding:60px 40px;background:#ffffff;display:flex;flex-direction:column;justify-content:center;min-height:100%;text-align:center;`;
        
        // ✅ Improvement 4: QR fail safe
        const qrHTML = qrDataUrl ? `
            <div style="margin:14px auto 0 auto;">
                <img src="${qrDataUrl}" alt="QR Code" style="width:120px;height:120px;display:block;margin:0 auto;border:2px solid #b8860b;border-radius:8px;padding:4px;">
                <p style="font-size:10px;color:#999;font-family:'EB Garamond',Georgia,serif;margin-top:4px;">Scan to visit my website</p>
            </div>
        ` : '';
        
        div.innerHTML = `
            <div style="max-width:550px;margin:0 auto;width:100%;">
                <h2 style="font-size:26px;font-weight:600;color:#000000;font-family:'Playfair Display',Georgia,serif;margin-bottom:20px;letter-spacing:1.5px;">About the Author</h2>
                <div style="width:130px;height:130px;border-radius:50%;border:3px solid #b8860b;margin:0 auto 16px;overflow:hidden;">
                    <img src="${authorImage}" alt="${EBOOK_CONFIG.author}" style="width:100%;height:100%;object-fit:cover;">
                </div>
                <p style="font-size:24px;font-weight:600;color:#000000;font-family:'Playfair Display',Georgia,serif;margin:4px 0;">${EBOOK_CONFIG.author}</p>
                <p style="font-size:13px;color:#8b6f47;font-family:'EB Garamond',Georgia,serif;margin-bottom:16px;letter-spacing:3px;">A.K.A ${EBOOK_CONFIG.aka}</p>
                <div style="max-width:500px;margin:0 auto;">
                    <p style="font-size:16px;line-height:1.75;color:#1a1a1a;font-family:'EB Garamond',Georgia,serif;text-align:justify;">${EBOOK_CONFIG.author} was born on 26 March ${EBOOK_CONFIG.birthYear} in ${EBOOK_CONFIG.birthplace}. A young dreamer who discovered his voice through words, he wrote this autobiography to share his journey — from his earliest memories to his days in 5th Class. He dreams of becoming an engineer and continues to write his story, one page at a time.</p>
                </div>
                <div style="width:60px;height:2px;background:#b8860b;margin:16px auto;"></div>
                <p style="font-size:16px;font-style:italic;color:#8b6f47;font-family:'EB Garamond',Georgia,serif;">"A Boy Who Never Thought"</p>
                
                <div style="width:60px;height:2px;background:#b8860b;margin:16px auto;"></div>
                <div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:4px;">
                    <span style="background:#f5f5f5;padding:4px 14px;border-radius:20px;font-size:12px;color:#333;font-family:'EB Garamond',Georgia,serif;">📖 Writer</span>
                    <span style="background:#f5f5f5;padding:4px 14px;border-radius:20px;font-size:12px;color:#333;font-family:'EB Garamond',Georgia,serif;">🎯 Dreamer</span>
                    <span style="background:#f5f5f5;padding:4px 14px;border-radius:20px;font-size:12px;color:#333;font-family:'EB Garamond',Georgia,serif;">⚙️ Future Engineer</span>
                </div>
                
                ${qrHTML}
            </div>
        `;
        return div;
    }

    createEmotionalPage(signatureImage) {
        const div = document.createElement('div');
        div.style.cssText = `padding:60px 40px;background:#fdfbf5;display:flex;flex-direction:column;justify-content:center;min-height:100%;text-align:center;`;
        div.innerHTML = `
            <div style="max-width:500px;margin:0 auto;width:100%;">
                <div style="font-size:44px;margin-bottom:20px;">❤️</div>
                <p style="font-size:19px;font-weight:400;color:#1a1a1a;font-family:'EB Garamond',Georgia,serif;line-height:1.8;font-style:italic;">"Thank you for reading my story. Every chapter of this book is a piece of my heart. I hope my journey inspires you to chase your own dreams."</p>
                <div style="margin:24px auto 10px auto;max-width:200px;">
                    <img src="${signatureImage}" alt="${EBOOK_CONFIG.author} Signature" style="width:100%;height:auto;display:block;" onerror="this.style.display='none'">
                </div>
                <p style="font-size:17px;color:#b8860b;margin:6px 0 12px 0;font-family:'Playfair Display',Georgia,serif;">— ${EBOOK_CONFIG.author}</p>
                <div style="width:60px;height:2px;background:#b8860b;margin:16px auto;"></div>
                <p style="font-size:14px;color:#666;font-family:'EB Garamond',Georgia,serif;">With love & gratitude ❤️</p>
                <p style="font-size:13px;color:#999;margin-top:6px;font-family:'EB Garamond',Georgia,serif;">${EBOOK_CONFIG.author} · ${EBOOK_CONFIG.currentYear}</p>
                <p style="font-size:13px;color:#aaa;margin-top:4px;font-family:'EB Garamond',Georgia,serif;">📖 From ${EBOOK_CONFIG.birthplace} to the World</p>
            </div>
        `;
        return div;
    }

    createColophonPage() {
        const div = document.createElement('div');
        div.style.cssText = `padding:60px 40px;background:#ffffff;display:flex;flex-direction:column;justify-content:center;min-height:100%;text-align:center;`;
        div.innerHTML = `
            <div style="max-width:450px;margin:0 auto;width:100%;">
                <div style="width:60px;height:2px;background:#b8860b;margin:0 auto 30px auto;"></div>
                <p style="font-size:14px;font-weight:400;color:#1a1a1a;font-family:'EB Garamond',Georgia,serif;line-height:2;margin-bottom:8px;">This book was written with love,</p>
                <p style="font-size:14px;font-weight:400;color:#1a1a1a;font-family:'EB Garamond',Georgia,serif;line-height:2;margin-bottom:8px;">Designed in Begusarai, Bihar,</p>
                <p style="font-size:14px;font-weight:400;color:#1a1a1a;font-family:'EB Garamond',Georgia,serif;line-height:2;margin-bottom:20px;">Printed in India, ${EBOOK_CONFIG.currentYear}</p>
                <div style="width:60px;height:2px;background:#b8860b;margin:0 auto 20px auto;"></div>
                <p style="font-size:12px;color:#999;font-family:'EB Garamond',Georgia,serif;line-height:1.8;">Fonts: EB Garamond · Playfair Display</p>
                <p style="font-size:12px;color:#999;font-family:'EB Garamond',Georgia,serif;line-height:1.8;">Paper: Premium Offset</p>
                <p style="font-size:12px;color:#999;font-family:'EB Garamond',Georgia,serif;line-height:1.8;">Cover: Matte Finish</p>
                <div style="width:60px;height:2px;background:#b8860b;margin:20px auto;"></div>
                <p style="font-size:11px;color:#aaa;font-family:'EB Garamond',Georgia,serif;font-style:italic;">"A story from the heart"</p>
                <p style="font-size:11px;color:#aaa;font-family:'EB Garamond',Georgia,serif;font-style:italic;margin-top:8px;">Safar se safar tak — गुंजते सन्नाटे</p>
                <p style="font-size:11px;color:#aaa;font-family:'EB Garamond',Georgia,serif;font-style:italic;margin-top:12px;">Made with ❤️</p>
            </div>
        `;
        return div;
    }

    cleanClone(clone) {
        const removeSelectors = [
            '.lang-toggle', '.cover-actions', '.cover-scroll',
            '.toast', '.modal-overlay', '.lightbox',
            '.gallery-section', '.timeline-section', '.specials-section',
            '.download-section', '.book-footer', '.bookmark-btn',
            '.audio-btn',
            '.progress-bar-wrapper', '.progress-text'
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
            keywords: 'autobiography, memoir, Suraj Anand, A Boy Who Never Thought',
            creator: `${EBOOK_CONFIG.author} Publishing`
        });

        const pageWidth = 210;
        const pageHeight = 297;
        const margin = config.margin;
        const contentWidth = pageWidth - (margin * 2);
        const contentHeight = pageHeight - (margin * 2);

        let isFirstPage = true;
        const batchSize = config.batchSize || 2;

        for (let i = 0; i < this.pages.length; i += batchSize) {
            if (this.cancelled) break;

            const batch = this.pages.slice(i, i + batchSize);
            const batchPromises = batch.map((page) => this.renderPage(page, contentWidth, contentHeight));
            const results = await Promise.all(batchPromises);
            
            for (const result of results) {
                if (result) {
                    if (!isFirstPage) this.pdf.addPage();
                    isFirstPage = false;
                    this.pdf.addImage(result, 'JPEG', margin, margin, contentWidth, contentHeight, undefined, 'FAST');
                }
            }

            const progress = Math.min(100, Math.round(((i + batch.length) / this.pages.length) * 100));
            this.updateProgress(progress);
            await new Promise(r => setTimeout(r, 50));
        }
    }

    // ✅ Improvement 5: Reusable container
    async renderPage(element, width, height) {
        try {
            const container = this.getRenderContainer();
            
            // Clear previous content
            container.innerHTML = '';
            container.style.width = `${width}mm`;

            const clone = element.cloneNode(true);
            clone.style.width = '100%';
            clone.style.height = '100%';
            clone.style.background = '#ffffff';
            container.appendChild(clone);

            await new Promise(r => setTimeout(r, 50));

            const canvas = await html2canvas(container, {
                scale: EBOOK_CONFIG.pdf.scale,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                width: width * 3.78,
                height: height * 3.78
            });

            if (canvas) {
                canvas.className = 'ebook-canvas';  // ✅ Improvement 3
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
        const progressContainer = document.querySelector('.progress-container');
        
        const val = Math.min(100, percent || Math.round((this.currentPage / this.totalPages) * 100));
        
        if (progressBar) {
            progressBar.style.width = val + '%';
        }
        if (progressText) {
            progressText.textContent = val + '%';
        }
        if (progressContainer && this.isGenerating) {
            progressContainer.style.display = 'block';
        } else if (progressContainer && !this.isGenerating) {
            progressContainer.style.display = 'none';
        }
    }

    // ✅ Improvement 1 + 3: window.gc() removed, only ebook-canvas removed
    cleanup() {
        // Remove reusable render container
        if (this.renderContainer && this.renderContainer.parentNode) {
            this.renderContainer.parentNode.removeChild(this.renderContainer);
            this.renderContainer = null;
        }
        
        // Remove only ebook-canvas (not all canvas)
        document.querySelectorAll('.ebook-canvas').forEach(el => {
            el.remove();
        });
        
        this.pages = [];
        this.pdf = null;
    }

    cancel() {
        this.cancelled = true;
        this.isGenerating = false;
        toast.warning('Generation cancelled');
        this.cleanup();
    }
}

// ============================================================
// 10. EXPOSE FUNCTIONS
// ============================================================
const ebookGenerator = new EbookGenerator();

window.downloadEbook = async function(lang) {
    const label = lang === 'hi' ? 'Hinglish' : 'English';
    await ebookGenerator.generate(lang, label);
};

window.downloadEnglishEbook = async function() {
    await ebookGenerator.generate('en', 'English');
};

window.downloadHinglishEbook = async function() {
    await ebookGenerator.generate('hi', 'Hinglish');
};

window.cancelEbookGeneration = function() {
    ebookGenerator.cancel();
};

window.closeDownloadModal = function() {
    modal.close();
};

window.readChapterAloud = function(chapterElement, lang) {
    audioManager.readChapter(chapterElement, lang);
};

window.stopAudio = function() {
    audioManager.stop();
};

// ============================================================
// 11. CONNECT DOWNLOAD BUTTONS
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const downloadButtons = document.querySelectorAll('#downloadBtn, #downloadBtnBottom');
    
    downloadButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.open();
        });
    });

    const modalEn = document.getElementById('modalDownloadEn');
    const modalHi = document.getElementById('modalDownloadHi');
    
    if (modalEn) {
        modalEn.addEventListener('click', () => {
            modal.close();
            window.downloadEbook('en');
        });
    }
    
    if (modalHi) {
        modalHi.addEventListener('click', () => {
            modal.close();
            window.downloadEbook('hi');
        });
    }

    bookmarkManager.injectButtons();

    document.querySelectorAll('.chapter').forEach((ch, idx) => {
        const header = ch.querySelector('.chapter-header');
        if (!header || header.querySelector('.audio-btn')) return;

        const audioBtn = document.createElement('button');
        audioBtn.className = 'audio-btn';
        audioBtn.textContent = '🔊';
        audioBtn.title = 'Read aloud';
        
        audioBtn.style.cssText = `
            position: absolute;
            top: 20px;
            left: 20px;
            background: transparent;
            border: 1px solid #d4c9b0;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 18px;
            cursor: pointer;
            color: #b8860b;
            transition: all 0.3s ease;
            z-index: 10;
        `;

        audioBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const lang = document.documentElement.lang === 'hi' ? 'hi' : 'en';
            audioManager.readChapter(ch, lang);
        });

        header.style.position = 'relative';
        header.appendChild(audioBtn);
    });
});

// ============================================================
// 12. KEYBOARD SHORTCUTS
// ============================================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (modal.isOpen) modal.close();
        if (ebookGenerator.isGenerating) ebookGenerator.cancel();
        if (audioManager.isPlaying) audioManager.stop();
    }
});

// ============================================================
// 13. PROGRESS INDICATOR SETUP
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const progressContainer = document.querySelector('.progress-container');
    if (progressContainer) {
        progressContainer.innerHTML = `
            <div class="progress-bar-wrapper" style="width:100%;background:#f0f0f0;border-radius:8px;overflow:hidden;height:8px;">
                <div class="progress-bar" style="width:0%;height:100%;background:#b8860b;transition:width 0.3s ease;"></div>
            </div>
            <p class="progress-text" style="text-align:center;font-size:14px;color:#666;margin-top:6px;">0%</p>
        `;
        progressContainer.style.display = 'none';
    }
});

// ============================================================
// 14. INIT
// ============================================================
console.log('%c📖 Ebook Generator Loaded', 'font-size: 16px; color: #b8860b; font-weight: bold;');
console.log('%cSuraj Anand — A Boy Who Never Thought', 'font-size: 13px; color: #8b6f47; font-style: italic;');
console.log('💡 Features: Download, Bookmark, Read Aloud');
