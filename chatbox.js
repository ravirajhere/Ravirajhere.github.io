// ============================================================
// CHATBOX.JS — ULTIMATE AI ENGINE
// Version: 4.0 | "70-80 Year Professional" Edition
// Author: Ravi Raj
// ============================================================

(function() {
    'use strict';

    // ============================================================
    // DOM REFS
    // ============================================================
    const DOM = {
        messages: document.getElementById('chatMessages'),
        empty: document.getElementById('emptyState'),
        typing: document.getElementById('typingIndicator'),
        input: document.getElementById('chatInput'),
        send: document.getElementById('sendBtn')
    };

    // ============================================================
    // CORE ENGINE — ULTIMATE AI
    // ============================================================
    const Engine = {
        history: [],
        userPersona: 'general',
        userMood: 'neutral',
        conversationDepth: 0,
        userEngagement: 0,
        responseTime: 0,
        lastMessage: '',
        userInterests: [],
        sessionStart: Date.now(),

        // ---- PERSONA DETECTION (Advanced) ----
        detectPersona(text) {
            const t = text.toLowerCase();
            if (t.match(/padhai|coding|project|exam|class|teacher|syllabus|study|school|learn|seekh|student|college|subject|homework|assignment|test|coaching|course|degree|diploma|knowledge|book|library|lecture|professor|university|scholar|intelligent|brain|mind|logic|reason|think|understand|grasp|comprehend/)) return 'student';
            if (t.match(/beta|baba|mummy|papa|ghar|khana|naukri|beti|bahu|sasur|sas|rishta|shaadi|bahu|bhai|behen|parivaar|family|maa|pitaji|chacha|tau|tai|mausi|mama|bua|devrani|jethani|nanad|sasural|rishtedaar|viraasat|jagir|zameen|kheti|paani|bijli|sadak|gaon|shahar|basti|mohalla|padosi|raah|rasta/)) return 'parent';
            if (t.match(/skills|experience|projects|hire|job|team|portfolio|resume|interview|candidate|position|salary|work|professional|career|growth|opportunity|internship|freelance|client|project management|leadership|management|strategy|business|entrepreneur|startup|venture|funding|investment|revenue|profit|loss|balance sheet|annual report|quarterly|target|KPI|metric|analytics|dashboard|presentation|pitch|deck|proposal|contract|negotiation/)) return 'recruiter';
            if (t.match(/love|girlfriend|boyfriend|crush|relationship|breakup|heart|pyaar|ishq|romance|date|propose|single|commitment|trust|jealousy|marriage|affair|kiss|hug|dosti|friend|bff|bestie|soulmate|forever|together|apart|distance|long distance|love letter|rose|teddy|valentine|couple|partner|life partner/)) return 'romantic';
            if (t.match(/game|play|fun|party|masti|hangout|chill|movie|music|song|dance|travel|adventure|road trip|vacation|hobby|cycle|swim|gym|workout|fitness|sport|cricket|football|badminton|table tennis|chess|carrom|ludo|pubg|freefire|valorant|cod|gta|nfs|ps5|xbox|gaming|streamer|youtuber|influencer/)) return 'casual';
            if (t.match(/tech|technology|ai|machine learning|data science|cloud|devops|blockchain|web3|metaverse|vr|ar|iot|cybersecurity|hacking|ethical hacking|bug bounty|security|penetration testing|vulnerability|exploit|malware|ransomware|phishing|social engineering/)) return 'tech';
            if (t.match(/business|startup|entrepreneur|founder|ceo|cto|product|market|customer|sales|marketing|advertising|brand|strategy|growth hacking|scale|investment|funding|pitch|deck|valuation|exit|ipo|acquisition|merger/)) return 'business';
            return 'general';
        },

        // ---- SENTIMENT ANALYSIS (Mood) ----
        detectMood(text) {
            const t = text.toLowerCase();
            if (t.match(/sad|depressed|lonely|bura|pareshan|tension|worried|stress|panic|anxiety|grief|heartbroken|alone|hopeless|failure|cry|upset|hurt|pain|suffer|struggle|worry|fear|scared|nervous|overwhelmed|exhausted|tired|fatigue|burden|heavy|dark|gloomy|miserable|sorrow|grief|melancholy|despair/)) return 'sad';
            if (t.match(/happy|excited|awesome|great|wow|maza|accha|badhiya|wonderful|amazing|fantastic|brilliant|love it|enjoy|fun|celebrate|cheerful|joy|grateful|proud|blessed|elated|thrilled|ecstatic|overjoyed|radiant|optimistic/)) return 'happy';
            if (t.match(/angry|frustrated|gussa|nahi chal raha|error|bug|annoyed|irritated|rage|furious|upset|disappointed|betrayed|jealous|impatient|hate|useless|worst|terrible|fed up|sick of|tired of|done with|over it|grumpy|hostile|aggressive/)) return 'angry';
            if (t.match(/curious|interesting|tell more|explain|how|why|what|when|where|who|want to know|understand|clarify|elaborate|details|specify|define|describe|uncover|discover|learn|knowledge|insight|perspective/)) return 'curious';
            if (t.match(/funny|haha|lol|rofl|lmfao|hilarious|comedy|joke|meme|fun|entertaining|amusing|humorous|witty|clever|smart|sarcastic|ironic|satirical/)) return 'humorous';
            if (t.match(/scared|fear|terrified|horror|nightmare|spooky|creepy|weird|strange|unusual|odd|bizarre/)) return 'scared';
            return 'neutral';
        },

        // ---- SELF-LEARNING (Dynamic Response) ----
        learn(message, reply) {
            this.history.push({ message, reply, timestamp: Date.now() });
            if (this.history.length > 200) this.history.shift();

            // Track user interests
            const words = message.toLowerCase().split(' ');
            const commonWords = ['the', 'a', 'an', 'is', 'am', 'are', 'was', 'were', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her', 'our', 'their', 'me', 'him', 'her', 'us', 'them'];
            words.forEach(word => {
                if (!commonWords.includes(word) && word.length > 3) {
                    if (!this.userInterests.includes(word)) {
                        this.userInterests.push(word);
                    }
                }
            });
            if (this.userInterests.length > 20) this.userInterests.shift();
        },

        // ---- CONTEXT-AWARE REPLY ----
        getContextualReply(userMessage) {
            const msg = userMessage.toLowerCase().trim();
            
            // Step 1: Detect Persona + Mood
            this.userPersona = this.detectPersona(msg);
            this.userMood = this.detectMood(msg);
            this.conversationDepth++;
            this.lastMessage = msg;

            // Step 2: Check if similar question already asked
            const similar = this.history.find(h => h.message.includes(msg.split(' ')[0]) || msg.includes(h.message.split(' ')[0]));
            if (similar && this.history.length > 5) {
                return similar.reply + " (Pehle bhi kisi ne poochha tha, but wahi baat hai!)";
            }

            // Step 3: Smart Reply System
            let reply = this.getSmartReply(msg);

            // Step 4: Mood Adjustment
            reply = this.applyMoodAdjustment(reply);

            // Step 5: Learning
            this.learn(msg, reply);

            return reply;
        },

        // ---- SMART REPLY DATABASE (Advanced) ----
        getSmartReply(msg) {
            // ---- STUDENT PERSONA ----
            if (this.userPersona === 'student') {
                if (msg.includes('coding')) return "Coding ek art hai, bhai! Main 2023 se seekh raha hoon. HTML, CSS, JS, Python — sab aata hai. Tum kaunsi language seekh rahe ho?";
                if (msg.includes('project')) return "Projects mein toh maza aata hai! Portfolio, Landing Page, Friends Corner — sab live hain. Tum bhi kuch bana rahe ho?";
                if (msg.includes('exam')) return "Exam ka tension mat lo! Main 12th pass hoon. Padhai aur coding dono saath mein manage karna seekha hai. All the best! 💪";
                if (msg.includes('teacher')) return "Binod Sir ne meri soch badli! Mother's Pride mein Hindi padhaya. Unhone sikhaya ki zindagi ka nazariya alag hona chahiye.";
                if (msg.includes('school')) return "Mere schools — GBGS, Mother's Pride, Udaan International. Har school ne kuch na kuch sikhaya!";
                if (msg.includes('future')) return "Full-Stack Developer banne ka dream hai! Startup launch karna hai ek din. Kya tumhara bhi koi dream hai?";
                if (msg.includes('struggle')) return "Struggle toh hai, but consistency se sab hota hai! Main bhi JavaScript mein struggle kiya, but ab seekh raha hoon!";
                return "Student ho? Badiya! Kya seekhna chahte ho? Coding, projects, ya kuch aur?";
            }

            // ---- PARENT PERSONA ----
            if (this.userPersona === 'parent') {
                if (msg.includes('beta')) return "Babu ji, main apna best de raha hoon! Aap ka ashirwad hai toh sab accha hai. ❤️";
                if (msg.includes('padhai')) return "Babu ji, padhai aur coding dono saath mein chal rahi hai. Aap ki dua hai toh sab ho jayega!";
                if (msg.includes('ghar')) return "Ghar ki yaad aa rahi hai, babu ji! Jaldi aaunga. Aap ka pyaar chahiye!";
                if (msg.includes('naukri')) return "Babu ji, mehnat kar raha hoon! Jald hi acchi job milegi. Aap ka ashirwad ho toh!";
                if (msg.includes('khana')) return "Haan babu ji, khaya! Ghar ka khana yaad aa raha hai. Mummy ka haath ka khana miss kar raha hoon!";
                if (msg.includes('sapna')) return "Sapna hai — Full-Stack Developer banna aur apna startup launch karna! Aap ka ashirwad chahiye!";
                if (msg.includes('paisa')) return "Paisa important hai, but usse zyada important hai mehnat aur imaandari! Aap ne yahi sikhaya hai!";
                return "Babu ji, main theek hoon! Aap kaise hain? Kya help chahiye?";
            }

            // ---- RECRUITER PERSONA ----
            if (this.userPersona === 'recruiter') {
                if (msg.includes('skills')) return "My core skills: HTML5 (75%), CSS3 (80%), JavaScript (50%), Python (50%), Node.js (learning). I'm a frontend-focused developer with backend aspirations.";
                if (msg.includes('experience')) return "I've built 5+ projects — Portfolio v2.0, Landing Page, Friends Corner, and more. Each project has taught me something new.";
                if (msg.includes('projects')) return "My portfolio includes a Matrix-animated website, a responsive landing page, and a friends corner with voice search and PDF generation.";
                if (msg.includes('hire')) return "I'm open to freelance and internship opportunities. I'm consistent, self-motivated, and I love solving problems. Let's connect!";
                if (msg.includes('team')) return "I work well in teams! I have 14 friends and we collaborate on projects. Communication is key — and I'm good at it.";
                if (msg.includes('growth')) return "I'm always learning and growing. Currently exploring Node.js and backend. My goal is to become a Full-Stack Developer.";
                if (msg.includes('challenge')) return "I love challenges! They push me to think differently and come up with creative solutions. Bring it on! 💪";
                return "I'm Ravi Raj — a dedicated web developer. What would you like to know about my skills or experience?";
            }

            // ---- ROMANTIC PERSONA ----
            if (this.userPersona === 'romantic') {
                if (msg.includes('girlfriend')) return "Abhi nahi hai, but I believe in 'right time, right person'. Career pe focus hai abhi! 😊";
                if (msg.includes('love')) return "Love is beautiful, but so is coding! Abhi toh main dono mein balance bana raha hoon. 😄";
                if (msg.includes('crush')) return "Crush toh hota hai, but batane ka time nahi hai! 😂";
                if (msg.includes('breakup')) return "Breakup mushkil hota hai, but life moves on. Focus on growth! 💪";
                if (msg.includes('relationship')) return "Relationships need trust and honesty. Main bhi yahi maanta hoon!";
                if (msg.includes('commitment')) return "Commitment is everything! Main bhi apne goals ke liye committed hoon!";
                if (msg.includes('forever')) return "Forever is a beautiful word. Hope to find my forever someday! 😊";
                return "Love is a beautiful feeling. Kya poochhna chahte ho?";
            }

            // ---- CASUAL PERSONA ----
            if (this.userPersona === 'casual') {
                if (msg.includes('game')) return "Games mein maza aata hai, but abhi coding ka time hai! Koi aur din! 🎮";
                if (msg.includes('party')) return "Party tab, jab pehla project complete ho jaye! Tu bhi aa jana! 🎉";
                if (msg.includes('fun')) return "Masti toh hoti hai, but consistency matters! 😄";
                if (msg.includes('movie')) return "Movies dekhna pasand hai, but abhi coding ka time hai!";
                if (msg.includes('travel')) return "Travel karna pasand hai! Patna se Begusarai tak ka safar kaafi hai abhi! 😄";
                if (msg.includes('hobby')) return "Hobbies — cycling, reading novels, aur thodi coding! 😄";
                return "Masti hai toh life hai! Kya chal raha hai teri life mein?";
            }

            // ---- TECH PERSONA ----
            if (this.userPersona === 'tech') {
                if (msg.includes('ai')) return "AI is the future! Main bhi AI mein interest rakhta hoon. Gemini API try kiya hai!";
                if (msg.includes('blockchain')) return "Blockchain is interesting, but I'm more into web development right now!";
                if (msg.includes('security')) return "Security is important! I always use HTTPS and secure my APIs. 😎";
                if (msg.includes('cloud')) return "Cloud computing is amazing! I've used GitHub Pages and Netlify for deployment.";
                return "Tech is my passion! Kya specific topic discuss karna hai?";
            }

            // ---- BUSINESS PERSONA ----
            if (this.userPersona === 'business') {
                if (msg.includes('startup')) return "Startup launch karna hai ek din! Pehle skills strong karo, phir business!";
                if (msg.includes('market')) return "Market understanding is key! I'm learning about user needs and product-market fit.";
                if (msg.includes('customer')) return "Customer is king! Main apne projects mein user experience pe focus karta hoon!";
                return "Business is about solving problems. Kya discuss karna hai?";
            }

            // ---- GENERAL (Default) ----
            if (msg.includes('hello') || msg.includes('hi')) return "Hello! Kaise ho? Kya help chahiye? 😊";
            if (msg.includes('how are you')) return "I'm great! How about you? 😊";
            if (msg.includes('bye')) return "Bye! Take care. Phir milte hain! 👋";
            if (msg.includes('thank')) return "Welcome! 😊 Happy to help. Keep shining!";
            if (msg.includes('name')) return "I'm RJ AI — Ravi Raj's virtual assistant!";
            if (msg.includes('who are you')) return "I'm RJ AI, Ravi Raj's AI assistant. How can I help you today?";
            if (msg.includes('time')) return "Time is important! Main bhi time management pe focus karta hoon. ⏰";
            if (msg.includes('life')) return "Life is beautiful! Kya specific poochhna hai?";
            if (msg.includes('motivation')) return "Motivation comes from within! Main apne family aur friends se motivation leta hoon! 💪";
            if (msg.includes('success')) return "Success is a journey, not a destination. Main har din seekh raha hoon! 🚀";
            
            // ---- ADULT CONTENT SAFE REPLY ----
            if (msg.match(/x-rated|adult|porn|sex|nangi|hot video|xxx|18\+|nsfw|explicit|mature content|erotic|vulgar|obscene|lewd|indecent|profanity|swear|cuss|curse|fuck|shit|bitch|asshole|bastard|dick|pussy|cunt|tits|boobs|breasts|ass|butt|penis|vagina/)) {
                return "Sorry, main professional assistant hoon! 😊 Kuch aur pucho jo main help kar sakta hoon.";
            }

            // ---- FALLBACK (Context-Aware) ----
            const fallbacks = {
                student: "Student life mein maza aata hai! Kya seekh rahe ho?",
                parent: "Babu ji, main apna best de raha hoon! Aap ka ashirwad chahiye! 🙏",
                recruiter: "I'd be happy to discuss my skills in detail. What would you like to know?",
                romantic: "Love is a beautiful journey. Kya poochhna chahte ho?",
                casual: "Life is fun! Kya chal raha hai?",
                tech: "Tech is amazing! Kya specific topic discuss karna hai?",
                business: "Business is about solving problems. Kya discuss karna hai?",
                general: "That's a great question! Let me think... 🤔"
            };
            return fallbacks[this.userPersona] || fallbacks.general;
        },

        // ---- MOOD ADJUSTMENT ----
        applyMoodAdjustment(reply) {
            if (this.userMood === 'sad') return reply + " ❤️ Main hoon na, kuch bhi ho sakta hai!";
            if (this.userMood === 'happy') return reply + " 😄 Tumhara excitement contagious hai!";
            if (this.userMood === 'angry') return reply + " 🤝 Let's solve this together. Tell me more.";
            if (this.userMood === 'curious') return reply + " 📚 Interesting! Let's dive deeper.";
            if (this.userMood === 'humorous') return reply + " 😂 Tumhari sense of humour acchi hai!";
            if (this.userMood === 'scared') return reply + " 😊 Don't worry, I'm here for you!";
            return reply;
        }
    };

    // ============================================================
    // UI FUNCTIONS
    // ============================================================
    function getTime() {
        const now = new Date();
        return String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    }

    function scrollToBottom() {
        DOM.messages.scrollTop = DOM.messages.scrollHeight;
    }

    function addMessage(text, sender) {
        DOM.empty.style.display = 'none';
        const div = document.createElement('div');
        div.className = `message ${sender}`;
        div.innerHTML = `${text}<span class="msg-time">${getTime()}</span>`;
        DOM.messages.appendChild(div);
        scrollToBottom();
    }

    function showTyping() {
        DOM.typing.style.display = 'flex';
        scrollToBottom();
    }

    function hideTyping() {
        DOM.typing.style.display = 'none';
    }

    // ============================================================
    // SEND MESSAGE
    // ============================================================
    let isProcessing = false;

    function sendMessage() {
        const text = DOM.input.value.trim();
        if (!text || isProcessing) return;

        addMessage(text, 'user');
        DOM.input.value = '';
        DOM.input.focus();

        isProcessing = true;
        DOM.send.disabled = true;
        showTyping();

        const delay = 400 + Math.random() * 800;
        setTimeout(() => {
            hideTyping();
            const reply = Engine.getContextualReply(text);
            addMessage(reply, 'bot');
            isProcessing = false;
            DOM.send.disabled = false;
        }, delay);
    }

    // ============================================================
    // EVENT LISTENERS
    // ============================================================
    DOM.send.addEventListener('click', sendMessage);
    DOM.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });

    // ============================================================
    // CLOSE CHATBOX
    // ============================================================
    window.closeChatbox = function() {
        document.referrer ? window.location.href = document.referrer : window.history.back();
    };

    // ============================================================
    // KEYBOARD SHORTCUTS
    // ============================================================
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            DOM.input.focus();
        }
        if (e.key === 'Escape') closeChatbox();
    });

    // ============================================================
    // AUTO FOCUS
    // ============================================================
    setTimeout(() => DOM.input.focus(), 300);

    // ============================================================
    // CONSOLE LOG — PRO LEVEL
    // ============================================================
    console.log('🤖 RJ AI Chatbox — Ultimate Engine');
    console.log('🧠 Persona Detection: Student, Parent, Recruiter, Romantic, Casual, Tech, Business, General');
    console.log('❤️ Sentiment Analysis: Sad, Happy, Angry, Curious, Humorous, Scared, Neutral');
    console.log('📚 Self-Learning: Active');
    console.log('💡 Tip: Press Ctrl+/ to focus input, Escape to close.');
    console.log('🔥 Built by Ravi Raj — 70-80 year professional style!');

})();
