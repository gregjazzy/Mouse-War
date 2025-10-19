// Système de rendu graphique premium - Qualité Nintendo Switch

class GraphicsRenderer {
    constructor() {
        this.shadowOffset = 3;
        this.shadowBlur = 5;
        this.currentLevel = 1;
    }
    
    // Obtenir le thème de couleurs selon le niveau
    getLevelTheme(levelNumber) {
        const themes = {
        1: { // Garde-Manger
            name: 'classic',
            wall: ['#7B68EE', '#6A5ACD', '#483D8B'],
            wallBorder: '#9370DB',
            bg: ['#667EEA', '#764BA2']
        },
        2: { // Cave Dangereuse
            name: 'cave',
            wall: ['#8B7355', '#6B5345', '#4A3830'],
            wallBorder: '#A0826D',
            bg: ['#3E2723', '#5D4037']
        },
        3: { // Piège Fatal
            name: 'danger',
            wall: ['#C41E3A', '#A01728', '#800F1F'],
            wallBorder: '#E74C3C',
            bg: ['#8B0000', '#B22222']
        },
        4: { // Château Hanté
            name: 'haunted',
            wall: ['#4A4A4A', '#2F2F2F', '#1A1A1A'],
            wallBorder: '#6A6A6A',
            bg: ['#2C003E', '#512DA8']
        },
        5: { // Caverne de Lave
            name: 'lava',
            wall: ['#8B4513', '#654321', '#3E2723'],
            wallBorder: '#A0522D',
            bg: ['#FF4500', '#DC143C']
        },
        6: { // Temple Glacé
            name: 'ice',
            wall: ['#B0E0E6', '#87CEEB', '#4682B4'],
            wallBorder: '#ADD8E6',
            bg: ['#E0FFFF', '#B0E0E6']
        },
        7: { // Égouts Aquatiques
            name: 'sewer',
            wall: ['#556B2F', '#3E5021', '#2F3C19'],
            wallBorder: '#6B8E23',
            bg: ['#2F4F4F', '#3E5E5E']
        },
        8: { // Tour Électrique
            name: 'electric',
            wall: ['#FFD700', '#FFA500', '#FF8C00'],
            wallBorder: '#FFFF00',
            bg: ['#4B0082', '#6A0DAD']
        },
        9: { // Donjon Nocturne
            name: 'night',
            wall: ['#191970', '#000080', '#00008B'],
            wallBorder: '#4169E1',
            bg: ['#0A0A2E', '#1A1A3E']
        },
        10: { // Boss Final
            name: 'boss',
            wall: ['#8B0000', '#660000', '#4D0000'],
            wallBorder: '#B22222',
            bg: ['#2C003E', '#8B0000']
        }
        };
        
        return themes[levelNumber] || themes[1];
    }
    
    // Dessiner les murs/tiles avec style premium et coloré selon le niveau
    drawTiles(ctx, tiles, levelNumber = 1) {
        this.currentLevel = levelNumber;
        const theme = this.getLevelTheme(levelNumber);
        
        for (let tile of tiles) {
        ctx.save();
        
        // Ombre colorée selon le thème
        ctx.shadowColor = `rgba(102, 126, 234, 0.5)`;
        ctx.shadowBlur = this.shadowBlur;
        ctx.shadowOffsetX = this.shadowOffset;
        ctx.shadowOffsetY = this.shadowOffset;
        
        // Dégradé coloré pour le mur selon le thème
        const gradient = ctx.createLinearGradient(
            tile.x, tile.y,
            tile.x, tile.y + tile.height
        );
        gradient.addColorStop(0, theme.wall[0]);
        gradient.addColorStop(0.5, theme.wall[1]);
        gradient.addColorStop(1, theme.wall[2]);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
        
        // Bordure brillante colorée selon le thème
        ctx.strokeStyle = theme.wallBorder;
        ctx.lineWidth = 3;
        ctx.strokeRect(tile.x, tile.y, tile.width, tile.height);
        
        // Highlights colorés
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tile.x, tile.y + tile.height);
        ctx.lineTo(tile.x, tile.y);
        ctx.lineTo(tile.x + tile.width, tile.y);
        ctx.stroke();
        
        // Motif décoratif coloré
        const pattern = ctx.createLinearGradient(
            tile.x, tile.y,
            tile.x + tile.width, tile.y
        );
        pattern.addColorStop(0, 'rgba(138, 43, 226, 0.3)');
        pattern.addColorStop(0.5, 'rgba(75, 0, 130, 0.3)');
        pattern.addColorStop(1, 'rgba(138, 43, 226, 0.3)');
        
        ctx.fillStyle = pattern;
        ctx.fillRect(tile.x + 3, tile.y + 3, tile.width - 6, tile.height - 6);
        
        // Points brillants
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(tile.x + tile.width / 2, tile.y + tile.height / 2, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        }
    }
    
    // Dessiner la souris (joueur) avec animations fluides et design réaliste
    drawPlayer(ctx, player) {
        ctx.save();
        
        const x = player.x;
        const y = player.y;
        const size = player.width;
        
        // Utiliser directement le skin du player (déjà défini dans startGame)
        const currentSkin = player.currentSkin || 'default';
        
        // Couleurs selon le skin
        const skinColors = this.getSkinColors(currentSkin);
        
        // SI LA SOURIS EST STUNNÉE (ALLONGÉE) - AFFICHAGE SPÉCIAL
        if (player.isStunned) {
            this.drawStunnedPlayer(ctx, player, skinColors);
            ctx.restore();
            return;
        }
        
        // ===== SI SKIN LÉGENDAIRE = DRAGON ROUGE ÉLÉMENTAIRE =====
        if (currentSkin === 'skin-legendary') {
            console.log('🐉 DESSIN DU DRAGON LÉGENDAIRE !');
            
            // Ombre du dragon
            ctx.fillStyle = 'rgba(139, 0, 0, 0.5)';
            ctx.beginPath();
            ctx.ellipse(x + size / 2, y + size + 8, size * 0.7, size / 6, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Translation pour la direction
            ctx.translate(x + size / 2, y + size / 2);
            if (player.direction === 'left') {
                ctx.scale(-1, 1);
            }
            
            // Dessiner le dragon
            this.drawLegendaryDragon(ctx, player, size, skinColors);
            
            // ===== ARME DU DRAGON (COURONNE) =====
            this.drawWeapon(ctx, size, currentSkin, player, Math.sin(player.animationFrame));
            
            // ===== AFFICHER LE NOM D'UTILISATEUR AU-DESSUS DU DRAGON =====
            if (player.username) {
                ctx.save();
                
                // Réinitialiser les transformations pour le texte
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                
                // Calculer la position du texte (au-dessus du dragon)
                const textX = player.x + player.width / 2;
                const textY = player.y - 10;
                
                // Style du texte
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                
                // Mesurer la largeur du texte pour le fond
                const textWidth = ctx.measureText(player.username).width;
                const padding = 6;
                
                // Couleur selon l'équipe (si multijoueur)
                let bgColor = 'rgba(0, 0, 0, 0.7)';
                let textColor = '#FFFFFF';
                
                if (player.team === 'red') {
                    bgColor = 'rgba(239, 68, 68, 0.9)';
                    textColor = '#FFFFFF';
                } else if (player.team === 'blue') {
                    bgColor = 'rgba(59, 130, 246, 0.9)';
                    textColor = '#FFFFFF';
                }
                
                // Fond arrondi derrière le nom
                ctx.fillStyle = bgColor;
                ctx.beginPath();
                ctx.roundRect(
                    textX - textWidth / 2 - padding,
                    textY - 18,
                    textWidth + padding * 2,
                    20,
                    5
                );
                ctx.fill();
                
                // Bordure
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 1;
                ctx.stroke();
                
                // Texte du nom
                ctx.fillStyle = textColor;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
                ctx.shadowBlur = 4;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 1;
                ctx.fillText(player.username, textX, textY - 4);
                
                // Réinitialiser l'ombre
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                
                ctx.restore();
            }
            
            ctx.restore();
            return; // Sortir - le dragon est dessiné
        }
        
        // Ombre portée plus prononcée
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(x + size / 2, y + size + 8, size / 2, size / 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Translation pour la direction
        ctx.translate(x + size / 2, y + size / 2);
        if (player.direction === 'left') {
        ctx.scale(-1, 1);
        }
        
        // Animation de saut
        const jumpOffset = player.isJumping ? -4 : 0;
        ctx.translate(0, jumpOffset);
        
        // Effet de mouvement
        const walkCycle = Math.sin(player.animationFrame);
        
        // Queue colorée TRÈS visible (dessinée en premier)
        ctx.strokeStyle = skinColors.tail;
        ctx.lineWidth = size / 8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(-size / 2.5, size / 6);
        ctx.bezierCurveTo(
        -size / 1.5, size / 3 + walkCycle * 4,
        -size / 1.3, size / 5 + walkCycle * 6,
        -size / 1.1, walkCycle * 8
        );
        ctx.stroke();
        
        // Contour de la queue
        ctx.strokeStyle = skinColors.tailDark;
        ctx.lineWidth = size / 10;
        ctx.stroke();
        
        // Corps de la souris (dégradé selon le skin)
        const bodyGradient = ctx.createRadialGradient(-size / 12, -size / 8, size / 20, 0, 0, size / 2);
        bodyGradient.addColorStop(0, skinColors.bodyLight);
        bodyGradient.addColorStop(0.3, skinColors.bodyMid);
        bodyGradient.addColorStop(0.7, skinColors.bodyDark);
        bodyGradient.addColorStop(1, skinColors.bodyDarkest);
        
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.ellipse(-size / 12, 0, size / 2.2, size / 2.8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Contour du corps
        ctx.strokeStyle = skinColors.outline;
        ctx.lineWidth = size / 16;
        ctx.stroke();
        
        // Reflet sur le corps
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.ellipse(-size / 8, -size / 6, size / 6, size / 8, -0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Tête plus grande et ronde
        const headGradient = ctx.createRadialGradient(size / 8, -size / 5, size / 20, size / 10, -size / 5, size / 2.5);
        headGradient.addColorStop(0, skinColors.headLight);
        headGradient.addColorStop(0.4, skinColors.headMid);
        headGradient.addColorStop(0.8, skinColors.headDark);
        headGradient.addColorStop(1, skinColors.headDarkest);
        
        ctx.fillStyle = headGradient;
        ctx.beginPath();
        ctx.ellipse(size / 8, -size / 5, size / 2.6, size / 2.4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = skinColors.outline;
        ctx.lineWidth = size / 16;
        ctx.stroke();
        
        // Afficher un effet spécial selon le skin
        this.drawSkinEffect(ctx, size, currentSkin, walkCycle);
        
        // Oreilles rondes et plus grandes (GRISES)
        const earGradient = ctx.createRadialGradient(0, -size / 2, size / 30, 0, -size / 2, size / 4);
        earGradient.addColorStop(0, '#C0B8B0');
        earGradient.addColorStop(0.5, '#A0A0A0');
        earGradient.addColorStop(1, '#707070');
        
        // Oreille gauche
        ctx.fillStyle = earGradient;
        ctx.beginPath();
        ctx.ellipse(-size / 8, -size / 1.8, size / 4.5, size / 3.5, -0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#505050';
        ctx.lineWidth = size / 16;
        ctx.stroke();
        
        // Intérieur oreille gauche (rose chair)
        ctx.fillStyle = '#E8C8C0';
        ctx.beginPath();
        ctx.ellipse(-size / 8, -size / 1.8, size / 7, size / 5.5, -0.4, 0, Math.PI * 2);
        ctx.fill();
        
        // Oreille droite
        ctx.fillStyle = earGradient;
        ctx.beginPath();
        ctx.ellipse(size / 2.5, -size / 1.8, size / 4.5, size / 3.5, 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#505050';
        ctx.lineWidth = size / 16;
        ctx.stroke();
        
        // Intérieur oreille droite (rose chair)
        ctx.fillStyle = '#E8C8C0';
        ctx.beginPath();
        ctx.ellipse(size / 2.5, -size / 1.8, size / 7, size / 5.5, 0.4, 0, Math.PI * 2);
        ctx.fill();
        
        // Yeux brillants et expressifs (PLUS GRANDS) - NOIRS
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(size / 6, -size / 4, size / 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = size / 20;
        ctx.stroke();
        
        // Pupille
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(size / 5, -size / 4, size / 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Reflet dans l'œil
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(size / 5.5, -size / 3.5, size / 16, 0, Math.PI * 2);
        ctx.fill();
        
        // Petit reflet secondaire
        ctx.beginPath();
        ctx.arc(size / 4, -size / 4.5, size / 24, 0, Math.PI * 2);
        ctx.fill();
        
        // Nez 3D rose chair
        const noseGradient = ctx.createRadialGradient(size / 3.5, -size / 12, 0, size / 3.5, -size / 12, size / 8);
        noseGradient.addColorStop(0, '#FFB8B0');
        noseGradient.addColorStop(0.6, '#E8A0A0');
        noseGradient.addColorStop(1, '#C08080');
        ctx.fillStyle = noseGradient;
        ctx.beginPath();
        ctx.arc(size / 3.5, -size / 12, size / 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Reflet sur le nez
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(size / 3.2, -size / 10, size / 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Moustaches noires épaisses
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = size / 30;
        ctx.lineCap = 'round';
        
        // Moustaches droites (3 de chaque côté)
        for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(size / 3.5, -size / 12 + i * size / 20 - size / 30);
        ctx.lineTo(size / 1.5 + i * size / 40, -size / 12 + (i - 1) * size / 20);
        ctx.stroke();
        }
        
        // Moustaches gauches (3 de chaque côté)
        for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(size / 3.5, -size / 12 + i * size / 20 - size / 30);
        ctx.lineTo(-size / 12 - i * size / 40, -size / 12 + (i - 1) * size / 20);
        ctx.stroke();
        }
        
        // Sourire mignon
        ctx.strokeStyle = '#806060';
        ctx.lineWidth = size / 24;
        ctx.beginPath();
        ctx.arc(size / 3.5, -size / 12, size / 12, 0.2, Math.PI - 0.2);
        ctx.stroke();
        
        // Pattes avec animation de marche (GRISES)
        ctx.strokeStyle = '#A0A0A0';
        ctx.lineWidth = size / 10;
        ctx.lineCap = 'round';
        
        // Patte avant droite
        ctx.beginPath();
        ctx.moveTo(size / 8, size / 8);
        ctx.lineTo(size / 6, size / 3 + walkCycle * size / 12);
        ctx.stroke();
        
        // Pied avant droit
        ctx.fillStyle = '#909090';
        ctx.beginPath();
        ctx.ellipse(size / 6, size / 3 + walkCycle * size / 12, size / 12, size / 16, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Patte avant gauche
        ctx.beginPath();
        ctx.moveTo(-size / 10, size / 8);
        ctx.lineTo(-size / 12, size / 3 - walkCycle * size / 12);
        ctx.stroke();
        
        // Pied avant gauche
        ctx.fillStyle = '#909090';
        ctx.beginPath();
        ctx.ellipse(-size / 12, size / 3 - walkCycle * size / 12, size / 12, size / 16, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Patte arrière droite
        ctx.beginPath();
        ctx.moveTo(-size / 5, size / 8);
        ctx.lineTo(-size / 6, size / 3 - walkCycle * size / 12);
        ctx.stroke();
        
        // Pied arrière droit
        ctx.fillStyle = '#909090';
        ctx.beginPath();
        ctx.ellipse(-size / 6, size / 3 - walkCycle * size / 12, size / 12, size / 16, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Patte arrière gauche
        ctx.beginPath();
        ctx.moveTo(-size / 3, size / 8);
        ctx.lineTo(-size / 3.5, size / 3 + walkCycle * size / 12);
        ctx.stroke();
        
        // Pied arrière gauche
        ctx.fillStyle = '#909090';
        ctx.beginPath();
        ctx.ellipse(-size / 3.5, size / 3 + walkCycle * size / 12, size / 12, size / 16, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // ===== AFFICHER L'ARME ÉLÉMENTAIRE DU SKIN =====
        this.drawWeapon(ctx, size, currentSkin, player, walkCycle);
        
        // ===== AFFICHER LE NOM D'UTILISATEUR AU-DESSUS DU JOUEUR =====
        if (player.username) {
            ctx.save();
            
            // Réinitialiser les transformations pour le texte
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            
            // Calculer la position du texte (au-dessus du joueur)
            const textX = player.x + player.width / 2;
            const textY = player.y - 10;
            
            // Style du texte
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            
            // Mesurer la largeur du texte pour le fond
            const textWidth = ctx.measureText(player.username).width;
            const padding = 6;
            
            // Couleur selon l'équipe (si multijoueur)
            let bgColor = 'rgba(0, 0, 0, 0.7)';
            let textColor = '#FFFFFF';
            
            if (player.team === 'red') {
                bgColor = 'rgba(239, 68, 68, 0.9)';
                textColor = '#FFFFFF';
            } else if (player.team === 'blue') {
                bgColor = 'rgba(59, 130, 246, 0.9)';
                textColor = '#FFFFFF';
            }
            
            // Fond arrondi derrière le nom
            ctx.fillStyle = bgColor;
            ctx.beginPath();
            ctx.roundRect(
                textX - textWidth / 2 - padding,
                textY - 18,
                textWidth + padding * 2,
                20,
                5
            );
            ctx.fill();
            
            // Bordure
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Texte du nom
            ctx.fillStyle = textColor;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 1;
            ctx.fillText(player.username, textX, textY - 4);
            
            // Réinitialiser l'ombre
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            
            ctx.restore();
        }
        
        ctx.restore();
    }
    
    // Dessiner l'arme élémentaire du skin
    drawWeapon(ctx, size, skinId, player, walkCycle) {
        // Charger les données d'armes depuis game.js
        const weapons = {
            'default': '🤚',
            'skin-golden': '✨',
            'skin-ninja': '🗡️',
            'skin-wizard': '🔮',
            'skin-robot': '⚡',
            'skin-pirate': '🌊',
            'skin-vampire': '🩸',
            'skin-knight': '⚔️',
            'skin-angel': '🕊️',
            'skin-demon': '🔥',
            'skin-alien': '🛸',
            'skin-rainbow': '🌈',
            'skin-legendary': '👑'
        };
        
        const weapon = weapons[skinId] || '🤚';
        
        // Position de l'arme (devant la souris)
        const weaponX = size * 0.5;
        const weaponY = -size * 0.1;
        
        // Animation de balancement de l'arme ou d'attaque
        let swing = Math.sin(walkCycle * Math.PI * 2) * 0.15;
        let weaponScale = 1.0;
        
        // Si le joueur attaque, animation d'attaque
        if (player.isAttacking) {
            const attackProgress = (Date.now() - player.attackTimer) / player.attackDuration;
            // Animation de balayage rapide
            swing = Math.sin(attackProgress * Math.PI) * 1.2;
            weaponScale = 1.0 + Math.sin(attackProgress * Math.PI) * 0.5;
        }
        
        ctx.save();
        ctx.translate(weaponX, weaponY);
        ctx.rotate(swing);
        ctx.scale(weaponScale, weaponScale);
        
        // Augmenter la taille de l'arme pour les previews (taille 1.2x plus grande)
        const weaponSize = size * 1.2;
        
        // Dessiner l'arme en emoji
        ctx.font = `${weaponSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Ombre de l'arme plus prononcée
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillText(weapon, 3, 3);
        
        // Arme principale
        ctx.fillText(weapon, 0, 0);
        
        ctx.restore();
        
        // Effet visuel d'attaque (éclat)
        if (player.isAttacking) {
            const attackProgress = (Date.now() - player.attackTimer) / player.attackDuration;
            if (attackProgress < 0.5) {
                ctx.save();
                ctx.globalAlpha = 0.5 - attackProgress;
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.arc(weaponX + size * 0.5, weaponY, size * 0.3 * (1 + attackProgress), 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
    }
    
    // Dessiner les fromages avec effet de brillance
    drawCheeses(ctx, cheeses, tileSizeY) {
        for (let cheese of cheeses) {
            if (cheese.collected) continue;
            
            ctx.save();
            
            const x = cheese.x;
            const y = cheese.y; // PAS de floatOffset, le fromage reste au sol
            const size = tileSizeY * 0.25; // 25% de la hauteur de la tuile (ADAPTATIF)
            
            ctx.translate(x, y);
            ctx.rotate(cheese.rotation);
            
            // Ombre réaliste
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.ellipse(0, size * 0.6, size * 0.9, size * 0.2, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Effet de lueur dorée
            const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.8);
            glowGradient.addColorStop(0, 'rgba(255, 215, 0, 0.5)');
            glowGradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.2)');
            glowGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(0, 0, size * 1.8, 0, Math.PI * 2);
            ctx.fill();
            
            // Corps du fromage - forme de quartier arrondi
            const cheeseGradient = ctx.createRadialGradient(-size * 0.3, -size * 0.3, size * 0.2, 0, 0, size * 1.2);
            cheeseGradient.addColorStop(0, '#FFF4A3');
            cheeseGradient.addColorStop(0.4, '#FFE66D');
            cheeseGradient.addColorStop(0.7, '#FFC947');
            cheeseGradient.addColorStop(1, '#E6B800');
            
            ctx.fillStyle = cheeseGradient;
            ctx.beginPath();
            // Dessiner un quartier de fromage
            ctx.moveTo(-size * 0.9, size * 0.5); // Bas gauche
            ctx.lineTo(-size * 0.9, -size * 0.3); // Haut gauche
            ctx.quadraticCurveTo(-size * 0.8, -size * 0.8, -size * 0.3, -size * 0.9); // Courbe haut
            ctx.quadraticCurveTo(size * 0.3, -size * 1.0, size * 0.9, -size * 0.3); // Courbe haut droite
            ctx.lineTo(size * 0.9, size * 0.5); // Bas droite
            ctx.quadraticCurveTo(0, size * 0.6, -size * 0.9, size * 0.5); // Courbe bas
            ctx.closePath();
            ctx.fill();
            
            // Bordure du fromage
            ctx.strokeStyle = '#D4AF37';
            ctx.lineWidth = 2.5;
            ctx.stroke();
            
            // Croûte plus foncée sur le bord arrondi
            ctx.strokeStyle = '#C9A961';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(-size * 0.9, -size * 0.3);
            ctx.quadraticCurveTo(-size * 0.8, -size * 0.8, -size * 0.3, -size * 0.9);
            ctx.quadraticCurveTo(size * 0.3, -size * 1.0, size * 0.9, -size * 0.3);
            ctx.stroke();
            
            // Trous dans le fromage (style emmental)
            ctx.fillStyle = '#E6A800';
            ctx.strokeStyle = '#C9A961';
            ctx.lineWidth = 1.5;
            
            // Trou 1 (grand)
            ctx.beginPath();
            ctx.ellipse(-size * 0.4, -size * 0.1, size * 0.18, size * 0.15, 0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Trou 2 (moyen)
            ctx.beginPath();
            ctx.ellipse(size * 0.3, -size * 0.3, size * 0.14, size * 0.12, -0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Trou 3 (petit)
            ctx.beginPath();
            ctx.ellipse(-size * 0.1, size * 0.2, size * 0.12, size * 0.1, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Trou 4 (petit)
            ctx.beginPath();
            ctx.ellipse(size * 0.5, 0, size * 0.1, size * 0.08, 0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Reflets brillants sur le fromage
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.ellipse(-size * 0.5, -size * 0.5, size * 0.2, size * 0.1, -0.5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.ellipse(size * 0.4, -size * 0.1, size * 0.15, size * 0.08, 0.3, 0, Math.PI * 2);
            ctx.fill();
            
            // Particules scintillantes autour
            const sparkles = 6;
            for (let i = 0; i < sparkles; i++) {
                const angle = (Math.PI * 2 * i) / sparkles + cheese.rotation;
                const dist = size * 1.4;
                const sparkX = Math.cos(angle) * dist;
                const sparkY = Math.sin(angle) * dist;
                const sparkSize = 2.5 + Math.sin(Date.now() / 200 + i) * 1.5;
                
                ctx.fillStyle = `rgba(255, 215, 0, ${0.7 + Math.sin(Date.now() / 200 + i) * 0.3})`;
                ctx.beginPath();
                ctx.arc(sparkX, sparkY, sparkSize, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
        }
    }
    
    // Dessiner les pièges (pics et feu)
    drawTraps(ctx, traps) {
        for (let trap of traps) {
            ctx.save();
            
            if (trap.type === 'spikes') {
                this.drawSpikes(ctx, trap);
            } else if (trap.type === 'fire') {
                this.drawFire(ctx, trap);
            }
            
            ctx.restore();
        }
    }
    
    drawSpikes(ctx, trap) {
        const x = trap.x;
        const y = trap.y;
        const width = trap.width;
        const height = trap.height;
        
        // Piège à souris !
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        const trapWidth = width * 0.8;
        const trapHeight = height * 0.6;
        
        // Base en bois du piège
        const woodGradient = ctx.createLinearGradient(
        centerX - trapWidth / 2, centerY - trapHeight / 3,
        centerX - trapWidth / 2, centerY + trapHeight / 3
        );
        woodGradient.addColorStop(0, '#D2691E');
        woodGradient.addColorStop(0.5, '#A0522D');
        woodGradient.addColorStop(1, '#8B4513');
        
        ctx.fillStyle = woodGradient;
        ctx.fillRect(
        centerX - trapWidth / 2, 
        centerY - trapHeight / 3,
        trapWidth, 
        trapHeight * 0.6
        );
        
        // Contour bois
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.strokeRect(
        centerX - trapWidth / 2, 
        centerY - trapHeight / 3,
        trapWidth, 
        trapHeight * 0.6
        );
        
        // Veines du bois
        ctx.strokeStyle = 'rgba(101, 67, 33, 0.4)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX - trapWidth / 2 + i * trapWidth / 4, centerY - trapHeight / 3);
        ctx.lineTo(centerX - trapWidth / 2 + i * trapWidth / 4, centerY + trapHeight / 3);
        ctx.stroke();
        }
        
        // Fromage appât (jaune)
        const cheeseSize = Math.min(width, height) * 0.15;
        const cheeseGradient = ctx.createRadialGradient(
        centerX, centerY - cheeseSize / 2,
        0,
        centerX, centerY - cheeseSize / 2,
        cheeseSize
        );
        cheeseGradient.addColorStop(0, '#FFD700');
        cheeseGradient.addColorStop(0.7, '#FFA500');
        cheeseGradient.addColorStop(1, '#FF8C00');
        
        ctx.fillStyle = cheeseGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, cheeseSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Trous dans le fromage
        ctx.fillStyle = '#FF8C00';
        ctx.beginPath();
        ctx.arc(centerX - cheeseSize / 3, centerY - cheeseSize / 4, cheeseSize / 5, 0, Math.PI * 2);
        ctx.arc(centerX + cheeseSize / 4, centerY + cheeseSize / 5, cheeseSize / 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Ressort (gris métallique)
        ctx.strokeStyle = '#C0C0C0';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        // Partie gauche du ressort
        ctx.beginPath();
        ctx.moveTo(centerX - trapWidth / 2.5, centerY - trapHeight / 3);
        ctx.lineTo(centerX - trapWidth / 2.5, centerY + trapHeight / 2);
        ctx.stroke();
        
        // Partie droite du ressort
        ctx.beginPath();
        ctx.moveTo(centerX + trapWidth / 2.5, centerY - trapHeight / 3);
        ctx.lineTo(centerX + trapWidth / 2.5, centerY + trapHeight / 2);
        ctx.stroke();
        
        // Barre métallique du piège (danger!)
        const barGradient = ctx.createLinearGradient(
        centerX - trapWidth / 2, centerY - trapHeight / 2,
        centerX + trapWidth / 2, centerY - trapHeight / 2
        );
        barGradient.addColorStop(0, '#808080');
        barGradient.addColorStop(0.5, '#A9A9A9');
        barGradient.addColorStop(1, '#808080');
        
        ctx.strokeStyle = barGradient;
        ctx.lineWidth = Math.max(4, height / 10);
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(centerX - trapWidth / 2.2, centerY - trapHeight / 2);
        ctx.lineTo(centerX + trapWidth / 2.2, centerY - trapHeight / 2);
        ctx.stroke();
        
        // Ombre sur la barre pour effet 3D
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = Math.max(2, height / 15);
        ctx.beginPath();
        ctx.moveTo(centerX - trapWidth / 2.2, centerY - trapHeight / 2 + 2);
        ctx.lineTo(centerX + trapWidth / 2.2, centerY - trapHeight / 2 + 2);
        ctx.stroke();
        
        // Symbole de danger (⚠)
        ctx.fillStyle = '#FF0000';
        ctx.font = `bold ${Math.max(12, height * 0.3)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚠', centerX, centerY + trapHeight / 2.5);
    }
    
    drawFire(ctx, trap) {
        const x = trap.x + trap.width / 2;
        const y = trap.y + trap.height;
        const frame = trap.animationFrame;
        
        // Effet de lueur
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
        glowGradient.addColorStop(0, 'rgba(255, 100, 0, 0.5)');
        glowGradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();
        
        // Flammes (3 couches)
        this.drawFlame(ctx, x, y, 20 + Math.sin(frame) * 3, '#FF4500', 0.9);
        this.drawFlame(ctx, x - 5, y - 5, 15 + Math.cos(frame * 1.2) * 2, '#FF6347', 0.8);
        this.drawFlame(ctx, x + 5, y - 5, 15 + Math.sin(frame * 1.5) * 2, '#FF8C00', 0.8);
        this.drawFlame(ctx, x, y - 10, 12 + Math.cos(frame * 2) * 2, '#FFD700', 0.7);
    }
    
    drawFlame(ctx, x, y, height, color, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        
        const gradient = ctx.createLinearGradient(x, y, x, y - height);
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.5, '#FFA500');
        gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(x - 8, y);
        ctx.quadraticCurveTo(x - 10, y - height / 2, x - 5, y - height);
        ctx.quadraticCurveTo(x, y - height - 5, x + 5, y - height);
        ctx.quadraticCurveTo(x + 10, y - height / 2, x + 8, y);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
    
    // Dessiner les ennemis (chats) avec design ultra réaliste
    drawEnemies(ctx, enemies, levelNumber = 1) {
        for (let enemy of enemies) {
        ctx.save();
        
        const x = enemy.x + enemy.width / 2;
        const y = enemy.y + enemy.height / 2;
        
        ctx.translate(x, y);
        if (enemy.direction === 'left') {
            ctx.scale(-1, 1);
        }
        
        const size = enemy.width;
        const walkCycle = Math.sin(enemy.animationFrame);
        
        // Adapter l'ennemi au biome selon le niveau
        switch(levelNumber) {
            case 4: // Château Hanté - Fantômes
                this.drawGhost(ctx, size, walkCycle);
                break;
            case 5: // Caverne de Lave - Monstres de lave
                this.drawLavaMonster(ctx, size, walkCycle);
                break;
            case 6: // Temple Glacé - Yétis/Créatures de glace
                this.drawIceCreature(ctx, size, walkCycle);
                break;
            case 7: // Égouts Aquatiques - Rats d'égout
                this.drawSewerRat(ctx, size, walkCycle);
                break;
            case 8: // Tour Électrique - Robots électriques
                this.drawElectricRobot(ctx, size, walkCycle);
                break;
            case 9: // Donjon Nocturne - Chauves-souris vampires
                this.drawVampireBat(ctx, size, walkCycle);
                break;
            case 10: // Boss Final - Boss géant
                this.drawBossMonster(ctx, size, walkCycle);
                break;
            default: // Niveaux 1-3 et 11 - Chats normaux
                this.drawCat(ctx, size, walkCycle);
                break;
        }
        
        ctx.restore();
        
        // 💚 BARRE DE VIE AU-DESSUS DE L'ENNEMI
        if (enemy.health !== undefined && enemy.maxHealth !== undefined) {
            const barWidth = enemy.width * 0.8; // 80% de la largeur de l'ennemi
            const barHeight = 6;
            const barX = enemy.x + (enemy.width - barWidth) / 2;
            const barY = enemy.y - 12; // Au-dessus de l'ennemi
            
            // Fond de la barre (gris foncé)
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            
            // Barre de vie (couleur selon HP)
            const healthPercent = enemy.health / enemy.maxHealth;
            const healthWidth = barWidth * healthPercent;
            
            // Couleur selon le pourcentage de vie
            if (healthPercent > 0.6) {
                ctx.fillStyle = '#00FF00'; // Vert
            } else if (healthPercent > 0.3) {
                ctx.fillStyle = '#FFAA00'; // Orange
            } else {
                ctx.fillStyle = '#FF0000'; // Rouge
            }
            
            ctx.fillRect(barX, barY, healthWidth, barHeight);
            
            // Bordure de la barre
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 1;
            ctx.strokeRect(barX, barY, barWidth, barHeight);
        }
        }
    }
    
    // Dessiner un fantôme
    drawGhost(ctx, size, walkCycle) {
        // Transparence fantomatique
        ctx.globalAlpha = 0.85 + Math.sin(Date.now() / 500) * 0.15;
        
        // Aura spectrale
        const auraGradient = ctx.createRadialGradient(0, -size / 4, 0, 0, -size / 4, size / 1.2);
        auraGradient.addColorStop(0, 'rgba(200, 200, 255, 0.4)');
        auraGradient.addColorStop(0.5, 'rgba(150, 150, 255, 0.2)');
        auraGradient.addColorStop(1, 'rgba(100, 100, 255, 0)');
        ctx.fillStyle = auraGradient;
        ctx.beginPath();
        ctx.arc(0, -size / 4, size / 1.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Corps du fantôme (forme de drap)
        const bodyGradient = ctx.createLinearGradient(0, -size / 1.5, 0, size / 2);
        bodyGradient.addColorStop(0, '#F0F0FF');
        bodyGradient.addColorStop(0.5, '#E0E0FF');
        bodyGradient.addColorStop(1, '#C0C0E0');
        ctx.fillStyle = bodyGradient;
        
        ctx.beginPath();
        // Tête ronde
        ctx.arc(0, -size / 3, size / 2.5, Math.PI, 0);
        // Corps qui ondule
        ctx.lineTo(size / 3, size / 4);
        // Bords ondulés en bas
        for (let i = 0; i < 4; i++) {
        const waveX = size / 3 - (i * size / 6);
        const waveY = size / 4 + Math.sin(Date.now() / 200 + i) * size / 10;
        ctx.quadraticCurveTo(waveX, waveY + size / 8, waveX - size / 12, waveY);
        }
        ctx.lineTo(-size / 3, size / 4);
        ctx.closePath();
        ctx.fill();
        
        // Contour du fantôme
        ctx.strokeStyle = 'rgba(100, 100, 200, 0.6)';
        ctx.lineWidth = size / 20;
        ctx.stroke();
        
        // Yeux effrayants (grands et noirs)
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#000000';
        // Œil gauche
        ctx.beginPath();
        ctx.ellipse(-size / 6, -size / 3, size / 12, size / 8, -0.2, 0, Math.PI * 2);
        ctx.fill();
        // Œil droit
        ctx.beginPath();
        ctx.ellipse(size / 6, -size / 3, size / 12, size / 8, 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupilles brillantes (effet fantomatique)
        ctx.fillStyle = '#8080FF';
        ctx.beginPath();
        ctx.arc(-size / 6, -size / 3, size / 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(size / 6, -size / 3, size / 30, 0, Math.PI * 2);
        ctx.fill();
        
        // Bouche en "O" effrayée
        ctx.beginPath();
        ctx.ellipse(0, -size / 6, size / 12, size / 10, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        
        // Petites chaînes fantomatiques
        for (let i = 0; i < 2; i++) {
        const chainX = (i === 0 ? -size / 4 : size / 4);
        ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
        ctx.lineWidth = size / 30;
        ctx.beginPath();
        ctx.moveTo(chainX, -size / 4);
        ctx.lineTo(chainX + walkCycle * 3, size / 6);
        ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    // Dessiner un chat
    drawCat(ctx, size, walkCycle) {
        // Ombre portée réaliste
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.ellipse(0, size / 2, size / 1.8, size / 10, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Queue ondulante et épaisse (dessinée en premier, derrière le corps)
        const tailGradient = ctx.createLinearGradient(-size / 2, 0, -size, -size / 4);
        tailGradient.addColorStop(0, '#D2691E');
        tailGradient.addColorStop(0.5, '#B8860B');
        tailGradient.addColorStop(1, '#8B6914');
        
        ctx.strokeStyle = tailGradient;
        ctx.lineWidth = size / 4.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(-size / 2.3, size / 8);
        ctx.bezierCurveTo(
            -size / 1.6, size / 6 + walkCycle * 6,
            -size / 1.3, -size / 10 + walkCycle * 10,
            -size / 1.1, -size / 5 + walkCycle * 8
        );
        ctx.stroke();
        
        // Rayures sur la queue
        ctx.strokeStyle = 'rgba(101, 67, 33, 0.6)';
        ctx.lineWidth = size / 5;
        for (let i = 0; i < 3; i++) {
            const t = 0.3 + i * 0.25;
            const qx = -size / 2.3 * (1-t) - size / 1.1 * t + walkCycle * 3 * t;
            const qy = size / 8 * (1-t) + (-size / 5 + walkCycle * 8) * t;
            ctx.beginPath();
            ctx.moveTo(qx - size / 20, qy);
            ctx.lineTo(qx + size / 20, qy);
            ctx.stroke();
        }
        
        // Pattes arrière (derrière le corps)
        const pawGradient = ctx.createLinearGradient(0, 0, 0, size / 2);
        pawGradient.addColorStop(0, '#D2691E');
        pawGradient.addColorStop(0.7, '#A0522D');
        pawGradient.addColorStop(1, '#8B4513');
        
        ctx.strokeStyle = pawGradient;
        ctx.lineWidth = size / 7;
        ctx.lineCap = 'round';
        
        // Patte arrière droite
        ctx.beginPath();
        ctx.moveTo(-size / 3.5, size / 6);
        ctx.lineTo(-size / 4, size / 2.3 - walkCycle * size / 12);
        ctx.stroke();
        
        // Patte arrière gauche
        ctx.beginPath();
        ctx.moveTo(-size / 2.2, size / 6);
        ctx.lineTo(-size / 2.5, size / 2.3 + walkCycle * size / 12);
        ctx.stroke();
        
        // Corps du chat - forme allongée et élégante
        const bodyGradient = ctx.createRadialGradient(-size / 10, -size / 15, size / 25, 0, 0, size / 1.8);
        bodyGradient.addColorStop(0, '#F4A460');
        bodyGradient.addColorStop(0.3, '#D2691E');
        bodyGradient.addColorStop(0.7, '#CD853F');
        bodyGradient.addColorStop(1, '#8B4513');
        
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.ellipse(0, size / 10, size / 2.3, size / 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Contour du corps
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = size / 25;
        ctx.stroke();
        
        // Rayures sur le corps (effet tigré)
        ctx.strokeStyle = 'rgba(101, 67, 33, 0.5)';
        ctx.lineWidth = size / 15;
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            const rayX = -size / 6 + i * size / 8;
            ctx.moveTo(rayX, size / 6);
            ctx.lineTo(rayX - size / 20, size / 3);
            ctx.stroke();
        }
        
        // Ventre plus clair et doux
        const bellyGradient = ctx.createRadialGradient(0, size / 8, 0, 0, size / 8, size / 3.5);
        bellyGradient.addColorStop(0, '#FFEFD5');
        bellyGradient.addColorStop(1, 'rgba(255, 239, 213, 0)');
        ctx.fillStyle = bellyGradient;
        ctx.beginPath();
        ctx.ellipse(0, size / 8, size / 3.5, size / 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Pattes avant (devant le corps)
        ctx.strokeStyle = pawGradient;
        ctx.lineWidth = size / 7;
        
        // Patte avant droite
        ctx.beginPath();
        ctx.moveTo(size / 8, size / 8);
        ctx.lineTo(size / 7, size / 2.3 + walkCycle * size / 12);
        ctx.stroke();
        
        // Patte avant gauche
        ctx.beginPath();
        ctx.moveTo(-size / 10, size / 8);
        ctx.lineTo(-size / 12, size / 2.3 - walkCycle * size / 12);
        ctx.stroke();
        
        // Coussinets des pattes
        ctx.fillStyle = '#4A2511';
        ctx.beginPath();
        ctx.ellipse(size / 7, size / 2.3 + walkCycle * size / 12, size / 15, size / 20, 0, 0, Math.PI * 2);
        ctx.ellipse(-size / 12, size / 2.3 - walkCycle * size / 12, size / 15, size / 20, 0, 0, Math.PI * 2);
        ctx.ellipse(-size / 4, size / 2.3 - walkCycle * size / 12, size / 15, size / 20, 0, 0, Math.PI * 2);
        ctx.ellipse(-size / 2.5, size / 2.3 + walkCycle * size / 12, size / 15, size / 20, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Tête ronde et expressive
        const headGradient = ctx.createRadialGradient(size / 6, -size / 4, size / 30, size / 6, -size / 4, size / 2.3);
        headGradient.addColorStop(0, '#F4A460');
        headGradient.addColorStop(0.4, '#D2691E');
        headGradient.addColorStop(0.8, '#CD853F');
        headGradient.addColorStop(1, '#A0522D');
        
        ctx.fillStyle = headGradient;
        ctx.beginPath();
        ctx.ellipse(size / 6, -size / 4, size / 2.5, size / 2.3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Contour de la tête
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = size / 25;
        ctx.stroke();
        
        // Marques sur le front (en forme de M comme les chats tigrés)
        ctx.strokeStyle = 'rgba(101, 67, 33, 0.7)';
        ctx.lineWidth = size / 20;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(size / 10, -size / 2.5);
        ctx.lineTo(size / 7, -size / 3);
        ctx.lineTo(size / 4, -size / 2.8);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(size / 4.5, -size / 2.5);
        ctx.lineTo(size / 3.5, -size / 3);
        ctx.lineTo(size / 2.5, -size / 2.5);
        ctx.stroke();
        
        // Museau en forme de cœur
        const muzzleGradient = ctx.createRadialGradient(size / 3.5, -size / 8, 0, size / 3.5, -size / 8, size / 5);
        muzzleGradient.addColorStop(0, '#FFEFD5');
        muzzleGradient.addColorStop(1, '#F5DEB3');
        ctx.fillStyle = muzzleGradient;
        ctx.beginPath();
        ctx.ellipse(size / 3.5, -size / 9, size / 5, size / 7, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Oreilles triangulaires élégantes
        const earGradient = ctx.createLinearGradient(0, -size / 1.8, 0, -size / 2.5);
        earGradient.addColorStop(0, '#D2691E');
        earGradient.addColorStop(0.6, '#CD853F');
        earGradient.addColorStop(1, '#A0522D');
        
        // Oreille gauche
        ctx.fillStyle = earGradient;
        ctx.beginPath();
        ctx.moveTo(-size / 20, -size / 1.8);
        ctx.lineTo(-size / 6, -size / 1.3);
        ctx.lineTo(size / 15, -size / 1.7);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = size / 25;
        ctx.stroke();
        
        // Poils intérieurs oreille gauche
        const innerEarGradient = ctx.createLinearGradient(-size / 20, -size / 1.8, -size / 6, -size / 1.4);
        innerEarGradient.addColorStop(0, '#FFE4B5');
        innerEarGradient.addColorStop(1, '#DEB887');
        ctx.fillStyle = innerEarGradient;
        ctx.beginPath();
        ctx.moveTo(-size / 25, -size / 1.75);
        ctx.lineTo(-size / 7.5, -size / 1.45);
        ctx.lineTo(size / 20, -size / 1.72);
        ctx.closePath();
        ctx.fill();
        
        // Oreille droite
        ctx.fillStyle = earGradient;
        ctx.beginPath();
        ctx.moveTo(size / 2.8, -size / 1.8);
        ctx.lineTo(size / 1.8, -size / 1.3);
        ctx.lineTo(size / 3.5, -size / 1.65);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = size / 25;
        ctx.stroke();
        
        // Poils intérieurs oreille droite
        ctx.fillStyle = innerEarGradient;
        ctx.beginPath();
        ctx.moveTo(size / 2.7, -size / 1.75);
        ctx.lineTo(size / 1.9, -size / 1.45);
        ctx.lineTo(size / 3.3, -size / 1.68);
        ctx.closePath();
        ctx.fill();
        
        // Yeux expressifs avec pupilles de chat
        // Œil gauche - blanc
        ctx.fillStyle = '#FFFACD';
        ctx.beginPath();
        ctx.ellipse(size / 8, -size / 4, size / 9, size / 7, 0.1, 0, Math.PI * 2);
        ctx.fill();
        
        // Iris vert lumineux
        const eyeGradient = ctx.createRadialGradient(size / 8, -size / 4, 0, size / 8, -size / 4, size / 14);
        eyeGradient.addColorStop(0, '#7CFC00');
        eyeGradient.addColorStop(0.5, '#32CD32');
        eyeGradient.addColorStop(1, '#228B22');
        ctx.fillStyle = eyeGradient;
        ctx.beginPath();
        ctx.ellipse(size / 7.5, -size / 4, size / 16, size / 10, 0.1, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupille verticale noire
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.ellipse(size / 7.5, -size / 4, size / 45, size / 12, 0.1, 0, Math.PI * 2);
        ctx.fill();
        
        // Reflet brillant
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(size / 7, -size / 3.7, size / 30, 0, Math.PI * 2);
        ctx.fill();
        
        // Contour de l'œil
        ctx.strokeStyle = '#2F4F2F';
        ctx.lineWidth = size / 30;
        ctx.beginPath();
        ctx.ellipse(size / 8, -size / 4, size / 9, size / 7, 0.1, 0, Math.PI * 2);
        ctx.stroke();
        
        // Nez en forme de triangle rose
        const noseGradient = ctx.createRadialGradient(size / 3.2, -size / 10, 0, size / 3.2, -size / 10, size / 14);
        noseGradient.addColorStop(0, '#FFB6C1');
        noseGradient.addColorStop(0.6, '#FF69B4');
        noseGradient.addColorStop(1, '#DB7093');
        ctx.fillStyle = noseGradient;
        ctx.beginPath();
        ctx.moveTo(size / 3.2, -size / 11);
        ctx.lineTo(size / 3.8, -size / 8);
        ctx.lineTo(size / 2.8, -size / 8);
        ctx.closePath();
        ctx.fill();
        
        // Reflet sur le nez
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(size / 3.4, -size / 9, size / 35, 0, Math.PI * 2);
        ctx.fill();
        
        // Bouche mignonne en W
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = size / 35;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(size / 3.2, -size / 11);
        ctx.lineTo(size / 4, -size / 14);
        ctx.moveTo(size / 3.2, -size / 11);
        ctx.lineTo(size / 2.7, -size / 14);
        ctx.stroke();
        
        // Moustaches longues et fines
        ctx.strokeStyle = '#2F2F2F';
        ctx.lineWidth = size / 50;
        ctx.lineCap = 'round';
        
        // Moustaches droites (4 de chaque côté)
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(size / 3.5, -size / 9 + i * size / 30 - size / 25);
            ctx.lineTo(size / 1.2 + i * size / 60, -size / 9 + (i - 1.5) * size / 25);
            ctx.stroke();
        }
        
        // Moustaches gauches (4 de chaque côté)
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(size / 3.5, -size / 9 + i * size / 30 - size / 25);
            ctx.lineTo(-size / 12 - i * size / 60, -size / 9 + (i - 1.5) * size / 25);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    // Dessiner la sortie (porte de souris réaliste)
    drawExit(ctx, exit) {
        ctx.save();
        
        const x = exit.x;
        const y = exit.y;
        const width = exit.width;
        const height = exit.height;
        
        if (exit.isOpen) {
        // Porte ouverte - trou noir avec lueur verte
        
        // Effet de lueur verte brillante
        const glowGradient = ctx.createRadialGradient(
            x + width / 2, y + height / 2, 0,
            x + width / 2, y + height / 2, width * 1.2
        );
        glowGradient.addColorStop(0, 'rgba(50, 255, 50, 0.6)');
        glowGradient.addColorStop(0.5, 'rgba(50, 255, 50, 0.3)');
        glowGradient.addColorStop(1, 'rgba(50, 255, 50, 0)');
        ctx.fillStyle = glowGradient;
        ctx.fillRect(x - width * 0.2, y - height * 0.2, width * 1.4, height * 1.4);
        
        // Forme arrondie de trou (arc en haut)
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.arc(x + width / 2, y + height * 0.4, width * 0.45, Math.PI, 0, false);
        ctx.lineTo(x + width * 0.95, y + height);
        ctx.lineTo(x + width * 0.05, y + height);
        ctx.closePath();
        ctx.fill();
        
        // Contour lumineux vert
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = Math.max(3, width * 0.06);
        ctx.stroke();
        
        // Ombre intérieure pour donner de la profondeur
        const innerShadow = ctx.createRadialGradient(
            x + width / 2, y + height / 2, 0,
            x + width / 2, y + height / 2, width * 0.4
        );
        innerShadow.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
        innerShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = innerShadow;
        ctx.beginPath();
        ctx.arc(x + width / 2, y + height * 0.4, width * 0.45, Math.PI, 0, false);
        ctx.lineTo(x + width * 0.95, y + height);
        ctx.lineTo(x + width * 0.05, y + height);
        ctx.closePath();
        ctx.fill();
        
        // Particules de lumière autour
        ctx.fillStyle = '#00FF00';
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8 + Date.now() / 1000;
            const px = x + width / 2 + Math.cos(angle) * width * 0.6;
            const py = y + height / 2 + Math.sin(angle) * height * 0.6;
            ctx.beginPath();
            ctx.arc(px, py, Math.max(2, width * 0.04), 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Texte "SORTIE" lumineux
        ctx.fillStyle = '#00FF00';
        ctx.shadowColor = '#00FF00';
        ctx.shadowBlur = Math.max(10, width * 0.2);
        ctx.font = `bold ${Math.max(12, height * 0.25)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SORTIE', x + width / 2, y + height / 2);
        ctx.shadowBlur = 0;
        
        } else {
        // Porte fermée - style classique en bois
        
        // Forme arrondie du cadre de porte
        ctx.fillStyle = '#2C2C2C';
        ctx.beginPath();
        ctx.arc(x + width / 2, y + height * 0.4, width * 0.5, Math.PI, 0, false);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.closePath();
        ctx.fill();
        
        // Porte en bois avec texture
        const doorGradient = ctx.createLinearGradient(
            x + width * 0.15, y + height * 0.3,
            x + width * 0.85, y + height * 0.3
        );
        doorGradient.addColorStop(0, '#5D4037');
        doorGradient.addColorStop(0.5, '#6D4C41');
        doorGradient.addColorStop(1, '#5D4037');
        
        ctx.fillStyle = doorGradient;
        ctx.beginPath();
        ctx.arc(x + width / 2, y + height * 0.45, width * 0.38, Math.PI, 0, false);
        ctx.lineTo(x + width * 0.88, y + height * 0.92);
        ctx.lineTo(x + width * 0.12, y + height * 0.92);
        ctx.closePath();
        ctx.fill();
        
        // Contour de la porte
        ctx.strokeStyle = '#3E2723';
        ctx.lineWidth = Math.max(3, width * 0.05);
        ctx.stroke();
        
        // Planches de bois verticales
        ctx.strokeStyle = 'rgba(62, 39, 35, 0.5)';
        ctx.lineWidth = Math.max(2, width * 0.03);
        for (let i = 0; i < 4; i++) {
            const plankX = x + width * (0.25 + i * 0.17);
            ctx.beginPath();
            ctx.moveTo(plankX, y + height * 0.5);
            ctx.lineTo(plankX, y + height * 0.92);
            ctx.stroke();
        }
        
        // Poignée de porte (petite et ronde)
        const knobGradient = ctx.createRadialGradient(
            x + width * 0.7, y + height * 0.6,
            0,
            x + width * 0.7, y + height * 0.6,
            width * 0.08
        );
        knobGradient.addColorStop(0, '#FFD700');
        knobGradient.addColorStop(0.5, '#FFA500');
        knobGradient.addColorStop(1, '#FF8C00');
        
        ctx.fillStyle = knobGradient;
        ctx.beginPath();
        ctx.arc(x + width * 0.7, y + height * 0.6, width * 0.08, 0, Math.PI * 2);
        ctx.fill();
        
        // Reflet sur la poignée
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(x + width * 0.68, y + height * 0.58, width * 0.03, 0, Math.PI * 2);
        ctx.fill();
        
        // Ombre de la poignée
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(x + width * 0.72, y + height * 0.62, width * 0.03, 0, Math.PI * 2);
        ctx.fill();
        
        // Plaque "fermé" ou cadenas
        ctx.fillStyle = '#757575';
        ctx.beginPath();
        ctx.arc(x + width / 2, y + height * 0.75, width * 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#424242';
        ctx.lineWidth = Math.max(2, width * 0.03);
        ctx.stroke();
        
        // Symbole de cadenas
        ctx.strokeStyle = '#424242';
        ctx.lineWidth = Math.max(2, width * 0.04);
        ctx.beginPath();
        ctx.arc(x + width / 2, y + height * 0.72, width * 0.04, Math.PI, 0, true);
        ctx.stroke();
        ctx.fillStyle = '#424242';
        ctx.fillRect(
            x + width / 2 - width * 0.05, 
            y + height * 0.72, 
            width * 0.1, 
            width * 0.08
        );
        
        // Texte "FERMÉ"
        ctx.fillStyle = '#9E9E9E';
        ctx.font = `bold ${Math.max(10, height * 0.18)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('FERMÉ', x + width / 2, y + height * 0.3);
        }
        
        ctx.restore();
    }
    
    // Dessiner la souris allongée (stunnée) - Vue de côté, allongée par terre
    drawStunnedPlayer(ctx, player, skinColors) {
        const x = player.x;
        const y = player.y;
        const size = player.width;
        
        // Ombre plus large (souris allongée)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.ellipse(x + size / 2, y + size, size * 0.8, size / 6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // La souris est allongée sur le côté
        ctx.translate(x + size / 2, y + size / 2);
        
        // Clignotement pour montrer qu'elle est temporairement KO
        const blinkOpacity = (player.stunnedTimer % 30 < 15) ? 0.7 : 1;
        ctx.globalAlpha = blinkOpacity;
        
        // Corps allongé (ovale horizontal)
        const bodyGradient = ctx.createLinearGradient(-size / 2, 0, size / 2, 0);
        bodyGradient.addColorStop(0, skinColors.bodyDark);
        bodyGradient.addColorStop(0.5, skinColors.bodyMid);
        bodyGradient.addColorStop(1, skinColors.bodyDark);
        
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.ellipse(0, size / 6, size * 0.7, size / 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = skinColors.outline;
        ctx.lineWidth = size / 20;
        ctx.stroke();
        
        // Tête allongée sur le côté
        const headGradient = ctx.createRadialGradient(-size / 3, 0, size / 20, -size / 3, 0, size / 3);
        headGradient.addColorStop(0, skinColors.headLight);
        headGradient.addColorStop(0.6, skinColors.headMid);
        headGradient.addColorStop(1, skinColors.headDark);
        
        ctx.fillStyle = headGradient;
        ctx.beginPath();
        ctx.ellipse(-size / 3, 0, size / 3, size / 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = skinColors.outline;
        ctx.lineWidth = size / 20;
        ctx.stroke();
        
        // Oreille visible (sur le dessus)
        ctx.fillStyle = skinColors.bodyDark;
        ctx.beginPath();
        ctx.ellipse(-size / 2.5, -size / 5, size / 6, size / 4, -0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = skinColors.outline;
        ctx.lineWidth = size / 25;
        ctx.stroke();
        
        // Oeil fermé (X pour KO)
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = size / 15;
        ctx.lineCap = 'round';
        // X gauche
        ctx.beginPath();
        ctx.moveTo(-size / 2.2, -size / 15);
        ctx.lineTo(-size / 3, size / 15);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-size / 3, -size / 15);
        ctx.lineTo(-size / 2.2, size / 15);
        ctx.stroke();
        
        // Queue allongée derrière
        ctx.strokeStyle = skinColors.tail;
        ctx.lineWidth = size / 10;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(size / 3, size / 4);
        ctx.quadraticCurveTo(size / 1.5, size / 3, size * 0.8, size / 5);
        ctx.stroke();
        ctx.strokeStyle = skinColors.tailDark;
        ctx.lineWidth = size / 14;
        ctx.stroke();
        
        // Étoiles tournoyantes au-dessus (effet KO cartoon)
        const numStars = 3;
        const starRadius = size / 1.5;
        const starRotation = (Date.now() / 500) % (Math.PI * 2);
        for (let i = 0; i < numStars; i++) {
            const angle = starRotation + (i * Math.PI * 2) / numStars;
            const starX = Math.cos(angle) * starRadius - size / 3;
            const starY = Math.sin(angle) * starRadius / 2 - size / 2;
            
            ctx.fillStyle = '#FFD700';
            ctx.strokeStyle = '#FFA500';
            ctx.lineWidth = size / 30;
            this.drawStar(ctx, starX, starY, 5, size / 10, size / 20);
            ctx.fill();
            ctx.stroke();
        }
        
        // Timer de récupération (compte à rebours)
        ctx.globalAlpha = 1;
        const secondsLeft = Math.ceil(player.stunnedTimer / 60);
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = size / 15;
        ctx.font = `bold ${size / 1.5}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeText(secondsLeft, size / 1.5, -size / 2);
        ctx.fillText(secondsLeft, size / 1.5, -size / 2);
    }
    
    // Dessiner une étoile (helper)
    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;
        
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;
            
            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
    }
    
    // Obtenir les couleurs d'un skin
    getSkinColors(skinId) {
        const colors = {
        'default': {
            tail: '#C0A090', tailDark: '#A08070',
            bodyLight: '#E8E0D8', bodyMid: '#D0C8C0', bodyDark: '#A8A0A0', bodyDarkest: '#808080',
            headLight: '#F0E8E0', headMid: '#D8D0C8', headDark: '#B0A8A0', headDarkest: '#888888',
            outline: '#606060'
        },
        'skin-golden': {
            tail: '#FFD700', tailDark: '#FF8C00',
            bodyLight: '#FFF4E6', bodyMid: '#FFD700', bodyDark: '#FFA500', bodyDarkest: '#FF8C00',
            headLight: '#FFFACD', headMid: '#FFE082', headDark: '#FFD54F', headDarkest: '#FFC107',
            outline: '#FF6F00'
        },
        'skin-pirate': {
            tail: '#8B4513', tailDark: '#5D2E0F',
            bodyLight: '#D2691E', bodyMid: '#8B4513', bodyDark: '#654321', bodyDarkest: '#3E2723',
            headLight: '#CD853F', headMid: '#A0522D', headDark: '#8B4513', headDarkest: '#654321',
            outline: '#2E1A0F'
        },
        'skin-ninja': {
            tail: '#1A237E', tailDark: '#000051',
            bodyLight: '#5C6BC0', bodyMid: '#3F51B5', bodyDark: '#283593', bodyDarkest: '#1A237E',
            headLight: '#7986CB', headMid: '#5C6BC0', headDark: '#3949AB', headDarkest: '#283593',
            outline: '#000000'
        },
        'skin-vampire': {
            tail: '#B71C1C', tailDark: '#7F0000',
            bodyLight: '#EF5350', bodyMid: '#E53935', bodyDark: '#C62828', bodyDarkest: '#B71C1C',
            headLight: '#FF6F60', headMid: '#EF5350', headDark: '#E53935', headDarkest: '#C62828',
            outline: '#4A0000'
        },
        'skin-wizard': {
            tail: '#9C27B0', tailDark: '#6A1B9A',
            bodyLight: '#E1BEE7', bodyMid: '#BA68C8', bodyDark: '#9C27B0', bodyDarkest: '#7B1FA2',
            headLight: '#F3E5F5', headMid: '#CE93D8', headDark: '#AB47BC', headDarkest: '#8E24AA',
            outline: '#4A148C'
        },
        'skin-knight': {
            tail: '#B0BEC5', tailDark: '#78909C',
            bodyLight: '#ECEFF1', bodyMid: '#CFD8DC', bodyDark: '#B0BEC5', bodyDarkest: '#90A4AE',
            headLight: '#FFFFFF', headMid: '#ECEFF1', headDark: '#CFD8DC', headDarkest: '#B0BEC5',
            outline: '#455A64'
        },
        'skin-robot': {
            tail: '#607D8B', tailDark: '#455A64',
            bodyLight: '#90CAF9', bodyMid: '#64B5F6', bodyDark: '#42A5F5', bodyDarkest: '#2196F3',
            headLight: '#BBDEFB', headMid: '#90CAF9', headDark: '#64B5F6', headDarkest: '#1976D2',
            outline: '#0D47A1'
        },
        'skin-angel': {
            tail: '#FFF9C4', tailDark: '#FFF176',
            bodyLight: '#FFFFFF', bodyMid: '#FFFDE7', bodyDark: '#FFF9C4', bodyDarkest: '#FFF176',
            headLight: '#FFFFFF', headMid: '#FFFDE7', headDark: '#FFF9C4', headDarkest: '#FFEE58',
            outline: '#FFD600'
        },
        'skin-demon': {
            tail: '#D32F2F', tailDark: '#B71C1C',
            bodyLight: '#FF5252', bodyMid: '#F44336', bodyDark: '#D32F2F', bodyDarkest: '#C62828',
            headLight: '#FF6E40', headMid: '#FF5252', headDark: '#F44336', headDarkest: '#E53935',
            outline: '#1A0000'
        },
        'skin-alien': {
            tail: '#66BB6A', tailDark: '#43A047',
            bodyLight: '#A5D6A7', bodyMid: '#81C784', bodyDark: '#66BB6A', bodyDarkest: '#4CAF50',
            headLight: '#C8E6C9', headMid: '#A5D6A7', headDark: '#81C784', headDarkest: '#66BB6A',
            outline: '#1B5E20'
        },
        'skin-rainbow': {
            tail: '#FF0000', tailDark: '#FF4500',
            bodyLight: '#FFD700', bodyMid: '#00FF00', bodyDark: '#00BFFF', bodyDarkest: '#8B00FF',
            headLight: '#FF1493', headMid: '#FF69B4', headDark: '#9400D3', headDarkest: '#4B0082',
            earOuter: '#FF0000', earInner: '#FFA500',
            eye: '#FFFFFF', pupil: '#000000',
            nose: '#FF1493',
            accent: '#00FF00',
            outline: '#6A1B9A'
        },
        'skin-legendary': {
            tail: '#FF4500', tailDark: '#8B0000',
            bodyLight: '#FF6347', bodyMid: '#DC143C', bodyDark: '#B22222', bodyDarkest: '#8B0000',
            headLight: '#FF8C00', headMid: '#FF4500', headDark: '#DC143C', headDarkest: '#8B0000',
            outline: '#8B0000'
        }
        };
        
        return colors[skinId] || colors['default'];
    }
    
    // Dessiner un dragon rouge élémentaire pour le skin légendaire
    drawLegendaryDragon(ctx, player, size, skinColors) {
        // Corps de dragon avec écailles
        const bodyGradient = ctx.createRadialGradient(-size / 12, -size / 8, size / 20, 0, 0, size / 2);
        bodyGradient.addColorStop(0, '#FF4500');
        bodyGradient.addColorStop(0.3, '#DC143C');
        bodyGradient.addColorStop(0.7, '#B22222');
        bodyGradient.addColorStop(1, '#8B0000');
        
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.ellipse(-size / 12, 0, size / 2.2, size / 2.8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Écailles brillantes
        for (let i = 0; i < 5; i++) {
            ctx.fillStyle = 'rgba(255, 140, 0, 0.4)';
            ctx.beginPath();
            ctx.arc(-size / 4 + (i % 2) * size / 10, -size / 6 + Math.floor(i / 2) * size / 8, size / 12, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Tête de dragon avec cornes
        const headGradient = ctx.createRadialGradient(size / 8, -size / 5, size / 20, size / 10, -size / 5, size / 2.5);
        headGradient.addColorStop(0, '#FF8C00');
        headGradient.addColorStop(0.4, '#FF4500');
        headGradient.addColorStop(0.8, '#DC143C');
        headGradient.addColorStop(1, '#8B0000');
        
        ctx.fillStyle = headGradient;
        ctx.beginPath();
        ctx.ellipse(size / 8, -size / 5, size / 2.4, size / 2.2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Cornes de dragon (gauche et droite)
        ctx.fillStyle = '#8B0000';
        ctx.beginPath();
        ctx.moveTo(-size / 6, -size / 1.5);
        ctx.lineTo(-size / 4, -size);
        ctx.lineTo(-size / 8, -size / 1.6);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(size / 3, -size / 1.5);
        ctx.lineTo(size / 2.2, -size);
        ctx.lineTo(size / 4, -size / 1.6);
        ctx.fill();
        
        // Œil de dragon (jaune avec pupille rouge)
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.ellipse(size / 5, -size / 3.5, size / 8, size / 10, 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupille verticale de dragon
        ctx.fillStyle = '#8B0000';
        ctx.beginPath();
        ctx.ellipse(size / 5, -size / 3.5, size / 20, size / 8, 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Narine fumante
        ctx.strokeStyle = 'rgba(255, 69, 0, 0.6)';
        ctx.lineWidth = size / 15;
        ctx.beginPath();
        ctx.arc(size / 3.5, -size / 8, size / 12, 0, Math.PI * 2);
        ctx.stroke();
        
        // Crêtes dorsales
        for (let i = 0; i < 4; i++) {
            ctx.fillStyle = 'rgba(139, 0, 0, 0.8)';
            ctx.beginPath();
            ctx.moveTo(-size / 3 + i * size / 8, -size / 4);
            ctx.lineTo(-size / 3 + i * size / 8 - size / 15, -size / 2);
            ctx.lineTo(-size / 3 + i * size / 8 + size / 15, -size / 2);
            ctx.fill();
        }
        
        // Flammes autour (effet élémentaire)
        const time = Date.now() / 100;
        for (let i = 0; i < 8; i++) {
            const angle = (time + i * Math.PI / 4) % (Math.PI * 2);
            const radius = size * 0.8 + Math.sin(time * 2 + i) * size * 0.2;
            const fx = Math.cos(angle) * radius;
            const fy = Math.sin(angle) * radius;
            
            const flameGradient = ctx.createRadialGradient(fx, fy, 0, fx, fy, size / 6);
            flameGradient.addColorStop(0, 'rgba(255, 140, 0, 0.8)');
            flameGradient.addColorStop(0.5, 'rgba(255, 69, 0, 0.5)');
            flameGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            
            ctx.fillStyle = flameGradient;
            ctx.beginPath();
            ctx.arc(fx, fy, size / 6, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Dessiner un effet spécial selon le skin
    drawSkinEffect(ctx, size, skinId, walkCycle) {
        if (skinId === 'skin-legendary') {
        // Aura SANS particules jaunes pour éviter le bug du point jaune
        const auraGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.2);
        auraGradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
        auraGradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.15)');
        auraGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = auraGradient;
        ctx.beginPath();
        ctx.arc(0, 0, size * 1.2, 0, Math.PI * 2);
        ctx.fill();
        // PARTICULES DÉSACTIVÉES pour éviter le point jaune
        } else if (skinId === 'skin-rainbow') {
        // Double aura arc-en-ciel animée
        const gradient1 = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.3);
        const t = Date.now() / 1000;
        gradient1.addColorStop(0, `rgba(${128 + Math.sin(t) * 127}, ${128 + Math.sin(t + 2) * 127}, ${128 + Math.sin(t + 4) * 127}, 0.6)`);
        gradient1.addColorStop(0.5, `rgba(${128 + Math.cos(t) * 127}, ${128 + Math.cos(t + 2) * 127}, ${128 + Math.cos(t + 4) * 127}, 0.4)`);
        gradient1.addColorStop(1, 'rgba(255, 0, 255, 0)');
        ctx.fillStyle = gradient1;
        ctx.shadowColor = '#FF00FF';
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.arc(0, 0, size * 1.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Particules colorées
        for (let i = 0; i < 6; i++) {
            const angle = (Date.now() / 600 + i * Math.PI * 2 / 6) % (Math.PI * 2);
            const radius = size * 0.7;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            const hue = (Date.now() / 10 + i * 60) % 360;
            
            ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;
            ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(px, py, size / 12, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.shadowBlur = 0;
        } else if (skinId === 'skin-golden') {
        // PAS D'EFFET pour éviter le point jaune gênant
        // L'effet est géré uniquement par la couleur du corps
        } else if (skinId === 'skin-demon') {
        // Flammes rouges
        const flameGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.1);
        flameGradient.addColorStop(0, 'rgba(255, 69, 0, 0.5)');
        flameGradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.3)');
        flameGradient.addColorStop(1, 'rgba(139, 0, 0, 0)');
        ctx.fillStyle = flameGradient;
        ctx.shadowColor = '#FF0000';
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.arc(0, 0, size * 1.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        } else if (skinId === 'skin-wizard') {
        // Étoiles magiques violettes
        for (let i = 0; i < 5; i++) {
            const angle = (Date.now() / 500 + i * Math.PI * 2 / 5) % (Math.PI * 2);
            const radius = size * 0.6;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            
            ctx.fillStyle = '#9370DB';
            ctx.shadowColor = '#9370DB';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(px, py, size / 15, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.shadowBlur = 0;
        } else if (skinId === 'skin-angel') {
        // Halo blanc brillant
        const haloGradient = ctx.createRadialGradient(0, -size * 0.6, 0, 0, -size * 0.6, size * 0.4);
        haloGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        haloGradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.5)');
        haloGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = haloGradient;
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(0, -size * 0.6, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        } else if (skinId === 'skin-alien') {
        // Lueur verte alien
        const alienGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.1);
        alienGradient.addColorStop(0, 'rgba(127, 255, 0, 0.5)');
        alienGradient.addColorStop(0.7, 'rgba(50, 205, 50, 0.3)');
        alienGradient.addColorStop(1, 'rgba(0, 255, 0, 0)');
        ctx.fillStyle = alienGradient;
        ctx.shadowColor = '#00FF00';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(0, 0, size * 1.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        }
    }
    
    // Dessiner un monstre de lave (Caverne de Lave - Niveau 5)
    drawLavaMonster(ctx, size, walkCycle) {
        // Corps de lave incandescent
        const bodyGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size / 1.5);
        bodyGradient.addColorStop(0, '#FFFF00');
        bodyGradient.addColorStop(0.3, '#FF4500');
        bodyGradient.addColorStop(0.7, '#DC143C');
        bodyGradient.addColorStop(1, '#8B0000');
        
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Flammes animées
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2 + Date.now() / 200;
            const flameSize = size / 6 + Math.sin(Date.now() / 100 + i) * size / 12;
            const flameX = Math.cos(angle) * size / 3;
            const flameY = Math.sin(angle) * size / 3;
            
            const flameGradient = ctx.createRadialGradient(flameX, flameY, 0, flameX, flameY, flameSize);
            flameGradient.addColorStop(0, '#FFFF00');
            flameGradient.addColorStop(0.5, '#FF4500');
            flameGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            
            ctx.fillStyle = flameGradient;
            ctx.beginPath();
            ctx.arc(flameX, flameY, flameSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Yeux de braise
        ctx.fillStyle = '#FFFF00';
        ctx.shadowColor = '#FF4500';
        ctx.shadowBlur = size / 5;
        ctx.beginPath();
        ctx.arc(-size / 6, -size / 8, size / 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(size / 6, -size / 8, size / 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
    }
    
    // Dessiner une créature de glace (Temple Glacé - Niveau 6)
    drawIceCreature(ctx, size, walkCycle) {
        // Corps de cristal de glace
        const bodyGradient = ctx.createLinearGradient(-size / 2, -size / 2, size / 2, size / 2);
        bodyGradient.addColorStop(0, '#E0F7FF');
        bodyGradient.addColorStop(0.5, '#B3E5FC');
        bodyGradient.addColorStop(1, '#81D4FA');
        
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.moveTo(0, -size / 2);
        ctx.lineTo(size / 3, 0);
        ctx.lineTo(0, size / 2);
        ctx.lineTo(-size / 3, 0);
        ctx.closePath();
        ctx.fill();
        
        // Reflets de glace
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = size / 15;
        ctx.beginPath();
        ctx.moveTo(-size / 6, -size / 4);
        ctx.lineTo(size / 8, size / 6);
        ctx.stroke();
        
        // Cristaux de glace flottants
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2 + Date.now() / 500;
            const crystalX = Math.cos(angle) * size / 2.5;
            const crystalY = Math.sin(angle) * size / 2.5;
            
            ctx.fillStyle = 'rgba(173, 216, 230, 0.7)';
            ctx.beginPath();
            ctx.moveTo(crystalX, crystalY - size / 10);
            ctx.lineTo(crystalX + size / 20, crystalY);
            ctx.lineTo(crystalX, crystalY + size / 10);
            ctx.lineTo(crystalX - size / 20, crystalY);
            ctx.closePath();
            ctx.fill();
        }
        
        // Yeux glacés
        ctx.fillStyle = '#00BFFF';
        ctx.shadowColor = '#00BFFF';
        ctx.shadowBlur = size / 5;
        ctx.beginPath();
        ctx.arc(-size / 8, -size / 10, size / 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(size / 8, -size / 10, size / 12, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
    }
    
    // Dessiner un rat d'égout (Égouts Aquatiques - Niveau 7)
    drawSewerRat(ctx, size, walkCycle) {
        // Corps du rat (gris-vert sale)
        const bodyGradient = ctx.createLinearGradient(-size / 3, -size / 4, size / 3, size / 4);
        bodyGradient.addColorStop(0, '#8B8B7A');
        bodyGradient.addColorStop(0.5, '#6B6B5A');
        bodyGradient.addColorStop(1, '#4B4B3A');
        
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, size / 2.5, size / 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Tête
        ctx.beginPath();
        ctx.ellipse(size / 3, -size / 12, size / 4, size / 5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Museau pointu
        ctx.fillStyle = '#9B9B8A';
        ctx.beginPath();
        ctx.ellipse(size / 2, -size / 12, size / 8, size / 10, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Oreilles rondes
        ctx.fillStyle = '#7B7B6A';
        ctx.beginPath();
        ctx.arc(size / 6, -size / 3, size / 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(size / 3, -size / 3.5, size / 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Queue longue et fine
        ctx.strokeStyle = '#6B6B5A';
        ctx.lineWidth = size / 15;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-size / 2.5, size / 8);
        ctx.quadraticCurveTo(-size / 1.5, size / 4 + walkCycle * 5, -size / 1.1, size / 6);
        ctx.stroke();
        
        // Yeux rouges maléfiques
        ctx.fillStyle = '#FF0000';
        ctx.shadowColor = '#FF0000';
        ctx.shadowBlur = size / 8;
        ctx.beginPath();
        ctx.arc(size / 4, -size / 8, size / 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(size / 2.5, -size / 6, size / 20, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        
        // Moustaches
        ctx.strokeStyle = 'rgba(200, 200, 200, 0.7)';
        ctx.lineWidth = size / 40;
        for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.moveTo(size / 2, -size / 12 + i * size / 20);
            ctx.lineTo(size / 1.3, -size / 12 + i * size / 15);
            ctx.stroke();
        }
    }
    
    // Dessiner un robot électrique (Tour Électrique - Niveau 8)
    drawElectricRobot(ctx, size, walkCycle) {
        // Corps métallique
        const bodyGradient = ctx.createLinearGradient(-size / 3, -size / 3, size / 3, size / 3);
        bodyGradient.addColorStop(0, '#E0E0E0');
        bodyGradient.addColorStop(0.5, '#90CAF9');
        bodyGradient.addColorStop(1, '#42A5F5');
        
        ctx.fillStyle = bodyGradient;
        ctx.fillRect(-size / 3, -size / 3, size * 0.66, size * 0.66);
        
        // Contour métallique
        ctx.strokeStyle = '#263238';
        ctx.lineWidth = size / 20;
        ctx.strokeRect(-size / 3, -size / 3, size * 0.66, size * 0.66);
        
        // Détails technologiques
        ctx.fillStyle = '#1976D2';
        ctx.fillRect(-size / 6, -size / 6, size / 10, size / 3);
        ctx.fillRect(size / 12, -size / 6, size / 10, size / 3);
        
        // Yeux écrans lumineux
        ctx.fillStyle = '#00E676';
        ctx.shadowColor = '#00E676';
        ctx.shadowBlur = size / 4;
        ctx.fillRect(-size / 5, -size / 5, size / 7, size / 8);
        ctx.fillRect(size / 12, -size / 5, size / 7, size / 8);
        
        ctx.shadowBlur = 0;
        
        // Éclairs électriques animés
        if (Math.random() > 0.7) {
            ctx.strokeStyle = '#FFFF00';
            ctx.shadowColor = '#FFFF00';
            ctx.shadowBlur = size / 3;
            ctx.lineWidth = size / 30;
            ctx.beginPath();
            ctx.moveTo(-size / 2, 0);
            ctx.lineTo(-size / 3, walkCycle * 3);
            ctx.lineTo(-size / 4, 0);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(size / 2, 0);
            ctx.lineTo(size / 3, -walkCycle * 3);
            ctx.lineTo(size / 4, 0);
            ctx.stroke();
            
            ctx.shadowBlur = 0;
        }
        
        // Antenne avec signal
        ctx.strokeStyle = '#263238';
        ctx.lineWidth = size / 25;
        ctx.beginPath();
        ctx.moveTo(0, -size / 3);
        ctx.lineTo(0, -size / 2);
        ctx.stroke();
        
        ctx.fillStyle = '#FF5722';
        ctx.beginPath();
        ctx.arc(0, -size / 2, size / 15, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Dessiner une chauve-souris vampire (Donjon Nocturne - Niveau 9)
    drawVampireBat(ctx, size, walkCycle) {
        // Ailes déployées
        const wingSpan = Math.abs(walkCycle) * size / 4 + size / 2;
        
        ctx.fillStyle = '#2C2C3C';
        ctx.strokeStyle = '#1A1A2E';
        ctx.lineWidth = size / 30;
        
        // Aile gauche
        ctx.beginPath();
        ctx.moveTo(-size / 6, 0);
        ctx.quadraticCurveTo(-wingSpan, -size / 3, -wingSpan / 1.5, size / 6);
        ctx.quadraticCurveTo(-size / 3, size / 4, -size / 6, 0);
        ctx.fill();
        ctx.stroke();
        
        // Aile droite
        ctx.beginPath();
        ctx.moveTo(size / 6, 0);
        ctx.quadraticCurveTo(wingSpan, -size / 3, wingSpan / 1.5, size / 6);
        ctx.quadraticCurveTo(size / 3, size / 4, size / 6, 0);
        ctx.fill();
        ctx.stroke();
        
        // Corps
        const bodyGradient = ctx.createLinearGradient(0, -size / 4, 0, size / 4);
        bodyGradient.addColorStop(0, '#4A4A5A');
        bodyGradient.addColorStop(1, '#2C2C3C');
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, size / 6, size / 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Tête
        ctx.beginPath();
        ctx.arc(0, -size / 5, size / 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Oreilles pointues
        ctx.beginPath();
        ctx.moveTo(-size / 8, -size / 3);
        ctx.lineTo(-size / 6, -size / 2);
        ctx.lineTo(-size / 12, -size / 3.5);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(size / 8, -size / 3);
        ctx.lineTo(size / 6, -size / 2);
        ctx.lineTo(size / 12, -size / 3.5);
        ctx.closePath();
        ctx.fill();
        
        // Yeux rouges vampiriques
        ctx.fillStyle = '#FF0000';
        ctx.shadowColor = '#FF0000';
        ctx.shadowBlur = size / 4;
        ctx.beginPath();
        ctx.arc(-size / 12, -size / 5, size / 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(size / 12, -size / 5, size / 20, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        
        // Crocs
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(-size / 20, -size / 10);
        ctx.lineTo(-size / 25, 0);
        ctx.lineTo(-size / 30, -size / 10);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(size / 20, -size / 10);
        ctx.lineTo(size / 25, 0);
        ctx.lineTo(size / 30, -size / 10);
        ctx.closePath();
        ctx.fill();
    }
    
    // Dessiner un monstre boss (Boss Final - Niveau 10)
    drawBossMonster(ctx, size, walkCycle) {
        // Corps massif et menaçant
        const bodyGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size / 1.3);
        bodyGradient.addColorStop(0, '#8B0000');
        bodyGradient.addColorStop(0.5, '#4A0000');
        bodyGradient.addColorStop(1, '#1A0000');
        
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, size / 1.8, size / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Cornes démoniaques
        ctx.fillStyle = '#2C0000';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = size / 25;
        
        // Corne gauche
        ctx.beginPath();
        ctx.moveTo(-size / 4, -size / 2);
        ctx.quadraticCurveTo(-size / 2, -size / 1.5, -size / 3, -size / 1.2);
        ctx.lineTo(-size / 4.5, -size / 1.3);
        ctx.quadraticCurveTo(-size / 2.5, -size / 1.4, -size / 3.5, -size / 2.2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Corne droite
        ctx.beginPath();
        ctx.moveTo(size / 4, -size / 2);
        ctx.quadraticCurveTo(size / 2, -size / 1.5, size / 3, -size / 1.2);
        ctx.lineTo(size / 4.5, -size / 1.3);
        ctx.quadraticCurveTo(size / 2.5, -size / 1.4, size / 3.5, -size / 2.2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Yeux brillants menaçants
        ctx.fillStyle = '#FF4500';
        ctx.shadowColor = '#FF4500';
        ctx.shadowBlur = size / 2;
        ctx.beginPath();
        ctx.ellipse(-size / 6, -size / 6, size / 8, size / 6, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(size / 6, -size / 6, size / 8, size / 6, 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupilles verticales
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.ellipse(-size / 6, -size / 6, size / 30, size / 8, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(size / 6, -size / 6, size / 30, size / 8, 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        
        // Bouche menaçante avec crocs
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = size / 20;
        ctx.beginPath();
        ctx.arc(0, size / 8, size / 4, 0, Math.PI);
        ctx.stroke();
        
        // Crocs
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 4; i++) {
            const fangX = -size / 6 + i * size / 9;
            ctx.beginPath();
            ctx.moveTo(fangX, size / 8);
            ctx.lineTo(fangX - size / 40, size / 4);
            ctx.lineTo(fangX + size / 40, size / 8);
            ctx.closePath();
            ctx.fill();
        }
        
        // Aura sombre pulsante
        ctx.globalAlpha = 0.3 + Math.sin(Date.now() / 300) * 0.2;
        const auraGradient = ctx.createRadialGradient(0, 0, size / 2, 0, 0, size);
        auraGradient.addColorStop(0, 'rgba(139, 0, 0, 0.5)');
        auraGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = auraGradient;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// Système de particules pour les effets
class ParticleSystem {
    constructor() {
        this.particles = [];
    }
    
    createBurst(x, y, color, count = 10) {
        for (let i = 0; i < count; i++) {
        this.particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8 - 2,
            life: 1,
            decay: 0.02,
            size: Math.random() * 4 + 2,
            color: color
        });
        }
    }
    
    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // Gravité
        p.life -= p.decay;
        
        if (p.life <= 0) {
            this.particles.splice(i, 1);
        }
        }
    }
    
    render(ctx) {
        this.update();
        
        for (let p of this.particles) {
        ctx.save();
        ctx.globalAlpha = p.life;
        
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        }
    }
}

// Initialisation globale
window.graphicsRenderer = new GraphicsRenderer();
window.particleSystem = new ParticleSystem();


