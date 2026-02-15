let count = 0;
const breakBtn = document.getElementById('breakBtn');
const mainImage = document.getElementById('mainImage');
const flash = document.getElementById('flash');
const modal = document.getElementById('modal');
const modalBox = document.getElementById('modalBox');

// Елементи результату
const prizeImage = document.getElementById('prizeImage');
const prizeName = document.getElementById('prizeName');
const rarityBadge = document.getElementById('rarityBadge');
const countDisplay = document.getElementById('count');

// Список можливого луту
// rarity: common, uncommon, rare, epic, legendary
const lootTable = [
    { name: "Dust Fragment", type: "common", img: "images/stone.png", chance: 50 },
    { name: "Raw Quartz", type: "uncommon", img: "images/stone.png", chance: 80 },
    { name: "Seismic Shard", type: "rare", img: "images/stone.png", chance: 94 },
    { name: "Void Crystal", type: "epic", img: "images/stone.png", chance: 99 },
    { name: "ROCKY THE GOLEM", type: "legendary", img: "images/rocky.png", chance: 100 }
];

let currentPrize = null;

function breakGeode() {
    // 1. Блокуємо кнопку
    breakBtn.disabled = true;
    breakBtn.innerText = "BREAKING...";
    
    // 2. Анімація тряски
    mainImage.classList.remove('floating');
    mainImage.classList.add('shaking');

    // 3. Звук (можна додати new Audio().play())

    // 4. Через 1 секунду — результат
    setTimeout(() => {
        revealPrize();
    }, 1000);
}

function revealPrize() {
    // Зупиняємо анімацію
    mainImage.classList.remove('shaking');
    
    // Ефект спалаху
    flash.classList.add('flash-active');
    setTimeout(() => flash.classList.remove('flash-active'), 500);

    // Визначаємо виграш (Random 0-100)
    const roll = Math.random() * 100;
    currentPrize = lootTable.find(item => roll < item.chance);

    // Оновлюємо лічильник
    count++;
    countDisplay.innerText = count;

    // Налаштовуємо модалку
    prizeImage.src = currentPrize.img;
    prizeName.innerText = currentPrize.name;
    rarityBadge.innerText = currentPrize.type;

    // Скидаємо старі класи кольорів
    modalBox.className = 'modal-box'; 
    // Додаємо новий клас кольору (напр. tier-rare)
    modalBox.classList.add(`tier-${currentPrize.type}`);

    // Показуємо вікно
    modal.style.display = 'flex';
}

function resetGame() {
    modal.style.display = 'none';
    breakBtn.disabled = false;
    breakBtn.innerText = "BREAK GEODE 🔨";
    mainImage.classList.add('floating');
}

function shareResult() {
    // Різний текст залежно від рідкісності
    let tweetText = "";
    
    if (currentPrize.type === 'legendary') {
        tweetText = `🚨 I JUST PULLED A LEGENDARY ROCKY! 🚨\n\nIt took me ${count} tries on the Seismic Geode.\nCan you beat my luck? 💎🔨\n\n@SeismicSys @AleksYastreb`;
    } else {
        tweetText = `I cracked a Seismic Geode and found: ${currentPrize.name} (${currentPrize.type.toUpperCase()}) ✨\n\nTotal opened: ${count}\nTry your luck: https://alekshawk.github.io/seismic-tap-game/\n\n@SeismicSys`;
    }

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, '_blank');
}
