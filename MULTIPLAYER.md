# 🎮 Maze Mouse - Guide Multijoueur

## 📡 Serveur Multijoueur

### Installation

1. Installer les dépendances :
```bash
npm install
```

### Démarrage du serveur

```bash
npm start
```

Le serveur sera accessible sur `ws://localhost:8080`

### Mode développement (avec redémarrage automatique)

```bash
npm run dev
```

## 🎯 Comment jouer en multijoueur

1. **Démarrer le serveur** : Exécutez `npm start` dans le terminal
2. **Ouvrir le jeu** : Lancez `index.html` dans votre navigateur
3. **Se connecter** : Créez un compte ou connectez-vous
4. **Cliquer sur MULTIJOUEUR** dans le menu principal
5. **Choisir une équipe** : Rouge ou Bleue
6. **Jouer** : Vous verrez les autres joueurs connectés avec leurs pseudos !

## ✨ Fonctionnalités

- 🌐 Connexion WebSocket en temps réel
- 👥 Voir les autres joueurs et leurs pseudos
- 🎨 Affichage des skins des autres joueurs
- 🔄 Synchronisation automatique des positions
- 💬 Notifications quand un joueur rejoint/quitte
- 🏷️ Affichage des usernames au-dessus des souris

## 🔧 Configuration

Pour héberger sur un serveur distant, modifiez l'URL dans `multiplayer.js` :

```javascript
this.serverUrl = 'ws://votre-serveur.com:8080';
```

## 🐛 Dépannage

### Le serveur ne démarre pas
- Vérifiez que Node.js est installé : `node --version`
- Vérifiez que le port 8080 est libre
- Installez les dépendances : `npm install`

### Impossible de se connecter
- Vérifiez que le serveur est démarré
- Vérifiez l'URL dans `multiplayer.js`
- Vérifiez que votre pare-feu n'est pas bloquant le port 8080

## 📝 Notes techniques

- Le serveur utilise WebSocket (bibliothèque `ws`)
- Synchronisation à 20 FPS (50ms par mise à jour)
- Support multi-rooms (un room par niveau)
- Nettoyage automatique des rooms vides

