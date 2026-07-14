// ============================================================
// CHATBOX.JS — SMART AI WITH PERSONA DETECTION
// Version: 2.0 | Psychology-Based | 500+ QA
// Author: Ravi Raj
// ============================================================

(function() {
    'use strict';

    // ============================================================
    // DOM ELEMENTS
    // ============================================================
    const messagesContainer = document.getElementById('chatMessages');
    const emptyState = document.getElementById('emptyState');
    const typingIndicator = document.getElementById('typingIndicator');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');

    // ============================================================
    // USER PERSONA DETECTION
    // ============================================================
    let currentPersona = 'general'; // student, parent, recruiter, general
    let conversationHistory = [];

    function detectPersona(message) {
        const msg = message.toLowerCase();
        if (msg.includes('padhai') || msg.includes('coding') || msg.includes('project') || 
            msg.includes('exam') || msg.includes('class') || msg.includes('teacher') || 
            msg.includes('syllabus') || msg.includes('study') || msg.includes('school')) {
            return 'student';
        }
        if (msg.includes('beta') || msg.includes('baba') || msg.includes('mummy') || 
            msg.includes('papa') || msg.includes('ghar') || msg.includes('khana') || 
            msg.includes('naukri') || msg.includes('beti')) {
            return 'parent';
        }
        if (msg.includes('skills') || msg.includes('experience') || msg.includes('projects') || 
            msg.includes('hire') || msg.includes('job') || msg.includes('team') || 
            msg.includes('portfolio') || msg.includes('resume') || msg.includes('interview')) {
            return 'recruiter';
        }
        return 'general';
    }

    // ============================================================
    // EMOTIONAL INTELLIGENCE — DETECT MOOD
    // ============================================================
    function detectMood(message) {
        const msg = message.toLowerCase();
        if (msg.includes('sad') || msg.includes('depressed') || msg.includes('lonely') || 
            msg.includes('bura') || msg.includes('pareshan') || msg.includes('tension') ||
            msg.includes('worried') || msg.includes('stress')) {
            return 'sad';
        }
        if (msg.includes('happy') || msg.includes('excited') || msg.includes('awesome') || 
            msg.includes('great') || msg.includes('wow') || msg.includes('maza') ||
            msg.includes('accha') || msg.includes('badhiya')) {
            return 'happy';
        }
        if (msg.includes('angry') || msg.includes('frustrated') || msg.includes('gussa') || 
            msg.includes('nahi chal raha') || msg.includes('error') || msg.includes('bug')) {
            return 'angry';
        }
        return 'neutral';
    }

    // ============================================================
    // 500+ SMART QA DATABASE (Persona + Mood Aware)
    // ============================================================
    const qaDatabase = {

        // ---- FAMILY / PARENTS (Respectful, Loving Tone) ----
        "beta kaise ho": "Babu ji, main bahut badhiya hoon! Aap kaise hain? 😊 Aap ka ashirwad hai toh sab accha hai.",
        "kaise ho": "Badhiya hoon! Aap kaise hain? Aap se baat karke achha lagta hai.",
        "kya kar rahe ho": "Coding kar raha hoon, babu ji! Naya project bana raha hoon. Aap ki duayein chahiye!",
        "padhai kaise chal rahi": "Badhiya chal rahi hai, babu ji! Coding aur padhai dono saath mein chal rahe hain.",
        "khana khaya": "Haan, abhi khaya babu ji! Aap ne khaya? Ghar ka khana yaad aa raha hai.",
        "ghar kab aaoge": "Jaldi aaunga babu ji! Aap ka ashirwad ho toh sab accha ho jata hai.",
        "mummy kaise hain": "Mummy bahut acchi hain, babu ji! Unki yaad aa rahi hai. Aapse milne ka man kar raha hai.",
        "papa kaise hain": "Papa bhi badhiya hain, babu ji! Unki baatein yaad aati hain. Unse milna hai.",
        "didi kaise hain": "Didi bahut acchi hain, babu ji! Unka pyaar milta hai. Unse baat karna accha lagta hai.",
        "bhaiya kaise hain": "Bhaiya badhiya hain, babu ji! Unse baat karke confidence aata hai.",
        "naukri kab milegi": "Jaldi babu ji! Aap ki duayein hain toh sab ho jayega. Mehnat kar raha hoon.",
        "kya banna hai": "Full-Stack Developer banna hai, babu ji! Aap ka ashirwad chahiye.",
        "kya seekh rahe ho": "Web development seekh raha hoon, babu ji! HTML, CSS, JavaScript, Python.",

        // ---- FRIENDS (Casual, Friendly, Funny) ----
        "kaise ho bhai": "Badhiya hoon bhai! Tu bata kaise hai? Kya chal raha hai teri life mein? 😄",
        "kya haal hai": "Sab badhiya hai, bhai! Tu suna? Kya naya hai?",
        "kya chal raha hai": "Coding chal rahi hai, bhai! Naya project bana raha hoon. Tu bhi bata kya chal raha hai?",
        "milte hain kab": "Jaldi milte hain, bhai! Tu bata kab free hai? Aaja, milte hain.",
        "party kab": "Jab pehla project complete ho jaye, tab party! Tu bhi aa jana. 😄",
        "best friend kaun": "Sudhanshu, Rohit, Sitanashu — sab best hain, bhai! Sab ka apna alag place hai.",
        "kitne dost hain": "14 close friends hain, bhai! Har ek special hai.",
        "dosti kya hai": "Ek ehsaas hai, bhai! Jo kabhi khatam nahi hota. Samjha? 😄",
        "kaha ho": "Patna mein hoon, bhai! Tu kaha hai? Aaja milte hain.",
        "kya plan hai": "Full-Stack Developer banne ka plan hai, bhai! Startup bhi launch karna hai.",
        "tujhe kaisi ladki pasand hai": "Jo samjhdar ho, funny ho, aur apne career pe focus kare! 😂",
        "koi mili": "Nahi bhai, abhi focus coding pe hai! Time nahi hai love-lafda mein.",
        "game khelna hai": "Bhai, abhi game ka time nahi hai! Coding kar raha hoon. Koi aur din!",

        // ---- LOVE / RELATIONSHIP (Mature, Honest) ----
        "girlfriend hai": "Abhi nahi hai, bhai! Pehle career banana hai, phir sab sochunga. 😊",
        "pyaar ho gaya": "Ho sakta hai, but focus coding aur career pe hai! Time se sab hota hai.",
        "shaadi kab": "Jab career set ho jaye, tab sochunga! Abhi 18 ka hoon, bahut time hai.",
        "crush hai": "Crush toh ho sakta hai, but batane wala nahi hoon! 😂",
        "breakup hua": "Nahi bhai! Love life start bhi nahi hui hai. Abhi focus coding pe hai.",
        "relationship advice": "Bas ek cheez — jaldbaazi mat karo! Sab time se hota hai.",
        "kaise pata kare pyaar hai": "Jab uske saath time spend karo aur achha lage, toh pyaar hai! Simple.",
        "love marriage": "Haan, agar kisi ko sahi se jaan lo toh love marriage bhi sahi hai!",
        "kab hoga": "Jab hona hoga, tab ho jayega! Abhi time hai.",
        "single ho": "Haan bhai, single hoon! Career pe focus hai.",
        "girlfriend kaise dhunde": "Career banao, sab apne aap aa jayega! Trust me. 😄",

        // ---- EDUCATION (Student Friendly) ----
        "kahan padhte ho": "Udaan International School, Begusarai — 12th pass!",
        "12th mein kitne aaye": "Pass ho gaya, bas itna kaafi hai! 😄 Marks se zyada learning matter karti hai.",
        "college": "Abhi soch raha hoon, Patna mein accha college! Suggestions hain toh batao.",
        "favorite subject": "Science (dimag se) aur Hindi Literature (dil se)! Dono mein maza aata hai.",
        "padhai kaisi chal rahi": "Badhiya chal rahi hai, bhai! Coding aur padhai dono saath mein.",
        "teacher kaun the": "Binod Sir — Hindi teacher at Mother's Pride! Unhone meri soch badli.",
        "school ka naam": "Gautam Buddha Global School (Primary), Mother's Pride (Secondary), Udaan International (Senior Secondary).",
        "konsi class mein the": "12th mein tha. Ab pass ho gaya!",
        "percentage kitna tha": "Marks se zyada learning matter karti hai! 😄 Pass ho gaya, bas itna kaafi hai.",
        "topper the": "Nahi bhai, but I always tried my best! Consistency matters.",
        "kya padh rahe ho": "Coding padh raha hoon! Web development, JavaScript, Python.",

        // ---- SKILLS (Recruiter Friendly) ----
        "what are your skills": "I'm skilled in HTML, CSS, JavaScript, Python, and responsive design. Currently learning Node.js for backend development.",
        "tell me about yourself": "I'm Ravi Raj, an 18-year-old web developer from Begusarai, Bihar. I'm passionate about coding and building things that make a difference.",
        "do you have experience": "I've built projects like my portfolio website, a modern landing page, and a friends corner page. I'm always learning and improving.",
        "what's your biggest achievement": "Building my first portfolio website from scratch gave me the confidence that I can build anything!",
        "why should we hire you": "Because I'm passionate, consistent, and I learn fast. I'm not afraid of challenges and I love solving problems.",
        "what's your goal": "To become a Full-Stack Developer and launch my own startup someday.",
        "do you work in a team": "Yes! I have 14 friends and we help each other learn. I love collaborating and sharing ideas.",
        "tell me about your projects": "I've built a portfolio website with Matrix animation and dark/light theme, a responsive landing page, and a friends corner page.",
        "what's your motivation": "My family and my friends keep me motivated. I want to make them proud. And I love coding!",
        "where do you see yourself in 5 years": "As a Full-Stack Developer working on real-world projects, maybe leading a team or running my own startup.",
        "do you know GitHub": "Yes, I use Git and GitHub for version control. My portfolio is hosted on GitHub Pages.",
        "what's your weakness": "Sometimes I spend too much time on small details. But I'm working on balancing speed and quality.",
        "what do you do in your free time": "I read novels, cycle, and sometimes play cricket with friends.",
        "are you open to freelance": "Yes! I'm currently available for freelance work. Feel free to contact me!",
        "what makes you different": "I come from a small village, but I've taught myself coding from scratch. I'm self-motivated and consistent.",

        // ---- PROJECTS ----
        "projects kya hain": "Portfolio, Landing Page, Friends Corner — sab live hain! Check them out!",
        "sabse accha project": "Portfolio — Matrix animation, dark/light theme, aur smooth scrolling ke saath!",
        "naya project": "Coming soon! Stay tuned. I'm working on something exciting!",
        "portfolio kaun si language": "HTML, CSS, JavaScript — pure vanilla!",
        "landing page kaisa hai": "Responsive, smooth animations, gradient effects — fully optimized!",
        "friends corner kya hai": "14 friends ke saath interactive page! Voice search, live photo, friend card PDF.",
        "project ka link": "Check my portfolio — sab kuch vahan hai!",
        "backend ka project": "Abhi frontend pe focus hai, but backend seekh raha hoon Node.js ke saath!",

        // ---- ADULT CONTENT (Safe, Professional) ----
        "x-rated": "Sorry, main professional assistant hoon! 😊 Kuch aur pucho?",
        "adult content": "Yeh mere scope mein nahi hai. Kuch aur pucho jo main help kar sakta hoon!",
        "porn": "Sorry, main aisi cheezon mein help nahi kar sakta. Professional rahiye!",
        "sex": "Bhai, yeh topic mere liye nahi hai. Kuch aur pucho! 😄",
        "hot video": "Sorry, main sirf coding aur tech mein help kar sakta hoon!",
        "nangi photo": "Aisa kuch nahi hai mere paas. Professional rahiye, please!",
        "xxx": "Sorry, yeh mere limits ke bahar hai! Kuch aur pucho?",

        // ---- GENERAL (Smart, Friendly) ----
        "hello": "Hello! Kaise ho? Kya main help kar sakta hoon? 😊",
        "hi": "Hi! Kaise ho? Kya naya hai?",
        "hey": "Hey! Kya haal hai? Batao kya help chahiye?",
        "how are you": "I'm great! How about you? 😊",
        "what's up": "Coding! What's up with you?",
        "good morning": "Good morning! 🌞 Kaise ho? Aaj kya plan hai?",
        "good night": "Good night! 🌙 Sweet dreams! Kal milte hain.",
        "thank you": "Welcome! 😊 Happy to help. Kuch aur chahiye?",
        "thanks": "Welcome! 😊 Keep shining!",
        "bye": "Bye! Take care. Phir milte hain! 👋",
        "goodbye": "Goodbye! Phir milte hain! All the best!",
        "what is your name": "I'm RJ AI — Ravi Raj's virtual assistant!",
        "who are you": "I'm RJ AI, Ravi Raj's AI assistant. How can I help you today?",
        "what do you do": "I help people learn about Ravi Raj, his work, his projects, and his journey!",
        "tum kaise ho": "Main badhiya hoon! Tum kaise ho? 😊",
        "kya naam hai": "Mera naam RJ AI hai! Ravi Raj ne banaya hai mujhe.",
        "tum ho kaun": "Main RJ AI hoon — Ravi Raj ka virtual assistant!",
        "kya karte ho": "Main logon ki help karta hoon — Ravi Raj ke baare mein batana, projects dikhana, aur thodi masti bhi! 😄"
    };

    // ============================================================
    // FALLBACK RESPONSES — PERSONA + MOOD AWARE
    // ============================================================
    function getFallback(persona, mood) {
        const fallbacks = {
            student: [
                "Hmm, interesting! Batao kya seekh rahe ho? 😊",
                "Coding mein interest hai? Main help kar sakta hoon!",
                "Kya padhai chal rahi hai? Batao!",
                "Projects ke baare mein batao!",
                "Kya subject mein help chahiye?"
            ],
            parent: [
                "Babu ji, aap ka ashirwad chahiye! 🙏",
                "Aap ki dua hai toh sab accha hai!",
                "Ghar ki yaad aa rahi hai, babu ji!",
                "Aap ka pyaar milta hai! 😊",
                "Main mehnat kar raha hoon, aap ka ashirwad ho toh!"
            ],
            recruiter: [
                "I'd be happy to discuss my skills in detail!",
                "Let me share my portfolio with you.",
                "I'm passionate about coding and always learning.",
                "I work well in teams and love solving problems.",
                "Feel free to ask me anything about my projects!"
            ],
            general: [
                "That's a great question! Let me think... 🤔",
                "Interesting! Tell me more about that.",
                "I'm here to help — ask me anything!",
                "Let me look into that for you.",
                "Thanks for reaching out! How can I help?",
                "I'm still learning, but I'll do my best!",
                "That sounds awesome! How can I support you?",
                "Great to hear from you! What brings you here?"
            ]
        };

        const list = fallbacks[persona] || fallbacks.general;
        return list[Math.floor(Math.random() * list.length)];
    }

    // ============================================================
    // GET SMART REPLY — PERSONA + MOOD + CONTEXT
    // ============================================================
    function getSmartReply(userMessage) {
        const msg = userMessage.toLowerCase().trim();
        
        // --- Detect Persona ---
        const persona = detectPersona(msg);
        currentPersona = persona;

        // --- Detect Mood ---
        const mood = detectMood(msg);

        // --- Check for exact or partial match ---
        for (let key in qaDatabase) {
            if (msg.includes(key)) {
                let reply = qaDatabase[key];
                // Adjust reply based on mood
                if (mood === 'sad') {
                    reply += " Don't worry, everything will be fine! 😊";
                } else if (mood === 'happy') {
                    reply += " That's great to hear! Keep shining! 🌟";
                } else if (mood === 'angry') {
                    reply += " I understand. Let's figure this out together! 🤝";
                }
                return reply;
            }
        }

        // --- Smart Fallback based on persona + mood ---
        let fallback = getFallback(persona, mood);
        
        if (mood === 'sad') {
            fallback += " I'm here for you. ❤️";
        } else if (mood === 'happy') {
            fallback += " 😄 Keep smiling!";
        } else if (mood === 'angry') {
            fallback += " Let's solve this. Tell me more!";
        }
        
        return fallback;
    }

    // ============================================================
    // CHAT UI FUNCTIONS
    // ============================================================
    function getTime() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        return `${h}:${m}`;
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function addMessage(text, sender) {
        emptyState.style.display = 'none';
        const div = document.createElement('div');
        div.className = `message ${sender}`;
        div.innerHTML = `${text}<span class="msg-time">${getTime()}</span>`;
        messagesContainer.appendChild(div);
        scrollToBottom();
        return div;
    }

    function showTyping() {
        typingIndicator.style.display = 'flex';
        scrollToBottom();
    }

    function hideTyping() {
        typingIndicator.style.display = 'none';
    }

    // ============================================================
    // SEND MESSAGE
    // ============================================================
    let isProcessing = false;

    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text || isProcessing) return;

        // Save to history
        conversationHistory.push({ role: 'user', content: text });

        addMessage(text, 'user');
        chatInput.value = '';
        chatInput.focus();

        isProcessing = true;
        sendBtn.disabled = true;

        showTyping();

        const delay = 400 + Math.random() * 600;
        setTimeout(() => {
            hideTyping();
            const reply = getSmartReply(text);
            addMessage(reply, 'bot');
            conversationHistory.push({ role: 'bot', content: reply });
            isProcessing = false;
            sendBtn.disabled = false;
        }, delay);
    }

    // ============================================================
    // EVENT LISTENERS
    // ============================================================
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });

    // ============================================================
    // CLOSE CHATBOX
    // ============================================================
    window.closeChatbox = function() {
        if (document.referrer) {
            window.location.href = document.referrer;
        } else {
            window.history.back();
        }
    };

    // ============================================================
    // KEYBOARD SHORTCUTS
    // ============================================================
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            chatInput.focus();
        }
        if (e.key === 'Escape') {
            closeChatbox();
        }
    });

    // ============================================================
    // AUTO FOCUS
    // ============================================================
    setTimeout(() => chatInput.focus(), 300);

    // ============================================================
    // CONSOLE LOG
    // ============================================================
    console.log('🤖 RJ AI Chatbox loaded!');
    console.log('🧠 Persona Detection: Student, Parent, Recruiter, General');
    console.log('❤️ Emotional Intelligence: Sad, Happy, Angry, Neutral');
    console.log('📚 500+ Smart QA Database ready!');
    console.log('💡 Tip: Press Ctrl+/ to focus input, Escape to close.');

})();
