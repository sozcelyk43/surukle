'use strict';

// --- Oyun Sabitleri ve Verileri ---
const TOTAL_LEVELS = 50;
const lang = {
    tr: {
        level: "Bölüm", next: "Sonraki Bölüm", home: "Anasayfaya Dön",
        score: "Puan", time: "Kalan Süre",
        timeoutTitle: "Süre Bitti!", timeoutMessage: "Maalesef süre doldu. Bölüm sıfırlanıyor.",
        levelCompleteTitle: "Seviye Tamamlandı!", levelCompleteScorePrefix: "Puanınız: ",
        levelCompleteMistakesPrefix: "Hata Sayısı: ",
        gameCompleteTitle: "🎉 Tebrikler, Oyunu Bitirdiniz! 🎉",
        gameCompleteButtonText: "Ana Sayfa",
        starFilled: "★", starEmpty: "☆",
        pause: "Durdur", resume: "Devam Et",
        fruits: "Meyve Festivali", animals: "Vahşi Yaşam", vehicles: "Araç Geçidi",
        sky: "Gökyüzü Macerası", books: "Kitap Kurdu", sports: "Spor Arenası",
        foods: "Lezzet Şöleni", nature: "Doğa Harikaları", music: "Müzik Notası",
        faces: "Emoji Dünyası", misc: "Karışık Eğlence"
    }
};
const currentLangData = lang.tr;

const backgroundColors = [ 
    '#f0f8ff', '#e6f3e6', '#fff3e6', '#ffe6f0', '#f3e6f3', 
    '#e6e6ff', '#e0f7fa', '#e6fff3', '#fff9e6', '#f5f5f5', 
    '#F5E6FF', '#E6FFF5', '#FFE6F0', '#F0E6FF', '#FFF0E6',
    '#FFF9E6', '#E6FFFA', '#FFEEE6', '#EBE6FF', '#FFF0F5',
    '#fadde1', '#fff0f5', '#e6e6fa', '#b0e0e6', '#add8e6' 
];
const emojiPools = { 
    fruits: ['🍎','🍌','🍓','🍇','🍉','🍍','🥭','🥝','🍑','🍒','🥥','🥑','🍋','🍐','🫐','🍈','🍊','🍅','🫒','🫑','🌽','🥕','🫓','🥐','🥯'],
    animals: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🦄','🦓','🦒','🦥','🦦','🦉','🦋','🐌','🐞','🐢','🐍','🦎','🐊','🐳','🐬','🐡','🐠','🐙','🦀','🦞','🦐','🦑','🦢','🦜','🦩','🦚','🦇','🪱','🦠','🦔','🐿️'],
    vehicles: ['🚗','🚕','🚙','🚌','🚑','🚒','🚓','🚚','🚜','🚲','🛵','🏍️','🚀','✈️','🛸','🚁','🚤','🛶','🚢','🚠','🚡','🚂','🚆','🚇','🚈','🛺','🛹','🛴','🛼','🛰️','🛩️'],
    sky: ['☀️','🌙','⭐','☁️','🌈','⚡','☔','❄️','🌀','🌪️','☄️','🌌','🌠','🌥️','🌦️','🫧','💧','💨','☂️','⛱️','🌅','🌄','🌁'],
    books: ['📕','📘','📙','📖','📚','📜','📝','📔','📗','📓','📒','📋','✒️','🧮','📐','🖇️','📌','📏','🖋️','📰','📇','📈','📉','📊','🗓️','📅'],
    sports: ['⚽','🏀','🏈','⚾','🥎','🏐','🎾','🏓','🏸','🥊','🥋','🥅','🏒','🏑','🏏','🏹','🎣','⛷️','🏂','🏋️','🤸','⛹️','🤺','🤾','🏌️','🧘','🏊','🏄','🚣','🚴','🏇','🏆','🥇','🥈','🥉','🏅','🎯','🎱'],
    foods: ['🍔','🌭','🍕','🍟','🌮','🥪','🥙','🧆','🥚','🍳','🥞','🧇','🥓','🥩','🍗','🍖','🦴','🥐','🍞','🥖','🥨','🥯','🧀','🥗','🥫','🧈','🧂','🫙','🍿','🥣','🥡','🍱','🍘','🍙','🍚','🍛','🍜','🍝','🍠','🍢','🍣','🍤','🍥','🥮','🍡','🥟','🥠','🥡','🍦','🍧','🍨','🍩','🍪','🎂','🍰','🧁','🥧','🍫','🍬','🍭','🍮','🍯','🍼','☕','🍵','🧃','🧉','🧊','🥢','🍴','🥄','🔪','🫚','🫘','🫛'],
    nature: ['🌸','🌻','🌷','🌼','🌹','🥀','🌺','🏵️','💐','🌲','🌳','🌴','🌵','🪵','🌿','☘️','🍀','🍁','🍂','🍃','🍄','🐚','🪨','🪵','⛰️','🏔️','🌋','🌊','🏜️','🏝️','🏞️','🏕️','🏖️','🪴','🪺','🪲','🦗'],
    music: ['🎸','🪕','🎺','🥁','🪘','🎻','🪗','🎷','🪈','🎹','🎤','🎧','🎵','🎶','🎼','🎙️','🎚️','🎛️','📻','📯','🔔','🪇','🪘'],
    faces: ['😊','😢','😡','😍','😎','😜','😴','😣','😬','😮','😪','😵','🤯','🥳','🤩','🥸','🥺','🥹','🫠','🫣','🫤','🤔','🫡','🤫','🥴','🤢','🤧','🤠','🤡','👻','👽','🤖','👾','🤓','🧐','🎃'],
    misc: ['💡','💻','📱','⌚','📷','📹','📺','⏰','⏳','⌛','📡','🔋','🔌','🔍','🔎','🧯','🪓','🔧','🔨','🔩','⚙️','🧱','⛓️','🧲','🧪','🧫','🧬','🔬','🔭','💊','💉','🩸','🩹','🩺','🌡️','🚽','🪠','🚿','🛁','🧼','🪥','🪒','🧴','🧻','🧺','🧦','🧤','🧥','🪡','🧵','🧶','👑','💎','💍','🎈','🎉','🎁','🎀','💌','🧧','🎐','🎏','🎎','🪧','🧿','📿','🗿','⚱️','🏺','🔮']
};
const themes = Object.keys(emojiPools);
const SURPRISE_TYPES = [
    { id: 'DOUBLE_POINTS', text: 'ÇİFT PUAN TURU!' },
    { id: 'EXTRA_TIME', text: 'BONUS ZAMAN! (+15sn)' },
    { id: 'BIG_CIRCLES', text: 'DEV DAİRELER TURU!' },
    { id: 'WIGGLE_EMOJIS', text: 'HAREKETLİ EMOJİLER!' },
    { id: 'HINT_ZONE', text: 'İPUCU TURU!' },
    { id: 'SUPER_EMOJI', text: 'SÜPER BAŞLANGIÇ!' }
];

// --- Oyun Durum Yönetimi (State) ---
const game = {
    currentLevel: 0,
    score: 0,
    timeLeft: 30,
    mistakesThisLevel: 0,
    initialTimeForCurrentLevel: 0,
    isPaused: false,
    nextLevelModifier: null, 
    allLevelsData: [],
    levels: [],
    timerInterval: null,
    touchElement: null,
    touchElementClone: null,
};

// --- DOM Elementleri ---
const DOM = {}; 

// --- Yardımcı Fonksiyonlar ---
function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(error => console.warn(`Ses (${soundId}) çalınamadı:`, error));
    }
}

function calculateStars(timeRem, mistakesMade, maxTime) {
    let stars = 0;
    if (maxTime <= 0) return 1; 
    const timePercentage = (timeRem / maxTime) * 100;

    if (mistakesMade === 0) {
        if (timePercentage >= 70) stars = 3; 
        else if (timePercentage >= 40) stars = 2;
        else stars = 1;
    } else if (mistakesMade === 1) {
        if (timePercentage >= 50) stars = 2;
        else stars = 1;
    } else { 
        stars = 1;
    }
    return Math.max(1, stars);
}

// --- Modal Fonksiyonları ---
function showTimeoutModal() {
    if (!DOM.timeoutModalEl) return;
    DOM.timeoutModalTitleEl.textContent = currentLangData.timeoutTitle;
    DOM.timeoutModalMessageEl.textContent = currentLangData.timeoutMessage;
    DOM.timeoutModalEl.style.display = 'flex';
    DOM.timeoutModalOkBtnEl.onclick = () => {
        hideTimeoutModal();
        loadLevel(game.currentLevel);
    };
}
function hideTimeoutModal() { if(DOM.timeoutModalEl) DOM.timeoutModalEl.style.display = 'none'; }

function showLevelCompleteModal() {
    if (!DOM.levelCompleteModalEl || !DOM.levelCompleteModalEl.querySelector('.modal-content')) return;
    const modalContent = DOM.levelCompleteModalEl.querySelector('.modal-content');
    modalContent.classList.remove('game-won-modal-enhancement');

    DOM.levelCompleteModalScoreEl.textContent = game.score;
    const starsWon = calculateStars(game.timeLeft, game.mistakesThisLevel, game.initialTimeForCurrentLevel);
    
    if (game.allLevelsData[game.currentLevel]) {
        game.allLevelsData[game.currentLevel].stars = starsWon;
        game.allLevelsData[game.currentLevel].mistakes = game.mistakesThisLevel;
    }

    DOM.levelCompleteModalStarsEl.textContent = (currentLangData.starFilled || "★").repeat(starsWon) + (currentLangData.starEmpty || "☆").repeat(3 - starsWon);
    DOM.levelCompleteModalMistakesValueEl.textContent = game.mistakesThisLevel;
    if(DOM.levelCompleteModalMistakesTextEl.childNodes.length > 0) { 
         DOM.levelCompleteModalMistakesTextEl.childNodes[0].nodeValue = currentLangData.levelCompleteMistakesPrefix || "Hata Sayısı: "; 
    }
    
    const nextButtonAction = () => {
        hideLevelCompleteModal();
        // Tek sayılı seviyeler (index 0, 2, 4...) tamamlandıktan sonra sürpriz göster
        if ((game.currentLevel + 1) % 2 === 1 && game.currentLevel < TOTAL_LEVELS - 1) {
            showSurpriseScreen();
        } else {
            game.currentLevel++;
            loadLevel(game.currentLevel);
        }
    };

    if (game.currentLevel >= TOTAL_LEVELS - 1) { // Oyun Bitti
        DOM.levelCompleteModalTitleEl.textContent = currentLangData.gameCompleteTitle;
        DOM.modalNextLevelBtnEl.textContent = currentLangData.gameCompleteButtonText;
        DOM.modalNextLevelBtnEl.onclick = () => { hideLevelCompleteModal(); showHomeScreen(); };
        modalContent.classList.add('game-won-modal-enhancement'); 
    } else { // Sonraki seviye var
        DOM.levelCompleteModalTitleEl.textContent = currentLangData.levelCompleteTitle;
        DOM.modalNextLevelBtnEl.textContent = currentLangData.next;
        DOM.modalNextLevelBtnEl.onclick = nextButtonAction;
    }
    DOM.levelCompleteModalEl.style.display = 'flex';
}
function hideLevelCompleteModal() { 
    if(DOM.levelCompleteModalEl) {
        DOM.levelCompleteModalEl.style.display = 'none';
        const modalContent = DOM.levelCompleteModalEl.querySelector('.modal-content');
        if(modalContent) modalContent.classList.remove('game-won-modal-enhancement');
    }
}

// --- Sürpriz Mekaniği Fonksiyonları ---
function showSurpriseScreen() {
    if (!DOM.surpriseScreenEl || !DOM.surpriseBoxEl || !DOM.mascotEl || !DOM.surpriseMessageEl) return;
    DOM.mascotEl.classList.add('show');
    DOM.surpriseMessageEl.classList.add('hidden');
    DOM.surpriseBoxEl.classList.remove('hidden');
    DOM.surpriseScreenEl.classList.remove('hidden');
    
    const handleSurpriseClick = () => {
        DOM.surpriseBoxEl.removeEventListener('click', handleSurpriseClick);
        const randomSurprise = SURPRISE_TYPES[Math.floor(Math.random() * SURPRISE_TYPES.length)];
        game.nextLevelModifier = randomSurprise.id; 
        
        DOM.surpriseBoxEl.classList.add('hidden');
        DOM.surpriseMessageEl.textContent = randomSurprise.text;
        DOM.surpriseMessageEl.classList.remove('hidden');

        setTimeout(() => {
            DOM.surpriseScreenEl.classList.add('hidden');
            DOM.mascotEl.classList.remove('show'); 
            game.currentLevel++;
            loadLevel(game.currentLevel);
        }, 2500);
    };
    DOM.surpriseBoxEl.addEventListener('click', handleSurpriseClick);
}

// --- Ana Ekran/Oyun Ekranı Geçişleri ---
function showHomeScreen() {
    if (!DOM.gameScreenEl || !DOM.homeScreenEl || !DOM.pauseResumeBtnEl || !currentLangData) return;
    DOM.gameScreenEl.classList.remove('show');
    game.isPaused = false; 
    DOM.pauseResumeBtnEl.textContent = currentLangData.pause || "Durdur";

    setTimeout(() => {
        DOM.gameScreenEl.style.display = 'none';
        DOM.homeScreenEl.style.display = 'flex'; 
        setTimeout(() => DOM.homeScreenEl.classList.add('show'), 10);
    }, 500);
    document.body.style.backgroundColor = '#eef2f7'; 
    clearInterval(game.timerInterval);
}

function showGameScreen() {
    if (!DOM.homeScreenEl || !DOM.gameScreenEl || !DOM.pauseResumeBtnEl || !currentLangData) {
        console.error("showGameScreen için gerekli DOM elementlerinden biri veya 'currentLangData' eksik. Fonksiyon durduruldu.");
        return;
    }
    console.log("Oyuna Başla butonu tıklandı, oyun ekranı hazırlanıyor...");
    DOM.homeScreenEl.classList.remove('show');
    game.isPaused = false; 
    DOM.pauseResumeBtnEl.textContent = currentLangData.pause || "Durdur"; 
    
    setTimeout(() => {
        DOM.homeScreenEl.style.display = 'none';
        DOM.gameScreenEl.style.display = 'flex'; 

        game.currentLevel = 0;
        game.score = 0;
        game.mistakesThisLevel = 0; 
        
        game.allLevelsData.forEach(data => { if(data) { data.stars = 0; data.mistakes = 0; } });

        loadLevel(game.currentLevel); 

        setTimeout(() => DOM.gameScreenEl.classList.add('show'), 10);
    }, 500); 
}

// --- Oyun Mantığı Fonksiyonları ---
function getLevelItems(levelIndex) {
    const themeIndex = Math.floor(levelIndex / 3) % themes.length;
    const currentTheme = themes[themeIndex];
    let targetItemCount = 3 + Math.floor(levelIndex / 5);
    targetItemCount = Math.min(targetItemCount, 8);
    
    const fullPool = emojiPools[currentTheme] || ['❓'];
    let itemsToAvoid = new Set();
    if (levelIndex > 0 && game.allLevelsData[levelIndex - 1] && game.allLevelsData[levelIndex - 1].itemsUsed) {
        itemsToAvoid = game.allLevelsData[levelIndex - 1].itemsUsed;
    }

    let candidateTargetPool = fullPool.filter(pItem => !itemsToAvoid.has(pItem));
    if (candidateTargetPool.length < targetItemCount) {
        const needed = targetItemCount - candidateTargetPool.length;
        const fallbacks = fullPool.filter(pItem => itemsToAvoid.has(pItem) && !candidateTargetPool.includes(pItem))
                                .sort(() => 0.5 - Math.random()).slice(0, needed);
        candidateTargetPool.push(...fallbacks);
    }
    if (candidateTargetPool.length < targetItemCount) {
        const originalPoolCopy = [...fullPool].sort(() => 0.5 - Math.random());
        candidateTargetPool = originalPoolCopy;
        if (candidateTargetPool.length < targetItemCount) {
            targetItemCount = candidateTargetPool.length; 
        }
    }
    
    const shuffledTargetsPool = [...candidateTargetPool].sort(() => 0.5 - Math.random());
    const actualTargets = shuffledTargetsPool.slice(0, targetItemCount);
    
    if(game.allLevelsData[levelIndex]) {
        game.allLevelsData[levelIndex].itemsUsed = new Set(actualTargets);
    }

    let distractors = [];
    if (targetItemCount >= 3 && fullPool.length > targetItemCount) {
         let numDistractors = Math.floor(targetItemCount / 3) + (levelIndex > 10 ? 1 : 0) ;
         numDistractors = Math.min(numDistractors, 3); 
         let distractorBasePool = fullPool.filter(pItem => !actualTargets.includes(pItem));
         let distractorCandidatePool = distractorBasePool.filter(pItem => !itemsToAvoid.has(pItem));
         if (distractorCandidatePool.length < numDistractors) {
            distractorCandidatePool = distractorBasePool;
         }
         distractors = [...distractorCandidatePool].sort(() => 0.5 - Math.random()).slice(0, numDistractors);
    }
    const allDraggableItems = [...actualTargets, ...distractors].sort(() => 0.5 - Math.random());
    
    return { 
        itemsForDragging: allDraggableItems.length > 0 ? allDraggableItems : ['❓'],
        targets: actualTargets.length > 0 ? [...actualTargets].sort(() => 0.5 - Math.random()) : ['❓'],
        theme: currentTheme 
    };
}

function updateUIText(activeModifier) {
    if (!game.levels[game.currentLevel] || !DOM.gameTitleEl || !DOM.levelIndicatorEl || !DOM.scoreEl || !DOM.bonusIndicatorEl) return;
    const currentLevelData = game.levels[game.currentLevel];
    const currentThemeKey = currentLevelData.theme;

    DOM.gameTitleEl.textContent = (currentLangData && currentLangData[currentThemeKey]) ? currentLangData[currentThemeKey] : "Oyun";
    DOM.levelIndicatorEl.textContent = `${currentLangData.level || "Bölüm"}: ${game.currentLevel + 1}`;
    DOM.scoreEl.textContent = `${currentLangData.score || "Puan"}: ${game.score}`;
    
    const surpriseInfo = SURPRISE_TYPES.find(s => s.id === activeModifier);
    if(surpriseInfo) {
        DOM.bonusIndicatorEl.textContent = surpriseInfo.text;
        DOM.bonusIndicatorEl.classList.remove('hidden');
    } else {
        DOM.bonusIndicatorEl.classList.add('hidden');
    }
}

function startTimer(activeModifier) {
    if (game.isPaused) return; 
    clearInterval(game.timerInterval);
    const currentLevelData = game.levels[game.currentLevel];
    if (!currentLevelData || !currentLevelData.targets || !DOM.timerEl || !currentLangData) { return; }

    const itemsInLevel = currentLevelData.targets.length; 
    let baseTimePerItem = 9 - Math.floor(game.currentLevel / 8); 
    baseTimePerItem = Math.max(5, baseTimePerItem); 
    
    if (game.timeLeft <= 0 || game.initialTimeForCurrentLevel === 0 || !game.isPaused) { 
         let newTimeCalc = (itemsInLevel * baseTimePerItem) + 5;
         if (currentLevelData.itemsForDragging.length > itemsInLevel) {
             newTimeCalc += (currentLevelData.itemsForDragging.length - itemsInLevel) * 2.5; 
         }
         if(activeModifier === 'EXTRA_TIME') newTimeCalc += 15;
         game.timeLeft = Math.floor(newTimeCalc);
         game.timeLeft = Math.max(15, Math.min(game.timeLeft, 80)); 
         game.initialTimeForCurrentLevel = game.timeLeft; 
    }
    
    DOM.timerEl.textContent = `${currentLangData.time || "Süre"}: ${game.timeLeft}`;
    DOM.timerEl.classList.remove('warning');
    const intervalDelay = 1000;

    game.timerInterval = setInterval(() => {
        if (game.isPaused) return; 
        game.timeLeft--;
        DOM.timerEl.textContent = `${currentLangData.time || "Süre"}: ${game.timeLeft}`;
        if (game.timeLeft <= 10 && game.timeLeft > 0) { DOM.timerEl.classList.add('warning'); } 
        else { DOM.timerEl.classList.remove('warning'); }
        if (game.timeLeft <= 0) {
            clearInterval(game.timerInterval);
            DOM.timerEl.classList.remove('warning');
            showTimeoutModal();
        }
    }, intervalDelay);
}

function loadLevel(levelIndex) {
    console.log(`Seviye ${levelIndex + 1} yükleniyor...`);
    const modifier = game.nextLevelModifier; 
    game.nextLevelModifier = null;

    if (!DOM.draggableItemsContainerEl || !DOM.dropZonesContainerEl || !DOM.gameScreenEl || !DOM.pauseResumeBtnEl || !currentLangData) return;

    clearInterval(game.timerInterval);
    game.mistakesThisLevel = 0;
    game.isPaused = false; 
    DOM.pauseResumeBtnEl.textContent = currentLangData.pause || "Durdur";
    DOM.draggableItemsContainerEl.innerHTML = '';
    DOM.dropZonesContainerEl.innerHTML = '';

    const bgThemeIndex = Math.floor(levelIndex / 3);
    document.body.style.backgroundColor = backgroundColors[bgThemeIndex % backgroundColors.length];

    const levelData = game.levels[levelIndex];
    if (!levelData || !levelData.itemsForDragging || !levelData.targets) { showHomeScreen(); return; }
    
    const shuffledDraggableItems = levelData.itemsForDragging;
    const shuffledTargets = levelData.targets;
    
    let baseDiameter = modifier === 'BIG_CIRCLES' ? 140 : 115;
    const gameScreenWidthVal = DOM.gameScreenEl.offsetWidth || 600;
    if (gameScreenWidthVal < 380) baseDiameter *= 0.75; 
    else if (gameScreenWidthVal < 600) baseDiameter *= 0.9;

    let scaleFactor = 1.0;
    if (shuffledDraggableItems.length > 3) scaleFactor -= (shuffledDraggableItems.length - 3) * 0.06; 
    scaleFactor -= (Math.floor(levelIndex / 10)) * 0.03; 
    scaleFactor = Math.max(0.70, scaleFactor); 

    const itemDiameter = Math.floor(baseDiameter * scaleFactor);
    const zoneDiameter = Math.floor(itemDiameter * 1.15); 
    const itemFontSize = Math.floor(itemDiameter * 0.52); 
    const zoneFontSize = Math.floor(zoneDiameter * 0.50);

    let hintTarget = null;
    if (modifier === 'HINT_ZONE' && shuffledTargets.length > 0) {
        hintTarget = shuffledTargets[Math.floor(Math.random() * shuffledTargets.length)];
    }

    shuffledDraggableItems.forEach(itemText => {
        const draggableItem = document.createElement('div');
        draggableItem.classList.add('draggable-item');
        if(modifier === 'WIGGLE_EMOJIS') draggableItem.classList.add('wiggle');
        draggableItem.textContent = itemText;
        draggableItem.draggable = true;
        draggableItem.setAttribute('tabindex', '0');
        Object.assign(draggableItem.style, { width: `${itemDiameter}px`, height: `${itemDiameter}px`, fontSize: `${itemFontSize}px` });
        draggableItem.addEventListener('dragstart', dragStart);
        draggableItem.addEventListener('dragend', dragEnd);
        draggableItem.addEventListener('touchstart', touchStart, { passive: false });
        draggableItem.addEventListener('touchmove', touchMove, { passive: false });
        draggableItem.addEventListener('touchend', (e) => touchEnd(e, modifier));
        DOM.draggableItemsContainerEl.appendChild(draggableItem);
    });

    shuffledTargets.forEach(targetText => {
        const dropZone = document.createElement('div');
        dropZone.classList.add('drop-zone');
        if(targetText === hintTarget) dropZone.classList.add('sparkle');
        dropZone.dataset.target = targetText; 
        dropZone.textContent = targetText; 
        Object.assign(dropZone.style, { width: `${zoneDiameter}px`, height: `${zoneDiameter}px`, fontSize: `${zoneFontSize}px` });
        dropZone.addEventListener('dragover', dragOver);
        dropZone.addEventListener('drop', e => drop(e, modifier));
        DOM.dropZonesContainerEl.appendChild(dropZone);
    });

    if(modifier === 'SUPER_EMOJI' && shuffledTargets.length > 0) {
        const targetToPlace = shuffledTargets[0];
        const draggableToDisable = [...DOM.draggableItemsContainerEl.childNodes].find(el => el.textContent === targetToPlace);
        const dropZoneToFill = [...DOM.dropZonesContainerEl.childNodes].find(el => el.dataset.target === targetToPlace);
        if(draggableToDisable && dropZoneToFill) {
            setTimeout(() => handleDrop(dropZoneToFill, targetToPlace, draggableToDisable, modifier, true), 100);
        }
    }
    
    updateUIText(modifier); 
    game.timeLeft = 0; game.initialTimeForCurrentLevel = 0; 
    startTimer(modifier);
}

// --- Sürükle-Bırak Olayları ---
function dragStart(event) { if (event.target.classList.contains('disabled')) return; event.target.style.opacity = '0.5'; event.dataTransfer.setData('text', event.target.textContent); }
function dragEnd(event) { event.target.style.opacity = '1'; }
function dragOver(event) { event.preventDefault(); }

function touchStart(event) {
    if (event.target.classList.contains('disabled') || (game.touchElement)) return; 
    event.preventDefault();
    game.touchElement = event.target;
    game.touchElementClone = game.touchElement.cloneNode(true);
    Object.assign(game.touchElementClone.style, { position: 'fixed', zIndex: '1001', opacity: '0.75', pointerEvents: 'none', width: game.touchElement.style.width, height: game.touchElement.style.height, fontSize: game.touchElement.style.fontSize, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: getComputedStyle(game.touchElement).backgroundColor, borderColor: getComputedStyle(game.touchElement).borderColor, borderWidth: getComputedStyle(game.touchElement).borderWidth, borderStyle: getComputedStyle(game.touchElement).borderStyle, boxShadow: '0 5px 15px rgba(0,0,0,0.2)' });
    document.body.appendChild(game.touchElementClone);
    const touch = event.touches[0];
    game.touchElementClone.style.left = `${touch.clientX - game.touchElementClone.offsetWidth / 2}px`;
    game.touchElementClone.style.top = `${touch.clientY - game.touchElementClone.offsetHeight / 2}px`;
    game.touchElement.style.opacity = '0.4'; 
}
function touchMove(event) {
    if (!game.touchElementClone || !game.touchElement) return;
    event.preventDefault();
    const touch = event.touches[0];
    game.touchElementClone.style.left = `${touch.clientX - game.touchElementClone.offsetWidth / 2}px`;
    game.touchElementClone.style.top = `${touch.clientY - game.touchElementClone.offsetHeight / 2}px`;
}
function touchEnd(event, modifier) {
    if (!game.touchElement || !game.touchElementClone) return;
    if (document.body.contains(game.touchElementClone)) document.body.removeChild(game.touchElementClone);
    game.touchElementClone = null;
    game.touchElement.style.opacity = '1';
    const touch = event.changedTouches[0];
    const localTouchElement = game.touchElement; 
    game.touchElement = null; 

    const dropZone = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.drop-zone');
    if (dropZone) handleDrop(dropZone, localTouchElement.textContent, localTouchElement, modifier);
}
function drop(event, modifier) {
    event.preventDefault();
    const droppedItemText = event.dataTransfer.getData('text');
    const targetZone = event.target.closest('.drop-zone');
    let draggedElement = null;
    if(DOM.draggableItemsContainerEl) {
        const draggableItemsNodeList = DOM.draggableItemsContainerEl.querySelectorAll('.draggable-item');
        for (let i = 0; i < draggableItemsNodeList.length; i++) {
            if (draggableItemsNodeList[i].textContent === droppedItemText && !draggableItemsNodeList[i].classList.contains('disabled')) {
                draggedElement = draggableItemsNodeList[i]; break; 
            }
        }
    }
    if (targetZone && draggedElement) handleDrop(targetZone, droppedItemText, draggedElement, modifier);
}

function handleDrop(targetZone, droppedItemText, draggedElement, modifier, isInitialPlacement = false) {
    if (!DOM.scoreEl || !game.levels[game.currentLevel] || !DOM.dropZonesContainerEl) return;

    targetZone.classList.remove('animate-correct', 'animate-incorrect');
    Object.assign(targetZone.style, {backgroundColor: '', borderColor: ''});

    if (targetZone.dataset.target === droppedItemText && !targetZone.classList.contains('correct')) {
        targetZone.textContent = droppedItemText; 
        targetZone.classList.add('correct');
        targetZone.classList.add('animate');
        
        let pointsToAdd = 10;
        if(modifier === 'DOUBLE_POINTS') pointsToAdd = 20;
        
        if (!isInitialPlacement) game.score += pointsToAdd;
        
        if(!isInitialPlacement) playSound('correct-sound');
        if (draggedElement) {
            draggedElement.classList.add('disabled');
            draggedElement.draggable = false;
        }
        targetZone.addEventListener('animationend', () => targetZone.classList.remove('animate'), { once: true });
    } else if (!targetZone.classList.contains('correct')) { 
        targetZone.classList.add('animate-incorrect');
        if (!isInitialPlacement) {
            game.score = Math.max(0, game.score - 5);
            game.mistakesThisLevel++; 
            playSound('wrong-sound');
        }
        targetZone.addEventListener('animationend', () => {
            targetZone.classList.remove('animate-incorrect');
            Object.assign(targetZone.style, {backgroundColor: '', borderColor: ''});  
        }, { once: true });
    }

    DOM.scoreEl.textContent = `${currentLangData.score || "Puan"}: ${game.score}`;
    DOM.scoreEl.classList.remove('animate'); 
    void DOM.scoreEl.offsetWidth; 
    DOM.scoreEl.classList.add('animate');

    const currentLevelTargets = game.levels[game.currentLevel].targets;
    const correctDropZones = DOM.dropZonesContainerEl.querySelectorAll('.drop-zone.correct');

    if (currentLevelTargets.length > 0 && correctDropZones.length === currentLevelTargets.length) {
        clearInterval(game.timerInterval);
        playSound('complete-sound');
        showLevelCompleteModal();
    }
}

function init() {
    console.log("Oyun başlatılıyor ve DOM elementleri atanıyor...");
    // DOM elementlerini ata
    DOM.timeoutModalEl = document.getElementById('timeout-modal');
    DOM.timeoutModalTitleEl = document.getElementById('timeout-modal-title');
    DOM.timeoutModalMessageEl = document.getElementById('modal-message');
    DOM.timeoutModalOkBtnEl = document.getElementById('modal-ok-btn');
    DOM.levelCompleteModalEl = document.getElementById('level-complete-modal');
    DOM.levelCompleteModalTitleEl = document.getElementById('level-complete-modal-title');
    DOM.levelCompleteModalScoreEl = document.getElementById('level-score-value');
    DOM.levelCompleteModalStarsEl = document.getElementById('level-stars');
    DOM.levelCompleteModalMistakesTextEl = document.getElementById('level-mistakes-text');
    DOM.levelCompleteModalMistakesValueEl = document.getElementById('level-mistakes-value');
    DOM.modalNextLevelBtnEl = document.getElementById('modal-next-level-btn');
    DOM.modalHomeBtnEl = document.getElementById('modal-home-btn');
    DOM.rulesModalEl = document.getElementById('rules-modal');
    DOM.showRulesBtnEl = document.getElementById('show-rules-btn');
    DOM.closeRulesModalBtnEl = document.getElementById('close-rules-modal-btn');
    DOM.pauseResumeBtnEl = document.getElementById('pause-resume-btn');
    DOM.gameHomeBtnEl = document.getElementById('game-home-btn'); 
    DOM.startBtnEl = document.getElementById('start-btn'); 
    DOM.gameScreenEl = document.getElementById('game-screen');
    DOM.homeScreenEl = document.getElementById('home-screen');
    DOM.gameTitleEl = document.getElementById('game-title');
    DOM.scoreEl = document.getElementById('score');
    DOM.timerEl = document.getElementById('timer');
    DOM.levelIndicatorEl = document.getElementById('level-indicator');
    DOM.draggableItemsContainerEl = document.getElementById('draggable-items');
    DOM.dropZonesContainerEl = document.getElementById('drop-zones');
    DOM.surpriseScreenEl = document.getElementById('surprise-screen');
    DOM.surpriseBoxEl = document.getElementById('surprise-box-closed');
    DOM.surpriseMessageEl = document.getElementById('surprise-message');
    DOM.mascotEl = document.getElementById('mascot-container');
    DOM.bonusIndicatorEl = document.getElementById('bonus-indicator');

    // Oyun verilerini initialize et
    game.allLevelsData = Array(TOTAL_LEVELS).fill(null).map(() => ({ itemsUsed: new Set(), stars: 0, mistakes: 0 }));
    game.levels = Array.from({ length: TOTAL_LEVELS }, (_, i) => getLevelItems(i));

    // Olay dinleyicilerini ata
    if(DOM.startBtnEl) {
        DOM.startBtnEl.addEventListener('click', showGameScreen);
    } else {
        console.error("HATA: 'Oyuna Başla' butonu (id='start-btn') HTML içinde bulunamadı.");
    }

    if(DOM.showRulesBtnEl) {
        DOM.showRulesBtnEl.addEventListener('click', () => { if(DOM.rulesModalEl) DOM.rulesModalEl.style.display = 'flex'; });
    }
    
    if(DOM.closeRulesModalBtnEl) {
        DOM.closeRulesModalBtnEl.addEventListener('click', () => { if(DOM.rulesModalEl) DOM.rulesModalEl.style.display = 'none'; });
    }
    
    if(DOM.modalHomeBtnEl) {
        DOM.modalHomeBtnEl.addEventListener('click', () => { hideLevelCompleteModal(); showHomeScreen(); });
    }
    
    if(DOM.pauseResumeBtnEl) {
        DOM.pauseResumeBtnEl.addEventListener('click', () => {
            game.isPaused = !game.isPaused;
            if (game.isPaused) {
                clearInterval(game.timerInterval); 
                DOM.pauseResumeBtnEl.textContent = currentLangData.resume || "Devam Et";
            } else {
                startTimer(game.levels[game.currentLevel]?.modifier); // Mevcut modifier ile devam et
                DOM.pauseResumeBtnEl.textContent = currentLangData.pause || "Durdur";
            }
        });
    }
    if(DOM.gameHomeBtnEl) {
        DOM.gameHomeBtnEl.addEventListener('click', showHomeScreen);
    }

    // Oyunu başlat
    showHomeScreen();
}

// script.js dosyasının sonunda init() fonksiyonunu çağırarak oyunu başlat
init();