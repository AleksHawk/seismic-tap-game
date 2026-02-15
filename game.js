const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const overlay = document.getElementById('overlay');
const finalScoreText = document.getElementById('finalScoreText');
const shareBtn = document.getElementById('shareBtn');

// Налаштування розмірів
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Зображення
const rockyImg = new Image();
rockyImg.src = 'images/rocky.png';

const stoneImg = new Image();
stoneImg.src = 'images/stone.png';

// Змінні гри
let gameSpeed = 5;
let score = 0;
let highScore = localStorage.getItem('seismicHighScore') || 0;
highScoreEl.innerText = highScore;
let isGameOver = true;
let animationId;
let frames = 0;

// Гравець (Роккі)
const player = {
    x: 50,
    y: 0,
    width: 60,  // Розмір Роккі
    height: 60,
    dy: 0,
    jumpForce: 15,
    gravity: 0.8,
    grounded: false,
    draw: function() {
        if(rockyImg.complete) {
            ctx.drawImage(rockyImg, this.x, this.y, this.width, this.height);
        } else {
            // Фолбек, якщо картинка не прогрузилась
            ctx.fillStyle = '#a855f7';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    },
    jump: function() {
        if (this.grounded) {
            this.dy = -this.jumpForce;
            this.grounded = false;
        }
    },
    update: function() {
        // Гравітація
        this.dy += this.gravity;
        this.y += this.dy;

        // Земля
        if (this.y + this.height > canvas.height - 20) {
            this.y = canvas.height - 20 - this.height;
            this.dy = 0;
            this.grounded = true;
        }

        this.draw();
    }
};

// Перешкоди (Шипи)
const obstacles = [];
class Obstacle {
    constructor() {
        this.width = 40;
        this.height = 60;
        this.x = canvas.width;
        this.y = canvas.height - 20 - this.height;
        this.markedForDeletion = false;
    }
    update() {
        this.x -= gameSpeed;
        if (this.x < -this.width) this.markedForDeletion = true;
        this.draw();
    }
    draw() {
        // Малюємо неоновий трикутник (шип)
        ctx.fillStyle = '#ef4444'; // Червоний
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// Камінці (Бонуси)
const stones = [];
class Stone {
    constructor() {
        this.width = 40;
        this.height = 40;
        this.x = canvas.width;
        // Висота появи: або на землі, або в повітрі для стрибка
        this.y = Math.random() > 0.5 ? canvas.height - 150 : canvas.height - 70;
        this.markedForDeletion = false;
        this.angle = 0;
    }
    update() {
        this.x -= gameSpeed;
        this.angle += 0.05; // Обертання
        if (this.x < -this.width) this.markedForDeletion = true;
        this.draw();
    }
    draw() {
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.angle);
        if(stoneImg.complete) {
            ctx.drawImage(stoneImg, -this.width/2, -this.height/2, this.width, this.height);
        } else {
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(0, 0, 15, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

// --- УПРАВЛІННЯ ---
window.addEventListener('keydown', e => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (!isGameOver) player.jump();
        else startGame();
    }
});

window.addEventListener('touchstart', e => {
    if (!isGameOver) player.jump();
    else startGame();
});

// --- ГЕЙМ ЛУП ---
function animate() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Спавн перешкод
    frames++;
    // Чим вища швидкість, тим частіше перешкоди
    let spawnRate = Math.floor(200 - gameSpeed * 5); 
    if(spawnRate < 60) spawnRate = 60;

    if (frames % spawnRate === 0) {
        // 30% шанс на камінь, 70% на шип
        if(Math.random() < 0.4) {
            stones.push(new Stone());
        } else {
            obstacles.push(new Obstacle());
        }
    }

    // Оновлення гравця
    player.update();

    // Оновлення перешкод
    obstacles.forEach(obs => {
        obs.update();
        // Перевірка колізії (Поразка)
        if (checkCollision(player, obs)) {
            gameOver();
        }
    });

    // Оновлення камінців
    stones.forEach(stone => {
        stone.update();
        // Перевірка збору (Бонус)
        if (checkCollision(player, stone)) {
            stone.markedForDeletion = true;
            score += 10;
            scoreEl.innerText = score;
        }
    });

    // Чистка масивів
    for(let i = obstacles.length - 1; i >= 0; i--) {
        if(obstacles[i].markedForDeletion) obstacles.splice(i, 1);
    }
    for(let i = stones.length - 1; i >= 0; i--) {
        if(stones[i].markedForDeletion) stones.splice(i, 1);
    }

    // Збільшення швидкості з часом
    if(frames % 500 === 0) gameSpeed += 0.5;

    // Рахунок за дистанцію
    if(frames % 10 === 0) {
        score++;
        scoreEl.innerText = score;
    }

    animationId = requestAnimationFrame(animate);
}

function startGame() {
    isGameOver = false;
    score = 0;
    gameSpeed = 5;
    frames = 0;
    obstacles.length = 0;
    stones.length = 0;
    scoreEl.innerText = score;
    overlay.style.display = 'none';
    animate();
}

function gameOver() {
    isGameOver = true;
    cancelAnimationFrame(animationId);
    
    // Перевірка рекорду
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('seismicHighScore', highScore);
        highScoreEl.innerText = highScore;
    }

    // Показуємо меню
    finalScoreText.innerText = "SCORE: " + score;
    finalScoreText.style.display = "block";
    shareBtn.style.display = "inline-block";
    overlay.style.display = "flex";
    
    // Змінюємо текст кнопки
    document.querySelector('.btn').innerText = "TRY AGAIN ↻";
}

// Проста колізія (прямокутники)
function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

function shareResult() {
    const text = `I just ran ${score}m in Seismic Runner! 🏃‍♂️⚡\nCan you beat my high score?\n\nPlay here: https://alekshawk.github.io/seismic-tap-game/\n\n@SeismicSys`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

// Ресайз екрану
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
