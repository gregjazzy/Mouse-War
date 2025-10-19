// Client multijoueur pour Maze Mouse

class MultiplayerClient {
    constructor() {
        this.ws = null;
        this.playerId = null;
        this.connectedPlayers = new Map();
        this.isConnected = false;
        this.serverUrl = 'ws://localhost:8080'; // À changer pour votre serveur
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.updateInterval = null;
    }
    
    // Connecter au serveur
    connect(username, skin, level) {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(this.serverUrl);
                
                this.ws.onopen = () => {
                    console.log('✅ Connecté au serveur multijoueur');
                    this.isConnected = true;
                    this.reconnectAttempts = 0;
                };
                
                this.ws.onmessage = (event) => {
                    this.handleMessage(JSON.parse(event.data));
                };
                
                this.ws.onclose = () => {
                    console.log('❌ Déconnecté du serveur multijoueur');
                    this.isConnected = false;
                    this.attemptReconnect();
                };
                
                this.ws.onerror = (error) => {
                    console.error('❌ Erreur WebSocket:', error);
                    reject(error);
                };
                
                // Attendre d'être connecté puis rejoindre la room
                this.ws.addEventListener('message', (event) => {
                    const data = JSON.parse(event.data);
                    if (data.type === 'connected') {
                        this.playerId = data.playerId;
                        this.joinRoom(username, skin, level);
                        resolve();
                    }
                }, { once: true });
                
            } catch (error) {
                console.error('❌ Erreur de connexion:', error);
                reject(error);
            }
        });
    }
    
    // Rejoindre une room
    joinRoom(username, skin, level) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        
        this.send({
            type: 'join',
            roomId: `level_${level}`,
            username: username,
            skin: skin,
            level: level,
            x: 0,
            y: 0
        });
        
        // Démarrer la mise à jour périodique
        this.startUpdateLoop();
    }
    
    // Gérer les messages reçus
    handleMessage(data) {
        switch (data.type) {
            case 'connected':
                this.playerId = data.playerId;
                break;
                
            case 'players_list':
                // Recevoir la liste des joueurs existants
                data.players.forEach(player => {
                    this.connectedPlayers.set(player.id, player);
                });
                console.log(`👥 ${data.players.length} joueurs déjà connectés`);
                break;
                
            case 'player_joined':
                // Un nouveau joueur a rejoint
                this.connectedPlayers.set(data.player.id, data.player);
                console.log(`✅ ${data.player.username} a rejoint la partie`);
                this.showNotification(`${data.player.username} a rejoint la partie`);
                break;
                
            case 'player_left':
                // Un joueur a quitté
                const leftPlayer = this.connectedPlayers.get(data.playerId);
                if (leftPlayer) {
                    console.log(`❌ ${leftPlayer.username} a quitté la partie`);
                    this.showNotification(`${leftPlayer.username} a quitté la partie`);
                }
                this.connectedPlayers.delete(data.playerId);
                break;
                
            case 'player_update':
                // Mise à jour de la position d'un joueur
                const player = this.connectedPlayers.get(data.playerId);
                if (player) {
                    player.x = data.x;
                    player.y = data.y;
                    player.direction = data.direction;
                    player.isJumping = data.isJumping;
                    player.isAttacking = data.isAttacking;
                    player.animationFrame = data.animationFrame;
                }
                break;
                
            case 'chat':
                // Message de chat
                console.log(`💬 ${data.username}: ${data.message}`);
                this.showChatMessage(data.username, data.message);
                break;
                
            case 'player_level_change':
                // Un joueur a changé de niveau
                const changingPlayer = this.connectedPlayers.get(data.playerId);
                if (changingPlayer) {
                    changingPlayer.level = data.level;
                }
                break;
        }
    }
    
    // Envoyer un message au serveur
    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }
    
    // Mettre à jour sa position
    updatePosition(x, y, direction, isJumping, isAttacking, animationFrame) {
        this.send({
            type: 'update',
            x: x,
            y: y,
            direction: direction,
            isJumping: isJumping,
            isAttacking: isAttacking,
            animationFrame: animationFrame
        });
    }
    
    // Démarrer la boucle de mise à jour
    startUpdateLoop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        // Envoyer la position toutes les 50ms (20 fois par seconde)
        this.updateInterval = setInterval(() => {
            if (gameEngine && gameEngine.player) {
                const player = gameEngine.player;
                this.updatePosition(
                    player.x,
                    player.y,
                    player.direction,
                    player.isJumping,
                    player.isAttacking,
                    player.animationFrame
                );
            }
        }, 50);
    }
    
    // Arrêter la boucle de mise à jour
    stopUpdateLoop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    // Envoyer un message de chat
    sendChat(message) {
        this.send({
            type: 'chat',
            text: message
        });
    }
    
    // Notifier le changement de niveau
    changeLevel(level) {
        this.send({
            type: 'level_change',
            level: level
        });
    }
    
    // Tenter de se reconnecter
    attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('❌ Nombre maximum de tentatives de reconnexion atteint');
            return;
        }
        
        this.reconnectAttempts++;
        console.log(`🔄 Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`);
        
        setTimeout(() => {
            if (gameEngine && gameEngine.player) {
                const player = gameEngine.player;
                this.connect(player.username, player.currentSkin, gameEngine.currentLevel);
            }
        }, 3000);
    }
    
    // Déconnecter
    disconnect() {
        this.stopUpdateLoop();
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.connectedPlayers.clear();
        this.isConnected = false;
    }
    
    // Afficher une notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'mp-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Afficher un message de chat
    showChatMessage(username, message) {
        const chatContainer = document.getElementById('mpChatMessages');
        if (!chatContainer) return;
        
        const messageEl = document.createElement('div');
        messageEl.className = 'chat-message';
        messageEl.innerHTML = `<strong>${username}:</strong> ${message}`;
        messageEl.style.cssText = `
            padding: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            margin-bottom: 4px;
            font-size: 13px;
        `;
        
        chatContainer.appendChild(messageEl);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // Supprimer les anciens messages (garder seulement les 50 derniers)
        while (chatContainer.children.length > 50) {
            chatContainer.removeChild(chatContainer.firstChild);
        }
    }
    
    // Dessiner les autres joueurs
    drawOtherPlayers(ctx, camera) {
        if (!window.GraphicsRenderer) return;
        
        this.connectedPlayers.forEach((player, playerId) => {
            if (playerId !== this.playerId) {
                // Position sur l'écran avec la caméra
                const screenX = player.x - camera.x;
                const screenY = player.y - camera.y;
                
                // Ne dessiner que si le joueur est visible à l'écran
                if (screenX > -100 && screenX < ctx.canvas.width + 100 &&
                    screenY > -100 && screenY < ctx.canvas.height + 100) {
                    
                    ctx.save();
                    ctx.translate(screenX + 20, screenY + 20);
                    
                    // Dessiner la souris
                    if (window.GraphicsRenderer.drawMouse) {
                        window.GraphicsRenderer.drawMouse(
                            ctx,
                            0, 0, 40, 40,
                            player.direction || 'right',
                            player.animationFrame || 0,
                            player.skin || 'default',
                            player.isJumping,
                            false,
                            player.isAttacking
                        );
                    }
                    
                    // Dessiner le pseudo au-dessus
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                    ctx.fillRect(-30, -35, 60, 20);
                    ctx.fillStyle = '#FFD700';
                    ctx.font = 'bold 12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(player.username || 'Joueur', 0, -22);
                    
                    ctx.restore();
                }
            }
        });
    }
}

// Instance globale
let multiplayerClient = null;

