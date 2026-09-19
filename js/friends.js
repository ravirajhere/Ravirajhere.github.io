/* ==========================================================================
   FRIENDS CORNER — friends.js
   Search + Photo + Certificate + New friend request flow
   v4: Grid certificate · Normal webcam · Landscape · Seal
   Companion: friends.html · friends.css
   ========================================================================== */

(function () {
    'use strict';

    /* ======================================================================
       1. CONFIG
       ====================================================================== */
    const CONFIG = {
        maxSearchResults: 6,
        minSearchChars: 3,
        certificateFilename: 'Friendship_Certificate',
        signatureImage: 'assets/images/signature.jpg',
        issuerImage: 'assets/images/casual.jpg',
        sealImage: 'assets/favicon.png'
    };

    /* ======================================================================
       2. FRIENDS DATA
       ====================================================================== */
    const friendsData = [
        { firstName: 'Sitanashu', connection: 'Best Friend',      experience: "Friends since Class 1 — same bench, same lunch, same mischief. He taught me how to ride a bicycle. We still meet every Sunday to play cricket.", sinceClass: 1,  tag: 'Oldest Friend' },
        { firstName: 'Rohit',     connection: 'Best Friend',      experience: "Class 1 se saath — we've watched each other grow up. We started our coding journey together in Class 6. Partner in crime, always.", sinceClass: 1,  tag: 'Day One Friend' },
        { firstName: 'Suraj',     connection: 'Cricket Partner',  experience: "Played in the school cricket team — he hit the winning six in the final. The most aggressive batsman I've ever seen.", sinceClass: 6,  tag: 'Sports Buddy' },
        { firstName: 'Shresth',   connection: 'Gaming Buddy',     experience: "We played PUBG and Free Fire all night during lockdown. He taught me how to snipe. The most chill person I know.", sinceClass: 6,  tag: 'Gamer Friend' },
        { firstName: 'Ayush',     connection: 'Drama Partner',    experience: "We performed together at the school annual function — he forgot his lines and I saved him. He can dance, act, and make anyone laugh.", sinceClass: 6,  tag: 'Funniest Friend' },
        { firstName: 'Rishidev',  connection: 'Study Partner',    experience: "We sat together in Class 10, shared notes, and helped each other pass exams. The most disciplined person I know.", sinceClass: 6,  tag: 'Scholar Friend' },
        { firstName: 'Jigyasha',  connection: 'Classmate',        experience: "She sits next to me in class. We share notes, gossip, and laugh at bad jokes. The most positive person I've ever met.", sinceClass: 6,  tag: 'Positive Vibes' },
        { firstName: 'Sudhanshu', connection: 'Best Friend',      experience: "We grew up together, played cricket every evening, and copied each other's homework. The most loyal friend I have.", sinceClass: 7,  tag: 'Most Loyal' },
        { firstName: 'Priyam',    connection: 'Coding Buddy',     experience: "We learned HTML together in Class 6. He's the reason I started coding. Always coming up with creative solutions.", sinceClass: 8,  tag: 'Tech Genius' },
        { firstName: 'Harsh',     connection: 'Music Partner',    experience: "We started a band together in Class 9 — he plays guitar, I sing (badly). He practices six hours a day.", sinceClass: 8,  tag: 'Rockstar Friend' },
        { firstName: 'Keshav',    connection: 'Chess Rival',      experience: "We played chess every break. He beat me 20 times, I beat him once and celebrated. He calculates five moves ahead.", sinceClass: 9,  tag: 'Smartest Friend' },
        { firstName: 'Rani',      connection: 'Childhood Friend', experience: "Friends since we were five — she's like a sister to me. She knows all my secrets and still loves me. She bakes the best cakes.", sinceClass: 12, tag: 'Sweetest Friend' },
        { firstName: 'Sneha',     connection: 'Drama Partner',    experience: "We performed together at the school annual function — I forgot my lines but she saved me. The most confident person I know.", sinceClass: 12, tag: 'Confident Friend' },
        { firstName: 'Rohini',    connection: 'Art Partner',      experience: "We painted posters for school events together. She taught me how to draw. We've won several inter-school competitions together.", sinceClass: 12, tag: 'Creative Friend' }
    ];

    /* ======================================================================
       3. STATE
       ====================================================================== */
    const state = {
        currentFriend: null,
        capturedPhoto: null,
        stream: null,
        webcamActive: false,
        isDatabaseFriend: false,
        currentFilter: 'normal'
    };

    /* ======================================================================
       4. DOM REFS
       ====================================================================== */
    const $  = (sel, ctx) => (ctx || document).querySelector(sel);
    const $$ = (sel, ctx) => Array.prototype.slice.call((ctx || document).querySelectorAll(sel));

    const DOM = {
        searchArea:        $('#searchArea'),
        friendSearch:      $('#friendSearch'),
        searchClear:       $('#searchClear'),
        suggestionsList:   $('#suggestionsList'),

        photoScreen:       $('#photoScreen'),
        photoFriendName:   $('#photoFriendName'),
        webcamVideo:       $('#webcamVideo'),
        webcamPlaceholder: $('#webcamPlaceholder'),
        captureBtn:        $('#captureBtn'),
        photoUploadInput:  $('#photoUploadInput'),
        permissionDenied:  $('#permissionDenied'),
        permissionMessage: $('#permissionMessage'),

        foundScreen:       $('#foundScreen'),
        foundAvatar:       $('#foundAvatar'),
        foundName:         $('#foundName'),
        foundTag:          $('#foundTag'),
        timelineBar:       $('#timelineBar'),
        timelineText:      $('#timelineText'),

        newFriendScreen:   $('#newFriendScreen'),
        newFriendName:     $('#newFriendName'),

        detailsScreen:     $('#detailsScreen'),
        profileAvatar:     $('#profileAvatar'),
        displayName:       $('#displayName'),
        displayConnection: $('#displayConnection'),
        displayTag:        $('#displayTag'),
        displaySince:      $('#displaySince'),
        displayClass:      $('#displayClass'),
        displayYears:      $('#displayYears'),
        displayExperience: $('#displayExperience'),
        detailsTimelineBar:  $('#detailsTimelineBar'),
        detailsTimelineText: $('#detailsTimelineText'),

        confettiContainer: $('#confettiContainer')
    };

    /* ======================================================================
       5. UTILITIES
       ====================================================================== */
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = String(str == null ? '' : str);
        return div.innerHTML;
    }

    function yearsSinceClass(sinceClass) {
        const startYear = (function () {
            if (sinceClass <= 5) return 2013;
            if (sinceClass <= 10) return 2019;
            return 2024;
        })();
        return Math.max(0, 2026 - startYear);
    }

    function timelinePercent(years) {
        return Math.min((years / 14) * 100, 100);
    }

    function hideAllScreens() {
        [DOM.photoScreen, DOM.foundScreen, DOM.newFriendScreen, DOM.detailsScreen]
            .forEach(function (el) { if (el) el.hidden = true; });
    }

    function showScreen(el) {
        if (!el) return;
        hideAllScreens();
        el.hidden = false;
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /* ======================================================================
       6. SEARCH + SUGGESTIONS (min 3 chars)
       ====================================================================== */
    function openSuggestions(query) {
        if (!DOM.suggestionsList) return;

        const q = String(query || '').trim().toLowerCase();

        if (q.length < CONFIG.minSearchChars) {
            DOM.suggestionsList.hidden = true;
            DOM.suggestionsList.innerHTML = '';
            return;
        }

        const matches = friendsData
            .filter(function (f) {
                return f.firstName.toLowerCase().indexOf(q) !== -1;
            })
            .slice(0, CONFIG.maxSearchResults);

        if (matches.length === 0) {
            DOM.suggestionsList.innerHTML =
                '<li class="sg-empty">' +
                    'No friend found for "' + escapeHtml(query) + '" — press Enter to add as new.' +
                '</li>';
            DOM.suggestionsList.hidden = false;
            return;
        }

        DOM.suggestionsList.innerHTML = matches.map(function (f) {
            return (
                '<li role="option" data-name="' + escapeHtml(f.firstName) + '" tabindex="-1">' +
                    '<span class="sg-name">' + escapeHtml(f.firstName) + '</span>' +
                    '<span class="sg-meta">' + escapeHtml(f.connection) + ' · ' + escapeHtml(f.tag) + '</span>' +
                '</li>'
            );
        }).join('');

        DOM.suggestionsList.hidden = false;
    }

    function closeSuggestions() {
        if (!DOM.suggestionsList) return;
        DOM.suggestionsList.hidden = true;
        DOM.suggestionsList.innerHTML = '';
    }

    function onSuggestionClick(e) {
        const li = e.target.closest('li[data-name]');
        if (!li) return;
        const name = li.getAttribute('data-name');
        if (!name) return;
        if (DOM.friendSearch) DOM.friendSearch.value = name;
        closeSuggestions();
        searchFriend();
    }

    /* ======================================================================
       7. SEARCH FRIEND
       ====================================================================== */
    function searchFriend() {
        const input = DOM.friendSearch ? DOM.friendSearch.value.trim() : '';

        if (!input) {
            closeSuggestions();
            return;
        }

        const found = friendsData.find(function (f) {
            return f.firstName.toLowerCase() === input.toLowerCase();
        });

        if (found) {
            state.currentFriend = found;
            state.isDatabaseFriend = true;
        } else {
            state.currentFriend = {
                firstName: input,
                connection: 'New Friend',
                experience: '',
                sinceClass: 'new',
                tag: 'New Friend'
            };
            state.isDatabaseFriend = false;
        }

        closeSuggestions();

        if (DOM.photoFriendName) {
            DOM.photoFriendName.textContent = state.currentFriend.firstName;
        }

        showScreen(DOM.photoScreen);
        startWebcam();
    }

    /* ======================================================================
       8. WEBCAM (NORMAL — no mirror)
       ====================================================================== */
    async function startWebcam() {
        try {
            state.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            });

            if (DOM.webcamVideo) {
                DOM.webcamVideo.srcObject = state.stream;
                await DOM.webcamVideo.play();
            }
            state.webcamActive = true;

            if (DOM.webcamPlaceholder) DOM.webcamPlaceholder.style.display = 'none';
            if (DOM.permissionDenied) DOM.permissionDenied.hidden = true;
            if (DOM.captureBtn) DOM.captureBtn.disabled = false;
        } catch (err) {
            state.webcamActive = false;
            if (DOM.permissionDenied) DOM.permissionDenied.hidden = false;
            if (DOM.permissionMessage) {
                DOM.permissionMessage.textContent =
                    'Allow camera access, or upload a photo, or skip.';
            }
            if (DOM.captureBtn) DOM.captureBtn.disabled = true;
        }
    }

    function stopWebcam() {
        if (state.stream) {
            state.stream.getTracks().forEach(function (t) { t.stop(); });
            state.stream = null;
        }
        if (DOM.webcamVideo) DOM.webcamVideo.srcObject = null;
        state.webcamActive = false;
    }

    function retryCamera() {
        if (DOM.permissionDenied) DOM.permissionDenied.hidden = true;
        startWebcam();
    }

    function applyFilterToVideo(filter) {
        state.currentFilter = filter;
        const filters = {
            normal:   'none',
            bw:       'grayscale(100%)',
            sepia:    'sepia(100%)',
            vintage:  'sepia(50%) contrast(120%) brightness(90%)',
            portrait: 'contrast(105%) saturate(110%) brightness(102%)'
        };
        if (DOM.webcamVideo) {
            DOM.webcamVideo.style.filter = filters[filter] || 'none';
        }
        $$('.filter-btn').forEach(function (btn) {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
    }

    /* ======================================================================
       9. CAPTURE / UPLOAD / SKIP
       ====================================================================== */
    function captureFriendPhoto() {
        if (!state.webcamActive || !DOM.webcamVideo) return;

        const video = DOM.webcamVideo;
        const canvas = document.createElement('canvas');
        canvas.width  = video.videoWidth  || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext('2d');

        if (state.currentFilter !== 'normal') {
            ctx.filter = video.style.filter || 'none';
        }

        // Normal capture — no mirror, no flip.
        ctx.drawImage(video, 0, 0);

        state.capturedPhoto = canvas.toDataURL('image/jpeg', 0.92);
        stopWebcam();
        proceedAfterPhoto();
    }

    function uploadPhoto() {
        if (DOM.photoUploadInput) DOM.photoUploadInput.click();
    }

    function onPhotoUpload(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            showToast('Please choose an image file.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (ev) {
            state.capturedPhoto = ev.target.result;
            stopWebcam();
            proceedAfterPhoto();
        };
        reader.readAsDataURL(file);
    }

    function skipPhoto() {
        state.capturedPhoto = null;
        stopWebcam();
        proceedAfterPhoto();
    }

    function proceedAfterPhoto() {
        if (DOM.photoScreen) DOM.photoScreen.hidden = true;

        if (state.isDatabaseFriend) {
            showFriendFound();
        } else {
            showNewFriend();
        }
    }

    /* ======================================================================
       10. FRIEND FOUND / NEW FRIEND
       ====================================================================== */
    function avatarHtml(dataUrl) {
        if (dataUrl) {
            return '<img src="' + dataUrl + '" alt="" />';
        }
        return '<div class="avatar-placeholder" aria-hidden="true"></div>';
    }

    function showFriendFound() {
        if (DOM.foundAvatar) DOM.foundAvatar.innerHTML = avatarHtml(state.capturedPhoto);
        if (DOM.foundName)   DOM.foundName.textContent = state.currentFriend.firstName;
        if (DOM.foundTag)    DOM.foundTag.textContent = state.currentFriend.tag || 'Friend';

        updateTimeline('found');
        showScreen(DOM.foundScreen);
    }

    function updateTimeline(prefix) {
        if (!state.currentFriend || state.currentFriend.sinceClass === 'new') return;

        const years = yearsSinceClass(state.currentFriend.sinceClass);
        const percent = timelinePercent(years);

        const barId  = prefix === 'found' ? 'timelineBar' : 'detailsTimelineBar';
        const textId = prefix === 'found' ? 'timelineText' : 'detailsTimelineText';

        const bar  = document.getElementById(barId);
        const text = document.getElementById(textId);

        if (bar)  bar.style.width = percent + '%';
        if (text) text.textContent = 'Since Class ' + state.currentFriend.sinceClass + ' · ' + years + ' years of friendship';
    }

    function showNewFriend() {
        if (DOM.newFriendName) DOM.newFriendName.textContent = state.currentFriend.firstName;
        showScreen(DOM.newFriendScreen);
        launchConfetti();
    }

    function showTemporaryCertificate() {
        state.currentFriend = state.currentFriend || {
            firstName: 'Friend',
            connection: 'New Friend',
            tag: 'New Friend',
            sinceClass: 'new'
        };
        generateCertificate(true);
    }

    /* ======================================================================
       11. DETAILS SCREEN
       ====================================================================== */
    function proceedToDetails() {
        if (!state.currentFriend) return;

        if (DOM.profileAvatar) DOM.profileAvatar.innerHTML = avatarHtml(state.capturedPhoto);
        if (DOM.displayName)   DOM.displayName.textContent = state.currentFriend.firstName;
        if (DOM.displayConnection) DOM.displayConnection.textContent = state.currentFriend.connection || 'Friend';
        if (DOM.displayTag)    DOM.displayTag.textContent = state.currentFriend.tag || 'Friend';
        if (DOM.displayExperience) DOM.displayExperience.textContent = state.currentFriend.experience || 'A new friendship begins.';

        if (state.currentFriend.sinceClass === 'new') {
            if (DOM.displaySince) DOM.displaySince.textContent = '—';
            if (DOM.displayClass) DOM.displayClass.textContent = '—';
            if (DOM.displayYears) DOM.displayYears.textContent = '—';
        } else {
            const years = yearsSinceClass(state.currentFriend.sinceClass);
            if (DOM.displaySince) DOM.displaySince.textContent = 'Class ' + state.currentFriend.sinceClass;
            if (DOM.displayClass) DOM.displayClass.textContent = state.currentFriend.sinceClass;
            if (DOM.displayYears) DOM.displayYears.textContent = years + ' yrs';
        }

        updateTimeline('details');
        showScreen(DOM.detailsScreen);
    }

    /* ======================================================================
       12. RESET
       ====================================================================== */
    function resetSearch() {
        stopWebcam();
        hideAllScreens();

        if (DOM.searchArea) DOM.searchArea.hidden = false;
        if (DOM.friendSearch) {
            DOM.friendSearch.value = '';
            DOM.friendSearch.focus();
        }
        if (DOM.searchClear) DOM.searchClear.hidden = true;
        closeSuggestions();

        state.currentFriend = null;
        state.capturedPhoto = null;
        state.isDatabaseFriend = false;
    }

    /* ======================================================================
       13. CONFETTI
       ====================================================================== */
    function launchConfetti() {
        const container = DOM.confettiContainer;
        if (!container) return;

        container.innerHTML = '';

        const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff922b', '#a29bfe', '#ff69b4'];
        const COUNT = 60;

        for (let i = 0; i < COUNT; i++) {
            const piece = document.createElement('div');
            const size = 6 + Math.random() * 8;
            piece.style.cssText = [
                'position:absolute',
                'left:' + (Math.random() * 100) + '%',
                'top:-20px',
                'width:' + size + 'px',
                'height:' + size + 'px',
                'background:' + colors[Math.floor(Math.random() * colors.length)],
                'border-radius:' + (Math.random() > 0.5 ? '50%' : '2px'),
                'animation:confettiFall ' + (2.4 + Math.random() * 1.8) + 's linear forwards',
                'animation-delay:' + (Math.random() * 0.4) + 's'
            ].join(';');
            container.appendChild(piece);
        }

        if (!document.getElementById('confetti-style')) {
            const style = document.createElement('style');
            style.id = 'confetti-style';
            style.textContent = '@keyframes confettiFall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}';
            document.head.appendChild(style);
        }

        setTimeout(function () {
            if (container) container.innerHTML = '';
        }, 4500);
    }

    /* ======================================================================
       14. CERTIFICATE (LANDSCAPE — GRID LAYOUT)
       ====================================================================== */
    function loadCertificateLibraries() {
        const libs = [
            {
                test: function () { return typeof html2canvas !== 'undefined'; },
                src: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
            },
            {
                test: function () { return typeof window.jspdf !== 'undefined' || typeof window.jsPDF !== 'undefined'; },
                src: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
            }
        ];

        return Promise.all(libs.map(function (lib) {
            if (lib.test()) return Promise.resolve(true);
            return new Promise(function (resolve, reject) {
                const script = document.createElement('script');
                script.src = lib.src;
                script.onload = function () { resolve(true); };
                script.onerror = function () { reject(new Error('Failed: ' + lib.src)); };
                document.head.appendChild(script);
            });
        }));
    }

    async function generateCertificate(isTemporary) {
        if (!state.currentFriend) return;

        try {
            await loadCertificateLibraries();
        } catch (err) {
            console.error(err);
            showToast('Could not load certificate tools. Check connection.', 'error');
            return;
        }

        const container = document.createElement('div');
        container.innerHTML = buildCertificateHtml(isTemporary);
        container.style.cssText = [
            'position:fixed',
            'left:-99999px',
            'top:0',
            'width:297mm',
            'background:#ffffff',
            'padding:0',
            'margin:0'
        ].join(';');
        document.body.appendChild(container);

        const imgs = Array.prototype.slice.call(container.querySelectorAll('img'));
        await Promise.all(imgs.map(function (img) {
            if (img.complete) return Promise.resolve();
            return new Promise(function (r) {
                img.onload = img.onerror = function () { r(); };
            });
        }));

        await new Promise(function (r) { setTimeout(r, 200); });

        try {
            const canvas = await html2canvas(container, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false
            });

            if (container.parentNode) container.parentNode.removeChild(container);

            const jsPDFCtor = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
            const pdf = new jsPDFCtor({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.92);
            const pdfWidth  = 297;
            const pdfHeight = (canvas.height / canvas.width) * pdfWidth;

            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

            const filename = CONFIG.certificateFilename + '_' + (state.currentFriend.firstName || 'Friend') + (isTemporary ? '_Temp' : '') + '.pdf';
            pdf.save(filename);

            showToast('Certificate downloaded.', 'success');
        } catch (err) {
            console.error('Certificate failed:', err);
            if (container.parentNode) container.parentNode.removeChild(container);
            showToast('Could not generate certificate.', 'error');
        }
    }

    function buildCertificateHtml(isTemporary) {
        const friendName = escapeHtml((state.currentFriend.firstName || 'Friend'));
        const friendNameUpper = friendName.toUpperCase();
        const tag = escapeHtml(state.currentFriend.tag || (isTemporary ? 'New Friend' : 'Friend'));
        const connection = escapeHtml(state.currentFriend.connection || 'Friend');
        const friendPhoto = state.capturedPhoto || '';

        const now = new Date();
        const dateStr = now.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const years = state.currentFriend.sinceClass && state.currentFriend.sinceClass !== 'new'
            ? yearsSinceClass(state.currentFriend.sinceClass)
            : null;
        const sinceClass = state.currentFriend.sinceClass && state.currentFriend.sinceClass !== 'new'
            ? 'Class ' + state.currentFriend.sinceClass
            : '—';
        const yearsText = years !== null ? years + ' years' : '—';

        const friendPhotoHtml = friendPhoto
            ? '<img src="' + friendPhoto + '" alt="" style="width:100%;height:100%;object-fit:cover;">'
            : '<div style="color:#1f3a5f;font-size:52px;line-height:128px;text-align:center;font-family:Georgia,serif;font-weight:700;">' + (friendName.charAt(0) || 'F') + '</div>';

        const badgeText = isTemporary ? 'NEW FRIEND' : 'CONNECTED';
        const footerText = isTemporary
            ? 'A temporary certificate. Once Ravi adds your details, you receive the full one.'
            : 'Their friendship is hereby recognized and celebrated.';

        const quote = 'Baharon ko bhi naaz jis phool par tha, wahi phool humne chuna gulsita se. Aur wahi phool tum ho, mere dost.';

        // Landscape A4: 297mm x 210mm
        return (
            '<div style="' +
                'width:297mm;' +
                'height:210mm;' +
                'padding:14mm 18mm;' +
                'background:#fdfbf6;' +
                'font-family:Georgia,\'Times New Roman\',serif;' +
                'color:#1a1a1a;' +
                'box-sizing:border-box;' +
                'position:relative;' +
                'display:flex;' +
                'flex-direction:column;' +
                'border:3px double #b08d3f;' +
            '">' +

                /* Corner ornaments */
                '<div style="position:absolute;top:8mm;left:10mm;font-size:22px;color:#b08d3f;font-family:Georgia,serif;">&#10086;</div>' +
                '<div style="position:absolute;top:8mm;right:10mm;font-size:22px;color:#b08d3f;font-family:Georgia,serif;">&#10086;</div>' +
                '<div style="position:absolute;bottom:8mm;left:10mm;font-size:22px;color:#b08d3f;font-family:Georgia,serif;">&#10086;</div>' +
                '<div style="position:absolute;bottom:8mm;right:10mm;font-size:22px;color:#b08d3f;font-family:Georgia,serif;">&#10086;</div>' +

                /* Inner border */
                '<div style="position:absolute;top:12mm;left:14mm;right:14mm;bottom:12mm;border:1px solid #d9c78a;pointer-events:none;"></div>' +

                /* Top badge */
                '<div style="text-align:center;position:relative;z-index:1;margin-bottom:6px;">' +
                    '<span style="' +
                        'display:inline-block;' +
                        'background:#b08d3f;' +
                        'color:#ffffff;' +
                        'padding:5px 26px;' +
                        'border-radius:20px;' +
                        'font-size:10px;' +
                        'font-weight:700;' +
                        'letter-spacing:4px;' +
                        'font-family:Arial,sans-serif;' +
                    '">FRIENDS CORNER</span>' +
                '</div>' +

                /* Title */
                '<h1 style="' +
                    'text-align:center;' +
                    'font-size:34px;' +
                    'letter-spacing:6px;' +
                    'font-weight:700;' +
                    'margin:4px 0 6px 0;' +
                    'font-family:Georgia,serif;' +
                    'color:#1a1a1a;' +
                    'position:relative;' +
                    'z-index:1;' +
                '">CERTIFICATE OF FRIENDSHIP</h1>' +

                '<div style="width:120px;height:2px;background:#b08d3f;margin:0 auto 18px auto;position:relative;z-index:1;"></div>' +

                /* 3-column grid: issuer | badge | friend */
                '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;align-items:flex-start;margin-bottom:18px;position:relative;z-index:1;">' +

                    /* Left: Issuer */
                    '<div style="text-align:center;">' +
                        '<div style="font-size:9px;font-weight:700;color:#8a6f2a;letter-spacing:3px;font-family:Arial,sans-serif;margin-bottom:10px;">ISSUER</div>' +
                        '<div style="' +
                            'width:100px;height:100px;' +
                            'border-radius:50%;' +
                            'border:3px solid #b08d3f;' +
                            'overflow:hidden;' +
                            'margin:0 auto 10px auto;' +
                            'background:#f5f5f5;' +
                            'box-shadow:0 4px 12px rgba(176,141,63,0.25);' +
                        '">' +
                            '<img src="' + CONFIG.issuerImage + '" alt="" style="width:100%;height:100%;object-fit:cover;">' +
                        '</div>' +
                        '<div style="font-size:15px;font-weight:700;color:#b08d3f;letter-spacing:2px;">RAVI RAJ</div>' +
                        '<div style="font-size:10px;color:#888;margin-top:3px;font-style:italic;">Friends Corner</div>' +
                    '</div>' +

                    /* Center: Badge */
                    '<div style="text-align:center;padding-top:30px;">' +
                        '<div style="' +
                            'width:70px;height:70px;' +
                            'border-radius:50%;' +
                            'background:#b08d3f;' +
                            'display:flex;align-items:center;justify-content:center;' +
                            'margin:0 auto 10px auto;' +
                            'color:#ffffff;' +
                            'font-size:32px;' +
                            'font-family:Arial,sans-serif;' +
                            'box-shadow:0 6px 20px rgba(176,141,63,0.4);' +
                        '">&#10003;</div>' +
                        '<div style="font-size:12px;font-weight:700;color:#b08d3f;letter-spacing:3px;">' + badgeText + '</div>' +
                    '</div>' +

                    /* Right: Friend */
                    '<div style="text-align:center;">' +
                        '<div style="font-size:9px;font-weight:700;color:#1f3a5f;letter-spacing:3px;font-family:Arial,sans-serif;margin-bottom:10px;">RECIPIENT</div>' +
                        '<div style="' +
                            'width:100px;height:100px;' +
                            'border-radius:50%;' +
                            'border:3px solid #1f3a5f;' +
                            'overflow:hidden;' +
                            'margin:0 auto 10px auto;' +
                            'background:#f5f5f5;' +
                            'box-shadow:0 4px 12px rgba(31,58,95,0.25);' +
                        '">' + friendPhotoHtml + '</div>' +
                        '<div style="font-size:15px;font-weight:700;color:#1f3a5f;letter-spacing:2px;">' + friendNameUpper + '</div>' +
                        '<div style="font-size:10px;color:#888;margin-top:3px;font-style:italic;">' + connection + '</div>' +
                    '</div>' +

                '</div>' +

                /* Paragraph */
                '<p style="' +
                    'text-align:center;' +
                    'font-size:15px;' +
                    'line-height:1.75;' +
                    'color:#333;' +
                    'margin:6px auto 12px auto;' +
                    'max-width:640px;' +
                    'position:relative;' +
                    'z-index:1;' +
                '">' +
                    'This certificate celebrates the friendship between <strong>Ravi Raj</strong> and <strong>' + friendName + '</strong>. ' +
                    footerText +
                '</p>' +

                /* Quote with ornaments */
                '<div style="text-align:center;margin:6px auto 14px auto;position:relative;z-index:1;">' +
                    '<div style="font-size:14px;color:#b08d3f;letter-spacing:12px;margin-bottom:4px;">&#10086; &#10087; &#10086;</div>' +
                    '<p style="' +
                        'font-style:italic;' +
                        'font-size:14px;' +
                        'line-height:1.7;' +
                        'color:#4a423c;' +
                        'margin:0 auto;' +
                        'max-width:620px;' +
                        'font-family:Georgia,serif;' +
                    '">' +
                        '&ldquo;' + quote + '&rdquo;' +
                    '</p>' +
                '</div>' +

                /* Bottom: details | signature | seal */
                '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;align-items:end;margin-top:auto;position:relative;z-index:1;">' +

                    /* Details */
                    '<div style="font-size:10px;color:#555;line-height:1.9;font-family:Arial,sans-serif;">' +
                        '<div><strong style="color:#1a1a1a;">Issued on:</strong> ' + dateStr + '</div>' +
                        '<div><strong style="color:#1a1a1a;">Tag:</strong> ' + tag + '</div>' +
                        '<div><strong style="color:#1a1a1a;">Since:</strong> ' + sinceClass + '</div>' +
                        '<div><strong style="color:#1a1a1a;">Friendship:</strong> ' + yearsText + '</div>' +
                    '</div>' +

                    /* Signature (center) */
                    '<div style="text-align:center;">' +
                        '<img src="' + CONFIG.signatureImage + '" alt="Signature" style="width:140px;height:auto;display:block;margin:0 auto 4px auto;">' +
                        '<div style="width:120px;height:1px;background:#1a1a1a;margin:0 auto 4px auto;"></div>' +
                        '<div style="font-size:12px;font-weight:700;color:#1a1a1a;">Ravi Raj</div>' +
                        '<div style="font-size:9px;color:#888;letter-spacing:1px;">Founder, Friends Corner</div>' +
                    '</div>' +

                    /* Seal (favicon) */
                    '<div style="text-align:right;">' +
                        '<div style="' +
                            'width:80px;height:80px;' +
                            'border-radius:50%;' +
                            'border:2px solid #b08d3f;' +
                            'overflow:hidden;' +
                            'margin:0 0 0 auto;' +
                            'background:#ffffff;' +
                            'display:flex;align-items:center;justify-content:center;' +
                            'padding:6px;' +
                            'box-sizing:border-box;' +
                        '">' +
                            '<img src="' + CONFIG.sealImage + '" alt="Seal" style="max-width:100%;max-height:100%;object-fit:contain;">' +
                        '</div>' +
                        '<div style="font-size:8px;color:#888;letter-spacing:1px;margin-top:4px;font-family:Arial,sans-serif;">OFFICIAL SEAL</div>' +
                    '</div>' +

                '</div>' +

                /* Footer line */
                '<div style="width:100%;height:1px;background:#d9c78a;margin:12px 0 6px 0;position:relative;z-index:1;"></div>' +
                '<div style="text-align:center;font-size:8px;color:#999;letter-spacing:2px;font-family:Arial,sans-serif;position:relative;z-index:1;">' +
                    '&copy; 2026 Ravi Raj &middot; All Rights Reserved &middot; friends-corner' +
                '</div>' +

            '</div>'
        );
    }

    /* ======================================================================
       15. TOAST
       ====================================================================== */
    function showToast(message, type) {
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.style.cssText = [
                'position:fixed',
                'left:50%',
                'bottom:28px',
                'transform:translateX(-50%) translateY(12px)',
                'background:#1a1a24',
                'color:#ffffff',
                'padding:12px 20px',
                'border-radius:8px',
                'font-family:Inter,system-ui,sans-serif',
                'font-size:13px',
                'box-shadow:0 8px 24px rgba(0,0,0,0.18)',
                'opacity:0',
                'pointer-events:none',
                'transition:opacity .25s ease, transform .25s ease',
                'z-index:99999'
            ].join(';');
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        if (type === 'error') toast.style.background = '#dc2626';
        else if (type === 'success') toast.style.background = '#16a34a';
        else toast.style.background = '#1a1a24';

        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';

        clearTimeout(window._friendToastTimer);
        window._friendToastTimer = setTimeout(function () {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(12px)';
        }, 2600);
    }

    /* ======================================================================
       16. INIT
       ====================================================================== */
    function init() {
        if (DOM.friendSearch) {
            DOM.friendSearch.addEventListener('input', function (e) {
                if (DOM.searchClear) DOM.searchClear.hidden = !e.target.value;
                openSuggestions(e.target.value);
            });

            DOM.friendSearch.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    searchFriend();
                } else if (e.key === 'Escape') {
                    closeSuggestions();
                }
            });

            DOM.friendSearch.addEventListener('focus', function () {
                if (DOM.friendSearch.value.trim().length >= CONFIG.minSearchChars) {
                    openSuggestions(DOM.friendSearch.value);
                }
            });
        }

        if (DOM.suggestionsList) {
            DOM.suggestionsList.addEventListener('click', onSuggestionClick);
        }

        if (DOM.searchClear) {
            DOM.searchClear.addEventListener('click', function () {
                if (DOM.friendSearch) {
                    DOM.friendSearch.value = '';
                    DOM.friendSearch.focus();
                }
                DOM.searchClear.hidden = true;
                closeSuggestions();
            });
        }

        document.addEventListener('click', function (e) {
            if (!e.target.closest('#searchArea')) {
                closeSuggestions();
            }
        });

        if (DOM.photoUploadInput) {
            DOM.photoUploadInput.addEventListener('change', onPhotoUpload);
        }

        $$('.filter-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                applyFilterToVideo(btn.dataset.filter);
            });
        });

        console.log('✅ friends.js v4 loaded — ' + friendsData.length + ' friends · grid certificate');
    }

    /* ======================================================================
       17. PUBLIC API
       ====================================================================== */
    window.searchFriend = searchFriend;
    window.resetSearch = resetSearch;
    window.captureFriendPhoto = captureFriendPhoto;
    window.uploadPhoto = uploadPhoto;
    window.skipPhoto = skipPhoto;
    window.applyFilterToVideo = applyFilterToVideo;
    window.retryCamera = retryCamera;
    window.proceedToDetails = proceedToDetails;
    window.showTemporaryCertificate = showTemporaryCertificate;
    window.downloadFriendCard = function () { generateCertificate(false); };
    window.showToast = showToast;

    /* ======================================================================
       18. BOOT
       ====================================================================== */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
