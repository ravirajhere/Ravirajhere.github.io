// ============================================================
// AUTOBIOGRAPHY.JS — BOOK VIEW EDITION
// (Chapter Navigation, Audio Controls, Sidebar, Keyboard Shortcuts)
// ============================================================

'use strict';

// ============================================================
// BOOK DATA (13 Chapters — English)
// ============================================================
const chapters = [
    {
        id: 1,
        title: "The Beginning",
        content: "I was born in March 2008 in Begusarai, Bihar. My father told me that when I was born, my mother said, \"Name him Ravi, because he will bring light to this house.\" Since then, I have been the light of my family. My childhood home was in Bandwar, a village where life moved at its own pace. The house was big, with open courtyards and long corridors. I grew up under the loving yet strict guardianship of my parents. They were caring, supportive, but firm when it came to discipline. I have two elder sisters — my first teachers, my first friends, and my first protectors. Growing up with them taught me patience, sharing, and the quiet strength that comes from being part of a close-knit family. One of my favorite childhood memories is spending hours on the swing in our courtyard. I could swing for hours, looking at the sky, imagining things, and letting my mind wander. I also remember stealing my sister's cycle one day to join a race — and falling straight into a gutter! My father picked me up, laughed, and said, \"Beta, pehle balance seekh, phir speed.\" In 2014, I started my first school — a small one, but it held a universe of memories. Those early years shaped the person I would become."
    },
    {
        id: 2,
        title: "Primary School Days",
        content: "From 2014 to 2019, I studied at Gautam Buddha Global School in Begusarai. It was my first real school, and it shaped my early years. My favorite teacher was Binod Sir, who taught Hindi. He didn't just teach grammar and poetry — he taught life lessons. He believed that Hindi wasn't just a subject — it was an emotion, a way to connect with our roots. His words stayed with me long after the class ended. My earliest friends are a blur of laughter and memories — Sitanashu, Satyam, and Rohit were my first companions. Later, in Mother's Pride, Ayush and Rishidev became my closest friends. School wasn't always easy. I was an introvert — painfully shy, quiet, and always in my own head. I struggled to speak up in class, was scared to approach teachers, and found it hard to talk to classmates. But those years taught me a valuable lesson: growth begins where comfort ends. In GBGS, I participated in a quiz competition organized by Chetna Samiti and won a medal, a certificate, and a book. It was a small moment, but it planted a seed of confidence inside me."
    },
    {
        id: 3,
        title: "Secondary School Years",
        content: "From 2019 to 2024, I studied at Mother's Pride International School in Begusarai. It was a new chapter, full of new challenges and opportunities. I had inspiring teachers who shaped my thinking: Binod Sir continued to influence me, and Ujjwal Sir made me fall in love with numbers. One of the most painful moments of my academic life came during my first math test. I scored 10 out of 25. I remember coming home, sitting alone, and crying. But that day became a turning point. I worked harder. By Term 1, I had climbed to 3rd position in class. This was also the time when I truly connected with Rishidev and Ayush. They understood me, accepted my quietness, and never made me feel like I had to pretend to be someone else. In 2021, I was the co-head of a school project — a solar cooker — with my friend Suraj as the lead. That project taught me: If you understand the principle, you can build anything. I also created my first LinkedIn profile during this time — my first step into the digital world."
    },
    {
        id: 4,
        title: "JEE Coaching — The Journey",
        content: "In 2024, I started my JEE preparation at Physics Wallah Iskon Vidyapeeth, Patna. It was my first time away from home, sitting in a room with hundreds of students who all wanted the same thing. It was a unique experience — challenging, intense, and life-changing. I learned to perform under time-bound pressure, and I became more disciplined and focused. I had incredible teachers: Amarjeet Sir, Aditya Gaurav Sir, and Deepak Manas Sir. They taught me how to think, not just how to solve problems. But the competitive pressure was overwhelming at times. I had suicidal thoughts. I didn't tell anyone. But I survived. I kept going — not because I was strong, but because I didn't know what else to do. During this phase, I had to pause coding. The JEE preparation demanded everything. But that break wasn't a failure — it was a detour. And sometimes, detours are necessary to find your way back. I realized that coding was my calling, not JEE."
    },
    {
        id: 5,
        title: "Coding Discovery",
        content: "In 2019, a phone arrived at home. It wasn't mine — it was a family phone. But it opened a window to a world I had never seen before. It took until 2024 for me to get my personal phone and laptop. My journey into coding started with Sumit Sir, our computer teacher in Class 6. He introduced us to the magic behind websites. I typed Hello World and watched in awe as it appeared on the screen. That was my first step into coding. Around this time, I also discovered the joy of reading books beyond textbooks: Helen Keller's autobiography, Wings of Fire by APJ Abdul Kalam, and Long Walk to Freedom by Nelson Mandela. These books shaped my thinking and made me believe in possibility. During this time, one friend stood out — Sitanashu. He was the one who knew me before I knew myself. He didn't understand my love for code or books, but he didn't need to — he just stayed."
    },
    {
        id: 6,
        title: "Coding Journey Begins",
        content: "Although I had learned HTML from Sumit Sir in Class 6, I didn't start coding seriously until 2026. That was the year I stopped saying someday. I used AI to generate code at first. I copied, pasted, and felt like I was cheating — not the system, but myself. So I started breaking the code apart, understanding each line, and rewriting it myself. Slowly, I started writing my own code. I created my first real project — my personal portfolio — and hosted it on GitHub Pages. It wasn't perfect. It had bugs and broken layouts. But it was mine. When I shared it with a few friends and they said, Bhai, yeh tune banaya? — that moment changed something inside me."
    },
    {
        id: 7,
        title: "The Present",
        content: "In March 2026, I finally launched my portfolio. It wasn't perfect — I even forgot to add a close button on one of the modals. My mentor noticed it and pointed it out with a smile. I fixed it using the browser console, and that moment taught me how to debug and rely on tools rather than guesswork. When I asked my mentor what he thought, he smiled and said, It's a good start. Now make it better. That one line pushed me to keep going. In 2026, I started learning JavaScript — functions, arrays, objects, and DOM manipulation. My first project was a Chatbox — a simple messaging interface that stored conversations locally. It wasn't advanced, but it proved I could build interactive experiences. My goals for the future: DSA and Hackathon participation. I want to move beyond building websites — I want to solve real problems."
    },
    {
        id: 8,
        title: "Family — My Anchor",
        content: "My parents taught me honesty, hard work, and helping others. They were caring yet strict, and they never let me forget where I came from. They always pushed me to dream bigger. I have 2 elder sisters and 2 younger brothers. Each one has taught me patience and love. My sisters were my first teachers, my first friends, and my first protectors. My younger brothers taught me responsibility and how to be a role model. One of my fondest family memories is Diwali nights when the whole family is together — the lights, the laughter, the peace. That togetherness is unmatched."
    },
    {
        id: 9,
        title: "Friends & Relationships",
        content: "I didn't have a large circle of friends. I never did. But the ones I had — Ayush and Rishidev — they mattered. They were the ones who saw me at my quietest, my most awkward, and my most honest. We met in school, and from those early days, a bond formed. Today, we don't talk regularly. Life happened. Schools ended. Paths diverged. But the strange thing about real friendship is this: when we meet, even after months, even after years, it feels like nothing has changed. I've realized that some bonds don't need constant maintenance. They just exist — quietly, patiently, waiting."
    },
    {
        id: 10,
        title: "Biggest Struggle",
        content: "There was a time when I woke up every morning with one question echoing in my mind: What am I supposed to become? I didn't know what I wanted to do. I didn't know what I was good at. I saw people around me who seemed so sure of themselves — and I felt lost. I was quiet. And in a world that rewards loudness, silence often feels like a weakness. I didn't speak up. I didn't ask for help. But deep down, I wanted to be seen. I wanted to matter. The turning point came quietly. It wasn't a dramatic speech or a moment of clarity — it was a slow realization that not knowing is okay. That life doesn't always give you answers. Sometimes, it gives you questions. And I learned that growth comes from being okay with what you don't know — and continuing anyway."
    },
    {
        id: 11,
        title: "Biggest Happiness",
        content: "In 2024, I passed out of school. It wasn't a grand celebration. It wasn't a party. But it gave me more happiness than I expected. I walked out of those gates not with a crowd, not with friends waving goodbye, but with a quiet sense of achievement. I had done it. Not perfectly. Not loudly. But I had done it. I was alone that day. But I wasn't lonely. I was proud. I had completed something that once felt impossible. And that quiet pride stayed with me."
    },
    {
        id: 12,
        title: "Message & Motto",
        content: "The motto I live by is Somewhere Between I Want It & I Got It. Life is not a destination. It's the space between wanting and getting — between dreaming and becoming. That space is where growth happens. Where struggle lives. Where hope survives. If I could say one thing to anyone reading this: You don't need to know everything. You don't need to have everything figured out. You just need to keep moving. One step. One day. One chapter at a time."
    },
    {
        id: 13,
        title: "Friend Memory",
        content: "The last day of school was strange. Not sad, not happy — just strange. I remember walking through the corridors one last time, collecting everyone's signatures on my notebook. We made promises. We said we'd stay in touch. We said we'd meet again. But then the results came. And slowly, the messages stopped. The calls stopped. The promises faded. It wasn't anyone's fault. Life just moved on. I realized something that day: some promises are made to be broken. Not because people are dishonest, but because life gets in the way. And that's okay. I still remember that day. The sounds, the faces, the promise we all made. And even though we didn't keep it — I'm glad we made it."
    }
];

// ============================================================
// STATE
// ============================================================
let currentChapter = 0;
const totalChapters = chapters.length;
let currentUtterance = null;
let isPlaying = false;
let audioQueue = [];

// ============================================================
// DOM REFS
// ============================================================
const pageTitle = document.getElementById('chapterTitle');
const chapterNumGold = document.getElementById('chapterNumGold');
const chapterContent = document.getElementById('chapterContent');
const pageNumber = document.getElementById('pageNumber');
const progressDotsBook = document.getElementById('progressDotsBook');
const audioStatus = document.getElementById('audioStatus');
const audioProgressFill = document.getElementById('audioProgressFill');
const audioTimeDisplay = document.getElementById('audioTimeDisplay');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// ============================================================
// LOAD CHAPTER
// ============================================================
function loadChapter(index) {
    const chapter = chapters[index];
    if (!chapter) return;

    chapterNumGold.textContent = 'Chapter ' + chapter.id;
    pageTitle.textContent = chapter.title;
    chapterContent.textContent = chapter.content;
    pageNumber.textContent = 'Page ' + (index + 1) + ' of ' + totalChapters;

    // Update dots
    document.querySelectorAll('.dot-book').forEach(function(dot, i) {
        dot.classList.toggle('active', i === index);
    });

    // Update buttons
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === totalChapters - 1;

    // Reset audio
    audioProgressFill.style.width = '0%';
    audioTimeDisplay.textContent = '0:00 / 0:00';
    audioStatus.textContent = '⚪ Idle';
    if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i> Play';

    // Update sidebar active
    document.querySelectorAll('#chapterSidebarMenu a').forEach(function(link, i) {
        link.classList.toggle('active', i === index);
    });

    currentChapter = index;
}

// ============================================================
// NAVIGATION
// ============================================================
function nextChapter() {
    if (currentChapter < totalChapters - 1) {
        loadChapter(currentChapter + 1);
        const page = document.getElementById('bookPage');
        if (page) {
            page.style.animation = 'none';
            setTimeout(function() {
                page.style.animation = 'pageFlip 0.5s ease';
            }, 10);
        }
    }
}

function prevChapter() {
    if (currentChapter > 0) {
        loadChapter(currentChapter - 1);
        const page = document.getElementById('bookPage');
        if (page) {
            page.style.animation = 'none';
            setTimeout(function() {
                page.style.animation = 'pageFlip 0.5s ease reverse';
            }, 10);
        }
    }
}

function goToChapter(index) {
    if (index >= 0 && index < totalChapters) {
        loadChapter(index);
        closeSidebar();
    }
}

// ============================================================
// AUDIO FUNCTIONS
// ============================================================
function speakChapter(index, callback) {
    const chapter = chapters[index];
    if (!chapter) return;

    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }

    var utterance = new SpeechSynthesisUtterance(chapter.content);
    
    var voiceSelect = document.getElementById('voiceSelect');
    var selectedVoice = voiceSelect.value;
    var voices = window.speechSynthesis.getVoices();
    var voice = null;
    for (var i = 0; i < voices.length; i++) {
        if (voices[i].name === selectedVoice) {
            voice = voices[i];
            break;
        }
    }
    if (voice) utterance.voice = voice;

    var speedSelect = document.getElementById('speedSelect');
    utterance.rate = parseFloat(speedSelect.value);
    utterance.lang = 'en-US';
    utterance.pitch = 1;

    audioStatus.textContent = '🔊 Playing...';
    if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i> Playing';

    var totalDuration = utterance.text.length / (utterance.rate * 180);
    var elapsed = 0;

    utterance.onboundary = function(event) {
        if (event.name === 'sentence' || event.name === 'word') {
            elapsed = event.charIndex / (utterance.rate * 180);
            var percent = Math.min((elapsed / totalDuration) * 100, 100);
            audioProgressFill.style.width = percent + '%';
            
            var totalSec = Math.floor(totalDuration);
            var elapsedSec = Math.floor(elapsed);
            audioTimeDisplay.textContent = formatTime(elapsedSec) + ' / ' + formatTime(totalSec);
        }
    };

    utterance.onend = function() {
        audioStatus.textContent = '✅ Complete';
        if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i> Play';
        audioProgressFill.style.width = '100%';
        if (callback) callback();
    };

    utterance.onerror = function() {
        audioStatus.textContent = '❌ Error';
        if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i> Play';
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    isPlaying = true;
}

function playCurrentChapter() {
    if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        audioStatus.textContent = '🔊 Playing...';
        if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i> Playing';
        return;
    }
    speakChapter(currentChapter);
}

function pauseChapter() {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        audioStatus.textContent = '⏸️ Paused';
        if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
    }
}

function stopChapter() {
    if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
        window.speechSynthesis.cancel();
        audioStatus.textContent = '⏹️ Stopped';
        if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i> Play';
        audioProgressFill.style.width = '0%';
        audioTimeDisplay.textContent = '0:00 / 0:00';
        isPlaying = false;
    }
}

function playAllChapters() {
    var currentIndex = currentChapter;
    audioQueue = [];
    for (var i = currentIndex; i < totalChapters; i++) {
        audioQueue.push(i);
    }
    playNextInQueue();
}

function playNextInQueue() {
    if (audioQueue.length === 0) {
        audioStatus.textContent = '✅ All Chapters Complete!';
        return;
    }
    var idx = audioQueue.shift();
    loadChapter(idx);
    speakChapter(idx, function() {
        setTimeout(playNextInQueue, 500);
    });
}

function stopAllChapters() {
    stopChapter();
    audioQueue = [];
}

function formatTime(seconds) {
    var mins = Math.floor(seconds / 60);
    var secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

// ============================================================
// LOAD VOICES
// ============================================================
function loadVoices() {
    var voices = window.speechSynthesis.getVoices();
    var voiceSelect = document.getElementById('voiceSelect');
    if (!voiceSelect) return;
    
    voiceSelect.innerHTML = '<option value="">🗣️ Voice</option>';
    
    for (var i = 0; i < voices.length; i++) {
        var option = document.createElement('option');
        option.value = voices[i].name;
        option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
        voiceSelect.appendChild(option);
    }
}

if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
    setTimeout(loadVoices, 500);
}

// ============================================================
// CREATE DOTS
// ============================================================
function createDots() {
    if (!progressDotsBook) return;
    progressDotsBook.innerHTML = '';
    for (var i = 0; i < totalChapters; i++) {
        var dot = document.createElement('span');
        dot.className = 'dot-book' + (i === 0 ? ' active' : '');
        dot.dataset.index = i;
        dot.addEventListener('click', function() {
            goToChapter(parseInt(this.dataset.index));
        });
        progressDotsBook.appendChild(dot);
    }
}

// ============================================================
// SIDEBAR LOGIC
// ============================================================
var hamburgerBtn = document.getElementById('hamburgerBtn');
var sidebar = document.getElementById('sidebar');
var sidebarOverlay = document.getElementById('sidebarOverlay');
var sidebarClose = document.getElementById('sidebarClose');

function toggleSidebar() {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
}

function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleSidebar);
}
if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
}
if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
}

// Escape key close
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
        closeSidebar();
    }
});

// Close sidebar on menu item click
document.querySelectorAll('.sidebar-menu a').forEach(function(link) {
    link.addEventListener('click', function() {
        setTimeout(closeSidebar, 300);
    });
});

document.querySelectorAll('.sidebar-action-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        setTimeout(closeSidebar, 400);
    });
});

// Chapter sidebar navigation
document.querySelectorAll('#chapterSidebarMenu a').forEach(function(link, index) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        goToChapter(index);
    });
});

// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================
document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault();
        if (window.speechSynthesis.speaking) {
            pauseChapter();
        } else if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
        } else {
            playCurrentChapter();
        }
    }
    if (e.key === 'Escape') {
        stopChapter();
        closeSidebar();
    }
    if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextChapter();
    }
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevChapter();
    }
});

// ============================================================
// MODAL FUNCTIONS
// ============================================================
window.openModal = function() {
    var modal = document.getElementById('downloadModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closeModal = function() {
    var modal = document.getElementById('downloadModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

// Close modal on outside click
document.getElementById('downloadModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    createDots();
    loadChapter(0);
    console.log('✅ Book View Autobiography Loaded Successfully!');
    console.log('📖 13 Chapters loaded');
    console.log('🎧 Press SPACE to Play/Pause, ESC to Stop, ← → to navigate');
});

// ============================================================
// EXPOSE FUNCTIONS TO GLOBAL
// ============================================================
window.loadChapter = loadChapter;
window.nextChapter = nextChapter;
window.prevChapter = prevChapter;
window.goToChapter = goToChapter;
window.playCurrentChapter = playCurrentChapter;
window.pauseChapter = pauseChapter;
window.stopChapter = stopChapter;
window.playAllChapters = playAllChapters;
window.stopAllChapters = stopAllChapters;
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.openModal = openModal;
window.closeModal = closeModal;
window.speakChapter = speakChapter;
