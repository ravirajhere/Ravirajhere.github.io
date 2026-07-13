// ============================================
// FRIENDS CORNER — PROFESSIONAL JS (IMPROVED)
// Version: 11.0 | Production Ready | Error Free
// Author: Ravi Raj
// ============================================

'use strict';

// ============================================
// FRIENDS DATABASE (14 Friends)
// ============================================
const friendsData = [
    {
        firstName: "Sitanashu",
        personalName: "",
        connection: "🤝 Best Friend",
        experience: "We've been friends since Class 1 — same bench, same lunch, same mischief! 😂 He taught me how to ride a bicycle. We still meet every Sunday to play cricket.",
        age: 18,
        school: "GBGS",
        sinceClass: 1,
        hobby: "Cricket, Coding",
        rating: 5,
        tag: "Oldest Friend"
    },
    {
        firstName: "Rohit",
        personalName: "",
        connection: "🤝 Best Friend",
        experience: "Class 1 se saath — we've seen each other grow up! ❤️ We started our coding journey together in Class 6. Best partner in crime!",
        age: 18,
        school: "GBGS",
        sinceClass: 1,
        hobby: "Cricket, Music",
        rating: 5,
        tag: "Day One Friend"
    },
    {
        firstName: "Suraj",
        personalName: "",
        connection: "🏏 Cricket Partner",
        experience: "We played in the school cricket team — he hit the winning six in the final match! 🏆 He's the most aggressive batsman I've ever seen.",
        age: 17,
        school: "Mother's Pride",
        sinceClass: 6,
        hobby: "Cricket, Music",
        rating: 4,
        tag: "Sports Buddy"
    },
    {
        firstName: "Shresth",
        personalName: "Ramlal",
        connection: "🎮 Gaming Buddy",
        experience: "We played PUBG & Free Fire all night during lockdown. He taught me how to snipe! 🎯 He's the most chill person I know.",
        age: 17,
        school: "Mother's Pride",
        sinceClass: 6,
        hobby: "Gaming, Tech",
        rating: 4,
        tag: "Gamer Friend"
    },
    {
        firstName: "Ayush",
        personalName: "",
        connection: "🎭 Drama Partner",
        experience: "We performed together in school annual function — he forgot his lines and I saved him! 😂 He can dance, act, and make anyone laugh.",
        age: 17,
        school: "Mother's Pride",
        sinceClass: 6,
        hobby: "Acting, Dancing",
        rating: 5,
        tag: "Funniest Friend"
    },
    {
        firstName: "Rishidev",
        personalName: "Karait",
        connection: "📚 Study Partner",
        experience: "We sat together in Class 10, shared notes, and helped each other pass exams! 📖 He's the most disciplined person I know.",
        age: 18,
        school: "Mother's Pride",
        sinceClass: 6,
        hobby: "Reading, Chess",
        rating: 5,
        tag: "Scholar Friend"
    },
    {
        firstName: "Jigyasha",
        personalName: "",
        connection: "📖 Classmate",
        experience: "She sits next to me in class. We share notes, gossip, and laugh at bad jokes! 😄 She's the most positive person I've ever met.",
        age: 17,
        school: "Mother's Pride",
        sinceClass: 6,
        hobby: "Reading, Art",
        rating: 4,
        tag: "Positive Vibes"
    },
    {
        firstName: "Sudhanshu",
        personalName: "",
        connection: "🤝 Best Friend",
        experience: "We grew up together, played cricket every evening, and copied each other's homework 😂 He's the most loyal friend I have. We've shared our deepest secrets.",
        age: 18,
        school: "Mother's Pride",
        sinceClass: 7,
        hobby: "Cricket, Coding",
        rating: 5,
        tag: "Most Loyal"
    },
    {
        firstName: "Priyam",
        personalName: "Chota Gandhi",
        connection: "🧑‍💻 Coding Buddy",
        experience: "We learned HTML together in Class 6. He's the reason I started coding! 💻 He's incredibly smart and always comes up with creative solutions.",
        age: 17,
        school: "Mother's Pride",
        sinceClass: 8,
        hobby: "Coding, Gaming",
        rating: 5,
        tag: "Tech Genius"
    },
    {
        firstName: "Harsh",
        personalName: "Constant",
        connection: "🎸 Music Partner",
        experience: "We started a band together in Class 9 — he plays guitar, I sing (badly)! 😂 He practices 6 hours a day.",
        age: 18,
        school: "Mother's Pride",
        sinceClass: 8,
        hobby: "Music, Guitar",
        rating: 4,
        tag: "Rockstar Friend"
    },
    {
        firstName: "Keshav",
        personalName: "Sin r (Keshav Khatoon)",
        connection: "♟️ Chess Rival",
        experience: "We played chess every break. He beat me 20 times, I beat him once and celebrated! 🏆 He can calculate 5 moves ahead.",
        age: 17,
        school: "Mother's Pride",
        sinceClass: 9,
        hobby: "Chess, Tech",
        rating: 4,
        tag: "Smartest Friend"
    },
    {
        firstName: "Rani",
        personalName: "",
        connection: "👯‍♀️ Childhood Friend",
        experience: "We've been friends since we were 5 — she's like a sister to me! ❤️ She knows all my secrets and still loves me. She bakes the best cakes.",
        age: 17,
        school: "PW Iskon Vidypeeth, Patna",
        sinceClass: 12,
        hobby: "Dancing, Cooking",
        rating: 5,
        tag: "Sweetest Friend"
    },
    {
        firstName: "Sneha",
        personalName: "",
        connection: "🎭 Drama Partner",
        experience: "We performed together in school annual function — I forgot my lines but she saved me! 😂 She's the most confident person I know.",
        age: 18,
        school: "PW Iskon Vidypeeth, Patna",
        sinceClass: 12,
        hobby: "Dance, Poetry",
        rating: 4,
        tag: "Confident Friend"
    },
    {
        firstName: "Rohini",
        personalName: "",
        connection: "🎨 Art Partner",
        experience: "We painted posters for school events together. She taught me how to draw! 🖌️ We've won several inter-school competitions together.",
        age: 18,
        school: "PW Iskon Vidypeeth, Patna",
        sinceClass: 12,
        hobby: "Art, Poetry",
        rating: 5,
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
let dedicationMessage = '';
let recognition = null;

// ============================================
// DOM REFERENCES
// ============================================
const DOM = {
    searchArea: document.getElementById('searchArea'),
    photoScreen: document.getElementById('photoScreen'),
    foundScreen: document.getElementById('foundScreen'),
    newFriendScreen: document.getElementById('newFriendScreen'),
    detailsScreen: document.getElementById('detailsScreen'),
    niceMessage: document.getElementById('niceMessage'),
    messageModal: document.getElementById('messageModal'),
    photoFriendName: document.getElementById('photoFriendName'),
    webcamVideo: document.getElementById('webcamVideo'),
    webcamPlaceholder: document.getElementById('webcamPlaceholder'),
    captureBtn: document.getElementById('captureBtn'),
    permissionDenied: document.getElementById('permissionDenied'),
    permissionMessage: document.getElementById('permissionMessage'),
    friendSearch: document.getElementById('friendSearch'),
    voiceBtn: document.getElementById('voiceBtn'),
    voiceStatus: document.getElementById('voiceStatus'),
    foundAvatar: document.getElementById('foundAvatar'),
    foundName: document.getElementById('foundName'),
    foundRating: document.getElementById('foundRating'),
    foundRatingLabel: document.getElementById('foundRatingLabel'),
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
    detailsRating: document.getElementById('detailsRating'),
    detailsTimelineBar: document.getElementById('detailsTimelineBar'),
    detailsTimelineText: document.getElementById('detailsTimelineText'),
    liveDate: document.getElementById('liveDate'),
    liveTime: document.getElementById('liveTime'),
    liveYear: document.getElementById('liveYear'),
    liveBattery: document.getElementById('liveBattery'),
    liveDevice: document.getElementById('liveDevice'),
    liveLocation: document.getElementById('liveLocation'),
    msgFriendName: document.getElementById('msgFriendName'),
    dedicatedMessageText: document.getElementById('dedicatedMessageText'),
    modalFriendName: document.getElementById('modalFriendName'),
    dedicationInput: document.getElementById('dedicationMessage'),
    confettiContainer: document.getElementById('confettiContainer')
};

// ============================================
// INITIALIZATION
// ============================================
function init() {
    console.log('👥 Friends Corner JS loaded!');
    
    // Enter key to search
    if (DOM.friendSearch) {
        DOM.friendSearch.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') searchFriend();
        });
    }
    
    // Escape to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeMessageModal();
    });
    
    // Close message modal on outside click
    if (DOM.messageModal) {
        DOM.messageModal.addEventListener('click', function(e) {
            if (e.target === this) closeMessageModal();
        });
    }
    
    // Preload jsPDF
    loadJSPDF();
    
    console.log('✅ Friends Corner initialized successfully!');
    console.log('📊 ' + friendsData.length + ' friends in database');
}

// ============================================
// STEP 1: SEARCH FRIEND
// ============================================
function searchFriend() {
    const input = DOM.friendSearch ? DOM.friendSearch.value.trim() : '';
    hideAllScreens();
    
    if (!input) {
        showAlert('Please enter a first name! 🔍');
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
            rating: 3,
            tag: 'New Friend'
        };
        isDatabaseFriend = false;
    }
    
    restoreDedication();
    if (DOM.photoFriendName) DOM.photoFriendName.textContent = currentFriend.firstName;
    if (DOM.searchArea) DOM.searchArea.style.display = 'none';
    if (DOM.photoScreen) DOM.photoScreen.style.display = 'block';
    startWebcam();
}

// ============================================
// VOICE SEARCH
// ============================================
function toggleVoiceSearch() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showAlert('Voice search not supported. Please use Chrome or Edge.');
        return;
    }
    
    if (recognition && DOM.voiceBtn && DOM.voiceBtn.classList.contains('listening')) {
        recognition.stop();
        if (DOM.voiceBtn) DOM.voiceBtn.classList.remove('listening');
        if (DOM.voiceStatus) DOM.voiceStatus.classList.remove('show');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = function() {
        if (DOM.voiceBtn) DOM.voiceBtn.classList.add('listening');
        if (DOM.voiceStatus) {
            DOM.voiceStatus.classList.add('show');
            DOM.voiceStatus.textContent = '🎤 Listening... Speak name';
        }
    };
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.trim();
        if (DOM.friendSearch) DOM.friendSearch.value = transcript;
        if (DOM.voiceStatus) {
            DOM.voiceStatus.textContent = '✅ Heard: "' + transcript + '" — Searching...';
        }
        if (DOM.voiceBtn) DOM.voiceBtn.classList.remove('listening');
        setTimeout(function() {
            if (DOM.voiceStatus) DOM.voiceStatus.classList.remove('show');
            searchFriend();
        }, 500);
    };
    
    recognition.onerror = function() {
        if (DOM.voiceBtn) DOM.voiceBtn.classList.remove('listening');
        if (DOM.voiceStatus) {
            DOM.voiceStatus.textContent = '❌ Could not hear. Try again.';
            setTimeout(function() {
                DOM.voiceStatus.classList.remove('show');
            }, 1500);
        }
    };
    
    recognition.onend = function() {
        if (DOM.voiceBtn) DOM.voiceBtn.classList.remove('listening');
    };
    
    recognition.start();
}

// ============================================
// STEP 2: WEBCAM
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
        
    } catch (error) {
        showCameraDenied('Camera start nahi ho paya. Please allow camera permission.');
    }
}

function showCameraDenied(message) {
    webcamActive = false;
    if (DOM.webcamPlaceholder) DOM.webcamPlaceholder.style.display = 'flex';
    if (DOM.permissionDenied) DOM.permissionDenied.style.display = 'block';
    if (DOM.permissionMessage) DOM.permissionMessage.textContent = message;
    if (DOM.captureBtn) DOM.captureBtn.style.display = 'none';
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
// STEP 3: CAPTURE PHOTO
// ============================================
function captureFriendPhoto() {
    if (!webcamActive || !DOM.webcamVideo) {
        showAlert('⚠️ Camera not active! Please allow camera access.');
        return;
    }
    
    const video = DOM.webcamVideo;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 400;
    canvas.height = video.videoHeight || 300;
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(video, 0, 0);
    
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

function showFriendFound() {
    if (DOM.foundAvatar) {
        DOM.foundAvatar.innerHTML = '<img src="' + capturedPhotoData + '" alt="Photo" style="width:100%;height:100%;object-fit:cover;">';
    }
    if (DOM.foundName) DOM.foundName.textContent = currentFriend.firstName;
    if (DOM.foundRating) DOM.foundRating.innerHTML = generateStars(currentFriend.rating);
    if (DOM.foundRatingLabel) DOM.foundRatingLabel.textContent = currentFriend.tag || '';
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
// RATING STARS
// ============================================
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += '<span class="star ' + (i <= rating ? 'active' : '') + '">⭐</span>';
    }
    return stars;
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
    if (text) text.textContent = 'Since Class ' + currentFriend.sinceClass + ' — ' + years + ' Years of Friendship ❤️';
}

// ============================================
// CONFETTI
// ============================================
function launchConfetti() {
    const container = DOM.confettiContainer;
    if (!container) return;
    container.innerHTML = '';
    
    const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff922b', '#a29bfe', '#ff69b4', '#00ff64'];
    
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
    if (DOM.displaySchoolClass) DOM.displaySchoolClass.textContent = '📚 ' + (currentFriend.school || '') + ' — Since Class ' + (currentFriend.sinceClass || '');
    if (DOM.detailsRating) DOM.detailsRating.innerHTML = generateStars(currentFriend.rating) + ' <span style="font-size:12px;color:var(--text3);">' + (currentFriend.tag || 'Friend') + '</span>';
    
    updateTimeline('details');
    updateLiveStats();
    
    setTimeout(function() {
        if (DOM.msgFriendName) DOM.msgFriendName.textContent = currentFriend.firstName;
        if (DOM.dedicatedMessageText) DOM.dedicatedMessageText.textContent = dedicationMessage ? '"' + dedicationMessage + '"' : '';
        if (DOM.niceMessage) DOM.niceMessage.style.display = 'block';
        
        setTimeout(function() {
            if (DOM.niceMessage) DOM.niceMessage.style.display = 'none';
        }, 3000);
    }, 2000);
}

// ============================================
// MESSAGE DEDICATION
// ============================================
function openMessageModal() {
    if (DOM.modalFriendName) DOM.modalFriendName.textContent = currentFriend.firstName;
    if (DOM.dedicationInput) DOM.dedicationInput.value = dedicationMessage;
    if (DOM.messageModal) DOM.messageModal.classList.add('show');
}

function closeMessageModal() {
    if (DOM.messageModal) DOM.messageModal.classList.remove('show');
}

function saveDedication() {
    if (DOM.dedicationInput) {
        dedicationMessage = DOM.dedicationInput.value.trim();
        localStorage.setItem('dedication_' + currentFriend.firstName, dedicationMessage);
    }
    closeMessageModal();
    showAlert('💌 Message saved! It will appear on Certificate and Friend Card.');
}

// ============================================
// RESTORE DEDICATION
// ============================================
function restoreDedication() {
    if (currentFriend) {
        const saved = localStorage.getItem('dedication_' + currentFriend.firstName);
        dedicationMessage = saved || '';
    }
}

// ============================================
// NEW FRIEND CARD DOWNLOAD
// ============================================
function downloadNewFriendCard() {
    if (!capturedPhotoData) {
        showAlert('No photo captured! Please capture photo first.');
        return;
    }
    generateFriendCardPDF(false);
}

function downloadFriendCard() {
    if (!capturedPhotoData) {
        showAlert('No photo captured! Please capture photo first.');
        return;
    }
    generateFriendCardPDF(true);
}

// ============================================
// FRIEND CARD PDF
// ============================================
function generateFriendCardPDF(isDBFriend) {
    if (!capturedPhotoData) {
        showAlert('No photo captured! Please capture photo first.');
        return;
    }
    
    if (!window.jspdf && !window.jsPDF) {
        loadJSPDF(function() { generateFriendCardPDF(isDBFriend); });
        return;
    }
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = function() {
        const jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pw = 210;
        const ph = 297;
        
        pdf.setFillColor('#FFFEF7');
        pdf.rect(0, 0, pw, ph, 'F');
        
        // Indian Flag Border
        pdf.setFillColor('#FF9933'); pdf.rect(0, 0, pw, 3, 'F');
        pdf.setFillColor('#FFFFFF'); pdf.rect(0, 3, pw, 3, 'F');
        pdf.setFillColor('#138808'); pdf.rect(0, 6, pw, 3, 'F');
        pdf.setFillColor('#FF9933'); pdf.rect(0, ph - 9, pw, 3, 'F');
        pdf.setFillColor('#FFFFFF'); pdf.rect(0, ph - 6, pw, 3, 'F');
        pdf.setFillColor('#138808'); pdf.rect(0, ph - 3, pw, 3, 'F');
        
        // Header
        pdf.setFillColor('#1a1a2e');
        pdf.rect(0, 9, pw, 22, 'F');
        pdf.setTextColor('#ffffff');
        pdf.setFontSize(18);
        pdf.text('FRIENDS CORNER', pw / 2, 22, { align: 'center' });
        pdf.setFontSize(9);
        pdf.text('RAVI RAJ PORTFOLIO — Verified Friend Card', pw / 2, 28, { align: 'center' });
        
        // Photo
        pdf.setDrawColor('#6c5ce7');
        pdf.setLineWidth(0.8);
        pdf.rect(12, 36, 50, 62);
        pdf.addImage(img, 'PNG', 15.5, 39.5, 43, 43);
        
        pdf.setTextColor('#6c5ce7');
        pdf.setFontSize(9);
        pdf.text('LIVE PHOTO', 37, 91, { align: 'center' });
        pdf.text('#friends', 37, 95, { align: 'center' });
        
        // Info
        let yPos = 44;
        const leftX = 68;
        
        pdf.setTextColor('#1a1a2e');
        pdf.setFontSize(16);
        pdf.text('NAME: ' + currentFriend.firstName.toUpperCase(), leftX, yPos);
        yPos += 8;
        
        if (isDBFriend) {
            pdf.setFontSize(11);
            pdf.text('RATING: ' + '★'.repeat(currentFriend.rating) + ' (' + (currentFriend.tag || 'Friend') + ')', leftX, yPos);
            yPos += 7;
            pdf.text('CONNECTION: ' + currentFriend.connection, leftX, yPos);
            yPos += 7;
            pdf.text('AGE: ' + currentFriend.age + ' Years | SCHOOL: ' + currentFriend.school, leftX, yPos);
            yPos += 7;
            pdf.text('SINCE: Class ' + currentFriend.sinceClass + ' | HOBBY: ' + currentFriend.hobby, leftX, yPos);
            yPos += 12;
            
            pdf.setFillColor('#f0edff');
            pdf.roundedRect(leftX - 2, yPos - 4, 128, 32, 2, 2, 'F');
            pdf.setTextColor('#6c5ce7');
            pdf.setFontSize(10);
            pdf.text('EXPERIENCE:', leftX, yPos);
            pdf.setTextColor('#333333');
            pdf.setFontSize(9);
            const lines = pdf.splitTextToSize(currentFriend.experience, 122);
            pdf.text(lines, leftX, yPos + 6);
            yPos += 38;
            
            const cy = 2026;
            const sy = currentFriend.sinceClass <= 5 ? 2013 : currentFriend.sinceClass <= 10 ? 2019 : 2024;
            const yrs = cy - sy;
            
            pdf.setFillColor('#fff8e1');
            pdf.roundedRect(12, yPos, pw - 24, 12, 2, 2, 'F');
            pdf.setTextColor('#6c5ce7');
            pdf.setFontSize(10);
            pdf.text('FRIENDSHIP: Since Class ' + currentFriend.sinceClass + ' — ' + yrs + ' Years', pw / 2, yPos + 8, { align: 'center' });
            yPos += 18;
        } else {
            pdf.setFontSize(11);
            pdf.text('STATUS: New Friend of Ravi!', leftX, yPos);
            yPos += 7;
            pdf.text('Welcome to the Friend List!', leftX, yPos);
            yPos += 12;
            
            pdf.setFillColor('#f0edff');
            pdf.roundedRect(leftX - 2, yPos - 4, 128, 22, 2, 2, 'F');
            pdf.setTextColor('#6c5ce7');
            pdf.setFontSize(10);
            pdf.text('MESSAGE:', leftX, yPos);
            pdf.setTextColor('#333333');
            pdf.setFontSize(9);
            pdf.text('"' + currentFriend.firstName + ' is now a verified Friend of Ravi Raj!"', leftX, yPos + 6);
            pdf.text('Photo captured via Friends Corner. Welcome!', leftX, yPos + 12);
            yPos += 28;
        }
        
        if (dedicationMessage && isDBFriend) {
            pdf.setFillColor('#fff0f0');
            pdf.roundedRect(12, yPos, pw - 24, 16, 2, 2, 'F');
            pdf.setTextColor('#ff6b6b');
            pdf.setFontSize(9);
            pdf.text('SPECIAL MESSAGE:', 16, yPos + 5);
            pdf.setTextColor('#333333');
            pdf.setFontSize(10);
            pdf.text('"' + dedicationMessage + '"', 16, yPos + 11);
            yPos += 22;
        }
        
        const footerY = 252;
        pdf.setDrawColor('#6c5ce7');
        pdf.setLineWidth(0.3);
        pdf.line(12, footerY, pw - 12, footerY);
        
        const now = new Date();
        pdf.setTextColor('#666666');
        pdf.setFontSize(8);
        pdf.text('Date: ' + now.toLocaleDateString('en-IN') + ' | Time: ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), pw / 2, footerY + 6, { align: 'center' });
        pdf.text('Location: Begusarai, Bihar, India', pw / 2, footerY + 12, { align: 'center' });
        
        pdf.setTextColor('#6c5ce7');
        pdf.setFontSize(9);
        pdf.text('Verified by Ravi Raj | #friends', pw / 2, footerY + 20, { align: 'center' });
        
        pdf.setDrawColor('#6c5ce7');
        pdf.setLineWidth(0.5);
        pdf.rect(pw - 42, footerY - 10, 30, 22);
        pdf.setFontSize(7);
        pdf.text('SCAN FOR PROFILE', pw - 27, footerY + 2, { align: 'center' });
        
        pdf.save('FriendCard-' + currentFriend.firstName + '.pdf');
    };
    
    img.onerror = function() {
        showAlert('Photo load error! Please capture photo again.');
    };
    
    img.src = capturedPhotoData;
}

// ============================================
// CERTIFICATE PDF
// ============================================
function downloadCertificate() {
    if (!capturedPhotoData) {
        showAlert('No photo captured! Please capture photo first.');
        return;
    }
    
    if (!window.jspdf && !window.jsPDF) {
        loadJSPDF(function() { downloadCertificate(); });
        return;
    }
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = function() {
        const jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
        const pdf = new jsPDF('l', 'mm', 'a4');
        const pw = 297;
        const ph = 210;
        
        pdf.setFillColor('#FFFEF7');
        pdf.rect(0, 0, pw, ph, 'F');
        
        pdf.setDrawColor('#DAA520');
        pdf.setLineWidth(3);
        pdf.rect(8, 8, pw - 16, ph - 16);
        pdf.setLineWidth(0.8);
        pdf.rect(12, 12, pw - 24, ph - 24);
        
        pdf.setTextColor('#B8860B');
        pdf.setFontSize(22);
        pdf.text('FRIENDSHIP CERTIFICATE', pw / 2, 32, { align: 'center' });
        
        pdf.setDrawColor('#DAA520');
        pdf.setLineWidth(0.3);
        pdf.line(50, 36, pw - 50, 36);
        
        pdf.setTextColor('#555555');
        pdf.setFontSize(11);
        pdf.text('This is to certify that', pw / 2, 46, { align: 'center' });
        
        pdf.setTextColor('#6c5ce7');
        pdf.setFontSize(28);
        pdf.text(currentFriend.firstName.toUpperCase(), pw / 2, 60, { align: 'center' });
        
        pdf.addImage(img, 'PNG', 25, 70, 65, 65);
        
        const boxX = 105, boxY = 70, boxW = 85, boxH = 65;
        const rating = currentFriend.rating || 3;
        
        pdf.setFillColor('#FFF8E1');
        pdf.setDrawColor('#DAA520');
        pdf.setLineWidth(1.5);
        pdf.roundedRect(boxX, boxY, boxW, boxH, 5, 5, 'FD');
        
        pdf.setTextColor('#B8860B');
        pdf.setFontSize(10);
        pdf.text('RATING', boxX + boxW / 2, boxY + 10, { align: 'center' });
        
        pdf.setFontSize(18);
        pdf.text('★'.repeat(rating) + '☆'.repeat(5 - rating), boxX + boxW / 2, boxY + 28, { align: 'center' });
        
        pdf.setTextColor('#555555');
        pdf.setFontSize(9);
        pdf.text(rating + ' Star Friend!', boxX + boxW / 2, boxY + 40, { align: 'center' });
        
        if (currentFriend.tag) {
            pdf.setTextColor('#6c5ce7');
            pdf.setFontSize(8);
            pdf.text('"' + currentFriend.tag + '"', boxX + boxW / 2, boxY + 52, { align: 'center' });
        }
        
        pdf.setDrawColor('#DAA520');
        pdf.setLineWidth(0.5);
        pdf.line(boxX + 10, boxY + 56, boxX + boxW - 10, boxY + 56);
        
        let infoY = 148;
        
        pdf.setTextColor('#555555');
        pdf.setFontSize(13);
        pdf.text('is officially recognized as a', pw / 2, infoY, { align: 'center' });
        infoY += 10;
        
        pdf.setTextColor('#DAA520');
        pdf.setFontSize(16);
        pdf.text('★'.repeat(rating) + '☆'.repeat(5 - rating) + '  Friend of', pw / 2, infoY + 2, { align: 'center' });
        infoY += 12;
        
        pdf.setTextColor('#6c5ce7');
        pdf.setFontSize(22);
        pdf.text('RAVI RAJ', pw / 2, infoY, { align: 'center' });
        infoY += 12;
        
        if (isDatabaseFriend) {
            pdf.setTextColor('#333333');
            pdf.setFontSize(10);
            pdf.text('Since Class ' + currentFriend.sinceClass + ' | ' + currentFriend.school, pw / 2, infoY, { align: 'center' });
            infoY += 8;
            pdf.text('Connection: ' + currentFriend.connection, pw / 2, infoY, { align: 'center' });
            infoY += 8;
            pdf.text('Age: ' + currentFriend.age + ' Years | Hobby: ' + currentFriend.hobby, pw / 2, infoY, { align: 'center' });
            infoY += 12;
        }
        
        if (dedicationMessage) {
            pdf.setFillColor('#fff0f0');
            pdf.setDrawColor('#ff6b6b');
            pdf.setLineWidth(0.5);
            pdf.roundedRect(40, infoY, pw - 80, 14, 3, 3, 'FD');
            
            pdf.setTextColor('#ff6b6b');
            pdf.setFontSize(7);
            pdf.text('SPECIAL MESSAGE', pw / 2, infoY + 4, { align: 'center' });
            
            pdf.setTextColor('#333333');
            pdf.setFontSize(9);
            pdf.text('"' + dedicationMessage + '"', pw / 2, infoY + 10, { align: 'center' });
            infoY += 18;
        }
        
        const footerY = ph - 20;
        pdf.setDrawColor('#DAA520');
        pdf.setLineWidth(0.3);
        pdf.line(50, footerY, pw - 50, footerY);
        
        pdf.setTextColor('#999999');
        pdf.setFontSize(7);
        pdf.text('Awarded: ' + new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), 25, footerY + 6);
        pdf.text('Begusarai, Bihar, India', pw / 2, footerY + 6, { align: 'center' });
        
        pdf.setTextColor('#DAA520');
        pdf.setFontSize(9);
        pdf.text('#friends', pw - 25, footerY + 6, { align: 'right' });
        
        pdf.setTextColor('#B8860B');
        pdf.setFontSize(10);
        pdf.text('OFFICIAL FRIENDSHIP CERTIFICATE', pw / 2, ph - 8, { align: 'center' });
        
        pdf.save('Certificate-' + currentFriend.firstName + '.pdf');
    };
    
    img.onerror = function() {
        showAlert('Photo load error! Please capture photo again.');
    };
    
    img.src = capturedPhotoData;
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
        console.log('✅ jsPDF loaded');
        if (callback) callback();
    };
    script.onerror = function() {
        console.error('❌ Failed to load jsPDF');
    };
    document.head.appendChild(script);
}

// ============================================
// LIVE STATS
// ============================================
function updateLiveStats() {
    const now = new Date();
    if (DOM.liveDate) DOM.liveDate.textContent = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    if (DOM.liveTime) DOM.liveTime.textContent = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    if (DOM.liveYear) DOM.liveYear.textContent = now.getFullYear();
    
    if ('getBattery' in navigator) {
        navigator.getBattery()
            .then(function(b) {
                const lvl = Math.round(b.level * 100);
                if (DOM.liveBattery) {
                    DOM.liveBattery.textContent = lvl + '%' + (b.charging ? ' ⚡' : '');
                    DOM.liveBattery.className = 'value ' + (lvl > 50 ? 'green' : lvl > 20 ? 'yellow' : 'red');
                }
            })
            .catch(function() {
                if (DOM.liveBattery) {
                    DOM.liveBattery.textContent = 'N/A';
                    DOM.liveBattery.className = 'value';
                }
            });
    } else {
        if (DOM.liveBattery) {
            DOM.liveBattery.textContent = 'N/A';
            DOM.liveBattery.className = 'value';
        }
    }
    
    if (DOM.liveDevice) {
        DOM.liveDevice.textContent = /Android/i.test(navigator.userAgent) ? 'Android' :
            /iPhone|iPad/i.test(navigator.userAgent) ? 'iOS' : 'Desktop';
    }
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(pos) {
                if (DOM.liveLocation) {
                    DOM.liveLocation.textContent = pos.coords.latitude.toFixed(2) + ', ' + pos.coords.longitude.toFixed(2);
                }
            },
            function() {
                if (DOM.liveLocation) DOM.liveLocation.textContent = 'N/A';
            }, { timeout: 5000, maximumAge: 60000 }
        );
    } else {
        if (DOM.liveLocation) DOM.liveLocation.textContent = 'N/A';
    }
}

// ============================================
// RESET
// ============================================
function resetSearch() {
    hideAllScreens();
    stopWebcam();
    dedicationMessage = '';
    if (DOM.searchArea) DOM.searchArea.style.display = 'flex';
    if (DOM.friendSearch) {
        DOM.friendSearch.value = '';
        DOM.friendSearch.focus();
    }
    if (DOM.voiceBtn) DOM.voiceBtn.classList.remove('listening');
    if (DOM.voiceStatus) DOM.voiceStatus.classList.remove('show');
    currentFriend = null;
    capturedPhotoData = null;
    isDatabaseFriend = false;
}

// ============================================
// HIDE ALL SCREENS
// ============================================
function hideAllScreens() {
    if (DOM.photoScreen) DOM.photoScreen.style.display = 'none';
    if (DOM.foundScreen) DOM.foundScreen.style.display = 'none';
    if (DOM.newFriendScreen) DOM.newFriendScreen.style.display = 'none';
    if (DOM.detailsScreen) DOM.detailsScreen.style.display = 'none';
    if (DOM.niceMessage) DOM.niceMessage.style.display = 'none';
    if (DOM.messageModal) DOM.messageModal.classList.remove('show');
}

// ============================================
// UTILITY: ALERT
// ============================================
function showAlert(message) {
    alert(message);
}

// ============================================
// INIT ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    init();
});
