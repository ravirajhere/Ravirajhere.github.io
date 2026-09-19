/* ============================================================
   PROJECT BEEJ — birthday.js (v10 Phase 1)
   + Voice Wish, Vibration, Confetti, Sounds, Theme,
     Compliment, Countdown
   ============================================================ */

/* ---------- CONFIG ---------- */
const BEEJ_CONFIG = {
  secretPassword: 'dost',
  storageKey: 'beej_chain_v10',
  hueKey: 'beej_hue_v10',
  themeKey: 'beej_theme_v10',
  userName: 'RaviRaj',
  maxChainLength: 50,
  balloonCount: 6,
  photoCount: 4,
  micThreshold: 65,
};

/* ---------- STATE ---------- */
const state = {
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
};

/* ---------- HELPERS ---------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ============================================================
   01. SCENE SYSTEM
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
   02. STORAGE
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
   03. CRYPTO
   ============================================================ */
async function sha256(str) {
  try {
    const buf = await crypto.subtle.digest(
      'SHA-256', new TextEncoder().encode(str)
    );
    return [...new Uint8Array(buf)]
      .map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
  } catch {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }
}

/* ============================================================
   ⭐ NEW: VOICE WISH (Text-to-Speech)
   ============================================================ */
function speakWish(name, gender) {
  if (!('speechSynthesis' in window)) return;
  const msg = new SpeechSynthesisUtterance();
  msg.text = `Happy Birthday, ${name}! May your day be as special as you are.`;
  msg.lang = 'en-IN';
  msg.rate = 0.9;
  msg.pitch = gender === 'female' ? 1.2 : 0.9;
  msg.volume = 0.9;
  setTimeout(() => window.speechSynthesis.speak(msg), 800);
}

/* ============================================================
   ⭐ NEW: VIBRATION
   ============================================================ */
function vibrate(pattern = 50) {
  if ('vibrate' in navigator) {
    try { navigator.vibrate(pattern); } catch {}
  }
}

/* ============================================================
   ⭐ NEW: SOUND EFFECTS (Web Audio)
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

/* ============================================================
   ⭐ NEW: CONFETTI (Reusable)
   ============================================================ */
function fireConfetti(count = 60) {
  const colors = ['#d4af37', '#f3e6b5', '#ff6b9d', '#4ade80', '#60a5fa', '#fbbf24'];
  const shapes = ['●', '◆', '■', '▲', '★'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const isEmoji = Math.random() > 0.7;
    p.style.cssText = `
      position:fixed;
      top:-20px;
      left:${Math.random() * 100}vw;
      font-size:${isEmoji ? '20px' : '10px'};
      color:${colors[Math.floor(Math.random() * colors.length)]};
      pointer-events:none;
      z-index:9999;
      animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
      ${isEmoji ? '' : `background:${colors[Math.floor(Math.random() * colors.length)]};
        width:8px;height:8px;border-radius:50%;`}
    `;
    if (isEmoji) p.textContent = shapes[Math.floor(Math.random() * shapes.length)];
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 4500);
  }
  if (!document.getElementById('confetti-style')) {
    const style = document.createElement('style');
    style.id = 'confetti-style';
    style.textContent = `
      @keyframes confettiFall {
        0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ============================================================
   ⭐ NEW: THEME SWITCHER
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
  Object.entries(theme).forEach(([k, v]) => {
    document.documentElement.style.setProperty(k, v);
  });
  state.currentTheme = name;
  localStorage.setItem(BEEJ_CONFIG.themeKey, name);
}

function initThemeSwitcher() {
  const saved = localStorage.getItem(BEEJ_CONFIG.themeKey);
  if (saved) applyTheme(saved);

  // Create theme picker UI (in main scene footer)
  const footer = document.querySelector('.main-footer');
  if (!footer || document.getElementById('theme-picker')) return;

  const picker = document.createElement('div');
  picker.id = 'theme-picker';
  picker.className = 'theme-picker';
  picker.innerHTML = `
    <p class="label" style="text-align:center;margin:16px 0 8px">🎨 Theme Chuno</p>
    <div class="theme-dots">
      ${Object.keys(THEMES).map(t => `
        <button class="theme-dot" data-theme="${t}" 
                style="background:${THEMES[t]['--gold']}"
                title="${t}" aria-label="${t} theme"></button>
      `).join('')}
    </div>
  `;

  footer.insertBefore(picker, footer.firstChild);

  picker.querySelectorAll('.theme-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      applyTheme(dot.dataset.theme);
      sfxClick();
      vibrate(30);
      picker.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });

  // Mark active
  const activeDot = picker.querySelector(`[data-theme="${state.currentTheme}"]`);
  if (activeDot) activeDot.classList.add('active');
}

/* ============================================================
   ⭐ NEW: COMPLIMENT GENERATOR
   ============================================================ */
const COMPLIMENTS = [
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
];

function getCompliment() {
  return COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
}

function initComplimentGenerator() {
  const mainScene = $('#scene-main');
  if (!mainScene || document.getElementById('compliment-section')) return;

  const section = document.createElement('section');
  section.id = 'compliment-section';
  section.innerHTML = `
    <h2 class="section-title">💬 Compliment Machine</h2>
    <div class="compliment-box">
      <p id="compliment-text">Button dabao → ek sach sunao 💛</p>
      <button type="button" class="btn" id="compliment-btn">
        🎁 Ek Sach Sunao
      </button>
    </div>
  `;

  const footer = document.querySelector('.main-footer');
  mainScene.insertBefore(section, footer);

  $('#compliment-btn').addEventListener('click', () => {
    const el = $('#compliment-text');
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = getCompliment();
      el.style.opacity = '1';
    }, 200);
    sfxPop();
    vibrate([30, 50, 30]);
    fireConfetti(20);
  });
}

/* ============================================================
   ⭐ NEW: BIRTHDAY COUNTDOWN
   ============================================================ */
function initCountdown() {
  const mainScene = $('#scene-main');
  if (!mainScene || document.getElementById('countdown-section')) return;

  const section = document.createElement('section');
  section.id = 'countdown-section';
  section.innerHTML = `
    <h2 class="section-title">⏳ Agla Birthday</h2>
    <div class="countdown-box">
      <p id="countdown-text">-- din -- ghante -- minute</p>
      <input type="date" id="bday-date" class="input" style="margin-top:10px" />
      <p class="tiny mono" style="margin-top:6px;color:var(--muted)">
        Apna birthday date daalo → countdown start
      </p>
    </div>
  `;

  const footer = document.querySelector('.main-footer');
  mainScene.insertBefore(section, footer);

  const dateInput = $('#bday-date');
  const textEl = $('#countdown-text');

  const savedDate = localStorage.getItem('beej_bday');
  if (savedDate) dateInput.value = savedDate;

  function updateCountdown() {
    const val = dateInput.value;
    if (!val) {
      textEl.textContent = '-- din -- ghante -- minute';
      return;
    }
    localStorage.setItem('beej_bday', val);

    const now = new Date();
    const bday = new Date(val);
    bday.setFullYear(now.getFullYear());
    if (bday < now) bday.setFullYear(now.getFullYear() + 1);

    const diff = bday - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);

    textEl.textContent = `${days} din • ${hours} ghante • ${mins} minute`;
  }

  dateInput.addEventListener('change', () => {
    updateCountdown();
    sfxClick();
  });

  updateCountdown();
  setInterval(updateCountdown, 60000);
}

/* ============================================================
   04. GATE
   ============================================================ */
function initGate() {
  loadChain();
  const countEl = $('#gate-chain-count');
  if (countEl) countEl.textContent = state.chain.length;

  const form = $('#gate-form');
  const input = $('#gate-pass');
  const errorEl = $('#gate-error');
  const box = $('#gate-box');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim().toLowerCase();
    if (val === BEEJ_CONFIG.secretPassword) {
      errorEl.textContent = '';
      box.classList.remove('error');
      sfxSuccess();
      vibrate(50);
      fireConfetti(30);
      showScene('#scene-id');
      setTimeout(() => $('#friend-name')?.focus(), 300);
    } else {
      errorEl.textContent = '❌ Galat password, dobara soch!';
      box.classList.add('error');
      input.value = '';
      input.focus();
      vibrate([100, 50, 100]);
      setTimeout(() => box.classList.remove('error'), 500);
    }
  });
}

/* ============================================================
   05. SOUL ID
   ============================================================ */
function initSoulId() {
  const nameInput = $('#friend-name');
  const genderBtns = $$('.gender-btn');
  const nextBtn = $('#id-next');
  const freqEl = $('#freq-preview');
  const errorEl = $('#id-error');
  if (!nameInput) return;

  nameInput.addEventListener('input', () => {
    const name = nameInput.value.trim();
    if (name.length > 0) {
      const hue = computeHue(name);
      if (freqEl) freqEl.textContent = `Freq: ${name.length * 7} Hz • Hue: ${hue}°`;
    } else {
      if (freqEl) freqEl.textContent = 'Freq: -- Hz • Hue: --°';
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
      sfxClick();
      vibrate(20);
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

    const prevHash = state.chain.length > 0
      ? state.chain[state.chain.length - 1].hash : 'GENESIS';
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
    sfxWhoosh();
    vibrate(40);
    startHackSequence(name);
  });
}

function computeHue(name) {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return sum % 360;
}

/* ============================================================
   06. BOOTH
   ============================================================ */
function initBooth() {
  const startBtn = $('#booth-start');
  const skipBtn = $('#booth-skip');
  const video = $('#video');
  const status = $('#smile-status');
  if (!startBtn || !video) return;

  let stream = null;

  startBtn.addEventListener('click', async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 } }, audio: false,
      });
      video.srcObject = stream;
      await video.play();
      status.textContent = 'Camera ready • Muskurao 📸';
      startBtn.textContent = '📸 Click Photo';
      startBtn.onclick = capturePhoto;
    } catch {
      status.textContent = '❌ Camera denied. Skip karo.';
      startBtn.disabled = true;
    }
  });

  skipBtn?.addEventListener('click', () => {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    showScene('#scene-hack');
  });

  function capturePhoto() {
    if (state.photoStripCount >= BEEJ_CONFIG.photoCount) {
      status.textContent = '✅ Photo booth complete!';
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
    sfxClick();
    vibrate(40);
    fireConfetti(15);

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
   07. HACK TERMINAL
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
  const lines = [
    `> Initializing Beej Protocol v10...`,
    `> Fetching memories of ${name}...`,
    `> Decoding Dosti Chain [${state.chain.length} blocks]`,
    `> Hue: ${state.friend.hue}° assigned to soul`,
    `> Compiling frequency...`,
    `> Voice synthesis ready 🔊`,
    `> SHA256: ${hash}`,
    `> Done. Welcome to Civilization. 🌱`,
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
   08. MAIN
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

  renderChain();
  initBalloons();
  initCake();
  renderCertificate();
  initLetterDownloads();
  initMusic();
  initRestart();
  initThemeSwitcher();
  initComplimentGenerator();
  initCountdown();

  // 🎤 Voice Wish + 🎉 Confetti Welcome
  speakWish(name, gender);
  setTimeout(() => fireConfetti(80), 1200);
  setTimeout(() => vibrate([50, 100, 50, 100, 50]), 1200);
}

function buildLetter(name, gender) {
  const chainLen = state.chain.length;
  const greetings = {
    male: `Mere bhai ${name},`,
    female: `Meri pyaari dost ${name},`,
    other: `Mere dost ${name},`,
  };
  const greeting = greetings[gender] || greetings.other;

  let letter = `${greeting}\n\n`;
  letter += `Aaj tera din hai, par ye sirf ek din nahi — ye ek yaad hai jo main hamesha rakhna chahta hun.\n\n`;
  letter += `Tu is BEEJ Civilization ka ${chainLen}${getOrdinalSuffix(chainLen)} block hai. `;
  if (chainLen > 1) letter += `Tere aane se pehle ${chainLen - 1} dost is mitti ko upjau bana gaye. `;
  letter += `Har dost ke saath ye ped bada ho raha hai, aur teri ek daali isme hamesha rahegi.\n\n`;
  letter += `Chahe hum kitni bhi door ho jaayein, ye chain kabhi tootegi nahi. `;
  letter += `Teri dosti meri sabse badi daulat hai.\n\n`;
  letter += `Happy Birthday, mere yaar.\n\n`;
  letter += `— ${BEEJ_CONFIG.userName}`;
  return letter;
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
    `<div class="chain-block">
      <strong>${escapeHtml(b.name)}</strong> → ${b.hash}
      ${idx === recent.length - 1 ? ' ← you' : ''}
    </div>`
  ).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ============================================================
   09. BALLOON GAME
   ============================================================ */
function initBalloons() {
  const zone = $('#balloon-zone');
  const scoreEl = $('#balloon-score');
  if (!zone) return;

  zone.innerHTML = '';
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
      sfxPop();
      vibrate(30);
      fireConfetti(10);
    };

    b.addEventListener('click', pop);
    b.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pop(); }
    });

    zone.appendChild(b);
  }
}

/* ============================================================
   10. CAKE + MIC
   ============================================================ */
function initCake() {
  const micBtn = $('#mic-enable');
  const candles = $('#candles');
  const dbMeter = $('#db-meter');
  if (!micBtn || !candles) return;

  micBtn.addEventListener('click', async () => {
    try {
      state.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = state.audioCtx.createMediaStreamSource(state.micStream);
      state.analyser = state.audioCtx.createAnalyser();
      state.analyser.fftSize = 256;
      source.connect(state.analyser);
      micBtn.textContent = '🎤 Listening... Phook maro!';
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
      if (micBtn) micBtn.textContent = '🎉 Wish poori ho!';
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
  if (state.audioCtx && state.audioCtx.state !== 'closed') {
    state.audioCtx.close().catch(() => {});
  }
  if (state.micStream) state.micStream.getTracks().forEach((t) => t.stop());
  state.analyser = null;
}

/* ============================================================
   11. CERTIFICATE
   ============================================================ */
function renderCertificate() {
  const zone = $('#cert-zone');
  if (!zone) return;
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
      📥 Certificate Download
    </button>
  `;

  const btn = $('#cert-download');
  if (btn) {
    btn.addEventListener('click', () => {
      downloadCertificateAsPNG();
      sfxClick();
      vibrate(30);
    });
  }
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
   12. LETTER DOWNLOADS
   ============================================================ */
function initLetterDownloads() {
  $('#letter-download-png')?.addEventListener('click', () => {
    downloadLetterAsPNG();
    sfxClick();
    vibrate(30);
  });
  $('#letter-download-txt')?.addEventListener('click', () => {
    downloadLetterAsTXT();
    sfxClick();
    vibrate(30);
  });
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
  lines.forEach((line) => {
    ctx.fillText(line, 60, y);
    y += 34;
  });

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
   13. MUSIC
   ============================================================ */
function initMusic() {
  const btn = $('#music-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (state.musicPlaying) { stopMusic(); btn.textContent = '🔇'; }
    else { startMusic(); btn.textContent = '🔊'; }
    sfxClick();
    vibrate(20);
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
  if (state.audioCtx && state.audioCtx.state !== 'closed') {
    state.audioCtx.close().catch(() => {});
  }
  state.musicPlaying = false;
}

/* ============================================================
   14. RESTART
   ============================================================ */
function initRestart() {
  const btn = $('#restart-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    state.selectedGender = '';
    state.photoStripCount = 0;
    state.blowDetected = false;
    state.balloonScore = 0;

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

    cleanupMic();
    stopMusic();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    sfxWhoosh();
    showScene('#scene-gate');
  });
}

/* ============================================================
   15. RESTORE HUE
   ============================================================ */
function restoreHue() {
  const saved = localStorage.getItem(BEEJ_CONFIG.hueKey);
  if (saved) document.documentElement.style.setProperty('--hue', saved);
}

/* ============================================================
   16. BOOT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  restoreHue();
  initGate();
  initSoulId();
  initBooth();
});
