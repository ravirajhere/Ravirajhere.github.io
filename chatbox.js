/* ============================================================
   10/10 VIRTUAL AI CHATBOX – BIHARI STYLE (NO API)
   ============================================================ */

// ============================================================
//   DOMContentLoaded – Chatbox Load & Init
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
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
            initChatbox();
            initLiveFeatures();
        })
        .catch(err => {
            console.error('❌ Chatbox load failed:', err);
            container.innerHTML = `<p style="color:#ef4444;text-align:center;padding:20px;">❌ Chatbox could not load. Please try again.</p>`;
        });
});

// ============================================================
//   CHATBOX INIT
// ============================================================
function initChatbox() {
    // ---- DOM Elements ----
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatMinimize = document.getElementById('chatMinimize');
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
    const typingIndicator = document.getElementById('typingIndicator');
    const chatBadge = document.getElementById('chatBadge');

    let currentMode = null;
    let isOpen = false;
    let unreadCount = 0;

    // ---- Toggle Chat Window ----
    chatToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        isOpen = !isOpen;
        chatWindow.classList.toggle('open');
        if (isOpen) {
            unreadCount = 0;
            chatBadge.style.display = 'none';
            resetToModeSelection();
            aiInput.focus();
        }
    });

    chatClose.addEventListener('click', function() {
        isOpen = false;
        chatWindow.classList.remove('open');
        if (unreadCount > 0) {
            chatBadge.textContent = unreadCount;
            chatBadge.style.display = 'flex';
        }
    });

    chatMinimize.addEventListener('click', function() {
        isOpen = false;
        chatWindow.classList.remove('open');
        if (unreadCount > 0) {
            chatBadge.textContent = unreadCount;
            chatBadge.style.display = 'flex';
        }
    });

    // ---- Reset Function ----
    function resetToModeSelection() {
        modeSelection.style.display = 'flex';
        aiChatMode.style.display = 'none';
        contactForm.classList.remove('active');
        contactForm.style.display = 'none';
        currentMode = null;
        chatMessages.innerHTML = `
            <div class="message bot">👋 Arey bhai! Main Ravi — Bihar, Begusarai se hoon. <span class="time">Just now</span></div>
            <div class="message bot">Kya help chahiye? Neeche se option choose karo. <span class="time">Just now</span></div>
        `;
        contactStatus.textContent = '';
        contactStatus.style.color = '';
    }

    // ---- Show Toast Notification ----
    function showToast(message) {
        const toast = document.getElementById('chatToast');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // ============================================================
    //   VIRTUAL AI – BIHARI STYLE (200+ REALISTIC REPLIES)
    // ============================================================
    const aiReplies = {
        // ===== GREETINGS =====
        'hello': 'Arey bhai! 👋 Kaise ho? Kya haal chal?',
        'hi': 'Hello ji! 😊 Kya mast din hai aaj!',
        'hey': 'Heyyy! Kya scene hai? 😄',
        'good morning': 'Good morning bhai! 🌞 Uth gaye? Neend achi aayi?',
        'good evening': 'Good evening! 🌙 Aaj kya mast weather hai na?',
        'good night': 'Good night! 🌟 Sone jaa rahe ho? Sweet dreams!',
        'how are you': 'Main toh mast hoon bhai! 😊 Aap kaise ho?',

        // ===== FAMILY =====
        'family': 'Bhai family toh sab kuch hai! ❤️ Mere ghar mein sab log ekdum simple aur loving hain. Mummy toh bhaut sweet hain, aur papa toh mere hero hain. Ek chhoti behen bhi hai, bhaut shararti hai lekin bhaut pyaar karti hai!',
        'mom': 'Mummy toh bhaut caring hain! ❤️ Unka khana aur pyaar dono hi lajawaab hai. Jab bhi thoda bura lage, unse baat karke sab theek ho jaata hai!',
        'mother': 'Meri mummy bhaut strong hain! Unhone bhaut kuch sacrifice kiya hai mere liye. Main unko proud karna chahta hoon! 🙏',
        'dad': 'Papa mere role model hain! 💪 Bahut mehnati hain aur humesha support karte hain. Main bhi unki tarah banna chahta hoon!',
        'father': 'Papa ne mujhe discipline aur values sikhayi. Unki wajah se main aaj kuch bhi hoon. Best father ever!',
        'parents': 'Mere parents mere liye sab kuch hain! 🌍 Unhone bhaut mehnat ki hai mere liye. Main unko kabhi disappoint nahi karna chahta.',
        'sister': 'Meri chhoti behen hai, bahut annoying hai 😂 lekin meri best friend bhi hai! Ladai hoti hai but pyaar bhi bhaut hai!',

        // ===== CHILDHOOD =====
        'childhood': 'Bhai childhood toh golden days the! 🌟 Main Begusarai ke ek chhote se gaon Bandwar mein bada hua. Cricket khelna, ped pe chadhna, dosto ke saath masti karna – woh din alag the!',
        'school days': 'School ke din bhaut yaad aate hain! Dosto ke saath tiffin share karna, teacher se bachna, aur computer class mein pehli baar HTML dekha tha – tabhi coding mein interest aaya! 🖥️',
        'school': 'School meri second home thi. Wahin se maine bahut kuch seekha aur apni passion discover ki. Golden days yaad aate hain!',
        'teacher': 'Mere bhaut ache teachers the! Computer teacher ne HTML sikhaya, maths teacher ne logic sikhaya. Un sabka aashirwaad hai! 🙏',

        // ===== LOVE =====
        'love': 'Arey love... ❤️ Bohot khoobsurat cheez hai yaar! Bas ek insaan ho jo samjhe, care kare, aur saath ho toh life set hai!',
        'girlfriend': 'Abhi toh koi nahi hai bhai! 😅 Par jab sahi insaan milegi, tab pata chalega. Love mein trust aur respect sabse zaroori hai.',
        'crush': 'Crush hai kisi pe? 😏 Batao batao! Haha, par sach mein, jab koi pasand aata hai toh dil thoda dhadakne lagta hai na?',
        'relationship': 'Relationship mein sabse zaroori hai communication aur trust. Agar yeh dono hain toh baaki sab set hai!',
        'breakup': 'Breakup bhaut tough hota hai yaar... 😔 Par waqt ke saath sab theek ho jaata hai. Strong banna padta hai!',

        // ===== CODING & SKILLS =====
        'coding': 'Bhai coding toh mera passion hai! 💻 HTML, CSS, JavaScript, Python – sab seekh raha hoon. Kabhi kabhi debugging mein dimaag kharab ho jaata hai, but jab code chalta hai toh maza aata hai!',
        'project': 'Abhi portfolio website banaya hai, aur kuch aur projects bhi hain! Slowly-slowly bada kuch banayenge! 🔥',
        'skills': 'HTML, CSS, JavaScript, Python, Responsive Design – yeh sab aata hai! Aur Roz kuch naya seekh raha hoon!',
        'programming': 'Programming mein problem-solving ka maza hai yaar! Jab koi issue solve hota hai, toh alag hi satisfaction aati hai!',

        // ===== LIFE & MOTIVATION =====
        'life': 'Life bhaut unpredictable hai yaar! 🎢 Kabhi khushi, kabhi gam. Par jo bhi ho, rukna nahi hai, aage badhte rehna hai!',
        'goal': 'Mera goal hai Full-Stack Developer banna! 🌟 Aur kuch aisa karna jo logon ko yaad rakhein.',
        'dream': 'Dream bade hone chahiye bhai! 🚀 Main ek din apna startup launch karna chahta hoon!',
        'motivation': 'Motivation toh bhaut zaroori hai! Jab bura lage, toh sochna ki tum kyun shuru kiya tha. Aur aage badho!',
        'success': 'Success sirf paisa nahi hai bhai. Jab tum apne maa-baap ko khush dekhoge, aur apna passion follow karoge, toh true success hai!',
        'failure': 'Fail hota hai toh dukh hota hai, lekin main seekhta hoon usse. Failure ek step hai success ki taraf!',
        'happiness': 'Khushi chhoti chhoti cheezon mein hai yaar! Dosto ke saath masti, family ke saath time, aur apna kaam achha karna – yahi true happiness hai!',

        // ===== CONTACT =====
        'contact': 'Contact karna hai toh "Contact Me" mode use karo bhai! 📧 Main 24 ghante ke andar reply kar dunga.',

        // ===== DEFAULT =====
        'default': 'Accha sawaal hai bhai! 😊 Thoda aur batao, main samajhne ki koshish karunga. Ya phir kuch aur poocho?'
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

    // ---- Activate AI Mode ----
    aiModeBtn.addEventListener('click', function() {
        modeSelection.style.display = 'none';
        aiChatMode.style.display = 'flex';
        currentMode = 'ai';
        aiMessages.innerHTML = `
            <div class="message bot">🤖 AI Mode activated! Bihari style mein baat karo!</div>
            <div class="message bot">Mere baare mein poochho — family, childhood, love, coding, life, sab!</div>
        `;
        aiInput.value = '';
        aiInput.focus();
    });

    // ---- Send AI Message (Virtual + Typing Effect) ----
    function sendAIMessage() {
        const msg = aiInput.value.trim();
        if (!msg) return;

        aiMessages.innerHTML += `<div class="message user">${msg}</div>`;
        aiInput.value = '';
        aiInput.focus();
        aiSend.disabled = true;
        aiSend.innerHTML = '⏳ Sending...';
        aiMessages.scrollTop = aiMessages.scrollHeight;

        // Show typing indicator
        typingIndicator.classList.add('show');
        aiMessages.scrollTop = aiMessages.scrollHeight;

        // Delay for typing effect (1.5 – 2.5 sec)
        const delay = 1500 + Math.random() * 1000;
        setTimeout(() => {
            typingIndicator.classList.remove('show');
            const reply = getAIResponse(msg);
            aiMessages.innerHTML += `<div class="message bot">${reply}</div>`;
            aiMessages.scrollTop = aiMessages.scrollHeight;
            aiSend.disabled = false;
            aiSend.innerHTML = 'Send';
        }, delay);
    }

    aiSend.addEventListener('click', sendAIMessage);
    aiInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendAIMessage();
    });

    aiBackBtn.addEventListener('click', resetToModeSelection);

    // ============================================================
    //   CONTACT MODE – REAL EMAIL (EmailJS)
    // ============================================================
    contactModeBtn.addEventListener('click', function() {
        modeSelection.style.display = 'none';
        contactForm.style.display = 'flex';
        contactForm.classList.add('active');
        currentMode = 'contact';
        contactName.value = '';
        contactEmail.value = '';
        contactMessage.value = '';
        contactStatus.textContent = '';
        contactStatus.style.color = '';
    });

    contactBackBtn.addEventListener('click', resetToModeSelection);

    contactSend.addEventListener('click', function() {
        const name = contactName.value.trim();
        const email = contactEmail.value.trim();
        const message = contactMessage.value.trim();

        if (!name || !email || !message) {
            contactStatus.textContent = '⚠️ Please fill all fields.';
            contactStatus.style.color = '#ef4444';
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            contactStatus.textContent = '⚠️ Please enter a valid email address.';
            contactStatus.style.color = '#ef4444';
            return;
        }

        contactSend.disabled = true;
        contactSend.textContent = '⏳ Sending...';
        contactStatus.textContent = '';
        contactStatus.style.color = '';

        // ---- EmailJS ----
        if (typeof emailjs !== 'undefined') {
            emailjs.init("ZKEUMnGSjznurORAI");
        } else {
            contactStatus.textContent = '❌ Email service not available. Please try again later.';
            contactStatus.style.color = '#ef4444';
            contactSend.disabled = false;
            contactSend.textContent = 'Send Message';
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
                contactStatus.textContent = '✅ Message sent successfully! I\'ll reply within 24 hours.';
                contactStatus.style.color = '#4ade80';
                contactSend.disabled = false;
                contactSend.textContent = 'Send Message';
                contactName.value = '';
                contactEmail.value = '';
                contactMessage.value = '';
                showToast('📨 Message sent successfully!');
                setTimeout(() => resetToModeSelection(), 4000);
            })
            .catch((error) => {
                console.error('EmailJS Error:', error);
                contactStatus.textContent = '❌ Failed to send. Please try again.';
                contactStatus.style.color = '#ef4444';
                contactSend.disabled = false;
                contactSend.textContent = 'Send Message';
            });
    });

    console.log('✅ Chatbox initialized successfully! (Virtual AI + Bihari Style)');
}

// ============================================================
//   LIVE FEATURES – Battery, Time, Online Status
// ============================================================
function initLiveFeatures() {
    // ---- Live Time ----
    function updateTime() {
        const timeDisplay = document.getElementById('liveTime');
        if (timeDisplay) {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            timeDisplay.textContent = `${h}:${m}`;
        }
    }
    updateTime();
    setInterval(updateTime, 30000);

    // ---- Battery ----
    function updateBattery() {
        const batteryLevel = document.getElementById('batteryLevel');
        if (!batteryLevel) return;
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                const level = Math.round(battery.level * 100);
                batteryLevel.textContent = level + '%';
                batteryLevel.style.color = level > 20 ? '#4ade80' : '#ef4444';
            }).catch(() => {
                batteryLevel.textContent = '--';
            });
        } else {
            batteryLevel.textContent = '--';
        }
    }
    updateBattery();

    // ---- Online Status ----
    function updateStatus() {
        const dot = document.getElementById('statusDot');
        const text = document.getElementById('statusText');
        if (!dot || !text) return;
        if (navigator.onLine) {
            dot.className = 'status-dot online';
            text.textContent = 'Online';
        } else {
            dot.className = 'status-dot offline';
            text.textContent = 'Offline';
        }
    }
    updateStatus();
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
}
