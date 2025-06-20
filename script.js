'use strict';

const TOTAL_LEVELS = 50;
const lang = {
    tr: {
        level: "Bölüm", next: "Sonraki Bölüm", home: "Anasayfaya Dön",
        score: "Puan", time: "Kalan Süre",
        timeoutTitle: "Süre Bitti!", timeoutMessage: "Maalesef süre doldu. Bölüm sıfırlanıyor.",
        levelCompleteTitle: "Seviye Tamamlandı!",
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
const backgroundColors = ['#f0f8ff', '#e6f3e6', '#fff3e6', '#ffe6f0', '#f3e6f3', '#e6e6ff', '#e0f7fa', '#e6fff3', '#fff9e6', '#f5f5f5', '#F5E6FF', '#E6FFF5', '#FFE6F0', '#F0E6FF', '#FFF0E6', '#FFF9E6', '#E6FFFA', '#FFEEE6', '#EBE6FF', '#FFF0F5', '#fadde1', '#fff0f5', '#e6e6fa', '#b0e0e6', '#add8e6'];
const emojiPools = {
    fruits: ['🍎', '🍌', '🍓', '🍇', '🍉', '🍍', '🥭', '🥝', '🍑', '🍒', '🥥', '🥑', '🍋', '🍐', '🫐', '🍈', '🍊', '🍅'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🦄', '🦓', '🦒', '🦉', '🦋', '🐞', '🐢'],
    vehicles: ['🚗', '🚕', '🚙', '🚌', '🚑', '🚒', '🚓', '🚚', '🚜', '🚲', '🛵', '🏍️', '🚀', '✈️', '🛸', '🚁', '🚤', '🚢', '🚂', '🚆', '🚇'],
    sky: ['☀️', '🌙', '⭐', '☁️', '🌈', '⚡', '☔', '❄️', '🌀', '🌪️', '☄️', '🌌', '🌠', '🌥️', '🌦️', '🫧', '💧', '💨'],
    books: ['📕', '📘', '📙', '📖', '📚', '📜', '📝', '📔', '📗', '📓', '📒', '📋', '✒️', '📏', '🖋️', '📰', '📊', '🗓️'],
    sports: ['⚽', '🏀', '🏈', '⚾', '🥎', '🏐', '🎾', '🏓', '🥊', '🥋', '🥅', '🏒', '🏹', '🎣', '🏋️', '🤸', '🏊', '🏄', '🏆'],
    foods: ['🍔', '🍕', '🍟', '🌮', '🥪', '🍳', '🥞', '🧇', '🍗', '🍖', '🍞', '🥨', '🧀', '🍿', '🍣', '🍦', '🍩', '🍪', '🎂', '🍫', '🍬', '🍭', '☕'],
    nature: ['🌸', '🌻', '🌷', '🌼', '🌹', '🌺', '🌲', '🌳', '🌴', '🌵', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🍄', '🐚', '🌊'],
    music: ['🎸', '🎺', '🥁', '🎻', '🎷', '🎹', '🎤', '🎧', '🎵', '🎶', '🎼'],
    faces: ['😊', '😢', '😡', '😍', '😎', '😜', '😴', '😬', '😮', '😵', '🥳', '🤩', '🥺', '🤔', '🤫', '🤢', '🤠', '🤡', '👻', '👽', '🤖'],
    misc: ['💡', '💻', '📱', '⌚', '📷', '📺', '⏰', '⏳', '🔋', '🔌', '🔍', '🔧', '🔨', '⚙️', '🧪', '🔬', '🔭', '💊', '💉', '💎', '🎁']
};
const themes = Object.keys(emojiPools);
const SURPRISE_TYPES = [
    { id: 'DOUBLE_POINTS', text: 'ÇİFT PUAN TURU!' }, { id: 'EXTRA_TIME', text: 'BONUS ZAMAN! (+15sn)' },
    { id: 'BIG_CIRCLES', text: 'DEV DAİRELER TURU!' }, { id: 'WIGGLE_EMOJIS', text: 'HAREKETLİ EMOJİLER!' },
    { id: 'HINT_ZONE', text: 'İPUCU TURU!' }, { id: 'SUPER_EMOJI', text: 'SÜPER BAŞLANGIÇ!' }
];

const game = {
    currentLevel: 0, score: 0, timeLeft: 30, mistakesThisLevel: 0, initialTimeForCurrentLevel: 0,
    isPaused: false, nextLevelModifier: null, allLevelsData: [], levels: [], timerInterval: null,
    touchElement: null, touchElementClone: null,
};

const DOM = {};

function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) { sound.currentTime = 0; sound.play().catch(e => {}); }
}

function calculateStars(timeRem, mistakesMade, maxTime) {
    let stars = 0;
    if (maxTime <= 0) return 1;
    const timePercentage = (timeRem / maxTime) * 100;
    if (mistakesMade === 0) {
        if (timePercentage >= 70) stars = 3; else if (timePercentage >= 40) stars = 2; else stars = 1;
    } else if (mistakesMade <= 2) {
        if (timePercentage >= 50) stars = 2; else stars = 1;
    } else { stars = 1; }
    return Math.max(1, stars);
}

function showModal(modalEl, show = true) {
    if (modalEl) {
       modalEl.style.display = show ? 'flex' : 'none';
    }
}

function showTimeoutModal() {
    if (DOM.timeoutModalTitleEl) DOM.timeoutModalTitleEl.textContent = currentLangData.timeoutTitle;
    if (DOM.modalMessageEl) DOM.modalMessageEl.textContent = currentLangData.timeoutMessage;
    if (DOM.modalOkBtnEl) DOM.modalOkBtnEl.textContent = "Tamam";
    showModal(DOM.timeoutModalEl);
    if (DOM.modalOkBtnEl) {
        DOM.modalOkBtnEl.onclick = () => { showModal(DOM.timeoutModalEl, false); loadLevel(game.currentLevel); };
    }
}

function showLevelCompleteModal() {
    const starsWon = calculateStars(game.timeLeft, game.mistakesThisLevel, game.initialTimeForCurrentLevel);
    if (game.allLevelsData[game.currentLevel]) {
        game.allLevelsData[game.currentLevel].stars = starsWon;
        game.allLevelsData[game.currentLevel].mistakes = game.mistakesThisLevel;
    }
    if (DOM.levelScoreValueEl) DOM.levelScoreValueEl.textContent = game.score;
    if (DOM.levelStarsEl) DOM.levelStarsEl.innerHTML = (currentLangData.starFilled).repeat(starsWon) + (currentLangData.starEmpty).repeat(3 - starsWon);
    if (DOM.levelMistakesValueEl) DOM.levelMistakesValueEl.textContent = game.mistakesThisLevel;

    const nextButtonAction = () => {
        showModal(DOM.levelCompleteModalEl, false);
        if ((game.currentLevel + 1) % 2 === 1 && game.currentLevel < TOTAL_LEVELS - 1) {
            showSurpriseScreen();
        } else {
            game.currentLevel++;
            loadLevel(game.currentLevel);
        }
    };

    if (game.currentLevel >= TOTAL_LEVELS - 1) {
        if (DOM.levelCompleteModalTitleEl) DOM.levelCompleteModalTitleEl.textContent = currentLangData.gameCompleteTitle;
        if (DOM.modalNextLevelBtnEl) {
            DOM.modalNextLevelBtnEl.textContent = currentLangData.gameCompleteButtonText;
            DOM.modalNextLevelBtnEl.onclick = () => { showModal(DOM.levelCompleteModalEl, false); showHomeScreen(); };
        }
    } else {
        if (DOM.levelCompleteModalTitleEl) DOM.levelCompleteModalTitleEl.textContent = currentLangData.levelCompleteTitle;
        if (DOM.modalNextLevelBtnEl) {
            DOM.modalNextLevelBtnEl.textContent = currentLangData.next;
            DOM.modalNextLevelBtnEl.onclick = nextButtonAction;
        }
    }
    showModal(DOM.levelCompleteModalEl);
}

function showSurpriseScreen() {
    if (!DOM.surpriseScreenEl) return;
    DOM.surpriseMessageEl.classList.add('hidden');
    DOM.surpriseBoxClosedEl.classList.remove('hidden');
    DOM.surpriseScreenEl.classList.remove('hidden');
    DOM.surpriseScreenEl.classList.add('show');

    const handleSurpriseClick = () => {
        DOM.surpriseBoxClosedEl.removeEventListener('click', handleSurpriseClick);
        const randomSurprise = SURPRISE_TYPES[Math.floor(Math.random() * SURPRISE_TYPES.length)];
        game.nextLevelModifier = randomSurprise.id;
        DOM.surpriseBoxClosedEl.classList.add('hidden');
        DOM.surpriseMessageEl.textContent = randomSurprise.text;
        DOM.surpriseMessageEl.classList.remove('hidden');
        setTimeout(() => {
            DOM.surpriseScreenEl.classList.remove('show');
            game.currentLevel++;
            loadLevel(game.currentLevel);
        }, 2500);
    };
    if (DOM.surpriseBoxClosedEl) DOM.surpriseBoxClosedEl.addEventListener('click', handleSurpriseClick);
}

function showHomeScreen() {
    if (game.timerInterval) clearInterval(game.timerInterval);
    game.isPaused = false;
    if (DOM.gameScreenEl) DOM.gameScreenEl.classList.remove('show');
    if (DOM.homeScreenEl) DOM.homeScreenEl.classList.add('show');
    document.body.style.backgroundColor = '#87CEEB';
}

function showGameScreen() {
    if(DOM.homeScreenEl) DOM.homeScreenEl.classList.remove('show');
    if(DOM.gameScreenEl) DOM.gameScreenEl.classList.add('show');
    
    setTimeout(() => {
        game.currentLevel = 0;
        game.score = 0;
        if(game.allLevelsData.length > 0) {
            game.allLevelsData.forEach(data => { if (data) { data.stars = 0; data.mistakes = 0; } });
        }
        loadLevel(game.currentLevel);
    }, 500);
}

function getLevelItems(levelIndex) {
    const themeIndex = Math.floor(levelIndex / 3) % themes.length;
    const currentTheme = themes[themeIndex];
    let targetItemCount = 3 + Math.floor(levelIndex / 5);
    targetItemCount = Math.min(targetItemCount, 8);
    let itemsToAvoid = new Set();
    if (levelIndex > 0 && game.allLevelsData[levelIndex - 1]?.itemsUsed) {
        itemsToAvoid = game.allLevelsData[levelIndex - 1].itemsUsed;
    }
    let candidateTargetPool = emojiPools[currentTheme].filter(pItem => !itemsToAvoid.has(pItem));
    if (candidateTargetPool.length < targetItemCount) {
        const needed = targetItemCount - candidateTargetPool.length;
        const fallbacks = [...emojiPools[currentTheme]].filter(pItem => !candidateTargetPool.includes(pItem)).sort(() => 0.5 - Math.random()).slice(0, needed);
        candidateTargetPool.push(...fallbacks);
    }
    const actualTargets = [...candidateTargetPool].sort(() => 0.5 - Math.random()).slice(0, targetItemCount);
    if (actualTargets.length === 0 && emojiPools[currentTheme].length > 0) { actualTargets.push(emojiPools[currentTheme][0]); }
    if (game.allLevelsData[levelIndex]) { game.allLevelsData[levelIndex].itemsUsed = new Set(actualTargets); }
    let numDistractors = Math.floor(actualTargets.length / 3) + (levelIndex > 10 ? 1 : 0);
    numDistractors = Math.min(numDistractors, 3);
    let distractorPool = emojiPools[currentTheme].filter(pItem => !actualTargets.includes(pItem));
    const distractors = [...distractorPool].sort(() => 0.5 - Math.random()).slice(0, numDistractors);
    const allDraggableItems = [...actualTargets, ...distractors].sort(() => 0.5 - Math.random());
    return { itemsForDragging: allDraggableItems, targets: [...actualTargets].sort(() => 0.5 - Math.random()), theme: currentTheme };
}

function updateUIText(activeModifier) {
    const currentLevelData = game.levels[game.currentLevel];
    if(!currentLevelData) return;
    const currentThemeKey = currentLevelData.theme;
    if (DOM.gameTitleEl) DOM.gameTitleEl.textContent = currentLangData[currentThemeKey] || "Oyun";
    if (DOM.levelIndicatorEl) DOM.levelIndicatorEl.textContent = `${currentLangData.level}: ${game.currentLevel + 1}`;
    if (DOM.scoreEl) DOM.scoreEl.textContent = `${currentLangData.score}: ${game.score}`;
    const surpriseInfo = SURPRISE_TYPES.find(s => s.id === activeModifier);
    if (surpriseInfo && DOM.bonusIndicatorEl) {
        DOM.bonusIndicatorEl.textContent = surpriseInfo.text;
        DOM.bonusIndicatorEl.classList.remove('hidden');
    } else if (DOM.bonusIndicatorEl) {
        DOM.bonusIndicatorEl.classList.add('hidden');
    }
}

function startTimer(activeModifier) {
    if (game.isPaused) return;
    clearInterval(game.timerInterval);
    const targets = game.levels[game.currentLevel].targets;
    let baseTimePerItem = 9 - Math.floor(game.currentLevel / 8);
    baseTimePerItem = Math.max(5, baseTimePerItem);
    let newTimeCalc = (targets.length * baseTimePerItem) + 5;
    if (activeModifier === 'EXTRA_TIME') newTimeCalc += 15;
    game.timeLeft = Math.floor(newTimeCalc);
    game.timeLeft = Math.max(15, Math.min(game.timeLeft, 80));
    game.initialTimeForCurrentLevel = game.timeLeft;
    DOM.timerEl.textContent = `${currentLangData.time}: ${game.timeLeft}`;
    DOM.timerEl.classList.remove('warning');
    game.timerInterval = setInterval(() => {
        if (game.isPaused) return;
        game.timeLeft--;
        DOM.timerEl.textContent = `${currentLangData.time}: ${game.timeLeft}`;
        if (game.timeLeft <= 10 && game.timeLeft > 0) { DOM.timerEl.classList.add('warning'); } else { DOM.timerEl.classList.remove('warning'); }
        if (game.timeLeft <= 0) {
            clearInterval(game.timerInterval);
            DOM.timerEl.classList.remove('warning');
            playSound('wrong-sound');
            showTimeoutModal();
        }
    }, 1000);
}

function loadLevel(levelIndex) {
    if (!DOM.draggableItemsEl || !DOM.dropZonesEl) return;
    const modifier = game.nextLevelModifier;
    game.nextLevelModifier = null;
    clearInterval(game.timerInterval);
    game.mistakesThisLevel = 0;
    game.isPaused = false;
    DOM.pauseResumeBtnEl.textContent = currentLangData.pause;
    DOM.draggableItemsEl.innerHTML = '';
    DOM.dropZonesEl.innerHTML = '';
    document.body.style.backgroundColor = backgroundColors[Math.floor(levelIndex / 3) % backgroundColors.length];
    const levelData = game.levels[levelIndex];
    if (!levelData) { showHomeScreen(); return; }

    let baseDiameter = modifier === 'BIG_CIRCLES' ? 140 : 115;
    const gameScreenWidthVal = DOM.gameScreenEl.offsetWidth;
    if (gameScreenWidthVal < 380) baseDiameter *= 0.75;
    else if (gameScreenWidthVal < 600) baseDiameter *= 0.9;
    let scaleFactor = 1.0;
    if (levelData.itemsForDragging.length > 3) scaleFactor -= (levelData.itemsForDragging.length - 3) * 0.06;
    scaleFactor -= (Math.floor(levelIndex / 10)) * 0.03;
    scaleFactor = Math.max(0.70, scaleFactor);
    const itemDiameter = Math.floor(baseDiameter * scaleFactor);
    const zoneDiameter = Math.floor(itemDiameter * 1.15);
    const itemFontSize = Math.floor(itemDiameter * 0.52);

    let hintTarget = (modifier === 'HINT_ZONE' && levelData.targets.length > 0) ? levelData.targets[Math.floor(Math.random() * levelData.targets.length)] : null;
    
    levelData.itemsForDragging.forEach(itemText => {
        const el = document.createElement('div');
        el.className = 'draggable-item';
        if (modifier === 'WIGGLE_EMOJIS') el.classList.add('wiggle');
        el.textContent = itemText;
        el.draggable = true;
        Object.assign(el.style, { width: `${itemDiameter}px`, height: `${itemDiameter}px`, fontSize: `${itemFontSize}px` });
        el.addEventListener('dragstart', dragStart);
        el.addEventListener('dragend', dragEnd);
        el.addEventListener('touchstart', touchStart, { passive: false });
        el.addEventListener('touchmove', touchMove, { passive: false });
        el.addEventListener('touchend', (e) => touchEnd(e, modifier));
        DOM.draggableItemsEl.appendChild(el);
    });

    levelData.targets.forEach(targetText => {
        const el = document.createElement('div');
        el.className = 'drop-zone';
        if (targetText === hintTarget) el.classList.add('sparkle');
        el.dataset.target = targetText;
        el.textContent = targetText;
        Object.assign(el.style, { width: `${zoneDiameter}px`, height: `${zoneDiameter}px`, fontSize: `${itemFontSize}px` });
        el.addEventListener('dragover', dragOver);
        el.addEventListener('drop', e => drop(e, modifier));
        DOM.dropZonesEl.appendChild(el);
    });

    if (modifier === 'SUPER_EMOJI' && levelData.targets.length > 0) {
        const targetToPlace = levelData.targets[0];
        const draggableToDisable = [...DOM.draggableItemsEl.childNodes].find(el => el.textContent === targetToPlace);
        const dropZoneToFill = [...DOM.dropZonesEl.childNodes].find(el => el.dataset.target === targetToPlace);
        if (draggableToDisable && dropZoneToFill) {
            setTimeout(() => handleDrop(dropZoneToFill, targetToPlace, draggableToDisable, modifier, true), 100);
        }
    }
    updateUIText(modifier);
    startTimer(modifier);
}

function dragStart(event) {
    if (event.target.classList.contains('disabled')) return;
    event.target.style.opacity = '0.5';
    event.dataTransfer.setData('text/plain', event.target.textContent);
}

function dragEnd(event) {
    event.target.style.opacity = '1';
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event, modifier) {
    event.preventDefault();
    const droppedItemText = event.dataTransfer.getData('text/plain');
    const targetZone = event.target.closest('.drop-zone');
    if (!targetZone) return;
    const draggedElement = [...DOM.draggableItemsEl.querySelectorAll('.draggable-item')].find(el => el.textContent === droppedItemText && !el.classList.contains('disabled'));
    if (draggedElement) {
        handleDrop(targetZone, droppedItemText, draggedElement, modifier);
    }
}

function touchStart(event) {
    if (event.target.classList.contains('disabled') || game.touchElement) return;
    event.preventDefault();
    game.touchElement = event.target;
    game.touchElementClone = game.touchElement.cloneNode(true);
    Object.assign(game.touchElementClone.style, {
        position: 'fixed', zIndex: '1001', opacity: '0.75', pointerEvents: 'none',
        width: game.touchElement.style.width, height: game.touchElement.style.height,
        fontSize: game.touchElement.style.fontSize, borderRadius: '50%', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: getComputedStyle(game.touchElement).backgroundColor,
        border: getComputedStyle(game.touchElement).border,
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
    });
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
    game.touchElementClone.remove();
    game.touchElementClone = null;
    game.touchElement.style.opacity = '1';
    const localTouchElement = game.touchElement;
    game.touchElement = null;
    const dropZone = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY)?.closest('.drop-zone');
    if (dropZone) {
        handleDrop(dropZone, localTouchElement.textContent, localTouchElement, modifier);
    }
}

function handleDrop(targetZone, droppedItemText, draggedElement, modifier, isInitialPlacement = false) {
    if (targetZone.dataset.target === droppedItemText && !targetZone.classList.contains('correct')) {
        targetZone.classList.add('correct');
        let pointsToAdd = (modifier === 'DOUBLE_POINTS') ? 20 : 10;
        if (!isInitialPlacement) {
            game.score += pointsToAdd;
            playSound('correct-sound');
        }
        if (draggedElement) {
            draggedElement.classList.add('disabled');
            draggedElement.draggable = false;
        }
    } else if (!targetZone.classList.contains('correct')) {
        if (!isInitialPlacement) {
            game.score = Math.max(0, game.score - 5);
            game.mistakesThisLevel++;
            playSound('wrong-sound');
        }
    }
    if (DOM.scoreEl) DOM.scoreEl.textContent = `${currentLangData.score}: ${game.score}`;
    
    const correctDropZones = DOM.dropZonesEl.querySelectorAll('.drop-zone.correct');
    const requiredCorrect = game.levels[game.currentLevel].targets.length;

    if (requiredCorrect > 0 && correctDropZones.length === requiredCorrect) {
        clearInterval(game.timerInterval);
        playSound('complete-sound');
        setTimeout(showLevelCompleteModal, 500);
    }
}

function init() {
    const ids = ['home-screen', 'game-screen', 'start-btn', 'show-rules-btn', 'game-title', 'score', 'timer', 'level-indicator', 'draggable-items', 'drop-zones', 'pause-resume-btn', 'game-home-btn', 'surprise-screen', 'surprise-box-closed', 'surprise-message', 'bonus-indicator', 'timeout-modal', 'timeout-modal-title', 'modal-message', 'modal-ok-btn', 'level-complete-modal', 'level-complete-modal-title', 'level-score-value', 'level-stars', 'level-mistakes-value', 'modal-next-level-btn', 'modal-home-btn', 'rules-modal', 'close-rules-modal-btn'];
    ids.forEach(id => {
        const camelCaseId = id.replace(/-(\w)/g, (match, letter) => letter.toUpperCase());
        DOM[`${camelCaseId}El`] = document.getElementById(id);
    });
    
    game.allLevelsData = Array(TOTAL_LEVELS).fill(null).map(() => ({ itemsUsed: new Set(), stars: 0, mistakes: 0 }));
    game.levels = Array.from({ length: TOTAL_LEVELS }, (_, i) => getLevelItems(i));

    if (DOM.startBtnEl) DOM.startBtnEl.addEventListener('click', showGameScreen);
    if (DOM.gameHomeBtnEl) DOM.gameHomeBtnEl.addEventListener('click', showHomeScreen);
    if (DOM.modalHomeBtnEl) DOM.modalHomeBtnEl.addEventListener('click', () => { showModal(DOM.levelCompleteModalEl, false); showHomeScreen(); });
    if (DOM.showRulesBtnEl) DOM.showRulesBtnEl.addEventListener('click', () => showModal(DOM.rulesModalEl));
    if (DOM.closeRulesModalBtnEl) DOM.closeRulesModalBtnEl.addEventListener('click', () => showModal(DOM.rulesModalEl, false));
    if (DOM.pauseResumeBtnEl) {
        DOM.pauseResumeBtnEl.addEventListener('click', () => {
            game.isPaused = !game.isPaused;
            DOM.pauseResumeBtnEl.textContent = game.isPaused ? currentLangData.resume : currentLangData.pause;
        });
    }

    showHomeScreen();
}

document.addEventListener('DOMContentLoaded', init);