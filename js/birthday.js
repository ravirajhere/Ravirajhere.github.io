/* ============================================================
   PROJECT BEEJ — birthday.js (v9 Merged)
   Pure Frontend • No Backend • GitHub Pages Ready
   ============================================================ */

/* ---------- CONFIG ---------- */
const BEEJ_CONFIG = {
  secretPassword: 'dost',       // 👈 yahan apna password rakhna
  storageKey: 'beej_chain_v9',
  hueKey: 'beej_hue_v9',
  userName: 'RaviRaj',          // letter me sign karne ke liye
  maxChainLength: 50,           // chain kitne blocks tak rakhni
  balloonCount: 6,
  photoCount: 4,
  micThreshold: 65,             // blow detect sensitivity
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
  currentAnimation: null,
};

/* ---------- SHORTCUT ---------- */
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
   02. STORAGE HELPERS
   ============================================================ */
function loadChain() {
  try {
    const raw = localStorage.getItem(BEEJ_CONFIG.storageKey);
    state.chain = raw ? JSON.parse(raw) : [];
  } catch (e) {
    state.chain = [];
  }
}

function saveChain() {
  try {
    // Chain limit
    if (state.chain.length > BEEJ_CONFIG.maxChainLength) {
      state.chain = state.chain.slice(-BEEJ_CONFIG.maxChainLength);
    }
    localStorage.setItem(BEEJ_CONFIG.storageKey, JSON.stringify(state.chain));
  } catch (e) {
    console.warn('Chain save failed:', e);
  }
}

/* ============================================================
   03. CRYPTO HELPERS
   ============================================================ */
async function sha256(str) {
  try {
    const buf = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(str)
    );
    return [...new Uint8Array(buf)]
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, 16);
  } catch (e) {
    // Fallback for non-HTTPS
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }
}

/* ============================================================
   04. SCENE 1: SECRET GATE
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
      showScene('#scene-id');
      setTimeout(() => $('#friend-name')?.focus(), 300);
    } else {
      errorEl.textContent = '❌ Galat password, dobara soch!';
      box.classList.add('error');
      input.value = '';
      input.focus();
      setTimeout(() => box.classList.remove('error'), 500);
    }
  });
}

/* ============================================================
   05. SCENE 2: SOUL ID
   ============================================================ */
function initSoulId() {
  const nameInput = $('#friend-name');
  const genderBtns = $$('.gender-btn');
  const nextBtn = $('#id-next');
  const freqEl = $('#freq-preview');
  const errorEl = $('#id-error');

  if (!nameInput) return;

  // Live frequency preview
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

  // Gender buttons
  genderBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      genderBtns.forEach((b) => {
        b.classList.remove('selected');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('selected');
      btn.setAttribute('aria-pressed', 'true');
      state.selectedGender = btn.dataset.gender;
      updateNextButton();
    });
  });

  function updateNextButton() {
    const nameOk = nameInput.value.trim().length >= 2;
    const genderOk = state.selectedGender !== '';
    nextBtn.disabled = !(nameOk && genderOk);
  }

  // Next button
  nextBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    if (!name || !state.selectedGender) return;

    // Compute hue from name
    const hue = computeHue(name);
    document.documentElement.style.setProperty('--hue', hue);
    localStorage.setItem(BEEJ_CONFIG.hueKey, hue);

    state.friend = {
      name,
      gender: state.selectedGender,
      hue,
    };

    // Create block
    const prevHash =
      state.chain.length > 0
        ? state.chain[state.chain.length - 1].hash
        : 'GENESIS';
    const data = `${name}|${state.selectedGender}|${prevHash}|${Date.now()}`;
    const hash = await sha256(data);

    const block = {
      name,
      gender: state.selectedGender,
      hash,
      prev: prevHash,
      time: new Date().toLocaleString('en-IN'),
      hue,
    };

    state.friend.hash = hash;
    state.chain.push(block);
    saveChain();

    errorEl.textContent = '';
    startHackSequence(name);
  });
}

function computeHue(name) {
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return sum % 360;
}

/* ============================================================
   06. SCENE 3: EMOTION BOOTH
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
        video: { facingMode: 'user', width: { ideal: 640 } },
        audio: false,
      });
      video.srcObject = stream;
      await video.play();
      status.textContent = 'Camera ready • Muskurao 📸';
      startBtn.textContent = '📸 Click Photo';
      startBtn.onclick = capturePhoto;
    } catch (err) {
      status.textContent = '❌ Camera access denied. Skip karo.';
      startBtn.disabled = true;
    }
  });

  skipBtn?.addEventListener('click', () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    showScene('#scene-hack');
  });

  async function capturePhoto() {
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
    // Mirror the photo
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

    // Add to strip
    const strip = $('#photo-strip');
    const img = document.createElement('img');
    img.src = dataUrl;
    img.alt = `Photo ${state.photoStripCount + 1}`;
    img.setAttribute('role', 'listitem');
    strip.appendChild(img);

    state.photoStripCount++;
    status.textContent = `📸 ${state.photoStripCount}/${BEEJ_CONFIG.photoCount} photos clicked!`;

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
   07. SCENE 4: MEMORY HACK TERMINAL
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
    `> Initializing Beej Protocol v9...`,
    `> Fetching memories of ${name}...`,
    `> Decoding Dosti Chain [${state.chain.length} blocks]`,
    `> Hue: ${state.friend.hue}° assigned to soul`,
    `> Compiling frequency...`,
    `> SHA256: ${hash}`,
    `> Done. Welcome to Civilization. 🌱`,
  ];

  let i = 0;
  let progress = 0;

  const interval = setInterval(() => {
    if (i < lines.length) {
      terminal.innerHTML += lines[i] + '\n';
      terminal.scrollTop = terminal.scrollHeight;
      i++;
      progress = Math.min(100, Math.round((i / lines.length) * 100));
      bar.style.width = progress + '%';
      if (progressBar) {
        progressBar.setAttribute('aria-valuenow', progress);
      }
    } else {
      clearInterval(interval);
      if (hashPreview) {
        hashPreview.textContent = `SHA256: ${hash}`;
      }
      setTimeout(() => launchMain(), 700);
    }
  }, 400);
}

/* ============================================================
   08. SCENE 5: MAIN CIVILIZATION
   ============================================================ */
function launchMain() {
  showScene('#scene-main');

  const { name, gender, hash } = state.friend;

  // Title
  const titleEl = $('#wish-title');
  if (titleEl) titleEl.textContent = `Happy Birthday, ${name} 🎂`;

  // Typewriter letter
  const letterText = buildLetter(name, gender);
  typeWriter('#letter-text', letterText, 40);

  // Typewriter hash
  typeWriter('#typewriter', `Proof-of-Dosti: ${hash}...`, 30);

  // Footer hash
  const footerHash = $('#footer-hash');
  if (footerHash) footerHash.textContent = hash;

  // Render sections
  renderChain();
  initBalloons();
  initCake();
  renderCertificate();
  initLetterDownloads();
  initMusic();
  initRestart();
}

/* ---------- Letter builder (gender-aware) ---------- */
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

  if (chainLen > 1) {
    letter += `Tere aane se pehle ${chainLen - 1} dost is mitti ko upjau bana gaye. `;
  }

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

/* ---------- Typewriter effect ---------- */
function typeWriter(selector, text, speed = 40) {
  const el = $(selector);
  if (!el) return;

  el.textContent = '';
  let i = 0;
  let interval = setInterval(() => {
    el.textContent += text[i] || '';
    i++;
    if (i >= text.length) clearInterval(interval);
  }, speed);
}

/* ---------- Render chain ---------- */
function renderChain() {
  const view = $('#chain-view');
  if (!view) return;

  const recent = state.chain.slice(-5);
  view.innerHTML = recent
    .map(
      (b, idx) =>
        `<div class="chain-block">
          <strong>${escapeHtml(b.name)}</strong> → ${b.hash}
          ${idx === recent.length - 1 ? ' ← you' : ''}
        </div>`
    )
    .join('');
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
    b.setAttribute('aria-label', 'Pop balloon');

    const pop = () => {
      if (b.classList.contains('popped')) return;
      b.classList.add('popped');
      state.balloonScore++;
      if (scoreEl) scoreEl.textContent = state.balloonScore;
      playPopSound();
    };

    b.addEventListener('click', pop);
    b.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        pop();
      }
    });

    zone.appendChild(b);
  }
}

/* ============================================================
   10. CAKE + MIC BLOW
   ============================================================ */
function initCake() {
  const micBtn = $('#mic-enable');
  const candles = $('#candles');
  const dbMeter = $('#db-meter');

  if (!micBtn || !candles) return;

  micBtn.addEventListener('click', async () => {
    try {
      state.micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      state.audioCtx =
        window.AudioContext || window.webkitAudioContext
          ? new (window.AudioContext || window.webkitAudioContext)()
          : null;

      if (!state.audioCtx) {
        micBtn.textContent = '❌ Audio not supported';
        return;
      }

      const source = state.audioCtx.createMediaStreamSource(state.micStream);
      state.analyser = state.audioCtx.createAnalyser();
      state.analyser.fftSize = 256;
      source.connect(state.analyser);

      micBtn.textContent = '🎤 Listening... Phook maro!';
      micBtn.disabled = true;

      detectBlow(candles, dbMeter, micBtn);
    } catch (err) {
      micBtn.textContent = '❌ Mic denied';
      micBtn.disabled = true;
    }
  });
}

function detectBlow(candles, dbMeter, micBtn) {
  if (!state.analyser) return;

  const data = new Uint8Array(state.analyser.frequencyBinCount);
  let animationId;

  const loop = () => {
    if (state.blowDetected) return;

    state.analyser.getByteFrequencyData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) sum += data[i];
    const volume = Math.round(sum / data.length);

    if (dbMeter) dbMeter.textContent = `${volume} dB`;

    if (volume > BEEJ_CONFIG.micThreshold) {
      // Blown!
      state.blowDetected = true;
      candles.classList.add('blown');
      candles.textContent = '💨 💨 💨';
      if (micBtn) micBtn.textContent = '🎉 Wish poori ho!';

      cleanupMic();
      fireConfetti();
      return;
    }

    animationId = requestAnimationFrame(loop);
  };

  loop();

  // Store animation ID for cleanup
  state.currentAnimation = animationId;
}

function cleanupMic() {
  if (state.audioCtx && state.audioCtx.state !== 'closed') {
    state.audioCtx.close().catch(() => {});
  }
  if (state.micStream) {
    state.micStream.getTracks().forEach((t) => t.stop());
  }
  state.analyser = null;
}

/* ============================================================
   11. CONFETTI (Pure JS, no library)
   ============================================================ */
function fireConfetti() {
  const count = 80;
  const colors = ['#d4af37', '#f3e6b5', '#ff6b9d', '#4ade80', '#60a5fa'];

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      top: -10px;
      left: ${Math.random() * 100}vw;
      width: 8px;
      height: 8px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
    `;
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 4500);
  }

  // Inject keyframes once
  if (!document.getElementById('confetti-style')) {
    const style = document.createElement('style');
    style.id = 'confetti-style';
    style.textContent = `
      @keyframes confettiFall {
        0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ============================================================
   12. CERTIFICATE
   ============================================================ */
function renderCertificate() {
  const zone = $('#cert-zone');
  if (!zone) return;

  const { name, hash } = state.friend;
  const chainLen = state.chain.length;
  const date = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  zone.innerHTML = `
    <div class="cert" id="cert-card">
      <h4>Certificate of Dosti</h4>
      <p>Issued to <strong>${escapeHtml(name)}</strong></p>
      <p>For being the ${chainLen}${getOrdinalSuffix(chainLen)} block of the Dosti Chain</p>
      <p>${date}</p>
      <p class="cert-hash">SHA256: ${hash}</p>
      <p style="font-size: 11px; margin-top: 8px; font-style: italic;">
        — Signed, ${BEEJ_CONFIG.userName}
      </p>
    </div>
  `;
}

/* ============================================================
   13. LETTER DOWNLOADS (PNG + TXT)
   ============================================================ */
function initLetterDownloads() {
  const pngBtn = $('#letter-download-png');
  const txtBtn = $('#letter-download-txt');

  pngBtn?.addEventListener('click', downloadLetterAsPNG);
  txtBtn?.addEventListener('click', downloadLetterAsTXT);
}

function downloadLetterAsTXT() {
  const text = $('#letter-text')?.textContent || '';
  const { name } = state.friend;
  const filename = `Message-from-${BEEJ_CONFIG.userName}-to-${name || 'Dost'}.txt`;

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadLetterAsPNG() {
  const card = $('#letter-card');
  if (!card) return;

  const { name } = state.friend;
  const text = $('#letter-text')?.textContent || '';

  // Build canvas
  const canvas = document.createElement('canvas');
  const scale = 2;
  canvas.width = 800 * scale;
  canvas.height = 1000 * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 800, 1000);
  grad.addColorStop(0, '#0a0f1e');
  grad.addColorStop(1, '#121a32');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 1000);

  // Border
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
  ctx.lineWidth = 3;
  ctx.strokeRect(24, 24, 752, 952);

  // Title
  ctx.fillStyle = '#f3e6b5';
  ctx.font = 'bold 32px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Message from ' + BEEJ_CONFIG.userName, 400, 100);

  // 💌 icon
  ctx.font = '48px serif';
  ctx.fillText('💌', 400, 165);

  // Letter text
  ctx.fillStyle = '#eef2ff';
  ctx.font = 'italic 22px Georgia, serif';
  ctx.textAlign = 'left';

  const lines = wrapText(ctx, text, 700);
  let y = 240;
  lines.forEach((line) => {
    ctx.fillText(line, 60, y);
    y += 34;
  });

  // Footer
  ctx.fillStyle = '#9aa4c7';
  ctx.font = '16px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    `Generated on ${new Date().toLocaleDateString('en-IN')}`,
    400,
    940
  );
  ctx.fillText('PROJECT BEEJ • A Living Birthday', 400, 965);

  // Download
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
  const paragraphs = text.split('\n');

  paragraphs.forEach((p) => {
    if (p.trim() === '') {
      lines.push('');
      return;
    }
    const words = p.split(' ');
    let current = '';

    words.forEach((word) => {
      const test = current ? current + ' ' + word : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    });

    if (current) lines.push(current);
  });

  return lines;
}

/* ============================================================
   14. MUSIC (Web Audio API — no MP3)
   ============================================================ */
function initMusic() {
  const btn = $('#music-toggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (state.musicPlaying) {
      stopMusic();
      btn.textContent = '🔇';
    } else {
      startMusic();
      btn.textContent = '🔊';
    }
  });
}

function startMusic() {
  if (state.musicPlaying) return;

  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    state.audioCtx = ctx;
    state.musicPlaying = true;

    // Happy Birthday melody (simplified)
    const notes = [
      [264, 0.3], [264, 0.2], [297, 0.5], [264, 0.5], [352, 0.5],
      [330, 1.0],
      [264, 0.3], [264, 0.2], [297, 0.5], [264, 0.5], [396, 0.5],
      [352, 1.0],
      [264, 0.3], [264, 0.2], [528, 0.5], [440, 0.5], [352, 0.5],
      [330, 0.5], [297, 1.0],
      [470, 0.3], [470, 0.2], [440, 0.5], [352, 0.5], [396, 0.5],
      [352, 1.0],
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
  } catch (e) {
    console.warn('Music failed:', e);
  }
}

function stopMusic() {
  if (state.audioCtx && state.audioCtx.state !== 'closed') {
    state.audioCtx.close().catch(() => {});
  }
  state.musicPlaying = false;
}

/* ============================================================
   15. SOUND EFFECTS (Pop, Click)
   ============================================================ */
function playPopSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);

    setTimeout(() => ctx.close(), 300);
  } catch (e) {
    /* silent */
  }
}

/* ============================================================
   16. RESTART
   ============================================================ */
function initRestart() {
  const btn = $('#restart-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    // Reset state
    state.selectedGender = '';
    state.photoStripCount = 0;
    state.blowDetected = false;
    state.balloonScore = 0;

    // Reset form
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

    // Cleanup mic/audio
    cleanupMic();
    stopMusic();

    // Go back to gate
    showScene('#scene-gate');
  });
}

/* ============================================================
   17. RESTORE HUE ON LOAD
   ============================================================ */
function restoreHue() {
  const saved = localStorage.getItem(BEEJ_CONFIG.hueKey);
  if (saved) {
    document.documentElement.style.setProperty('--hue', saved);
  }
}

/* ============================================================
   18. KEYBOARD SHORTCUTS
   ============================================================ */
function initKeyboard() {
  // Enter key on gate input
  const gateInput = $('#gate-pass');
  gateInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      $('#gate-form')?.requestSubmit();
    }
  });
}

/* ============================================================
   19. BOOT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  restoreHue();
  initGate();
  initSoulId();
  initBooth();
  initKeyboard();
});
