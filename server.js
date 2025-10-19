// Serveur WebSocket pour le multijoueur - Maze Mouse
const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.PORT || 8080;

// Créer un serveur HTTP
const server = http.createServer();

// Créer un serveur WebSocket
const wss = new WebSocket.Server({ server });

// Stocker tous les joueurs connectés
const players = new Map();
const rooms = new Map();

// Générer un ID unique pour chaque joueur
function generatePlayerId() {
    return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Envoyer un message à tous les joueurs d'une room sauf l'émetteur
function broadcastToRoom(roomId, message, senderId) {
    const room = rooms.get(roomId);
    if (!room) return;
    
    room.players.forEach(playerId => {
        if (playerId !== senderId) {
            const playerWs = players.get(playerId);
            if (playerWs && playerWs.readyState === WebSocket.OPEN) {
                playerWs.send(JSON.stringify(message));
            }
        }
    });
}

// Envoyer un message à tous les joueurs d'une room
function broadcastToRoomAll(roomId, message) {
    const room = rooms.get(roomId);
    if (!room) return;
    
    room.players.forEach(playerId => {
        const playerWs = players.get(playerId);
        if (playerWs && playerWs.readyState === WebSocket.OPEN) {
            playerWs.send(JSON.stringify(message));
        }
    });
}

wss.on('connection', (ws) => {
    const playerId = generatePlayerId();
    let currentRoom = null;
    let playerData = null;
    
    console.log(`✅ Nouveau joueur connecté: ${playerId}`);
    
    // Stocker la connexion du joueur
    players.set(playerId, ws);
    
    // Envoyer l'ID du joueur
    ws.send(JSON.stringify({
        type: 'connected',
        playerId: playerId
    }));
    
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            
            switch (message.type) {
                case 'join':
                    // Rejoindre une room
                    currentRoom = message.roomId || 'default';
                    playerData = {
                        id: playerId,
                        username: message.username || 'Joueur',
                        skin: message.skin || 'default',
                        x: message.x || 0,
                        y: message.y || 0,
                        level: message.level || 1
                    };
                    
                    // Créer la room si elle n'existe pas
                    if (!rooms.has(currentRoom)) {
                        rooms.set(currentRoom, {
                            id: currentRoom,
                            players: new Set(),
                            playersData: new Map()
                        });
                    }
                    
                    const room = rooms.get(currentRoom);
                    room.players.add(playerId);
                    room.playersData.set(playerId, playerData);
                    
                    console.log(`🎮 ${playerData.username} a rejoint la room: ${currentRoom}`);
                    
                    // Envoyer la liste des joueurs existants au nouveau joueur
                    const existingPlayers = Array.from(room.playersData.values())
                        .filter(p => p.id !== playerId);
                    
                    ws.send(JSON.stringify({
                        type: 'players_list',
                        players: existingPlayers
                    }));
                    
                    // Notifier les autres joueurs du nouveau joueur
                    broadcastToRoom(currentRoom, {
                        type: 'player_joined',
                        player: playerData
                    }, playerId);
                    break;
                    
                case 'update':
                    // Mise à jour de la position du joueur
                    if (currentRoom && playerData) {
                        playerData.x = message.x;
                        playerData.y = message.y;
                        playerData.direction = message.direction;
                        playerData.isJumping = message.isJumping;
                        playerData.isAttacking = message.isAttacking;
                        playerData.animationFrame = message.animationFrame;
                        
                        // Diffuser la mise à jour aux autres joueurs
                        broadcastToRoom(currentRoom, {
                            type: 'player_update',
                            playerId: playerId,
                            x: message.x,
                            y: message.y,
                            direction: message.direction,
                            isJumping: message.isJumping,
                            isAttacking: message.isAttacking,
                            animationFrame: message.animationFrame
                        }, playerId);
                    }
                    break;
                    
                case 'chat':
                    // Message de chat
                    if (currentRoom && playerData) {
                        broadcastToRoomAll(currentRoom, {
                            type: 'chat',
                            playerId: playerId,
                            username: playerData.username,
                            message: message.text
                        });
                    }
                    break;
                    
                case 'level_change':
                    // Changement de niveau
                    if (currentRoom && playerData) {
                        playerData.level = message.level;
                        broadcastToRoom(currentRoom, {
                            type: 'player_level_change',
                            playerId: playerId,
                            level: message.level
                        }, playerId);
                    }
                    break;
            }
        } catch (error) {
            console.error('❌ Erreur lors du traitement du message:', error);
        }
    });
    
    ws.on('close', () => {
        console.log(`❌ Joueur déconnecté: ${playerId}`);
        
        // Retirer le joueur de la room
        if (currentRoom && rooms.has(currentRoom)) {
            const room = rooms.get(currentRoom);
            room.players.delete(playerId);
            room.playersData.delete(playerId);
            
            // Notifier les autres joueurs
            broadcastToRoom(currentRoom, {
                type: 'player_left',
                playerId: playerId
            }, playerId);
            
            // Supprimer la room si elle est vide
            if (room.players.size === 0) {
                rooms.delete(currentRoom);
                console.log(`🗑️  Room supprimée: ${currentRoom}`);
            }
        }
        
        // Retirer le joueur de la liste
        players.delete(playerId);
    });
    
    ws.on('error', (error) => {
        console.error(`❌ Erreur WebSocket pour ${playerId}:`, error);
    });
});

// Démarrer le serveur
server.listen(PORT, () => {
    console.log(`🎮 Serveur multijoueur Maze Mouse démarré sur le port ${PORT}`);
    console.log(`📡 WebSocket prêt à accepter des connexions`);
});

// Nettoyer les rooms vides toutes les minutes
setInterval(() => {
    rooms.forEach((room, roomId) => {
        if (room.players.size === 0) {
            rooms.delete(roomId);
            console.log(`🧹 Nettoyage room vide: ${roomId}`);
        }
    });
}, 60000);

