// --- 1. MATRIX RAIN EFFECT ---
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const chars = 'SEISMIC01XYZ';
const fontSize = 16;
const columns = canvas.width/fontSize;
const drops = [];
for(let x = 0; x < columns; x++) drops[x] = 1;

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#a855f7';
    ctx.font = fontSize + 'px monospace';
    for(let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i*fontSize, drops[i]*fontSize);
        if(drops[i]*fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
setInterval(drawMatrix, 40);
window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });


// --- 2. AUDIO SYSTEM ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    const now = audioCtx.currentTime;
    if (type === 'click') {
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    } else if (type === 'correct') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        if(navigator.vibrate) navigator.vibrate(300);
    }
}


// --- 3. QUESTION BANK (Full List) ---
const questionBank = [
    // Level 1: Basics
    { q: "What is Seismic?", a: ["Layer-2 for Bitcoin", "Privacy-enabled Layer-1 for fintech", "Centralized Exchange", "NFT Wallet"], correct: 1 },
    { q: "What is Seismic's main mission?", a: ["1GB Block Size", "Encrypt All Chains", "Zero Gas Fees", "New Social Network"], correct: 1 },
    { q: "Which tech provides hardware protection?", a: ["Intel TDX (Secure Enclaves)", "Raspberry Pi", "Google TPU", "NVIDIA RTX"], correct: 0 },
    { q: "Is Seismic EVM compatible?", a: ["No, new language", "Yes, modified EVM + stype", "Read-only", "Only via bridges"], correct: 1 },
    { q: "Who is the lead investor?", a: ["MicroStrategy", "a16z crypto", "Tesla", "Binance Labs"], correct: 1 },
    { q: "What are the two memory segments?", a: ["Red & Blue", "Transparent & Encrypted", "Public & Private", "Fast & Slow"], correct: 1 },
    { q: "Best use case for Seismic?", a: ["Meme coins", "Private DeFi / Dark Pools", "Static Sites", "Music Streaming"], correct: 1 },
    { q: "Encrypted Global State allows...", a: ["Seeing all balances", "Composability without leaks", "Mobile Mining", "Deleting History"], correct: 1 },
    { q: "Consensus mechanism?", a: ["Proof of Work", "CometBFT (PoS)", "Proof of Space", "Proof of Authority"], correct: 1 },
    { q: "App for restaurant revenue share?", a: ["Nibble", "Bite", "Chef", "Menu"], correct: 0 },

    // Level 2: Master
    { q: "Instruction to LOAD encrypted data?", a: ["ELOAD", "CLOAD (Cipher Load)", "SECRET_LOAD", "HIDE_READ"], correct: 1 },
    { q: "Instruction to STORE encrypted data?", a: ["CSTORE", "ESTORE", "LOCK_DATA", "SAVE_PRIVATE"], correct: 0 },
    { q: "Execution client based on?", a: ["Geth", "Reth (Rust)", "Besu", "Erigon"], correct: 1 },
    { q: "How is Solidity modified?", a: ["Zinc", "SeisSol", "Adds 'stype' (secure type)", "Vyper++"], correct: 2 },
    { q: "Data inside Secure Enclave during execution?", a: ["Becomes public", "Decrypt -> Process -> Encrypt", "Sent to validators", "Deleted"], correct: 1 },
    { q: "Can a contract have hybrid state?", a: ["No", "Yes, Public & Private", "Double Fee Only", "Testnet Only"], correct: 1 },
    { q: "What is 'Level' app?", a: ["Platformer", "Belief-based trading", "Audit Tool", "API Access"], correct: 1 },
    { q: "Role of Sequencers?", a: ["Music", "Encrypt txs & connect chains", "Visualization", "Token Name"], correct: 1 },
    { q: "Testing framework?", a: ["Hardhat", "Foundry fork + encryption", "Truffle", "Remix"], correct: 1 },

    // Level 3: Guru
    { q: "Privacy implementation level?", a: ["Wallet", "Protocol (TEE)", "UI", "Browser"], correct: 1 },
    { q: "Key problem solved?", a: ["Hiding sensitive data (wages/trades)", "Slow speed", "Storage cost", "Mining difficulty"], correct: 0 },
    { q: "What is 'Folio'?", a: ["Pay-it-forward system", "Portfolio Tracker", "PDF Docs", "Mobile Wallet"], correct: 0 },
    { q: "VM Library used?", a: ["revm", "evmone", "py-evm", "vm-ware"], correct: 0 },
    { q: "Total funding (approx)?", a: ["$7M", "$17M", "$1B", "$0"], correct: 1 },
    { q: "Does it support Dark Pools?", a: ["No", "Yes, key use case", "NFT Only", "Stablecoins Only"], correct: 1 },
    { q: "Protection against MEV?", a: ["Encrypted Mempool", "Ban Bots", "Higher Fees", "Central Server"], correct: 0 },
    { q: "Encrypted Memory Access?", a: ["PC Password", "Manipulate arrays securely", "USB Encrypt", "Screen Encrypt"], correct: 1 },
    { q: "Final Goal?", a: ["Digital Fortress (Fintech Privacy)", "Public Data", "No Blockchain", "Web2 Return"], correct: 0 }
];


// --- 4. GAME VARIABLES ---
let currentUser = "GUEST";
let score = 0;
let lives = 3;
let currentQIndex = 0;
let timer;
let timeLeft;
let startMaxTime = 15;
let gameActive = false;
let shuffledQuestions = [];

const ui = {
    login: document.getElementById('loginScreen'),
    game: document.getElementById('gameScreen'),
    end: document.getElementById('endScreen'),
    userDisplay: document.getElementById('displayUser'),
    scoreVal: document.getElementById('scoreVal'),
    lives: document.getElementById('livesDisplay'),
    timerBar: document.getElementById('timerBar'),
    questionText: document.getElementById('questionText'),
    qNum: document.getElementById('qNum'),
    totalQ: document.getElementById('totalQ'),
    answersGrid: document.getElementById('answersGrid'),
    finalScore: document.getElementById('finalScore'),
    finalRank: document.getElementById('finalRank'),
    certPreview: document.getElementById('certificatePreview')
};


// --- 5. FUNCTIONS ---

function submitLogin() {
    playSound('click');
    const input = document.getElementById('usernameInput');
    const name = input.value.trim().toUpperCase();
    if(name.length > 0) {
        currentUser = name;
        ui.login.classList.remove('active');
        ui.game.classList.add('active');
        startGame();
    } else {
        input.style.borderColor = 'red';
    }
}

function startGame() {
    score = 0;
    lives = 3;
    currentQIndex = 0;
    
    // Pick 15 random questions
    shuffledQuestions = [...questionBank].sort(() => 0.5 - Math.random()).slice(0, 15);
    
    ui.userDisplay.innerText = currentUser;
    ui.scoreVal.innerText = score;
    ui.totalQ.innerText = shuffledQuestions.length;
    
    updateLives();
    loadQuestion();
}

function updateLives() {
    let hearts = "";
    for(let i=0; i<lives; i++) hearts += "❤️ ";
    ui.lives.innerText = hearts;
}

function loadQuestion() {
    if(currentQIndex >= shuffledQuestions.length) {
        endGame();
        return;
    }

    const qData = shuffledQuestions[currentQIndex];
    ui.qNum.innerText = currentQIndex + 1;
    ui.questionText.innerText = qData.q;
    ui.answersGrid.innerHTML = '';

    qData.a.forEach((ans, index) => {
        const btn = document.createElement('button');
        btn.innerText = ans;
        btn.className = 'ans-btn';
        btn.onclick = () => checkAnswer(index, qData.correct);
        ui.answersGrid.appendChild(btn);
    });

    gameActive = true;
    startTimer();
}

function startTimer() {
    clearInterval(timer);
    let duration = Math.max(5, startMaxTime - (currentQIndex * 0.5));
    timeLeft = duration;
    
    ui.timerBar.style.width = "100%";
    ui.timerBar.style.backgroundColor = "#a855f7";

    timer = setInterval(() => {
        timeLeft -= 0.05;
        let percent = (timeLeft / duration) * 100;
        ui.timerBar.style.width = percent + "%";
        
        if(percent < 30) ui.timerBar.style.backgroundColor = "red";

        if(timeLeft <= 0) {
            clearInterval(timer);
            handleWrong();
        }
    }, 50);
}

function checkAnswer(selected, correct) {
    if(!gameActive) return;
    clearInterval(timer);
    gameActive = false;
    
    const btns = ui.answersGrid.children;
    
    if(selected === correct) {
        playSound('correct');
        btns[selected].classList.add('ans-correct');
        score++;
        ui.scoreVal.innerText = score;
        setTimeout(nextQuestion, 800);
    } else {
        playSound('wrong');
        btns[selected].classList.add('ans-wrong');
        btns[correct].classList.add('ans-correct');
        handleWrong(true);
    }
}

function handleWrong(skipDelay) {
    lives--;
    updateLives();
    if(lives <= 0) {
        setTimeout(endGame, 1000);
    } else {
        setTimeout(nextQuestion, skipDelay ? 1500 : 1000);
    }
}

function nextQuestion() {
    currentQIndex++;
    loadQuestion();
}

function endGame() {
    ui.game.classList.remove('active');
    ui.end.classList.add('active');
    ui.finalScore.innerText = score + "/15";

    let rank = "UNRANKED ❌";
    if(score >= 5) rank = "SEISMIC NOVICE 👶";
    if(score >= 10) rank = "SEISMIC MASTER 🧠";
    if(score === 15) rank = "SEISMIC GURU ⚡";
    
    ui.finalRank.innerText = rank;
    
    // Generate new Certificate
    drawCertificate(rank);
}

function restartGame() {
    ui.end.classList.remove('active');
    ui.game.classList.add('active');
    startGame();
}

// --- CERTIFICATE GENERATOR ---
function drawCertificate(rank) {
    const certCanvas = document.createElement('canvas');
    certCanvas.width = 1200; 
    certCanvas.height = 675;
    const ctx = certCanvas.getContext('2d');

    const logo = new Image();
    logo.src = 'images/stone.png'; 

    logo.onload = () => {
        // A. BACKGROUND
        const gradient = ctx.createLinearGradient(0, 0, 1200, 675);
        gradient.addColorStop(0, '#0a0010'); 
        gradient.addColorStop(1, '#000000');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1200, 675);

        // Grid
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.1)';
        ctx.lineWidth = 1;
        for(let i=0; i<1200; i+=50) {
            ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,675); ctx.stroke();
        }
        for(let j=0; j<675; j+=50) {
            ctx.beginPath(); ctx.moveTo(0,j); ctx.lineTo(1200,j); ctx.stroke();
        }

        // B. WATERMARK
        ctx.save();
        ctx.globalAlpha = 0.15;
        const watermarkSize = 400;
        ctx.drawImage(logo, (1200-watermarkSize)/2, (675-watermarkSize)/2, watermarkSize, watermarkSize);
        ctx.restore();

        // C. BORDER
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 15;
        ctx.strokeRect(30, 30, 1140, 615);

        // D. TEXT
        ctx.textAlign = 'center';
        
        // Title
        ctx.fillStyle = 'white';
        ctx.font = 'bold 60px monospace';
        ctx.shadowColor = "#a855f7";
        ctx.shadowBlur = 20;
        ctx.fillText("SEISMIC QUIZ CERTIFICATE", 600, 120);
        ctx.shadowBlur = 0;

        // User
        ctx.font = '40px monospace';
        ctx.fillStyle = '#ccc';
        ctx.fillText(`CODENAME: ${currentUser}`, 600, 230);

        // Score
        ctx.font = 'bold 100px monospace';
        ctx.fillStyle = '#fff';
        ctx.fillText(`${score} / 15`, 600, 380);

        // Rank Logic
        let rankColor = '#ef4444'; 
        if(score >= 5) rankColor = '#facc15'; 
        if(score >= 10) rankColor = '#22c55e'; 
        if(score === 15) rankColor = '#3b82f6';

        // Rank
        ctx.font = 'bold 60px monospace';
        ctx.fillStyle = rankColor;
        ctx.shadowColor = rankColor;
        ctx.shadowBlur = 15;
        ctx.fillText(rank, 600, 500);
        ctx.shadowBlur = 0;

        // Footer (Тут змінено!)
        ctx.font = '20px monospace';
        ctx.fillStyle = '#666';
        ctx.fillText("Creator: Hawk (@AleksYastreb)", 600, 600);

        // E. DISPLAY
        const finalImg = new Image();
        finalImg.src = certCanvas.toDataURL();
        ui.certPreview.innerHTML = '';
        ui.certPreview.appendChild(finalImg);
    };

    if (logo.complete) logo.onload();
}

function downloadCertificate() {
    const link = document.createElement('a');
    link.download = `Seismic_Certificate_${currentUser}.png`;
    const img = document.querySelector('#certificatePreview img');
    if(img) {
        link.href = img.src;
        link.click();
    }
}

function shareResult() {
    const rank = ui.finalRank.innerText;
    // Оновлений текст для твіттера
    const text = `Just passed the Seismic Quiz. 🧠\n\nUser: ${currentUser}\nScore: ${score}/15\nRank: ${rank}\n\nTry it here: https://alekshawk.github.io/seismic-tap-game/\n\nCreator: @AleksYastreb @SeismicSys`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}
