// ============================================
// FRIENDS.JS — PREMIUM EDITION (CLEAN)
// (No Voice, No Live Stats, No QR Code)
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
let searchHistory = [];

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
    shareButtons: document.getElementById('shareButtons'),
    filterButtons: document.querySelectorAll('.filter-btn')
};

// ============================================
// INITIALIZATION
// ============================================
function init() {
    console.log('Friends Corner JS loaded!');
    
    if (DOM.friendSearch) {
        DOM.friendSearch.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') searchFriend();
        });
    }
    
    // Filter buttons
    DOM.filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            DOM.filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            applyFilterToVideo(currentFilter);
        });
    });
    
    loadJSPDF();
    console.log('Friends Corner initialized successfully!');
    console.log(friendsData.length + ' friends in database');
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
    
    if (DOM.shareButtons) DOM.shareButtons.style.display = 'flex';
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
// SHARE FRIEND CARD
// ============================================
function shareFriendCard(platform) {
    if (!capturedPhotoData) {
        alert('No photo captured! Please capture photo first.');
        return;
    }
    
    const name = currentFriend ? currentFriend.firstName : 'Friend';
    const text = `🎉 Just found my friend ${name} on Friends Corner! 🎉\nCheck out Ravi Raj's Friends Corner: https://ravirajhere.github.io/friends.html`;
    
    const urls = {
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
        instagram: `instagram://share?text=${encodeURIComponent(text)}`,
        email: `mailto:?subject=My Friend ${name}&body=${encodeURIComponent(text)}`
    };
    
    if (platform === 'download') {
        generateFriendCardPDF(isDatabaseFriend);
        return;
    }
    
    if (urls[platform]) {
        window.open(urls[platform], '_blank');
    }
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
// FRIEND CARD PDF — PREMIUM CERTIFICATE
// ============================================
function generateFriendCardPDF(isDBFriend) {
    if (!capturedPhotoData) {
        alert('No photo captured! Please capture photo first.');
        return;
    }
    
    if (!window.jspdf && !window.jsPDF) {
        loadJSPDF(function() { generateFriendCardPDF(isDBFriend); });
        return;
    }
    
    const friendImg = new Image();
    friendImg.crossOrigin = 'anonymous';
    
    const formalImg = new Image();
    formalImg.crossOrigin = 'anonymous';
    
    const signImg = new Image();
    signImg.crossOrigin = 'anonymous';
    
    let loaded = 0;
    const totalImages = 3;
    
    function checkLoaded() {
        loaded++;
        if (loaded >= totalImages) {
            generatePDF();
        }
    }
    
    friendImg.onload = checkLoaded;
    friendImg.onerror = function() {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, 200, 200);
        ctx.fillStyle = '#999';
        ctx.font = '60px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('📷', 100, 100);
        friendImg.src = canvas.toDataURL();
        checkLoaded();
    };
    
    formalImg.onload = checkLoaded;
    formalImg.onerror = function() {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#DAA520';
        ctx.fillRect(0, 0, 200, 200);
        ctx.fillStyle = '#fff';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('👤', 100, 100);
        formalImg.src = canvas.toDataURL();
        checkLoaded();
    };
    
    signImg.onload = checkLoaded;
    signImg.onerror = function() {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 80;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, 200, 80);
        ctx.strokeStyle = '#DAA520';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(20, 40);
        ctx.bezierCurveTo(60, 10, 100, 70, 140, 35);
        ctx.bezierCurveTo(160, 20, 180, 45, 190, 38);
        ctx.stroke();
        signImg.src = canvas.toDataURL();
        checkLoaded();
    };
    
    friendImg.src = capturedPhotoData;
    formalImg.src = 'assets/images/formal.jpg';
    signImg.src = 'assets/images/signature.jpg';
    
    function generatePDF() {
        const jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
        const pdf = new jsPDF('l', 'mm', 'a4');
        const pw = 297;
        const ph = 210;
        
        pdf.setFillColor('#ffffff');
        pdf.rect(0, 0, pw, ph, 'F');
        
        pdf.setDrawColor('#DAA520');
        pdf.setLineWidth(2);
        pdf.rect(5, 5, pw - 10, ph - 10);
        
        pdf.setDrawColor('#DAA520');
        pdf.setLineWidth(0.5);
        pdf.rect(10, 10, pw - 20, ph - 20);
        
        pdf.setFillColor('#DAA520');
        pdf.roundedRect(pw/2 - 40, 10, 80, 10, 5, 5, 'F');
        pdf.setTextColor('#ffffff');
        pdf.setFontSize(8);
        pdf.setFont(undefined, 'bold');
        pdf.text('FRIENDS CORNER', pw/2, 18, { align: 'center' });
        
        pdf.setTextColor('#1a1a1a');
        pdf.setFontSize(22);
        pdf.setFont(undefined, 'bold');
        pdf.text('CERTIFICATE OF FRIENDSHIP', pw/2, 38, { align: 'center' });
        
        pdf.setDrawColor('#DAA520');
        pdf.setLineWidth(0.5);
        pdf.line(60, 44, pw - 60, 44);
        
        // LEFT: Formal Photo (Ravi Raj)
        const leftX = 22;
        const leftY = 58;
        const photoSize = 50;
        
        pdf.setDrawColor('#DAA520');
        pdf.setLineWidth(1.5);
        pdf.rect(leftX, leftY, photoSize, photoSize);
        
        try {
            pdf.addImage(formalImg, 'PNG', leftX + 1, leftY + 1, photoSize - 2, photoSize - 2);
        } catch(e) {}
        
        pdf.setTextColor('#DAA520');
        pdf.setFontSize(9);
        pdf.setFont(undefined, 'bold');
        pdf.text('RAVI RAJ', leftX + photoSize/2, leftY + photoSize + 7, { align: 'center' });
        pdf.setTextColor('#999999');
        pdf.setFontSize(7);
        pdf.setFont(undefined, 'normal');
        pdf.text('Certificate Issuer', leftX + photoSize/2, leftY + photoSize + 14, { align: 'center' });
        
        // CONNECTED BADGE
        const cx = pw/2;
        const cy = 83;
        
        pdf.setFillColor('#f8f6f3');
        pdf.circle(cx, cy, 18, 'F');
        pdf.setDrawColor('#DAA520');
        pdf.setLineWidth(1.5);
        pdf.circle(cx, cy, 18, 'S');
        
        pdf.setTextColor('#DAA520');
        pdf.setFontSize(22);
        pdf.text('🤝', cx, cy + 7, { align: 'center' });
        
        pdf.setTextColor('#DAA520');
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'bold');
        pdf.text('CONNECTED', cx, cy + 30, { align: 'center' });
        
        // RIGHT: Friend Photo
        const rightX = pw - 22 - photoSize;
        const rightY = 58;
        
        pdf.setDrawColor('#DAA520');
        pdf.setLineWidth(1.5);
        pdf.rect(rightX, rightY, photoSize, photoSize);
        
        try {
            pdf.addImage(friendImg, 'PNG', rightX + 1, rightY + 1, photoSize - 2, photoSize - 2);
        } catch(e) {}
        
        pdf.setTextColor('#7c3aed');
        pdf.setFontSize(9);
        pdf.setFont(undefined, 'bold');
        pdf.text(currentFriend.firstName.toUpperCase(), rightX + photoSize/2, rightY + photoSize + 7, { align: 'center' });
        pdf.setTextColor('#999999');
        pdf.setFontSize(7);
        pdf.setFont(undefined, 'normal');
        pdf.text('Verified Friend', rightX + photoSize/2, rightY + photoSize + 14, { align: 'center' });
        
        // CONNECTION LINE
        pdf.setDrawColor('#DAA520');
        pdf.setLineWidth(0.5);
        pdf.setLineDashPattern([3, 3]);
        pdf.line(leftX + photoSize + 8, leftY + photoSize/2, rightX - 8, rightY + photoSize/2);
        pdf.setLineDashPattern([]);
        
        // CERTIFICATE TEXT
        const certY = 132;
        
        pdf.setDrawColor('#DAA520');
        pdf.setLineWidth(0.3);
        pdf.line(30, certY - 5, pw - 30, certY - 5);
        
        pdf.setTextColor('#333333');
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'normal');
        pdf.text('This is to certify that the above person is a verified friend of Ravi Raj.', pw/2, certY + 10, { align: 'center' });
        pdf.text('Their friendship has been officially recognized and recorded.', pw/2, certY + 22, { align: 'center' });
        
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        
        pdf.setTextColor('#666666');
        pdf.setFontSize(9);
        pdf.setFont(undefined, 'normal');
        pdf.text('Issued on: ' + dateStr, pw/2, certY + 38, { align: 'center' });
        pdf.text('Location: Begusarai, Bihar, India', pw/2, certY + 47, { align: 'center' });
        
        if (isDBFriend && currentFriend.tag) {
            pdf.setTextColor('#7c3aed');
            pdf.setFontSize(10);
            pdf.setFont(undefined, 'italic');
            pdf.text('"' + currentFriend.tag + '"', pw/2, certY + 58, { align: 'center' });
        }
        
        // SIGNATURE
        const signX = pw - 30;
        const signY = 175;
        const signW = 50;
        const signH = 20;
        
        pdf.setDrawColor('#DAA520');
        pdf.setLineWidth(0.5);
        pdf.line(signX - signW/2, signY + signH, signX + signW/2, signY + signH);
        
        try {
            pdf.addImage(signImg, 'PNG', signX - signW/2, signY - 2, signW, signH - 4);
        } catch(e) {}
        
        pdf.setTextColor('#333333');
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'bold');
        pdf.text('Ravi Raj', signX, signY + signH + 6, { align: 'center' });
        pdf.setTextColor('#999999');
        pdf.setFontSize(7);
        pdf.setFont(undefined, 'normal');
        pdf.text('Founder, Friends Corner', signX, signY + signH + 14, { align: 'center' });
        
        // FOOTER
        pdf.setDrawColor('#DAA520');
        pdf.setLineWidth(0.3);
        pdf.line(30, ph - 12, pw - 30, ph - 12);
        
        pdf.setTextColor('#999999');
        pdf.setFontSize(7);
        pdf.text('© 2026 Ravi Raj · All Rights Reserved', pw/2, ph - 4, { align: 'center' });
        
        // WATERMARK
        pdf.setTextColor('rgba(218, 165, 32, 0.05)');
        pdf.setFontSize(60);
        pdf.setFont(undefined, 'bold');
        pdf.text('FRIENDS', pw/2, ph/2 + 10, { align: 'center' });
        
        pdf.save('Friendship_Certificate_' + (currentFriend.firstName || 'Friend') + '.pdf');
    }
}

// ============================================
// JSPDF LOADER
// ============================================
function loadJSPDF(callback) {
    if (window.jspdf || window.jsPDF) {
        if (callback) callback();
        return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = function() {
        console.log('jsPDF loaded');
        if (callback) callback();
    };
    script.onerror = function() {
        console.error('Failed to load jsPDF');
        alert('Failed to load PDF library. Please check internet connection.');
    };
    document.head.appendChild(script);
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
    console.log('Download Friend Card clicked!');
    if (!capturedPhotoData) {
        alert('No photo captured! Please capture photo first.');
        return;
    }
    if (!currentFriend) {
        alert('No friend found! Please search first.');
        return;
    }
    if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
        alert('PDF library loading... Please try again in 2 seconds.');
        loadJSPDF(function() {
            setTimeout(function() {
                generateFriendCardPDF(isDatabaseFriend);
            }, 500);
        });
        return;
    }
    generateFriendCardPDF(isDatabaseFriend);
};

window.downloadNewFriendCard = function() {
    console.log('Download New Friend Card clicked!');
    if (!capturedPhotoData) {
        alert('No photo captured! Please capture photo first.');
        return;
    }
    if (!currentFriend) {
        alert('No friend found! Please search first.');
        return;
    }
    if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
        alert('PDF library loading... Please try again in 2 seconds.');
        loadJSPDF(function() {
            setTimeout(function() {
                generateFriendCardPDF(false);
            }, 500);
        });
        return;
    }
    generateFriendCardPDF(false);
};

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
window.shareFriendCard = shareFriendCard;
window.resetSearch = resetSearch;
window.generateFriendCardPDF = generateFriendCardPDF;
window.downloadFriendCard = downloadFriendCard;
window.downloadNewFriendCard = downloadNewFriendCard;

console.log('✅ Friends Corner JS Loaded Successfully!');
