// Moteur de jeu - Physique et logique core

class GameEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        // Taille par défaut (sera ajustée dynamiquement)
        this.width = 1280;
        this.height = 720;
        this.tileSize = 60; // Taille par défaut
        this.tileSizeX = 60; // Largeur des tiles
        this.tileSizeY = 60; // Hauteur des tiles
        
        // État du jeu
        this.currentLevel = 1;
        this.lives = 3;
        this.score = 0;
        this.cheeseCollected = 0;
        this.totalCheese = 0;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.isPaused = false;
        this.isGameOver = false;
        this.isVictory = false;
        this.difficulty = 'medium'; // Difficulté par défaut
        
        // Joueur (souris) - taille relative aux tiles (80% d'une tile)
        this.player = {
            x: 0,
            y: 0,
            width: 40,  // 80% du tileSize par défaut (60 * 0.67 ≈ 40)
            height: 40,
            velocityX: 0,
            velocityY: 0,
            speed: 5,
            jumpPower: 20, // Augmenté pour avoir plus d'espace pour les doubles sauts
            isJumping: false,
            onGround: false,
            direction: 'right',
            animationFrame: 0,
            animationTimer: 0,
            // Pouvoirs spéciaux selon le skin
            currentSkin: 'default',
            powerCooldown: 0,
            isInvincible: false,
            invincibilityTimer: 0,
            speedBoost: 1,
            doubleJumpUsed: false,  // Simplifié
            jumpKeyPressed: false,   // Pour détecter nouvelle pression
            // Système de chute
            isStunned: false,
            stunnedTimer: 0,
            // Système d'attaque
            isAttacking: false,
            attackTimer: 0,
            attackCooldown: 0,
            attackDuration: 300, // ms
            attackCooldownTime: 400, // ms - réduit pour attaquer plus vite
            attackRange: 100, // pixels - AUGMENTÉ pour une meilleure portée
            attackDamage: 999, // DÉGÂTS MASSIFS - tue en 1 coup
            // Nom d'utilisateur pour multijoueur
            username: null,
            team: null // 'red' ou 'blue' en multijoueur
        };
        
        // Niveau actuel
        this.levelData = null;
        this.tiles = [];
        this.cheeses = [];
        this.traps = [];
        this.enemies = [];
        this.exit = null;
        
        // Contrôles
        this.keys = {};
        
        // Physique
        this.gravity = 0.6;
        this.friction = 0.8;
        
        // Camera
        this.camera = {
            x: 0,
            y: 0
        };
        
        this.init();
    }
    
    init() {
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            return;
        }
        
        
        this.ctx = this.canvas.getContext('2d');
        
        // Adapter la taille du canvas à l'écran
        this.resizeCanvas();
        
        // Réécouter les changements de taille d'écran
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.resizeCanvas(), 100);
        });
        
        // Event listeners
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // 🔧 ÉCOUTEUR DE CLIC SUR TOUTE LA FENÊTRE (plus fiable)
        window.addEventListener('click', (e) => {
            // Ne pas attaquer si on clique sur un bouton
            if (e.target.tagName === 'BUTTON') return;
            
            this.handleAttack(e);
        });
        
        // Écouteur sur le canvas aussi (au cas où)
        this.canvas.addEventListener('click', (e) => {
            this.handleAttack(e);
        });
        
    }
    
    resizeCanvas() {
        // Obtenir les dimensions de la fenêtre
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Vérifier si on est sur mobile (largeur < 768px)
        const isMobile = windowWidth <= 768;
        
        if (isMobile) {
            // Sur mobile : adapter au viewport
            const isLandscape = windowWidth > windowHeight;
            
            if (isLandscape) {
                // Mode paysage : utiliser presque toute la largeur
                this.width = windowWidth - 10;
                this.height = windowHeight - 80; // Espace pour le HUD
            } else {
                // Mode portrait : adapter complètement à l'écran
                this.width = windowWidth - 10;
                this.height = windowHeight - 120; // Espace pour HUD et contrôles
            }
        } else {
            // Sur desktop/tablette : taille normale
            this.width = Math.min(windowWidth - 40, 1280);
            this.height = Math.min(windowHeight - 200, 720);
        }
        
        // Appliquer les dimensions au canvas
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // Appliquer aussi via CSS pour s'assurer que c'est responsive
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';
        this.canvas.style.maxWidth = '100%';
        this.canvas.style.height = 'auto';
        
        // Recalculer les tailles de tiles si un niveau est chargé
        if (this.levelData && this.levelData.map) {
            const levelCols = this.levelData.map[0].length;
            const levelRows = this.levelData.map.length;
            this.tileSizeX = Math.floor(this.width / levelCols);
            this.tileSizeY = Math.floor(this.height / levelRows);
            this.tileSize = this.tileSizeY;
        }
    }
    
    handleKeyDown(e) {
        this.keys[e.key] = true;
        
        if (e.key === 'Escape') {
            pauseGame();
        }
        
        // Empêcher le défilement avec les flèches
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }
    }
    
    handleKeyUp(e) {
        this.keys[e.key] = false;
    }
    
    handleAttack(e) {
        // Ne pas attaquer si le jeu est en pause ou terminé
        if (this.isPaused || this.isGameOver || this.isVictory) return;
        
        // Ne pas attaquer si le joueur est étourdi
        if (this.player.isStunned) return;
        
        // Vérifier le cooldown
        if (this.player.attackCooldown > 0) return;
        
        
        // Jouer le son d'attaque
        if (typeof playSound === 'function') {
            playSound('attack');
        }
        
        // Démarrer l'attaque
        this.player.isAttacking = true;
        this.player.attackTimer = Date.now();
        this.player.attackCooldown = this.player.attackCooldownTime;
        
        // Vérifier les ennemis dans la zone d'attaque
        this.performAttack();
    }
    
    performAttack() {
        const player = this.player;
        const attackRange = player.attackRange;
        
        // 🔧 DÉGÂTS PAR SKIN/ARME
        const weaponDamage = {
            'default': 1,           // Fromage : 1 dégât
            'skin-ninja': 2,        // Ninja : 2 dégâts
            'skin-pirate': 1,       // Pirate : 1 dégât
            'skin-robot': 2,        // Robot : 2 dégâts
            'skin-knight': 2,       // Chevalier : 2 dégâts
            'skin-wizard': 3,       // Sorcier : 3 dégâts (tue en 1 coup)
            'skin-dragon': 999,     // Dragon Légendaire : INSTANT KILL
            'skin-rainbow': 999,    // Arc-en-ciel : INSTANT KILL
            'skin-golden': 999      // Souris dorée : INSTANT KILL
        };
        
        const damage = weaponDamage[player.currentSkin] || 1;
        
        // Calculer la zone d'attaque (devant le joueur)
        const attackX = player.direction === 'right' 
            ? player.x + player.width 
            : player.x - attackRange;
        const attackY = player.y - player.height * 0.5; // Zone plus haute
        const attackWidth = attackRange;
        const attackHeight = player.height * 2; // Zone plus grande
        
        // Zone d'attaque virtuelle
        const attackZone = {
            x: attackX,
            y: attackY,
            width: attackWidth,
            height: attackHeight
        };
        
        let enemiesKilled = 0;
        
        // Vérifier chaque ennemi
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // Vérifier la collision avec la zone d'attaque
            if (this.checkRectCollision(attackZone, enemy)) {
                // Jouer le son "aie" quand on touche un ennemi
                if (typeof playSound === 'function') {
                    playSound('death');
                }
                
                // 🔧 ENLEVER DES PV AU LIEU DE TUER DIRECTEMENT
                enemy.health -= damage;
                
                // Si l'ennemi est mort, le retirer
                if (enemy.health <= 0) {
                    this.enemies.splice(i, 1);
                    this.score += 50;
                    enemiesKilled++;
                    
                    // Mettre à jour l'affichage du score
                    if (typeof updateScore === 'function') {
                        updateScore(this.score);
                    }
                }
            }
        }
        
        if (enemiesKilled > 0) {
        } else {
        }
    }
    
    loadLevel(levelNumber) {
        this.currentLevel = levelNumber;
        this.levelData = getLevelData(levelNumber);
        
        if (!this.levelData) {
            return;
        }
        
        
        // CALCULER LES BONNES TAILLES DE TILES AVANT DE PARSER LE NIVEAU
        if (this.levelData && this.levelData.map) {
            const levelCols = this.levelData.map[0].length;
            const levelRows = this.levelData.map.length;
            
            // Adapter les tiles à la taille du canvas actuel
            this.tileSizeX = Math.floor(this.width / levelCols);
            this.tileSizeY = Math.floor(this.height / levelRows);
            this.tileSize = this.tileSizeY;
            
        }
        
        // Réinitialiser
        this.tiles = [];
        this.cheeses = [];
        this.traps = [];
        this.enemies = [];
        this.cheeseCollected = 0;
        this.score = 0;
        this.startTime = Date.now();
        
        // Parser le niveau (maintenant avec les bonnes tailles de tiles)
        this.parseLevel();
        
        
        // Positionner le joueur
        this.player.x = this.levelData.startX * this.tileSizeX;
        this.player.y = this.levelData.startY * this.tileSizeY;
        this.player.velocityX = 0;
        this.player.velocityY = 0;
        this.player.isJumping = false;
        
        // Adapter la taille du joueur
        const avgTileSize = (this.tileSizeX + this.tileSizeY) / 2;
        this.player.width = Math.floor(avgTileSize * 0.67);
        this.player.height = Math.floor(avgTileSize * 0.67);
        
        
        // Mettre à jour l'UI
        // L'indicateur de niveau a été supprimé, on ne l'utilise plus
        this.updateUI();
        
    }
    
    parseLevel() {
        const map = this.levelData.map;
        
        for (let row = 0; row < map.length; row++) {
            for (let col = 0; col < map[row].length; col++) {
                const tile = map[row][col];
                const x = col * this.tileSizeX;
                const y = row * this.tileSizeY;
                
                switch (tile) {
                    case 1: // Mur
                        this.tiles.push({
                            x, y,
                            width: this.tileSizeX,
                            height: this.tileSizeY,
                            type: 'wall'
                        });
                        break;
                    case 2: // Fromage
                        const cheeseSize = this.tileSizeY * 0.25; // Taille proportionnelle (25% de la tuile)
                        this.cheeses.push({
                            x: x + this.tileSizeX / 2,
                            y: y + this.tileSizeY, // Positionné AU BAS de la case (même niveau que les pieds)
                            collected: false,
                            rotation: 0,
                            floatOffset: 0
                        });
                        break;
                    case 3: // Piège (pics)
                        this.traps.push({
                            x, y,
                            width: this.tileSizeX,
                            height: this.tileSizeY,
                            type: 'spikes',
                            animationFrame: 0
                        });
                        break;
                    case 4: // Feu
                        this.traps.push({
                            x, y,
                            width: this.tileSizeX,
                            height: this.tileSizeY,
                            type: 'fire',
                            animationFrame: 0
                        });
                        break;
                    case 5: // Ennemi patrouilleur
                        this.enemies.push({
                            x: x,
                            y: y,
                            width: this.tileSizeX * 0.8,  // 80% de la taille d'une tuile
                            height: this.tileSizeY * 0.8,
                            velocityX: 1.5,
                            velocityY: 0,
                            direction: 'right',
                            animationFrame: 0,
                            changeDirectionTimer: 0,
                            targetChangeTime: Math.random() * 120 + 60,
                            stuckTimer: 0,
                            lastX: x,
                            lastY: y,
                            maxHealth: 3,    // 🔧 Points de vie max
                            health: 3        // 🔧 Points de vie actuels
                        });
                        break;
                    case 9: // Sortie
                        this.exit = {
                            x, y,
                            width: this.tileSizeX,
                            height: this.tileSizeY,
                            animationFrame: 0,
                            isOpen: false
                        };
                        break;
                }
            }
        }
        
        this.totalCheese = this.cheeses.length;
    }
    
    update(deltaTime) {
        if (this.isPaused || this.isGameOver || this.isVictory) return;
        
        // Mettre à jour le temps
        this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
        
        // Mettre à jour les timers d'attaque
        if (this.player.attackCooldown > 0) {
            this.player.attackCooldown -= deltaTime;
        }
        
        // Vérifier si l'animation d'attaque est terminée
        if (this.player.isAttacking) {
            const attackElapsed = Date.now() - this.player.attackTimer;
            if (attackElapsed >= this.player.attackDuration) {
                this.player.isAttacking = false;
            }
        }
        
        // Contrôles du joueur
        this.handlePlayerInput();
        
        // Physique du joueur
        this.updatePlayer(deltaTime);
        
        // Mettre à jour les ennemis
        this.updateEnemies(deltaTime);
        
        // Collisions
        this.checkCollisions();
        
        // Mettre à jour la caméra
        this.updateCamera();
        
        // Animations
        this.updateAnimations(deltaTime);
        
        // Mettre à jour l'UI
        this.updateUI();
        
        // Vérifier condition de victoire
        if (this.cheeseCollected === this.totalCheese && !this.exit.isOpen) {
            this.exit.isOpen = true;
        }
    }
    
    handlePlayerInput() {
        const player = this.player;
        
        // Appliquer les pouvoirs du skin
        this.applySkinPowers();
        
        // Mouvement horizontal (avec bonus de vitesse selon le skin)
        // Si la souris est sonnée, elle peut quand même bouger mais à vitesse réduite (50%)
        const effectiveSpeed = player.speed * player.speedBoost * (player.isStunned ? 0.5 : 1);
        
        if (this.keys['ArrowLeft']) {
            player.velocityX = -effectiveSpeed;
            player.direction = 'left';
        } else if (this.keys['ArrowRight']) {
            player.velocityX = effectiveSpeed;
            player.direction = 'right';
        } else {
            player.velocityX *= this.friction;
        }
        
        // Gestion du saut avec double saut (pas de saut si sonnée)
        if (!player.isStunned) {
            const jumpKeyDown = this.keys[' '] || this.keys['ArrowUp'];
            
            if (jumpKeyDown && !player.jumpKeyPressed) {
                // Debug: Log pour voir si le saut est détecté
                console.log('🎮 Saut détecté! onGround:', player.onGround, 'velocityY:', player.velocityY);
                
                // Nouvelle pression détectée
                if (player.onGround) {
                    // Premier saut
                    player.velocityY = -player.jumpPower;
                    player.isJumping = true;
                    player.onGround = false;
                    player.doubleJumpUsed = false;
                    console.log('✅ Saut exécuté! jumpPower:', player.jumpPower);
                } else if (!player.doubleJumpUsed) {
                    // Double saut en l'air (si le skin le permet)
                    const hasDoubleJump = ['skin-ninja', 'skin-alien', 'skin-angel', 'skin-legendary'].includes(player.currentSkin);
                    if (hasDoubleJump) {
                        player.velocityY = -player.jumpPower * 0.8;
                        player.doubleJumpUsed = true;
                        this.createJumpEffect(player.x + player.width / 2, player.y + player.height);
                    }
                }
            }
            
            player.jumpKeyPressed = jumpKeyDown;
        } else {
            // Si sonnée, pas de saut possible
            player.jumpKeyPressed = false;
        }
    }
    
    // Effet visuel pour le double saut
    createJumpEffect(x, y) {
        // Vérifier que x et y sont valides
        if (!isFinite(x) || !isFinite(y)) {
            return;
        }
        
        // Créer quelques particules pour le double saut
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const speed = 2 + Math.random() * 2;
            const particle = {
                x: x,
                y: y,
                velocityX: Math.cos(angle) * speed,
                velocityY: Math.sin(angle) * speed,
                life: 30,
                color: '#4ECDC4',
                size: 4
            };
            if (window.particleSystem && window.particleSystem.particles) {
                window.particleSystem.particles.push(particle);
            }
        }
    }
    
    // Appliquer les pouvoirs spéciaux selon le skin équipé
    applySkinPowers() {
        const player = this.player;
        const skin = player.currentSkin;
        
        // Réinitialiser les bonus
        player.speedBoost = 1;
        
        // Pouvoirs selon le skin
        switch(skin) {
            case 'skin-golden':
                // Collecte automatique des fromages proches
                const autoCollectDistance = this.tileSizeY * 1.5;
                for (let cheese of this.cheeses) {
                    if (!cheese.collected) {
                        const dist = Math.hypot(player.x + player.width/2 - cheese.x, player.y + player.height/2 - cheese.y);
                        if (dist < autoCollectDistance) {
                            cheese.collected = true;
                            this.cheeseCollected++;
                            this.score += 100;
                            
                            // 🔊 Jouer le son "miam"
                            if (typeof playSound === 'function') {
                                playSound('collect');
                            }
                            
                        }
                    }
                }
                break;
                
            case 'skin-ninja':
                // Vitesse +50%, double saut automatique
                player.speedBoost = 1.5;
                break;
                
            case 'skin-wizard':
                // Téléportation via bouton (géré dans game.js)
                break;
                
            case 'skin-vampire':
                // Régénération de vie toutes les 5 secondes
                if (Math.floor(this.elapsedTime / 60) % 5 === 0 && this.elapsedTime % 60 === 0 && this.lives < 3) {
                    this.lives++;
                }
                break;
                
            case 'skin-knight':
                // Résistance aux dégâts (invincibilité temporaire après un hit)
                if (player.isInvincible && player.invincibilityTimer > 0) {
                    player.invincibilityTimer--;
                    if (player.invincibilityTimer <= 0) {
                        player.isInvincible = false;
                    }
                }
                break;
                
            case 'skin-demon':
                // Les ennemis fuient le joueur dans un rayon plus grand
                for (let enemy of this.enemies) {
                    const dist = Math.hypot(player.x + player.width/2 - enemy.x, player.y + player.height/2 - enemy.y);
                    if (dist < this.tileSizeX * 5) { // 5 tuiles de rayon
                        // Les ennemis fuient dans la direction opposée
                        if (player.x < enemy.x) {
                            enemy.velocityX = Math.abs(enemy.velocityX || 2);
                        } else {
                            enemy.velocityX = -Math.abs(enemy.velocityX || 2);
                        }
                    }
                }
                break;
                
            case 'skin-angel':
                // Vol planant (chute très ralentie) + double saut
                if (!player.onGround && player.velocityY > 0) {
                    player.velocityY *= 0.7; // Chute 30% plus lente
                }
                break;
                
            case 'skin-alien':
                // Gravité très réduite + double saut
                if (!player.onGround) {
                    player.velocityY *= 0.85; // Gravité 15% plus faible
                }
                break;
                
            case 'skin-robot':
                // Dash rapide si on appuie sur Shift
                if (this.keys['Shift'] && player.powerCooldown <= 0) {
                    const dashSpeed = 25;
                    player.velocityX = player.direction === 'right' ? dashSpeed : -dashSpeed;
                    player.powerCooldown = 120; // 2 secondes de cooldown
                }
                break;
                
            case 'skin-pirate':
                // Double score sur les fromages (géré dans checkCollisions)
                break;
                
            case 'skin-rainbow':
                // Bonus aléatoire toutes les 5 secondes
                if (Math.floor(this.elapsedTime / 60) % 5 === 0 && this.elapsedTime % 60 === 0 && player.powerCooldown <= 0) {
                    const randomBonus = Math.floor(Math.random() * 4);
                    if (randomBonus === 0) {
                        player.speedBoost = 2.5;
                        player.powerCooldown = 180; // 3 secondes
                    } else if (randomBonus === 1 && this.lives < 3) {
                        this.lives++;
                    } else if (randomBonus === 2) {
                        this.score += 500;
                    } else {
                        player.jumpPower = 25;
                        player.powerCooldown = 180;
                    }
                }
                // Réinitialiser le jumpPower
                if (player.powerCooldown === 0) {
                    player.jumpPower = 20;
                }
                break;
                
            case 'skin-legendary':
                // DRAGON ROUGE ÉLÉMENTAIRE - Tous les pouvoirs combinés OP
                player.speedBoost = 1.8; // Plus rapide
                
                // Vol planant amélioré
                if (!player.onGround && player.velocityY > 0) {
                    player.velocityY *= 0.6; // Chute encore plus ralentie
                }
                
                // Collecte automatique à TRÈS grande distance
                const legendaryCollectDistance = this.tileSizeY * 3; // 3x la hauteur des tuiles
                for (let cheese of this.cheeses) {
                    if (!cheese.collected) {
                        const dist = Math.hypot(player.x + player.width/2 - cheese.x, player.y + player.height/2 - cheese.y);
                        if (dist < legendaryCollectDistance) {
                            cheese.collected = true;
                            this.cheeseCollected++;
                            this.score += 200; // Double score du pirate
                            
                            // 🔊 Jouer le son "miam"
                            if (typeof playSound === 'function') {
                                playSound('collect');
                            }
                            
                        }
                    }
                }
                
                // Régénération de vie très rapide (toutes les 3 secondes)
                if (Math.floor(this.elapsedTime / 60) % 3 === 0 && this.elapsedTime % 60 === 0 && this.lives < 3) {
                    this.lives++;
                }
                
                // Les ennemis fuient en panique
                for (let enemy of this.enemies) {
                    const dist = Math.hypot(player.x + player.width/2 - enemy.x, player.y + player.height/2 - enemy.y);
                    if (dist < this.tileSizeX * 8) { // 8 tuiles de rayon
                        if (player.x < enemy.x) {
                            enemy.velocityX = Math.abs(enemy.velocityX || 3) * 1.5;
                        } else {
                            enemy.velocityX = -Math.abs(enemy.velocityX || 3) * 1.5;
                        }
                    }
                }
                break;
        }
        
        // Décrémenter le cooldown
        if (player.powerCooldown > 0) {
            player.powerCooldown--;
        }
    }
    
    updatePlayer(deltaTime) {
        const player = this.player;
        
        // Gérer le timer de "stun" (allongée)
        if (player.isStunned) {
            player.stunnedTimer--;
            if (player.stunnedTimer <= 0) {
                player.isStunned = false;
                player.isInvincible = false; // Retirer l'invincibilité temporaire
            }
        }
        
        // Gravité
        if (!player.onGround) {
            player.velocityY += this.gravity;
        }
        
        // Limiter la vitesse de chute
        if (player.velocityY > 15) {
            player.velocityY = 15;
        }
        
        // Déplacement
        player.x += player.velocityX;
        player.y += player.velocityY;
        
        // Collision avec les murs
        this.handleTileCollisions();
        
        // Limites du niveau
        if (player.x < 0) player.x = 0;
        if (player.y > this.height * 3) {
            this.loseLife();
        }
        
        // Animation
        if (Math.abs(player.velocityX) > 0.1) {
            player.animationTimer += deltaTime;
            if (player.animationTimer > 100) {
                player.animationFrame = (player.animationFrame + 1) % 4;
                player.animationTimer = 0;
            }
        } else {
            player.animationFrame = 0;
        }
    }
    
    handleTileCollisions() {
        const player = this.player;
        player.onGround = false;
        
        for (let tile of this.tiles) {
            if (this.checkRectCollision(player, tile)) {
                // Collision par le haut (joueur atterrit)
                if (player.velocityY > 0 && player.y + player.height - player.velocityY <= tile.y) {
                    player.y = tile.y - player.height;
                    player.velocityY = 0;
                    player.onGround = true;
                    player.isJumping = false;
                    player.doubleJumpUsed = false; // Réinitialiser le double saut au sol
                }
                // Collision par le bas
                else if (player.velocityY < 0 && player.y - player.velocityY >= tile.y + tile.height) {
                    player.y = tile.y + tile.height;
                    player.velocityY = 0;
                }
                // Collision par la gauche
                else if (player.velocityX > 0) {
                    player.x = tile.x - player.width;
                    player.velocityX = 0;
                }
                // Collision par la droite
                else if (player.velocityX < 0) {
                    player.x = tile.x + tile.width;
                    player.velocityX = 0;
                }
            }
        }
    }
    
    updateEnemies(deltaTime) {
        // Ajuster la vitesse des ennemis selon la difficulté
        const difficultyMultiplier = {
            'easy': 0.7,      // 30% plus lent
            'medium': 1.0,    // Vitesse normale
            'hard': 1.5       // 50% plus rapide
        };
        const speedMult = difficultyMultiplier[this.difficulty] || 1.0;
        
        for (let enemy of this.enemies) {
            // Sauvegarder l'ancienne position
            const oldX = enemy.x;
            const oldY = enemy.y;
            
            // Appliquer la gravité
            enemy.velocityY += 0.5;
            enemy.y += enemy.velocityY;
            
            // Collision avec le sol
            let onGround = false;
            for (let tile of this.tiles) {
                if (enemy.y + enemy.height > tile.y && 
                    enemy.y < tile.y + tile.height &&
                    enemy.x + enemy.width > tile.x &&
                    enemy.x < tile.x + tile.width) {
                    enemy.y = tile.y - enemy.height;
                    enemy.velocityY = 0;
                    onGround = true;
                    break;
                }
            }
            
            // Déplacement horizontal (avec multiplication par difficulté)
            enemy.x += enemy.velocityX * speedMult;
            
            // Vérifier les collisions avec les murs
            let hitWall = false;
            for (let tile of this.tiles) {
                if (this.checkRectCollision(enemy, tile)) {
                    // Collision détectée, revenir en arrière et changer de direction
                    enemy.x = oldX;
                    enemy.velocityX *= -1;
                    enemy.direction = enemy.velocityX > 0 ? 'right' : 'left';
                    hitWall = true;
                    
                    // Si au sol et contre un mur, essayer de sauter
                    if (onGround && Math.random() > 0.5) {
                        enemy.velocityY = -8;
                    }
                    break;
                }
            }
            
            // Détection de blocage - vérifier si l'ennemi bouge
            const distanceMoved = Math.abs(enemy.x - enemy.lastX) + Math.abs(enemy.y - enemy.lastY);
            
            if (distanceMoved < 0.5) {
                // L'ennemi n'a presque pas bougé
                enemy.stuckTimer = (enemy.stuckTimer || 0) + 1;
                
                if (enemy.stuckTimer > 30) { // Bloqué pendant 0.5 secondes
                    // Changer de direction
                    enemy.velocityX *= -1;
                    enemy.direction = enemy.velocityX > 0 ? 'right' : 'left';
                    
                    // Essayer de sauter pour se débloquer
                    if (onGround) {
                        enemy.velocityY = -10;
                    }
                    
                    enemy.stuckTimer = 0;
                }
            } else {
                enemy.stuckTimer = 0;
            }
            
            // Sauvegarder la position pour la prochaine frame
            enemy.lastX = enemy.x;
            enemy.lastY = enemy.y;
            
            // Timer pour changer de direction aléatoirement
            enemy.changeDirectionTimer = (enemy.changeDirectionTimer || 0) + 1;
            if (enemy.changeDirectionTimer >= enemy.targetChangeTime) {
                enemy.velocityX *= -1;
                enemy.direction = enemy.velocityX > 0 ? 'right' : 'left';
                enemy.changeDirectionTimer = 0;
                enemy.targetChangeTime = Math.random() * 120 + 60;
            }
            
            // Animation
            enemy.animationFrame = (enemy.animationFrame + 0.1) % 4;
        }
    }
    
    checkCollisions() {
        const player = this.player;
        
        // Fromages - COLLISION AVEC LES PIEDS UNIQUEMENT
        for (let cheese of this.cheeses) {
            if (!cheese.collected) {
                // Position des PIEDS du joueur (bas du rectangle)
                const playerFootCenterX = player.x + player.width / 2;
                const playerFootY = player.y + player.height; // Le BAS de la souris
                
                // Distance entre les PIEDS et le fromage
                const dx = cheese.x - playerFootCenterX;
                const dy = cheese.y - playerFootY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Distance adaptative : 25% de la hauteur de la tuile (taille du fromage)
                const collisionDistance = this.tileSizeY * 0.25;
                
                // Si les PIEDS sont assez proches du fromage
                if (distance < collisionDistance) {
                    cheese.collected = true;
                    this.cheeseCollected++;
                    
                    // 🔊 Jouer le son "miam"
                    if (typeof playSound === 'function') {
                        playSound('collect');
                    }
                    
                    // Bonus de score pour skin Pirate (double score)
                    if (player.currentSkin === 'skin-pirate') {
                        this.score += 200;
                    } else {
                        this.score += 100;
                    }
                    
                    this.createCollectEffect(cheese.x, cheese.y);
                }
            }
        }
        
        // Pièges (immunité pour certains skins)
        for (let trap of this.traps) {
            if (this.checkRectCollision(player, trap)) {
                // Skin Angel et Legendary sont immunes aux pièges
                if (!['skin-angel', 'skin-legendary'].includes(player.currentSkin) && !player.isInvincible && !player.isStunned) {
                    this.hitPlayer();
                }
            }
        }
        
        // Ennemis
        for (let enemy of this.enemies) {
            if (this.checkRectCollision(player, enemy)) {
                // Skin Demon et Legendary sont immuneaux ennemis
                if (!['skin-demon', 'skin-legendary'].includes(player.currentSkin) && !player.isInvincible && !player.isStunned) {
                    this.hitPlayer();
                }
            }
        }
        
        // Sortie
        if (this.exit && this.exit.isOpen) {
            if (this.checkRectCollision(player, this.exit)) {
                this.victory();
            }
        }
    }
    
    checkRectCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    updateCamera() {
        const player = this.player;
        const levelWidth = this.levelData.map[0].length * this.tileSizeX;
        const levelHeight = this.levelData.map.length * this.tileSizeY;
        
        // En mode plein écran, pas de centrage automatique si le niveau remplit l'écran
        const isFullscreen = document.fullscreenElement !== null;
        const levelFillsScreen = levelWidth >= this.width && levelHeight >= this.height;
        
        if (isFullscreen && levelFillsScreen) {
            // Mode plein écran : pas de centrage, la caméra suit le joueur normalement
            this.camera.x = player.x - this.width / 2 + player.width / 2;
            this.camera.y = player.y - this.height / 2 + player.height / 2;
            
            if (this.camera.x < 0) this.camera.x = 0;
            if (this.camera.y < 0) this.camera.y = 0;
            if (this.camera.x > levelWidth - this.width) {
                this.camera.x = levelWidth - this.width;
            }
            if (this.camera.y > levelHeight - this.height) {
                this.camera.y = levelHeight - this.height;
            }
        } else {
            // Mode normal : centrer le niveau s'il est plus petit que le canvas
            if (levelWidth < this.width) {
                this.camera.x = -(this.width - levelWidth) / 2;
            } else {
                this.camera.x = player.x - this.width / 2 + player.width / 2;
                if (this.camera.x < 0) this.camera.x = 0;
                if (this.camera.x > levelWidth - this.width) {
                    this.camera.x = levelWidth - this.width;
                }
            }
            
            if (levelHeight < this.height) {
                this.camera.y = -(this.height - levelHeight) / 2;
            } else {
                this.camera.y = player.y - this.height / 2 + player.height / 2;
                if (this.camera.y < 0) this.camera.y = 0;
                if (this.camera.y > levelHeight - this.height) {
                    this.camera.y = levelHeight - this.height;
                }
            }
        }
    }
    
    updateAnimations(deltaTime) {
        // Animer les fromages
        for (let cheese of this.cheeses) {
            if (!cheese.collected) {
                cheese.rotation += 0.02;
                cheese.floatOffset = Math.sin(Date.now() * 0.003) * 5;
            }
        }
        
        // Animer les pièges
        for (let trap of this.traps) {
            trap.animationFrame = (trap.animationFrame + 0.1) % 4;
        }
        
        // Animer la sortie
        if (this.exit) {
            this.exit.animationFrame = (this.exit.animationFrame + 0.05) % 4;
        }
    }
    
    createCollectEffect(x, y) {
        if (window.particleSystem) {
            window.particleSystem.createBurst(x, y, '#FFE66D', 15);
        }
    }
    
    hitPlayer() {
        const player = this.player;
        
        // Perdre une vie
        this.lives--;
        
        // La souris tombe et reste allongée 2 secondes
        player.isStunned = true;
        player.stunnedTimer = 120; // 2 secondes à 60 FPS
        player.isInvincible = true; // Invincible pendant la chute et récupération
        
        // Effet visuel de choc
        player.velocityY = -5; // Petite impulsion vers le haut
        
        if (this.lives <= 0) {
            this.gameOver();
        }
    }
    
    loseLife() {
        this.lives--;
        
        // 🔊 Jouer le son "aie"
        if (typeof playSound === 'function') {
            playSound('death');
        }
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            // Respawn au début du niveau
            this.player.x = this.levelData.startX * this.tileSizeX;
            this.player.y = this.levelData.startY * this.tileSizeY;
            this.player.velocityX = 0;
            this.player.velocityY = 0;
        }
    }
    
    victory() {
        this.isVictory = true;
        
        // 🔊 Jouer le son "yes" (victoire)
        if (typeof playSound === 'function') {
            playSound('victory');
        }
        
        // Calculer le score final
        const timeBonus = Math.max(0, 1000 - this.elapsedTime * 10);
        const cheeseBonus = this.cheeseCollected * 100;
        this.score += timeBonus;
        
        // Calculer les étoiles (1-3)
        let stars = 1;
        if (this.cheeseCollected === this.totalCheese) stars = 2;
        if (this.cheeseCollected === this.totalCheese && this.elapsedTime < 60) stars = 3;
        
        showVictory(this.elapsedTime, this.cheeseCollected, this.totalCheese, this.score, stars);
    }
    
    gameOver() {
        this.isGameOver = true;
        showGameOver();
    }
    
    updateUI() {
        document.getElementById('cheeseCount').textContent = 
            `${this.cheeseCollected}/${this.totalCheese}`;
        
        // Mettre à jour la barre de vie au lieu des cœurs
        if (typeof updateHealthBar === 'function') {
            updateHealthBar(this.lives, 3);
        }
        
        const minutes = Math.floor(this.elapsedTime / 60);
        const seconds = this.elapsedTime % 60;
        document.getElementById('timeCount').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('scoreCount').textContent = this.score;
    }
    
    render() {
        const ctx = this.ctx;
        
        // Effacer le canvas
        ctx.clearRect(0, 0, this.width, this.height);
        
        // Sauvegarder l'état
        ctx.save();
        
        // Appliquer la caméra
        ctx.translate(-this.camera.x, -this.camera.y);
        
        // Dessiner le fond
        this.drawBackground();
        
        // Dessiner les tiles
        this.drawTiles();
        
        // Dessiner les pièges
        this.drawTraps();
        
        // Dessiner la sortie
        this.drawExit();
        
        // Dessiner les fromages
        this.drawCheeses();
        
        // Dessiner les ennemis
        this.drawEnemies();
        
        // Dessiner le joueur
        this.drawPlayer();
        
        // Dessiner les particules
        if (window.particleSystem) {
            window.particleSystem.render(ctx);
        }
        
        // Restaurer l'état
        ctx.restore();
    }
    
    drawBackground() {
        const ctx = this.ctx;
        const levelWidth = this.levelData.map[0].length * this.tileSizeX;
        const levelHeight = this.levelData.map.length * this.tileSizeY;
        
        // Obtenir le thème du niveau
        const theme = window.graphicsRenderer ? window.graphicsRenderer.getLevelTheme(this.currentLevel) : null;
        
        // Dessiner le fond sur TOUT le canvas avec le thème du niveau
        const gradient = ctx.createLinearGradient(0, 0, this.width, this.height);
        if (theme && theme.bg) {
            gradient.addColorStop(0, theme.bg[0]);
            gradient.addColorStop(0.5, theme.bg[1]);
            gradient.addColorStop(1, theme.bg[0]);
        } else {
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(0.3, '#764ba2');
            gradient.addColorStop(0.6, '#f093fb');
            gradient.addColorStop(1, '#4facfe');
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(-this.camera.x, -this.camera.y, this.width, this.height);
        
        // Fond plus sombre pour la zone de jeu avec le thème
        const gameAreaGradient = ctx.createLinearGradient(0, 0, 0, levelHeight);
        if (theme && theme.bg) {
            gameAreaGradient.addColorStop(0, theme.bg[0] + '99'); // 60% opacity
            gameAreaGradient.addColorStop(1, theme.bg[1] + 'BB'); // 70% opacity
        } else {
            gameAreaGradient.addColorStop(0, 'rgba(44, 62, 80, 0.7)');
            gameAreaGradient.addColorStop(1, 'rgba(26, 37, 47, 0.7)');
        }
        ctx.fillStyle = gameAreaGradient;
        ctx.fillRect(0, 0, levelWidth, levelHeight);
        
        // Motif de points colorés sur la zone de jeu
        for (let x = 0; x < levelWidth; x += this.tileSizeX / 2) {
            for (let y = 0; y < levelHeight; y += this.tileSizeY / 2) {
                const hue = (x + y) % 360;
                ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.05)`;
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Grille subtile sur la zone de jeu
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        for (let x = 0; x < levelWidth; x += this.tileSizeX) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, levelHeight);
            ctx.stroke();
        }
        
        for (let y = 0; y < levelHeight; y += this.tileSizeY) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(levelWidth, y);
            ctx.stroke();
        }
    }
    
    drawTiles() {
        // Dessiné dans graphics.js avec le numéro de niveau pour le thème
        if (window.graphicsRenderer) {
            window.graphicsRenderer.drawTiles(this.ctx, this.tiles, this.currentLevel);
        }
    }
    
    drawTraps() {
        if (window.graphicsRenderer) {
            window.graphicsRenderer.drawTraps(this.ctx, this.traps);
        }
    }
    
    drawExit() {
        if (window.graphicsRenderer && this.exit) {
            window.graphicsRenderer.drawExit(this.ctx, this.exit);
        }
    }
    
    drawCheeses() {
        if (window.graphicsRenderer) {
            window.graphicsRenderer.drawCheeses(this.ctx, this.cheeses, this.tileSizeY);
        }
    }
    
    drawEnemies() {
        if (window.graphicsRenderer) {
            window.graphicsRenderer.drawEnemies(this.ctx, this.enemies, this.currentLevel);
        }
    }
    
    drawPlayer() {
        if (window.graphicsRenderer) {
            window.graphicsRenderer.drawPlayer(this.ctx, this.player);
        }
    }
}

