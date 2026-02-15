// --- 1. MATRIX RAIN EFFECT ---
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const nums = '0123456789';
const alphabet = katakana + latin + nums;

const fontSize = 16;
const columns = canvas.width/fontSize;
const drops = [];

for(let x = 0; x < columns; x++) drops[x] = 1;

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#a855f7'; // Purple text
    ctx.font = fontSize + 'px monospace';

    for(let i = 0; i < drops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i*fontSize, drops[i]*fontSize);
        if(drops[i]*fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
setInterval(drawMatrix, 30);
window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });


// --- 2. GAME LOGIC ---

// Питання
const questionBank = [
    { q: "Seismic provides which key feature?", a: ["Public Transparency", "Shielded Transactions", "Infinite Supply", "Slow Speed"], correct: 1 },
    { q: "Your Private Key should be shared with...", a: ["Everyone", "Admins", "No One", "Mom"], correct: 2 },
    { q: "What triggers a Smart Contract?", a: ["Code conditions", "A phone call", "A lawyer", "Luck"], correct: 0 },
    { q: "Web3 allows users to...", a: ["Read only", "Read & Write", "Own Data", "Delete Internet"], correct: 2 },
    { q: "If Seismic hides data, it uses...", a: ["Magic", "Zero-Knowledge Proofs", "VPN", "Incognito Mode"], correct: 1 },
    { q: "A 'Rug Pull' means...", a: ["New carpet", "Project scam/theft", "Market crash", "Bug fix"], correct: 1 },
    { q: "What is a DAO?", a: ["Decentralized Org", "Digital Art Online", "Data Access Object", "Dog And Owl"], correct: 0 },
    { q: "Gas fees are paid to...", a: ["The CEO", "Validators/Miners", "Google", "Charity"], correct: 1 },
    { q: "Cold Storage means...", a: ["Offline Wallet", "Fridge", "Cloud Storage", "Lost Wallet"], correct: 0 },
    { q: "The Seismic mascot is a...", a: ["Cat", "Golem/Rock", "Robot", "Alien"], correct: 1 }
];

let currentUser = "GUEST";
let score = 0;
let lives = 3;
let currentQIndex = 0;
let timer;
let timeLeft;
let maxTime = 15;
let gameActive = false;

// DOM Elements
const screens = {
    login: document.getElementById('loginScreen'),
    game: document.getElementById('gameScreen'),
    end: document.getElementById('endScreen')
};
const ui = {
    userDisplay: document.getElementById('displayUser'),
    scoreVal: document.getElementById('scoreVal'),
    lives: document.getElementById('livesDisplay'),
    timerBar: document.getElementById('timerBar'),
    questionText: document.getElementById('questionText'),
    qNum: document.getElementById('qNum'),
    answersGrid: document.getElementById('answersGrid'),
    finalScore: document.getElementById('finalScore'),
    finalRank: document.getElementById('finalRank'),
    leaderboardList: document.getElementById('leaderboardList')
};

// --- START & LOGIN ---
function submitLogin() {
    const input = document.getElementById('usernameInput');
    const name = input.value.trim().toUpperCase();
    
    if(name.length > 0) {
        currentUser = name;
        // Зберігаємо юзера
        localStorage.setItem('seismic_last_user', currentUser);
        
        screens.login.classList.remove('active');
        screens.game.classList.add('active');
        
        startGame();
    } else {
        input.style.borderColor = 'red';
        setTimeout(() => input.style.borderColor = '#555', 500);
    }
}

// Перевірка, чи є збережений юзер
window.onload = () => {
    const savedUser = localStorage.getItem('seismic_last_user');
    if(savedUser) document.getElementById('usernameInput').value = savedUser;
};

function startGame() {
    ui.userDisplay.innerText = currentUser;
    score = 0;
    lives = 3;
    maxTime = 15;
    currentQIndex = 0;
    
    // Перемішуємо питання
    currentQuestions = [...questionBank].sort(() => 0.5 - Math.random());
    
    updateHUD();
    loadQuestion();
    gameActive = true;
}

function updateHUD() {
    ui.scoreVal.innerText = score;
    let hearts = "";
    for(let i=0; i<lives; i++) hearts += "🛡️ ";
    ui.lives.innerText = hearts;
}

function loadQuestion() {
    if(currentQIndex >= currentQuestions.length) {
        endGame(true);
        return;
    }

    const qData = currentQuestions[currentQIndex];
    ui.qNum.innerText = currentQIndex + 1;
    
    // Ефект друкування тексту
    typeWriter(qData.q, ui.questionText);
    
    ui.answersGrid.innerHTML = '';
    
    // Кнопки
    qData.a.forEach((ans, index) => {
        const btn = document.createElement('button');
        btn.innerText = ans;
        btn.className = 'ans-btn';
        btn.onclick = () => checkAnswer(index, qData.correct);
        ui.answersGrid.appendChild(btn);
    });

    resetTimer();
}

// Ефект друкарської машинки
function typeWriter(text, element) {
    element.innerText = "";
    let i = 0;
    const speed = 20; 
    function type() {
        if (i < text.length) {
            element.innerText += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

function resetTimer() {
    clearInterval(timer);
    // Час зменшується з кожним питанням
    timeLeft = Math.max(4, maxTime - (currentQIndex * 0.8)); 
    ui.timerBar.style.width = "100%";
    ui.timerBar.style.backgroundColor = "#a855f7";

    timer = setInterval(() => {
        timeLeft -= 0.05;
        let percent = (timeLeft / (Math.max(4, maxTime - (currentQIndex * 0.8)))) * 100;
        ui.timerBar.style.width = percent + "%";

        if(percent < 30) ui.timerBar.style.backgroundColor = "#ef4444";

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
        btns[selected].classList.add('ans-correct');
        score += 10 + Math.floor(timeLeft); // Бонус за швидкість
        setTimeout(() => {
            currentQIndex++;
            gameActive = true;
            updateHUD();
            loadQuestion();
        }, 800);
    } else {
        btns[selected].classList.add('ans-wrong');
        btns[correct].classList.add('ans-correct');
        handleWrong();
    }
}

function handleWrong() {
    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 400);
    
    lives--;
    updateHUD();

    if(lives <= 0) {
        setTimeout(() => endGame(false), 1000);
    } else {
        setTimeout(() => {
            currentQIndex++;
            gameActive = true;
            loadQuestion();
        }, 1500);
    }
}

// --- END GAME & LEADERBOARD ---
function endGame(win) {
    screens.game.classList.remove('active');
    screens.end.classList.add('active');
    
    ui.finalScore.innerText = score;
    
    if(score < 50) ui.finalRank.innerText = "SCRIPT KIDDIE";
    else if(score < 100) ui.finalRank.innerText = "GRAY HAT";
    else ui.finalRank.innerText = "SEISMIC ARCHITECT 🏆";
    
    if(win) document.getElementById('endTitle').innerText = "SYSTEM HACKED";
    else document.getElementById('endTitle').innerText = "ACCESS DENIED";

    updateLeaderboard(score);
}

function updateLeaderboard(newScore) {
    // 1. Отримуємо збережені рекорди
    let highScores = JSON.parse(localStorage.getItem('seismic_leaderboard')) || [];
    
    // 2. Додаємо фейкових ботів, якщо список порожній (для краси)
    if(highScores.length === 0) {
        highScores = [
            { name: "SATOSHI", score: 150 },
            { name: "NEO", score: 120 },
            { name: "ROCKY", score: 90 }
        ];
    }

    // 3. Додаємо поточний результат
    // Перевіряємо, чи цей юзер вже грав, і чи побив він свій рекорд
    const existingUserIndex = highScores.findIndex(u => u.name === currentUser);
    
    if (existingUserIndex !== -1) {
        if (newScore > highScores[existingUserIndex].score) {
            highScores[existingUserIndex].score = newScore; // Оновлюємо рекорд
        }
    } else {
        highScores.push({ name: currentUser, score: newScore }); // Додаємо нового
    }

    // 4. Сортуємо (від найбільшого до найменшого)
    highScores.sort((a, b) => b.score - a.score);

    // 5. Обрізаємо топ-5
    highScores = highScores.slice(0, 5);

    // 6. Зберігаємо назад
    localStorage.setItem('seismic_leaderboard', JSON.stringify(highScores));

    // 7. Відображаємо
    ui.leaderboardList.innerHTML = "";
    highScores.forEach(entry => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${entry.name}</span> <span>${entry.score} pts</span>`;
        if(entry.name === currentUser) li.classList.add('user-score');
        ui.leaderboardList.appendChild(li);
    });
}

function restartGame() {
    screens.end.classList.remove('active');
    screens.game.classList.add('active');
    startGame();
}

function shareResult() {
    const text = `I hacked the Seismic Net as [${currentUser}] with ${score} PTS! 🛡️💻\nCan you beat my rank on the Leaderboard?\n\nPlay: https://alekshawk.github.io/seismic-tap-game/\n@SeismicSys`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}
