/* ============================================================
   PROJECT BEEJ — birthday.js (v16 Final)
   Language + Journey + Photo + All Features
   ============================================================ */

/* ---------- CONFIG ---------- */
const BEEJ_CONFIG = {
  secretPassword: 'dost',
  storageKey: 'beej_chain_v16',
  hueKey: 'beej_hue_v16',
  themeKey: 'beej_theme_v16',
  wishKey: 'beej_wishes_v16',
  capsuleKey: 'beej_capsules_v16',
  langKey: 'beej_lang_v16',
  stepKey: 'beej_step_v16',
  userName: 'RaviRaj',
  casualPhoto: './assets/images/casual.jpg',
  maxChainLength: 50,
  balloonCount: 6,
  photoCount: 4,
  micThreshold: 65,
  quizCount: 5,
  memoryPairs: 6,
  totalChapters: 9,
};

/* ---------- STATE ---------- */
const state = {
  lang: 'hinglish',
  chain: [],
  friend: { name: '', gender: '', hue: 45, hash: '' },
  selectedGender: '',
  musicPlaying: false,
  audioCtx: null,
  micStream: null,
  analyser: null,
  blowDetected: false,
  balloonScore: 0,
  photoStripCount: 0,
  currentTheme: 'dark',
  currentFilter: 'none',
  memoryFlipped: [],
  memoryMatched: 0,
  memoryMoves: 0,
  memoryLock: false,
  quizIndex: 0,
  quizScore: 0,
  wheelSpinning: false,
  voiceRecognition: null,
  voiceListening: false,
  nameTunePlaying: false,
  currentStep: 1,
  photoStream: null,
  capturedPhoto: null,
};

/* ---------- HELPERS ---------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ============================================================
   TRANSLATIONS
   ============================================================ */
const I18N = {
  english: {
    'lang.title': '🌐 Choose Language',
    'lang.subtitle': 'Choose your language',
    'lang.hint': 'You can change later from footer',
    'lang.descEn': 'Formal • Elegant',
    'lang.descHi': 'Dost-friendly • Fun',
    'lang.changeTitle': '🌐 Change Language',
    'gate.title': 'Secret Gate',
    'gate.blocks': 'blocks mined',
    'gate.proof': 'Proof-of-Dosti',
    'gate.status': 'Only for friends • Hint: what are we?',
    'gate.placeholder': 'Password...',
    'gate.button': 'Unlock →',
    'gate.hint': 'Tip: Password is our common word.',
    'id.title': 'Soul ID',
    'id.subtitle': 'Your frequency creates a color',
    'id.namePlaceholder': 'Your name?',
    'id.genderLabel': 'Who are you?',
    'id.male': 'Male',
    'id.female': 'Female',
    'id.other': 'Other',
    'id.freq': 'Freq: -- Hz • Hue: --°',
    'id.button': 'Generate Frequency →',
    'booth.title': 'Emotion Booth',
    'booth.subtitle': 'Smile and magic happens ✨',
    'booth.status': 'On-device • No upload • 100% private',
    'booth.start': '📸 Camera On',
    'booth.skip': 'Skip →',
    'hack.title': 'Memory Hack',
    'hack.subtitle': 'Dosti chain compiling...',
    'journey.tapHint': 'Tap Aage → to continue',
    'chain.title': '⛓️ Dosti Chain',
    'cert.title': '🏆 Certificate of Dosti',
    'photoframe.title': '📸 Photo With RaviRaj',
    'photoframe.subtitle': 'A memory that stays forever — us together',
    'photoframe.status': 'Turn on camera, then click',
    'photoframe.start': '📸 Turn Camera On',
    'photoframe.click': '🎬 Click Photo',
    'photoframe.retake': '🔄 Retake',
    'photoframe.downloadPng': '📥 Download PNG',
    'photoframe.downloadJpg': '📥 Download JPG',
    'photoframe.share': '💬 Share on WhatsApp',
    'balloon.title': '🎈 Balloon Pop',
    'memory.title': '🃏 Memory Match',
    'memory.score': 'Score',
    'memory.moves': 'Moves',
    'memory.reset': '🔄 Reset',
    'quiz.title': '🧠 How Well Do You Know Me?',
    'letter.title': '💌 Message from RaviRaj',
    'letter.png': 'PNG',
    'letter.txt': 'TXT',
    'wishwall.title': '💌 Wish Wall',
    'wishwall.placeholder': 'Write your wish...',
    'wishwall.add': '💛 Add Wish',
    'timeline.title': '📜 Memory Lane',
    'cake.title': '🎂 Birthday Cake',
    'cake.hint': 'Blow on mic',
    'cake.mic': '🎤 Mic Enable',
    'fortune.title': '🥠 Fortune Cookie',
    'fortune.hint': 'Break cookie → see destiny',
    'fortune.open': '🔮 Open',
    'wheel.title': '🎡 Compliment Wheel',
    'wheel.spin': '🎯 Spin',
    'gifts.title': '🎁 Gift Boxes',
    'compliment.title': '💬 Compliment Machine',
    'compliment.hint': 'Press button → hear a truth 💛',
    'compliment.button': '🎁 Say a Truth',
    'nametune.title': '🎵 Your Name in Music',
    'nametune.subtitle': 'Your letters create a unique tune',
    'nametune.play': '🎼 Play My Tune',
    'nametune.stop': '⏹️ Stop',
    'capsule.title': '⏳ Time Capsule',
    'capsule.subtitle': 'Write a message — opens in a year',
    'capsule.placeholder': 'What do you want to tell your future self?',
    'capsule.save': '🔒 Lock Capsule',
    'countdown.title': '⏳ Next Birthday',
    'voice.title': '🎤 Voice Command',
    'voice.hint': 'Say: "Happy Birthday" → blow candles',
    'voice.off': 'Mic is off',
    'voice.start': '🎤 Voice On',
    'voice.stop': '⏹️ Stop',
    'share.title': '🔗 Share Experience',
    'share.placeholder': 'Generate link...',
    'share.generate': '🔗 Generate Link',
    'share.copy': '📋 Copy',
    'share.whatsapp': '💬 Send on WhatsApp',
    'qr.title': '📱 QR Code',
    'qr.download': '📥 QR Download',
    'theme.title': '🎨 Choose Theme',
    'footer.restart': '🔄 New Friend',
    'footer.offline': 'Fully Offline',
    'nav.back': 'Back',
    'nav.next': 'Next',
    'error.wrongPass': '❌ Wrong password, think again!',
  },
  hinglish: {
    'lang.title': '🌐 Bhasha Chuno',
    'lang.subtitle': 'Apni bhasha chuno',
    'lang.hint': 'Baad me footer se change kar sakte ho',
    'lang.descEn': 'Formal • Elegant',
    'lang.descHi': 'Dost-friendly • Fun',
    'lang.changeTitle': '🌐 Bhasha Badlo',
    'gate.title': 'Secret Gate',
    'gate.blocks': 'blocks mined',
    'gate.proof': 'Proof-of-Dosti',
    'gate.status': 'Sirf doston ke liye • Hint: hum kya hain?',
    'gate.placeholder': 'Password...',
    'gate.button': 'Unlock →',
    'gate.hint': 'Tip: Password tumhara aur mera common word hai.',
    'id.title': 'Soul ID',
    'id.subtitle': 'Tumhari frequency se rang banega',
    'id.namePlaceholder': 'Tumhara naam?',
    'id.genderLabel': 'Tum kaun ho?',
    'id.male': 'Male',
    'id.female': 'Female',
    'id.other': 'Other',
    'id.freq': 'Freq: -- Hz • Hue: --°',
    'id.button': 'Generate Frequency →',
    'booth.title': 'Emotion Booth',
    'booth.subtitle': 'Muskurao toh magic hoga ✨',
    'booth.status': 'On-device • No upload • 100% private',
    'booth.start': '📸 Camera On',
    'booth.skip': 'Skip →',
    'hack.title': 'Memory Hack',
    'hack.subtitle': 'Dosti chain compile ho rahi hai...',
    'journey.tapHint': 'Tap Aage → to continue',
    'chain.title': '⛓️ Dosti Chain',
    'cert.title': '🏆 Certificate of Dosti',
    'photoframe.title': '📸 RaviRaj Ke Saath Photo',
    'photoframe.subtitle': 'Ek yaad jo hamesha rahegi — hum dono ek saath',
    'photoframe.status': 'Camera on karo, phir click karo',
    'photoframe.start': '📸 Camera On Karo',
    'photoframe.click': '🎬 Photo Click Karo',
    'photoframe.retake': '🔄 Dobara Click',
    'photoframe.downloadPng': '📥 Download PNG',
    'photoframe.downloadJpg': '📥 Download JPG',
    'photoframe.share': '💬 WhatsApp Pe Bhejo',
    'balloon.title': '🎈 Balloon Pop',
    'memory.title': '🃏 Memory Match',
    'memory.score': 'Score',
    'memory.moves': 'Moves',
    'memory.reset': '🔄 Reset',
    'quiz.title': '🧠 Kitna Jaanta Hai Mujhe?',
    'letter.title': '💌 Message from RaviRaj',
    'letter.png': 'PNG',
    'letter.txt': 'TXT',
    'wishwall.title': '💌 Wish Wall',
    'wishwall.placeholder': 'Apni wish likho...',
    'wishwall.add': '💛 Add Wish',
    'timeline.title': '📜 Memory Lane',
    'cake.title': '🎂 Birthday Cake',
    'cake.hint': 'Mic pe phook maaro',
    'cake.mic': '🎤 Mic Enable',
    'fortune.title': '🥠 Fortune Cookie',
    'fortune.hint': 'Cookie todo → kismat dekho',
    'fortune.open': '🔮 Kholo',
    'wheel.title': '🎡 Compliment Wheel',
    'wheel.spin': '🎯 Spin',
    'gifts.title': '🎁 Gift Boxes',
    'compliment.title': '💬 Compliment Machine',
    'compliment.hint': 'Button dabao → ek sach sunao 💛',
    'compliment.button': '🎁 Ek Sach Sunao',
    'nametune.title': '🎵 Tumhara Naam Ek Tune Me',
    'nametune.subtitle': 'Tumhare naam ke letters se ek unique dhun banti hai',
    'nametune.play': '🎼 Meri Dhun Baja',
    'nametune.stop': '⏹️ Stop',
    'capsule.title': '⏳ Time Capsule',
    'capsule.subtitle': 'Apna message likho — ek saal baad khulega',
    'capsule.placeholder': 'Apne future self ko kya kehna chahte ho?',
    'capsule.save': '🔒 Capsule Lock Karo',
    'countdown.title': '⏳ Agla Birthday',
    'voice.title': '🎤 Voice Command',
    'voice.hint': 'Bolo: "Happy Birthday" → candles bujho',
    'voice.off': 'Mic band hai',
    'voice.start': '🎤 Voice On Karo',
    'voice.stop': '⏹️ Band Karo',
    'share.title': '🔗 Experience Share Karo',
    'share.placeholder': 'Link generate karo...',
    'share.generate': '🔗 Link Banao',
    'share.copy': '📋 Copy',
    'share.whatsapp': '💬 WhatsApp Pe Bhejo',
    'qr.title': '📱 QR Code',
    'qr.download': '📥 QR Download',
    'theme.title': '🎨 Theme Chuno',
    'footer.restart': '🔄 Naya Dost',
    'footer.offline': 'Fully Offline',
    'nav.back': 'Peeche',
    'nav.next': 'Aage',
    'error.wrongPass': '❌ Galat password, dobara soch!',
  }
};

function t(key) {
  return I18N[state.lang][key] || I18N.english[key] || key;
}

function applyLanguage(lang) {
  state.lang = lang;
  localStorage.setItem(BEEJ_CONFIG.langKey, lang);
  document.body.setAttribute('data-lang', lang);
  document.documentElement.lang = lang === 'english' ? 'en' : 'hi';

  $$('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  $$('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });

  $$('.lang-btn').forEach((btn) => {
    btn.setAttribute('aria-pressed', btn.dataset.lang === lang ? 'true' : 'false');
  });
}

/* ============================================================
   SCENE SYSTEM
   ============================================================ */
function showScene(id) {
  $$('.scene').forEach((s) => {
    s.classList.remove('scene--active');
    s.hidden = true;
  });
  const target = $(id);
  if (target) {
    target.classList.add('scene--active');
    target.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/* ============================================================
   STORAGE
   ============================================================ */
function loadChain() {
  try {
    const raw = localStorage.getItem(BEEJ_CONFIG.storageKey);
    state.chain = raw ? JSON.parse(raw) : [];
  } catch { state.chain = []; }
}

function saveChain() {
  try {
    if (state.chain.length > BEEJ_CONFIG.maxChainLength) {
      state.chain = state.chain.slice(-BEEJ_CONFIG.maxChainLength);
    }
    localStorage.setItem(BEEJ_CONFIG.storageKey, JSON.stringify(state.chain));
  } catch (e) { console.warn(e); }
}

/* ============================================================
   CRYPTO
   ============================================================ */
async function sha256(str) {
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
  } catch {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }
}

function simpleEncrypt(text, key) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result);
}

function simpleDecrypt(encoded, key) {
  try {
    const text = atob(encoded);
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  } catch { return null; }
}

/* ============================================================
   VOICE WISH
   ============================================================ */
function speakWish(name, gender) {
  if (!('speechSynthesis' in window)) return;
  const msg = new SpeechSynthesisUtterance();
  if (state.lang === 'english') {
    msg.text = `Happy Birthday, ${name}! May your day be as special as you are.`;
  } else {
    msg.text = `Happy Birthday, ${name}! Tera din sabse accha ho.`;
  }
  msg.lang = state.lang === 'english' ? 'en-IN' : 'hi-IN';
  msg.rate = 0.9;
  msg.pitch = gender === 'female' ? 1.2 : 0.9;
  msg.volume = 0.9;
  setTimeout(() => window.speechSynthesis.speak(msg), 800);
}

/* ============================================================
   VIBRATION
   ============================================================ */
function vibrate(pattern = 50) {
  if ('vibrate' in navigator) { try { navigator.vibrate(pattern); } catch {} }
}

/* ============================================================
   SOUND EFFECTS
   ============================================================ */
function playTone(freq, duration, type = 'sine', volume = 0.15) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.02);
    setTimeout(() => ctx.close(), (duration + 0.1) * 1000);
  } catch {}
}
function sfxClick() { playTone(800, 0.08, 'square', 0.08); }
function sfxPop() { playTone(600, 0.15, 'sine', 0.15); }
function sfxSuccess() {
  playTone(523, 0.1);
  setTimeout(() => playTone(659, 0.1), 100);
  setTimeout(() => playTone(784, 0.25), 200);
}
function sfxWhoosh() { playTone(300, 0.3, 'sawtooth', 0.06); }
function sfxError() { playTone(200, 0.2, 'sawtooth', 0.1); }
function sfxReveal() {
  playTone(440, 0.1);
  setTimeout(() => playTone(660, 0.15), 100);
}

/* ============================================================
   CONFETTI
   ============================================================ */
function fireConfetti(count = 60) {
  const colors = ['#d4af37', '#f3e6b5', '#ff6b9d', '#4ade80', '#60a5fa', '#fbbf24'];
  const shapes = ['●', '◆', '■', '▲', '★'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const isEmoji = Math.random() > 0.7;
    p.style.cssText = `
      position:fixed; top:-20px; left:${Math.random() * 100}vw;
      font-size:${isEmoji ? '20px' : '10px'};
      color:${colors[Math.floor(Math.random() * colors.length)]};
      pointer-events:none; z-index:9999;
      animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
      ${isEmoji ? '' : `background:${colors[Math.floor(Math.random() * colors.length)]}; width:8px;height:8px;border-radius:50%;`}
    `;
    if (isEmoji) p.textContent = shapes[Math.floor(Math.random() * shapes.length)];
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 4500);
  }
  if (!document.getElementById('confetti-style')) {
    const style = document.createElement('style');
    style.id = 'confetti-style';
    style.textContent = `@keyframes confettiFall { 0%{transform:translateY(0) rotate(0);opacity:1} 100%{transform:translateY(105vh) rotate(720deg);opacity:0} }`;
    document.head.appendChild(style);
  }
}

/* ============================================================
   THEMES
   ============================================================ */
const THEMES = {
  dark:   { '--bg': '#0a0f1e', '--bg-soft': '#121a32', '--gold': '#d4af37', '--gold-soft': '#f3e6b5', '--text': '#eef2ff', '--muted': '#9aa4c7' },
  light:  { '--bg': '#f8f5ec', '--bg-soft': '#ede5d0', '--gold': '#a8842a', '--gold-soft': '#8a6a1f', '--text': '#1e293b', '--muted': '#64748b' },
  rose:   { '--bg': '#1a0a14', '--bg-soft': '#2a0f1f', '--gold': '#f472b6', '--gold-soft': '#fbcfe8', '--text': '#ffe4ef', '--muted': '#c48ba8' },
  ocean:  { '--bg': '#051424', '--bg-soft': '#0a1f35', '--gold': '#38bdf8', '--gold-soft': '#bae6fd', '--text': '#e0f2fe', '--muted': '#7dd3fc' },
  forest: { '--bg': '#051a10', '--bg-soft': '#0a2a1a', '--gold': '#4ade80', '--gold-soft': '#bbf7d0', '--text': '#dcfce7', '--muted': '#86efac' },
  purple: { '--bg': '#12082a', '--bg-soft': '#1e0f42', '--gold': '#a78bfa', '--gold-soft': '#ddd6fe', '--text': '#ede9fe', '--muted': '#c4b5fd' },
};

function applyTheme(name) {
  const theme = THEMES[name];
  if (!theme) return;
  Object.entries(theme).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
  state.currentTheme = name;
  localStorage.setItem(BEEJ_CONFIG.themeKey, name);
}

function initThemeSwitcher() {
  const saved = localStorage.getItem(BEEJ_CONFIG.themeKey);
  if (saved) applyTheme(saved);

  const container = $('#theme-picker-container');
  if (!container || container.querySelector('.theme-picker')) return;

  const picker = document.createElement('div');
  picker.className = 'theme-picker';
  picker.innerHTML = `
    <div class="theme-dots">
      ${Object.keys(THEMES).map(t => `
        <button type="button" class="theme-dot" data-theme="${t}" style="background:${THEMES[t]['--gold']}" title="${t}" aria-label="${t} theme"></button>
      `).join('')}
    </div>
  `;
  container.appendChild(picker);

  picker.querySelectorAll('.theme-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      applyTheme(dot.dataset.theme);
      sfxClick(); vibrate(30);
      picker.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });
  const activeDot = picker.querySelector(`[data-theme="${state.currentTheme}"]`);
  if (activeDot) activeDot.classList.add('active');
}

/* ============================================================
   COMPLIMENTS
   ============================================================ */
const COMPLIMENTS = {
  english: [
    "You are the funniest person I know 😄",
    "Your smile makes anyone's day ☀️",
    "You are the best part of my life 💛",
    "A friend like you is 1 in a million 💎",
    "You are a true legend! 🏆",
    "Your energy is contagious ⚡",
    "You are as strong as you are kind 💪",
    "You are the best listener I know 👂",
    "Every moment with you is memorable ✨",
    "You are not just a friend, you are family 🏠",
    "When you laugh, everything feels right 😊",
    "You are 100% original — no copy 🌟",
    "You have a solution for every problem 🧠",
    "You are the most loyal friend 🎯",
    "Your honesty is my favourite thing 💯",
  ],
  hinglish: [
    "Tu sabse funny insaan hai jise main jaanta hun 😄",
    "Teri smile kisi ka bhi din bana deti hai ☀️",
    "Tu meri zindagi ka sabse accha hissa hai 💛",
    "Tere jaise dost 1 lakh me 1 milta hai 💎",
    "Tu wakai legend hai, bhai! 🏆",
    "Teri energy contagious hai ⚡",
    "Tu jitna strong hai, utna hi pyara bhi hai 💪",
    "Tu sunne me bhi sabse accha hai 👂",
    "Tere saath har pal yaadgar ban jata hai ✨",
    "Tu mere liye sirf dost nahi, family hai 🏠",
    "Tu jab hasti/hasta hai, sab theek lagta hai 😊",
    "Tu ekdum original piece hai — copy nahi 🌟",
    "Tere paas har problem ka solution hota hai 🧠",
    "Tu wakai sabse loyal dost hai 🎯",
    "Teri honesty meri favourite cheez hai 💯",
  ]
};

function getCompliment() {
  const list = COMPLIMENTS[state.lang] || COMPLIMENTS.hinglish;
  return list[Math.floor(Math.random() * list.length)];
}

/* ============================================================
   JOURNEY SYSTEM
   ============================================================ */
const CHAPTERS = {
  1: { emoji: '🌱', en: 'Welcome', hi: 'Swagat' },
  2: { emoji: '⛓️', en: 'Dosti Chain', hi: 'Dosti Chain' },
  3: { emoji: '📸', en: 'Photo With RaviRaj', hi: 'RaviRaj Ke Saath' },
  4: { emoji: '🎮', en: 'Play Time', hi: 'Khel Khel Me' },
  5: { emoji: '💌', en: 'From the Heart', hi: 'Dil Se' },
  6: { emoji: '🎂', en: 'Wish Fulfilled', hi: 'Wish Poori' },
  7: { emoji: '🎨', en: 'Colors of Dosti', hi: 'Dosti Ke Rang' },
  8: { emoji: '🌳', en: 'Your BEEJ', hi: 'Tumhara BEEJ' },
  9: { emoji: '🔗', en: 'Share & Goodbye', hi: 'Share + Alvida' },
};

function updateChapterHeader() {
  const chapter = CHAPTERS[state.currentStep];
  if (!chapter) return;
  const label = $('#chapter-label');
  const title = $('#chapter-title');
  const progress = $('#journey-progress');
  const fill = $('#journey-progress-fill');

  if (label) {
    label.textContent = `Chapter ${state.currentStep} / ${BEEJ_CONFIG.totalChapters}`;
  }
  if (title) {
    const name = state.lang === 'english' ? chapter.en : chapter.hi;
    title.textContent = `${chapter.emoji} ${name}`;
  }
  const percent = Math.round((state.currentStep / BEEJ_CONFIG.totalChapters) * 100);
  if (fill) fill.style.width = percent + '%';
  if (progress) progress.setAttribute('aria-valuenow', percent);

  const backBtn = $('#nav-back');
  const nextBtn = $('#nav-next');
  if (backBtn) {
    backBtn.disabled = state.currentStep <= 1;
    backBtn.innerHTML = `← <span data-i18n="nav.back">${t('nav.back')}</span>`;
  }
  if (nextBtn) {
    nextBtn.disabled = state.currentStep >= BEEJ_CONFIG.totalChapters;
    if (state.currentStep >= BEEJ_CONFIG.totalChapters) {
      nextBtn.innerHTML = state.lang === 'english' ? '🎉 Done' : '🎉 Poora Hua';
    } else {
      nextBtn.innerHTML = `<span data-i18n="nav.next">${t('nav.next')}</span> →`;
    }
  }
}

function showStep(stepNum) {
  const currentStepEl = document.querySelector(`.step[data-step="${state.currentStep}"]`);
  const nextStepEl = document.querySelector(`.step[data-step="${stepNum}"]`);

  if (!nextStepEl || stepNum === state.currentStep) return;

  if (currentStepEl) {
    currentStepEl.classList.add('step--exiting');
    setTimeout(() => {
      currentStepEl.classList.remove('step--exiting');
      currentStepEl.hidden = true;
      currentStepEl.classList.remove('step--active');

      nextStepEl.hidden = false;
      nextStepEl.classList.add('step--active');
      state.currentStep = stepNum;
      localStorage.setItem(BEEJ_CONFIG.stepKey, stepNum);
      updateChapterHeader();
      onStepEnter(stepNum);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 350);
  } else {
    nextStepEl.hidden = false;
    nextStepEl.classList.add('step--active');
    state.currentStep = stepNum;
    updateChapterHeader();
    onStepEnter(stepNum);
  }

  sfxWhoosh();
  vibrate(20);
}

function nextStep() {
  if (state.currentStep < BEEJ_CONFIG.totalChapters) {
    showStep(state.currentStep + 1);
  }
}

function prevStep() {
  if (state.currentStep > 1) {
    showStep(state.currentStep - 1);
  }
}

function onStepEnter(stepNum) {
  switch (stepNum) {
    case 1: break;
    case 2: renderChain(); renderCertificate(); break;
    case 3: initPhotoFrame(); break;
    case 4: initBalloons(); initMemoryMatch(); initQuiz(); break;
    case 5: initWishWall(); initTimeline(); break;
    case 6: initCake(); initFortune(); break;
    case 7: initWheel(); initGiftBoxes(); initCompliment(); break;
    case 8: initNameTune(); initTimeCapsule(); initCountdown(); break;
    case 9: initVoiceCommand(); initUrlSharing(); initQRCode(); initThemeSwitcher(); initLangChange(); break;
  }
}

/* ============================================================
   00. LANGUAGE SELECT — ALWAYS SHOWS
   ============================================================ */
function initLanguageSelect() {
  const langBtns = $$('.lang-btn');

  // Apply saved language (for translations) but ALWAYS show screen
  const saved = localStorage.getItem(BEEJ_CONFIG.langKey);
  if (saved) {
    state.lang = saved;
    applyLanguage(saved);
  } else {
    applyLanguage('hinglish');
  }

  // Always show language screen
  showScene('#scene-language');

  // Mark active button
  langBtns.forEach((btn) => {
    btn.setAttribute('aria-pressed', btn.dataset.lang === state.lang ? 'true' : 'false');
  });

  // Click handlers
  langBtns.forEach((btn) => {
    // Remove old handlers by cloning
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
  });

  // Re-query after cloning
  const freshBtns = $$('.lang-btn');
  freshBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      applyLanguage(lang);
      sfxClick();
      vibrate(30);

      freshBtns.forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');

      setTimeout(() => {
        fireConfetti(20);
        showScene('#scene-gate');
      }, 400);
    });
  });
}

/* ============================================================
   LANGUAGE CHANGE (Footer)
   ============================================================ */
function initLangChange() {
  const container = $('#lang-change-container');
  if (!container || container.querySelector('.language-grid')) return;

  const saved = localStorage.getItem(BEEJ_CONFIG.langKey) || 'hinglish';

  container.innerHTML = `
    <div class="language-grid">
      <button type="button" class="lang-btn" data-lang="english" aria-pressed="${saved === 'english'}">
        <span class="lang-flag">🇬🇧</span>
        <span class="lang-name">English</span>
      </button>
      <button type="button" class="lang-btn" data-lang="hinglish" aria-pressed="${saved === 'hinglish'}">
        <span class="lang-flag">🇮🇳</span>
        <span class="lang-name">Hinglish</span>
      </button>
    </div>
  `;

  container.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (lang === state.lang) return;

      applyLanguage(lang);
      sfxSuccess();
      vibrate([30, 50, 30]);
      fireConfetti(15);

      container.querySelectorAll('.lang-btn').forEach(b => {
        b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false');
      });

      // Refresh dynamic content
      updateChapterHeader();
      renderChain();
      renderCertificate();
      initTimeline();
      initGiftBoxes();
    });
  });
}

/* ============================================================
   01. GATE
   ============================================================ */
function initGate() {
  loadChain();
  const countEl = $('#gate-chain-count');
  if (countEl) countEl.textContent = state.chain.length;

  const form = $('#gate-form');
  const input = $('#gate-pass');
  const errorEl = $('#gate-error');
  const box = $('#gate-box');
  if (!form || form.dataset.init === 'true') return;
  form.dataset.init = 'true';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim().toLowerCase();
    if (val === BEEJ_CONFIG.secretPassword) {
      errorEl.textContent = '';
      box.classList.remove('error');
      sfxSuccess(); vibrate(50); fireConfetti(30);
      showScene('#scene-id');
      setTimeout(() => $('#friend-name')?.focus(), 300);
    } else {
      errorEl.textContent = t('error.wrongPass');
      box.classList.add('error');
      input.value = '';
      input.focus();
      vibrate([100, 50, 100]);
      setTimeout(() => box.classList.remove('error'), 500);
    }
  });
}

/* ============================================================
   02. SOUL ID
   ============================================================ */
function initSoulId() {
  const nameInput = $('#friend-name');
  const genderBtns = $$('.gender-btn');
  const nextBtn = $('#id-next');
  const freqEl = $('#freq-preview');
  const errorEl = $('#id-error');
  if (!nameInput || nameInput.dataset.init === 'true') return;
  nameInput.dataset.init = 'true';

  nameInput.addEventListener('input', () => {
    const name = nameInput.value.trim();
    if (name.length > 0) {
      const hue = computeHue(name);
      if (freqEl) freqEl.textContent = `Freq: ${name.length * 7} Hz • Hue: ${hue}°`;
    } else {
      if (freqEl) freqEl.textContent = t('id.freq');
    }
    updateNextButton();
  });

  genderBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      genderBtns.forEach((b) => {
        b.classList.remove('selected');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('selected');
      btn.setAttribute('aria-pressed', 'true');
      state.selectedGender = btn.dataset.gender;
      sfxClick(); vibrate(20);
      updateNextButton();
    });
  });

  function updateNextButton() {
    const nameOk = nameInput.value.trim().length >= 2;
    const genderOk = state.selectedGender !== '';
    nextBtn.disabled = !(nameOk && genderOk);
  }

  nextBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    if (!name || !state.selectedGender) return;

    const hue = computeHue(name);
    document.documentElement.style.setProperty('--hue', hue);
    localStorage.setItem(BEEJ_CONFIG.hueKey, hue);

    state.friend = { name, gender: state.selectedGender, hue };

    const prevHash = state.chain.length > 0 ? state.chain[state.chain.length - 1].hash : 'GENESIS';
    const data = `${name}|${state.selectedGender}|${prevHash}|${Date.now()}`;
    const hash = await sha256(data);

    const block = {
      name, gender: state.selectedGender, hash, prev: prevHash,
      time: new Date().toLocaleString('en-IN'), hue,
    };
    state.friend.hash = hash;
    state.chain.push(block);
    saveChain();

    errorEl.textContent = '';
    sfxWhoosh(); vibrate(40);
    startHackSequence(name);
  });
}

function computeHue(name) {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return sum % 360;
}

/* ============================================================
   03. BOOTH
   ============================================================ */
function initBooth() {
  const startBtn = $('#booth-start');
  const skipBtn = $('#booth-skip');
  const video = $('#video');
  const status = $('#smile-status');
  if (!startBtn || !video || startBtn.dataset.init === 'true') return;
  startBtn.dataset.init = 'true';

  let stream = null;

  startBtn.addEventListener('click', async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 } }, audio: false,
      });
      video.srcObject = stream;
      await video.play();
      status.textContent = state.lang === 'english'
        ? 'Camera ready • Smile 📸'
        : 'Camera ready • Muskurao 📸';
      startBtn.textContent = state.lang === 'english' ? '📸 Click Photo' : '📸 Photo Click Karo';
      startBtn.onclick = capturePhoto;
    } catch {
      status.textContent = state.lang === 'english'
        ? '❌ Camera denied. Skip.'
        : '❌ Camera band. Skip karo.';
      startBtn.disabled = true;
    }
  });

  skipBtn?.addEventListener('click', () => {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    showScene('#scene-hack');
  });

  function capturePhoto() {
    if (state.photoStripCount >= BEEJ_CONFIG.photoCount) {
      status.textContent = '✅ Booth complete!';
      if (stream) stream.getTracks().forEach((t) => t.stop());
      setTimeout(() => showScene('#scene-hack'), 500);
      return;
    }

    const canvas = $('#booth-canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
    const strip = $('#photo-strip');
    const img = document.createElement('img');
    img.src = dataUrl;
    img.alt = `Photo ${state.photoStripCount + 1}`;
    strip.appendChild(img);

    state.photoStripCount++;
    status.textContent = `📸 ${state.photoStripCount}/${BEEJ_CONFIG.photoCount} photos!`;
    sfxClick(); vibrate(40); fireConfetti(15);

    if (state.photoStripCount >= BEEJ_CONFIG.photoCount) {
      startBtn.textContent = '✅ Done →';
      startBtn.onclick = () => {
        if (stream) stream.getTracks().forEach((t) => t.stop());
        showScene('#scene-hack');
      };
    }
  }
}

/* ============================================================
   04. HACK TERMINAL
   ============================================================ */
async function startHackSequence(name) {
  showScene('#scene-hack');
  const terminal = $('#terminal');
  const bar = $('#hack-bar');
  const progressBar = $('#hack-progress');
  const hashPreview = $('#hash-preview');
  if (!terminal) return;

  terminal.innerHTML = '';
  const hash = await sha256(`${name}-${Date.now()}`);
  const lines = state.lang === 'english'
    ? [
        `> Initializing Beej Protocol v16...`,
        `> Fetching memories of ${name}...`,
        `> Decoding Dosti Chain [${state.chain.length} blocks]`,
        `> Hue: ${state.friend.hue}° assigned`,
        `> Loading features...`,
        `> Voice + Confetti + Music ready`,
        `> Photo Frame ready`,
        `> SHA256: ${hash}`,
        `> Done. Welcome. 🌱`,
      ]
    : [
        `> Beej Protocol v16 start ho raha hai...`,
        `> ${name} ki yaadein aa rahi hain...`,
        `> Dosti Chain decode [${state.chain.length} blocks]`,
        `> Hue: ${state.friend.hue}° assign hua`,
        `> Features load ho rahe hain...`,
        `> Voice + Confetti + Music ready`,
        `> Photo Frame ready`,
        `> SHA256: ${hash}`,
        `> Ho gaya. Swagat. 🌱`,
      ];

  let i = 0;
  const interval = setInterval(() => {
    if (i < lines.length) {
      terminal.innerHTML += lines[i] + '\n';
      terminal.scrollTop = terminal.scrollHeight;
      i++;
      const progress = Math.min(100, Math.round((i / lines.length) * 100));
      bar.style.width = progress + '%';
      if (progressBar) progressBar.setAttribute('aria-valuenow', progress);
      playTone(400 + i * 30, 0.05, 'square', 0.03);
    } else {
      clearInterval(interval);
      if (hashPreview) hashPreview.textContent = `SHA256: ${hash}`;
      setTimeout(() => launchMain(), 700);
    }
  }, 400);
}

/* ============================================================
   05. MAIN LAUNCH
   ============================================================ */
function launchMain() {
  showScene('#scene-main');

  const { name, gender, hash } = state.friend;

  $('#wish-title').textContent = `Happy Birthday, ${name} 🎂`;

  const letterText = buildLetter(name, gender);
  typeWriter('#letter-text', letterText, 40);
  typeWriter('#typewriter', `Proof-of-Dosti: ${hash}...`, 30);

  const footerHash = $('#footer-hash');
  if (footerHash) footerHash.textContent = hash;

  // Init all features (once)
  initMusic();
  initRestart();
  initLetterDownloads();

  // Reset steps to 1
  state.currentStep = 1;
  const steps = $$('.step');
  steps.forEach((s, i) => {
    if (i === 0) {
      s.classList.add('step--active');
      s.hidden = false;
    } else {
      s.classList.remove('step--active');
      s.hidden = true;
    }
  });
  updateChapterHeader();

  // Nav buttons (once)
  const backBtn = $('#nav-back');
  const nextBtn = $('#nav-next');
  if (backBtn && backBtn.dataset.init !== 'true') {
    backBtn.dataset.init = 'true';
    backBtn.addEventListener('click', prevStep);
  }
  if (nextBtn && nextBtn.dataset.init !== 'true') {
    nextBtn.dataset.init = 'true';
    nextBtn.addEventListener('click', nextStep);
  }

  // Init step 1 content
  onStepEnter(1);

  // Welcome
  speakWish(name, gender);
  setTimeout(() => fireConfetti(80), 1200);
  setTimeout(() => vibrate([50, 100, 50, 100, 50]), 1200);
}

/* ---------- Letter builder ---------- */
function buildLetter(name, gender) {
  const chainLen = state.chain.length;
  const suffixes = getOrdinalSuffix(chainLen);

  if (state.lang === 'english') {
    let greeting = gender === 'female'
      ? `Dear ${name},`
      : gender === 'male'
      ? `Dear brother ${name},`
      : `Dear friend ${name},`;

    let letter = `${greeting}\n\n`;
    letter += `Today is your day, but it's not just a day — it's a memory I'll always keep.\n\n`;
    letter += `You are the ${chainLen}${suffixes} block of this BEEJ Civilization. `;
    if (chainLen > 1) letter += `Before you, ${chainLen - 1} friends made this soil fertile. `;
    letter += `With every friend, this tree grows, and your branch will always stay.\n\n`;
    letter += `No matter how far we go, this chain will never break. `;
    letter += `Your friendship is my greatest treasure.\n\n`;
    letter += `Happy Birthday, my friend.\n\n`;
    letter += `— ${BEEJ_CONFIG.userName}`;
    return letter;
  } else {
    let greeting = gender === 'female'
      ? `Meri pyaari dost ${name},`
      : gender === 'male'
      ? `Mere bhai ${name},`
      : `Mere dost ${name},`;

    let letter = `${greeting}\n\n`;
    letter += `Aaj tera din hai, par ye sirf ek din nahi — ye ek yaad hai jo main hamesha rakhna chahta hun.\n\n`;
    letter += `Tu is BEEJ Civilization ka ${chainLen}${suffixes} block hai. `;
    if (chainLen > 1) letter += `Tere aane se pehle ${chainLen - 1} dost is mitti ko upjau bana gaye. `;
    letter += `Har dost ke saath ye ped bada ho raha hai, aur teri ek daali isme hamesha rahegi.\n\n`;
    letter += `Chahe hum kitni bhi door ho jaayein, ye chain kabhi tootegi nahi. `;
    letter += `Teri dosti meri sabse badi daulat hai.\n\n`;
    letter += `Happy Birthday, mere yaar.\n\n`;
    letter += `— ${BEEJ_CONFIG.userName}`;
    return letter;
  }
}

function getOrdinalSuffix(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function typeWriter(selector, text, speed = 40) {
  const el = $(selector);
  if (!el) return;
  el.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    el.textContent += text[i] || '';
    i++;
    if (i >= text.length) clearInterval(interval);
  }, speed);
}

function renderChain() {
  const view = $('#chain-view');
  if (!view) return;
  const recent = state.chain.slice(-5);
  view.innerHTML = recent.map((b, idx) =>
    `<div class="chain-block"><strong>${escapeHtml(b.name)}</strong> → ${b.hash} ${idx === recent.length - 1 ? ' ← you' : ''}</div>`
  ).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ============================================================
   PHOTO WITH RAVIRAJ
   ============================================================ */
function initPhotoFrame() {
  const startBtn = $('#photoframe-start');
  const clickBtn = $('#photoframe-click');
  const retakeBtn = $('#photoframe-retake');
  const video = $('#photoframe-video');
  const canvas = $('#photoframe-canvas');
  const preview = $('#photoframe-preview');
  const webcamDiv = $('#photoframe-webcam');
  const status = $('#photoframe-status');
  const downloads = $('#photoframe-downloads');

  if (!startBtn || !video || startBtn.dataset.init === 'true') return;
  startBtn.dataset.init = 'true';

  startBtn.addEventListener('click', async () => {
    try {
      state.photoStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 } }, audio: false,
      });
      video.srcObject = state.photoStream;
      await video.play();

      status.textContent = state.lang === 'english'
        ? 'Camera ready! Click the photo button.'
        : 'Camera ready! Ab photo click karo.';

      startBtn.hidden = true;
      clickBtn.hidden = false;

      sfxSuccess();
      vibrate(30);
    } catch (err) {
      status.textContent = state.lang === 'english'
        ? '❌ Camera denied. Cannot continue.'
        : '❌ Camera band. Aage nahi badh sakte.';
    }
  });

  clickBtn?.addEventListener('click', async () => {
    if (!video.videoWidth) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    state.capturedPhoto = canvas.toDataURL('image/jpeg', 0.85);

    await buildComposite(state.capturedPhoto);

    webcamDiv.hidden = true;
    preview.hidden = false;
    clickBtn.hidden = true;
    retakeBtn.hidden = false;
    downloads.hidden = false;

    status.textContent = state.lang === 'english'
      ? '✨ Beautiful! Download or share.'
      : '✨ Kya baat! Download ya share karo.';

    if (state.photoStream) {
      state.photoStream.getTracks().forEach((t) => t.stop());
      state.photoStream = null;
    }

    sfxSuccess();
    vibrate([50, 100, 50]);
    fireConfetti(40);
  });

  retakeBtn?.addEventListener('click', () => {
    preview.hidden = true;
    webcamDiv.hidden = false;
    retakeBtn.hidden = true;
    clickBtn.hidden = false;
    downloads.hidden = true;
    status.textContent = t('photoframe.status');
    sfxClick();
  });

  $('#photoframe-download-png')?.addEventListener('click', () => downloadPhoto('png'));
  $('#photoframe-download-jpg')?.addEventListener('click', () => downloadPhoto('jpeg'));
  $('#photoframe-share')?.addEventListener('click', () => sharePhotoWhatsApp());
}

async function buildComposite(friendPhotoDataUrl) {
  const composite = $('#photoframe-composite');
  if (!composite) return;

  const W = 900;
  const H = 1100;
  composite.width = W;
  composite.height = H;
  const ctx = composite.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#fdf6e3');
  grad.addColorStop(1, '#f3e6b5');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  const casualImg = await loadImage(BEEJ_CONFIG.casualPhoto).catch(() => null);
  const friendImg = await loadImage(friendPhotoDataUrl);

  const photoW = 340;
  const photoH = 340;
  const gap = 40;
  const startX = (W - (photoW * 2 + gap)) / 2;
  const startY = 160;

  drawPolaroid(ctx, casualImg, startX, startY, photoW, photoH, 'RaviRaj');
  drawPolaroid(ctx, friendImg, startX + photoW + gap, startY, photoW, photoH, state.friend.name || 'Dost');

  ctx.fillStyle = '#0a0f1e';
  ctx.textAlign = 'center';
  ctx.font = 'bold 54px Georgia, serif';
  ctx.fillText('Happy Birthday!', W / 2, 100);

  ctx.fillStyle = '#8a6a1f';
  ctx.font = 'italic 32px Georgia, serif';
  ctx.fillText(`${BEEJ_CONFIG.userName} & ${state.friend.name || 'Dost'}`, W / 2, 600);

  ctx.font = '24px Georgia, serif';
  ctx.fillStyle = '#1e293b';
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  ctx.fillText(dateStr, W / 2, 650);

  ctx.font = 'italic 26px Georgia, serif';
  ctx.fillStyle = '#5a4a1a';
  ctx.fillText('Best Friends Forever 💛', W / 2, 720);

  ctx.font = '60px serif';
  ctx.fillText('💛', W / 2, 800);

  ctx.font = '18px monospace';
  ctx.fillStyle = '#666';
  ctx.fillText(`PROJECT BEEJ • SHA: ${state.friend.hash}`, W / 2, H - 40);

  composite.style.display = 'block';
}

function drawPolaroid(ctx, img, x, y, w, h, caption) {
  const padX = 20;
  const padTop = 20;
  const padBottom = 80;

  ctx.save();

  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 8;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x, y, w + padX * 2, h + padTop + padBottom);

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  if (img) {
    ctx.drawImage(img, x + padX, y + padTop, w, h);
  } else {
    ctx.fillStyle = '#ccc';
    ctx.fillRect(x + padX, y + padTop, w, h);
    ctx.fillStyle = '#666';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No Photo', x + padX + w / 2, y + padTop + h / 2);
  }

  ctx.fillStyle = '#0a0f1e';
  ctx.font = 'italic 28px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(caption, x + padX + w / 2, y + padTop + h + 50);

  ctx.restore();
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function downloadPhoto(format) {
  const composite = $('#photoframe-composite');
  if (!composite) return;

  const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const ext = format === 'jpeg' ? 'jpg' : 'png';
  const quality = format === 'jpeg' ? 0.92 : undefined;

  composite.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RaviRaj-and-${state.friend.name || 'Dost'}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, mime, quality);

  sfxSuccess();
  vibrate(40);
  fireConfetti(20);
}

function sharePhotoWhatsApp() {
  const composite = $('#photoframe-composite');
  if (!composite) return;

  const text = state.lang === 'english'
    ? `🎂 Look at this birthday memory with RaviRaj!`
    : `🎂 RaviRaj ke saath ye birthday yaad dekho!`;

  composite.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RaviRaj-and-${state.friend.name || 'Dost'}.png`;
    a.click();
    URL.revokeObjectURL(url);

    setTimeout(() => {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
    }, 800);
  }, 'image/png');

  sfxClick();
  vibrate(30);
}

/* ============================================================
   BALLOON
   ============================================================ */
function initBalloons() {
  const zone = $('#balloon-zone');
  const scoreEl = $('#balloon-score');
  if (!zone || zone.children.length > 0) return;

  state.balloonScore = 0;
  if (scoreEl) scoreEl.textContent = '0';

  for (let i = 0; i < BEEJ_CONFIG.balloonCount; i++) {
    const b = document.createElement('span');
    b.className = 'balloon';
    b.textContent = '🎈';
    b.setAttribute('role', 'button');
    b.setAttribute('tabindex', '0');

    const pop = () => {
      if (b.classList.contains('popped')) return;
      b.classList.add('popped');
      state.balloonScore++;
      if (scoreEl) scoreEl.textContent = state.balloonScore;
      sfxPop(); vibrate(30); fireConfetti(10);
    };

    b.addEventListener('click', pop);
    b.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pop(); }
    });
    zone.appendChild(b);
  }
}

/* ============================================================
   CAKE
   ============================================================ */
function initCake() {
  const micBtn = $('#mic-enable');
  const candles = $('#candles');
  const dbMeter = $('#db-meter');
  if (!micBtn || micBtn.dataset.init === 'true') return;
  micBtn.dataset.init = 'true';

  micBtn.addEventListener('click', async () => {
    try {
      state.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = state.audioCtx.createMediaStreamSource(state.micStream);
      state.analyser = state.audioCtx.createAnalyser();
      state.analyser.fftSize = 256;
      source.connect(state.analyser);
      micBtn.textContent = state.lang === 'english'
        ? '🎤 Listening... Blow!'
        : '🎤 Sun raha hun... Phook maaro!';
      micBtn.disabled = true;
      detectBlow(candles, dbMeter, micBtn);
    } catch {
      micBtn.textContent = '❌ Mic denied';
      micBtn.disabled = true;
    }
  });
}

function detectBlow(candles, dbMeter, micBtn) {
  if (!state.analyser) return;
  const data = new Uint8Array(state.analyser.frequencyBinCount);

  const loop = () => {
    if (state.blowDetected) return;
    state.analyser.getByteFrequencyData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) sum += data[i];
    const volume = Math.round(sum / data.length);
    if (dbMeter) dbMeter.textContent = `${volume} dB`;

    if (volume > BEEJ_CONFIG.micThreshold) {
      state.blowDetected = true;
      candles.classList.add('blown');
      candles.textContent = '💨 💨 💨';
      if (micBtn) micBtn.textContent = state.lang === 'english'
        ? '🎉 Wish granted!'
        : '🎉 Wish poori ho!';
      cleanupMic();
      fireConfetti(100);
      vibrate([50, 100, 50]);
      sfxSuccess();
      return;
    }
    requestAnimationFrame(loop);
  };
  loop();
}

function cleanupMic() {
  if (state.audioCtx && state.audioCtx.state !== 'closed') state.audioCtx.close().catch(() => {});
  if (state.micStream) state.micStream.getTracks().forEach((t) => t.stop());
  state.analyser = null;
}

/* ============================================================
   CERTIFICATE
   ============================================================ */
function renderCertificate() {
  const zone = $('#cert-zone');
  if (!zone || zone.dataset.init === 'true') return;
  zone.dataset.init = 'true';

  const { name, hash } = state.friend;
  const chainLen = state.chain.length;
  const date = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  zone.innerHTML = `
    <div class="cert" id="cert-card">
      <h4>Certificate of Dosti</h4>
      <p>Issued to <strong>${escapeHtml(name)}</strong></p>
      <p>For being the ${chainLen}${getOrdinalSuffix(chainLen)} block of the Dosti Chain</p>
      <p>${date}</p>
      <p class="cert-hash">SHA256: ${hash}</p>
      <p style="font-size:11px;margin-top:8px;font-style:italic">— Signed, ${BEEJ_CONFIG.userName}</p>
    </div>
    <button type="button" class="btn" id="cert-download" style="margin-top:12px">
      📥 ${state.lang === 'english' ? 'Download Certificate' : 'Certificate Download'}
    </button>
  `;

  $('#cert-download')?.addEventListener('click', () => {
    downloadCertificateAsPNG();
    sfxClick(); vibrate(30);
  });
}

function downloadCertificateAsPNG() {
  const { name, hash } = state.friend;
  const canvas = document.createElement('canvas');
  const scale = 2;
  canvas.width = 900 * scale;
  canvas.height = 600 * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);

  const grad = ctx.createLinearGradient(0, 0, 900, 600);
  grad.addColorStop(0, '#fdf6e3');
  grad.addColorStop(1, '#f3e6b5');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 900, 600);

  ctx.strokeStyle = '#a8842a';
  ctx.lineWidth = 6;
  ctx.strokeRect(20, 20, 860, 560);
  ctx.lineWidth = 2;
  ctx.strokeRect(32, 32, 836, 536);

  ctx.fillStyle = '#0a0f1e';
  ctx.textAlign = 'center';
  ctx.font = 'bold 42px Georgia, serif';
  ctx.fillText('Certificate of Dosti', 450, 110);

  ctx.font = 'italic 22px Georgia, serif';
  ctx.fillText('This is to certify that', 450, 180);

  ctx.font = 'bold 48px Georgia, serif';
  ctx.fillStyle = '#a8842a';
  ctx.fillText(name, 450, 260);

  ctx.fillStyle = '#0a0f1e';
  ctx.font = '20px Georgia, serif';
  ctx.fillText(`is the ${state.chain.length}${getOrdinalSuffix(state.chain.length)} block`, 450, 320);
  ctx.fillText('of the Dosti Chain', 450, 350);
  ctx.font = '18px Georgia, serif';
  ctx.fillText(new Date().toLocaleDateString('en-IN'), 450, 430);
  ctx.font = '13px monospace';
  ctx.fillStyle = '#666';
  ctx.fillText(`SHA256: ${hash}`, 450, 480);
  ctx.font = 'italic 18px Georgia, serif';
  ctx.fillStyle = '#0a0f1e';
  ctx.fillText(`— ${BEEJ_CONFIG.userName}`, 450, 530);

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificate-${name}.png`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

/* ============================================================
   LETTER DOWNLOADS
   ============================================================ */
function initLetterDownloads() {
  const pngBtn = $('#letter-download-png');
  const txtBtn = $('#letter-download-txt');
  if (pngBtn && pngBtn.dataset.init !== 'true') {
    pngBtn.dataset.init = 'true';
    pngBtn.addEventListener('click', () => {
      downloadLetterAsPNG(); sfxClick(); vibrate(30);
    });
  }
  if (txtBtn && txtBtn.dataset.init !== 'true') {
    txtBtn.dataset.init = 'true';
    txtBtn.addEventListener('click', () => {
      downloadLetterAsTXT(); sfxClick(); vibrate(30);
    });
  }
}

function downloadLetterAsTXT() {
  const text = $('#letter-text')?.textContent || '';
  const { name } = state.friend;
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Message-from-${BEEJ_CONFIG.userName}-to-${name || 'Dost'}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadLetterAsPNG() {
  const { name } = state.friend;
  const text = $('#letter-text')?.textContent || '';
  const canvas = document.createElement('canvas');
  const scale = 2;
  canvas.width = 800 * scale;
  canvas.height = 1000 * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);

  const grad = ctx.createLinearGradient(0, 0, 800, 1000);
  grad.addColorStop(0, '#0a0f1e');
  grad.addColorStop(1, '#121a32');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 1000);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
  ctx.lineWidth = 3;
  ctx.strokeRect(24, 24, 752, 952);

  ctx.fillStyle = '#f3e6b5';
  ctx.font = 'bold 32px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Message from ' + BEEJ_CONFIG.userName, 400, 100);

  ctx.font = '48px serif';
  ctx.fillText('💌', 400, 165);

  ctx.fillStyle = '#eef2ff';
  ctx.font = 'italic 22px Georgia, serif';
  ctx.textAlign = 'left';

  const lines = wrapText(ctx, text, 700);
  let y = 240;
  lines.forEach((line) => { ctx.fillText(line, 60, y); y += 34; });

  ctx.fillStyle = '#9aa4c7';
  ctx.font = '16px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Generated on ${new Date().toLocaleDateString('en-IN')}`, 400, 940);
  ctx.fillText('PROJECT BEEJ • A Living Birthday', 400, 965);

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Message-from-${BEEJ_CONFIG.userName}-to-${name || 'Dost'}.png`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

function wrapText(ctx, text, maxWidth) {
  const lines = [];
  text.split('\n').forEach((p) => {
    if (p.trim() === '') { lines.push(''); return; }
    const words = p.split(' ');
    let current = '';
    words.forEach((word) => {
      const test = current ? current + ' ' + word : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else current = test;
    });
    if (current) lines.push(current);
  });
  return lines;
}

/* ============================================================
   WISH WALL
   ============================================================ */
function loadWishes() {
  try { return JSON.parse(localStorage.getItem(BEEJ_CONFIG.wishKey) || '[]'); }
  catch { return []; }
}
function saveWishes(w) {
  try { localStorage.setItem(BEEJ_CONFIG.wishKey, JSON.stringify(w)); } catch {}
}

function initWishWall() {
  const listEl = $('#wish-list');
  const addBtn = $('#wish-add-btn');
  const input = $('#wish-input');
  if (!listEl || !addBtn || addBtn.dataset.init === 'true') return;
  addBtn.dataset.init = 'true';

  function render() {
    const wishes = loadWishes();
    if (wishes.length === 0) {
      listEl.innerHTML = `<p class="tiny mono" style="opacity:0.6;text-align:center">${
        state.lang === 'english' ? 'No wishes yet — write the first one!' : 'Abhi koi wish nahi — pehli wish tum likho!'
      }</p>`;
      return;
    }
    listEl.innerHTML = wishes.slice(-10).reverse().map((w) => `
      <div class="wish-item">
        <p><strong>${escapeHtml(w.name)}</strong> — ${escapeHtml(w.text)}</p>
        <span class="tiny mono">${w.time}</span>
      </div>
    `).join('');
  }

  addBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) { sfxError(); return; }
    const wishes = loadWishes();
    wishes.push({
      name: state.friend.name || 'Anonymous',
      text,
      time: new Date().toLocaleString('en-IN'),
    });
    saveWishes(wishes);
    input.value = '';
    render();
    sfxSuccess();
    fireConfetti(20);
    vibrate([30, 50, 30]);
  });

  render();
}

/* ============================================================
   MEMORY MATCH
   ============================================================ */
const MEMORY_EMOJIS = ['🎂', '🎈', '🎉', '🎁', '💝', '⭐', '🌱', '🎵', '🏆', '🎨', '💎', '🌈'];

function initMemoryMatch() {
  const grid = $('#memory-grid');
  const scoreEl = $('#memory-score');
  const movesEl = $('#memory-moves');
  const restartBtn = $('#memory-restart');
  if (!grid || grid.dataset.init === 'true') return;
  grid.dataset.init = 'true';

  function reset() {
    state.memoryFlipped = [];
    state.memoryMatched = 0;
    state.memoryMoves = 0;
    state.memoryLock = false;
    if (scoreEl) scoreEl.textContent = '0';
    if (movesEl) movesEl.textContent = '0';

    const pairs = MEMORY_EMOJIS.slice(0, BEEJ_CONFIG.memoryPairs);
    const deck = [...pairs, ...pairs].sort(() => Math.random() - 0.5);

    grid.innerHTML = deck.map((emoji, i) => `
      <button type="button" class="memory-card" data-emoji="${emoji}" data-index="${i}">
        <div class="memory-face memory-front">?</div>
        <div class="memory-face memory-back">${emoji}</div>
      </button>
    `).join('');

    grid.querySelectorAll('.memory-card').forEach(card => {
      card.addEventListener('click', () => flipCard(card));
    });
  }

  function flipCard(card) {
    if (state.memoryLock) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    state.memoryFlipped.push(card);
    sfxClick();
    vibrate(20);

    if (state.memoryFlipped.length === 2) {
      state.memoryMoves++;
      if (movesEl) movesEl.textContent = state.memoryMoves;
      state.memoryLock = true;

      const [a, b] = state.memoryFlipped;
      if (a.dataset.emoji === b.dataset.emoji) {
        a.classList.add('matched');
        b.classList.add('matched');
        state.memoryMatched++;
        if (scoreEl) scoreEl.textContent = state.memoryMatched;
        sfxSuccess();
        fireConfetti(15);
        state.memoryFlipped = [];
        state.memoryLock = false;

        if (state.memoryMatched === BEEJ_CONFIG.memoryPairs) {
          setTimeout(() => {
            fireConfetti(80);
            sfxSuccess();
            vibrate([50, 100, 50, 100, 50]);
          }, 400);
        }
      } else {
        sfxError();
        setTimeout(() => {
          a.classList.remove('flipped');
          b.classList.remove('flipped');
          state.memoryFlipped = [];
          state.memoryLock = false;
        }, 800);
      }
    }
  }

  restartBtn?.addEventListener('click', () => { reset(); sfxClick(); });
  reset();
}

/* ============================================================
   QUIZ
   ============================================================ */
const QUIZ_QUESTIONS = {
  english: [
    { q: "Where did we first meet?", a: ["School", "College", "Online", "Somewhere else"] },
    { q: "What's my favourite thing?", a: ["Chai", "Coffee", "Cold Drink", "Juice"] },
    { q: "What do I do most?", a: ["Study", "Play", "Bakchodi", "Sleep"] },
    { q: "What's my nature?", a: ["Calm", "Funny", "Serious", "Emotional"] },
    { q: "If I choose a superpower?", a: ["Fly", "Time travel", "Invisible", "Super strength"] },
    { q: "My biggest weakness?", a: ["Waking up late", "Phone", "Food", "Sleep"] },
    { q: "Who is the best friend?", a: ["You", "You", "You", "You"] },
  ],
  hinglish: [
    { q: "Sabse pehle hum kahan mile the?", a: ["School", "College", "Online", "Kisi aur jagah"] },
    { q: "Meri favourite cheez kaunsi hai?", a: ["Chai", "Coffee", "Cold Drink", "Juice"] },
    { q: "Main sabse zyada kya karta hun?", a: ["Padhta hun", "Khelta hun", "Bakchodi", "Sota hun"] },
    { q: "Mera nature kaisa hai?", a: ["Shant", "Funny", "Serious", "Emotional"] },
    { q: "Agar main ek superpower choose karun?", a: ["Uddna", "Time travel", "Invisible", "Super strength"] },
    { q: "Meri sabse badi weakness?", a: ["Late utna", "Phone", "Khana", "Neend"] },
    { q: "Sabse accha dost kaun hai?", a: ["Tu", "Tu", "Tu", "Tu"] },
  ]
};

function initQuiz() {
  const zone = $('#quiz-content');
  const container = $('#quiz-zone');
  if (!zone || container.dataset.init === 'true') return;
  container.dataset.init = 'true';

  state.quizIndex = 0;
  state.quizScore = 0;
  const allQuestions = QUIZ_QUESTIONS[state.lang] || QUIZ_QUESTIONS.hinglish;
  const total = Math.min(BEEJ_CONFIG.quizCount, allQuestions.length);
  const questions = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, total);

  function renderQuestion() {
    if (state.quizIndex >= questions.length) {
      const percent = Math.round((state.quizScore / questions.length) * 100);
      let grade;
      if (state.lang === 'english') {
        grade = percent >= 80 ? "🏆 You truly are my friend!" :
                percent >= 50 ? "😊 You're a good friend!" :
                "😅 Need to know more!";
      } else {
        grade = percent >= 80 ? "🏆 Tu toh mera asli dost hai!" :
                percent >= 50 ? "😊 Achha dost hai tu!" :
                "😅 Thoda aur jaanna padega!";
      }
      zone.innerHTML = `
        <div class="quiz-result">
          <h3>${state.quizScore}/${questions.length}</h3>
          <p>${percent}% • ${grade}</p>
          <button type="button" class="btn" id="quiz-restart">🔄 ${state.lang === 'english' ? 'Try Again' : 'Dobara Try'}</button>
        </div>
      `;
      sfxSuccess();
      fireConfetti(50);
      vibrate([50, 100, 50]);
      $('#quiz-restart')?.addEventListener('click', () => {
        container.dataset.init = 'false';
        initQuiz();
      });
      return;
    }

    const q = questions[state.quizIndex];
    zone.innerHTML = `
      <div class="quiz-progress">${state.lang === 'english' ? 'Question' : 'Sawaal'} ${state.quizIndex + 1}/${questions.length} • Score: ${state.quizScore}</div>
      <p class="quiz-question">${q.q}</p>
      <div class="quiz-options">
        ${q.a.map((opt, i) => `<button type="button" class="quiz-opt" data-i="${i}">${opt}</button>`).join('')}
      </div>
    `;

    zone.querySelectorAll('.quiz-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.dataset.i);
        const correct = i === 0 || q.a[i] === "Tu" || q.a[i] === "You";
        if (correct) { state.quizScore++; sfxSuccess(); fireConfetti(15); }
        else sfxError();
        vibrate(30);
        state.quizIndex++;
        setTimeout(renderQuestion, 400);
      });
    });
  }

  renderQuestion();
}

/* ============================================================
   SPIN WHEEL
   ============================================================ */
const WHEEL_SEGMENTS = {
  english: [
    "Funniest 😄", "Most Loyal 🎯", "Smartest 🧠",
    "Sweetest 💛", "Strongest 💪", "Most Honest 💯",
    "Most Caring 🤗", "True Legend 🏆",
  ],
  hinglish: [
    "Sabse funny 😄", "Sabse loyal 🎯", "Sabse smart 🧠",
    "Sabse pyara 💛", "Sabse strong 💪", "Sabse honest 💯",
    "Sabse caring 🤗", "Sabse legend 🏆",
  ]
};

function initWheel() {
  const wheelSpin = $('#wheel-spin');
  const btn = $('#wheel-btn');
  const result = $('#wheel-result');
  if (!wheelSpin || !btn || btn.dataset.init === 'true') return;
  btn.dataset.init = 'true';

  const segments = WHEEL_SEGMENTS[state.lang] || WHEEL_SEGMENTS.hinglish;
  const colors = ['#d4af37', '#f472b6', '#60a5fa', '#4ade80', '#fbbf24', '#a78bfa', '#fb7185', '#38bdf8'];
  const segAngle = 360 / segments.length;

  wheelSpin.innerHTML = segments.map((seg, i) => {
    const angle = i * segAngle;
    return `<div class="wheel-segment" style="
      transform: rotate(${angle}deg);
      background: conic-gradient(from ${angle}deg, ${colors[i]} 0deg ${segAngle}deg, transparent ${segAngle}deg);
    "></div>`;
  }).join('');

  wheelSpin.innerHTML += segments.map((seg, i) => {
    const angle = i * segAngle + segAngle / 2;
    return `<div class="wheel-label" style="transform: rotate(${angle}deg) translateY(-85px)">
      <span>${seg}</span>
    </div>`;
  }).join('');

  btn.addEventListener('click', () => {
    if (state.wheelSpinning) return;
    state.wheelSpinning = true;
    const spins = 5 + Math.floor(Math.random() * 3);
    const finalAngle = Math.random() * 360;
    const totalRotation = spins * 360 + finalAngle;

    wheelSpin.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
    wheelSpin.style.transform = `rotate(${totalRotation}deg)`;

    playTone(300, 0.1, 'square', 0.05);
    vibrate(20);

    setTimeout(() => {
      const normalized = ((finalAngle % 360) + 360) % 360;
      const index = Math.floor((360 - normalized) / segAngle) % segments.length;
      result.textContent = `🎯 ${segments[index]}`;
      state.wheelSpinning = false;
      sfxSuccess();
      vibrate([30, 50, 30]);
      fireConfetti(30);
    }, 4100);
  });
}

/* ============================================================
   GIFT BOXES
   ============================================================ */
const GIFT_MESSAGES = {
  english: [
    "🎁 A warm hug — ask anytime!",
    "🎁 A true wish — may all your dreams come true!",
    "🎁 A promise — I'll always be there.",
    "🎁 A secret — you're the best part of my life.",
    "🎁 A treat — next one's on me!",
    "🎁 A memory — remember our first meet?",
  ],
  hinglish: [
    "🎁 Ek warm hug — kabhi bhi maang lo!",
    "🎁 Ek sachi dua — teri har khwahish poori ho!",
    "🎁 Ek promise — main hamesha rahunga.",
    "🎁 Ek secret — tu meri zindagi ka best hissa hai.",
    "🎁 Ek treat — agli baar meri taraf se!",
    "🎁 Ek memory — humari pehli mulaqat yaad hai?",
  ]
};

function initGiftBoxes() {
  const zone = $('#gift-zone');
  if (!zone || zone.children.length > 0) return;

  const messages = [...(GIFT_MESSAGES[state.lang] || GIFT_MESSAGES.hinglish)]
    .sort(() => Math.random() - 0.5).slice(0, 3);

  zone.innerHTML = messages.map((msg, i) => `
    <div class="gift-box" data-msg="${msg}" data-index="${i}">
      <div class="gift-lid">🎁</div>
      <div class="gift-content">
        <p>${msg}</p>
      </div>
    </div>
  `).join('');

  zone.querySelectorAll('.gift-box').forEach(box => {
    box.addEventListener('click', () => {
      if (box.classList.contains('opened')) return;
      box.classList.add('opened');
      sfxReveal();
      vibrate([40, 60, 40]);
      fireConfetti(25);
    });
  });
}

/* ============================================================
   COMPLIMENT
   ============================================================ */
function initCompliment() {
  const btn = $('#compliment-btn');
  if (!btn || btn.dataset.init === 'true') return;
  btn.dataset.init = 'true';

  btn.addEventListener('click', () => {
    const el = $('#compliment-text');
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = getCompliment();
      el.style.opacity = '1';
    }, 200);
    sfxPop(); vibrate([30, 50, 30]); fireConfetti(20);
  });
}

/* ============================================================
   FORTUNE
   ============================================================ */
const FORTUNES = {
  english: [
    "Your respect will grow today 🌟",
    "An old friend will remember you 💭",
    "Tomorrow is your lucky day 🍀",
    "What you wished for will come — be patient 🤲",
    "Something will happen today you'll always remember ✨",
    "Your smile will make someone's day 😊",
    "Big good news is coming 📩",
    "Someone will surprise you today 🎁",
    "Your hard work will pay off 💪",
    "Someone missed you today 💛",
  ],
  hinglish: [
    "Aaj teri izzat badhegi 🌟",
    "Ek purana dost aaj yaad karega 💭",
    "Kal ka din tera lucky day hai 🍀",
    "Jo tune chaha, wo milega — thoda sabr 🤲",
    "Aaj kuch aisa hoga jo tujhe hamesha yaad rahega ✨",
    "Teri smile kisi ka din bana degi 😊",
    "Ek badi khushkhabri aane wali hai 📩",
    "Aaj koi tujhe surprise dega 🎁",
    "Teri mehnat rang layegi 💪",
    "Kisi ne tujhe miss kiya hai aaj 💛",
  ]
};

function initFortune() {
  const btn = $('#fortune-btn');
  const cookie = $('#fortune-cookie');
  const textEl = $('#fortune-text');
  if (!btn || !cookie || btn.dataset.init === 'true') return;
  btn.dataset.init = 'true';

  btn.addEventListener('click', () => {
    if (cookie.classList.contains('opened')) return;
    cookie.classList.add('opened');
    cookie.textContent = '💫';
    const fortunes = FORTUNES[state.lang] || FORTUNES.hinglish;
    textEl.textContent = fortunes[Math.floor(Math.random() * fortunes.length)];
    sfxReveal();
    vibrate([40, 60, 40]);
    fireConfetti(25);
  });
}

/* ============================================================
   TIMELINE
   ============================================================ */
const TIMELINE_DATA = {
  english: [
    { year: 'First Meet', text: "When we met, I didn't know this journey would be so good." },
    { year: 'First Talk', text: 'First message, first laugh — I remember it all.' },
    { year: 'First Fight', text: 'A small fight, a bigger apology.' },
    { year: 'Best Memory', text: 'That day we both will never forget.' },
    { year: 'Today', text: 'And today, your birthday. This memory stays forever.' },
  ],
  hinglish: [
    { year: 'Pehli mulaqat', text: 'Jab hum mile, tab pata nahi tha ye safar itna accha hoga.' },
    { year: 'Pehli baat', text: 'Pehla message, pehli hansi — sab yaad hai mujhe.' },
    { year: 'Pehli ladai', text: 'Chhoti si ladai, badi si maafi.' },
    { year: 'Best memory', text: 'Wo din jo hum dono kabhi nahi bhoolenge.' },
    { year: 'Aaj', text: 'Aur aaj, tera birthday. Ye yaad hamesha rahegi.' },
  ]
};

function initTimeline() {
  const zone = $('#timeline-zone');
  if (!zone || zone.children.length > 0) return;

  const data = TIMELINE_DATA[state.lang] || TIMELINE_DATA.hinglish;
  zone.innerHTML = data.map((item) => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <h4>${item.year}</h4>
        <p>${item.text}</p>
      </div>
    </div>
  `).join('');
}

/* ============================================================
   NAME TO MUSIC
   ============================================================ */
function nameToNotes(name) {
  const baseFreqs = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
  const notes = [];
  for (let i = 0; i < name.length; i++) {
    const code = name.charCodeAt(i);
    const freq = baseFreqs[code % baseFreqs.length];
    notes.push(freq);
  }
  return notes;
}

function initNameTune() {
  const playBtn = $('#nametune-play');
  const stopBtn = $('#nametune-stop');
  const visual = $('#nametune-visual');
  if (!playBtn || !visual || playBtn.dataset.init === 'true') return;
  playBtn.dataset.init = 'true';

  const name = state.friend.name || 'Dost';
  const notes = nameToNotes(name);
  const chars = [...name];

  visual.innerHTML = chars.map((c, i) => `
    <div class="nametune-bar" data-freq="${notes[i]}" title="${c}">
      <span>${c}</span>
    </div>
  `).join('');

  playBtn.addEventListener('click', () => {
    if (state.nameTunePlaying) return;
    state.nameTunePlaying = true;

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    let time = ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(0.2, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.4);

      const bar = visual.querySelectorAll('.nametune-bar')[i];
      setTimeout(() => {
        bar?.classList.add('playing');
        vibrate(15);
        setTimeout(() => bar?.classList.remove('playing'), 350);
      }, i * 400);

      time += 0.4;
    });

    setTimeout(() => {
      ctx.close().catch(() => {});
      state.nameTunePlaying = false;
      sfxSuccess();
      fireConfetti(20);
    }, notes.length * 400 + 400);
  });

  stopBtn?.addEventListener('click', () => {
    state.nameTunePlaying = false;
    visual.querySelectorAll('.nametune-bar').forEach(b => b.classList.remove('playing'));
  });
}

/* ============================================================
   TIME CAPSULE
   ============================================================ */
function loadCapsules() {
  try { return JSON.parse(localStorage.getItem(BEEJ_CONFIG.capsuleKey) || '[]'); }
  catch { return []; }
}
function saveCapsules(c) {
  try { localStorage.setItem(BEEJ_CONFIG.capsuleKey, JSON.stringify(c)); } catch {}
}

function initTimeCapsule() {
  const input = $('#capsule-input');
  const dateInput = $('#capsule-date');
  const saveBtn = $('#capsule-save');
  const list = $('#capsule-list');
  if (!input || !saveBtn || saveBtn.dataset.init === 'true') return;
  saveBtn.dataset.init = 'true';

  const defaultDate = new Date();
  defaultDate.setFullYear(defaultDate.getFullYear() + 1);
  dateInput.value = defaultDate.toISOString().split('T')[0];
  dateInput.min = new Date().toISOString().split('T')[0];

  function renderList() {
    const capsules = loadCapsules();
    const friendName = state.friend.name || 'Dost';
    const mine = capsules.filter(c => c.owner === friendName);

    if (mine.length === 0) {
      list.innerHTML = `<p class="tiny mono" style="opacity:0.6;text-align:center;margin-top:12px">${
        state.lang === 'english' ? 'No capsules yet — create the first!' : 'Koi capsule nahi — pehla banao!'
      }</p>`;
      return;
    }

    list.innerHTML = mine.map(c => {
      const unlockDate = new Date(c.unlockDate);
      const now = new Date();
      const isUnlocked = now >= unlockDate;

      if (isUnlocked) {
        const decrypted = simpleDecrypt(c.encrypted, c.owner + 'beej');
        return `
          <div class="capsule-item unlocked">
            <p class="tiny mono">🔓 ${state.lang === 'english' ? 'Unlocked on' : 'Khul gaya'} ${unlockDate.toLocaleDateString('en-IN')}</p>
            <p class="capsule-content">${escapeHtml(decrypted || '(decrypt failed)')}</p>
          </div>
        `;
      } else {
        const daysLeft = Math.ceil((unlockDate - now) / 86400000);
        return `
          <div class="capsule-item locked">
            <p class="tiny mono">🔒 ${state.lang === 'english' ? 'Unlocks in' : 'Khulega'} ${daysLeft} ${state.lang === 'english' ? 'days' : 'din'}</p>
            <p class="tiny" style="color:var(--muted)">${state.lang === 'english' ? 'Message is encrypted' : 'Message encrypted hai'}</p>
          </div>
        `;
      }
    }).join('');
  }

  saveBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) { sfxError(); vibrate([50, 30, 50]); return; }
    if (!dateInput.value) { sfxError(); return; }

    const friendName = state.friend.name || 'Dost';
    const encrypted = simpleEncrypt(text, friendName + 'beej');

    const capsules = loadCapsules();
    capsules.push({
      owner: friendName,
      encrypted,
      unlockDate: dateInput.value,
      created: new Date().toLocaleString('en-IN'),
    });
    saveCapsules(capsules);

    input.value = '';
    renderList();
    sfxSuccess();
    vibrate([30, 50, 30]);
    fireConfetti(30);
  });

  renderList();
}

/* ============================================================
   COUNTDOWN
   ============================================================ */
function initCountdown() {
  const dateInput = $('#bday-date');
  const textEl = $('#countdown-text');
  if (!dateInput || dateInput.dataset.init === 'true') return;
  dateInput.dataset.init = 'true';

  const savedDate = localStorage.getItem('beej_bday');
  if (savedDate) dateInput.value = savedDate;

  function update() {
    const val = dateInput.value;
    if (!val) {
      textEl.textContent = state.lang === 'english'
        ? '-- days -- hours -- minutes'
        : '-- din -- ghante -- minute';
      return;
    }
    localStorage.setItem('beej_bday', val);
    const now = new Date();
    const bday = new Date(val);
    bday.setFullYear(now.getFullYear());
    if (bday < now) bday.setFullYear(now.getFullYear() + 1);
    const diff = bday - now;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff / 3600000) % 24);
    const mins = Math.floor((diff / 60000) % 60);
    textEl.textContent = state.lang === 'english'
      ? `${days} days • ${hours} hours • ${mins} minutes`
      : `${days} din • ${hours} ghante • ${mins} minute`;
  }
  dateInput.addEventListener('change', () => { update(); sfxClick(); });
  update();
  setInterval(update, 60000);
}

/* ============================================================
   VOICE COMMAND
   ============================================================ */
function initVoiceCommand() {
  const startBtn = $('#voice-start');
  const stopBtn = $('#voice-stop');
  const status = $('#voice-status');
  const visual = $('#voice-visual');
  if (!startBtn || startBtn.dataset.init === 'true') return;
  startBtn.dataset.init = 'true';

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    status.textContent = state.lang === 'english'
      ? '❌ Browser not supported'
      : '❌ Browser support nahi karta';
    startBtn.disabled = true;
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = state.lang === 'english' ? 'en-IN' : 'hi-IN';
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    state.voiceListening = true;
    status.textContent = state.lang === 'english'
      ? '🎤 Listening... say "Happy Birthday"'
      : '🎤 Sun raha hun... bolo "Happy Birthday"';
    visual?.classList.add('active');
    sfxClick();
  };

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map(r => r[0].transcript.toLowerCase())
      .join(' ');

    if (transcript.includes('happy birthday') ||
        transcript.includes('happy bday') ||
        transcript.includes('birthday')) {
      status.textContent = state.lang === 'english'
        ? '✅ Heard! Candles blown 🎉'
        : '✅ Suna! Candles bujh gaye 🎉';
      recognition.stop();
      triggerCakeBlow();
    }
  };

  recognition.onerror = (e) => {
    status.textContent = `❌ Error: ${e.error}`;
    visual?.classList.remove('active');
    state.voiceListening = false;
  };

  recognition.onend = () => {
    visual?.classList.remove('active');
    state.voiceListening = false;
  };

  startBtn.addEventListener('click', () => {
    try {
      recognition.start();
      state.voiceRecognition = recognition;
    } catch (e) {
      status.textContent = '❌ Start nahi ho paya';
    }
  });

  stopBtn?.addEventListener('click', () => {
    try { recognition.stop(); } catch {}
    status.textContent = t('voice.off');
    visual?.classList.remove('active');
  });
}

function triggerCakeBlow() {
  const candles = $('#candles');
  const micBtn = $('#mic-enable');
  if (candles && !candles.classList.contains('blown')) {
    candles.classList.add('blown');
    candles.textContent = '💨 💨 💨';
    if (micBtn) micBtn.textContent = '🎉 Wish poori ho!';
  }
  fireConfetti(100);
  vibrate([50, 100, 50, 100, 50]);
  sfxSuccess();
}

/* ============================================================
   URL SHARING
   ============================================================ */
function initUrlSharing() {
  const generateBtn = $('#share-generate');
  const copyBtn = $('#share-copy');
  const whatsappBtn = $('#share-whatsapp');
  const linkInput = $('#share-link');
  if (!generateBtn || generateBtn.dataset.init === 'true') return;
  generateBtn.dataset.init = 'true';

  function generateLink() {
    const data = {
      n: state.friend.name,
      g: state.friend.gender,
      h: state.friend.hash,
      c: state.chain.length,
      hue: state.friend.hue,
      t: Date.now(),
    };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    const url = `${window.location.origin}${window.location.pathname}?data=${encoded}`;
    linkInput.value = url;
    return url;
  }

  generateBtn.addEventListener('click', () => {
    generateLink();
    sfxClick();
    vibrate(30);
    fireConfetti(15);
  });

  copyBtn?.addEventListener('click', async () => {
    if (!linkInput.value) generateLink();
    try {
      await navigator.clipboard.writeText(linkInput.value);
      copyBtn.textContent = '✅ ' + (state.lang === 'english' ? 'Copied!' : 'Copy ho gaya!');
      sfxSuccess();
      vibrate([30, 50, 30]);
      setTimeout(() => copyBtn.textContent = '📋 ' + t('share.copy'), 2000);
    } catch {
      linkInput.select();
      document.execCommand('copy');
    }
  });

  whatsappBtn?.addEventListener('click', () => {
    if (!linkInput.value) generateLink();
    const text = state.lang === 'english'
      ? `🎂 This is your birthday page! Open: ${linkInput.value}`
      : `🎂 Ye tera birthday page hai! Kholo: ${linkInput.value}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    sfxClick();
  });

  const params = new URLSearchParams(window.location.search);
  if (params.has('data')) {
    try {
      const decoded = JSON.parse(decodeURIComponent(atob(params.get('data'))));
      if (decoded.n) {
        setTimeout(() => {
          const banner = document.createElement('div');
          banner.className = 'shared-banner';
          banner.innerHTML = `
            <p>👋 <strong>${escapeHtml(decoded.n)}</strong> ${state.lang === 'english' ? 'shared this page!' : 'ne ye page share kiya!'}</p>
            <p class="tiny mono">Chain: ${decoded.c || 0} blocks</p>
          `;
          document.body.appendChild(banner);
          setTimeout(() => banner.classList.add('show'), 100);
        }, 500);
      }
    } catch {}
  }
}

/* ============================================================
   QR CODE
   ============================================================ */
function initQRCode() {
  const qrZone = $('#qr-code');
  const downloadBtn = $('#qr-download');
  if (!qrZone || qrZone.dataset.init === 'true') return;
  qrZone.dataset.init = 'true';

  const hash = state.friend.hash || 'GENESIS0000';
  const size = 21;
  const scale = 8;
  const canvas = document.createElement('canvas');
  canvas.width = size * scale;
  canvas.height = size * scale;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#0a0f1e';

  const drawFinder = (x, y) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const isBorder = i === 0 || i === 6 || j === 0 || j === 6;
        const isCenter = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        if (isBorder || isCenter) {
          ctx.fillRect((x + i) * scale, (y + j) * scale, scale, scale);
        }
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(size - 7, 0);
  drawFinder(0, size - 7);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if ((i < 8 && j < 8) || (i >= size - 8 && j < 8) || (i < 8 && j >= size - 8)) continue;
      const charIdx = (i * size + j) % hash.length;
      const charCode = hash.charCodeAt(charIdx);
      if ((charCode + i + j) % 2 === 0) {
        ctx.fillRect(i * scale, j * scale, scale, scale);
      }
    }
  }

  qrZone.innerHTML = '';
  qrZone.appendChild(canvas);

  downloadBtn?.addEventListener('click', () => {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `QR-${state.friend.name || 'Dost'}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
    sfxClick();
    vibrate(30);
  });
}

/* ============================================================
   MUSIC
   ============================================================ */
function initMusic() {
  const btn = $('#music-toggle');
  if (!btn || btn.dataset.init === 'true') return;
  btn.dataset.init = 'true';

  btn.addEventListener('click', () => {
    if (state.musicPlaying) { stopMusic(); btn.textContent = '🔇'; }
    else { startMusic(); btn.textContent = '🔊'; }
    sfxClick(); vibrate(20);
  });
}

function startMusic() {
  if (state.musicPlaying) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    state.audioCtx = ctx;
    state.musicPlaying = true;
    const notes = [
      [264, .3], [264, .2], [297, .5], [264, .5], [352, .5], [330, 1],
      [264, .3], [264, .2], [297, .5], [264, .5], [396, .5], [352, 1],
      [264, .3], [264, .2], [528, .5], [440, .5], [352, .5], [330, .5], [297, 1],
      [470, .3], [470, .2], [440, .5], [352, .5], [396, .5], [352, 1],
    ];
    let time = ctx.currentTime;
    notes.forEach(([freq, dur]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(0.15, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + dur + 0.05);
      time += dur + 0.05;
    });
  } catch {}
}

function stopMusic() {
  if (state.audioCtx && state.audioCtx.state !== 'closed') state.audioCtx.close().catch(() => {});
  state.musicPlaying = false;
}

/* ============================================================
   RESTART
   ============================================================ */
function initRestart() {
  const btn = $('#restart-btn');
  if (!btn || btn.dataset.init === 'true') return;
  btn.dataset.init = 'true';

  btn.addEventListener('click', () => {
    state.selectedGender = '';
    state.photoStripCount = 0;
    state.blowDetected = false;
    state.balloonScore = 0;
    state.memoryMatched = 0;
    state.memoryMoves = 0;
    state.memoryFlipped = [];
    state.quizIndex = 0;
    state.quizScore = 0;
    state.currentStep = 1;

    const nameInput = $('#friend-name');
    const gatePass = $('#gate-pass');
    if (nameInput) nameInput.value = '';
    if (gatePass) gatePass.value = '';

    $$('.gender-btn').forEach((b) => {
      b.classList.remove('selected');
      b.setAttribute('aria-pressed', 'false');
    });
    const nextBtn = $('#id-next');
    if (nextBtn) nextBtn.disabled = true;
    const photoStrip = $('#photo-strip');
    if (photoStrip) photoStrip.innerHTML = '';

    $$('[data-init="true"]').forEach(el => el.dataset.init = 'false');

    $$('.step').forEach((s, i) => {
      if (i === 0) {
        s.classList.add('step--active');
        s.hidden = false;
      } else {
        s.classList.remove('step--active');
        s.hidden = true;
      }
    });

    ['#chain-view', '#cert-zone', '#balloon-zone', '#memory-grid', '#quiz-content',
     '#gift-zone', '#timeline-zone', '#wish-list', '#capsule-list',
     '#nametune-visual', '#qr-code', '#theme-picker-container'].forEach((sel) => {
      const el = $(sel);
      if (el) {
        el.innerHTML = '';
        delete el.dataset.init;
      }
    });

    cleanupMic();
    stopMusic();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (state.voiceRecognition) {
      try { state.voiceRecognition.stop(); } catch {}
    }
    if (state.photoStream) {
      state.photoStream.getTracks().forEach((t) => t.stop());
      state.photoStream = null;
    }

    localStorage.removeItem(BEEJ_CONFIG.stepKey);

    sfxWhoosh();
    showScene('#scene-gate');
  });
}

/* ============================================================
   RESTORE HUE
   ============================================================ */
function restoreHue() {
  const saved = localStorage.getItem(BEEJ_CONFIG.hueKey);
  if (saved) document.documentElement.style.setProperty('--hue', saved);
}

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // ALWAYS show language screen (fresh experience)
  const savedLang = localStorage.getItem(BEEJ_CONFIG.langKey) || 'hinglish';
  state.lang = savedLang;
  applyLanguage(savedLang);

  restoreHue();

  // Init scenes
  initLanguageSelect();   // Always shows language screen
  initGate();
  initSoulId();
  initBooth();
});
