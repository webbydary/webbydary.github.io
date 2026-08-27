// cursor-trail.js — поддержка ПК и мобильных устройств

// 📸 СПИСОК ВАШИХ СТИКЕРОВ
const stickers = [
    'images/stickers/sticker01.png',
    'images/stickers/sticker02.png',
    'images/stickers/sticker03.png',
    'images/stickers/sticker04.png',
    'images/stickers/sticker05.png',
    'images/stickers/sticker06.png',
    'images/stickers/sticker07.png',
    'images/stickers/sticker08.png',
    'images/stickers/sticker09.png',
    'images/stickers/sticker10.png',
    'images/stickers/sticker11.png',
    'images/stickers/sticker12.png',
    'images/stickers/sticker13.png',
    'images/stickers/sticker14.png',
    'images/stickers/sticker15.png',
    'images/stickers/sticker16.png',
    'images/stickers/sticker17.png',
    'images/stickers/sticker18.png',
    'images/stickers/sticker19.png',
    'images/stickers/sticker20.png',
    'images/stickers/sticker21.png',
    'images/stickers/sticker22.png',
    'images/stickers/sticker23.png',
    'images/stickers/sticker24.png',
    'images/stickers/sticker25.png',
    'images/stickers/sticker26.png',
    'images/stickers/sticker27.png',
    'images/stickers/sticker28.png',
    'images/stickers/sticker29.png',
    'images/stickers/sticker30.png',
    'images/stickers/sticker31.png',
    'images/stickers/sticker32.png',
    'images/stickers/sticker33.png',
    'images/stickers/sticker34.png',
    'images/stickers/sticker35.png',
    'images/stickers/sticker36.png',
    'images/stickers/sticker37.png',
    'images/stickers/sticker38.png',
    'images/stickers/sticker39.png',
    'images/stickers/sticker40.png',
    // Добавьте столько, сколько у вас есть
];

// Загружаем изображения
const loadedImages = [];
stickers.forEach((src) => {
    const img = new Image();
    img.src = src;
    loadedImages.push(img);
});

// НАСТРОЙКИ
const CONFIG = {
    MAX_TRAILS: 10,              // Максимальное количество стикеров
    STICKER_SIZE: 40,            // Размер (на мобильных чуть меньше)
    MIN_APPEAR_DELAY: 50,        
    MAX_APPEAR_DELAY: 200,       
    FADE_OUT_DELAY: 700,         
    REMOVE_DELAY: 1100,          
    ROTATION_RANGE: 15,          
    SCALE_MIN: 0.8,              
    SCALE_MAX: 1.1,              
    OPACITY: 0.8,
    SPEED_SMOOTHING: 0.3
};

// 🔍 Проверка — мобильное устройство?
const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile/i.test(navigator.userAgent);

// На мобильных уменьшаем количество и размер для производительности
if (isMobile) {
    CONFIG.MAX_TRAILS = 6;
    CONFIG.STICKER_SIZE = 30;
    CONFIG.MIN_APPEAR_DELAY = 80;
    CONFIG.MAX_APPEAR_DELAY = 250;
    console.log('📱 Мобильный режим: уменьшенная нагрузка');
}

let trailCount = 0;
let lastMoveTime = 0;
let lastX = 0;
let lastY = 0;
let smoothSpeed = 0;

// 📍 Получаем координаты (универсально для мыши и тача)
function getCoordinates(e) {
    if (e.touches) {
        // Это тач-событие (телефон)
        const touch = e.touches[0];
        return { clientX: touch.clientX, clientY: touch.clientY };
    }
    // Это мышь
    return { clientX: e.clientX, clientY: e.clientY };
}

// 🎯 Функция создания стикера
function createSticker(clientX, clientY) {
    // Проверка зоны .headblock
    if (!isInHeadblock(clientX, clientY)) return;
    
    const now = Date.now();
    
    // Вычисляем скорость
    const dx = clientX - lastX;
    const dy = clientY - lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const timeDelta = now - lastMoveTime;
    
    if (timeDelta > 0) {
        const currentSpeed = distance / timeDelta;
        smoothSpeed = smoothSpeed * CONFIG.SPEED_SMOOTHING + currentSpeed * (1 - CONFIG.SPEED_SMOOTHING);
    }
    
    lastX = clientX;
    lastY = clientY;
    
    // Динамическая задержка
    const speedFactor = Math.min(smoothSpeed / 2, 1);
    const dynamicDelay = CONFIG.MAX_APPEAR_DELAY - (CONFIG.MAX_APPEAR_DELAY - CONFIG.MIN_APPEAR_DELAY) * speedFactor;
    
    if (now - lastMoveTime < dynamicDelay) return;
    lastMoveTime = now;
    
    // Создаём стикер
    const randomIndex = Math.floor(Math.random() * loadedImages.length);
    const selectedImage = loadedImages[randomIndex];
    
    const trail = document.createElement('img');
    trail.src = selectedImage.src;
    
    const size = CONFIG.STICKER_SIZE + (Math.random() * 10 - 5);
    const rotation = (Math.random() - 0.5) * CONFIG.ROTATION_RANGE * 2;
    const scale = CONFIG.SCALE_MIN + Math.random() * (CONFIG.SCALE_MAX - CONFIG.SCALE_MIN);
    const speedBoost = 1 + smoothSpeed * 0.3;
    const finalSize = size * Math.min(speedBoost, 1.5);
    
    trail.style.cssText = `
        position: fixed;
        left: ${clientX - finalSize/2}px;
        top: ${clientY - finalSize/2}px;
        width: ${finalSize}px;
        height: ${finalSize}px;
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transform: scale(${scale * 0.3}) rotate(${rotation * 2}deg);
        transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
        object-fit: contain;
        filter: drop-shadow(0 4px 12px rgba(0,0,0,0.12));
    `;
    
    document.body.appendChild(trail);
    
    requestAnimationFrame(() => {
        trail.style.opacity = CONFIG.OPACITY;
        trail.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
    });
    
    setTimeout(() => {
        trail.style.opacity = '0';
        trail.style.transform = `scale(${scale * 0.4}) rotate(${rotation * 1.5}deg) translateY(-20px)`;
        setTimeout(() => trail.remove(), CONFIG.REMOVE_DELAY - CONFIG.FADE_OUT_DELAY);
    }, CONFIG.FADE_OUT_DELAY);
    
    trailCount++;
    if (trailCount > CONFIG.MAX_TRAILS) {
        const allTrails = document.querySelectorAll('img[style*="fixed"]');
        if (allTrails.length > CONFIG.MAX_TRAILS) {
            const oldest = allTrails[0];
            oldest.style.opacity = '0';
            oldest.style.transform = 'scale(0.2)';
            setTimeout(() => oldest.remove(), 400);
        }
        trailCount = CONFIG.MAX_TRAILS;
    }
}

// 🔍 Проверка зоны .headblock
function isInHeadblock(clientX, clientY) {
    const headblock = document.querySelector('.headblock');
    if (!headblock) return false;
    
    const rect = headblock.getBoundingClientRect();
    return clientY >= rect.top && clientY <= rect.bottom;
}

// 🖥️ Событие для мыши (ПК)
document.addEventListener('mousemove', (e) => {
    const coords = getCoordinates(e);
    createSticker(coords.clientX, coords.clientY);
});

// 📱 Событие для тача (телефон)
document.addEventListener('touchmove', (e) => {
    // Предотвращаем скролл только внутри .headblock
    const touch = e.touches[0];
    if (isInHeadblock(touch.clientX, touch.clientY)) {
        e.preventDefault(); // Останавливаем скролл, чтобы стикеры не мешали
    }
    const coords = getCoordinates(e);
    createSticker(coords.clientX, coords.clientY);
}, { passive: false }); // passive: false нужно для preventDefault

// 📱 Начало касания
document.addEventListener('touchstart', (e) => {
    const coords = getCoordinates(e);
    lastX = coords.clientX;
    lastY = coords.clientY;
    lastMoveTime = Date.now();
});

console.log('✅ Стикеры загружены!');
console.log(`📱 Мобильный режим: ${isMobile ? 'ВКЛЮЧЕН' : 'ВЫКЛЮЧЕН'}`);