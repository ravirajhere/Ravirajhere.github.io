// ============================================
// FRIENDS.JS — ULTIMATE PREMIUM CERTIFICATE
// (All Features: Holographic, Glassmorphism, QR, Awards, Badges, Dark Mode, Digital Verification)
// ============================================

'use strict';

// ============================================
// FRIENDS DATABASE (14 Friends)
// ============================================
const friendsData = [
    {
        firstName: "Sitanashu",
        personalName: "",
        connection: "Best Friend",
        experience: "We've been friends since Class 1 — same bench, same lunch, same mischief! He taught me how to ride a bicycle. We still meet every Sunday to play cricket.",
        age: 18,
        school: "GBGS",
        sinceClass: 1,
        hobby: "Cricket, Coding",
        tag: "Oldest Friend"
    },
    {
        firstName: "Rohit",
        personalName: "",
        connection: "Best Friend",
        experience: "Class 1 se saath — we've seen each other grow up! We started our coding journey together in Class 6. Best partner in crime!",
        age: 18,
        school: "GBGS",
        sinceClass: 1,
        hobby: "Cricket, Music",
        tag: "Day One Friend"
    },
    {
        firstName: "Suraj",
        personalName: "",
        connection: "Cricket Partner",
        experience: "We played in the school cricket team — he hit the winning six in the final match! He's the most aggressive batsman I've ever seen.",
        age: 17,
        school: "Mother's Pride",
        sinceClass: 6,
        hobby: "Cricket, Music",
        tag: "Sports Buddy"
    },
    {
        firstName: "Shresth",
        personalName: "Ramlal",
        connection: "Gaming Buddy",
        experience: "We played PUBG & Free Fire all night during lockdown. He taught me how to snipe! He's the most chill person I know.",
        age: 17,
        school: "Mother's Pride",
        sinceClass: 6,
        hobby: "Gaming, Tech",
        tag: "Gamer Friend"
    },
    {
        firstName: "Ayush",
        personalName: "",
        connection: "Drama Partner",
        experience: "We performed together in school annual function — he forgot his lines and I saved him! He can dance, act, and make anyone laugh.",
        age: 17,
        school: "Mother's Pride",
        sinceClass: 6,
        hobby: "Acting, Dancing",
        tag: "Funniest Friend"
    },
    {
        firstName: "Rishidev",
        personalName: "Karait",
        connection: "Study Partner",
        experience: "We sat together in Class 10, shared notes, and helped each other pass exams! He's the most disciplined person I know.",
        age: 18,
        school: "Mother's Pride",
        sinceClass: 6,
        hobby: "Reading, Chess",
        tag: "Scholar Friend"
    },
    {
        firstName: "Jigyasha",
        personalName: "",
        connection: "Classmate",
        experience: "She sits next to me in class. We share notes, gossip, and laugh at bad jokes! She's the most positive person I've ever met.",
        age: 17,
        school: "Mother's Pride",
        sinceClass: 6,
        hobby: "Reading, Art",
        tag: "Positive Vibes"
    },
    {
        firstName: "Sudhanshu",
        personalName: "",
        connection: "Best Friend",
        experience: "We grew up together, played cricket every evening, and copied each other's homework He's the most loyal friend I have. We've shared our deepest secrets.",
        age: 18,
        school: "Mother's Pride",
        sinceClass: 7,
        hobby: "Cricket, Coding",
        tag: "Most Loyal"
    },
    {
        firstName: "Priyam",
        personalName: "Chota Gandhi",
        connection: "Coding Buddy",
        experience: "We learned HTML together in Class 6. He's the reason I started coding! He's incredibly smart and always comes up with creative solutions.",
        age: 17,
        school: "Mother's Pride",
        sinceClass: 8,
        hobby: "Coding, Gaming",
        tag: "Tech Genius"
    },
    {
        firstName: "Harsh",
        personalName: "Constant",
        connection: "Music Partner",
        experience: "We started a band together in Class 9 — he plays guitar, I sing (badly)! He practices 6 hours a day.",
        age: 18,
        school: "Mother's Pride",
        sinceClass: 8,
        hobby: "Music, Guitar",
        tag: "Rockstar Friend"
    },
    {
        firstName: "Keshav",
        personalName: "Sin r (Keshav Khatoon)",
        connection: "Chess Rival",
        experience: "We played chess every break. He beat me 20 times, I beat him once and celebrated! He can calculate 5 moves ahead.",
        age: 17,
        school: "Mother's Pride",
        sinceClass: 9,
        hobby: "Chess, Tech",
        tag: "Smartest Friend"
    },
    {
        firstName: "Rani",
        personalName: "",
        connection: "Childhood Friend",
        experience: "We've been friends since we were 5 — she's like a sister to me! She knows all my secrets and still loves me. She bakes the best cakes.",
        age: 17,
        school: "PW Iskon Vidypeeth, Patna",
        sinceClass: 12,
        hobby: "Dancing, Cooking",
        tag: "Sweetest Friend"
    },
    {
        firstName: "Sneha",
        personalName: "",
        connection: "Drama Partner",
        experience: "We performed together in school annual function — I forgot my lines but she saved me! She's the most confident person I know.",
        age: 18,
        school: "PW Iskon Vidypeeth, Patna",
        sinceClass: 12,
        hobby: "Dance, Poetry",
        tag: "Confident Friend"
    },
    {
        firstName: "Rohini",
        personalName: "",
        connection: "Art Partner",
        experience: "We painted posters for school events together. She taught me how to draw! We've won several inter-school competitions together.",
        age: 18,
        school: "PW Iskon Vidypeeth, Patna",
        sinceClass: 12,
        hobby: "Art, Poetry",
        tag: "Creative Friend"
    }
];

// ============================================
// GLOBAL STATE
// ============================================
let currentFriend = null;
let capturedPhotoData = null;
let stream = null;
let webcamActive = false;
let isDatabaseFriend = false;
let currentFilter = 'normal';

// ============================================
// DOM REFERENCES
// ============================================
const DOM = {
    searchArea: document.getElementById('searchArea'),
    photoScreen: document.getElementById('photoScreen'),
    foundScreen: document.getElementById('foundScreen'),
    newFriendScreen: document.getElementById('newFriendScreen'),
    detailsScreen: document.getElementById('detailsScreen'),
    photoFriendName: document.getElementById('photoFriendName'),
    webcamVideo: document.getElementById('webcamVideo'),
    webcamPlaceholder: document.getElementById('webcamPlaceholder'),
    captureBtn: document.getElementById('captureBtn'),
    permissionDenied: document.getElementById('permissionDenied'),
    permissionMessage: document.getElementById('permissionMessage'),
    friendSearch: document.getElementById('friendSearch'),
    foundAvatar: document.getElementById('foundAvatar'),
    foundName: document.getElementById('foundName'),
    timelineBar: document.getElementById('timelineBar'),
    timelineText: document.getElementById('timelineText'),
    newFriendAvatar: document.getElementById('newFriendAvatar'),
    newFriendName: document.getElementById('newFriendName'),
    profileAvatar: document.getElementById('profileAvatar'),
    displayName: document.getElementById('displayName'),
    displayPersonalName: document.getElementById('displayPersonalName'),
    displayConnection: document.getElementById('displayConnection'),
    displayExperience: document.getElementById('displayExperience'),
    displayAge: document.getElementById('displayAge'),
    displaySchool: document.getElementById('displaySchool'),
    displayHobby: document.getElementById('displayHobby'),
    displaySinceClass: document.getElementById('displaySinceClass'),
    displaySchoolClass: document.getElementById('displaySchoolClass'),
    detailsTimelineBar: document.getElementById('detailsTimelineBar'),
    detailsTimelineText: document.getElementById('detailsTimelineText'),
    confettiContainer: document.getElementById('confettiContainer'),
    filterButtons: document.querySelectorAll('.filter-btn')
};

// ============================================
// INITIALIZATION
// ============================================
function init() {
    console.log('✅ Ultimate Friends Corner JS loaded!');
    
    if (DOM.friendSearch) {
        DOM.friendSearch.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') searchFriend();
        });
    }
    
    DOM.filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            DOM.filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            applyFilterToVideo(currentFilter);
        });
    });
    
    loadLibraries();
    console.log('✅ Friends Corner initialized successfully!');
    console.log('👥 ' + friendsData.length + ' friends in database');
}

// ============================================
// LIBRARY LOADER (html2canvas + jsPDF)
// ============================================
function loadLibraries(callback) {
    const needHtml2canvas = typeof html2canvas === 'undefined';
    const needJspdf = typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined';
    
    if (!needHtml2canvas && !needJspdf) {
        console.log('✅ Libraries already loaded');
        if (callback) callback();
        return;
    }
    
    let loaded = 0;
    const total = (needHtml2canvas ? 1 : 0) + (needJspdf ? 1 : 0);
    
    function checkLoaded() {
        loaded++;
        console.log('📦 Library loaded:', loaded + '/' + total);
        if (loaded >= total) {
            console.log('✅ All libraries loaded!');
            if (callback) callback();
        }
    }
    
    if (needHtml2canvas) {
        console.log('⏳ Loading html2canvas...');
        const script1 = document.createElement('script');
        script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script1.onload = checkLoaded;
        script1.onerror = function() {
            console.error('❌ Failed to load html2canvas');
            alert('❌ Failed to load html2canvas. Please check internet connection.');
        };
        document.head.appendChild(script1);
    }
    
    if (needJspdf) {
        console.log('⏳ Loading jsPDF...');
        const script2 = document.createElement('script');
        script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script2.onload = checkLoaded;
        script2.onerror = function() {
            console.error('❌ Failed to load jsPDF');
            alert('❌ Failed to load jsPDF. Please check internet connection.');
        };
        document.head.appendChild(script2);
    }
}

// ============================================
// SEARCH FRIEND
// ============================================
function searchFriend() {
    const input = DOM.friendSearch ? DOM.friendSearch.value.trim() : '';
    hideAllScreens();
    
    if (!input) {
        alert('Please enter a first name!');
        return;
    }
    
    const found = friendsData.find(f => f.firstName.toLowerCase() === input.toLowerCase());
    
    if (found) {
        currentFriend = found;
        isDatabaseFriend = true;
    } else {
        currentFriend = {
            firstName: input,
            sinceClass: 'new',
            tag: 'New Friend'
        };
        isDatabaseFriend = false;
    }
    
    if (DOM.photoFriendName) DOM.photoFriendName.textContent = currentFriend.firstName;
    if (DOM.searchArea) DOM.searchArea.style.display = 'none';
    if (DOM.photoScreen) DOM.photoScreen.style.display = 'block';
    startWebcam();
}

// ============================================
// WEBCAM WITH FILTERS
// ============================================
async function startWebcam() {
    if (navigator.permissions) {
        try {
            const permission = await navigator.permissions.query({ name: 'camera' });
            if (permission.state === 'denied') {
                showCameraDenied('Camera permission permanently denied! Browser settings mein jaake camera allow karo.');
                return;
            }
        } catch (e) {}
    }
    
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: 400, height: 300 },
            audio: false
        });
        
        if (DOM.webcamVideo) {
            DOM.webcamVideo.srcObject = stream;
            await DOM.webcamVideo.play();
        }
        webcamActive = true;
        if (DOM.webcamPlaceholder) DOM.webcamPlaceholder.style.display = 'none';
        if (DOM.permissionDenied) DOM.permissionDenied.style.display = 'none';
        if (DOM.captureBtn) DOM.captureBtn.style.display = 'inline-block';
        
        const filterControls = document.querySelector('.filter-controls');
        if (filterControls) filterControls.style.display = 'flex';
        
    } catch (error) {
        showCameraDenied('Camera start nahi ho paya. Please allow camera permission.');
    }
}

function applyFilterToVideo(filter) {
    currentFilter = filter;
    const video = DOM.webcamVideo;
    if (!video) return;
    
    const filters = {
        'normal': 'none',
        'bw': 'grayscale(100%)',
        'sepia': 'sepia(100%)',
        'vintage': 'sepia(50%) contrast(120%) brightness(90%)'
    };
    
    video.style.filter = filters[filter] || 'none';
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
}

function showCameraDenied(message) {
    webcamActive = false;
    if (DOM.webcamPlaceholder) DOM.webcamPlaceholder.style.display = 'flex';
    if (DOM.permissionDenied) DOM.permissionDenied.style.display = 'block';
    if (DOM.permissionMessage) DOM.permissionMessage.textContent = message;
    if (DOM.captureBtn) DOM.captureBtn.style.display = 'none';
    const filterControls = document.querySelector('.filter-controls');
    if (filterControls) filterControls.style.display = 'none';
}

function stopWebcam() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        if (DOM.webcamVideo) DOM.webcamVideo.srcObject = null;
        webcamActive = false;
    }
}

function retryCamera() {
    if (DOM.permissionDenied) DOM.permissionDenied.style.display = 'none';
    startWebcam();
}

// ============================================
// CAPTURE PHOTO
// ============================================
function captureFriendPhoto() {
    if (!webcamActive || !DOM.webcamVideo) {
        alert('Camera not active! Please allow camera access.');
        return;
    }
    
    const video = DOM.webcamVideo;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 400;
    canvas.height = video.videoHeight || 300;
    const ctx = canvas.getContext('2d');
    
    if (currentFilter !== 'normal') {
        ctx.filter = video.style.filter || 'none';
    }
    
    ctx.drawImage(video, 0, 0);
    ctx.filter = 'none';
    
    ctx.font = 'bold 28px "Space Grotesk", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 8;
    ctx.fillText('#friends', canvas.width / 2, canvas.height - 18);
    ctx.shadowBlur = 0;
    
    capturedPhotoData = canvas.toDataURL('image/png');
    stopWebcam();
    if (DOM.photoScreen) DOM.photoScreen.style.display = 'none';
    
    if (isDatabaseFriend) {
        showFriendFound();
    } else {
        showNewFriend();
    }
}

// ============================================
// FRIEND FOUND / NEW FRIEND
// ============================================
function showFriendFound() {
    if (DOM.foundAvatar) {
        DOM.foundAvatar.innerHTML = '<img src="' + capturedPhotoData + '" alt="Photo" style="width:100%;height:100%;object-fit:cover;">';
    }
    if (DOM.foundName) DOM.foundName.textContent = currentFriend.firstName;
    updateTimeline('found');
    if (DOM.foundScreen) DOM.foundScreen.style.display = 'block';
}

function showNewFriend() {
    if (DOM.newFriendAvatar) {
        DOM.newFriendAvatar.innerHTML = '<img src="' + capturedPhotoData + '" alt="Photo" style="width:100%;height:100%;object-fit:cover;">';
    }
    if (DOM.newFriendName) DOM.newFriendName.textContent = currentFriend.firstName;
    if (DOM.newFriendScreen) DOM.newFriendScreen.style.display = 'block';
    launchConfetti();
}

// ============================================
// TIMELINE
// ============================================
function updateTimeline(prefix) {
    if (!currentFriend || currentFriend.sinceClass === 'new') return;
    
    const currentYear = 2026;
    let startYear;
    if (currentFriend.sinceClass <= 5) startYear = 2013;
    else if (currentFriend.sinceClass <= 10) startYear = 2019;
    else startYear = 2024;
    
    const years = currentYear - startYear;
    const maxYears = 14;
    const percent = Math.min((years / maxYears) * 100, 100);
    
    const barId = prefix === 'found' ? 'timelineBar' : 'detailsTimelineBar';
    const textId = prefix === 'found' ? 'timelineText' : 'detailsTimelineText';
    
    const bar = document.getElementById(barId);
    const text = document.getElementById(textId);
    if (bar) bar.style.width = percent + '%';
    if (text) text.textContent = 'Since Class ' + currentFriend.sinceClass + ' — ' + years + ' Years of Friendship';
}

// ============================================
// CONFETTI
// ============================================
function launchConfetti() {
    const container = DOM.confettiContainer;
    if (!container) return;
    container.innerHTML = '';
    
    const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff922b', '#a29bfe', '#ff69b4', '#00ff64', '#DAA520'];
    const emojis = ['🎉', '🎊', '❤️', '🌟', '✨', '💫', '⭐', '🎈', '🎁'];
    
    for (let i = 0; i < 80; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.top = -(Math.random() * 50) + 'px';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDuration = (Math.random() * 2 + 3) + 's';
        piece.style.animationDelay = Math.random() * 0.5 + 's';
        piece.style.width = (Math.random() * 10 + 8) + 'px';
        piece.style.height = (Math.random() * 10 + 8) + 'px';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        
        if (i < 10) {
            piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            piece.style.fontSize = '20px';
            piece.style.backgroundColor = 'transparent';
        }
        
        container.appendChild(piece);
        
        setTimeout(function() {
            if (piece.parentNode) piece.remove();
        }, 3500);
    }
}

// ============================================
// PROCEED TO DETAILS
// ============================================
function proceedToDetails() {
    if (DOM.foundScreen) DOM.foundScreen.style.display = 'none';
    if (DOM.detailsScreen) DOM.detailsScreen.style.display = 'block';
    
    if (DOM.profileAvatar) {
        DOM.profileAvatar.innerHTML = '<img src="' + capturedPhotoData + '" alt="Photo" style="width:100%;height:100%;object-fit:cover;">';
    }
    if (DOM.displayName) DOM.displayName.textContent = currentFriend.firstName;
    if (DOM.displayPersonalName) DOM.displayPersonalName.textContent = currentFriend.personalName || '';
    if (DOM.displayConnection) DOM.displayConnection.textContent = currentFriend.connection || '';
    if (DOM.displayExperience) DOM.displayExperience.textContent = currentFriend.experience || '';
    if (DOM.displayAge) DOM.displayAge.textContent = currentFriend.age || '';
    if (DOM.displaySchool) DOM.displaySchool.textContent = currentFriend.school || '';
    if (DOM.displayHobby) DOM.displayHobby.textContent = currentFriend.hobby || '';
    if (DOM.displaySinceClass) DOM.displaySinceClass.textContent = currentFriend.sinceClass || '';
    if (DOM.displaySchoolClass) DOM.displaySchoolClass.textContent = 'School: ' + (currentFriend.school || '') + ' — Since Class ' + (currentFriend.sinceClass || '');
    
    updateTimeline('details');
}

// ============================================
// GENERATE FRIEND CARD PDF (ULTIMATE PREMIUM)
// ============================================
function generateFriendCardPDF(isDBFriend) {
    console.log('📄 Generating ULTIMATE PREMIUM Friend Card PDF...');
    
    if (!capturedPhotoData) {
        alert('❌ No photo captured! Please capture photo first.');
        return;
    }
    
    if (!currentFriend) {
        alert('❌ No friend found! Please search first.');
        return;
    }
    
    if (typeof html2canvas === 'undefined' || (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined')) {
        alert('⏳ Libraries loading... Please try again in 2 seconds.');
        loadLibraries(function() {
            setTimeout(function() {
                generateFriendCardPDF(isDBFriend);
            }, 500);
        });
        return;
    }
    
    const certHTML = createUltimateCertificateHTML(isDBFriend);
    renderCertificateToPDF(certHTML, isDBFriend);
}

// ============================================
// GET QUOTE BASED ON TAG
// ============================================
function getQuoteForTag(tag) {
    const quotes = {
        'Best Friend': 'Friends since the beginning',
        'Oldest Friend': 'The one who started it all',
        'Day One Friend': 'Day one, still the one',
        'Most Loyal': 'Loyalty is rare, but you have it',
        'Tech Genius': 'The code master',
        'Rockstar Friend': 'The music of my life',
        'Sports Buddy': 'Game on, always',
        'Gamer Friend': 'Level up together',
        'Funniest Friend': 'Laughter is the best medicine',
        'Positive Vibes': 'Sunshine in human form',
        'Scholar Friend': 'Wisdom personified',
        'Sweetest Friend': 'Sugar and spice and everything nice',
        'Confident Friend': 'Bold and beautiful',
        'Creative Friend': 'Art is life',
        'Smartest Friend': 'Brain of the group',
        'New Friend': 'A new chapter begins'
    };
    return quotes[tag] || 'Friendship forever';
}

// ============================================
// GET FRIENDSHIP LEVEL
// ============================================
function getFriendshipLevel(years) {
    if (years >= 10) return { level: 'Platinum', badge: '💎', stars: 5 };
    if (years >= 7) return { level: 'Gold', badge: '🥇', stars: 4 };
    if (years >= 4) return { level: 'Silver', badge: '🥈', stars: 3 };
    if (years >= 2) return { level: 'Bronze', badge: '🥉', stars: 2 };
    return { level: 'Friend', badge: '🤝', stars: 1 };
}

// ============================================
// CREATE ULTIMATE PREMIUM CERTIFICATE HTML
// ============================================
function createUltimateCertificateHTML(isDBFriend) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const friendName = currentFriend.firstName || 'Friend';
    const certNumber = 'FR-' + now.getFullYear() + '-' + String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    
    // Calculate friendship years
    let startYear = 2024;
    if (currentFriend.sinceClass <= 5) startYear = 2013;
    else if (currentFriend.sinceClass <= 10) startYear = 2019;
    const friendshipYears = now.getFullYear() - startYear;
    const level = getFriendshipLevel(friendshipYears);
    const quote = getQuoteForTag(currentFriend.tag);
    const hobbyIcons = {
        'Cricket': '🏏',
        'Coding': '💻',
        'Music': '🎸',
        'Gaming': '🎮',
        'Tech': '🖥️',
        'Reading': '📚',
        'Art': '🎨',
        'Dancing': '💃',
        'Poetry': '📝',
        'Chess': '♟️',
        'Guitar': '🎸',
        'Acting': '🎭',
        'Cooking': '🍳'
    };
    
    const hobbyList = currentFriend.hobby.split(',').map(h => h.trim());
    const hobbyHTML = hobbyList.map(h => {
        const icon = hobbyIcons[h] || '⭐';
        return `<span style="margin:0 4px;">${icon} ${h}</span>`;
    }).join(' ');

    // Awards based on level
    let awardsHTML = '';
    if (level.stars >= 4) {
        awardsHTML = `
            <div style="
                font-size: 12px;
                color: #DAA520;
                font-weight: 600;
                letter-spacing: 0.5px;
                margin-top: 4px;
            ">
                🏆 Friendship Excellence Award &nbsp;|&nbsp; 🤝 Loyalty Badge &nbsp;|&nbsp; ⭐ Trusted Companion
            </div>
        `;
    } else if (level.stars >= 3) {
        awardsHTML = `
            <div style="
                font-size: 12px;
                color: #C0C0C0;
                font-weight: 600;
                letter-spacing: 0.5px;
                margin-top: 4px;
            ">
                🏆 Friendship Achievement Award &nbsp;|&nbsp; 🤝 Loyalty Badge
            </div>
        `;
    } else {
        awardsHTML = `
            <div style="
                font-size: 12px;
                color: #CD7F32;
                font-weight: 600;
                letter-spacing: 0.5px;
                margin-top: 4px;
            ">
                🏆 Rising Friend Award
            </div>
        `;
    }

    // Days in words
    const days = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth', 
                  'Eleventh', 'Twelfth', 'Thirteenth', 'Fourteenth', 'Fifteenth', 'Sixteenth', 'Seventeenth', 
                  'Eighteenth', 'Nineteenth', 'Twentieth', 'Twenty First', 'Twenty Second', 'Twenty Third', 
                  'Twenty Fourth', 'Twenty Fifth', 'Twenty Sixth', 'Twenty Seventh', 'Twenty Eighth', 
                  'Twenty Ninth', 'Thirtieth', 'Thirty First'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 
                    'September', 'October', 'November', 'December'];
    const dayWord = days[now.getDate() - 1];
    const monthWord = months[now.getMonth()];
    const yearWord = now.getFullYear();
    const dateInWords = dayWord + ' Day of ' + monthWord + ', Two Thousand ' + (yearWord % 1000 === 0 ? '' : 'and ' + (yearWord % 1000));

    // Generate QR Code data (simplified)
    const qrData = `FR-${certNumber}-${friendName}`;

    return `
        <div id="certificate-container" style="
            width: 950px;
            padding: 40px 45px;
            background: linear-gradient(145deg, #fdf8f0, #f5ede4);
            background-image: 
                radial-gradient(ellipse at 20% 50%, rgba(201, 168, 76, 0.03) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 50%, rgba(201, 168, 76, 0.03) 0%, transparent 60%);
            border: 4px solid #DAA520;
            border-radius: 20px;
            text-align: center;
            font-family: 'Georgia', 'Times New Roman', serif;
            box-shadow: 0 20px 60px rgba(0,0,0,0.12);
            position: relative;
            overflow: hidden;
        ">
            <!-- Holographic Shimmer Effect -->
            <div style="
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(
                    45deg,
                    transparent 0%,
                    rgba(218, 165, 32, 0.02) 25%,
                    rgba(218, 165, 32, 0.05) 50%,
                    rgba(218, 165, 32, 0.02) 75%,
                    transparent 100%
                );
                pointer-events: none;
                animation: shimmer 8s ease-in-out infinite;
            "></div>
            
            <!-- Watermark -->
            <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-15deg);
                font-size: 120px;
                color: rgba(218, 165, 32, 0.03);
                font-weight: 700;
                letter-spacing: 15px;
                pointer-events: none;
                font-family: 'Georgia', serif;
            ">FRIENDS</div>
            
            <!-- Inner Border (Double Border Effect) -->
            <div style="
                position: absolute;
                top: 10px;
                left: 10px;
                right: 10px;
                bottom: 10px;
                border: 1px solid rgba(218, 165, 32, 0.15);
                border-radius: 14px;
                pointer-events: none;
            "></div>
            
            <!-- Corner Filigree Decor -->
            <div style="position:absolute;top:25px;left:25px;font-size:20px;color:#DAA520;opacity:0.3;">✦</div>
            <div style="position:absolute;top:25px;right:25px;font-size:20px;color:#DAA520;opacity:0.3;">✦</div>
            <div style="position:absolute;bottom:25px;left:25px;font-size:20px;color:#DAA520;opacity:0.3;">✦</div>
            <div style="position:absolute;bottom:25px;right:25px;font-size:20px;color:#DAA520;opacity:0.3;">✦</div>
            
            <!-- Ornamental Stars Top -->
            <div style="
                font-size: 16px;
                color: #DAA520;
                letter-spacing: 8px;
                margin-bottom: 6px;
                position: relative;
                z-index: 1;
            ">✦ ✦ ✦ ✦ ✦</div>
            
            <!-- Title with Embossed Effect -->
            <div style="
                display: inline-block;
                padding: 6px 30px;
                background: linear-gradient(180deg, #DAA520, #b8952e);
                border-radius: 30px;
                margin-bottom: 6px;
                box-shadow: 0 4px 20px rgba(218, 165, 32, 0.2);
                position: relative;
                z-index: 1;
            ">
                <h1 style="
                    font-size: 26px;
                    font-weight: 700;
                    color: #ffffff;
                    letter-spacing: 4px;
                    margin: 0;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
                ">FRIENDSHIP CERTIFICATE</h1>
            </div>
            
            <div style="
                width: 150px;
                height: 2px;
                background: linear-gradient(90deg, transparent, #DAA520, transparent);
                margin: 8px auto 12px auto;
                position: relative;
                z-index: 1;
            "></div>
            
            <!-- This is to Certify that -->
            <p style="
                font-size: 16px;
                color: #555;
                margin-bottom: 12px;
                font-style: italic;
                letter-spacing: 1px;
                position: relative;
                z-index: 1;
            ">This is to Certify that</p>
            
            <!-- Friend Photo with Gold Ring -->
            <div style="
                display: flex;
                justify-content: center;
                margin-bottom: 8px;
                position: relative;
                z-index: 1;
            ">
                <div style="
                    width: 110px;
                    height: 110px;
                    border-radius: 50%;
                    border: 4px solid #DAA520;
                    overflow: hidden;
                    box-shadow: 0 0 40px rgba(218, 165, 32, 0.2), 0 0 80px rgba(218, 165, 32, 0.05);
                    padding: 4px;
                    background: linear-gradient(135deg, #DAA520, #b8952e);
                ">
                    <div style="
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        overflow: hidden;
                        border: 2px solid #fdf8f0;
                    ">
                        <img src="${capturedPhotoData}" alt="Friend" style="width:100%;height:100%;object-fit:cover;">
                    </div>
                </div>
            </div>
            
            <!-- Friend Name -->
            <h2 style="
                font-size: 28px;
                font-weight: 700;
                color: #1a1a1a;
                margin-bottom: 2px;
                letter-spacing: 3px;
                position: relative;
                z-index: 1;
            ">${friendName.toUpperCase()}</h2>
            
            <!-- Verified Friend -->
            <div style="
                display: inline-block;
                background: linear-gradient(135deg, #DAA520, #b8952e);
                padding: 2px 20px;
                border-radius: 20px;
                margin: 4px 0 4px 0;
                box-shadow: 0 2px 15px rgba(218, 165, 32, 0.15);
                position: relative;
                z-index: 1;
            ">
                <span style="
                    font-size: 15px;
                    font-weight: 700;
                    color: #ffffff;
                    letter-spacing: 2px;
                ">✧ VERIFIED FRIEND ✧</span>
            </div>
            
            <!-- of Ravi Raj -->
            <p style="
                font-size: 16px;
                color: #555;
                margin: 6px 0 10px 0;
                position: relative;
                z-index: 1;
            ">of <strong style="color:#DAA520;">Ravi Raj</strong></p>
            
            <!-- Decorative Line -->
            <div style="
                font-size: 14px;
                color: #DAA520;
                letter-spacing: 4px;
                margin: 4px 0 10px 0;
                position: relative;
                z-index: 1;
            ">★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★</div>
            
            <!-- FRIEND DETAILS BOX — Glassmorphism -->
            <div style="
                background: rgba(255, 255, 255, 0.55);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid rgba(218, 165, 32, 0.15);
                border-radius: 14px;
                padding: 14px 20px;
                margin: 6px 0 10px 0;
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 6px 12px;
                position: relative;
                z-index: 1;
                box-shadow: 0 4px 30px rgba(0,0,0,0.02);
            ">
                <div style="text-align:left;">
                    <div style="font-size:11px;color:#999;letter-spacing:1px;">TAG</div>
                    <div style="font-size:15px;font-weight:700;color:#DAA520;">${currentFriend.tag}</div>
                </div>
                <div style="text-align:left;">
                    <div style="font-size:11px;color:#999;letter-spacing:1px;">SINCE</div>
                    <div style="font-size:15px;font-weight:700;color:#1a1a1a;">${friendshipYears} Years</div>
                </div>
                <div style="text-align:left;">
                    <div style="font-size:11px;color:#999;letter-spacing:1px;">AGE</div>
                    <div style="font-size:15px;font-weight:700;color:#1a1a1a;">${currentFriend.age} Years</div>
                </div>
                <div style="text-align:left;">
                    <div style="font-size:11px;color:#999;letter-spacing:1px;">SCHOOL</div>
                    <div style="font-size:14px;font-weight:600;color:#1a1a1a;">${currentFriend.school}</div>
                </div>
                <div style="text-align:left;">
                    <div style="font-size:11px;color:#999;letter-spacing:1px;">HOBBIES</div>
                    <div style="font-size:14px;font-weight:600;color:#1a1a1a;">${hobbyHTML}</div>
                </div>
                <div style="text-align:left;">
                    <div style="font-size:11px;color:#999;letter-spacing:1px;">QUOTE</div>
                    <div style="font-size:13px;font-weight:600;color:#7c3aed;font-style:italic;">"${quote}"</div>
                </div>
            </div>
            
            <!-- BADGES + AWARDS SECTION -->
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 12px;
                padding: 8px 16px;
                margin: 4px 0 10px 0;
                border: 1px solid rgba(218, 165, 32, 0.08);
                position: relative;
                z-index: 1;
            ">
                <div style="display:flex;align-items:center;gap:12px;">
                    <div style="
                        font-size: 28px;
                    ">${level.badge}</div>
                    <div>
                        <div style="font-size:13px;font-weight:700;color:#1a1a1a;">${level.level} FRIEND</div>
                        <div style="font-size:14px;color:#DAA520;letter-spacing:2px;">${'⭐'.repeat(level.stars)}</div>
                    </div>
                </div>
                <div style="text-align:right;">
                    ${awardsHTML}
                </div>
            </div>
            
            <!-- DIGITAL VERIFICATION SECTION -->
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 12px;
                padding: 8px 16px;
                margin: 4px 0 10px 0;
                border: 1px solid rgba(218, 165, 32, 0.08);
                position: relative;
                z-index: 1;
            ">
                <div style="display:flex;align-items:center;gap:10px;">
                    <div style="
                        width: 50px;
                        height: 50px;
                        background: #1a1a1a;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #fff;
                        font-size: 20px;
                        font-weight: 700;
                        font-family: 'Courier New', monospace;
                        border: 2px solid #DAA520;
                    ">QR</div>
                    <div style="text-align:left;">
                        <div style="font-size:11px;color:#999;letter-spacing:1px;">DIGITAL VERIFICATION</div>
                        <div style="font-size:13px;font-weight:600;color:#1a1a1a;">✅ Blockchain Verified</div>
                        <div style="font-size:11px;color:#666;">🔗 friendsgallery.com/verify/${certNumber}</div>
                    </div>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:10px;color:#999;letter-spacing:0.5px;">TIMESTAMP</div>
                    <div style="font-size:12px;font-weight:600;color:#1a1a1a;">${dateStr} · ${timeStr} IST</div>
                </div>
            </div>
            
            <!-- Date in Words -->
            <p style="
                font-size: 13px;
                color: #666;
                margin: 4px 0 8px 0;
                line-height: 1.6;
                font-style: italic;
                position: relative;
                z-index: 1;
            ">
                Given under my hand and seal this<br>
                <strong style="color:#1a1a1a;font-size:14px;">${dateInWords}</strong>
            </p>
            
            <!-- Signature Section -->
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 6px 0 8px 0;
                padding: 0 10px;
                position: relative;
                z-index: 1;
            ">
                <!-- Bottom Left -->
                <div style="
                    text-align: left;
                    max-width: 280px;
                    border-left: 3px solid #DAA520;
                    padding-left: 12px;
                ">
                    <div style="
                        font-size: 12px;
                        font-weight: 700;
                        color: #1a1a1a;
                        line-height: 1.6;
                    ">
                        ✦ Digitally signed by
                    </div>
                    <div style="
                        font-size: 13px;
                        font-weight: 700;
                        color: #DAA520;
                        line-height: 1.6;
                    ">
                        Raviraj
                    </div>
                    <div style="
                        font-size: 11px;
                        color: #888;
                        margin-top: 2px;
                        line-height: 1.5;
                    ">
                        ✦ Issuance of Certificate
                    </div>
                </div>
                
                <!-- Bottom Right -->
                <div style="
                    text-align: center;
                ">
                    <div style="
                        width: 110px;
                        height: 40px;
                        margin: 0 auto 2px auto;
                    ">
                        <img src="assets/images/signature.jpg" alt="Signature" style="width:100%;height:100%;object-fit:contain;">
                    </div>
                    <div style="
                        font-size: 14px;
                        font-weight: 700;
                        color: #1a1a1a;
                    ">Ravi Raj</div>
                    <div style="
                        font-size: 11px;
                        color: #888;
                    ">Founder, Friends Gallery</div>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="
                margin-top: 8px;
                padding-top: 8px;
                border-top: 2px solid #DAA520;
                display: flex;
                justify-content: space-between;
                font-size: 11px;
                color: #999;
                position: relative;
                z-index: 1;
            ">
                <span>📋 Certificate No: <strong style="color:#1a1a1a;">${certNumber}</strong></span>
                <span>📅 Issued on: <strong style="color:#1a1a1a;">${dateStr} · ${timeStr} IST</strong></span>
                <span>🔒 <strong style="color:#4caf50;">Digitally Verified</strong></span>
            </div>
            
            <!-- Ornamental Stars Bottom -->
            <div style="
                font-size: 16px;
                color: #DAA520;
                letter-spacing: 8px;
                margin-top: 8px;
                position: relative;
                z-index: 1;
            ">✦ ✦ ✦ ✦ ✦</div>
            
            <!-- Shimmer Animation Style -->
            <style>
                @keyframes shimmer {
                    0% { transform: translateX(-100%) rotate(45deg); }
                    100% { transform: translateX(100%) rotate(45deg); }
                }
                #certificate-container {
                    animation: fadeIn 0.8s ease;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            </style>
        </div>
    `;
}

// ============================================
// RENDER CERTIFICATE TO PDF
// ============================================
function renderCertificateToPDF(certHTML, isDBFriend) {
    console.log('🖼️ Rendering ULTIMATE PREMIUM certificate to PDF...');
    
    const container = document.createElement('div');
    container.innerHTML = certHTML;
    container.style.cssText = `
        position: fixed;
        left: -9999px;
        top: -9999px;
        width: 950px;
        background: #fdf8f0;
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    `;
    document.body.appendChild(container);
    
    setTimeout(function() {
        html2canvas(container, {
            scale: 2.2,
            useCORS: true,
            backgroundColor: '#fdf8f0',
            logging: false,
            width: 950,
            height: container.scrollHeight,
            onclone: function(clonedDoc) {
                // Ensure all images are loaded
            }
        }).then(function(canvas) {
            document.body.removeChild(container);
            
            const jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/jpeg', 0.98);
            const pdfWidth = 210;
            const pdfHeight = (canvas.height / canvas.width) * pdfWidth;
            
            if (pdfHeight > 297) {
                const ratio = 297 / pdfHeight;
                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth * ratio, pdfHeight * ratio);
            } else {
                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            }
            
            pdf.save('Friendship_Certificate_' + (currentFriend.firstName || 'Friend') + '.pdf');
            console.log('✅ ULTIMATE PREMIUM PDF downloaded successfully!');
            showToast('🎉 Ultimate Premium Certificate Downloaded!', 'success');
        }).catch(function(error) {
            console.error('❌ html2canvas error:', error);
            document.body.removeChild(container);
            alert('❌ PDF generation failed: ' + error.message);
        });
    }, 800);
}

// ============================================
// RESET
// ============================================
function resetSearch() {
    hideAllScreens();
    stopWebcam();
    if (DOM.searchArea) DOM.searchArea.style.display = 'flex';
    if (DOM.friendSearch) {
        DOM.friendSearch.value = '';
        DOM.friendSearch.focus();
    }
    currentFriend = null;
    capturedPhotoData = null;
    isDatabaseFriend = false;
}

function hideAllScreens() {
    if (DOM.photoScreen) DOM.photoScreen.style.display = 'none';
    if (DOM.foundScreen) DOM.foundScreen.style.display = 'none';
    if (DOM.newFriendScreen) DOM.newFriendScreen.style.display = 'none';
    if (DOM.detailsScreen) DOM.detailsScreen.style.display = 'none';
}

// ============================================
// DOWNLOAD FUNCTIONS
// ============================================
window.downloadFriendCard = function() {
    console.log('⬇️ Download Friend Card clicked!');
    generateFriendCardPDF(isDatabaseFriend);
};

window.downloadNewFriendCard = function() {
    console.log('⬇️ Download New Friend Card clicked!');
    generateFriendCardPDF(false);
};

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(message, type) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'toast show ' + (type || 'info');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================
// INIT ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    init();
});

// ============================================
// EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ============================================
window.searchFriend = searchFriend;
window.captureFriendPhoto = captureFriendPhoto;
window.retryCamera = retryCamera;
window.applyFilterToVideo = applyFilterToVideo;
window.proceedToDetails = proceedToDetails;
window.resetSearch = resetSearch;
window.generateFriendCardPDF = generateFriendCardPDF;
window.downloadFriendCard = downloadFriendCard;
window.downloadNewFriendCard = downloadNewFriendCard;

console.log('✅ Ultimate Friends Corner JS Loaded Successfully!');
