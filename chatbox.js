/* ============================================
   CHATBOX - UNLIMITED AI (20+ REAL SECTIONS) + REAL EMAIL
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Chatbox script loaded!');

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

    // ===== UNLIMITED AI MODE - 20+ REAL SECTIONS =====
    const aiReplies = {
        // ABOUT ME
        'about me': 'I\'m Ravi Raj, a 12th-grade student from Bandwar, Begusarai, Bihar. I\'m passionate about web development and love creating modern, responsive websites. I believe in learning by building projects. I\'m curious, hardworking, and always excited to learn new technologies!',

        // FAMILY
        'family': 'I come from a loving and supportive family. My parents have always been my biggest strength. My father is my role model - he taught me discipline, honesty, and hard work. My mother is the heart of our family; she takes care of everyone with so much love. I also have a younger brother, and we share a strong bond. My family has always supported me in every step of my journey.',

        // CHILDHOOD
        'childhood': 'I grew up in a small village called Bandwar in Begusarai, Bihar. My childhood was simple but full of joy. I used to play cricket with my friends, climb trees, and explore nature. I was always curious about how things work. I got my first computer in 8th grade, and that changed my life forever. I still cherish those innocent and carefree days.',

        // SCHOOL LIFE
        'school': 'I completed my 10th from Mother\'s Pride International School, Begusarai. I did my 12th from Udaan International School, Begusarai with Physics, Chemistry, and Maths. School life was amazing - full of friends, fun, and learning. I participated in many activities and always loved being in the computer lab!',

        // TEACHERS
        'teachers': 'I\'ve been lucky to have some amazing teachers. My computer teacher was the one who introduced me to the world of coding. My math teacher taught me logic and problem-solving. I believe great teachers shape not just careers, but character. I\'m grateful to all my teachers for their guidance and support.',

        // FRIENDS
        'friends': 'Friends are the family we choose. I have a small but close group of friends who have been with me through thick and thin. We share dreams, laughs, and sometimes even tiffin! They motivate me to be better and always have my back. True friendship is rare, and I\'m grateful to have them in my life.',

        // CODING JOURNEY
        'coding': 'My coding journey started in 2023 when I was in 10th grade. I learned HTML and CSS first and built my first webpage. I was so happy that I knew this is what I want to do. Then I learned JavaScript, and now I\'m learning Python and Node.js. Every day, I try to learn something new and build something cool. Coding is not just a skill for me; it\'s my passion.',

        // SKILLS
        'skills': 'I work with HTML5 (75%), CSS3 (80%), JavaScript (50%), Python (50%), and Responsive Design (70%). I\'m also comfortable with VS Code, Git & GitHub, and Chrome DevTools. I believe in writing clean, readable code and love creating user-friendly designs.',

        // PROJECTS
        'projects': 'I\'ve built some exciting projects so far. My Personal Portfolio v2.0 is a modern, responsive website with Matrix animation, smooth scrolling, and dark/light theme. I also built a Modern Landing Page with smooth animations and gradient effects. I\'m constantly working on new projects to improve my skills.',

        // CAREER GOAL
        'goal': 'My ultimate goal is to become a Full-Stack Developer. I want to work on real-world projects that make a difference. I plan to learn backend technologies like Node.js, databases, and cloud deployment. In the next 5 years, I see myself working at a tech company or building my own startup. I believe in continuous learning.',

        // DREAM
        'dream': 'My dream is to build something that helps people, something that makes technology accessible to everyone. I also dream of traveling the world, meeting new people, and experiencing different cultures. I want to become financially independent and support my family. I know the road is long, but I\'m ready.',

        // LIFE PHILOSOPHY
        'philosophy': 'I believe in being kind, honest, and hardworking. Life is a journey, not a race. I think success comes when you enjoy what you do. I try to stay positive, learn from failures, and always help others. My philosophy is simple: Live, Learn, and Grow.',

        // ROLE MODELS
        'role models': 'My role models are my parents. They\'ve faced many challenges but always stayed strong. I also admire Dr. APJ Abdul Kalam for his simplicity and vision. I look up to people who are humble, hardworking, and dedicated to their work.',

        // FAVOURITE THINGS
        'favourites': 'I love listening to music, especially A.R. Rahman and Old Bollywood songs. My favourite food is anything made by my mom, especially dal chawal and aloo paratha. I enjoy reading books on technology and self-improvement. I also love watching cricket and playing with friends.',

        // TRAVEL
        'travel': 'I haven\'t traveled much yet, but I dream of visiting places like Manali, Goa, and Kerala. I also want to explore cities like Bangalore, Mumbai, and Hyderabad for tech exposure. Traveling excites me because it teaches you new things and gives you fresh perspectives.',

        // FUTURE PLANS
        'future plans': 'I want to pursue higher studies in Computer Science. I\'m planning to join a good college and build a strong network. Along with college, I\'ll keep learning, building projects, and maybe start freelancing. I want to be financially independent by 20.',

        // GIRLFRIEND
        'girlfriend': 'Haha, not yet! I\'m focused on my studies and building my career right now. But who knows what the future holds? I believe relationships should be based on trust, respect, and mutual growth. When the time is right, I\'ll find someone who shares my dreams.',

        // MOTIVATION
        'motivation': 'What keeps me going? My parents, my dreams, and the hunger to become better every day. I also get motivated by reading success stories of people who started from nothing. I believe if they can do it, I can too. Hard work never fails.',

        // STRUGGLE
        'struggle': 'I\'ve faced many challenges - limited resources, small town, no guidance at first. But I never gave up. I learned from YouTube, practiced daily, and asked for help when needed. Struggles made me stronger and more focused. I believe struggle is the stepping stone to success.',

        // SUCCESS
        'success': 'To me, success is not about money or fame. It\'s about waking up every day and being excited about what you do. It\'s about learning, growing, and making a difference. I feel successful when my parents smile, when I learn something new, and when I help someone. That\'s true success.',

        // CONTACT
        'contact': 'If you want to connect with me, just click the "Contact Me" mode below! I\'ll reply within 24 hours. You can also check my LinkedIn, Twitter, and YouTube links in the social section. I\'d love to hear from you!',

        // DEFAULT
        'default': 'That\'s a thoughtful question! 😊 I\'d love to share more. Could you ask me something specific about my life, work, or dreams? I\'m here to chat!'
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
            <div class="message bot">Ask me about my life, family, skills, projects, dreams, or just have a conversation! 😊</div>
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
        }, 500 + Math.random() * 600);
    }

    aiSend.addEventListener('click', sendAIMessage);
    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendAIMessage();
    });

    aiBackBtn.addEventListener('click', resetToModeSelection);

    // ===== REAL CONTACT MODE - EMAILJS (FIXED) =====
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

        // REAL EMAILJS
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

    console.log('✅ Chatbox initialized successfully! (Unlimited AI + Real Email)');
}
