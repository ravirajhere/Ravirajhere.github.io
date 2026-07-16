// ============================================================
// CHATBOX.JS — ULTIMATE AI ASSISTANT v6.0
// "Enterprise-Grade Virtual Assistant for Ravi Raj's Website"
// Author: Ravi Raj | Built: July 2026
// ============================================================

(function() {
    'use strict';

    // ============================================================
    // 1. DOM REFS (Safe & Resilient)
    // ============================================================
    const DOM = {
        messages: document.getElementById('chatMessages'),
        empty: document.getElementById('emptyState'),
        typing: document.getElementById('typingIndicator'),
        input: document.getElementById('chatInput'),
        send: document.getElementById('sendBtn'),
        quickBtns: document.getElementById('quickButtons')
    };

    // Safety check — fallback if elements missing
    if (!DOM.send) {
        console.warn('⚠️ Send button not found — using fallback');
    }

    // ============================================================
    // 2. COMPLETE WEBSITE DATA (Extracted from all files)
    // ============================================================
    const WEBSITE_DATA = {
        // ---- PERSONAL INFO ----
        name: 'Ravi Raj Singh',
        displayName: 'Ravi Raj',
        born: 'March 2008',
        birthplace: 'Begusarai, Bihar',
        location: 'Begusarai, Bihar, India',
        email: 'raviraj2k09@gmail.com',
        phone: '+91 91022 24971',
        title: 'Web Developer & Student',
        motto: '"Somewhere Between I Want It & I Got It"',
        quote: '"Humi hum hain to kya hum hain! Tumhi tum ho to kya tum ho!!"',

        // ---- EDUCATION ----
        education: [
            { year: '2024-26', school: 'Udaan International School, Begusarai', class: 'Senior Secondary (PCM)' },
            { year: '2019-24', school: "Mother's Pride International School, Begusarai", class: 'Secondary School' },
            { year: '2014-19', school: 'Gautam Buddha Global School, Begusarai', class: 'Primary Education' }
        ],

        // ---- SKILLS ----
        skills: {
            frontend: ['HTML5 (75%)', 'CSS3 (80%)', 'JavaScript (50%)', 'Responsive Design'],
            backend: ['Python (50%)', 'Node.js (Learning)'],
            tools: ['VS Code', 'Git/GitHub', 'Chrome DevTools'],
            soft: ['Problem Solving', 'Quick Learner', 'Adaptable', 'Consistent']
        },

        // ---- PROJECTS ----
        projects: [
            {
                name: 'Autobiography',
                description: '12 chapters, 2 languages (English/Hinglish). Personal life story with childhood memories.',
                tech: ['HTML', 'CSS', 'JS'],
                links: { live: 'autobiography.html', source: 'https://github.com/ravirajhere/ravirajhere.github.io/blob/main/autobiography.html' }
            },
            {
                name: 'Chatbox',
                description: 'Real-time messaging, emoji support, LocalStorage. Built with vanilla JavaScript.',
                tech: ['HTML', 'CSS', 'JS', 'LocalStorage'],
                links: { live: 'chatbox.html', source: 'https://github.com/ravirajhere/ravirajhere.github.io/blob/main/chatbox.html' }
            },
            {
                name: 'Friends Gallery',
                description: '14 friends with voice search, lightbox, category filters, PDF friend cards.',
                tech: ['HTML', 'CSS', 'JS', 'Web Speech', 'jsPDF'],
                links: { live: 'friends.html', source: 'https://github.com/ravirajhere/ravirajhere.github.io/blob/main/friends.html' }
            },
            {
                name: 'Resume/Portfolio',
                description: 'Professional CV with print support, project showcase, contact form.',
                tech: ['HTML', 'CSS', 'JS', 'EmailJS'],
                links: { live: 'resume-pdf.html', source: 'https://github.com/ravirajhere/ravirajhere.github.io' }
            }
        ],

        // ---- FRIENDS (14) ----
        friends: [
            { name: 'Sitanashu', connection: 'Best Friend', since: 'Class 1', school: 'GBGS', tag: 'Oldest Friend' },
            { name: 'Rohit', connection: 'Best Friend', since: 'Class 1', school: 'GBGS', tag: 'Day One Friend' },
            { name: 'Suraj', connection: 'Cricket Partner', since: 'Class 6', school: "Mother's Pride", tag: 'Sports Buddy' },
            { name: 'Shresth', connection: 'Gaming Buddy', since: 'Class 6', school: "Mother's Pride", tag: 'Gamer Friend' },
            { name: 'Ayush', connection: 'Drama Partner', since: 'Class 6', school: "Mother's Pride", tag: 'Funniest Friend' },
            { name: 'Rishidev', connection: 'Study Partner', since: 'Class 6', school: "Mother's Pride", tag: 'Scholar Friend' },
            { name: 'Jigyasha', connection: 'Classmate', since: 'Class 6', school: "Mother's Pride", tag: 'Positive Vibes' },
            { name: 'Sudhanshu', connection: 'Best Friend', since: 'Class 7', school: "Mother's Pride", tag: 'Most Loyal' },
            { name: 'Priyam', connection: 'Coding Buddy', since: 'Class 8', school: "Mother's Pride", tag: 'Tech Genius' },
            { name: 'Harsh', connection: 'Music Partner', since: 'Class 8', school: "Mother's Pride", tag: 'Rockstar Friend' },
            { name: 'Keshav', connection: 'Chess Rival', since: 'Class 9', school: "Mother's Pride", tag: 'Smartest Friend' },
            { name: 'Rani', connection: 'Childhood Friend', since: 'Class 12', school: 'PW Iskon Vidypeeth', tag: 'Sweetest Friend' },
            { name: 'Sneha', connection: 'Drama Partner', since: 'Class 12', school: 'PW Iskon Vidypeeth', tag: 'Confident Friend' },
            { name: 'Rohini', connection: 'Art Partner', since: 'Class 12', school: 'PW Iskon Vidypeeth', tag: 'Creative Friend' }
        ],

        // ---- FAMILY ----
        family: {
            parents: 'Father & Mother',
            sisters: 2,
            brothers: 2,
            totalMembers: 7
        },

        // ---- KEY PEOPLE ----
        keyPeople: {
            favoriteTeacher: 'Binod Sir (Hindi Teacher)',
            firstFriend: 'Ayush Singh',
            closeFriends: ['Sudhanshu', 'Rohit', 'Sitanashu']
        },

        // ---- SOCIAL ----
        social: {
            github: 'https://github.com/ravirajhere',
            linkedin: 'https://linkedin.com/in/Ravirajhere',
            twitter: 'https://twitter.com/Raviraj2k09',
            youtube: 'https://youtube.com/@Ravirajhere',
            website: 'https://ravirajhere.github.io'
        },

        // ---- CONTACT ----
        contact: {
            email: 'raviraj2k09@gmail.com',
            phone: '+91 91022 24971',
            location: 'Begusarai, Bihar, India'
        },

        // ---- CAREER ----
        career: {
            experience: '2+ years',
            projects: 4,
            startYear: 2023,
            status: 'Open for Freelance & Internship'
        },

        // ---- AUTOBIOGRAPHY CHAPTERS ----
        chapters: [
            { number: 1, title: 'The Beginning (2008–2012)', summary: 'Birth in Begusarai, childhood memories, cycle incident with father.' },
            { number: 2, title: 'School Days Begin (2013–2019)', summary: 'GBGS to Mother\'s Pride, first friend Ayush, favorite teacher Binod Sir.' },
            { number: 3, title: 'Middle School & Discoveries (2016–2019)', summary: 'Science and Hindi Literature, 12th pass, lessons from failures.' },
            { number: 4, title: 'Coding Discovery (2020–2022)', summary: 'First phone, first HTML tag "Hello World", started reading novels.' },
            { number: 5, title: 'Coding Journey Begins (2023–2024)', summary: 'First portfolio, CSS struggle, first project success.' },
            { number: 6, title: 'The Present (2025–2026)', summary: 'JavaScript learning, portfolio launch, future startup plans.' },
            { number: 7, title: 'Family — My Anchor', summary: 'Parents, 2 sisters, 2 brothers, Diwali memories.' },
            { number: 8, title: 'Friends & Relationships', summary: 'Close friends Ayush, Sudhanshu, Rohit, Sitanashu.' },
            { number: 9, title: 'Biggest Struggle', summary: 'Confusion about future, step by step progress.' },
            { number: 10, title: 'Biggest Happiness', summary: 'First website praise — "Bhai, yeh tune banaya?"' },
            { number: 11, title: 'Message & Motto', summary: 'Motto: "Somewhere Between I Want It & I Got It"' },
            { number: 12, title: 'The Friend Memory', summary: '12th last days, friendship memories, no regrets.' }
        ],

        // ---- EBOOK ----
        ebook: {
            title: 'My Autobiography',
            subtitle: 'A Boy Who Never Thought',
            languages: ['English', 'Hinglish'],
            cover: 'bookcover.jpg'
        }
    };

    // ============================================================
    // 3. INTENT DETECTION ENGINE
    // ============================================================
    const INTENTS = {
        GREETING: /^(hello|hi|hey|namaste|hola|good morning|good evening)/i,
        FAREWELL: /^(bye|goodbye|tata|see you|phir milte|godbye|take care)/i,
        GRATITUDE: /^(thank|thanks|thank you|shukriya|dhanyavaad|thanku)/i,
        NAME: /(name|kaun|who|introduce|yourself|tum kaun)/i,
        AGE: /(age|old|born|birth|umra|saal)/i,
        LOCATION: /(where|location|place|from|kahan|address|city|village|gaon|shahar)/i,
        SKILLS: /(skill|know|learn|expert|technology|tech|language|tool|coding|programming|frontend|backend|developer|kaunsi|kya aata)/i,
        PROJECTS: /(project|build|made|create|portfolio|work|banaya|bana|kaam|website|sites)/i,
        FRIENDS: /(friend|dost|friendship|gallery|corner|saath|mitr|yaar|bhai|dosti)/i,
        FAMILY: /(family|parents|mother|father|sister|brother|mummy|papa|bhai|behan|ghar|parivaar)/i,
        EDUCATION: /(school|study|class|student|college|teacher|exam|degree|diploma|learn|padhai|academy|course)/i,
        CONTACT: /(contact|email|phone|number|call|mail|reach|message|whatsapp|telegram|social)/i,
        SOCIAL: /(github|linkedin|twitter|youtube|social|follow|connect|platform)/i,
        BIOGRAPHY: /(biography|autobiography|story|life|journey|chapter|book|ebook|autobio|safar|zindagi|kissa)/i,
        CAREER: /(career|job|work|experience|hire|freelance|internship|opportunity|position|growth)/i,
        MOTTO: /(motto|quote|tagline|slogan|message|inspire|motivation|philosophy)/i,
        TEACHER: /(teacher|sir|madam|guru|binod|school teacher|favorite teacher)/i,
        MILESTONE: /(achievement|milestone|success|goal|dream|plan|future|launch|startup)/i,
        EBOOK: /(ebook|book|download|pdf|read|read online|book cover|autobiography book)/i,
        HELP: /(help|support|assist|guide|explain|problem|issue|suggest)/i,
        TIME: /(time|clock|hour|minute|second|what time)/i,
        WEATHER: /(weather|temperature|rain|sunny|cloudy)/i
    };

    // ============================================================
    // 4. SMART REPLY ENGINE
    // ============================================================
    const Engine = {
        history: [],
        context: [],
        lastActive: Date.now(),
        userInterests: [],
        userName: null,

        // ---- DETECT INTENT ----
        detectIntent(text) {
            const t = text.toLowerCase();
            for (const [intent, pattern] of Object.entries(INTENTS)) {
                if (pattern.test(t)) {
                    return intent;
                }
            }
            return 'GENERAL';
        },

        // ---- GET SMART REPLY ----
        getSmartReply(msg) {
            const t = msg.toLowerCase().trim();
            const intent = this.detectIntent(t);

            // ---- Adult content filter ----
            if (t.match(/x-rated|adult|porn|sex|nangi|xxx|18\+|nsfw|explicit|fuck|shit|bitch|asshole|bastard|dick|pussy|cunt|tits|boobs|penis|vagina/)) {
                return "I'm a professional assistant! 😊 Please ask something appropriate.";
            }

            // ---- Store user interests ----
            const words = t.split(' ');
            const commonWords = ['the', 'a', 'an', 'is', 'am', 'are', 'was', 'were', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her', 'our', 'their', 'me', 'him', 'her', 'us', 'them', 'to', 'for', 'of', 'on', 'at', 'by', 'in', 'with', 'without', 'and', 'or', 'but'];
            words.forEach(word => {
                if (!commonWords.includes(word) && word.length > 3 && !this.userInterests.includes(word)) {
                    this.userInterests.push(word);
                    if (this.userInterests.length > 20) this.userInterests.shift();
                }
            });

            // ---- Intent-based replies ----
            switch (intent) {
                case 'GREETING':
                    return this.getGreeting();

                case 'FAREWELL':
                    return this.getFarewell();

                case 'GRATITUDE':
                    return this.getGratitude();

                case 'NAME':
                    return `I'm RJ AI — ${WEBSITE_DATA.displayName}'s virtual assistant! 🤖 ${WEBSITE_DATA.displayName} is a ${WEBSITE_DATA.title} from ${WEBSITE_DATA.location}.`;

                case 'AGE':
                    return `${WEBSITE_DATA.displayName} was born in ${WEBSITE_DATA.born} in ${WEBSITE_DATA.birthplace}. Currently ${new Date().getFullYear() - 2008} years old! 🎂`;

                case 'LOCATION':
                    return `${WEBSITE_DATA.displayName} is from ${WEBSITE_DATA.location}. Born in ${WEBSITE_DATA.birthplace}. 🌏`;

                case 'SKILLS':
                    return this.getSkillsReply();

                case 'PROJECTS':
                    return this.getProjectsReply();

                case 'FRIENDS':
                    return this.getFriendsReply();

                case 'FAMILY':
                    return this.getFamilyReply();

                case 'EDUCATION':
                    return this.getEducationReply();

                case 'CONTACT':
                    return this.getContactReply();

                case 'SOCIAL':
                    return this.getSocialReply();

                case 'BIOGRAPHY':
                    return this.getBiographyReply();

                case 'CAREER':
                    return this.getCareerReply();

                case 'MOTTO':
                    return this.getMottoReply();

                case 'TEACHER':
                    return this.getTeacherReply();

                case 'MILESTONE':
                    return this.getMilestoneReply();

                case 'EBOOK':
                    return this.getEbookReply();

                case 'HELP':
                    return this.getHelpReply();

                case 'TIME':
                    return this.getTimeReply();

                case 'WEATHER':
                    return "I don't have weather data, but I can tell you about ${WEBSITE_DATA.displayName}'s website! ☀️";

                default:
                    return this.getFallbackReply(t);
            }
        },

        // ---- GREETING ----
        getGreeting() {
            const greetings = [
                `Hello! 👋 Welcome to ${WEBSITE_DATA.displayName}'s website! How can I help you today?`,
                `Hi there! 😊 I'm RJ AI, ${WEBSITE_DATA.displayName}'s virtual assistant. What would you like to know?`,
                `Namaste! 🙏 Great to see you! Ask me anything about ${WEBSITE_DATA.displayName} or this website.`,
                `Hey! 💫 Welcome! I know everything about ${WEBSITE_DATA.displayName} — his projects, friends, skills, and more!`
            ];
            return greetings[Math.floor(Math.random() * greetings.length)];
        },

        // ---- FAREWELL ----
        getFarewell() {
            const farewells = [
                `Bye! 👋 Thanks for visiting ${WEBSITE_DATA.displayName}'s website. Come back anytime!`,
                `Take care! 😊 It was nice chatting with you. Keep exploring!`,
                `See you soon! 🌟 Don't forget to check out the projects!`,
                `Alvida! ❤️ Thanks for stopping by. ${WEBSITE_DATA.displayName} would be happy!`
            ];
            return farewells[Math.floor(Math.random() * farewells.length)];
        },

        // ---- GRATITUDE ----
        getGratitude() {
            const thanks = [
                `You're welcome! 😊 Happy to help!`,
                `My pleasure! ❤️ ${WEBSITE_DATA.displayName} appreciates your visit!`,
                `Anytime! 💫 Feel free to ask anything about the website!`
            ];
            return thanks[Math.floor(Math.random() * thanks.length)];
        },

        // ---- SKILLS ----
        getSkillsReply() {
            const skills = WEBSITE_DATA.skills;
            return `🎯 ${WEBSITE_DATA.displayName}'s Skills:\n\n` +
                   `🖥️ Frontend: ${skills.frontend.join(', ')}\n` +
                   `⚙️ Backend: ${skills.backend.join(', ')}\n` +
                   `🔧 Tools: ${skills.tools.join(', ')}\n` +
                   `🧠 Soft Skills: ${skills.soft.join(', ')}`;
        },

        // ---- PROJECTS ----
        getProjectsReply() {
            const projects = WEBSITE_DATA.projects;
            let reply = `🚀 ${WEBSITE_DATA.displayName} has built ${projects.length} projects:\n\n`;
            projects.forEach((p, i) => {
                reply += `${i+1}. **${p.name}** — ${p.description}\n`;
                reply += `   Tech: ${p.tech.join(', ')}\n`;
                reply += `   🔗 ${p.links.live}\n\n`;
            });
            reply += `\nCheck them all at: ${WEBSITE_DATA.social.github}`;
            return reply;
        },

        // ---- FRIENDS ----
        getFriendsReply() {
            const friends = WEBSITE_DATA.friends;
            const total = friends.length;
            let reply = `👥 ${WEBSITE_DATA.displayName} has ${total} amazing friends! Here are some:\n\n`;
            
            // Show first 5 friends
            friends.slice(0, 5).forEach(f => {
                reply += `• **${f.name}** — ${f.connection} (${f.tag}) from ${f.school}\n`;
            });
            reply += `\n...and ${total - 5} more! Visit Friends Gallery to see all: friends.html`;
            return reply;
        },

        // ---- FAMILY ----
        getFamilyReply() {
            const family = WEBSITE_DATA.family;
            return `👨‍👩‍👧‍👦 ${WEBSITE_DATA.displayName}'s Family:\n\n` +
                   `• Parents: ${family.parents}\n` +
                   `• Sisters: ${family.sisters}\n` +
                   `• Brothers: ${family.brothers}\n` +
                   `• Total Members: ${family.totalMembers}\n\n` +
                   `💡 Fun Fact: Diwali nights with family are his favorite memories!`;
        },

        // ---- EDUCATION ----
        getEducationReply() {
            const edu = WEBSITE_DATA.education;
            let reply = `🎓 ${WEBSITE_DATA.displayName}'s Education:\n\n`;
            edu.forEach(e => {
                reply += `• ${e.year}: ${e.class}\n`;
                reply += `  ${e.school}\n\n`;
            });
            reply += `📚 Favorite Subjects: Science & Hindi Literature`;
            return reply;
        },

        // ---- CONTACT ----
        getContactReply() {
            const contact = WEBSITE_DATA.contact;
            return `📬 Contact ${WEBSITE_DATA.displayName}:\n\n` +
                   `✉️ Email: ${contact.email}\n` +
                   `📱 Phone: ${contact.phone}\n` +
                   `📍 Location: ${contact.location}\n\n` +
                   `💬 You can also use the contact form: emailjs.html`;
        },

        // ---- SOCIAL ----
        getSocialReply() {
            const social = WEBSITE_DATA.social;
            return `🌐 Connect with ${WEBSITE_DATA.displayName}:\n\n` +
                   `🐙 GitHub: ${social.github}\n` +
                   `💼 LinkedIn: ${social.linkedin}\n` +
                   `🐦 Twitter: ${social.twitter}\n` +
                   `📺 YouTube: ${social.youtube}\n` +
                   `🌍 Website: ${social.website}`;
        },

        // ---- BIOGRAPHY ----
        getBiographyReply() {
            const chapters = WEBSITE_DATA.chapters;
            let reply = `📖 ${WEBSITE_DATA.displayName}'s Autobiography:\n\n` +
                        `"${WEBSITE_DATA.quote}"\n\n` +
                        `📚 ${chapters.length} Chapters:\n`;
            chapters.slice(0, 6).forEach(ch => {
                reply += `• Ch ${ch.number}: ${ch.title}\n`;
            });
            reply += `\n...and ${chapters.length - 6} more chapters!\n` +
                    `📥 Download ebook: Autobiography page\n` +
                    `🔗 Read online: autobiography.html`;
            return reply;
        },

        // ---- CAREER ----
        getCareerReply() {
            const career = WEBSITE_DATA.career;
            return `💼 ${WEBSITE_DATA.displayName}'s Career:\n\n` +
                   `• Experience: ${career.experience}\n` +
                   `• Projects: ${career.projects}\n` +
                   `• Started Coding: ${career.startYear}\n` +
                   `• Status: ${career.status}\n\n` +
                   `🎯 Goal: Full-Stack Developer & Entrepreneur\n` +
                   `🚀 Dream: Launch his own startup!`;
        },

        // ---- MOTTO ----
        getMottoReply() {
            return `💡 ${WEBSITE_DATA.displayName}'s Motto:\n\n` +
                   `"${WEBSITE_DATA.motto}"\n\n` +
                   `Also his favorite quote:\n` +
                   `"${WEBSITE_DATA.quote}"\n\n` +
                   `✨ His life philosophy: No regrets in life — that's his biggest achievement.`;
        },

        // ---- TEACHER ----
        getTeacherReply() {
            const teacher = WEBSITE_DATA.keyPeople.favoriteTeacher;
            return `👨‍🏫 ${WEBSITE_DATA.displayName}'s Favorite Teacher:\n\n` +
                   `• Name: ${teacher}\n` +
                   `• Subject: Hindi\n` +
                   `• School: Mother's Pride International School\n\n` +
                   `💬 "Binod Sir ne meri soch badli! Unhone sikhaya ki zindagi ka nazariya alag hona chahiye."`;
        },

        // ---- MILESTONE ----
        getMilestoneReply() {
            return `🏆 ${WEBSITE_DATA.displayName}'s Milestones:\n\n` +
                   `• 2023: First Line of Code (HTML "Hello World")\n` +
                   `• 2024: First Project (Portfolio)\n` +
                   `• 2026: 4+ Projects Complete\n` +
                   `• ${WEBSITE_DATA.career.projects} Projects Built\n` +
                   `• ${WEBSITE_DATA.career.experience} Experience\n\n` +
                   `🚀 Next Goal: Full-Stack Developer → Startup!`;
        },

        // ---- EBOOK ----
        getEbookReply() {
            return `📥 ${WEBSITE_DATA.ebook.title}\n\n` +
                   `📖 "${WEBSITE_DATA.ebook.subtitle}"\n` +
                   `✍️ By: ${WEBSITE_DATA.displayName}\n` +
                   `🌐 Languages: ${WEBSITE_DATA.ebook.languages.join(', ')}\n` +
                   `📚 ${WEBSITE_DATA.chapters.length} Chapters\n\n` +
                   `💡 Download ebook from Autobiography page!\n` +
                   `🔗 Read online: autobiography.html`;
        },

        // ---- HELP ----
        getHelpReply() {
            return `💡 I can help you with:\n\n` +
                   `• About ${WEBSITE_DATA.displayName}\n` +
                   `• Skills & Projects\n` +
                   `• Friends & Family\n` +
                   `• Education & Career\n` +
                   `• Contact & Social Links\n` +
                   `• Autobiography & Ebook\n\n` +
                   `Just ask me anything! 😊`;
        },

        // ---- TIME ----
        getTimeReply() {
            const now = new Date();
            return `⏰ Current time: ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}\n` +
                   `📅 Date: ${now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}\n` +
                   `📍 Timezone: IST (UTC+5:30)`;
        },

        // ---- FALLBACK ----
        getFallbackReply(text) {
            const fallbacks = [
                `That's a great question! 🤔 Let me think... Based on what I know about ${WEBSITE_DATA.displayName}:\n\n` +
                `• He's a ${WEBSITE_DATA.title} from ${WEBSITE_DATA.location}\n` +
                `• He has ${WEBSITE_DATA.career.projects} projects and ${WEBSITE_DATA.career.experience} experience\n` +
                `• He's always learning and improving\n\n` +
                `💡 Could you be more specific about what you'd like to know?`,

                `Interesting topic! 😊 I know a lot about ${WEBSITE_DATA.displayName}. Here are some things I can tell you about:\n\n` +
                `• His skills and projects\n` +
                `• His ${WEBSITE_DATA.friends.length} friends\n` +
                `• His family and education\n` +
                `• His autobiography and ebook\n\n` +
                `What would you like to know?`,

                `Hmm, that's something new! 🤔 I specialize in answering questions about ${WEBSITE_DATA.displayName} and his website.\n\n` +
                `Try asking about:\n` +
                `• Skills, Projects, Friends\n` +
                `• Family, Education, Contact\n` +
                `• Autobiography, Ebook, Career\n\n` +
                `I'm here to help! 😊`
            ];
            return fallbacks[Math.floor(Math.random() * fallbacks.length)];
        },

        // ---- CONTEXTUAL REPLY ----
        getContextualReply(userMessage) {
            this.lastActive = Date.now();
            const reply = this.getSmartReply(userMessage);
            this.history.push({ message: userMessage, reply, timestamp: Date.now() });
            if (this.history.length > 200) this.history.shift();
            return reply;
        }
    };

    // ============================================================
    // 5. UI FUNCTIONS
    // ============================================================
    function getTime() {
        const now = new Date();
        return String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    }

    function scrollToBottom() {
        if (DOM.messages) {
            DOM.messages.scrollTop = DOM.messages.scrollHeight;
        }
    }

    function addMessage(text, sender) {
        if (!DOM.messages) return;
        if (DOM.empty) DOM.empty.style.display = 'none';
        const div = document.createElement('div');
        div.className = `message ${sender}`;
        
        // Format: Replace newlines with <br>
        const formattedText = text.replace(/\n/g, '<br>');
        div.innerHTML = `${formattedText}<span class="msg-time">${getTime()}</span>`;
        DOM.messages.appendChild(div);
        
        // Re-attach quick buttons if they exist
        if (DOM.quickBtns) {
            DOM.messages.appendChild(DOM.quickBtns);
        }
        scrollToBottom();
    }

    function showTyping() {
        if (DOM.typing) {
            DOM.typing.style.display = 'flex';
            scrollToBottom();
        }
    }

    function hideTyping() {
        if (DOM.typing) {
            DOM.typing.style.display = 'none';
        }
    }

    // ============================================================
    // 6. QUICK REPLY BUTTONS
    // ============================================================
    function generateQuickReplies() {
        if (!DOM.quickBtns) return;
        const buttons = [
            { text: '👋 Hello', value: 'Hello' },
            { text: '💻 Skills', value: 'What skills do you have?' },
            { text: '🚀 Projects', value: 'Tell me about your projects' },
            { text: '👥 Friends', value: 'Who are your friends?' },
            { text: '🎓 Education', value: 'What is your education?' },
            { text: '📖 Autobiography', value: 'Tell me about your autobiography' },
            { text: '📬 Contact', value: 'How can I contact you?' },
            { text: '🏆 Motto', value: 'What is your motto?' }
        ];

        DOM.quickBtns.innerHTML = '';
        buttons.forEach(btn => {
            const el = document.createElement('button');
            el.className = 'quick-btn';
            el.textContent = btn.text;
            el.addEventListener('click', function(e) {
                e.stopPropagation();
                if (DOM.input) {
                    DOM.input.value = btn.value;
                    sendMessage();
                }
            });
            DOM.quickBtns.appendChild(el);
        });
    }

    // ============================================================
    // 7. SEND MESSAGE
    // ============================================================
    let isProcessing = false;

    function sendMessage() {
        if (!DOM.input || !DOM.send) return;
        const text = DOM.input.value.trim();
        if (!text || isProcessing) return;

        addMessage(text, 'user');
        DOM.input.value = '';
        DOM.input.focus();

        isProcessing = true;
        DOM.send.disabled = true;
        showTyping();

        // Dynamic delay based on message length
        const delay = 600 + Math.random() * 1200 + (text.length / 10) * 50;
        setTimeout(function() {
            hideTyping();
            const reply = Engine.getContextualReply(text);
            addMessage(reply, 'bot');
            isProcessing = false;
            DOM.send.disabled = false;
        }, delay);
    }

    // ============================================================
    // 8. INACTIVITY DETECTION
    // ============================================================
    setInterval(function() {
        const inactiveTime = Date.now() - Engine.lastActive;
        if (inactiveTime > 120000 && !isProcessing) {
            const messages = [
                "Still there? 🤔 I'm here if you need anything!",
                "Hello? 😊 Just checking in — need any help?",
                "I'm still here! 💫 Ask me anything about ${WEBSITE_DATA.displayName}'s website!"
            ];
            addMessage(messages[Math.floor(Math.random() * messages.length)], 'bot');
            Engine.lastActive = Date.now();
        }
    }, 60000);

    // ============================================================
    // 9. EVENT LISTENERS
    // ============================================================
    if (DOM.send) {
        DOM.send.addEventListener('click', function(e) {
            e.preventDefault();
            sendMessage();
        });
    }

    if (DOM.input) {
        DOM.input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    // ============================================================
    // 10. CLOSE CHATBOX
    // ============================================================
    window.closeChatbox = function() {
        if (document.referrer) {
            window.location.href = document.referrer;
        } else {
            window.history.back();
        }
    };

    // ============================================================
    // 11. KEYBOARD SHORTCUTS
    // ============================================================
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            if (DOM.input) DOM.input.focus();
        }
        if (e.key === 'Escape') {
            window.closeChatbox();
        }
    });

    // ============================================================
    // 12. INIT
    // ============================================================
    generateQuickReplies();
    setTimeout(function() {
        if (DOM.input) DOM.input.focus();
    }, 300);

    // ============================================================
    // 13. CONSOLE LOG — PRO LEVEL
    // ============================================================
    console.log('🤖 RJ AI Chatbox — Enterprise Edition v6.0');
    console.log('📊 Data Loaded:');
    console.log(`   • ${WEBSITE_DATA.projects.length} Projects`);
    console.log(`   • ${WEBSITE_DATA.friends.length} Friends`);
    console.log(`   • ${WEBSITE_DATA.chapters.length} Chapters`);
    console.log(`   • ${WEBSITE_DATA.education.length} Schools`);
    console.log(`   • ${Object.keys(WEBSITE_DATA.skills).length} Skill Categories`);
    console.log('🧠 Intent Detection: ' + Object.keys(INTENTS).length + ' intents');
    console.log('💡 Tip: Press Ctrl+/ to focus input, Escape to close.');
    console.log('🔥 Built by Ravi Raj — Professional Edition');

})();
