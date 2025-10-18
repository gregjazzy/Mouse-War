# 🐭 MAZE MOUSE - Adventure Game

Un jeu d'aventure 2D premium avec des **graphismes de qualité Nintendo Switch** ! Guidez une adorable souris à travers des labyrinthes dangereux remplis de pièges, d'ennemis et de fromages délicieux.

![Badge](https://img.shields.io/badge/Qualit%C3%A9-Nintendo%20Switch-red)
![Badge](https://img.shields.io/badge/Genre-Platformer%20%2F%20Puzzle-blue)
![Badge](https://img.shields.io/badge/JavaScript-Vanilla-yellow)

## ✨ Fonctionnalités Premium

### 🔐 Système de Comptes Utilisateurs
- **Création de compte** sécurisée avec nom d'utilisateur unique
- **Connexion/Déconnexion** avec mot de passe
- **Sauvegarde automatique** des données par compte
- **Noms d'utilisateur uniques** - Pas de duplication possible
- **Données persistantes** via localStorage

### 🎨 Graphismes AAA
- **Animations fluides** à 60 FPS
- **Ombres portées** et effets de lumière
- **Dégradés sophistiqués** sur tous les sprites
- **Particules dynamiques** pour les effets spéciaux
- **Design cohérent** style jeu indie Switch

### 🎮 Gameplay Riche
- **3 niveaux** avec difficulté progressive
- **Physique réaliste** avec gravité et friction
- **Système de vies** (3 vies par partie)
- **Collection de fromages** pour débloquer la sortie
- **Score et chronomètre** pour se surpasser

### 🎯 Éléments de Jeu

#### 🐭 La Souris (Joueur)
- Animations détaillées (marche, saut, directions)
- Contrôles précis et réactifs
- Design mignon avec moustaches et queue animée

#### 🧀 Fromages Collectibles
- Effet de rotation et flottement
- Lueur dorée animée
- Particules lors de la collecte

#### ⚠️ Pièges Variés
- **Pics** - Pièges statiques mortels
- **Feu** - Flammes animées avec plusieurs couches
- **Chats ennemis** - Patrouilleurs avec IA

#### 🚪 Sortie
- Se débloque après avoir collecté tous les fromages
- Portail vert animé
- Effet de lueur

## 🕹️ Commandes

| Touche | Action |
|--------|--------|
| ← → | Se déplacer |
| ↑ ou ESPACE | Sauter |
| ESC | Pause |

## 📦 Structure du Projet

```
maze-mouse/
│
├── index.html        # Structure HTML + écrans d'authentification
├── style.css         # Styles premium avec animations
├── engine.js         # Moteur de jeu et physique
├── graphics.js       # Système de rendu graphique
├── levels.js         # Données des niveaux
├── game.js           # Contrôleur principal + système de comptes
└── README.md         # Ce fichier
```

## 🔐 Système de Comptes

### Création de Compte
1. Cliquez sur "Créer un compte" sur l'écran de connexion
2. Choisissez un nom d'utilisateur unique (minimum 3 caractères)
3. Créez un mot de passe (minimum 4 caractères)
4. Confirmez votre mot de passe
5. Votre compte est créé et vous êtes automatiquement connecté !

### Connexion
1. Entrez votre nom d'utilisateur
2. Entrez votre mot de passe
3. Appuyez sur "Se connecter" ou tapez Entrée
4. Accédez à votre partie sauvegardée !

### Sécurité
- Les mots de passe sont **hashés** avant le stockage
- Les noms d'utilisateur sont **uniques** - Impossible de créer deux comptes avec le même nom
- Validation des données côté client
- Stockage sécurisé dans localStorage

### Données Sauvegardées par Compte
- 💰 Nombre de pièces
- 🛍️ Objets et niveaux achetés
- 🎨 Skins débloqués et équipés
- 🐭 Nom de la souris personnalisé
- 📊 Progression dans le jeu

## 🚀 Installation & Lancement

### Méthode Simple
1. Téléchargez tous les fichiers
2. Ouvrez `index.html` dans un navigateur moderne
3. Jouez !

### Aucune Dépendance
- ✅ Pas de framework
- ✅ Pas de bibliothèque externe
- ✅ JavaScript pur (Vanilla JS)
- ✅ Canvas API natif

## 🎯 Objectifs du Jeu

### Niveau 1 : Le Garde-Manger
- **Difficulté** : Facile ★☆☆
- **Fromages** : 5
- **Pièges** : Pics uniquement
- **Objectif** : Apprendre les mécaniques de base

### Niveau 2 : La Cave Dangereuse
- **Difficulté** : Moyen ★★☆
- **Fromages** : 6
- **Pièges** : Pics + Feu + 1 Ennemi
- **Objectif** : Maîtriser le timing et l'esquive

### Niveau 3 : Le Piège Fatal
- **Difficulté** : Difficile ★★★
- **Fromages** : 6
- **Pièges** : Pics + Feu + 3 Ennemis
- **Objectif** : Perfection et stratégie

## 🏆 Système de Score

- **Fromage collecté** : +100 points
- **Bonus de temps** : Jusqu'à +1000 points
- **Étoiles** :
  - ⭐ : Niveau terminé
  - ⭐⭐ : Tous les fromages collectés
  - ⭐⭐⭐ : Tous les fromages + temps < 60s

## 🎨 Détails Techniques

### Rendu Graphique
- **Canvas 2D** en haute résolution (1280x720)
- **Anti-aliasing** natif
- **Dégradés radiaux et linéaires**
- **Compositing** pour les effets de transparence
- **Transformations matricielles** pour les animations

### Physique
- **Gravité** : 0.6 pixels/frame²
- **Friction** : 0.8 (coefficient)
- **Vitesse de saut** : -12 pixels/frame
- **Vitesse de marche** : 4 pixels/frame

### Animations
- **Cycle de marche** : 4 frames
- **Rotation continue** des fromages
- **Oscillation** des flammes
- **Patrouille** intelligente des ennemis

### Caméra
- **Suivi fluide** du joueur
- **Limites du niveau** respectées
- **Centrage dynamique**

## 🌟 Effets Visuels

### Ombres Portées
- Sous chaque sprite
- Ellipses semi-transparentes
- Taille adaptative

### Système de Particules
- **Burst** lors de la collecte
- **Gravité** appliquée aux particules
- **Fade out** progressif
- **Couleurs personnalisées**

### Lumières
- **Lueur** autour des fromages
- **Halos** sur le feu
- **Portail lumineux** à la sortie

## 🐛 Debug et Développement

### Touches de Debug (avec CTRL)
- `CTRL + V` : Forcer la victoire
- `CTRL + L` : Passer au niveau suivant

### Console
Le jeu affiche des informations utiles dans la console du navigateur.

## 🔧 Personnalisation

### Modifier les Couleurs
Dans `style.css`, changez les variables CSS :
```css
:root {
    --primary: #FF6B6B;
    --secondary: #4ECDC4;
    --accent: #FFE66D;
}
```

### Ajouter des Niveaux
Dans `levels.js`, ajoutez un nouvel objet dans `LEVELS` :
```javascript
4: {
    name: "Nouveau Niveau",
    startX: 2,
    startY: 1,
    map: [ /* votre carte */ ]
}
```

### Modifier la Physique
Dans `engine.js`, ajustez les propriétés :
```javascript
this.gravity = 0.6;
this.friction = 0.8;
this.player.speed = 4;
this.player.jumpPower = 12;
```

## 🎮 Compatibilité

### Navigateurs Supportés
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Systèmes d'Exploitation
- ✅ Windows
- ✅ macOS
- ✅ Linux

### Performance
- **60 FPS** sur matériel moderne
- **Optimisé** pour processeurs récents
- **Responsive** - S'adapte à différentes résolutions

## 🎨 Inspirations

Ce jeu s'inspire des meilleurs jeux indie de la Nintendo Switch :
- **Celeste** - Pour la précision des contrôles
- **Hollow Knight** - Pour le style graphique
- **Super Meat Boy** - Pour le level design
- **Ori and the Blind Forest** - Pour les effets visuels

## 📝 Crédits

- **Design & Développement** : JavaScript Vanilla
- **Graphismes** : Canvas API 2D
- **Animations** : requestAnimationFrame
- **Physique** : Moteur personnalisé

## 🏅 Achievements (Non implémentés)

Idées pour futures versions :
- 🥇 Speedrunner : Terminer tous les niveaux en < 3 minutes
- 🧀 Gourmand : Collecter 100 fromages au total
- 💀 Invincible : Terminer un niveau sans perdre de vie
- ⭐ Perfectionniste : Obtenir 3 étoiles sur tous les niveaux

## 🔮 Améliorations Futures

- [ ] Plus de niveaux
- [ ] Nouveaux types de pièges
- [ ] Power-ups (vitesse, invincibilité)
- [ ] Mode multijoueur
- [ ] Musique et effets sonores
- [ ] Éditeur de niveaux
- [ ] Sauvegarde des scores
- [ ] Classement en ligne

## 📄 Licence

Ce projet est libre d'utilisation pour un usage personnel et éducatif.

---

## 🎮 Bon jeu !

**Collectez tous les fromages, évitez les pièges, et aidez la souris à s'échapper ! 🐭🧀**

---

*Développé avec ❤️ et beaucoup de JavaScript*


