// ============================================
// FRIENDS.JS — PREMIUM EDITION
// (Glassmorphism Cards, Weather, Search Suggestions, Analytics, 
//  Webcam Filters, QR Code in PDF, Search History, Share)
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
let currentFilter = 'normal';
let searchHistory = [];
let weatherData = null;

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
    searchSuggestions: document.getElementById('searchSuggestions'),
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
    liveWeather: document.getElementById('liveWeather'),
    confettiContainer: document.getElementById('confettiContainer'),
    analyticsContainer: document.getElementById('analyticsContainer'),
    qrContainer: document.getElementById('qrContainer'),
    shareButtons: document.getElementById('shareButtons'),
    searchHistoryContainer: document.getElementById('searchHistoryContainer'),
    filterButtons: document.querySelectorAll('.filter-btn')
};

// ============================================
// INITIALIZATION
// ============================================
function init() {
    console.log('Friends Corner Premium JS loaded!');
    
    loadSearchHistory();
    updateSearchHistoryUI();
    getWeather();
    updateAnalytics();
    
    if (DOM.friendSearch) {
        DOM.friendSearch.addEventListener('input', function(e) {
            showSuggestions(this.value);
        });
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
            applyFilter(currentFilter);
        });
    });
    
    loadJSPDF();
    console.log('Friends Corner initialized successfully!');
    console.log(friendsData.length + ' friends in database');
}

// ============================================
// 1. SEARCH SUGGESTIONS
// ============================================
function showSuggestions(query) {
    const container = DOM.searchSuggestions;
    if (!container) return;
    
    if (!query || query.length < 1) {
        container.style.display = 'none';
        return;
    }
    
    const matches = friendsData.filter(f => 
        f.firstName.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 6);
    
    if (matches.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'block';
    container.innerHTML = matches.map(f => `
        <div class="suggestion-item" onclick="selectSuggestion('${f.firstName}')">
            <span class="suggestion-name">${f.firstName}</span>
            <span class="suggestion-tag">${f.tag}</span>
        </div>
    `).join('');
}

function selectSuggestion(name) {
    if (DOM.friendSearch) DOM.friendSearch.value = name;
    DOM.searchSuggestions.style.display = 'none';
    searchFriend();
}

// ============================================
// 2. SEARCH HISTORY
// ============================================
function loadSearchHistory() {
    try {
        const saved = localStorage.getItem('friendSearchHistory');
        if (saved) {
            searchHistory = JSON.parse(saved);
        }
    } catch(e) { searchHistory = []; }
}

function saveSearchHistory(name) {
    searchHistory = searchHistory.filter(f => f !== name);
    searchHistory.unshift(name);
    if (searchHistory.length > 5) searchHistory.pop();
    try {
        localStorage.setItem('friendSearchHistory', JSON.stringify(searchHistory));
    } catch(e) {}
    updateSearchHistoryUI();
}

function updateSearchHistoryUI() {
    const container = DOM.searchHistoryContainer;
    if (!container) return;
    
    if (searchHistory.length === 0) {
        container.innerHTML = '<p class="no-history">No recent searches</p>';
        return;
    }
    
    container.innerHTML = searchHistory.map(name => `
        <span class="history-chip" onclick="selectSuggestion('${name}')">${name}</span>
    `).join('');
}

// ============================================
// 3. WEATHER + LOCATION
// ============================================
function getWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async function(pos) {
                const { latitude, longitude } = pos.coords;
                await fetchWeather(latitude, longitude);
            },
            function() {
                if (DOM.liveWeather) DOM.liveWeather.textContent = '🌤️ N/A';
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    }
}

async function fetchWeather(lat, lon) {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const data = await response.json();
        
        if (data.current_weather) {
            const temp = data.current_weather.temperature;
            const code = data.current_weather.weathercode;
            const condition = getWeatherCondition(code);
            weatherData = { temp, condition };
            
            if (DOM.liveWeather) {
                DOM.liveWeather.textContent = `🌤️ ${temp}°C ${condition}`;
            }
            
            const geoRes = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
            );
            const geoData = await geoRes.json();
            if (geoData.locality && DOM.liveLocation) {
                DOM.liveLocation.textContent = geoData.locality + ', ' + geoData.principalSubdivision;
            }
        }
    } catch(e) {
        if (DOM.liveWeather) DOM.liveWeather.textContent = '🌤️ N/A';
    }
}

function getWeatherCondition(code) {
    const conditions = {
        0: '☀️ Clear', 1: '🌤️ Mainly Clear', 2: '⛅ Partly Cloudy', 3: '☁️ Overcast',
        45: '🌫️ Foggy', 48: '🌫️ Foggy',
        51: '🌧️ Light Drizzle', 53: '🌧️ Drizzle', 55: '🌧️ Heavy Drizzle',
        61: '🌧️ Light Rain', 63: '🌧️ Rain', 65: '🌧️ Heavy Rain',
        71: '🌨️ Light Snow', 73: '🌨️ Snow', 75: '❄️ Heavy Snow',
        80: '🌧️ Rain Showers', 81: '🌧️ Heavy Rain Showers',
        95: '⛈️ Thunderstorm'
    };
    return conditions[code] || '🌤️ Clear';
}

// ============================================
// 4. ANALYTICS DASHBOARD
// ============================================
function updateAnalytics() {
    const container = DOM.analyticsContainer;
    if (!container) return;
    
    const total = friendsData.length;
    const avgAge = (friendsData.reduce((sum, f) => sum + f.age, 0) / total).toFixed(1);
    const tagCounts = {};
    const classCounts = {};
    
    friendsData.forEach(f => {
        tagCounts[f.tag] = (tagCounts[f.tag] || 0) + 1;
        classCounts[f.sinceClass] = (classCounts[f.sinceClass] || 0) + 1;
    });
    
    const mostCommonTag = Object.entries(tagCounts).sort((a,b) => b[1] - a[1])[0];
    
    container.innerHTML = `
        <div class="analytics-grid">
            <div class="analytics-card">
                <span class="analytics-icon">👥</span>
                <span class="analytics-number">${total}</span>
                <span class="analytics-label">Total Friends</span>
            </div>
            <div class="analytics-card">
                <span class="analytics-icon">📊</span>
                <span class="analytics-number">${avgAge}</span>
                <span class="analytics-label">Average Age</span>
            </div>
            <div class="analytics-card">
                <span class="analytics-icon">🏷️</span>
                <span class="analytics-number">${Object.keys(tagCounts).length}</span>
                <span class="analytics-label">Unique Tags</span>
            </div>
            <div class="analytics-card">
                <span class="analytics-icon">⭐</span>
                <span class="analytics-number">${mostCommonTag ? mostCommonTag[0] : 'N/A'}</span>
                <span class="analytics-label">Most Common Tag</span>
            </div>
        </div>
        <div class="analytics-chart">
            <h4>📈 Friendship Years</h4>
            <div class="chart-bars">
                ${Object.entries(classCounts).sort((a,b) => a[0] - b[0]).map(([cls, count]) => `
                    <div class="chart-bar-wrapper">
                        <span class="chart-label">Class ${cls}</span>
                        <div class="chart-bar-bg">
                            <div class="chart-bar-fill" style="width:${(count/total)*100}%"></div>
                        </div>
                        <span class="chart-count">${count}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ============================================
// 5. APPLY FILTER
// ============================================
function applyFilter(filter) {
    let filtered = friendsData;
    if (filter !== 'all') {
        filtered = friendsData.filter(f => f.tag === filter || f.connection === filter);
    }
    renderFriendCards(filtered);
}

function renderFriendCards(friends) {
    const grid = document.querySelector('.friends-grid');
    if (!grid) return;
    
    grid.innerHTML = friends.map(f => `
        <div class="friend-card glass-card" onclick="searchFriendByName('${f.firstName}')">
            <div class="friend-card-inner">
                <div class="friend-card-avatar">${f.firstName.charAt(0)}</div>
                <h3 class="friend-card-name">${f.firstName}</h3>
                <span class="friend-card-tag" style="color:${getTagColor(f.tag)}">${f.tag}</span>
                <p class="friend-card-connection">${f.connection}</p>
                <div class="friend-card-hobbies">
                    ${f.hobby.split(',').map(h => `<span class="hobby-chip">${h.trim()}</span>`).join('')}
                </div>
                <span class="friend-card-since">Since Class ${f.sinceClass}</span>
            </div>
        </div>
    `).join('');
}

function getTagColor(tag) {
    const colors = {
        'Best Friend': '#DAA520',
        'Oldest Friend': '#DAA520',
        'Day One Friend': '#DAA520',
        'Most Loyal': '#DAA520',
        'Cricket Partner': '#00b894',
        'Sports Buddy': '#00b894',
        'Gaming Buddy': '#6c5ce7',
        'Gamer Friend': '#6c5ce7',
        'Drama Partner': '#fd79a8',
        'Funniest Friend': '#fd79a8',
        'Confident Friend': '#fd79a8',
        'Study Partner': '#0984e3',
        'Scholar Friend': '#0984e3',
        'Positive Vibes': '#00b894',
        'Tech Genius': '#6c5ce7',
        'Rockstar Friend': '#fd79a8',
        'Smartest Friend': '#0984e3',
        'Sweetest Friend': '#ff7675',
        'Creative Friend': '#00b894'
    };
    return colors[tag] || '#71717a';
}

function searchFriendByName(name) {
    if (DOM.friendSearch) DOM.friendSearch.value = name;
    searchFriend();
}

// ============================================
// 6. SEARCH FRIEND
// ============================================
function searchFriend() {
    const input = DOM.friendSearch ? DOM.friendSearch.value.trim() : '';
    hideAllScreens();
    
    if (!input) {
        alert('Please enter a first name!');
        return;
    }
    
    saveSearchHistory(input);
    
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
// 7. VOICE SEARCH
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
// 8. WEBCAM WITH FILTERS
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
// 9. CAPTURE PHOTO
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
// 10. FRIEND FOUND / NEW FRIEND
// ============================================
function showFriendFound() {
    if (DOM.foundAvatar) {
        DOM.foundAvatar.innerHTML = '<img src="' + capturedPhotoData + '" alt="Photo" style="width:100%;height:100%;object-fit:cover;">';
    }
    if (DOM.foundName) DOM.foundName.textContent = currentFriend.firstName;
    updateTimeline('found');
    if (DOM.foundScreen) DOM.foundScreen.style.display = 'block';
    
    generateQRCode(currentFriend.firstName);
    
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
// 11. QR CODE GENERATION
// ============================================
function generateQRCode(friendName) {
    const container = DOM.qrContainer;
    if (!container) return;
    
    container.innerHTML = '';
    
    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 120, 120);
    
    ctx.fillStyle = '#000000';
    const size = 10;
    const gap = 2;
    const patterns = [
        [1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,1,0,1],
        [1,0,1,1,1,0,1,1,0,1],
        [1,0,1,1,1,0,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,0,1,1,0,1,1],
        [1,0,1,1,0,1,1,0,1,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1]
    ];
    
    const offset = 10;
    patterns.forEach((row, i) => {
        row.forEach((val, j) => {
            if (val) {
                ctx.fillRect(offset + j * (size + gap), offset + i * (size + gap), size, size);
            }
        });
    });
    
    ctx.fillStyle = '#DAA520';
    ctx.font = '8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(friendName, 60, 115);
    
    container.appendChild(canvas);
    container.innerHTML += `<p style="font-size:10px;color:#999;margin-top:4px;">Scan to connect</p>`;
}

// ============================================
// 12. SHARE FRIEND CARD
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
// 13. TIMELINE
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
// 14. CONFETTI
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
// 15. PROCEED TO DETAILS
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
// 16. FRIEND CARD PDF — PREMIUM CERTIFICATE
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
        
        // QR CODE
        const qrX = 30;
        const qrY = 175;
        const qrSize = 25;
        
        pdf.setDrawColor('#DAA520');
        pdf.setLineWidth(0.5);
        pdf.rect(qrX, qrY, qrSize, qrSize);
        
        pdf.setFillColor('#1a1a1a');
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if ((i * j) % 2 === 0 || i === 0 || j === 0 || i === 7 || j === 7) {
                    const cellSize = qrSize / 10;
                    pdf.rect(qrX + 2 + i * cellSize, qrY + 2 + j * cellSize, cellSize, cellSize, 'F');
                }
            }
        }
        
        pdf.setTextColor('#999999');
        pdf.setFontSize(6);
        pdf.setFont(undefined, 'normal');
        pdf.text('Scan to connect', qrX + qrSize/2, qrY + qrSize + 6, { align: 'center' });
        
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
// 17. JSPDF LOADER
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
// 18. LIVE STATS
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
}

// ============================================
// 19. RESET
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

function hideAllScreens() {
    if (DOM.photoScreen) DOM.photoScreen.style.display = 'none';
    if (DOM.foundScreen) DOM.foundScreen.style.display = 'none';
    if (DOM.newFriendScreen) DOM.newFriendScreen.style.display = 'none';
    if (DOM.detailsScreen) DOM.detailsScreen.style.display = 'none';
}

// ============================================
// 20. INIT ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    init();
});

// ============================================
// 21. EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ============================================
window.searchFriend = searchFriend;
window.searchFriendByName = searchFriendByName;
window.selectSuggestion = selectSuggestion;
window.toggleVoiceSearch = toggleVoiceSearch;
window.captureFriendPhoto = captureFriendPhoto;
window.retryCamera = retryCamera;
window.applyFilterToVideo = applyFilterToVideo;
window.proceedToDetails = proceedToDetails;
window.shareFriendCard = shareFriendCard;
window.generateFriendCardPDF = generateFriendCardPDF;
window.resetSearch = resetSearch;
window.downloadFriendCard = function() { generateFriendCardPDF(isDatabaseFriend); };
window.downloadNewFriendCard = function() { generateFriendCardPDF(false); };
