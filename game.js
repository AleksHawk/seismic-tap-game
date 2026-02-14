let score = 0;
let timeLeft = 10.00;
let isPlaying = false;
let gameInterval;
let timerInterval;

const clickArea = document.getElementById('clickArea');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const mascot = document.getElementById('mascot');
const startHint = document.getElementById('startHint');
const modal = document.getElementById('modal');
const finalScoreDisplay = document.getElementById('finalScore');
const rankTextDisplay = document.getElementById('rankText');

// --- ОСНОВНИЙ КЛІК ---
clickArea.addEventListener('mousedown', handleClick);
clickArea.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleClick(e.touches[0]);
}, {passive: false});

function handleClick(e) {
    if (timeLeft <= 0) return;
    if (!isPlaying) startGame();

    score++;
    scoreDisplay.innerText = score;

    mascot.classList.remove('active');
    void mascot.offsetWidth;
    mascot.classList.add('active');

    document.body.classList.remove('shake');
    void document.body.offsetWidth;
    document.body.classList.add('shake');

    createParticles(e.clientX || e.pageX, e.clientY || e.pageY);
}

function startGame() {
    isPlaying = true;
    startHint.style.opacity = '0';
    score = 0;
    timeLeft = 10.00;
    
    timerInterval = setInterval(() => {
        timeLeft -= 0.01;
        timerDisplay.innerText = timeLeft.toFixed(2);
        if (timeLeft <= 0) endGame();
    }, 10);
}

function endGame() {
    isPlaying = false;
    clearInterval(timerInterval);
    timerDisplay.innerText = "0.00";
    finalScoreDisplay.innerText = score;
    rankTextDisplay.innerText = getRank(score);
    setTimeout(() => { modal.style.display = 'flex'; }, 500);
}

function restartGame() {
    modal.style.display = 'none';
    score = 0;
    scoreDisplay.innerText = '0';
    timerDisplay.innerText = '10.00';
    startHint.style.opacity = '1';
    startHint.innerText = 'TAP TO START!';
    isPlaying = false;
}

function getRank(score) {
    if (score < 30) return "Pebble Breaker 🪨";
    if (score < 50) return "Rock Crusher 🔨";
    if (score < 70) return "Seismic Agent 🕵️";
    if (score < 90) return "Tectonic Shifter 🌋";
    return "SEISMIC GOD ⚡";
}

function createParticles(x, y) {
    if (!x || !y) {
        const rect = mascot.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
    }
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        document.body.appendChild(particle);
        const destinationX = (Math.random() - 0.5) * 200;
        const destinationY = (Math.random() - 0.5) * 200;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        const animation = particle.animate([
            { transform: `translate(0, 0) scale(1)`, opacity: 1 },
            { transform: `translate(${destinationX}px, ${destinationY}px) scale(0)`, opacity: 0 }
        ], { duration: 500, easing: 'cubic-bezier(0, .9, .57, 1)' });
        animation.onfinish = () => particle.remove();
    }
}

function shareResult() {
    const canvas = document.createElement('canvas');
    canvas.width = 1200; canvas.height = 675;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 1200, 675);
    gradient.addColorStop(0, "#1a0b2e");
    gradient.addColorStop(1, "#000000");
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1200, 675);
    ctx.strokeStyle = "#a855f7"; ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, 1160, 635);
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 80px Arial";
    ctx.textAlign = "center"; ctx.fillText("SEISMIC POWER TEST", 600, 150);
    ctx.font = "bold 180px Arial"; ctx.fillStyle = "#a855f7";
    ctx.shadowColor = "#a855f7"; ctx.shadowBlur = 30;
    ctx.fillText(score, 600, 350); ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 50px Arial";
    ctx.fillText(`RANK: ${getRank(score).toUpperCase()}`, 600, 450);
    ctx.font = "30px Arial"; ctx.fillStyle = "#888";
    ctx.fillText("Can you beat my score? @SeismicSys", 600, 600);
    const link = document.createElement('a');
    link.download = `seismic-score-${score}.png`;
    link.href = canvas.toDataURL(); link.click();
    const tweetText = `I just hit ${score} Seismic Power! ⚡
Rank: ${getRank(score)}
Try here: https://alekshawk.github.io/seismic-game/`;
    setTimeout(() => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank');
    }, 1000);
}
