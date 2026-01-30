/* --- VARIABLES --- */
const screens = document.querySelectorAll('.screen');
const audioPlayer = document.getElementById('bg-music');
const musicDisc = document.getElementById('music-toggle');
const musicMenu = document.getElementById('music-menu');

// Buttons
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const btnRetry = document.getElementById('btn-retry');
const btnClear = document.getElementById('btn-clear');
const btnSubmitSign = document.getElementById('btn-submit-signature');
const btnRestart = document.getElementById('btn-restart');

// Signature variables
const canvas = document.getElementById('signature-pad');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let hasSigned = false;

/* --- NAVIGATION FUNCTIONS --- */
function switchScreen(id) {
    screens.forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

/* --- EVENT LISTENERS --- */

// Navigation Events
btnNo.addEventListener('click', () => switchScreen('screen-retry'));
btnRetry.addEventListener('click', () => switchScreen('screen-ask'));

btnYes.addEventListener('click', () => {
    switchScreen('screen-sign');
    // Wait a tiny bit for the screen to appear before sizing the canvas
    setTimeout(resizeCanvas, 100);
});

btnRestart.addEventListener('click', () => {
    switchScreen('screen-ask');
    clearSignature();
});

// Signature Submission
btnSubmitSign.addEventListener('click', () => {
    if (!hasSigned) {
        alert("Please sign to confirm the date! ✍️");
        return;
    }
    switchScreen('screen-gifts');
    celebrate();
});

// Clear Signature
btnClear.addEventListener('click', clearSignature);

/* --- SIGNATURE LOGIC --- */

function resizeCanvas() {
    const container = document.querySelector('.canvas-container');
    if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#D32F2F';
    }
}

function startDrawing(e) { isDrawing = true; draw(e); }
function endDrawing() { isDrawing = false; ctx.beginPath(); }

function draw(e) {
    if (!isDrawing) return;
    hasSigned = true;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
}

function clearSignature() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasSigned = false;
}

// Add listeners for both Mouse (Desktop) and Touch (Mobile)
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('mousemove', draw);

canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDrawing(e); }, {passive: false});
canvas.addEventListener('touchend', (e) => { e.preventDefault(); endDrawing(); }, {passive: false});
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); }, {passive: false});

// Resize canvas if window changes size
window.addEventListener('resize', resizeCanvas);

/* --- GIFT LOGIC (UPDATED) --- */
window.showGift = function(num) {
    if (num === 1) {
        // Show the Bouquet Screen
        switchScreen('screen-gift-1');
    } 
    else if (num === 2) {
        // Show the Date Plan Screen
        switchScreen('screen-gift-2');
    } 
    else if (num === 3) {
        // Show the QR Code Screen
        switchScreen('screen-qr');
        const titleEl = document.getElementById('gift-title');
        if(titleEl) titleEl.innerText = "A Special Song! 🎵 hope you like it!";
    }
};

/* --- MUSIC LOGIC --- */
musicDisc.addEventListener('click', () => {
    musicMenu.classList.toggle('hidden');
});

window.playSong = function(file) {
    audioPlayer.src = file;
    audioPlayer.play().catch(e => console.log("Audio play failed (browser block)"));
    musicDisc.classList.add('spinning');
    musicMenu.classList.add('hidden');
};

window.stopMusic = function() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    musicDisc.classList.remove('spinning');
    musicMenu.classList.add('hidden');
};

/* --- FIREWORKS LOGIC --- */
function celebrate() {
    // 1. Center (Starts immediately)
    createBurst(window.innerWidth / 2, window.innerHeight / 2);

    // 2. Top Left (200ms delay)
    setTimeout(() => createBurst(window.innerWidth / 4, window.innerHeight / 3), 200);

    // 3. Top Right (400ms delay)
    setTimeout(() => createBurst(window.innerWidth * 3 / 4, window.innerHeight / 3), 400);

    // 4. Bottom Left (600ms delay)
    setTimeout(() => createBurst(window.innerWidth / 4, window.innerHeight * 2 / 3), 600);

    // 5. Bottom Right (800ms delay)
    setTimeout(() => createBurst(window.innerWidth * 3 / 4, window.innerHeight * 2 / 3), 800);
}

function createBurst(x, y) {
    const particleCount = 30; // Number of sparks per burst
    const colors = ['#FFD700', '#FF4500', '#FF69B4', '#00BFFF', '#32CD32']; 
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('firework-particle');
        document.body.appendChild(particle);

        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = color;
        
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';

        const angle = Math.random() * Math.PI * 2; 
        const velocity = 50 + Math.random() * 150; 
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);

        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}