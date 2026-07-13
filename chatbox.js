/* ============================================
   CHATBOX - COMPLETE FUNCTIONALITY (REAL EMAILJS - NO LIMIT)
   ============================================ */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Chatbox script loaded!');

    // Load chatbox HTML
    const container = document.getElementById('chatbox-container');
    if (!container) {
        console.warn('⚠️ Chatbox container not found!');
        return;
    }

    fetch('chatbox.html')
        .then(res => {
            if (!res.ok) throw new Error('Chatbox file not found!');
            return res.text();
        })
        .then(html => {
            container.innerHTML = html;
            console.log('✅ Chatbox HTML loaded!');
            initChatbox();
        })
        .catch(err => {
            console.error('❌ Chatbox load failed:', err);
        });
});

// Initialize chatbox
function initChatbox() {
    // DOM Elements
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const modeSelection = document.getElementById('modeSelection');
    const aiModeBtn = document.getElementById('aiModeBtn');
    const contactModeBtn = document.getElementById('contactModeBtn');
    const aiChatMode = document.getElementById('aiChatMode');
    const aiMessages = document.getElementById('aiMessages');
    const aiInput = document.getElementById('aiInput');
    const aiSend = document.getElementById('aiSend');
    const aiBackBtn = document.getElementById('aiBackBtn');
    const contactForm = document.getElementById('contactForm');
    const contactBackBtn = document.getElementById('contactBackBtn');
    const contactName = document.getElementById('contactName');
    const contactEmail = document.getElementById('contactEmail');
    const contactMessage = document.getElementById('contactMessage');
    const contactSend = document.getElementById('contactSend');
    const contactStatus = document.getElementById('contactStatus');
    const chatMessages = document.getElementById('chatMessages');

    // Check if elements exist
    if (!chatToggle || !chatWindow) {
        console.warn('⚠️ Chatbox elements not found!');
        return;
    }

    let currentMode = null;

    // Toggle Chat Window
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
        if (chatWindow.classList.contains('open')) {
            resetToModeSelection();
        }
    });

    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('open');
    });

    function resetToModeSelection() {
        modeSelection.style.display = 'flex';
        aiChatMode.style.display = 'none';
        contactForm.classList.remove('active');
        contactForm.style.display = 'none';
        currentMode = null;
        chatMessages.innerHTML = `
            <div class="message bot">Hi! 👋 Welcome to my portfolio.</div>
            <div class="message bot">Choose an option below to get started:</div>
        `;
        contactStatus.textContent = '';
    }

    // ===== AI MODE =====
    const aiReplies = {
        'hello': 'Hi! How can I help you today?',
        'hi': 'Hi! How can I help you today?',
        'help': 'Sure! What do you need help with?',
        'project': 'I build websites using HTML, CSS, and JavaScript!',
        'skills': 'HTML5, CSS3, JavaScript, Python, Responsive Design',
        'contact': 'Click "Contact Me" mode to send me a message!',
        'thanks': 'You\'re welcome! 😊',
        'thank you': 'You\'re welcome! 😊',
        'who are you': 'I\'m Ravi\'s virtual assistant!',
        'bye': 'Goodbye! Feel free to come back anytime!',
        'default': 'Let me know what you need help with!'
    };

    function getAIResponse(message) {
        const lowerMsg = message.toLowerCase();
        for (const [key, reply] of Object.entries(aiReplies)) {
            if (lowerMsg.includes(key)) {
                return reply;
            }
        }
        return aiReplies['default'];
    }

    aiModeBtn.addEventListener('click', () => {
        modeSelection.style.display = 'none';
        aiChatMode.style.display = 'flex';
        currentMode = 'ai';
        aiMessages.innerHTML = `
            <div class="message bot">🤖 AI Chat Mode activated!</div>
            <div class="message bot">Ask me anything about Ravi or his work!</div>
        `;
        aiInput.value = '';
        aiInput.focus();
    });

    function sendAIMessage() {
        const msg = aiInput.value.trim();
        if (!msg) return;

        aiMessages.innerHTML += `<div class="message user">${msg}</div>`;
        aiInput.value = '';
        aiInput.focus();
        aiSend.disabled = true;
        aiMessages.scrollTop = aiMessages.scrollHeight;

        setTimeout(() => {
            const reply = getAIResponse(msg);
            aiMessages.innerHTML += `<div class="message bot">${reply}</div>`;
            aiMessages.scrollTop = aiMessages.scrollHeight;
            aiSend.disabled = false;
        }, 500 + Math.random() * 500);
    }

    aiSend.addEventListener('click', sendAIMessage);
    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendAIMessage();
    });

    aiBackBtn.addEventListener('click', resetToModeSelection);

    // ===== CONTACT MODE - REAL EMAILJS =====
    contactModeBtn.addEventListener('click', () => {
        modeSelection.style.display = 'none';
        contactForm.style.display = 'flex';
        contactForm.classList.add('active');
        currentMode = 'contact';
        contactName.value = '';
        contactEmail.value = '';
        contactMessage.value = '';
        contactStatus.textContent = '';
    });

    contactBackBtn.addEventListener('click', resetToModeSelection);

    contactSend.addEventListener('click', function() {
        const name = contactName.value.trim();
        const email = contactEmail.value.trim();
        const message = contactMessage.value.trim();

        // Validation
        if (!name || !email || !message) {
            contactStatus.innerHTML = '⚠️ Please fill all fields.';
            contactStatus.style.color = '#ff4444';
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            contactStatus.innerHTML = '⚠️ Please enter a valid email address.';
            contactStatus.style.color = '#ff4444';
            return;
        }

        contactSend.disabled = true;
        contactStatus.innerHTML = '⏳ Sending your message...';
        contactStatus.style.color = '#ff9800';

        // ===== REAL EMAILJS SEND =====
        if (typeof emailjs !== 'undefined') {
            emailjs.init("ZKEUMnGSjznurORAI");
        } else {
            contactStatus.innerHTML = '❌ Email service not available. Please try again later.';
            contactStatus.style.color = '#ff4444';
            contactSend.disabled = false;
            return;
        }

        const templateParams = {
            from_name: name,
            from_email: email,
            message: message,
            time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        };

        emailjs.send('service_kc0c1i5', 'template_s53pk7r', templateParams)
            .then(() => {
                contactStatus.innerHTML = '✅ Message sent successfully! I\'ll reply within 24 hours.';
                contactStatus.style.color = '#00ff88';
                contactSend.disabled = false;
                contactName.value = '';
                contactEmail.value = '';
                contactMessage.value = '';

                chatMessages.innerHTML += `
                    <div class="message system">📧 Message sent! I\'ll reply within 24 hours.</div>
                `;
                chatMessages.scrollTop = chatMessages.scrollHeight;

                setTimeout(() => {
                    if (currentMode === 'contact') {
                        resetToModeSelection();
                    }
                }, 5000);
            })
            .catch((error) => {
                console.error('EmailJS Error:', error);
                contactStatus.innerHTML = '❌ Failed to send. Please try again.';
                contactStatus.style.color = '#ff4444';
                contactSend.disabled = false;
            });
    });

    console.log('✅ Chatbox initialized successfully!');
}
