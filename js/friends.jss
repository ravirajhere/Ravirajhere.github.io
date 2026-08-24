// ============================================
// FRIENDS.JS — COMPLETE (html2canvas + jsPDF)
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
    console.log('✅ Friends Corner JS loaded!');
    
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
// GENERATE FRIEND CARD PDF (html2canvas + jsPDF)
// ============================================
function generateFriendCardPDF(isDBFriend) {
    console.log('📄 Generating Friend Card PDF...');
    
    if (!capturedPhotoData) {
        alert('❌ No photo captured! Please capture photo first.');
        return;
    }
    
    if (!currentFriend) {
        alert('❌ No friend found! Please search first.');
        return;
    }
    
    // Check libraries
    if (typeof html2canvas === 'undefined' || (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined')) {
        alert('⏳ Libraries loading... Please try again in 2 seconds.');
        loadLibraries(function() {
            setTimeout(function() {
                generateFriendCardPDF(isDBFriend);
            }, 500);
        });
        return;
    }
    
    // Create certificate HTML
    const certHTML = createCertificateHTML(isDBFriend);
    
    // Render to PDF
    renderCertificateToPDF(certHTML, isDBFriend);
}

// ============================================
// CREATE CERTIFICATE HTML
// ============================================
function createCertificateHTML(isDBFriend) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const friendName = currentFriend.firstName || 'Friend';
    
    return `
        <div id="certificate-container" style="
            width: 900px;
            padding: 50px 45px;
            background: #ffffff;
            border: 6px solid #DAA520;
            border-radius: 16px;
            text-align: center;
            font-family: 'Georgia', 'Times New Roman', serif;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15);
            position: relative;
        ">
            <!-- Watermark -->
            <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 100px;
                color: rgba(218, 165, 32, 0.04);
                font-weight: 700;
                letter-spacing: 10px;
                pointer-events: none;
            ">FRIENDS</div>
            
            <!-- Top Badge -->
            <div style="
                display: inline-block;
                background: #DAA520;
                color: #fff;
                padding: 4px 24px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 700;
                letter-spacing: 1.5px;
                margin-bottom: 12px;
            ">FRIENDS CORNER</div>
            
            <!-- Title -->
            <h1 style="
                font-size: 32px;
                font-weight: 700;
                color: #1a1a1a;
                margin-bottom: 6px;
                letter-spacing: 2px;
            ">CERTIFICATE OF FRIENDSHIP</h1>
            
            <div style="
                width: 100px;
                height: 2px;
                background: #DAA520;
                margin: 10px auto 25px auto;
            "></div>
            
            <!-- Photos Row -->
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 35px;
                margin-bottom: 20px;
            ">
                <!-- Ravi Raj Photo -->
                <div style="text-align: center;">
                    <div style="
                        width: 100px;
                        height: 100px;
                        border-radius: 50%;
                        border: 3px solid #DAA520;
                        overflow: hidden;
                        margin: 0 auto 6px;
                        box-shadow: 0 0 30px rgba(218, 165, 32, 0.15);
                    ">
                        <img src="assets/images/formal.jpg" alt="Ravi Raj" style="width:100%;height:100%;object-fit:cover;">
                    </div>
                    <div style="font-size: 13px; font-weight: 700; color: #DAA520;">RAVI RAJ</div>
                    <div style="font-size: 10px; color: #999;">Certificate Issuer</div>
                </div>
                
                <!-- Connected Badge -->
                <div style="text-align: center;">
                    <div style="
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                        background: #f8f6f3;
                        border: 2px solid #DAA520;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 28px;
                        margin: 0 auto 6px;
                    ">🤝</div>
                    <div style="font-size: 13px; font-weight: 700; color: #DAA520;">CONNECTED</div>
                </div>
                
                <!-- Friend Photo -->
                <div style="text-align: center;">
                    <div style="
                        width: 100px;
                        height: 100px;
                        border-radius: 50%;
                        border: 3px solid #7c3aed;
                        overflow: hidden;
                        margin: 0 auto 6px;
                        box-shadow: 0 0 30px rgba(124, 58, 237, 0.15);
                    ">
                        <img src="${capturedPhotoData}" alt="Friend" style="width:100%;height:100%;object-fit:cover;">
                    </div>
                    <div style="font-size: 13px; font-weight: 700; color: #7c3aed;">${friendName.toUpperCase()}</div>
                    <div style="font-size: 10px; color: #999;">Verified Friend</div>
                </div>
            </div>
            
            <!-- Certificate Text -->
            <div style="
                border-top: 1px solid #eee;
                padding-top: 18px;
                margin-top: 6px;
            ">
                <p style="
                    font-size: 15px;
                    color: #333;
                    line-height: 1.8;
                    margin-bottom: 4px;
                ">This is to certify that the above person is a verified friend of <strong>Ravi Raj</strong>.</p>
                <p style="font-size: 15px; color: #333; line-height: 1.8;">Their friendship has been officially recognized and recorded.</p>
            </div>
            
            <!-- Details Row -->
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 18px;
                padding-top: 15px;
                border-top: 1px solid #eee;
                flex-wrap: wrap;
                gap: 10px;
            ">
                <div style="text-align: left; font-size: 12px; color: #666;">
                    <div><strong>Issued on:</strong> ${dateStr}</div>
                    <div><strong>Location:</strong> Begusarai, Bihar, India</div>
                    ${isDBFriend && currentFriend.tag ? `<div><strong>Tag:</strong> ${currentFriend.tag}</div>` : ''}
                </div>
                
                <div style="text-align: right;">
                    <div style="
                        width: 100px;
                        height: 35px;
                        margin: 0 auto 2px auto;
                    ">
                        <img src="assets/images/signature.jpg" alt="Signature" style="width:100%;height:100%;object-fit:contain;">
                    </div>
                    <div style="font-size: 13px; font-weight: 700; color: #1a1a1a;">Ravi Raj</div>
                    <div style="font-size: 10px; color: #999;">Founder, Friends Corner</div>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="
                margin-top: 18px;
                padding-top: 12px;
                border-top: 2px solid #DAA520;
                font-size: 11px;
                color: #999;
            ">
                © ${now.getFullYear()} Ravi Raj · All Rights Reserved
            </div>
        </div>
    `;
}

// ============================================
// RENDER CERTIFICATE TO PDF (html2canvas + jsPDF)
// ============================================
function renderCertificateToPDF(certHTML, isDBFriend) {
    console.log('🖼️ Rendering certificate to PDF...');
    
    // Create container
    const container = document.createElement('div');
    container.innerHTML = certHTML;
    container.style.cssText = `
        position: fixed;
        left: -9999px;
        top: -9999px;
        width: 900px;
        background: #ffffff;
        padding: 0;
        margin: 0;
    `;
    document.body.appendChild(container);
    
    // Wait for images to load
    setTimeout(function() {
        html2canvas(container, {
            scale: 1.8,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            width: 900,
            height: container.scrollHeight
        }).then(function(canvas) {
            // Remove container
            document.body.removeChild(container);
            
            // Create PDF
            const jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
            const pdf = new jsPDF('l', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const pdfWidth = 297;
            const pdfHeight = (canvas.height / canvas.width) * pdfWidth;
            
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('Friendship_Certificate_' + (currentFriend.firstName || 'Friend') + '.pdf');
            
            console.log('✅ PDF downloaded successfully!');
        }).catch(function(error) {
            console.error('❌ html2canvas error:', error);
            document.body.removeChild(container);
            alert('❌ PDF generation failed: ' + error.message);
        });
    }, 500);
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

console.log('✅ Friends Corner JS Loaded Successfully!');
