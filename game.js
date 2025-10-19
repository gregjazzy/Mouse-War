// Contrôleur principal du jeu et boucle de jeu

let gameEngine = null;
let lastTimestamp = 0;
let animationId = null;

// Navigation des menus
function showLevelSelect() {
    hideAllScreens();
    document.getElementById('levelSelect').classList.add('active');
    loadAvailableModes(); // Charger les modes achetés
}

// Charger les modes disponibles
function loadAvailableModes() {
    const modesContainer = document.getElementById('modesContainer');
    
    // VIDER le container avant d'ajouter les modes
    modesContainer.innerHTML = '';
    
    const ownedLevels = playerData.ownedItems.filter(item => item.startsWith('level-'));
    
    console.log('🎮 Niveaux possédés:', ownedLevels);
    
    // Définir les modes disponibles
    const modesData = {
        'level-11': { icon: '🌿', name: 'Jardin Paisible' },
        'level-4': { icon: '🏰', name: 'Château Hanté' },
        'level-5': { icon: '🌋', name: 'Caverne de Lave' },
        'level-6': { icon: '❄️', name: 'Temple Glacé' },
        'level-7': { icon: '🌊', name: 'Égouts Aquatiques' },
        'level-8': { icon: '⚡', name: 'Tour Électrique' },
        'level-9': { icon: '🌙', name: 'Donjon Nocturne' },
        'level-10': { icon: '☠️', name: 'Boss Final' }
    };
    
    // Ajouter les modes achetés
    ownedLevels.forEach(levelId => {
        if (modesData[levelId]) {
            const modeData = modesData[levelId];
            const levelNumber = parseInt(levelId.split('-')[1]);
            
            console.log('➕ Ajout du mode:', modeData.name, 'niveau', levelNumber);
            
            const modeCard = document.createElement('div');
            modeCard.className = 'mode-card';
            modeCard.innerHTML = `
                <div class="mode-header">
                    <div class="mode-icon">${modeData.icon}</div>
                    <h3 class="mode-name">${modeData.name}</h3>
                </div>
                <div class="difficulties-row">
                    <button class="difficulty-btn easy" onclick="startGame(${levelNumber}, 'easy')">
                        <div class="diff-stars">★☆☆</div>
                        <div class="diff-label">Facile</div>
                    </button>
                    <button class="difficulty-btn medium" onclick="startGame(${levelNumber}, 'medium')">
                        <div class="diff-stars">★★☆</div>
                        <div class="diff-label">Moyen</div>
                    </button>
                    <button class="difficulty-btn hard" onclick="startGame(${levelNumber}, 'hard')">
                        <div class="diff-stars">★★★</div>
                        <div class="diff-label">Difficile</div>
                    </button>
                </div>
            `;
            modesContainer.appendChild(modeCard);
        }
    });
    
    console.log('✅ Modes chargés, total:', ownedLevels.length);
}

// Afficher le sélecteur de mode en jeu
function showModeSwitcher() {
    if (gameEngine) {
        gameEngine.isPaused = true;
    }
    
    const modeSwitcher = document.getElementById('modeSwitcher');
    const miniModesList = document.getElementById('miniModesList');
    
    // Vider la liste
    miniModesList.innerHTML = '';
    
    // Mode Classique (toujours disponible)
    const classicMode = document.createElement('div');
    classicMode.className = 'mini-mode-card';
    classicMode.innerHTML = `
        <div class="mini-mode-header">
            <span class="mini-mode-icon">🏠</span>
            <span class="mini-mode-name">Mode Classique</span>
        </div>
        <div class="mini-difficulties">
            <button class="mini-diff-btn easy" onclick="switchToMode(1)">★☆☆</button>
            <button class="mini-diff-btn medium" onclick="switchToMode(2)">★★☆</button>
            <button class="mini-diff-btn hard" onclick="switchToMode(3)">★★★</button>
        </div>
    `;
    miniModesList.appendChild(classicMode);
    
    // Modes achetés
    const modesData = {
        'level-4': { icon: '🏰', name: 'Château Hanté' },
        'level-5': { icon: '🌋', name: 'Caverne de Lave' },
        'level-6': { icon: '❄️', name: 'Temple Glacé' },
        'level-7': { icon: '🌊', name: 'Égouts Aquatiques' },
        'level-8': { icon: '⚡', name: 'Tour Électrique' },
        'level-9': { icon: '🌙', name: 'Donjon Nocturne' },
        'level-10': { icon: '☠️', name: 'Boss Final' }
    };
    
    const ownedLevels = playerData.ownedItems.filter(item => item.startsWith('level-'));
    ownedLevels.forEach(levelId => {
        if (modesData[levelId]) {
            const modeData = modesData[levelId];
            const levelNumber = parseInt(levelId.split('-')[1]);
            
            const modeCard = document.createElement('div');
            modeCard.className = 'mini-mode-card';
            modeCard.innerHTML = `
                <div class="mini-mode-header">
                    <span class="mini-mode-icon">${modeData.icon}</span>
                    <span class="mini-mode-name">${modeData.name}</span>
                </div>
                <div class="mini-difficulties">
                    <button class="mini-diff-btn easy" onclick="switchToMode(${levelNumber})">★☆☆</button>
                    <button class="mini-diff-btn medium" onclick="switchToMode(${levelNumber})">★★☆</button>
                    <button class="mini-diff-btn hard" onclick="switchToMode(${levelNumber})">★★★</button>
                </div>
            `;
            miniModesList.appendChild(modeCard);
        }
    });
    
    modeSwitcher.style.display = 'flex';
}

// Fermer le sélecteur de mode
function closeModeSwitcher() {
    document.getElementById('modeSwitcher').style.display = 'none';
    if (gameEngine) {
        gameEngine.isPaused = false;
    }
}

// Changer de mode en cours de jeu
function switchToMode(levelNumber) {
    closeModeSwitcher();
    startGame(levelNumber);
}

function showControls() {
    hideAllScreens();
    document.getElementById('controlsScreen').classList.add('active');
}

function showCredits() {
    alert('🐭 MAZE MOUSE\n\n✨ Créé par CinderYaxley ✨\n\nUn jeu d\'aventure premium\n\nDéveloppé avec ❤️ en JavaScript\n\nGraphismes et animations de qualité Nintendo Switch\n\n© 2024');
}

function backToMenu() {
    // Réinitialiser l'état du jeu si on était en jeu
    if (gameEngine) {
        gameEngine.isPaused = true;
    }
    
    // Restaurer l'orientation libre
    unlockOrientation();
    
    hideAllScreens();
    
    // Vérifier si l'utilisateur est connecté
    if (currentUser && accountsDatabase[currentUser]) {
    document.getElementById('startScreen').classList.add('active');
    } else {
        document.getElementById('loginScreen').classList.add('active');
    }
    
    updateCoinsDisplay();
}

function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
}

// Démarrer une partie
function startGame(levelNumber, difficulty = 'medium') {
    hideAllScreens();
    document.getElementById('gameScreen').classList.add('active');
    
    // Forcer l'orientation paysage sur mobile
    forceLandscapeOrientation();
    
    // 🔧 RÉINITIALISER les contrôles tactiles APRÈS le changement d'orientation
    setTimeout(() => {
        initTouchControls();
        console.log('🎮 Contrôles tactiles réinitialisés après orientation');
    }, 300); // Délai pour laisser l'orientation se stabiliser
    
    // Initialiser le nom du joueur
    const playerNameEl = document.getElementById('playerName');
    if (playerNameEl) {
        playerNameEl.textContent = playerName;
    }
    
    if (!gameEngine) {
        gameEngine = new GameEngine();
    }
    
    // 🔧 APPLIQUER LA DIFFICULTÉ
    gameEngine.difficulty = difficulty;
    console.log('🎯 Difficulté sélectionnée:', difficulty);
    
    // Ajuster les vies selon la difficulté
    let maxLives = 3; // Par défaut
    switch(difficulty) {
        case 'easy':
            gameEngine.lives = 5;
            maxLives = 5;
            break;
        case 'medium':
            gameEngine.lives = 3;
            maxLives = 3;
            break;
        case 'hard':
            gameEngine.lives = 2;
            maxLives = 2;
            break;
    }
    
    // Sauvegarder le max de vies pour l'affichage
    gameEngine.maxLives = maxLives;
    
    // Initialiser la barre de vie IMMÉDIATEMENT
    updateHealthBar(gameEngine.lives, maxLives);
    
    // ✅ CHARGER LE SKIN ÉQUIPÉ DU JOUEUR
    console.log('🎮 Démarrage du jeu - currentUser:', currentUser);
    console.log('🎮 accountsDatabase:', accountsDatabase);
    
    if (currentUser && accountsDatabase[currentUser]) {
        const currentSkin = accountsDatabase[currentUser].playerData.currentSkin || 'default';
        gameEngine.player.currentSkin = currentSkin;
        // Ajouter le nom d'utilisateur au joueur
        gameEngine.player.username = currentUser;
        console.log('🎨 Skin chargé pour le jeu:', currentSkin);
        console.log('🎨 gameEngine.player.currentSkin:', gameEngine.player.currentSkin);
    } else {
        gameEngine.player.currentSkin = 'default';
        gameEngine.player.username = playerName || 'Joueur';
        console.log('⚠️ Pas d\'utilisateur connecté, skin par défaut');
    }
    
    gameEngine.loadLevel(levelNumber);
    
    gameEngine.isPaused = false;
    gameEngine.isGameOver = false;
    gameEngine.isVictory = false;
    
    // 🔧 VÉRIFIER QUE L'ÉCOUTEUR DE CLIC EST BIEN ACTIF
    console.log('🖱️ Canvas pour attaque:', gameEngine.canvas ? 'OK' : 'ERREUR');
    
    // Initialiser les contrôles tactiles APRÈS un délai
    setTimeout(() => {
        console.log('🎮 Initialisation différée des contrôles tactiles...');
        initTouchControls();
    }, 500);
    
    // Démarrer la boucle de jeu
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    lastTimestamp = performance.now();
    gameLoop();
    
    // Forcer la mise à jour de l'UI après un court délai
    setTimeout(() => {
        if (gameEngine) {
            updateHealthBar(gameEngine.lives, gameEngine.maxLives);
            console.log('❤️ Vies après initialisation:', gameEngine.lives, '/', gameEngine.maxLives);
        }
    }, 100);
}

// Boucle de jeu principale
function gameLoop(timestamp = 0) {
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    
    if (gameEngine) {
        // Mettre à jour les contrôles tactiles
        updateGameEngineWithTouchControls();
        
        gameEngine.update(deltaTime);
        gameEngine.render();
    }
    
    animationId = requestAnimationFrame(gameLoop);
}

// Contrôles de jeu
function pauseGame() {
    if (!gameEngine) return;
    
    gameEngine.isPaused = true;
    document.getElementById('pauseMenu').classList.add('active');
}

function resumeGame() {
    if (!gameEngine) return;
    
    gameEngine.isPaused = false;
    document.getElementById('pauseMenu').classList.remove('active');
}

function restartLevel() {
    document.getElementById('pauseMenu').classList.remove('active');
    document.getElementById('gameOverScreen').classList.remove('active');
    document.getElementById('victoryScreen').classList.remove('active');
    
    if (gameEngine) {
        const currentLevel = gameEngine.currentLevel;
        startGame(currentLevel);
    }
}

function nextLevel() {
    document.getElementById('victoryScreen').classList.remove('active');
    
    if (gameEngine) {
        const nextLevelNumber = gameEngine.currentLevel + 1;
        const totalLevels = getTotalLevels();
        
        if (nextLevelNumber <= totalLevels) {
            startGame(nextLevelNumber);
        } else {
            // Tous les niveaux terminés
            showCongratulations();
        }
    }
}

function quitToMenu() {
    // Arrêter la boucle de jeu
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    // Restaurer l'orientation libre
    unlockOrientation();
    
    // Réinitialiser le moteur
    if (gameEngine) {
        gameEngine.isPaused = true;
        gameEngine = null;
    }
    
    // Fermer tous les menus overlay
    document.getElementById('pauseMenu').classList.remove('active');
    document.getElementById('gameOverScreen').classList.remove('active');
    document.getElementById('victoryScreen').classList.remove('active');
    
    // Retour au menu principal
    hideAllScreens();
    document.getElementById('startScreen').classList.add('active');
}

// Afficher l'écran de victoire avec récompenses
function showVictory(time, cheeseCollected, totalCheese, score, stars) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('finalTime').textContent = timeStr;
    document.getElementById('finalCheese').textContent = `${cheeseCollected}/${totalCheese}`;
    document.getElementById('finalScore').textContent = score;
    
    // Afficher les étoiles
    let starsHTML = '';
    for (let i = 0; i < 3; i++) {
        if (i < stars) {
            starsHTML += '⭐';
        } else {
            starsHTML += '☆';
        }
    }
    document.getElementById('starsDisplay').innerHTML = starsHTML;
    
    // Calculer les récompenses
    const rewards = calculateRewards(gameEngine.currentLevel, stars, time, cheeseCollected, totalCheese);
    
    // Afficher les récompenses
    displayRewards(rewards);
    
    // Afficher le menu avec animation
    setTimeout(() => {
        document.getElementById('victoryScreen').classList.add('active');
        playVictoryAnimation();
    }, 500);
}

// Calculer les récompenses en fonction des performances
function calculateRewards(level, stars, time, cheeseCollected, totalCheese) {
    const rewards = {
        coins: 0,
        title: '',
        badge: '',
        bonus: []
    };
    
    // Points de base RÉDUITS (environ 50 pièces total)
    const baseCoinsPerLevel = {
        1: 10,  // Niveau 1 : 10 pièces par étoile (max 30)
        2: 12,  // Niveau 2 : 12 pièces par étoile (max 36)
        3: 15   // Niveau 3 : 15 pièces par étoile (max 45)
    };
    const baseCoinsPerStar = baseCoinsPerLevel[level] || 10;
    rewards.coins = stars * baseCoinsPerStar;
    
    // Bonus fromage complet (petit bonus)
    if (cheeseCollected === totalCheese) {
        const cheeseBonus = 5 * level;
        rewards.coins += cheeseBonus;
        rewards.bonus.push(`🧀 Collectionneur : +${cheeseBonus} pièces`);
    }
    
    // Bonus vitesse (petit bonus)
    if (time < 60) {
        const speedBonus = 10 * level;
        rewards.coins += speedBonus;
        rewards.bonus.push(`⚡ Rapidité éclair : +${speedBonus} pièces`);
    } else if (time < 120) {
        const speedBonus = 5 * level;
        rewards.coins += speedBonus;
        rewards.bonus.push(`🏃 Rapide : +${speedBonus} pièces`);
    }
    
    // Titre et badge selon le niveau
    if (level === 1) {
        rewards.title = 'Explorateur du Garde-Manger';
        rewards.badge = '🏅';
    } else if (level === 2) {
        rewards.title = 'Maître de la Cave';
        rewards.badge = '🥈';
        rewards.coins += 5; // Bonus niveau difficile
        rewards.bonus.push('🔥 Niveau Difficile : +5 pièces');
    } else if (level === 3) {
        rewards.title = 'Champion du Labyrinthe';
        rewards.badge = '🥇';
        rewards.coins += 10; // Bonus niveau expert
        rewards.bonus.push('💎 Niveau Expert : +10 pièces');
    }
    
    // Bonus perfection (3 étoiles) - réduit
    if (stars === 3) {
        const perfectBonus = 10 * level;
        rewards.coins += perfectBonus;
        rewards.bonus.push(`✨ Perfection : +${perfectBonus} pièces`);
    }
    
    return rewards;
}

// Afficher les récompenses dans l'écran de victoire
function displayRewards(rewards) {
    const victoryScreen = document.getElementById('victoryScreen');
    const menuContent = victoryScreen.querySelector('.menu-content');
    
    // Supprimer l'ancienne section de récompenses si elle existe
    const oldRewards = menuContent.querySelector('.rewards-section');
    if (oldRewards) {
        oldRewards.remove();
    }
    
    // Ajouter les pièces au joueur
    addCoins(rewards.coins);
    
    // Créer la section de récompenses
    const rewardsHTML = `
        <div class="rewards-section">
            <div class="reward-title">
                <h3>🎁 RÉCOMPENSES 🎁</h3>
            </div>
            
            <div class="reward-badge">
                <div class="badge-icon">${rewards.badge}</div>
                <div class="badge-title">${rewards.title}</div>
            </div>
            
            <div class="reward-coins">
                <div class="coins-icon">💰</div>
                <div class="coins-amount">${rewards.coins} pièces</div>
            </div>
            
            ${rewards.bonus.length > 0 ? `
                <div class="reward-bonuses">
                    <h4>Bonus obtenus :</h4>
                    ${rewards.bonus.map(b => `<div class="bonus-item">${b}</div>`).join('')}
                </div>
            ` : ''}
        </div>
    `;
    
    // Insérer après les stats
    const statsContainer = menuContent.querySelector('.stats-container');
    statsContainer.insertAdjacentHTML('afterend', rewardsHTML);
}

// Afficher l'écran de game over
function showGameOver() {
    setTimeout(() => {
        document.getElementById('gameOverScreen').classList.add('active');
    }, 500);
}

// Afficher les félicitations finales
function showCongratulations() {
    hideAllScreens();
    
    const overlay = document.createElement('div');
    overlay.className = 'overlay-menu active';
    overlay.innerHTML = `
        <div class="menu-content victory">
            <h2 class="victory-title">🎊 FÉLICITATIONS ! 🎊</h2>
            <p style="font-size: 1.5rem; margin: 2rem 0; color: #2C3E50; font-weight: 600;">
                Vous avez terminé tous les niveaux !
            </p>
            <p style="font-size: 1.2rem; margin: 1rem 0; color: #4A5568;">
                La souris a récupéré tout le fromage et s'est échappée du labyrinthe !
            </p>
            <div style="font-size: 3rem; margin: 2rem 0;">
                🐭🧀🎉
            </div>
            <button class="btn btn-primary" onclick="location.reload()">
                🔄 REJOUER
            </button>
            <button class="btn btn-secondary" onclick="quitToMenu()">
                ← MENU PRINCIPAL
            </button>
        </div>
    `;
    
    document.body.appendChild(overlay);
}

// Animations pour les écrans de victoire
function playVictoryAnimation() {
    // Créer des confettis
    const victoryScreen = document.getElementById('victoryScreen');
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createConfetti(victoryScreen);
        }, i * 50);
    }
}

function createConfetti(container) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-20px';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = [
        '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181'
    ][Math.floor(Math.random() * 5)];
    confetti.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '10000';
    
    container.appendChild(confetti);
    
    let y = -20;
    let x = parseFloat(confetti.style.left);
    const xVelocity = (Math.random() - 0.5) * 4;
    const yVelocity = Math.random() * 3 + 2;
    let rotation = 0;
    const rotationSpeed = (Math.random() - 0.5) * 10;
    
    const animate = () => {
        y += yVelocity;
        x += xVelocity;
        rotation += rotationSpeed;
        
        confetti.style.top = y + 'px';
        confetti.style.left = x + 'px';
        confetti.style.transform = 'rotate(' + rotation + 'deg)';
        
        if (y < window.innerHeight) {
            requestAnimationFrame(animate);
        } else {
            confetti.remove();
        }
    };
    
    animate();
}

// Animations pour les écrans de victoire
// Empêcher le défilement de la page
window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }
    
    // F11 pour plein écran
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
});

// Fonction pour basculer en plein écran
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        // Entrer en plein écran
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Erreur plein écran:', err);
        });
    } else {
        // Sortir du plein écran
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Mettre à jour l'icône du bouton et redimensionner le canvas
document.addEventListener('fullscreenchange', () => {
    const btn = document.querySelector('.fullscreen-btn span');
    if (btn) {
        btn.textContent = document.fullscreenElement ? '⛶' : '⛶';
    }
    
    // Redimensionner le canvas en mode plein écran
    if (gameEngine) {
        resizeCanvas();
    }
});

// Fonction pour redimensionner le canvas
function resizeCanvas() {
    if (!gameEngine || !gameEngine.canvas || !gameEngine.levelData) return;
    
    const container = document.getElementById('canvasContainer');
    if (!container) return;
    
    // PAUSE le jeu pendant le redimensionnement
    const wasPaused = gameEngine.isPaused;
    gameEngine.isPaused = true;
    
    // Sauvegarder le niveau actuel
    const currentLevel = gameEngine.currentLevel;
    
    if (document.fullscreenElement) {
        // Mode plein écran : utiliser toute la taille de l'écran
        const hud = document.querySelector('.game-hud');
        const hudHeight = hud ? hud.offsetHeight : 0;
        
        gameEngine.width = window.innerWidth;
        gameEngine.height = window.innerHeight - hudHeight;
        gameEngine.canvas.width = gameEngine.width;
        gameEngine.canvas.height = gameEngine.height;
    } else {
        // Mode normal
        gameEngine.width = 1280;
        gameEngine.height = 720;
        gameEngine.canvas.width = gameEngine.width;
        gameEngine.canvas.height = gameEngine.height;
    }
    
    // Recharger le niveau avec les nouvelles dimensions
    // Cela recalculera automatiquement les tailles de tiles
    gameEngine.loadLevel(currentLevel);
    
    // Remettre le jeu en marche seulement s'il n'était pas déjà en pause
    if (!wasPaused) {
        gameEngine.isPaused = false;
    }
}

// Redimensionner aussi lors du resize de la fenêtre en plein écran
window.addEventListener('resize', () => {
    if (document.fullscreenElement && gameEngine) {
        resizeCanvas();
    }
});

// Gestion de la visibilité de la page (pause automatique)
document.addEventListener('visibilitychange', () => {
    if (document.hidden && gameEngine && !gameEngine.isPaused) {
        pauseGame();
    }
});

// Debug: Touches pour tester rapidement
window.addEventListener('keydown', (e) => {
    // Touche 'V' pour victoire (debug)
    if (e.key === 'v' && e.ctrlKey && gameEngine) {
        gameEngine.victory();
    }
    
    // Touche 'L' pour passer au niveau suivant (debug)
    if (e.key === 'l' && e.ctrlKey && gameEngine) {
        const nextLevelNumber = gameEngine.currentLevel + 1;
        if (nextLevelNumber <= getTotalLevels()) {
            startGame(nextLevelNumber);
        }
    }
});

// ============ SYSTÈME DE GESTION DES COMPTES ============

// Musique de fond
let backgroundMusic = null;
let isMusicPlaying = false;
let musicVolume = 0.3; // Volume par défaut (30%)
let soundEffectsVolume = 0.5; // Volume des effets sonores (50%)

// Effets sonores
const soundEffects = {
    jump: null,
    collect: null,
    death: null,
    victory: null,
    click: null
};

function initBackgroundMusic() {
    // Créer une musique de fond procédurale avec Web Audio API
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        
        // Créer un oscillateur pour la mélodie
        const createMelodyLoop = () => {
            if (!isMusicPlaying) return;
            
            const now = audioContext.currentTime;
            const notes = [262, 294, 330, 349, 392, 440, 494, 523]; // Do majeur
            const melodyPattern = [0, 2, 4, 2, 0, 4, 7, 4]; // Pattern mélodique
            
            melodyPattern.forEach((noteIndex, i) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                
                osc.connect(gain);
                gain.connect(audioContext.destination);
                
                osc.type = 'sine';
                osc.frequency.value = notes[noteIndex];
                
                const startTime = now + i * 0.3;
                gain.gain.setValueAtTime(musicVolume * 0.1, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
                
                osc.start(startTime);
                osc.stop(startTime + 0.3);
            });
            
            setTimeout(createMelodyLoop, 2400);
        };
        
        backgroundMusic = {
            context: audioContext,
            start: createMelodyLoop,
            stop: () => { isMusicPlaying = false; },
            volume: musicVolume
        };
        
        console.log('🎵 Musique de fond initialisée (Web Audio API)');
    } catch (e) {
        console.log('⚠️ Erreur initialisation musique:', e);
        backgroundMusic = null;
    }
}

function initSoundEffects() {
    // Sons via Web Audio API (sons synthétisés pour éviter les dépendances externes)
    if (!audioContext) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
    }
    
    // Son de saut (pitch montant rapide)
    soundEffects.jump = () => {
        if (!audioContext) return;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(soundEffectsVolume * 0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    };
    
    // Son de collecte de fromage (notes joyeuses)
    soundEffects.collect = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // Do
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.05); // Mi
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.1); // Sol
        
        gainNode.gain.setValueAtTime(soundEffectsVolume * 0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
    };
    
    // Son de mort (descente dramatique)
    soundEffects.death = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(soundEffectsVolume * 0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    };
    
    // Son de victoire (mélodie ascendante)
    soundEffects.victory = () => {
        const notes = [523, 587, 659, 784, 880]; // Do, Ré, Mi, Sol, La
        notes.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            
            const startTime = audioContext.currentTime + (index * 0.1);
            gainNode.gain.setValueAtTime(soundEffectsVolume * 0.3, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.2);
        });
    };
    
    // Son de clic (petit bip)
    soundEffects.click = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(soundEffectsVolume * 0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
    };
    
    // Son d'attaque (slash rapide et puissant)
    soundEffects.attack = () => {
        if (!audioContext) return;
        
        // Premier son : slash rapide
        const oscillator1 = audioContext.createOscillator();
        const gainNode1 = audioContext.createGain();
        
        oscillator1.type = 'sawtooth'; // Son plus agressif
        oscillator1.connect(gainNode1);
        gainNode1.connect(audioContext.destination);
        
        oscillator1.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator1.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
        
        gainNode1.gain.setValueAtTime(soundEffectsVolume * 0.4, audioContext.currentTime);
        gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator1.start(audioContext.currentTime);
        oscillator1.stop(audioContext.currentTime + 0.1);
        
        // Deuxième son : impact (légèrement retardé)
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();
        
        oscillator2.type = 'triangle';
        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);
        
        oscillator2.frequency.setValueAtTime(150, audioContext.currentTime + 0.05);
        
        gainNode2.gain.setValueAtTime(soundEffectsVolume * 0.3, audioContext.currentTime + 0.05);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        
        oscillator2.start(audioContext.currentTime + 0.05);
        oscillator2.stop(audioContext.currentTime + 0.15);
    };
    
    // Son de coup réussi (quand on touche un ennemi)
    soundEffects.hit = () => {
        if (!audioContext) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'square';
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.08);
        
        gainNode.gain.setValueAtTime(soundEffectsVolume * 0.35, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.08);
    };
    
    console.log('✅ Effets sonores initialisés (attack, hit ajoutés)');
    
    console.log('🔊 Effets sonores initialisés');
}

function playSound(soundName) {
    if (soundEffects[soundName] && typeof soundEffects[soundName] === 'function') {
        try {
            soundEffects[soundName]();
            console.log(`🔊 Son "${soundName}" joué avec succès`);
        } catch (error) {
            console.log(`⚠️ Erreur son "${soundName}":`, error);
        }
    } else {
        console.log(`⚠️ Son "${soundName}" non trouvé`);
    }
}

function playBackgroundMusic() {
    if (!backgroundMusic) {
        initBackgroundMusic();
    }
    
    if (backgroundMusic && !isMusicPlaying) {
        try {
            // Reprendre le contexte audio si suspendu
            if (backgroundMusic.context && backgroundMusic.context.state === 'suspended') {
                backgroundMusic.context.resume().then(() => {
                    console.log('🎵 AudioContext repris');
                    isMusicPlaying = true;
                    backgroundMusic.start();
                });
            } else {
                isMusicPlaying = true;
                backgroundMusic.start();
            }
            
            console.log('🎵 Musique de fond lancée !');
        } catch (error) {
            console.log('⚠️ Erreur lecture musique:', error);
        }
    }
}

function pauseBackgroundMusic() {
    if (isMusicPlaying) {
        isMusicPlaying = false;
        if (musicIntervalId) {
            clearInterval(musicIntervalId);
            musicIntervalId = null;
        }
        console.log('⏸️ Musique en pause');
    }
}

function toggleBackgroundMusic() {
    console.log('🎵 Toggle musique - État actuel:', isMusicPlaying);
    if (isMusicPlaying) {
        pauseBackgroundMusic();
        document.getElementById('musicToggleText').textContent = '🔇 Musique OFF';
    } else {
        playBackgroundMusic();
        document.getElementById('musicToggleText').textContent = '🔊 Musique ON';
    }
    return isMusicPlaying;
}

function setMusicVolume(volume) {
    musicVolume = Math.max(0, Math.min(1, volume)); // Entre 0 et 1
    localStorage.setItem('mazeMouse_musicVolume', musicVolume);
    console.log('🔊 Volume musique:', musicVolume);
}

function setSoundEffectsVolume(volume) {
    soundEffectsVolume = Math.max(0, Math.min(1, volume)); // Entre 0 et 1
    localStorage.setItem('mazeMouse_soundEffectsVolume', soundEffectsVolume);
}

function updateMusicVolume(value) {
    const volume = value / 100;
    setMusicVolume(volume);
    document.getElementById('musicVolumeValue').textContent = value + '%';
}

function updateSoundVolume(value) {
    const volume = value / 100;
    setSoundEffectsVolume(volume);
    document.getElementById('soundVolumeValue').textContent = value + '%';
    // Jouer un son de test
    playSound('click');
}

// Base de données des utilisateurs (stockée dans localStorage)
let accountsDatabase = {};
let currentUser = null;

// Liste des avatars disponibles
const availableAvatars = ['🐭', '🐹', '🐰', '🐱', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🦄', '🐲', '👤'];

// Système d'armes élémentaires pour chaque skin
const skinElements = {
    'default': { element: 'neutre', weapon: '🤚', color: '#888', name: 'Aucune arme' },
    'skin-golden': { element: 'lumière', weapon: '✨', color: '#FFD700', name: 'Éclat Sacré', kills: ['shadow'] },
    'skin-ninja': { element: 'ombre', weapon: '🗡️', color: '#4B0082', name: 'Lame Nocturne', kills: ['light'] },
    'skin-wizard': { element: 'arcane', weapon: '🔮', color: '#9370DB', name: 'Orbe Mystique', kills: ['demon', 'ghost'] },
    'skin-robot': { element: 'électrique', weapon: '⚡', color: '#00FFFF', name: 'Décharge Tesla', kills: ['water', 'metal'] },
    'skin-pirate': { element: 'eau', weapon: '🌊', color: '#1E90FF', name: 'Vague Pirate', kills: ['fire', 'earth'] },
    'skin-vampire': { element: 'sang', weapon: '🩸', color: '#8B0000', name: 'Drain Vital', kills: ['living', 'holy'] },
    'skin-knight': { element: 'acier', weapon: '⚔️', color: '#C0C0C0', name: 'Épée Divine', kills: ['demon', 'undead'] },
    'skin-angel': { element: 'sacré', weapon: '🕊️', color: '#FFFFFF', name: 'Lumière Céleste', kills: ['demon', 'undead', 'shadow'] },
    'skin-demon': { element: 'infernal', weapon: '🔥', color: '#FF4500', name: 'Flammes Démoniaques', kills: ['ice', 'holy', 'nature'] },
    'skin-alien': { element: 'cosmique', weapon: '🛸', color: '#00FF00', name: 'Rayon Alien', kills: ['earth', 'nature'] },
    'skin-rainbow': { element: 'arc-en-ciel', weapon: '🌈', color: 'rainbow', name: 'Spectre Total', kills: ['all'] }, // Tue tout
    'skin-legendary': { element: 'divin', weapon: '👑', color: '#FFD700', name: 'Pouvoir Ultime', kills: ['all'] } // Tue tout
};

// Types d'ennemis avec leurs éléments
const enemyTypes = {
    'basic': { element: 'living', hp: 1, emoji: '👻', name: 'Fantôme Basique' },
    'shadow': { element: 'shadow', hp: 2, emoji: '😈', name: 'Ombre Maléfique' },
    'fire': { element: 'fire', hp: 2, emoji: '🔥', name: 'Élémentaire de Feu' },
    'water': { element: 'water', hp: 2, emoji: '💧', name: 'Esprit Aquatique' },
    'demon': { element: 'demon', hp: 3, emoji: '👹', name: 'Démon' },
    'ghost': { element: 'undead', hp: 2, emoji: '💀', name: 'Squelette' },
    'ice': { element: 'ice', hp: 2, emoji: '❄️', name: 'Golem de Glace' },
    'nature': { element: 'nature', hp: 2, emoji: '🌿', name: 'Esprit Nature' }
};

// Charger la base de données des comptes
function loadAccountsDatabase() {
    const saved = localStorage.getItem('mazeMouse_accounts');
    if (saved) {
        accountsDatabase = JSON.parse(saved);
    }
}

// Sauvegarder la base de données des comptes
function saveAccountsDatabase() {
    localStorage.setItem('mazeMouse_accounts', JSON.stringify(accountsDatabase));
}

// Afficher le formulaire de connexion
function showLoginForm() {
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('registerForm').classList.remove('active');
    document.getElementById('loginError').textContent = '';
    document.getElementById('registerError').textContent = '';
}

// Afficher le formulaire d'inscription
function showRegisterForm() {
    document.getElementById('registerForm').classList.add('active');
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('loginError').textContent = '';
    document.getElementById('registerError').textContent = '';
}

// Fonction pour hasher un mot de passe (simple hash pour localStorage)
function hashPassword(password) {
    // Fonction simple de hash - pour une vraie application, utiliser bcrypt ou similaire
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
}

// Créer un nouveau compte
function registerUser() {
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    const errorEl = document.getElementById('registerError');
    
    // Validation
    if (!username || !password) {
        errorEl.textContent = '❌ Veuillez remplir tous les champs';
        return;
    }
    
    if (username.length < 3) {
        errorEl.textContent = '❌ Le nom doit contenir au moins 3 caractères';
        return;
    }
    
    if (password.length < 4) {
        errorEl.textContent = '❌ Le mot de passe doit contenir au moins 4 caractères';
        return;
    }
    
    if (password !== passwordConfirm) {
        errorEl.textContent = '❌ Les mots de passe ne correspondent pas';
        return;
    }
    
    // Vérifier si le nom d'utilisateur existe déjà
    if (accountsDatabase[username.toLowerCase()]) {
        errorEl.textContent = '❌ Ce nom d\'utilisateur est déjà pris';
        return;
    }
    
    // Créer le compte
    const hashedPassword = hashPassword(password);
    accountsDatabase[username.toLowerCase()] = {
        username: username,
        password: hashedPassword,
        avatar: availableAvatars[0], // Avatar par défaut
        createdAt: new Date().toISOString(),
        playerData: {
            coins: 0,
            ownedItems: ['level-11'], // Niveau gratuit au départ
    currentSkin: 'default'
        }
    };
    
    saveAccountsDatabase();
    
    // Afficher un message de succès
    errorEl.style.color = '#4CAF50';
    errorEl.textContent = '✅ Compte créé avec succès ! Connexion...';
    
    // Se connecter automatiquement
    setTimeout(() => {
        currentUser = username.toLowerCase();
        localStorage.setItem('mazeMouse_currentUser', currentUser);
        loadPlayerDataForCurrentUser();
        showStartScreen();
    }, 1000);
}

// Se connecter
function loginUser() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');
    
    // Validation
    if (!username || !password) {
        errorEl.textContent = '❌ Veuillez remplir tous les champs';
        return;
    }
    
    // Vérifier les identifiants
    const userKey = username.toLowerCase();
    
    // DEBUG: Afficher les comptes disponibles si le compte n'existe pas
    if (!accountsDatabase[userKey]) {
        const availableAccounts = Object.keys(accountsDatabase);
        errorEl.innerHTML = `❌ Nom d'utilisateur incorrect<br><small>DEBUG: Comptes disponibles: ${availableAccounts.length > 0 ? availableAccounts.join(', ') : 'Aucun compte créé'}</small>`;
        return;
    }
    
    const account = accountsDatabase[userKey];
    const hashedPassword = hashPassword(password);
    
    // DEBUG: Afficher les hash pour comparaison
    if (account.password !== hashedPassword) {
        errorEl.innerHTML = `❌ Mot de passe incorrect<br><small>DEBUG: Hash saisi: ${hashedPassword}<br>Hash stocké: ${account.password}</small>`;
        return;
    }
    
    // Connexion réussie
    currentUser = userKey;
    localStorage.setItem('mazeMouse_currentUser', currentUser);
    loadPlayerDataForCurrentUser();
    showStartScreen();
}

// Se déconnecter
function logoutUser() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        // Sauvegarder les données du joueur actuel avant de se déconnecter
        if (currentUser) {
            savePlayerDataForCurrentUser();
        }
        
        currentUser = null;
        localStorage.removeItem('mazeMouse_currentUser');
        
        // Retourner à l'écran de connexion
        hideAllScreens();
        document.getElementById('loginScreen').classList.add('active');
        
        // Réinitialiser les formulaires
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('registerUsername').value = '';
        document.getElementById('registerPassword').value = '';
        document.getElementById('registerPasswordConfirm').value = '';
        document.getElementById('loginError').textContent = '';
        document.getElementById('registerError').textContent = '';
        showLoginForm();
    }
}

// Afficher l'écran de démarrage après connexion
function showStartScreen() {
    hideAllScreens();
    document.getElementById('startScreen').classList.add('active');
    
    // Mettre à jour l'affichage du nom d'utilisateur et avatar
    if (currentUser && accountsDatabase[currentUser]) {
        const userData = accountsDatabase[currentUser];
        document.getElementById('currentUsername').textContent = userData.username;
        
        // Mettre à jour l'avatar
        const avatarElements = document.querySelectorAll('.user-avatar, .user-menu-avatar');
        avatarElements.forEach(el => {
            el.textContent = userData.avatar || '👤';
        });
        
        // Afficher le bouton utilisateur, cacher le bouton de connexion
        document.querySelector('.current-user').style.display = 'flex';
        document.getElementById('loginBtn').style.display = 'none';
    } else {
        // Cacher le bouton utilisateur, afficher le bouton de connexion
        document.querySelector('.current-user').style.display = 'none';
        document.getElementById('loginBtn').style.display = 'block';
    }
    
    updateCoinsDisplay();
}

function showLoginFromMenu() {
    hideAllScreens();
    document.getElementById('loginScreen').classList.add('active');
    showLoginForm();
}

// Charger les données du joueur pour l'utilisateur actuel
function loadPlayerDataForCurrentUser() {
    if (!currentUser || !accountsDatabase[currentUser]) {
        return;
    }
    
    const account = accountsDatabase[currentUser];
    playerData = { ...account.playerData };
    
    // S'assurer que le niveau gratuit est toujours disponible
    if (!playerData.ownedItems.includes('level-11')) {
        playerData.ownedItems.push('level-11');
    }
    
    // 🔧 INITIALISER LES NOUVELLES PROPRIÉTÉS SI ELLES N'EXISTENT PAS
    if (!playerData.friends) {
        playerData.friends = [];
    }
    if (!playerData.friendRequests) {
        playerData.friendRequests = {
            incoming: [],
            outgoing: []
        };
    }
    
    updateCoinsDisplay();
}

// Sauvegarder les données du joueur pour l'utilisateur actuel
function savePlayerDataForCurrentUser() {
    if (!currentUser || !accountsDatabase[currentUser]) {
        return;
    }
    
    accountsDatabase[currentUser].playerData = { ...playerData };
    saveAccountsDatabase();
}

// Vérifier si un utilisateur est connecté au chargement
function checkUserSession() {
    loadAccountsDatabase();
    
    const savedUser = localStorage.getItem('mazeMouse_currentUser');
    if (savedUser && accountsDatabase[savedUser]) {
        currentUser = savedUser;
        loadPlayerDataForCurrentUser();
        showStartScreen();
    } else {
        // Pas de session active, montrer l'écran de connexion
        hideAllScreens();
        document.getElementById('loginScreen').classList.add('active');
        
        // Cacher le bouton utilisateur, afficher le bouton de connexion
        const userBtn = document.querySelector('.current-user');
        const loginBtn = document.getElementById('loginBtn');
        if (userBtn) userBtn.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'none'; // Caché sur l'écran de connexion
    }
}

// ============ SYSTÈME DE BOUTIQUE ============

// Charger les données du joueur depuis localStorage
let playerData = {
    coins: 0,
    ownedItems: ['level-11'], // Niveau gratuit par défaut
    currentSkin: 'default',
    friends: [],  // Liste d'amis {username, avatar, lastSeen, isOnline}
    friendRequests: {
        incoming: [],  // Demandes reçues {username, avatar, timestamp}
        outgoing: []   // Demandes envoyées {username, avatar, timestamp}
    }
};

function loadPlayerData() {
    // Cette fonction n'est plus utilisée directement
    // Les données sont chargées via loadPlayerDataForCurrentUser()
    if (currentUser && accountsDatabase[currentUser]) {
        loadPlayerDataForCurrentUser();
    }
}

function savePlayerData() {
    // Sauvegarder les données dans le compte de l'utilisateur actuel
    if (currentUser) {
        savePlayerDataForCurrentUser();
    }
}

function updateCoinsDisplay() {
    const playerCoinsEl = document.getElementById('playerCoins');
    const shopCoinsEl = document.getElementById('shopCoins');
    if (playerCoinsEl) playerCoinsEl.textContent = playerData.coins;
    if (shopCoinsEl) shopCoinsEl.textContent = playerData.coins;
}

// Ajouter des pièces au joueur
function addCoins(amount) {
    playerData.coins += amount;
    savePlayerData();
    updateCoinsDisplay();
}

// Afficher la boutique
function showShop() {
    // Fermer les menus overlay si on est en jeu
    document.getElementById('pauseMenu').classList.remove('active');
    document.getElementById('victoryScreen').classList.remove('active');
    document.getElementById('gameOverScreen').classList.remove('active');
    
    hideAllScreens();
    document.getElementById('shopScreen').classList.add('active');
    updateCoinsDisplay();
    updateShopItems();
    
    // Dessiner les previews des skins
    renderSkinPreviews();
}

// Changer de catégorie dans la boutique
function showCategory(category) {
    // Retirer active de tous les boutons et catégories
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.shop-category').forEach(cat => cat.classList.remove('active'));
    
    // Activer la catégorie sélectionnée
    if (category === 'skins') {
        document.querySelector('.category-btn').classList.add('active');
        document.getElementById('skinsCategory').classList.add('active');
    } else if (category === 'levels') {
        document.querySelectorAll('.category-btn')[1].classList.add('active');
        document.getElementById('levelsCategory').classList.add('active');
    }
}

// Mettre à jour l'affichage des items de la boutique
function updateShopItems() {
    document.querySelectorAll('.shop-item').forEach(item => {
        const itemId = item.dataset.item;
        const price = parseInt(item.dataset.price);
        const btn = item.querySelector('.btn-buy');
        
        if (playerData.ownedItems.includes(itemId)) {
            item.classList.add('owned');
            item.dataset.owned = 'true';
            btn.textContent = 'POSSÉDÉ';
            btn.disabled = true;
        } else if (playerData.coins < price) {
            btn.disabled = true;
            btn.textContent = 'PAS ASSEZ';
        } else {
            btn.disabled = false;
            btn.textContent = 'ACHETER';
        }
    });
}

// Acheter un item
function buyItem(itemId, price) {
    if (!currentUser || !accountsDatabase[currentUser]) {
        alert('⚠️ Vous devez être connecté pour acheter');
        return;
    }
    
    if (playerData.coins >= price && !playerData.ownedItems.includes(itemId)) {
        playerData.coins -= price;
        playerData.ownedItems.push(itemId);
        savePlayerDataForCurrentUser();
        updateCoinsDisplay();
        updateShopItems();
        
        // Animation de succès
        const item = document.querySelector(`[data-item="${itemId}"]`);
        if (item) {
            item.style.animation = 'none';
            setTimeout(() => {
                item.style.animation = 'rewardAppear 0.5s ease-out';
            }, 10);
        }
        
        alert(`✅ Achat réussi ! Vous avez acheté : ${item.querySelector('.item-name').textContent}`);
        console.log('✅ Achat réussi:', itemId);
    } else if (playerData.ownedItems.includes(itemId)) {
        alert('⚠️ Vous possédez déjà cet objet !');
    } else {
        alert('⚠️ Pas assez de pièces !');
    }
}

// Données des skins disponibles
const skinsData = {
    'default': { icon: '🐭', name: 'Souris Classique' },
    'skin-golden': { icon: '🌟', name: 'Souris Dorée' },
    'skin-pirate': { icon: '🏴‍☠️', name: 'Souris Pirate' },
    'skin-ninja': { icon: '🥷', name: 'Souris Ninja' },
    'skin-vampire': { icon: '🧛', name: 'Souris Vampire' },
    'skin-wizard': { icon: '🧙', name: 'Souris Magicien' },
    'skin-knight': { icon: '⚔️', name: 'Souris Chevalier' },
    'skin-robot': { icon: '🤖', name: 'Souris Robot' },
    'skin-angel': { icon: '👼', name: 'Souris Ange' },
    'skin-demon': { icon: '😈', name: 'Souris Démon' },
    'skin-alien': { icon: '👽', name: 'Souris Alien' },
    'skin-rainbow': { icon: '🌈', name: 'Souris Arc-en-ciel' },
    'skin-legendary': { icon: '🐉', name: 'Dragon Légendaire' }
};

// Afficher le sélecteur de skins
function showSkinSelector() {
    // Fermer les menus overlay si on est en jeu
    document.getElementById('pauseMenu').classList.remove('active');
    document.getElementById('victoryScreen').classList.remove('active');
    document.getElementById('gameOverScreen').classList.remove('active');
    
    hideAllScreens();
    document.getElementById('skinSelectorScreen').classList.add('active');
    updateSkinSelector();
}

// Mettre à jour l'affichage du sélecteur de skins
function updateSkinSelector() {
    // Mettre à jour l'affichage du skin actuel
    const currentSkinPreview = document.getElementById('currentSkinPreview');
    const currentSkin = playerData.currentSkin || 'default';
    const skinInfo = skinsData[currentSkin];
    
    currentSkinPreview.innerHTML = `
        <div class="skin-icon">${skinInfo.icon}</div>
        <div class="skin-name">${skinInfo.name}</div>
    `;
    
    // Afficher les skins possédés
    const ownedSkinsGrid = document.getElementById('ownedSkinsGrid');
    
    // Toujours inclure le skin par défaut
    const ownedSkins = ['default', ...playerData.ownedItems.filter(item => item.startsWith('skin-'))];
    
    if (ownedSkins.length === 0) {
        ownedSkinsGrid.innerHTML = '<div class="no-skins-message">Vous ne possédez aucun skin. Visitez la boutique pour en acheter !</div>';
        return;
    }
    
    ownedSkinsGrid.innerHTML = '';
    ownedSkins.forEach(skinId => {
        const skinInfo = skinsData[skinId];
        if (!skinInfo) return;
        
        const isEquipped = currentSkin === skinId;
        
        const skinCard = document.createElement('div');
        skinCard.className = `skin-card ${isEquipped ? 'equipped' : ''}`;
        skinCard.style.position = 'relative';
        skinCard.innerHTML = `
            <div class="skin-icon">${skinInfo.icon}</div>
            <div class="skin-name">${skinInfo.name}</div>
            <button class="equip-btn" onclick="equipSkin('${skinId}')" ${isEquipped ? 'disabled' : ''}>
                ${isEquipped ? '✓ ÉQUIPÉ' : 'ÉQUIPER'}
            </button>
        `;
        
        ownedSkinsGrid.appendChild(skinCard);
    });
}

// Équiper un skin
function equipSkin(skinId) {
    console.log('🎨 Équipement du skin:', skinId);
    console.log('🎨 currentUser:', currentUser);
    console.log('🎨 accountsDatabase:', accountsDatabase);
    
    if (!currentUser || !accountsDatabase[currentUser]) {
        alert('⚠️ Vous devez être connecté pour équiper un skin');
        return;
    }
    
    // Vérifier que le joueur possède ce skin
    const ownedSkins = ['default', ...playerData.ownedItems.filter(item => item.startsWith('skin-'))];
    if (!ownedSkins.includes(skinId)) {
        alert('⚠️ Vous ne possédez pas ce skin');
        return;
    }
    
    // Mettre à jour le skin
    playerData.currentSkin = skinId;
    accountsDatabase[currentUser].playerData.currentSkin = skinId;
    
    console.log('🎨 Skin mis à jour dans playerData:', playerData.currentSkin);
    console.log('🎨 Skin mis à jour dans accountsDatabase:', accountsDatabase[currentUser].playerData.currentSkin);
    
    savePlayerDataForCurrentUser();
    updateSkinSelector();
    
    const skinInfo = skinsData[skinId];
    alert(`✅ Skin équipé : ${skinInfo.name}`);
    console.log('✅ Skin équipé avec succès:', skinId);
}

// Charger les données au démarrage
// Vérifier la session utilisateur au lieu de charger directement les données
window.addEventListener('DOMContentLoaded', () => {
    console.log('🐭 Maze Mouse - Jeu initialisé');
    console.log('🎮 Utilisez les flèches et ESPACE pour jouer');
    
    // CRÉER le GraphicsRenderer
    if (!window.graphicsRenderer) {
        window.graphicsRenderer = new GraphicsRenderer();
        console.log('✅ GraphicsRenderer créé');
    }
    
    // Générer les aperçus de niveaux
    if (typeof generateLevelPreviews === 'function') {
        generateLevelPreviews();
    }
    
    // Easter egg: animation des particules sur l'écran d'accueil
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        particle.style.animationDelay = (index * 2) + 's';
    });
    
    // Vérifier la session utilisateur
    checkUserSession();
    
    // Ajouter la gestion de la touche Entrée pour les formulaires
    setupFormHandlers();
    
    // Démarrer l'animation des objets qui tombent
    startFallingObjects();
    
    // Initialiser la musique de fond
    initBackgroundMusic();
    
    // Initialiser les effets sonores
    initSoundEffects();
    
    // Démarrer la musique après la première interaction utilisateur
    let musicStarted = false;
    const startMusic = () => {
        if (!musicStarted) {
            musicStarted = true;
            playBackgroundMusic();
            console.log('🎵 Tentative de démarrage de la musique...');
        }
    };
    
    // Essayer de démarrer au premier clic ou touche
    document.addEventListener('click', startMusic, { once: true });
    document.addEventListener('keydown', startMusic, { once: true });
    
    // Ajouter des sons de clic sur tous les boutons
    document.querySelectorAll('.btn, button').forEach(btn => {
        btn.addEventListener('click', () => {
            playSound('click');
            console.log('🔊 Son de clic joué');
        });
    });
});

// ============ SYSTÈME D'OBJETS QUI TOMBENT ============

let fallingObjectsInterval = null;
const fallingEmojis = ['🧀', '🐭', '⭐', '🎁', '💎', '🍰', '🎈', '🌟', '✨', '💫', '🎵', '🎮', '🏆', '👑'];

function createFallingObject() {
    // Ne créer que si on est sur l'écran startScreen
    const startScreen = document.getElementById('startScreen');
    if (!startScreen || !startScreen.classList.contains('active')) {
        return;
    }
    
    const container = document.getElementById('fallingObjects');
    if (!container) return;
    
    const object = document.createElement('div');
    object.className = 'falling-object';
    
    // Choisir un emoji aléatoire
    const emoji = fallingEmojis[Math.floor(Math.random() * fallingEmojis.length)];
    object.textContent = emoji;
    
    // Position horizontale aléatoire
    object.style.left = Math.random() * 100 + '%';
    
    // Taille aléatoire
    const size = 1.5 + Math.random() * 2; // Entre 1.5rem et 3.5rem
    object.style.fontSize = size + 'rem';
    
    // Durée de chute aléatoire
    const duration = 4 + Math.random() * 4; // Entre 4s et 8s
    object.style.animationDuration = duration + 's';
    
    // Animation aléatoire
    const animations = ['', 'spin-left', 'spin-right', 'wobble'];
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    if (randomAnimation) {
        object.classList.add(randomAnimation);
    }
    
    // Ajouter au container
    container.appendChild(object);
    
    // Supprimer après l'animation
    setTimeout(() => {
        object.remove();
    }, duration * 1000);
}

function startFallingObjects() {
    // Créer un objet toutes les 800ms à 1500ms
    function scheduleNext() {
        // Vérifier si on est toujours sur startScreen
        const startScreen = document.getElementById('startScreen');
        if (startScreen && startScreen.classList.contains('active')) {
            createFallingObject();
        }
        const delay = 800 + Math.random() * 700;
        setTimeout(scheduleNext, delay);
    }
    scheduleNext();
}

function stopFallingObjects() {
    // Nettoyer tous les objets existants
    const container = document.getElementById('fallingObjects');
    if (container) {
        container.innerHTML = '';
    }
}


// Configurer les gestionnaires de formulaires
function setupFormHandlers() {
    // Connexion avec la touche Entrée
    const loginInputs = ['loginUsername', 'loginPassword'];
    loginInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    loginUser();
                }
            });
        }
    });
    
    // Inscription avec la touche Entrée
    const registerInputs = ['registerUsername', 'registerPassword', 'registerPasswordConfirm'];
    registerInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    registerUser();
                }
            });
        }
    });
}

// ============ MENU DÉROULANT UTILISATEUR ============

function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    const userButton = document.querySelector('.current-user');
    
    if (menu.classList.contains('active')) {
        menu.classList.remove('active');
        userButton.classList.remove('active');
    } else {
        menu.classList.add('active');
        userButton.classList.add('active');
        updateUserMenu();
    }
}

// Fermer le menu si on clique ailleurs
document.addEventListener('click', (e) => {
    const menu = document.getElementById('userMenu');
    const userButton = document.querySelector('.current-user');
    
    if (menu && userButton && !menu.contains(e.target) && !userButton.contains(e.target)) {
        menu.classList.remove('active');
        userButton.classList.remove('active');
    }
});

function updateUserMenu() {
    // Mettre à jour le nom et les pièces dans le menu
    if (currentUser && accountsDatabase[currentUser]) {
        const userData = accountsDatabase[currentUser];
        document.getElementById('userMenuName').textContent = userData.username;
        document.getElementById('userMenuCoins').textContent = playerData.coins;
        
        // Mettre à jour l'avatar dans le menu
        const menuAvatar = document.querySelector('.user-menu-avatar');
        if (menuAvatar) {
            menuAvatar.textContent = userData.avatar || '👤';
        }
    }
    
    // Afficher les autres comptes
    updateOtherAccountsList();
}

function updateOtherAccountsList() {
    const container = document.getElementById('otherAccountsList');
    if (!container) return;
    
    // Récupérer tous les comptes sauf l'actuel
    const otherAccounts = Object.keys(accountsDatabase).filter(key => key !== currentUser);
    
    // Effacer la liste
    container.innerHTML = '<div class="user-menu-label">Autres comptes</div>';
    
    if (otherAccounts.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.style.padding = '0.8rem 1rem';
        emptyMsg.style.fontSize = '0.9rem';
        emptyMsg.style.color = '#999';
        emptyMsg.style.fontStyle = 'italic';
        emptyMsg.textContent = 'Aucun autre compte';
        container.appendChild(emptyMsg);
        return;
    }
    
    // Ajouter chaque compte
    otherAccounts.forEach(accountKey => {
        const account = accountsDatabase[accountKey];
        const accountBtn = document.createElement('button');
        accountBtn.className = 'user-menu-item account';
        accountBtn.innerHTML = `
            <span class="menu-icon">👤</span>
            <span class="menu-text">${account.username}</span>
        `;
        accountBtn.onclick = () => switchAccount(accountKey);
        container.appendChild(accountBtn);
    });
}

function switchAccount(accountKey) {
    if (!accountsDatabase[accountKey]) return;
    
    // Sauvegarder les données de l'utilisateur actuel
    if (currentUser) {
        savePlayerDataForCurrentUser();
    }
    
    // Changer d'utilisateur
    currentUser = accountKey;
    localStorage.setItem('mazeMouse_currentUser', currentUser);
    
    // Charger les données du nouveau compte
    loadPlayerDataForCurrentUser();
    
    // Mettre à jour l'affichage
    document.getElementById('currentUsername').textContent = accountsDatabase[currentUser].username;
    updateCoinsDisplay();
    
    // Fermer le menu
    toggleUserMenu();
    
    console.log('✅ Changé de compte vers:', accountsDatabase[currentUser].username);
}

function showSettings() {
    toggleUserMenu();
    hideAllScreens();
    document.getElementById('settingsScreen').classList.add('active');
    loadSettings();
    
    // Afficher le sélecteur d'avatar
    if (currentUser && accountsDatabase[currentUser]) {
        displayAvatarSelector();
    }
}

function displayAvatarSelector() {
    const avatarGrid = document.querySelector('.avatar-grid');
    if (!avatarGrid) return;
    
    const currentAvatar = accountsDatabase[currentUser].avatar || '👤';
    
    avatarGrid.innerHTML = '';
    availableAvatars.forEach(avatar => {
        const avatarBtn = document.createElement('button');
        avatarBtn.className = 'avatar-option';
        if (avatar === currentAvatar) {
            avatarBtn.classList.add('selected');
        }
        avatarBtn.textContent = avatar;
        avatarBtn.onclick = () => changeAvatar(avatar);
        avatarGrid.appendChild(avatarBtn);
    });
}

function changeAvatar(newAvatar) {
    if (!currentUser || !accountsDatabase[currentUser]) return;
    
    accountsDatabase[currentUser].avatar = newAvatar;
    saveAccountsDatabase();
    
    // Mettre à jour l'affichage partout
    const avatarElements = document.querySelectorAll('.user-avatar, .user-menu-avatar');
    avatarElements.forEach(el => {
        el.textContent = newAvatar;
    });
    
    // Mettre à jour le sélecteur
    displayAvatarSelector();
    
    console.log('✅ Avatar changé:', newAvatar);
}

function showAddAccount() {
    toggleUserMenu();
    
    // Rediriger vers l'écran d'inscription
    hideAllScreens();
    document.getElementById('loginScreen').classList.add('active');
    showRegisterForm();
}

// ============ SYSTÈME DE PARAMÈTRES ============

// Configuration par défaut des touches
let keyBindings = {
    left: 'ArrowLeft',
    right: 'ArrowRight',
    jump: ' ',
    pause: 'Escape'
};

// Langue par défaut
let currentLanguage = 'en'; // Anglais par défaut

// Traductions complètes
const translations = {
    en: {
        title: 'MAZE MOUSE',
        subtitle: 'A Labyrinth Adventure',
        creator: 'Created by CinderYaxley',
        play: 'PLAY',
        shop: 'SHOP',
        skins: 'MY SKINS',
        controls: 'CONTROLS',
        about: 'ABOUT',
        settings: 'SETTINGS',
        logout: 'Logout',
        addAccount: 'Add Account',
        otherAccounts: 'Other Accounts',
        coins: 'coins',
        avatar: 'Avatar',
        language: 'Game Language',
        moveLeft: 'Move Left',
        moveRight: 'Move Right',
        jump: 'Jump',
        pause: 'Pause',
        resetKeys: 'Reset Keys',
        audio: 'Audio',
        comingSoon: 'Coming soon...',
        back: 'BACK'
    },
    fr: {
        title: 'MAZE MOUSE',
        subtitle: 'Une aventure dans le labyrinthe',
        creator: 'Créé par CinderYaxley',
        play: 'JOUER',
        shop: 'BOUTIQUE',
        skins: 'MES SKINS',
        controls: 'CONTRÔLES',
        about: 'À PROPOS',
        settings: 'PARAMÈTRES',
        logout: 'Déconnexion',
        addAccount: 'Ajouter un compte',
        otherAccounts: 'Autres comptes',
        coins: 'pièces',
        avatar: 'Avatar',
        language: 'Langue du jeu',
        moveLeft: 'Déplacer à gauche',
        moveRight: 'Déplacer à droite',
        jump: 'Sauter',
        pause: 'Pause',
        resetKeys: 'Réinitialiser les touches',
        audio: 'Audio',
        comingSoon: 'Fonctionnalité à venir...',
        back: 'RETOUR'
    },
    es: {
        title: 'MAZE MOUSE',
        subtitle: 'Una aventura en el laberinto',
        creator: 'Creado por CinderYaxley',
        play: 'JUGAR',
        shop: 'TIENDA',
        skins: 'MIS SKINS',
        controls: 'CONTROLES',
        about: 'ACERCA DE',
        settings: 'AJUSTES',
        logout: 'Cerrar sesión',
        addAccount: 'Añadir cuenta',
        otherAccounts: 'Otras cuentas',
        coins: 'monedas',
        avatar: 'Avatar',
        language: 'Idioma del juego',
        moveLeft: 'Mover izquierda',
        moveRight: 'Mover derecha',
        jump: 'Saltar',
        pause: 'Pausa',
        resetKeys: 'Restablecer teclas',
        audio: 'Audio',
        comingSoon: 'Próximamente...',
        back: 'VOLVER'
    },
    de: {
        title: 'MAZE MOUSE',
        subtitle: 'Ein Labyrinth-Abenteuer',
        creator: 'Erstellt von CinderYaxley',
        play: 'SPIELEN',
        shop: 'SHOP',
        skins: 'MEINE SKINS',
        controls: 'STEUERUNG',
        about: 'ÜBER',
        settings: 'EINSTELLUNGEN',
        logout: 'Abmelden',
        addAccount: 'Konto hinzufügen',
        otherAccounts: 'Andere Konten',
        coins: 'Münzen',
        avatar: 'Avatar',
        language: 'Spielsprache',
        moveLeft: 'Nach links',
        moveRight: 'Nach rechts',
        jump: 'Springen',
        pause: 'Pause',
        resetKeys: 'Tasten zurücksetzen',
        audio: 'Audio',
        comingSoon: 'Demnächst verfügbar...',
        back: 'ZURÜCK'
    },
    el: {
        title: 'MAZE MOUSE',
        subtitle: 'Μια περιπέτεια στο λαβύρινθο',
        creator: 'Δημιουργήθηκε από CinderYaxley',
        play: 'ΠΑΙΞΕ',
        shop: 'ΚΑΤΑΣΤΗΜΑ',
        skins: 'ΤΑ SKINS ΜΟΥ',
        controls: 'ΧΕΙΡΙΣΤΗΡΙΑ',
        about: 'ΣΧΕΤΙΚΑ',
        settings: 'ΡΥΘΜΙΣΕΙΣ',
        logout: 'Αποσύνδεση',
        addAccount: 'Προσθήκη λογαριασμού',
        otherAccounts: 'Άλλοι λογαριασμοί',
        coins: 'νομίσματα',
        avatar: 'Άβαταρ',
        language: 'Γλώσσα παιχνιδιού',
        moveLeft: 'Κίνηση αριστερά',
        moveRight: 'Κίνηση δεξιά',
        jump: 'Πήδημα',
        pause: 'Παύση',
        resetKeys: 'Επαναφορά πλήκτρων',
        audio: 'Ήχος',
        comingSoon: 'Έρχεται σύντομα...',
        back: 'ΠΙΣΩ'
    },
    zh: {
        title: 'MAZE MOUSE',
        subtitle: '迷宫冒险',
        creator: '由 CinderYaxley 创作',
        play: '开始游戏',
        shop: '商店',
        skins: '我的皮肤',
        controls: '控制',
        about: '关于',
        settings: '设置',
        logout: '登出',
        addAccount: '添加账户',
        otherAccounts: '其他账户',
        coins: '金币',
        avatar: '头像',
        language: '游戏语言',
        moveLeft: '向左移动',
        moveRight: '向右移动',
        jump: '跳跃',
        pause: '暂停',
        resetKeys: '重置按键',
        audio: '音频',
        comingSoon: '即将推出...',
        back: '返回'
    },
    ru: {
        title: 'MAZE MOUSE',
        subtitle: 'Приключение в лабиринте',
        creator: 'Создано CinderYaxley',
        play: 'ИГРАТЬ',
        shop: 'МАГАЗИН',
        skins: 'МОИ СКИНЫ',
        controls: 'УПРАВЛЕНИЕ',
        about: 'О ИГРЕ',
        settings: 'НАСТРОЙКИ',
        logout: 'Выйти',
        addAccount: 'Добавить аккаунт',
        otherAccounts: 'Другие аккаунты',
        coins: 'монет',
        avatar: 'Аватар',
        language: 'Язык игры',
        moveLeft: 'Движение влево',
        moveRight: 'Движение вправо',
        jump: 'Прыжок',
        pause: 'Пауза',
        resetKeys: 'Сбросить клавиши',
        audio: 'Аудио',
        comingSoon: 'Скоро будет...',
        back: 'НАЗАД'
    }
};

function loadSettings() {
    // Charger les paramètres depuis localStorage
    const savedSettings = localStorage.getItem('mazeMouse_settings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        keyBindings = settings.keyBindings || keyBindings;
        currentLanguage = settings.language || 'en';
    }
    
    // Mettre à jour l'affichage
    document.getElementById('languageSelect').value = currentLanguage;
    updateKeyDisplays();
    applyLanguage();
}

function saveSettings() {
    const settings = {
        keyBindings: keyBindings,
        language: currentLanguage
    };
    localStorage.setItem('mazeMouse_settings', JSON.stringify(settings));
}

function changeLanguage(lang) {
    currentLanguage = lang;
    saveSettings();
    applyLanguage();
}

function applyLanguage() {
    const t = translations[currentLanguage];
    if (!t) return;
    
    // Mettre à jour tous les éléments avec data-translate
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (t[key]) {
            element.textContent = t[key];
        }
    });
    
    // Mettre à jour les boutons du menu
    const menuButtons = {
        '▶': t.play,
        '🛍️': t.shop,
        '🎨': t.skins,
        '🎮': t.controls,
        'ℹ️': t.about
    };
    
    document.querySelectorAll('.menu-buttons .btn').forEach(btn => {
        const icon = btn.querySelector('.btn-icon');
        if (icon) {
            const iconText = icon.textContent;
            if (menuButtons[iconText]) {
                btn.innerHTML = `<span class="btn-icon">${iconText}</span>${menuButtons[iconText]}`;
            }
        }
    });
    
    // Mettre à jour l'écran de paramètres
    const settingsLabels = document.querySelectorAll('.settings-label');
    if (settingsLabels[0]) settingsLabels[0].textContent = t.language;
    if (settingsLabels[1]) settingsLabels[1].textContent = t.moveLeft;
    if (settingsLabels[2]) settingsLabels[2].textContent = t.moveRight;
    if (settingsLabels[3]) settingsLabels[3].textContent = t.jump;
    if (settingsLabels[4]) settingsLabels[4].textContent = t.pause;
    
    // Mettre à jour le bouton de réinitialisation
    const resetBtn = document.querySelector('.settings-section .btn-secondary');
    if (resetBtn) resetBtn.innerHTML = `🔄 ${t.resetKeys}`;
    
    // Mettre à jour les titres des sections
    const settingsSections = document.querySelectorAll('.settings-section-title');
    if (settingsSections[0]) settingsSections[0].textContent = '👤 ' + t.avatar; // Avatar
    if (settingsSections[1]) settingsSections[1].textContent = '🌍 ' + t.language; // Langue
    if (settingsSections[2]) settingsSections[2].textContent = '🎮 ' + t.controls; // Contrôles
    if (settingsSections[3]) settingsSections[3].textContent = '🔊 ' + t.audio; // Audio
    
    // Mettre à jour "Fonctionnalité à venir"
    const comingSoonText = document.querySelector('.settings-info p');
    if (comingSoonText) comingSoonText.textContent = t.comingSoon;
    
    // Mettre à jour les boutons "Retour"
    document.querySelectorAll('.btn-back').forEach(btn => {
        btn.innerHTML = `← ${t.back}`;
    });
    
    // Mettre à jour le menu utilisateur
    const userMenuLabels = document.querySelectorAll('.user-menu-label');
    if (userMenuLabels[0]) userMenuLabels[0].textContent = t.otherAccounts;
    
    const userMenuItems = document.querySelectorAll('.user-menu-item .menu-text');
    userMenuItems.forEach(item => {
        const parent = item.closest('.user-menu-item');
        if (parent && parent.querySelector('.menu-icon')?.textContent === '⚙️') {
            item.textContent = t.settings;
        } else if (parent && parent.querySelector('.menu-icon')?.textContent === '➕') {
            item.textContent = t.addAccount;
        } else if (parent && parent.querySelector('.menu-icon')?.textContent === '🚪') {
            item.textContent = t.logout;
        }
    });
    
    console.log('✅ Langue appliquée:', currentLanguage);
}

function updateKeyDisplays() {
    const keyNames = {
        'ArrowLeft': '←',
        'ArrowRight': '→',
        'ArrowUp': '↑',
        'ArrowDown': '↓',
        ' ': 'ESPACE',
        'Escape': 'ESC',
        'Enter': 'ENTRÉE'
    };
    
    document.getElementById('keyLeftDisplay').textContent = keyNames[keyBindings.left] || keyBindings.left;
    document.getElementById('keyRightDisplay').textContent = keyNames[keyBindings.right] || keyBindings.right;
    document.getElementById('keyJumpDisplay').textContent = keyNames[keyBindings.jump] || keyBindings.jump;
    document.getElementById('keyPauseDisplay').textContent = keyNames[keyBindings.pause] || keyBindings.pause;
}

let currentRemapping = null;

function remapKey(action) {
    if (currentRemapping) return;
    
    currentRemapping = action;
    const btn = document.getElementById('key' + action.charAt(0).toUpperCase() + action.slice(1));
    btn.classList.add('listening');
    
    // Écouter la prochaine touche pressée
    const keyListener = (e) => {
        e.preventDefault();
        
        // Ignorer certaines touches
        if (['F1', 'F5', 'F11', 'F12'].includes(e.key)) {
            return;
        }
        
        // Assigner la nouvelle touche
        keyBindings[action] = e.key;
        saveSettings();
        updateKeyDisplays();
        
        // Nettoyer
        btn.classList.remove('listening');
        document.removeEventListener('keydown', keyListener);
        currentRemapping = null;
    };
    
    document.addEventListener('keydown', keyListener);
}

function resetDefaultKeys() {
    if (confirm('Voulez-vous réinitialiser toutes les touches à leurs valeurs par défaut ?')) {
        keyBindings = {
            left: 'ArrowLeft',
            right: 'ArrowRight',
            jump: ' ',
            pause: 'Escape'
        };
        saveSettings();
        updateKeyDisplays();
    }
}

// Modifier la fonction de contrôle du jeu pour utiliser les touches personnalisées
function isKeyPressed(action, key) {
    return key === keyBindings[action];
}

// ============ NOM DU JOUEUR ============

let playerName = 'Ma Souris';

// Supprimer la fonction showPlayerNamePrompt car on ne demande plus le nom
function showPlayerNamePrompt() {
    // Directement aller à la sélection de niveau
    showLevelSelect();
}

// Mettre à jour la barre de vie
function updateHealthBar(currentLives, maxLives = 3) {
    const healthFill = document.getElementById('healthFill');
    const healthText = document.getElementById('healthText');
    
    if (healthFill && healthText) {
        const percentage = (currentLives / maxLives) * 100;
        healthFill.style.width = percentage + '%';
        healthText.textContent = `${currentLives}/${maxLives}`;
    }
    
    // Mettre à jour le nom au cas où
    const playerNameEl = document.getElementById('playerName');
    if (playerNameEl) {
        playerNameEl.textContent = playerName;
    }
}

// ============ SYSTÈME DE TÉLÉPORTATION (WIZARD) ============

let teleportMode = false;
let teleportCooldown = 0; // Cooldown en secondes
let teleportCooldownInterval = null;
const teleportBtn = document.getElementById('teleportBtn');
const gameCanvas = document.getElementById('gameCanvas');

// Fonction pour démarrer le cooldown
function startTeleportCooldown() {
    teleportCooldown = 20; // 20 secondes
    teleportBtn.disabled = true;
    teleportBtn.style.opacity = '0.5';
    teleportBtn.style.cursor = 'not-allowed';
    
    // Mettre à jour l'affichage du cooldown
    teleportCooldownInterval = setInterval(() => {
        if (teleportCooldown > 0) {
            teleportCooldown--;
            const minutes = Math.floor(teleportCooldown / 60);
            const seconds = teleportCooldown % 60;
            teleportBtn.innerHTML = `<span>⏳</span> ${seconds}s`;
        } else {
            clearInterval(teleportCooldownInterval);
            teleportBtn.disabled = false;
            teleportBtn.style.opacity = '1';
            teleportBtn.style.cursor = 'pointer';
            teleportBtn.innerHTML = '<span>✨</span> TÉLÉPORTER';
        }
    }, 1000);
}

// Fonction pour activer/désactiver le mode téléportation
function toggleTeleportMode() {
    if (teleportCooldown > 0) return; // Ne pas activer si en cooldown
    
    teleportMode = !teleportMode;
    
    if (teleportMode) {
        teleportBtn.classList.add('active');
        teleportBtn.innerHTML = '<span>✅</span> CLIQUEZ OÙ VOUS VOULEZ';
        document.body.classList.add('teleporting-mode');
    } else {
        teleportBtn.classList.remove('active');
        teleportBtn.innerHTML = '<span>✨</span> TÉLÉPORTER';
        document.body.classList.remove('teleporting-mode');
    }
}

// Gérer le clic sur le bouton de téléportation
if (teleportBtn) {
    teleportBtn.addEventListener('click', () => {
        if (gameEngine && gameEngine.player.currentSkin === 'skin-wizard' && teleportCooldown === 0) {
            toggleTeleportMode();
        }
    });
}

// Gérer le clic sur le canvas pour téléporter
if (gameCanvas) {
    gameCanvas.addEventListener('click', (e) => {
        if (teleportMode && gameEngine && gameEngine.player.currentSkin === 'skin-wizard') {
            // Calculer les coordonnées dans le monde du jeu
            const rect = gameCanvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            // Convertir en coordonnées monde (en tenant compte de la caméra)
            const worldX = clickX + gameEngine.camera.x;
            const worldY = clickY + gameEngine.camera.y;
            
            // Téléporter le joueur
            gameEngine.player.x = worldX - gameEngine.player.width / 2;
            gameEngine.player.y = worldY - gameEngine.player.height / 2;
            gameEngine.player.velocityX = 0;
            gameEngine.player.velocityY = 0;
            
            // Effet visuel
            console.log('✨ TÉLÉPORTATION à:', worldX.toFixed(0), worldY.toFixed(0));
            
            // Désactiver le mode téléportation
            toggleTeleportMode();
            
            // Démarrer le cooldown de 1 minute
            startTeleportCooldown();
        }
    });
}

// Vérifier si le skin wizard est équipé et afficher/cacher le bouton
function updateTeleportButton() {
    if (gameEngine && gameEngine.player) {
        if (gameEngine.player.currentSkin === 'skin-wizard') {
            teleportBtn.style.display = 'block';
        } else {
            teleportBtn.style.display = 'none';
            if (teleportMode) {
                toggleTeleportMode();
            }
        }
    }
}

// Appeler updateTeleportButton régulièrement
setInterval(updateTeleportButton, 500);

// Fonction pour dessiner les previews des skins dans la boutique
function renderSkinPreviews() {
    const canvases = document.querySelectorAll('.item-preview');
    
    canvases.forEach(canvas => {
        const skinId = canvas.dataset.skin;
        const ctx = canvas.getContext('2d');
        
        // Effacer le canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Créer un objet joueur temporaire pour le preview (taille augmentée)
        const previewPlayer = {
            x: 0,
            y: 0,
            width: 60,
            height: 60,
            direction: 'right',
            animationFrame: 0,
            isJumping: false,
            currentSkin: skinId,
            isStunned: false
        };
        
        // Dessiner la souris avec le skin (plus centrée pour mieux voir l'arme)
        if (window.graphicsRenderer) {
            ctx.save();
            ctx.translate(80, 80); // Centrer la souris dans le canvas plus grand
            window.graphicsRenderer.drawPlayer(ctx, previewPlayer);
            ctx.restore();
        }
    });
}


// ============ SYSTÈME D'AMIS COMPLET ============

// Base de données fictive de joueurs (simule d'autres joueurs)
const mockPlayers = [
    { username: 'SpeedyMouse', avatar: '🐭', isOnline: true },
    { username: 'CheeseHunter', avatar: '🧀', isOnline: false },
    { username: 'MazeMaster', avatar: '🎮', isOnline: true },
    { username: 'NinjaRat', avatar: '🥷', isOnline: false },
    { username: 'GamerPro', avatar: '👾', isOnline: true },
    { username: 'SneakyPanda', avatar: '🐼', isOnline: false },
    { username: 'FireDragon', avatar: '🐉', isOnline: true },
    { username: 'IceQueen', avatar: '👑', isOnline: false },
    { username: 'ThunderBolt', avatar: '⚡', isOnline: true },
    { username: 'ShadowNinja', avatar: '🌙', isOnline: false },
    { username: 'StarHero', avatar: '⭐', isOnline: true },
    { username: 'MoonWalker', avatar: '🌟', isOnline: false },
    { username: 'CosmicCat', avatar: '🐱', isOnline: true },
    { username: 'RocketRat', avatar: '🚀', isOnline: false },
    { username: 'PixelKing', avatar: '👑', isOnline: true }
];

// Afficher l'écran des amis
function showFriendsScreen() {
    // Fermer tous les écrans
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    // Ouvrir l'écran des amis
    document.getElementById('friendsScreen').classList.add('active');
    // Charger les données
    updateFriendsDisplay();
}

// Changer d'onglet
function switchFriendsTab(tab) {
    // Mettre à jour les boutons d'onglet
    document.querySelectorAll('.friends-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    // Mettre à jour le contenu
    document.querySelectorAll('.friends-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    if (tab === 'all') {
        document.getElementById('friendsTabAll').classList.add('active');
        renderFriendsList(playerData.friends);
    } else if (tab === 'online') {
        document.getElementById('friendsTabOnline').classList.add('active');
        renderOnlineFriendsList();
    } else if (tab === 'requests') {
        document.getElementById('friendsTabRequests').classList.add('active');
        renderRequestsLists();
    }
}

// Mettre à jour l'affichage complet
function updateFriendsDisplay() {
    // Mettre à jour les statistiques
    document.getElementById('friendsCount').textContent = playerData.friends.length;
    document.getElementById('requestsCount').textContent = 
        playerData.friendRequests.incoming.length + playerData.friendRequests.outgoing.length;
    
    // Afficher l'onglet actif
    const activeTab = document.querySelector('.friends-tab.active').dataset.tab;
    switchFriendsTab(activeTab);
}

// Afficher tous les amis
function renderFriendsList(friends) {
    const friendsList = document.getElementById('friendsList');
    
    if (!friends || friends.length === 0) {
        friendsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">😢</div>
                <div class="empty-text">Vous n'avez pas encore d'amis</div>
                <div class="empty-hint">Utilisez la barre de recherche pour trouver des joueurs !</div>
            </div>
        `;
        return;
    }
    
    friendsList.innerHTML = friends.map(friend => `
        <div class="friend-card">
            <div class="friend-info">
                <div class="friend-avatar">
                    ${friend.avatar}
                    <div class="friend-status-indicator ${friend.isOnline ? 'online' : 'offline'}"></div>
                </div>
                <div class="friend-details">
                    <div class="friend-name">${friend.username}</div>
                    <div class="friend-status-text ${friend.isOnline ? 'online' : ''}">
                        ${friend.isOnline ? '🟢 En ligne' : '⚫ Hors ligne - ' + friend.lastSeen}
                    </div>
                </div>
            </div>
            <div class="friend-actions">
                <button class="friend-action-btn view-profile" onclick="viewFriendProfile('${friend.username}')">
                    👤 Profil
                </button>
                <button class="friend-action-btn remove" onclick="removeFriend('${friend.username}')">
                    🗑️ Retirer
                </button>
            </div>
        </div>
    `).join('');
}

// Afficher les amis en ligne
function renderOnlineFriendsList() {
    const onlineFriends = playerData.friends.filter(f => f.isOnline);
    const friendsListOnline = document.getElementById('friendsListOnline');
    
    if (onlineFriends.length === 0) {
        friendsListOnline.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💤</div>
                <div class="empty-text">Aucun ami en ligne</div>
                <div class="empty-hint">Vos amis se connecteront bientôt !</div>
            </div>
        `;
        return;
    }
    
    friendsListOnline.innerHTML = onlineFriends.map(friend => `
        <div class="friend-card">
            <div class="friend-info">
                <div class="friend-avatar">
                    ${friend.avatar}
                    <div class="friend-status-indicator online"></div>
                </div>
                <div class="friend-details">
                    <div class="friend-name">${friend.username}</div>
                    <div class="friend-status-text online">🟢 En ligne</div>
                </div>
            </div>
            <div class="friend-actions">
                <button class="friend-action-btn view-profile" onclick="viewFriendProfile('${friend.username}')">
                    👤 Profil
                </button>
                <button class="friend-action-btn remove" onclick="removeFriend('${friend.username}')">
                    🗑️ Retirer
                </button>
            </div>
        </div>
    `).join('');
}

// Afficher les demandes d'amis
function renderRequestsLists() {
    // Demandes reçues
    const incomingList = document.getElementById('incomingRequestsList');
    if (playerData.friendRequests.incoming.length === 0) {
        incomingList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <div class="empty-text">Aucune demande en attente</div>
            </div>
        `;
    } else {
        incomingList.innerHTML = playerData.friendRequests.incoming.map(request => `
            <div class="request-card">
                <div class="request-info">
                    <div class="friend-avatar">${request.avatar}</div>
                    <div class="friend-details">
                        <div class="friend-name">${request.username}</div>
                        <div class="friend-status-text">Demande envoyée ${request.timestamp}</div>
                    </div>
                </div>
                <div class="request-actions">
                    <button class="request-action-btn accept" onclick="acceptFriendRequest('${request.username}')">
                        ✅ Accepter
                    </button>
                    <button class="request-action-btn decline" onclick="declineFriendRequest('${request.username}')">
                        ❌ Refuser
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Demandes envoyées
    const outgoingList = document.getElementById('outgoingRequestsList');
    if (playerData.friendRequests.outgoing.length === 0) {
        outgoingList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <div class="empty-text">Aucune demande envoyée</div>
            </div>
        `;
    } else {
        outgoingList.innerHTML = playerData.friendRequests.outgoing.map(request => `
            <div class="request-card">
                <div class="request-info">
                    <div class="friend-avatar">${request.avatar}</div>
                    <div class="friend-details">
                        <div class="friend-name">${request.username}</div>
                        <div class="friend-status-text">En attente de réponse...</div>
                    </div>
                </div>
                <div class="request-actions">
                    <button class="request-action-btn cancel" onclick="cancelFriendRequest('${request.username}')">
                        🚫 Annuler
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Rechercher un ami
function searchFriend() {
    const searchInput = document.getElementById('friendSearchInput');
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) {
        showNotification('⚠️ Entrez un nom d\'utilisateur', 'warning');
        return;
    }
    
    // Recherche dans la base de données fictive
    const results = mockPlayers.filter(player => 
        player.username.toLowerCase().includes(searchTerm) && 
        player.username.toLowerCase() !== currentUser.toLowerCase()
    );
    
    // Afficher les résultats
    displaySearchResults(results);
}

// Afficher les résultats de recherche
function displaySearchResults(results) {
    const overlay = document.getElementById('searchResultsOverlay');
    const resultsList = document.getElementById('searchResultsList');
    
    if (results.length === 0) {
        resultsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <div class="empty-text">Aucun joueur trouvé</div>
                <div class="empty-hint">Essayez un autre nom !</div>
            </div>
        `;
    } else {
        resultsList.innerHTML = results.map(player => {
            const isFriend = playerData.friends.some(f => f.username === player.username);
            const hasSentRequest = playerData.friendRequests.outgoing.some(r => r.username === player.username);
            const hasReceivedRequest = playerData.friendRequests.incoming.some(r => r.username === player.username);
            
            let buttonHTML;
            if (isFriend) {
                buttonHTML = '<button class="search-result-btn already-friend" disabled>✅ Déjà ami</button>';
            } else if (hasSentRequest) {
                buttonHTML = '<button class="search-result-btn pending" disabled>⏳ En attente</button>';
            } else if (hasReceivedRequest) {
                buttonHTML = `<button class="search-result-btn accept" onclick="acceptFriendRequest('${player.username}'); closeSearchResults();">✅ Accepter</button>`;
            } else {
                buttonHTML = `<button class="search-result-btn add-friend" onclick="sendFriendRequest('${player.username}', '${player.avatar}')">➕ Ajouter</button>`;
            }
            
            return `
                <div class="search-result-item">
                    <div class="search-result-info">
                        <div class="friend-avatar">
                            ${player.avatar}
                            <div class="friend-status-indicator ${player.isOnline ? 'online' : 'offline'}"></div>
                        </div>
                        <div class="friend-details">
                            <div class="friend-name">${player.username}</div>
                            <div class="friend-status-text ${player.isOnline ? 'online' : ''}">
                                ${player.isOnline ? '🟢 En ligne' : '⚫ Hors ligne'}
                            </div>
                        </div>
                    </div>
                    ${buttonHTML}
                </div>
            `;
        }).join('');
    }
    
    overlay.style.display = 'flex';
}

// Fermer les résultats de recherche
function closeSearchResults() {
    document.getElementById('searchResultsOverlay').style.display = 'none';
    document.getElementById('friendSearchInput').value = '';
}

// Envoyer une demande d'ami
function sendFriendRequest(username, avatar) {
    // Vérifier si déjà ami ou demande déjà envoyée
    if (playerData.friends.some(f => f.username === username)) {
        showNotification('⚠️ Vous êtes déjà amis !', 'warning');
        return;
    }
    if (playerData.friendRequests.outgoing.some(r => r.username === username)) {
        showNotification('⚠️ Demande déjà envoyée !', 'warning');
        return;
    }
    
    // Ajouter à la liste des demandes sortantes
    playerData.friendRequests.outgoing.push({
        username: username,
        avatar: avatar,
        timestamp: 'Il y a quelques secondes'
    });
    
    savePlayerData();
    showNotification(`✅ Demande d'ami envoyée à ${username} !`, 'success');
    
    // Mettre à jour l'affichage
    displaySearchResults(mockPlayers.filter(p => 
        p.username.toLowerCase().includes(document.getElementById('friendSearchInput').value.toLowerCase()) &&
        p.username.toLowerCase() !== currentUser.toLowerCase()
    ));
    updateFriendsDisplay();
}

// Accepter une demande d'ami
function acceptFriendRequest(username) {
    // Trouver la demande
    const requestIndex = playerData.friendRequests.incoming.findIndex(r => r.username === username);
    if (requestIndex === -1) return;
    
    const request = playerData.friendRequests.incoming[requestIndex];
    
    // Ajouter aux amis
    playerData.friends.push({
        username: request.username,
        avatar: request.avatar,
        isOnline: mockPlayers.find(p => p.username === username)?.isOnline || false,
        lastSeen: 'Il y a 2 heures'
    });
    
    // Retirer de la liste des demandes
    playerData.friendRequests.incoming.splice(requestIndex, 1);
    
    savePlayerData();
    showNotification(`✅ ${username} est maintenant votre ami !`, 'success');
    updateFriendsDisplay();
}

// Refuser une demande d'ami
function declineFriendRequest(username) {
    const requestIndex = playerData.friendRequests.incoming.findIndex(r => r.username === username);
    if (requestIndex === -1) return;
    
    playerData.friendRequests.incoming.splice(requestIndex, 1);
    savePlayerData();
    showNotification(`❌ Demande de ${username} refusée`, 'info');
    updateFriendsDisplay();
}

// Annuler une demande d'ami
function cancelFriendRequest(username) {
    const requestIndex = playerData.friendRequests.outgoing.findIndex(r => r.username === username);
    if (requestIndex === -1) return;
    
    playerData.friendRequests.outgoing.splice(requestIndex, 1);
    savePlayerData();
    showNotification(`🚫 Demande à ${username} annulée`, 'info');
    updateFriendsDisplay();
}

// Retirer un ami
function removeFriend(username) {
    if (!confirm(`Voulez-vous vraiment retirer ${username} de vos amis ?`)) {
        return;
    }
    
    const friendIndex = playerData.friends.findIndex(f => f.username === username);
    if (friendIndex === -1) return;
    
    playerData.friends.splice(friendIndex, 1);
    savePlayerData();
    showNotification(`🗑️ ${username} a été retiré de vos amis`, 'info');
    updateFriendsDisplay();
}

// Voir le profil d'un ami
function viewFriendProfile(username) {
    const friend = playerData.friends.find(f => f.username === username);
    if (!friend) return;
    
    showNotification(`👤 Profil de ${username}`, 'info');
    // Ici on pourrait ajouter une fenêtre de profil détaillée
}

// Notification système
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10B981, #059669)' : 
                      type === 'warning' ? 'linear-gradient(135deg, #F59E0B, #D97706)' :
                      type === 'error' ? 'linear-gradient(135deg, #EF4444, #DC2626)' :
                      'linear-gradient(135deg, #6366F1, #4F46E5)'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 15px;
        font-weight: 700;
        font-size: 1.1rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 100000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Ajouter les animations CSS pour les notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Simuler des demandes d'amis aléatoires (pour la démo)
function simulateIncomingFriendRequests() {
    // Ajouter quelques demandes d'amis fictives pour la démo
    if (playerData.friendRequests.incoming.length === 0) {
        const randomPlayers = mockPlayers.sort(() => Math.random() - 0.5).slice(0, 2);
        randomPlayers.forEach(player => {
            if (!playerData.friends.some(f => f.username === player.username)) {
                playerData.friendRequests.incoming.push({
                    username: player.username,
                    avatar: player.avatar,
                    timestamp: 'Il y a quelques minutes'
                });
            }
        });
        savePlayerData();
    }
}

// Initialiser le système d'amis au chargement
window.addEventListener('load', () => {
    // Simuler des demandes uniquement si c'est la première fois
    setTimeout(simulateIncomingFriendRequests, 2000);
});


// ============ SYSTÈME MULTIJOUEUR COMPLET ============

// Variables globales du multijoueur
let selectedTeam = null;
let currentServer = null;
let multiplayerPlayers = [];
let chatMessages = [];
let isChatOpen = false;
let isPlayersListOpen = false;
let matchTimer = 300; // 5 minutes
let matchInterval = null;
let teamScores = { red: 0, blue: 0 };

// Base de données fictive de noms de joueurs
const playerNames = [
    'DragonSlayer', 'MoonHunter', 'ShadowNinja', 'FirePhoenix', 'IceWizard',
    'ThunderStrike', 'CosmicHero', 'NeonDancer', 'PixelWarrior', 'StarChaser',
    'GhostRider', 'BlazeMaster', 'StormBreaker', 'CrystalKnight', 'DarkMage',
    'LightningBolt', 'FrostGuardian', 'InfernoKing', 'MysticSage', 'RogueAssassin',
    'NovaBlaster', 'EchoRanger', 'VortexHunter', 'ZenMaster', 'ApexLegend'
];

// Créer des serveurs fictifs
function generateServers() {
    // Traductions des noms de langues
    const languageNames = {
        en: {
            fr: 'French',
            en: 'English',
            es: 'Spanish',
            de: 'German'
        },
        fr: {
            fr: 'Français',
            en: 'Anglais',
            es: 'Espagnol',
            de: 'Allemand'
        },
        es: {
            fr: 'Francés',
            en: 'Inglés',
            es: 'Español',
            de: 'Alemán'
        },
        de: {
            fr: 'Französisch',
            en: 'Englisch',
            es: 'Spanisch',
            de: 'Deutsch'
        }
    };
    
    const serverWord = {
        en: 'Server',
        fr: 'Serveur',
        es: 'Servidor',
        de: 'Server'
    };
    
    const languages = [
        { code: 'fr', flag: '🇫🇷' },
        { code: 'en', flag: '🇬🇧' },
        { code: 'es', flag: '🇪🇸' },
        { code: 'de', flag: '🇩🇪' }
    ];
    
    const servers = [];
    languages.forEach(lang => {
        for (let i = 1; i <= 3; i++) {
            const maxPlayers = 20;
            // SERVEURS AVEC JOUEURS FICTIFS POUR TESTER
            const currentPlayers = Math.floor(Math.random() * maxPlayers) + 1;
            // Pour désactiver les serveurs (jeu non publié), décommentez la ligne suivante :
            // const currentPlayers = 0; // Serveurs vides par défaut
            const ping = currentPlayers > 0 ? Math.floor(Math.random() * 100) + 20 : 0;
            
            const langName = languageNames[currentLanguage]?.[lang.code] || languageNames['en'][lang.code];
            const servWord = serverWord[currentLanguage] || serverWord['en'];
            
            servers.push({
                id: `${lang.code}-${i}`,
                language: lang.code,
                flag: lang.flag,
                name: `${servWord} ${langName} #${i}`,
                players: currentPlayers,
                maxPlayers: maxPlayers,
                ping: ping,
                full: currentPlayers >= maxPlayers
            });
        }
    });
    
    return servers;
}

let allServers = generateServers();

// Afficher l'écran multijoueur
function showMultiplayerScreen() {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById('multiplayerScreen').classList.add('active');
    refreshServers();
    updateFriendsPlaying();
}

// Sélectionner une équipe
function selectTeam(team) {
    selectedTeam = team;
    showNotification(`✅ Équipe ${team === 'red' ? 'ROUGE 🔴' : 'BLEUE 🔵'} sélectionnée !`, 'success');
    
    // Scroll vers les serveurs
    setTimeout(() => {
        document.querySelector('.servers-container').scrollIntoView({ behavior: 'smooth' });
    }, 500);
}

// Rafraîchir les serveurs
function refreshServers() {
    allServers = generateServers();
    filterServers();
}

// Filtrer les serveurs par langue
function filterServers() {
    const languageFilter = document.getElementById('languageFilter').value;
    const serversList = document.getElementById('serversList');
    
    let filteredServers = allServers;
    if (languageFilter !== 'all') {
        filteredServers = allServers.filter(s => s.language === languageFilter);
    }
    
    if (filteredServers.length === 0) {
        serversList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <div class="empty-text">Aucun serveur disponible</div>
            </div>
        `;
        return;
    }
    
    serversList.innerHTML = filteredServers.map(server => {
        // Vérifier si le serveur a des joueurs
        const isEmpty = server.players === 0;
        const isFull = server.full;
        const canJoin = !isEmpty && !isFull && selectedTeam;
        
        // Traductions pour les boutons
        const translations = {
            join: {
                en: '🎮 JOIN',
                fr: '🎮 REJOINDRE',
                es: '🎮 UNIRSE',
                de: '🎮 BEITRETEN'
            },
            unavailable: {
                en: '🚫 SERVER UNAVAILABLE',
                fr: '🚫 SERVEUR INACCESSIBLE',
                es: '🚫 SERVIDOR NO DISPONIBLE',
                de: '🚫 SERVER NICHT VERFÜGBAR'
            },
            full: {
                en: '🔒 FULL',
                fr: '🔒 COMPLET',
                es: '🔒 LLENO',
                de: '🔒 VOLL'
            },
            chooseTeam: {
                en: '⚠️ CHOOSE TEAM',
                fr: '⚠️ CHOISIR ÉQUIPE',
                es: '⚠️ ELEGIR EQUIPO',
                de: '⚠️ TEAM WÄHLEN'
            },
            offline: {
                en: '⚠️ Offline',
                fr: '⚠️ Hors ligne',
                es: '⚠️ Desconectado',
                de: '⚠️ Offline'
            }
        };
        
        let buttonText = translations.join[currentLanguage] || translations.join['en'];
        let buttonDisabled = false;
        
        if (isEmpty) {
            buttonText = translations.unavailable[currentLanguage] || translations.unavailable['en'];
            buttonDisabled = true;
        } else if (isFull) {
            buttonText = translations.full[currentLanguage] || translations.full['en'];
            buttonDisabled = true;
        } else if (!selectedTeam) {
            buttonText = translations.chooseTeam[currentLanguage] || translations.chooseTeam['en'];
            buttonDisabled = true;
        }
        
        const offlineText = translations.offline[currentLanguage] || translations.offline['en'];
        
        return `
            <div class="server-card ${isEmpty ? 'server-unavailable' : ''}">
                <div class="server-info">
                    <div class="server-flag">${server.flag}</div>
                    <div class="server-details">
                        <div class="server-name">${server.name}</div>
                        <div class="server-meta">
                            <span class="server-players ${isEmpty ? 'empty' : ''}">${isEmpty ? '⚠️' : '👥'} ${server.players}/${server.maxPlayers}</span>
                            <span class="server-ping">${isEmpty ? offlineText : '📶 ' + server.ping + 'ms'}</span>
                        </div>
                    </div>
                </div>
                <div class="server-actions">
                    <button class="join-server-btn" 
                            onclick="joinServer('${server.id}')" 
                            ${buttonDisabled ? 'disabled' : ''}>
                        ${buttonText}
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // Mettre à jour les compteurs d'équipe
    const redCount = Math.floor(filteredServers.reduce((sum, s) => sum + s.players, 0) / 2);
    const blueCount = filteredServers.reduce((sum, s) => sum + s.players, 0) - redCount;
    document.getElementById('redTeamCount').textContent = redCount;
    document.getElementById('blueTeamCount').textContent = blueCount;
}

// Mettre à jour les amis en jeu
function updateFriendsPlaying() {
    const friendsPlayingList = document.getElementById('friendsPlayingList');
    
    // Simuler des amis en jeu
    const friendsPlaying = playerData.friends.filter(f => f.isOnline).slice(0, 3).map(friend => ({
        ...friend,
        server: allServers[Math.floor(Math.random() * allServers.length)],
        team: Math.random() > 0.5 ? 'red' : 'blue'
    }));
    
    if (friendsPlaying.length === 0) {
        friendsPlayingList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💤</div>
                <div class="empty-text">Aucun ami en jeu actuellement</div>
            </div>
        `;
        return;
    }
    
    friendsPlayingList.innerHTML = friendsPlaying.map(friend => `
        <div class="friend-playing-card">
            <div class="friend-playing-info">
                <div class="friend-avatar">
                    ${friend.avatar}
                    <div class="friend-status-indicator online"></div>
                </div>
                <div class="friend-details">
                    <div class="friend-name">${friend.username}</div>
                    <div class="friend-status-text online">
                        ${friend.team === 'red' ? '🔴' : '🔵'} ${friend.server.name}
                    </div>
                </div>
            </div>
            <button class="join-friend-btn" onclick="joinFriendServer('${friend.server.id}', '${friend.team}')">
                🎮 REJOINDRE
            </button>
        </div>
    `).join('');
}

// Rejoindre le serveur d'un ami
function joinFriendServer(serverId, team) {
    selectedTeam = team;
    showNotification(`🎮 Vous rejoignez votre ami dans l'équipe ${team === 'red' ? 'ROUGE 🔴' : 'BLEUE 🔵'} !`, 'success');
    setTimeout(() => joinServer(serverId), 500);
}

// Rejoindre un serveur
function joinServer(serverId) {
    if (!selectedTeam) {
        showNotification('⚠️ Choisissez d\'abord une équipe !', 'warning');
        return;
    }
    
    currentServer = allServers.find(s => s.id === serverId);
    if (!currentServer) {
        showNotification('❌ Serveur introuvable !', 'error');
        return;
    }
    
    if (currentServer.full) {
        showNotification('🔒 Serveur complet !', 'warning');
        return;
    }
    
    showNotification(`🎮 Connexion au ${currentServer.name}...`, 'info');
    
    setTimeout(() => {
        startMultiplayerGame();
    }, 1500);
}

// Démarrer le jeu multijoueur
function startMultiplayerGame() {
    // Fermer tous les écrans
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById('multiplayerGameScreen').classList.add('active');
    
    // Générer les joueurs
    generateMultiplayerPlayers();
    
    // Initialiser les scores
    teamScores = { red: 0, blue: 0 };
    updateTeamScores();
    
    // Démarrer le timer du match
    matchTimer = 300; // 5 minutes
    startMatchTimer();
    
    // Ajouter des messages de bienvenue dans le chat
    addChatMessage('Système', 'all', `Bienvenue sur ${currentServer.name} ! 🎮`, Date.now());
    addChatMessage('Système', 'all', `La partie commence ! Bon jeu à tous ! ⚔️`, Date.now() + 1000);
    
    // Simuler des messages de chat
    simulateChatMessages();
    
    // Afficher les joueurs
    updatePlayersListDisplay();
    
    // Dessiner un message sur le canvas (démo)
    const canvas = document.getElementById('multiplayerCanvas');
    const ctx = canvas.getContext('2d');
    
    // Fond du canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Message de démo
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎮 MULTIPLAYER DEMO', canvas.width / 2, canvas.height / 2 - 60);
    
    ctx.font = '20px Arial';
    ctx.fillStyle = '#9CA3AF';
    ctx.fillText('This is a multiplayer simulation', canvas.width / 2, canvas.height / 2 - 10);
    ctx.fillText('Use the chat on the left to test! 💬', canvas.width / 2, canvas.height / 2 + 30);
    ctx.fillText('Real gameplay requires a backend server', canvas.width / 2, canvas.height / 2 + 70);
    
    showNotification('🎮 Partie lancée ! Bonne chance ! ⚔️', 'success');
}

// Générer les joueurs du match
function generateMultiplayerPlayers() {
    multiplayerPlayers = [];
    
    // Ajouter le joueur actuel
    multiplayerPlayers.push({
        username: currentUser || 'Joueur1',
        avatar: '👤',
        team: selectedTeam,
        score: 0,
        isCurrentPlayer: true
    });
    
    // Ajouter des joueurs aléatoires
    const numPlayers = Math.min(currentServer.players - 1, 19);
    const usedNames = [currentUser];
    
    for (let i = 0; i < numPlayers; i++) {
        let name = playerNames[Math.floor(Math.random() * playerNames.length)];
        while (usedNames.includes(name)) {
            name = playerNames[Math.floor(Math.random() * playerNames.length)];
        }
        usedNames.push(name);
        
        multiplayerPlayers.push({
            username: name,
            avatar: ['🐭', '🦊', '🐺', '🐻', '🐼', '🦁', '🐯', '🐨'][Math.floor(Math.random() * 8)],
            team: i % 2 === 0 ? 'red' : 'blue',
            score: Math.floor(Math.random() * 100)
        });
    }
}

// Mettre à jour l'affichage des scores des équipes
function updateTeamScores() {
    document.getElementById('redScore').textContent = teamScores.red;
    document.getElementById('blueScore').textContent = teamScores.blue;
}

// Démarrer le timer du match
function startMatchTimer() {
    if (matchInterval) clearInterval(matchInterval);
    
    matchInterval = setInterval(() => {
        matchTimer--;
        
        const minutes = Math.floor(matchTimer / 60);
        const seconds = matchTimer % 60;
        document.getElementById('matchTimer').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Simuler des points aléatoires
        if (Math.random() > 0.95) {
            const team = Math.random() > 0.5 ? 'red' : 'blue';
            teamScores[team] += Math.floor(Math.random() * 10) + 5;
            updateTeamScores();
            
            const scorer = multiplayerPlayers.find(p => p.team === team);
            if (scorer) {
                scorer.score += 10;
                addChatMessage('Système', team, `${scorer.username} a marqué ! +10 points ! 🎯`, Date.now());
                updatePlayersListDisplay();
            }
        }
        
        if (matchTimer <= 0) {
            endMultiplayerGame();
        }
    }, 1000);
}

// Terminer le jeu multijoueur
function endMultiplayerGame() {
    clearInterval(matchInterval);
    
    const winner = teamScores.red > teamScores.blue ? 'ROUGE 🔴' : 
                   teamScores.blue > teamScores.red ? 'BLEUE 🔵' : 'ÉGALITÉ';
    
    showNotification(`🏆 Fin du match ! Équipe ${winner} gagne ! 🎉`, 'success');
    
    setTimeout(() => {
        backToMenu();
    }, 3000);
}

// Pause du jeu multijoueur
function pauseMultiplayerGame() {
    const pauseMenu = document.getElementById('multiplayerPauseMenu');
    
    if (pauseMenu.style.display === 'none' || !pauseMenu.style.display) {
        // Mettre en pause
        if (matchInterval) {
            clearInterval(matchInterval);
            matchInterval = null;
        }
        pauseMenu.style.display = 'flex';
        showNotification('⏸️ Partie en pause', 'info');
    } else {
        // Reprendre
        resumeMultiplayerGame();
    }
}

// Reprendre le jeu multijoueur
function resumeMultiplayerGame() {
    const pauseMenu = document.getElementById('multiplayerPauseMenu');
    pauseMenu.style.display = 'none';
    
    // Redémarrer le timer
    startMatchTimer();
    showNotification('▶️ Partie reprise', 'success');
}

// Quitter le jeu multijoueur
function quitMultiplayerGame() {
    if (confirm('Voulez-vous vraiment quitter la partie ?')) {
        if (matchInterval) {
            clearInterval(matchInterval);
            matchInterval = null;
        }
        
        const pauseMenu = document.getElementById('multiplayerPauseMenu');
        pauseMenu.style.display = 'none';
        
        showNotification('👋 Vous avez quitté la partie', 'info');
        backToMenu();
    }
}

// Écouter la touche Échap pour le menu pause multijoueur
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const multiplayerGameScreen = document.getElementById('multiplayerGameScreen');
        if (multiplayerGameScreen && multiplayerGameScreen.classList.contains('active')) {
            pauseMultiplayerGame();
        }
    }
});

// Toggle chat
function toggleChat() {
    isChatOpen = !isChatOpen;
    const chatBox = document.getElementById('chatBox');
    
    if (isChatOpen) {
        chatBox.classList.add('active');
        document.getElementById('chatInput').focus();
        // Réinitialiser le compteur de messages non lus
        document.getElementById('unreadCount').style.display = 'none';
    } else {
        chatBox.classList.remove('active');
    }
}

// Envoyer un message dans le chat
function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addChatMessage(currentUser || 'Joueur1', selectedTeam, message, Date.now(), true);
    input.value = '';
    
    // Simuler une réponse
    setTimeout(() => {
        const randomPlayer = multiplayerPlayers[Math.floor(Math.random() * multiplayerPlayers.length)];
        const responses = [
            'Bien joué ! 👍',
            'Continue comme ça ! 🔥',
            'On gagne ensemble ! 💪',
            'Super stratégie ! 🎯',
            'Attention derrière toi ! ⚠️'
        ];
        addChatMessage(randomPlayer.username, randomPlayer.team, responses[Math.floor(Math.random() * responses.length)], Date.now());
    }, Math.random() * 3000 + 1000);
}

// Ajouter un message au chat
function addChatMessage(username, team, text, timestamp, isOwn = false) {
    const messagesContainer = document.getElementById('chatMessages');
    
    const time = new Date(timestamp);
    const timeStr = `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;
    
    const messageEl = document.createElement('div');
    messageEl.className = `chat-message ${isOwn ? 'own' : ''} team-${team}`;
    messageEl.innerHTML = `
        <div class="chat-message-header">
            <span class="chat-username ${team}">${username}</span>
            <span class="chat-timestamp">${timeStr}</span>
        </div>
        <div class="chat-message-text">${text}</div>
    `;
    
    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Notification si le chat est fermé
    if (!isChatOpen && !isOwn) {
        const unreadBadge = document.getElementById('unreadCount');
        unreadBadge.style.display = 'flex';
        const currentCount = parseInt(unreadBadge.textContent) || 0;
        unreadBadge.textContent = currentCount + 1;
    }
}

// Simuler des messages de chat
function simulateChatMessages() {
    const messages = [
        'Salut tout le monde ! 👋',
        'Prêts pour cette partie ? 🔥',
        'Bonne chance à tous ! 🍀',
        'On va gagner ! 💪',
        'Go go go ! ⚡',
        'Nice ! 👍',
        'GG ! 🎉',
        'Bien joué team ! 🏆'
    ];
    
    setInterval(() => {
        if (Math.random() > 0.7) {
            const player = multiplayerPlayers[Math.floor(Math.random() * multiplayerPlayers.length)];
            const message = messages[Math.floor(Math.random() * messages.length)];
            addChatMessage(player.username, player.team, message, Date.now());
        }
    }, 5000);
}

// Toggle liste des joueurs
function togglePlayersList() {
    isPlayersListOpen = !isPlayersListOpen;
    const container = document.getElementById('playersListContainer');
    
    if (isPlayersListOpen) {
        container.classList.add('active');
    } else {
        container.classList.remove('active');
    }
}

// Mettre à jour l'affichage de la liste des joueurs
function updatePlayersListDisplay() {
    const redPlayers = multiplayerPlayers.filter(p => p.team === 'red').sort((a, b) => b.score - a.score);
    const bluePlayers = multiplayerPlayers.filter(p => p.team === 'blue').sort((a, b) => b.score - a.score);
    
    const redTeamList = document.getElementById('redTeamPlayers');
    const blueTeamList = document.getElementById('blueTeamPlayers');
    
    redTeamList.innerHTML = redPlayers.map(player => `
        <div class="player-item">
            <div class="player-item-info">
                <div class="player-avatar-small">${player.avatar}</div>
                <div class="player-name-small">${player.username}${player.isCurrentPlayer ? ' (Vous)' : ''}</div>
            </div>
            <div class="player-score-small">${player.score}</div>
        </div>
    `).join('');
    
    blueTeamList.innerHTML = bluePlayers.map(player => `
        <div class="player-item">
            <div class="player-item-info">
                <div class="player-avatar-small">${player.avatar}</div>
                <div class="player-name-small">${player.username}${player.isCurrentPlayer ? ' (Vous)' : ''}</div>
            </div>
            <div class="player-score-small">${player.score}</div>
        </div>
    `).join('');
}

// Pause du jeu multijoueur
function pauseMultiplayerGame() {
    if (matchInterval) {
        clearInterval(matchInterval);
        matchInterval = null;
        showNotification('⏸️ Partie en pause', 'info');
    } else {
        startMatchTimer();
        showNotification('▶️ Partie reprise', 'success');
    }
}

// ================================
// CONTRÔLES TACTILES MOBILE
// ================================

// Variables pour les contrôles tactiles
let touchControls = {
    joystick: {
        active: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        directionX: 0,
        directionY: 0
    },
    jump: false,
    attack: false,
    attackProcessed: false,
    // Pour nettoyer les event listeners
    mouseMoveHandler: null,
    mouseUpHandler: null
};

// Initialiser les contrôles tactiles
function initTouchControls() {
    // Nettoyer les anciens listeners globaux (si ils existent)
    if (touchControls.mouseMoveHandler) {
        document.removeEventListener('mousemove', touchControls.mouseMoveHandler);
    }
    if (touchControls.mouseUpHandler) {
        document.removeEventListener('mouseup', touchControls.mouseUpHandler);
    }
    
    const joystickBase = document.querySelector('.joystick-base');
    const joystickStick = document.getElementById('joystickStick');
    const btnJump = document.getElementById('btnJump');
    const btnAttack = document.getElementById('btnAttack');
    
    if (!joystickStick || !btnJump || !btnAttack || !joystickBase) {
        console.log('❌ Contrôles tactiles non trouvés');
        setTimeout(initTouchControls, 500); // Réessayer
        return;
    }
    
    console.log('✅ Initialisation des contrôles tactiles...');
    
    // IMPORTANT: Retirer les anciens listeners
    const newJoystickBase = joystickBase.cloneNode(true);
    joystickBase.parentNode.replaceChild(newJoystickBase, joystickBase);
    
    const newBtnJump = btnJump.cloneNode(true);
    btnJump.parentNode.replaceChild(newBtnJump, btnJump);
    
    const newBtnAttack = btnAttack.cloneNode(true);
    btnAttack.parentNode.replaceChild(newBtnAttack, btnAttack);
    
    // Récupérer les nouveaux éléments
    const freshBase = document.querySelector('.joystick-base');
    const freshStick = document.getElementById('joystickStick');
    const freshJump = document.getElementById('btnJump');
    const freshAttack = document.getElementById('btnAttack');
    
    // ============================================
    // JOYSTICK - TOUCH (Mobile réel)
    // ============================================
    freshBase.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        touchControls.joystick.active = true;
        freshStick.classList.add('active');
        
        const touch = e.touches[0];
        const rect = freshBase.getBoundingClientRect();
        touchControls.joystick.startX = rect.left + rect.width / 2;
        touchControls.joystick.startY = rect.top + rect.height / 2;
        
        console.log('🕹️ Joystick activé (touch)');
    }, { passive: false });
    
    freshBase.addEventListener('touchmove', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!touchControls.joystick.active) return;
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - touchControls.joystick.startX;
        const deltaY = touch.clientY - touchControls.joystick.startY;
        
        const maxDistance = 40;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance > maxDistance) {
            const angle = Math.atan2(deltaY, deltaX);
            touchControls.joystick.currentX = Math.cos(angle) * maxDistance;
            touchControls.joystick.currentY = Math.sin(angle) * maxDistance;
        } else {
            touchControls.joystick.currentX = deltaX;
            touchControls.joystick.currentY = deltaY;
        }
        
        freshStick.style.transform = `translate(calc(-50% + ${touchControls.joystick.currentX}px), calc(-50% + ${touchControls.joystick.currentY}px))`;
        
        touchControls.joystick.directionX = touchControls.joystick.currentX / maxDistance;
        touchControls.joystick.directionY = touchControls.joystick.currentY / maxDistance;
    }, { passive: false });
    
    const joystickEnd = (e) => {
        if (e.preventDefault) e.preventDefault();
        touchControls.joystick.active = false;
        touchControls.joystick.directionX = 0;
        touchControls.joystick.directionY = 0;
        freshStick.classList.remove('active');
        freshStick.style.transform = 'translate(-50%, -50%)';
    };
    
    freshBase.addEventListener('touchend', joystickEnd, { passive: false });
    freshBase.addEventListener('touchcancel', joystickEnd, { passive: false });
    
    // ============================================
    // JOYSTICK - MOUSE (Mode dev Chrome sur PC)
    // ============================================
    freshBase.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        touchControls.joystick.active = true;
        freshStick.classList.add('active');
        
        const rect = freshBase.getBoundingClientRect();
        touchControls.joystick.startX = rect.left + rect.width / 2;
        touchControls.joystick.startY = rect.top + rect.height / 2;
        
        console.log('🕹️ Joystick activé (mouse)');
    });
    
    // IMPORTANT : mousemove sur DOCUMENT (pas sur freshBase)
    const handleMouseMove = (e) => {
        if (!touchControls.joystick.active) return;
        
        const deltaX = e.clientX - touchControls.joystick.startX;
        const deltaY = e.clientY - touchControls.joystick.startY;
        
        const maxDistance = 40;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance > maxDistance) {
            const angle = Math.atan2(deltaY, deltaX);
            touchControls.joystick.currentX = Math.cos(angle) * maxDistance;
            touchControls.joystick.currentY = Math.sin(angle) * maxDistance;
        } else {
            touchControls.joystick.currentX = deltaX;
            touchControls.joystick.currentY = deltaY;
        }
        
        freshStick.style.transform = `translate(calc(-50% + ${touchControls.joystick.currentX}px), calc(-50% + ${touchControls.joystick.currentY}px))`;
        
        touchControls.joystick.directionX = touchControls.joystick.currentX / maxDistance;
        touchControls.joystick.directionY = touchControls.joystick.currentY / maxDistance;
    };
    
    // Sauvegarder les handlers pour pouvoir les nettoyer plus tard
    touchControls.mouseMoveHandler = handleMouseMove;
    touchControls.mouseUpHandler = joystickEnd;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', joystickEnd);
    
    // ============================================
    // BOUTON SAUTER - TOUCH (Mobile/Tablette)
    // ============================================
    freshJump.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        touchControls.jump = true;
        freshJump.style.transform = 'scale(0.85)';
        console.log('⬆️ Saut activé (touch)');
    }, { passive: false });
    
    const jumpEnd = (e) => {
        if (e.preventDefault) e.preventDefault();
        touchControls.jump = false;
        freshJump.style.transform = 'scale(1)';
    };
    
    freshJump.addEventListener('touchend', jumpEnd, { passive: false });
    freshJump.addEventListener('touchcancel', jumpEnd, { passive: false });
    
    // ============================================
    // BOUTON SAUTER - MOUSE (PC/Mode dev)
    // ============================================
    freshJump.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        touchControls.jump = true;
        freshJump.style.transform = 'scale(0.85)';
        console.log('⬆️ Saut activé (mouse)');
    });
    
    freshJump.addEventListener('mouseup', jumpEnd);
    freshJump.addEventListener('mouseleave', jumpEnd);
    
    // ============================================
    // BOUTON ATTAQUER - TOUCH (Mobile/Tablette)
    // ============================================
    freshAttack.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        touchControls.attack = true;
        freshAttack.style.transform = 'scale(0.85)';
        console.log('⚔️ Attaque activée (touch)');
    }, { passive: false });
    
    const attackEnd = (e) => {
        if (e.preventDefault) e.preventDefault();
        touchControls.attack = false;
        freshAttack.style.transform = 'scale(1)';
    };
    
    freshAttack.addEventListener('touchend', attackEnd, { passive: false });
    freshAttack.addEventListener('touchcancel', attackEnd, { passive: false });
    
    // ============================================
    // BOUTON ATTAQUER - MOUSE (PC/Mode dev)
    // ============================================
    freshAttack.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        touchControls.attack = true;
        freshAttack.style.transform = 'scale(0.85)';
        console.log('⚔️ Attaque activée (mouse)');
    });
    
    freshAttack.addEventListener('mouseup', attackEnd);
    freshAttack.addEventListener('mouseleave', attackEnd);
    
    console.log('✅ Contrôles tactiles prêts (touch + mouse) !');
}

// Mettre à jour les contrôles du moteur de jeu avec les contrôles tactiles
function updateGameEngineWithTouchControls() {
    if (!gameEngine) return;
    
    // ⚠️ NE PAS ÉCRASER LES TOUCHES CLAVIER !
    // On active uniquement, on ne désactive jamais (le clavier s'occupe de ça)
    
    // Déplacement horizontal depuis le joystick
    if (Math.abs(touchControls.joystick.directionX) > 0.2) {
        if (touchControls.joystick.directionX < 0) {
            gameEngine.keys['ArrowLeft'] = true;
            // Ne PAS désactiver ArrowRight (le joueur peut appuyer sur la touche du clavier)
        } else {
            gameEngine.keys['ArrowRight'] = true;
            // Ne PAS désactiver ArrowLeft
        }
    }
    // ⚠️ NE PAS METTRE À FALSE quand le joystick n'est pas actif !
    // Sinon ça écrase les touches du clavier
    
    // Saut depuis le bouton
    if (touchControls.jump) {
        gameEngine.keys['ArrowUp'] = true;
        gameEngine.keys[' '] = true; // Espace aussi
    }
    // ⚠️ NE PAS METTRE À FALSE ici non plus
    
    // Attaque depuis le bouton (simule un clic sur le canvas)
    if (touchControls.attack && !touchControls.attackProcessed) {
        touchControls.attackProcessed = true;
        // Simuler un clic au centre du canvas pour l'attaque
        if (gameEngine.canvas) {
            const rect = gameEngine.canvas.getBoundingClientRect();
            const clickEvent = new MouseEvent('click', {
                clientX: rect.left + rect.width / 2,
                clientY: rect.top + rect.height / 2,
                bubbles: true
            });
            gameEngine.canvas.dispatchEvent(clickEvent);
        }
    } else if (!touchControls.attack) {
        touchControls.attackProcessed = false;
    }
}

// Modifier la boucle de jeu pour inclure les contrôles tactiles
const originalGameLoop = function gameLoop(timestamp) {
    if (!gameEngine) return;
    
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    
    // Mettre à jour les contrôles tactiles
    updateGameEngineWithTouchControls();
    
    if (!gameEngine.isPaused) {
        gameEngine.update(deltaTime);
        gameEngine.render();
        updateHUD();
    }
    
    animationId = requestAnimationFrame(gameLoop);
};

// Initialiser les contrôles tactiles au chargement
window.addEventListener('DOMContentLoaded', () => {
    initTouchControls();
});

// ================================
// GESTION DE L'ORIENTATION ÉCRAN
// ================================

// Forcer l'orientation paysage sur mobile
function forceLandscapeOrientation() {
    // Vérifier si on est sur mobile/tablette
    if (window.screen && window.screen.orientation) {
        try {
            // Tenter de verrouiller en mode paysage
            window.screen.orientation.lock('landscape').then(() => {
                console.log('📱 Orientation verrouillée en paysage');
            }).catch((err) => {
                console.log('⚠️ Impossible de verrouiller l\'orientation:', err.message);
                // Fallback: demander à l'utilisateur de tourner
                showOrientationHint();
            });
        } catch (err) {
            console.log('⚠️ API Orientation non supportée');
        }
    }
}

// Déverrouiller l'orientation
function unlockOrientation() {
    if (window.screen && window.screen.orientation) {
        try {
            window.screen.orientation.unlock();
            console.log('📱 Orientation déverrouillée');
        } catch (err) {
            console.log('⚠️ Erreur déverrouillage orientation:', err);
        }
    }
}

// Afficher un hint temporaire si nécessaire
function showOrientationHint() {
    // Créer un hint temporaire si on est en portrait
    if (window.innerHeight > window.innerWidth) {
        const hint = document.createElement('div');
        hint.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 2rem;
            border-radius: 20px;
            text-align: center;
            z-index: 10001;
            font-size: 1.2rem;
            animation: fadeIn 0.3s ease;
        `;
        hint.innerHTML = '🔄<br>Tournez votre appareil<br>en mode paysage';
        document.body.appendChild(hint);
        
        // Retirer le hint quand on tourne
        const checkOrientation = () => {
            if (window.innerWidth > window.innerHeight) {
                hint.remove();
                window.removeEventListener('resize', checkOrientation);
            }
        };
        window.addEventListener('resize', checkOrientation);
        
        // Auto-retirer après 5 secondes
        setTimeout(() => {
            if (hint.parentElement) {
                hint.remove();
            }
            window.removeEventListener('resize', checkOrientation);
        }, 5000);
    }
}


