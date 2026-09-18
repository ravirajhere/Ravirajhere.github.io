/* =========================================================
   formal.js — "Ek Baat" Experience Engine
   ========================================================= */

'use strict';

/* =========================================================
   1. CONTENT — All text, both languages, all moods
   ========================================================= */

const CONTENT = {
  hinglish: {
    opening: {
      line: "Aaj kuch kehna hai...",
      sub: "par shuru karne se pehle, ek saans le leta hoon."
    },
    language: {
      prompt: "Kaunsi bhasha mein baat karun?"
    },
    name: {
      prompt: "Apna naam batao..."
    },
    nickname: {
      prompt: "Aur... main tumhe kya bulaun?",
      skip: "Skip karo"
    },
    mood: {
      prompt: "Aaj kaisa feel ho raha hai?",
      labels: { happy: "Achha", normal: "Normal", low: "Thoda low" }
    },
    letter: {
      hint: "Kholne ke liye tap karo",
      salutation: (nick) => `Priye ${nick},`,
      signature: "— Tumhara, hamesha",
      bodies: {
        happy: [
          "Aaj tumhari aawaz mein kuch alag tha.",
          "Jaise din ne khud decide kiya ho ki aaj tumhe khush rakhna hai.",
          "Mujhe nahi pata kab se, par tumhari hasi meri favourite cheez ban gayi hai.",
          "Kisi ne poocha bhi nahi, bas ho gayi.",
          "Aur aaj, pehli baar, main bina soche keh raha hoon —",
          "Tum mere liye bahut special ho."
        ],
        normal: [
          "Kabhi kabhi kuch kehne ke liye sahi waqt ka intezaar karte hain.",
          "Aaj wo waqt lagta hai.",
          "Tumse baat karke ek ajeeb sa sukoon milta hai.",
          "Jaise sab kuch apni jagah pe hai.",
          "Aur aaj main sirf itna kehna chahta hoon —",
          "Tum mere liye special ho."
        ],
        low: [
          "Agar aaj thak gayi ho, toh bas itna jaano — tum akele nahi ho.",
          "Din kharab ho sakta hai. Mood kharab ho sakta hai.",
          "Par tum... tum wahi ho. Aur wahi kaafi hai.",
          "Aaj kuch bada nahi kehna. Bas itna —",
          "Tum mere liye special ho.",
          "Chahe tumhe aaj feel ho ya na ho."
        ]
      }
    },
    question: {
      line: "Kya tum meri baat sunogi?",
      answers: { yes: "Haan", time: "Thoda time chahiye" }
    },
    response: {
      yes: "Thank you. Bas itna hi kehna tha.",
      time: "Bilkul. Koi jaldi nahi. Main yahin hoon — jab tum ready ho."
    },
    ending: "Ye sab sirf tumhare liye tha.",
    easter: "Aur ek baat... tum meri sabse pyari 'kuch nahi' ho. ❤"
  },

  english: {
    opening: {
      line: "There's something I want to say...",
      sub: "but before I begin, let me take one breath."
    },
    language: {
      prompt: "Which language would you like?"
    },
    name: {
      prompt: "Tell me your name..."
    },
    nickname: {
      prompt: "And... what should I call you?",
      skip: "Skip"
    },
    mood: {
      prompt: "How are you feeling today?",
      labels: { happy: "Good", normal: "Just okay", low: "A little low" }
    },
    letter: {
      hint: "Tap to open",
      salutation: (nick) => `Dear ${nick},`,
      signature: "— Yours, always",
      bodies: {
        happy: [
          "There was something different in your voice today.",
          "As if the day itself decided to keep you happy.",
          "I don't know since when, but your laugh became my favourite thing.",
          "No one asked me, it just happened.",
          "And today, for the first time, I'm saying it without overthinking —",
          "You are very special to me."
        ],
        normal: [
          "Sometimes we wait for the right moment to say certain things.",
          "Today feels like that moment.",
          "Talking to you gives a strange kind of peace.",
          "Like everything is where it should be.",
          "And today I just want to say this —",
          "You are special to me."
        ],
        low: [
          "If today has been heavy, just know this — you are not alone.",
          "The day can be bad. The mood can be bad.",
          "But you... you are still you. And that is enough.",
          "Today I don't want to say anything big. Just this —",
          "You are special to me.",
          "Even if you don't feel it today."
        ]
      }
    },
    question: {
      line: "Will you hear me out?",
      answers: { yes: "Yes", time: "I need some time" }
    },
    response: {
      yes: "Thank you. That's all I wanted to say.",
      time: "Of course. No rush at all. I'll be here — whenever you're ready."
    },
    ending: "This was all only for you.",
    easter: "And one more thing... you are my favourite 'nothing'. ❤"
  }
};


/* =========================================================
   2. STATE
   ========================================================= */

const STATE = {
  lang: null,
  name: '',
  nickname: '',
  mood: null,
  answer: null,
  musicOn: false,
  tapCount: 0,
  sceneIndex: 0
};


/* =========================================================
   3. HELPERS
   ========================================================= */

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const wait = (ms) => new Promise(res => setTimeout(res, ms));

function setText(el, txt) {
  if (el) el.textContent = txt || '';
}


/* =========================================================
   4. SCENE MANAGER
   ========================================================= */

const SCENES = [
  'scene-opening',
  'scene-language',
  'scene-name',
  'scene-nickname',
  'scene-mood',
  'scene-letter',
  'scene-question',
  'scene-response',
  'scene-ending'
];

function showScene(id) {
  SCENES.forEach(sid => {
    const el = document.getElementById(sid);
    if (!el) return;
    el.classList.toggle('scene--active', sid === id);
  });
  STATE.sceneIndex = SCENES.indexOf(id);
}

async function nextScene() {
  const next = SCENES[STATE.sceneIndex + 1];
  if (!next) return;
  await wait(500);
  showScene(next);
  runScene(next);
}


/* =========================================================
   5. SCENE RUNNERS
   ========================================================= */

async function runScene(id) {
  switch (id) {

    case 'scene-opening': {
      const data = CONTENT[STATE.lang || 'hinglish'].opening;
      const lineEl = $('#opening-line');
      const subEl  = $('#opening-sub');

      lineEl.textContent = '';
      subEl.textContent = '';

      await wait(1000);
      await typeInto(lineEl, data.line, 60);
      await wait(1500);
      await typeInto(subEl, data.sub, 42);
      await wait(2000);
      nextScene();
      break;
    }

    case 'scene-language': {
      setText($('#lang-prompt'), 'Choose your language / Bhasha chuno');
      break;
    }

    case 'scene-name': {
      setText($('#name-prompt'), CONTENT[STATE.lang].name.prompt);
      const inp = $('#name-input');
      inp.value = '';
      $('#name-next').disabled = true;
      setTimeout(() => inp.focus(), 400);
      break;
    }

    case 'scene-nickname': {
      const data = CONTENT[STATE.lang].nickname;
      setText($('#nick-prompt'), data.prompt);
      setText($('#nick-skip-label'), data.skip);
      const inp = $('#nick-input');
      inp.value = '';
      $('#nick-next').disabled = true;
      setTimeout(() => inp.focus(), 400);
      break;
    }

    case 'scene-mood': {
      const data = CONTENT[STATE.lang].mood;
      setText($('#mood-prompt'), data.prompt);
      $$('[data-mood-label]').forEach(el => {
        const key = el.getAttribute('data-mood-label');
        setText(el, data.labels[key]);
      });
      break;
    }

    case 'scene-letter': {
      const data = CONTENT[STATE.lang].letter;
      setText($('#paper-hint'), data.hint);

      const paper = $('#paper-closed');
      paper.classList.remove('paper--open');
      paper.style.display = '';

      const letter = $('#letter-open');
      letter.classList.add('letter--hidden');
      letter.classList.remove('letter--revealed');
      break;
    }

    case 'scene-question': {
      const data = CONTENT[STATE.lang].question;
      setText($('#question-line'), data.line);
      $$('[data-answer-label]').forEach(el => {
        const key = el.getAttribute('data-answer-label');
        setText(el, data.answers[key]);
      });
      break;
    }

    case 'scene-ending': {
      setText($('#ending-line'), CONTENT[STATE.lang].ending);
      await wait(1400);
      const heart = $('#ending-heart');
      if (heart) heart.classList.add('ending-heart--beat');
      await wait(5000);
      if (heart) heart.classList.add('ending-heart--fade');
      break;
    }
  }
}


/* =========================================================
   6. TYPING ANIMATION
   ========================================================= */

function typeInto(el, text, speed = 45) {
  return new Promise(resolve => {
    if (!el) return resolve();
    el.textContent = '';
    el.classList.add('typing');
    let i = 0;

    const tick = () => {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        const ch = text.charAt(i);
        i++;

        let delay = speed;
        if (ch === ',' || ch === ';') delay = speed * 3;
        if (ch === '.' || ch === '?' || ch === '!') delay = speed * 5;
        if (ch === '—') delay = speed * 4;

        setTimeout(tick, delay);
      } else {
        el.classList.remove('typing');
        resolve();
      }
    };
    tick();
  });
}


/* =========================================================
   7. LANGUAGE HANDLING
   ========================================================= */

function applyLanguage(lang) {
  STATE.lang = lang;
  document.documentElement.setAttribute('data-lang', lang);

  $$('.lang-btn').forEach(btn => {
    btn.classList.toggle('lang-btn--active',
      btn.getAttribute('data-lang') === lang);
  });

  const currentId = SCENES[STATE.sceneIndex];
  if (currentId && currentId !== 'scene-opening' && currentId !== 'scene-language') {
    runScene(currentId);
  }
}

function showLangToggle() {
  const t = $('#lang-toggle');
  if (t) t.classList.add('lang-toggle--visible');
}

$$('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    applyLanguage(btn.getAttribute('data-lang'));
    playNote(523.25, 0.5, 0.04);
  });
});

$$('[data-choose-lang]').forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.getAttribute('data-choose-lang');
    applyLanguage(lang);
    showLangToggle();
    playNote(659.25, 0.6, 0.05);
    nextScene();
  });
});


/* =========================================================
   8. NAME INPUT
   ========================================================= */

const nameInput = $('#name-input');
const nameNext  = $('#name-next');

nameInput.addEventListener('input', () => {
  nameNext.disabled = nameInput.value.trim().length < 2;
});

nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !nameNext.disabled) nameNext.click();
});

nameNext.addEventListener('click', () => {
  STATE.name = nameInput.value.trim();
  playNote(587.33, 0.5, 0.05);
  heartBurst(window.innerWidth / 2, window.innerHeight / 2, 14);
  nextScene();
});


/* =========================================================
   9. NICKNAME INPUT
   ========================================================= */

const nickInput = $('#nick-input');
const nickNext  = $('#nick-next');
const nickSkip  = $('#nick-skip');

nickInput.addEventListener('input', () => {
  nickNext.disabled = nickInput.value.trim().length < 1;
});

nickInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !nickNext.disabled) nickNext.click();
});

nickNext.addEventListener('click', () => {
  STATE.nickname = nickInput.value.trim() || STATE.name;
  playNote(659.25, 0.5, 0.05);
  nextScene();
});

nickSkip.addEventListener('click', () => {
  STATE.nickname = STATE.name;
  playNote(493.88, 0.4, 0.04);
  nextScene();
});


/* =========================================================
   10. MOOD CHOICE
   ========================================================= */

$$('[data-mood]').forEach(btn => {
  btn.addEventListener('click', () => {
    STATE.mood = btn.getAttribute('data-mood');
    document.body.setAttribute('data-mood', STATE.mood);
    playNote(523.25, 0.6, 0.05);
    heartBurst(window.innerWidth / 2, window.innerHeight / 2, 16);
    nextScene();
  });
});


/* =========================================================
   11. PAPER UNFOLD + LETTER
   ========================================================= */

const paperClosed = $('#paper-closed');
let letterOpened = false;

paperClosed.addEventListener('click', async () => {
  if (letterOpened) return;
  letterOpened = true;

  paperClosed.classList.add('paper--open');
  playNote(392.00, 0.9, 0.06);

  await wait(650);

  paperClosed.style.display = 'none';

  const letter = $('#letter-open');
  letter.classList.remove('letter--hidden');
  letter.classList.add('letter--revealed');

  await wait(500);

  const data = CONTENT[STATE.lang].letter;
  setText($('#letter-salutation'), data.salutation(STATE.nickname || STATE.name));
  setText($('#letter-signature'), data.signature);

  const lines = data.bodies[STATE.mood] || data.bodies.normal;
  const bodyEl = $('#letter-body');
  bodyEl.innerHTML = '';

  for (let i = 0; i < lines.length; i++) {
    const p = document.createElement('p');
    p.className = 'letter-line';
    bodyEl.appendChild(p);

    const isLast = i === lines.length - 1;
    await typeInto(p, lines[i], isLast ? 75 : 50);

    if (isLast) {
      await wait(2200);
    } else if (i === lines.length - 2) {
      await wait(3500);
      playNote(261.63, 1.8, 0.05);
    } else {
      await wait(1800);
    }
  }

  await wait(2400);
  nextScene();
});


/* =========================================================
   12. FINAL QUESTION
   ========================================================= */

$$('[data-answer]').forEach(btn => {
  btn.addEventListener('click', async () => {
    const ans = btn.getAttribute('data-answer');
    STATE.answer = ans;

    playNote(ans === 'yes' ? 659.25 : 440.00, 0.9, 0.05);

    if (ans === 'yes') {
      heartBurst(window.innerWidth / 2, window.innerHeight / 2, 26);
    }

    setText($('#response-line'), CONTENT[STATE.lang].response[ans]);

    await wait(450);
    showScene('scene-response');
    await wait(3400);
    nextScene();
  });
});


/* =========================================================
   13. AUDIO — WebAudio piano
   ========================================================= */

let audioCtx = null;

function ensureAudio() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playNote(freq, dur = 0.6, vol = 0.05) {
  if (!STATE.musicOn) return;
  ensureAudio();
  if (!audioCtx) return;

  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = 'sine';
  osc.frequency.value = freq;

  filter.type = 'lowpass';
  filter.frequency.value = 1800;

  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(vol, t + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  osc.connect(filter).connect(gain).connect(audioCtx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.1);
}


/* =========================================================
   14. MUSIC TOGGLE
   ========================================================= */

const musicBtn = $('#music-toggle');

musicBtn.addEventListener('click', () => {
  STATE.musicOn = !STATE.musicOn;
  musicBtn.classList.toggle('music-toggle--on', STATE.musicOn);
  if (STATE.musicOn) {
    ensureAudio();
    playNote(523.25, 1.2, 0.05);
    setTimeout(() => playNote(659.25, 1.0, 0.04), 260);
  }
});


/* =========================================================
   15. BACKGROUND PARTICLES
   ========================================================= */

const bgCanvas = $('#bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
let particles = [];
let W = 0, H = 0;
const DPR = Math.min(window.devicePixelRatio || 1, 2);

function resizeCanvas() {
  W = window.innerWidth;
  H = window.innerHeight;
  bgCanvas.width = W * DPR;
  bgCanvas.height = H * DPR;
  bgCanvas.style.width = W + 'px';
  bgCanvas.style.height = H + 'px';
  bgCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

function initParticles() {
  particles = [];
  const count = Math.min(90, Math.floor(W / 14));
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.4 + 0.1),
      a: Math.random() * 0.5 + 0.15,
      hue: 300 + Math.random() * 80
    });
  }
}

function drawParticles() {
  bgCtx.clearRect(0, 0, W, H);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
    if (p.x < -10) p.x = W + 10;
    if (p.x > W + 10) p.x = -10;

    bgCtx.beginPath();
    bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    bgCtx.fillStyle = `hsla(${p.hue}, 90%, 72%, ${p.a})`;
    bgCtx.shadowBlur = 12;
    bgCtx.shadowColor = `hsla(${p.hue}, 90%, 65%, 0.8)`;
    bgCtx.fill();
  }
  bgCtx.shadowBlur = 0;
}


/* =========================================================
   16. CURSOR TRAIL + HEART BURSTS
   ========================================================= */

const fxCanvas = $('#fx-canvas');
const fxCtx = fxCanvas.getContext('2d');
let trail = [];
let bursts = [];
let lastMove = 0;

function resizeFx() {
  fxCanvas.width = W * DPR;
  fxCanvas.height = H * DPR;
  fxCanvas.style.width = W + 'px';
  fxCanvas.style.height = H + 'px';
  fxCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

function heartPath(ctx, x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.35);
  ctx.bezierCurveTo(x, y, x - s, y, x - s, y + s * 0.35);
  ctx.bezierCurveTo(x - s, y + s * 0.85, x, y + s * 1.15, x, y + s * 1.5);
  ctx.bezierCurveTo(x, y + s * 1.15, x + s, y + s * 0.85, x + s, y + s * 0.35);
  ctx.bezierCurveTo(x + s, y, x, y, x, y + s * 0.35);
  ctx.closePath();
}

window.addEventListener('pointermove', (e) => {
  const now = performance.now();
  if (now - lastMove < 18) return;
  lastMove = now;

  trail.push({
    x: e.clientX,
    y: e.clientY,
    life: 1,
    hue: 300 + Math.random() * 80,
    size: 3 + Math.random() * 3
  });
  if (trail.length > 40) trail.shift();
});

window.addEventListener('click', (e) => {
  if (e.target.closest('button') || e.target.closest('input')) return;
  heartBurst(e.clientX, e.clientY, 14);
});

function heartBurst(x, y, n) {
  for (let i = 0; i < n; i++) {
    const ang = Math.random() * Math.PI * 2;
    const sp = Math.random() * 4 + 1.5;
    bursts.push({
      x, y,
      vx: Math.cos(ang) * sp,
      vy: Math.sin(ang) * sp - 1,
      life: 1,
      size: Math.random() * 6 + 4,
      hue: 300 + Math.random() * 80,
      rot: Math.random() * Math.PI
    });
  }
}

function drawFx() {
  fxCtx.clearRect(0, 0, W, H);

  /* Trail */
  for (const t of trail) {
    t.life -= 0.028;
    if (t.life <= 0) continue;
    fxCtx.globalAlpha = t.life * 0.65;
    fxCtx.fillStyle = `hsl(${t.hue}, 100%, 72%)`;
    fxCtx.shadowBlur = 16;
    fxCtx.shadowColor = `hsl(${t.hue}, 100%, 65%)`;
    fxCtx.beginPath();
    fxCtx.arc(t.x, t.y, t.size * t.life, 0, Math.PI * 2);
    fxCtx.fill();
  }
  trail = trail.filter(t => t.life > 0);

  /* Bursts */
  for (const b of bursts) {
    b.x += b.vx;
    b.y += b.vy;
    b.vy += 0.11;
    b.vx *= 0.99;
    b.life -= 0.017;
    b.rot += 0.06;
    if (b.life <= 0) continue;

    fxCtx.save();
    fxCtx.globalAlpha = Math.max(0, b.life);
    fxCtx.translate(b.x, b.y);
    fxCtx.rotate(b.rot);
    fxCtx.fillStyle = `hsl(${b.hue}, 100%, 70%)`;
    fxCtx.shadowBlur = 18;
    fxCtx.shadowColor = `hsl(${b.hue}, 100%, 60%)`;
    heartPath(fxCtx, 0, -b.size, b.size * 0.55);
    fxCtx.fill();
    fxCtx.restore();
  }
  bursts = bursts.filter(b => b.life > 0);

  fxCtx.globalAlpha = 1;
  fxCtx.shadowBlur = 0;
}


/* =========================================================
   17. EASTER EGG (5-tap on bottom zone)
   ========================================================= */

const easterZone = $('#easter-zone');
let easterTimer = null;

easterZone.addEventListener('click', () => {
  STATE.tapCount++;
  clearTimeout(easterTimer);
  easterTimer = setTimeout(() => { STATE.tapCount = 0; }, 2500);

  if (STATE.tapCount >= 5) {
    STATE.tapCount = 0;
    showEasterToast();
  }
});

function showEasterToast() {
  const existing = document.querySelector('.easter-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'easter-toast';
  toast.textContent = CONTENT[STATE.lang || 'hinglish'].easter;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('easter-toast--visible');
  });

  playNote(880, 1.4, 0.05);
  heartBurst(window.innerWidth / 2, window.innerHeight - 100, 20);

  setTimeout(() => {
    toast.classList.remove('easter-toast--visible');
    setTimeout(() => toast.remove(), 900);
  }, 5000);
}


/* =========================================================
   18. ANIMATION LOOP
   ========================================================= */

function animate() {
  drawParticles();
  drawFx();
  requestAnimationFrame(animate);
}


/* =========================================================
   19. BOOT
   ========================================================= */

function boot() {
  resizeCanvas();
  resizeFx();
  initParticles();
  animate();

  // Start the journey
  runScene('scene-opening');

  // Reveal lang toggle after a delay (so opening feels clean)
  setTimeout(showLangToggle, 4000);
}

document.addEventListener('DOMContentLoaded', boot);

/* Resize handling */
window.addEventListener('resize', () => {
  resizeCanvas();
  resizeFx();
  initParticles();
});
