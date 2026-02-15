// --- БАНК ПИТАНЬ (Можеш додавати свої) ---
const questionBank = [
    { q: "What is the core purpose of Seismic?", a: ["Speed", "Privacy", "Storage", "Gaming"], correct: 1 },
    { q: "What does 'ZK' stand for in crypto?", a: ["Zero Key", "Zombie Killer", "Zero Knowledge", "Zone Keeper"], correct: 2 },
    { q: "A 'Shielded' transaction is...", a: ["Visible to all", "Encrypted/Hidden", "Very slow", "Free of gas"], correct: 1 },
    { q: "Who validates transactions in PoS?", a: ["Miners", "Validators", "Developers", "Gamers"], correct: 1 },
    { q: "What happens if you lose your Seed Phrase?", a: ["Support restores it", "Game Over (Lost forever)", "Regenerate with email", "Nothing bad"], correct: 1 },
    { q: "What is a 'Memepool'?", a: ["A pool party", "Pending transactions", "Deleted blocks", "Valid blocks"], correct: 1 }, // Mempool
    { q: "Which of these is NOT a crypto wallet?", a: ["Metamask", "Phantom", "Rabby", "Dropbox"], correct: 3 },
    { q: "In cryptography, 'Alice' usually talks to...", a: ["Karen", "Bob", "Satoshi", "Eve"], correct: 1 },
    { q: "What protects the network from spam?", a: ["Gas Fees", "Firewall", "Admin", "Anti-Virus"], correct: 0 },
    { q: "Seismic tech focuses on...", a: ["Public ledgers", "Confidential computing", "Video streaming", "AI Art"], correct: 1 },
    { q: "What is 'MEV'?", a: ["My Electronic Vault", "Max Extractable Value", "More Ether Value", "Mini Eth Version"], correct: 1 },
    { q: "A 'Smart Contract' is...", a: ["Legal paper", "Self-executing code", "A handshake", "AI robot"], correct: 1 },
    { q: "What shape is the Seismic logo?", a: ["Circle", "Crystal/Stone", "Square", "Triangle"], correct: 1 },
    { q: "Decentralization means...", a: ["No central authority", "One main server", "Government control", "Slow internet"], correct: 0 },
    { q: "What is a 'White Hat'?", a: ["A fashion item", "Ethical Hacker", "Bad Hacker", "Crypto Newbie"], correct: 1 }
];

// --- ЗМІННІ ГРИ ---
let currentQuestions = [];
let score = 0;
let lives = 3;
let currentQIndex = 0;
let timer;
let timeLeft;
let maxTime = 15; // Початковий час (сек)
let gameActive = false;

// Елементи DOM
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const endScreen = document.getElementById('endScreen');
const questionText = document.getElementById('questionText');
const answersGrid = document.getElementById('answersGrid');
const timerBar = document.getElementById('timerBar');
const livesDisplay = document.getElementById('livesDisplay');
const scoreVal = document.getElementById('scoreVal');
const qNum = document.getElementById('qNum');

function startGame() {
    startScreen.classList.remove('active');
    gameScreen.classList.add('active');
    
    // Скидання змінних
    score = 0;
    lives = 3;
    maxTime = 15;
    currentQIndex = 0;
    
    // Перемішуємо питання
    currentQuestions = [...questionBank].sort(() => 0.5 - Math.random());
    
    updateUI();
    loadQuestion();
    gameActive = true;
}

function updateUI() {
    scoreVal.innerText = score;
    // Оновлюємо життя (щити)
    let shields = "";
    for(let i=0; i<lives; i++) shields += "🛡️ ";
    livesDisplay.innerText = shields;
}

function loadQuestion() {
    if(currentQIndex >= currentQuestions.length) {
        gameOver(true); // Виграв (пройшов усе)
        return;
    }

    const qData = currentQuestions[currentQIndex];
    qNum.innerText = currentQIndex + 1;
    questionText.innerText = qData.q;
    answersGrid.innerHTML = '';

    // Створюємо кнопки
    qData.a.forEach((ans, index) => {
        const btn = document.createElement('button');
        btn.innerText = ans;
        btn.className = 'ans-btn';
        btn.onclick = () => checkAnswer(index, qData.correct);
        answersGrid.appendChild(btn);
    });

    // Скидаємо таймер
    startTimer();
}

function startTimer() {
    // З кожним рівнем часу менше на 0.5 сек (але не менше 3 сек)
    let timeLimit = Math.max(3, maxTime - (currentQIndex * 0.8));
    timeLeft = timeLimit;
    
    clearInterval(timer);
    timerBar.style.width = "100%";
    timerBar.classList.remove('timer-low');

    timer = setInterval(() => {
        timeLeft -= 0.05;
        let percent = (timeLeft / timeLimit) * 100;
        timerBar.style.width = percent + "%";

        if(percent < 30) timerBar.classList.add('timer-low');

        if(timeLeft <= 0) {
            clearInterval(timer);
            handleWrong();
        }
    }, 50);
}

function checkAnswer(selected, correct) {
    if(!gameActive) return;
    clearInterval(timer);
    gameActive = false; // Блокуємо кліки

    const buttons = answersGrid.children;
    
    if(selected === correct) {
        // ПРАВИЛЬНО
        buttons[selected].classList.add('ans-correct');
        score += 10 + Math.floor(timeLeft); // Бонус за швидкість
        setTimeout(() => {
            currentQIndex++;
            gameActive = true;
            updateUI();
            loadQuestion();
        }, 1000);
    } else {
        // НЕПРАВИЛЬНО
        buttons[selected].classList.add('ans-wrong');
        buttons[correct].classList.add('ans-correct'); // Показуємо правильну
        handleWrong();
    }
}

function handleWrong() {
    document.body.classList.add('shake-screen');
    setTimeout(() => document.body.classList.remove('shake-screen'), 500);

    lives--;
    updateUI();

    if(lives <= 0) {
        setTimeout(() => gameOver(false), 1000);
    } else {
        setTimeout(() => {
            currentQIndex++;
            gameActive = true;
            loadQuestion();
        }, 1500);
    }
}

function gameOver(win) {
    gameScreen.classList.remove('active');
    endScreen.classList.add('active');

    document.getElementById('finalScore').innerText = score;
    const rankEl = document.getElementById('finalRank');
    const endImg = document.getElementById('endImage');
    const title = document.getElementById('endTitle');

    // Логіка рангів
    if(win) {
        title.innerText = "SYSTEM HACKED";
        title.style.color = "#22c55e";
        rankEl.innerText = "SEISMIC ARCHITECT 🏆";
        endImg.style.display = "block"; // Показуємо Роккі
    } else {
        title.innerText = "ACCESS DENIED";
        title.style.color = "#ef4444";
        endImg.style.display = "none";
        if(score < 50) rankEl.innerText = "SCRIPT KIDDIE";
        else if(score < 100) rankEl.innerText = "GRAY HAT";
        else rankEl.innerText = "CYBER PUNK";
    }
}

function shareResult() {
    const text = `I hacked the Seismic System with ${score} DATA points! 🛡️💻\nRank: ${document.getElementById('finalRank').innerText}\n\nCan you decrypt the blocks?\nPlay: https://alekshawk.github.io/seismic-tap-game/\n\n@SeismicSys`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}
