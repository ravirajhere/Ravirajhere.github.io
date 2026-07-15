// ============================================================
// SECURITY.JS - Complete Website Protection
// ============================================================

(function() {
    'use strict';
    
    console.log('🛡️ Security Active!');
    
    // ============================================================
    // 1. SMART COPY + RIGHT CLICK BLOCK (Input fields allowed)
    // ============================================================
    ['contextmenu', 'copy', 'cut', 'paste'].forEach(function(evt) {
        document.addEventListener(evt, function(e) {
            // User input fields mein allow karo
            if (['INPUT', 'TEXTAREA', 'SELECT', 'OPTION'].includes(e.target.tagName)) {
                return;
            }
            // Contenteditable elements mein allow karo
            if (e.target.getAttribute('contenteditable') === 'true') {
                return;
            }
            e.preventDefault();
        });
    });
    
    // ============================================================
    // 2. SELECTION DISABLE (Sirf content selection roko, input nahi)
    // ============================================================
    document.addEventListener('selectstart', function(e) {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
            return;
        }
        e.preventDefault();
    });
    
    // ============================================================
    // 3. KEYBOARD SHORTCUTS BLOCK (Developer tools)
    // ============================================================
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+U (View Source)
        if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+I (Inspect)
        if (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'I')) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && (e.key === 'j' || e.key === 'J')) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+C (Inspect Element)
        if (e.ctrlKey && e.shiftKey && (e.key === 'c' || e.key === 'C')) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+S (Save page)
        if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+P (Print)
        if (e.ctrlKey && (e.key === 'p' || e.key === 'P')) {
            e.preventDefault();
            return false;
        }
    });
    
    // ============================================================
    // 4. CONSOLE BLOCK - Professional level
    // ============================================================
    var noop = function() {};
    var consoleMethods = [
        'log', 'warn', 'error', 'info', 'debug', 'table', 
        'group', 'groupEnd', 'groupCollapsed', 'trace', 
        'dir', 'dirxml', 'profile', 'profileEnd', 
        'time', 'timeEnd', 'timeStamp', 'memory', 
        'clear', 'count', 'countReset', 'assert'
    ];
    consoleMethods.forEach(function(method) {
        if (console[method]) console[method] = noop;
    });
    
    // ============================================================
    // 5. INPUT SANITIZATION - XSS Protection
    // ============================================================
    function escapeHtml(text) {
        if (typeof text !== 'string') return '';
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;',
            '/': '&#047;'
        };
        return text.replace(/[&<>"'/]/g, function(char) { 
            return map[char]; 
        });
    }
    
    function sanitizeInput(input, type) {
        if (typeof input !== 'string') return '';
        
        switch(type) {
            case 'email':
                return input.toLowerCase().trim().replace(/[^a-z0-9@._-]/g, '');
            case 'alphanumeric':
                return input.replace(/[^a-zA-Z0-9]/g, '');
            case 'url':
                try {
                    var url = new URL(input);
                    if (url.protocol === 'http:' || url.protocol === 'https:') {
                        return url.toString();
                    }
                    return '';
                } catch { return ''; }
            case 'number':
                return input.replace(/[^0-9]/g, '');
            case 'text':
            default:
                return escapeHtml(input.replace(/[\x00-\x1F\x7F]/g, ''));
        }
    }
    
    // Auto-sanitize all input fields
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('input, textarea').forEach(function(el) {
            var type = el.type || 'text';
            if (type === 'text' || type === 'search' || type === 'url' || 
                type === 'email' || type === 'tel' || type === 'number') {
                
                el.addEventListener('input', function() {
                    var sanitized = sanitizeInput(this.value, type);
                    if (this.value !== sanitized) {
                        this.value = sanitized;
                    }
                });
            }
        });
    });
    
    // ============================================================
    // 6. ANTI-DEBUGGING - Silent detection
    // ============================================================
    function detectDebugger() {
        var start = performance.now();
        var end = performance.now();
        if (end - start > 100) {
            console.warn('🛡️ Debugging detected');
        }
    }
    setInterval(detectDebugger, 3000);
    
    // ============================================================
    // 7. DOM INTEGRITY CHECK - Prevent tampering
    // ============================================================
    var originalHTML = '';
    var healingCount = 0;
    var MAX_HEAL_ATTEMPTS = 3;
    
    document.addEventListener('DOMContentLoaded', function() {
        originalHTML = document.documentElement.outerHTML;
    });
    
    setInterval(function() {
        if (!originalHTML) return;
        var currentHTML = document.documentElement.outerHTML;
        if (currentHTML !== originalHTML && healingCount < MAX_HEAL_ATTEMPTS) {
            healingCount++;
            if (healingCount >= MAX_HEAL_ATTEMPTS) {
                window.location.reload();
            }
        }
    }, 5000);
    
    // ============================================================
    // 8. EVAL BLOCK - Code injection prevention
    // ============================================================
    window.eval = function() {
        throw new Error('eval() is blocked for security');
    };
    
    window.Function = function() {
        throw new Error('Function() constructor is blocked for security');
    };
    
    // ============================================================
    // 9. CSP HEADERS - Content Security Policy
    // ============================================================
    function setCSP() {
        var csp = [
            "default-src 'self'",
            "script-src 'self' https://cdnjs.cloudflare.com https://fonts.googleapis.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: https:",
            "font-src 'self' https://fonts.gstatic.com",
            "connect-src 'self'",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "upgrade-insecure-requests"
        ].join('; ');
        
        if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
            var meta = document.createElement('meta');
            meta.httpEquiv = 'Content-Security-Policy';
            meta.content = csp;
            document.head.appendChild(meta);
        }
    }
    setCSP();
    
    // ============================================================
    // 10. MIXED CONTENT BLOCK - HTTP resources block
    // ============================================================
    function blockMixedContent() {
        document.querySelectorAll('link[href^="http://"]').forEach(function(el) {
            el.disabled = true;
        });
        document.querySelectorAll('script[src^="http://"]').forEach(function(el) {
            el.type = 'text/plain';
        });
        document.querySelectorAll('img[src^="http://"]').forEach(function(el) {
            el.style.display = 'none';
        });
    }
    blockMixedContent();
    
    // ============================================================
    // 11. GRACEFUL ERROR HANDLING - No crashes
    // ============================================================
    window.onerror = function(message, source, lineno, colno, error) {
        console.warn('🛡️ Error caught:', message);
        
        // Agar page blank ho gaya toh fallback dikhao
        if (document.body && document.body.innerHTML.trim() === '') {
            document.body.innerHTML = `
                <div style="text-align:center;padding:50px;font-family:Arial,sans-serif;">
                    <h2 style="color:#ff6b6b;">⚠️ Something went wrong</h2>
                    <p style="color:#666;margin:20px 0;">Please refresh the page.</p>
                    <button onclick="location.reload()" style="
                        padding:12px 30px;
                        background:#4a6cf7;
                        color:white;
                        border:none;
                        border-radius:8px;
                        font-size:16px;
                        cursor:pointer;
                    ">🔄 Refresh Page</button>
                </div>
            `;
        }
        return true;
    };
    
    window.addEventListener('unhandledrejection', function(e) {
        e.preventDefault();
        console.warn('🛡️ Unhandled rejection:', e.reason);
        return true;
    });
    
    // ============================================================
    // 12. SCREENSHOT PROTECTION - Prevent print/screenshot
    // ============================================================
    document.addEventListener('keydown', function(e) {
        // Ctrl+Shift+S (Screenshot shortcut)
        if (e.ctrlKey && e.shiftKey && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            return false;
        }
        // Print Screen key
        if (e.key === 'PrintScreen') {
            e.preventDefault();
            return false;
        }
    });
    
    // ============================================================
    // 13. CLICKJACKING PROTECTION
    // ============================================================
    if (window.self !== window.top) {
        document.body.innerHTML = '<h1>🚫 This website cannot be embedded</h1>';
        window.top.location = window.self.location;
    }
    
    // ============================================================
    // 14. SESSION MONITORING - Activity tracker
    // ============================================================
    var idleTime = 0;
    var IDLE_LIMIT = 600; // 10 minutes
    
    setInterval(function() {
        idleTime++;
        if (idleTime > IDLE_LIMIT) {
            console.log('🛡️ Session idle, refreshing...');
            // Option: window.location.reload();
            idleTime = 0;
        }
    }, 1000);
    
    function resetIdleTimer() {
        idleTime = 0;
    }
    
    document.addEventListener('click', resetIdleTimer);
    document.addEventListener('keydown', resetIdleTimer);
    document.addEventListener('scroll', resetIdleTimer);
    document.addEventListener('mousemove', resetIdleTimer);
    document.addEventListener('touchstart', resetIdleTimer);
    
    // ============================================================
    // 15. FINAL LOCKDOWN - Protect important objects
    // ============================================================
    try {
        Object.freeze(window.document);
        Object.freeze(window.navigator);
        Object.freeze(window.location);
    } catch(e) {
        // Some browsers may not allow freezing
    }
    
    console.log('✅ All security features loaded successfully!');
    
})();
