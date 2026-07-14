// ============================================
// FRIENDS CORNER — PROFESSIONAL JS (FINAL)
// Version: 14.0 | Simple Certificate | Mobile Friendly
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
    liveDate: document.getElementById('liveDate'),
    liveTime: document.getElementById('liveTime'),
    liveYear: document.getElementById('liveYear'),
    liveBattery: document.getElementById('liveBattery'),
    liveDevice: document.getElementById('liveDevice'),
    liveLocation: document.getElementById('liveLocation'),
    confettiContainer: document.getElementById('confettiContainer')
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
    
    loadJSPDF();
    console.log('Friends Corner initialized successfully!');
    console.log(friendsData.length + ' friends in database');
}

// ============================================
// STEP 1: SEARCH FRIEND
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
// VOICE SEARCH
// ============================================
function toggleVoiceSearch() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Voice search not supported. Please use Chrome or Edge.');
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
            DOM.voiceStatus.textContent = 'Listening... Speak name';
        }
    };
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.trim();
        if (DOM.friendSearch) DOM.friendSearch.value = transcript;
        if (DOM.voiceStatus) {
            DOM.voiceStatus.textContent = 'Heard: "' + transcript + '" — Searching...';
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
            DOM.voiceStatus.textContent = 'Could not hear. Try again.';
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
        alert('Camera not active! Please allow camera access.');
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
    if (DOM.displaySchoolClass) DOM.displaySchoolClass.textContent = 'School: ' + (currentFriend.school || '') + ' — Since Class ' + (currentFriend.sinceClass || '');
    
    updateTimeline('details');
    updateLiveStats();
}

// ============================================
// FRIEND CARD DOWNLOAD
// ============================================
function downloadNewFriendCard() {
    if (!capturedPhotoData) {
        alert('No photo captured! Please capture photo first.');
        return;
    }
    generateFriendCardPDF(false);
}

function downloadFriendCard() {
    if (!capturedPhotoData) {
        alert('No photo captured! Please capture photo first.');
        return;
    }
    generateFriendCardPDF(true);
}

// ============================================
// FRIEND CARD PDF — SIMPLE CERTIFICATE (Mobile Friendly)
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
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    const signImg = new Image();
    signImg.crossOrigin = 'anonymous';
    
    let photoLoaded = false;
    let signLoaded = false;
    
    img.onload = function() {
        photoLoaded = true;
        if (signLoaded || !signImg.src) generatePDF();
    };
    
    img.onerror = function() {
        alert('Photo load error! Please capture photo again.');
    };
    
    signImg.onload = function() {
        signLoaded = true;
        if (photoLoaded) generatePDF();
    };
    
    signImg.onerror = function() {
        signLoaded = true;
        if (photoLoaded) generatePDF();
    };
    
    function generatePDF() {
        const jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
        const pdf = new jsPDF('l', 'mm', 'a4');
        const pw = 297;
        const ph = 210;
        
      // ---- BACKGROUND: Dark Navy ----
        pdf.setFillColor('#ffffff');
        pdf.rect(0, 0, pw, ph, 'F');
        
// ---- BORDER: Top ----
pdf.setDrawColor('#00d9ff');
pdf.setLineWidth(2);
pdf.line(5, 5, pw - 5, 5);

pdf.setDrawColor('#7c3aed');
pdf.setLineWidth(1);
pdf.line(10, 10, pw - 10, 10);

// ---- BORDER: Bottom ----
pdf.setDrawColor('#00d9ff');
pdf.setLineWidth(2);
pdf.line(5, ph - 5, pw - 5, ph - 5);

pdf.setDrawColor('#7c3aed');
pdf.setLineWidth(1);
pdf.line(10, ph - 10, pw - 10, ph - 10);

// ---- BORDER: Left ----
pdf.setDrawColor('#00d9ff');
pdf.setLineWidth(2);
pdf.line(5, 5, 5, ph - 5);

pdf.setDrawColor('#7c3aed');
pdf.setLineWidth(1);
pdf.line(10, 10, 10, ph - 10);

// ---- BORDER: Right ----
pdf.setDrawColor('#00d9ff');
pdf.setLineWidth(2);
pdf.line(pw - 5, 5, pw - 5, ph - 5);

pdf.setDrawColor('#7c3aed');
pdf.setLineWidth(1);
pdf.line(pw - 10, 10, pw - 10, ph - 10);
        
        // ---- HEADER ----
        pdf.setTextColor('#DAA520');
        pdf.setFontSize(28);
        pdf.setFont(undefined, 'bold');
        pdf.text('RAVI RAJ', 15, 28);
        
        pdf.setTextColor('#333333');
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'normal');
        pdf.text('OFFICIAL FRIEND CARD', 15, 36);
        
        pdf.setTextColor('#999999');
        pdf.setFontSize(9);
        pdf.text('Certificate ID: FR-2026-001', pw - 15, 28, { align: 'right' });
        
        pdf.setDrawColor('#DAA520');
        pdf.setLineWidth(0.5);
        pdf.line(15, 42, pw - 15, 42);
        
        // ---- PHOTO (Left Side) ----
        const cx = 55;
        const cy = 100;
        const size = 44;
        
        pdf.setDrawColor('#DAA520');
        pdf.setLineWidth(2);
        pdf.rect(cx - size/2, cy - size/2, size, size);
        
        if (img.src && img.src !== '' && img.width > 0) {
            try {
                pdf.addImage(img, 'PNG', cx - size/2 + 1, cy - size/2 + 1, size - 2, size - 2);
            } catch(e) {}
        }
        
        pdf.setTextColor('#999999');
        pdf.setFontSize(8);
        pdf.text('LIVE PHOTO', cx, cy + size/2 + 6, { align: 'center' });
        
        // ---- FRIEND INFO (Right Side) ----
        let xPos = 110;
        let yPos = 72;
        
        pdf.setTextColor('#DAA520');
        pdf.setFontSize(24);
        pdf.setFont(undefined, 'bold');
        pdf.text(currentFriend.firstName ? currentFriend.firstName.toUpperCase() : 'FRIEND', xPos, yPos);
        yPos += 12;
        
        if (isDBFriend && currentFriend.connection) {
            pdf.setTextColor('#333333');
            pdf.setFontSize(14);
            pdf.setFont(undefined, 'normal');
            pdf.text(currentFriend.connection, xPos, yPos);
            yPos += 10;
        }
        
        if (isDBFriend && currentFriend.tag) {
            pdf.setTextColor('#7c3aed');
            pdf.setFontSize(11);
            pdf.setFont(undefined, 'italic');
            pdf.text('"' + currentFriend.tag + '"', xPos, yPos);
            yPos += 14;
        } else {
            yPos += 6;
        }
        
        pdf.setDrawColor('#cccccc');
        pdf.setLineWidth(0.3);
        pdf.line(xPos, yPos, pw - 20, yPos);
        yPos += 8;
        
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        pdf.setTextColor('#888888');
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        pdf.text('Issued on: ' + dateStr, xPos, yPos);
        yPos += 8;
        pdf.text('Location: Begusarai, Bihar, India', xPos, yPos);
        
        // ---- CERTIFICATE TEXT ----
        const certY = 150;
        pdf.setDrawColor('#DAA520');
        pdf.setLineWidth(0.3);
        pdf.line(30, certY, pw - 30, certY);
        
        pdf.setTextColor('#444444');
        pdf.setFontSize(11);
        pdf.setFont(undefined, 'italic');
        const certText1 = 'This is to certify that the above person is a verified friend of Ravi Raj.';
        const certText2 = 'This certificate is issued on ' + dateStr + ' at Begusarai, Bihar, India.';
        pdf.text(certText1, pw/2, certY + 10, { align: 'center' });
        pdf.text(certText2, pw/2, certY + 20, { align: 'center' });
        
        // ---- SIGNATURE ----
        const signY = 178;
        const signX = pw - 60;
        
        pdf.setDrawColor('#DAA520');
        pdf.setLineWidth(0.5);
        pdf.line(signX - 40, signY, signX + 40, signY);
        
        if (signImg.src && signImg.src !== '' && signImg.width > 0) {
            const sW = 40;
            const sH = (signImg.height / signImg.width) * sW;
            try {
                pdf.addImage(signImg, 'PNG', signX - sW/2, signY - sH - 2, sW, sH);
            } catch(e) {}
        }
        
        pdf.setTextColor('#333333');
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text('Ravi Raj', signX, signY + 8, { align: 'center' });
        pdf.setTextColor('#666666');
        pdf.setFontSize(9);
        pdf.setFont(undefined, 'normal');
        pdf.text('Founder, Friends Corner', signX, signY + 16, { align: 'center' });
        
        // ---- FOOTER ----
        pdf.setTextColor('#999999');
        pdf.setFontSize(7);
        pdf.text('© 2026 Ravi Raj · All Rights Reserved', 15, ph - 15);
        
        // ---- SAVE ----
        pdf.save('FriendCard-' + (currentFriend.firstName || 'Friend') + '.pdf');
    }
    
    img.src = capturedPhotoData;
    signImg.src = 'signature.jpg';
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
}

// ============================================
// INIT ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    init();
});
