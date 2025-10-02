# 🎴 Card Game Maker

Application web multijoueurs de jeux de cartes en temps réel, développée avec **Next.js 15**, **TypeScript** et **Socket.IO**.

## 🎮 Jeux Disponibles

### ✅ Trou de cul (Président) - Phase 1
Jeu de cartes québécois où les joueurs tentent de se débarrasser de toutes leurs cartes. Le premier devient **Président** 👑, le dernier devient **Trou de cul** 💩.

### 🚧 Texas Hold'em - Phase 2 (À venir)
Poker classique avec enchères et combinaisons.

## 🚀 Démarrage Rapide

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

### Production
```bash
npm run build
npm start
```

## 📁 Structure du Projet

```
card-maker/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx           # Accueil
│   ├── create/            # Créer une partie
│   ├── join/              # Rejoindre
│   ├── lobby/             # Salon d'attente
│   ├── game/              # Interface de jeu
│   └── results/           # Résultats
│
├── components/game/       # Composants de jeu
│   └── PlayingCard.tsx    # Carte jouable
│
├── lib/
│   ├── games/
│   │   ├── base/         # Classes de base (Card, Deck, Player, Game)
│   │   └── president/    # Logique Trou de cul
│   ├── socket/           # WebSocket serveur
│   └── store/            # État Zustand
│
├── hooks/                # Hooks personnalisés
│   ├── useSocket.ts      # Connexion WebSocket
│   └── useGame.ts        # Hook jeu principal
│
├── types/                # Types TypeScript
│   ├── game.ts
│   ├── player.ts
│   └── socket.ts
│
└── server.js            # Serveur Node.js personnalisé
```

## 🎯 Fonctionnalités

### Phase 1 - MVP ✅ (Actuelle)
- ✅ Création de parties avec code unique
- ✅ Connexion multijoueurs en temps réel
- ✅ Jeu complet "Trou de cul" (règles de base)
- ✅ Interface responsive
- ✅ Gestion d'état en mémoire
- ✅ WebSocket avec Socket.IO

### Phase 2 - Texas Hold'em + UX 🚧
- [ ] Implémentation Texas Hold'em complet
- [ ] Animations de cartes
- [ ] Système de chat
- [ ] Gestion déconnexions/reconnexions
- [ ] Timer pour actions

### Phase 3 - Persistance & Auth 📅
- [ ] Base de données PostgreSQL
- [ ] Authentification utilisateurs
- [ ] Sauvegarde/reprise de parties
- [ ] Historique et statistiques

### Phase 4 - Fonctionnalités Avancées 🔮
- [ ] Règles personnalisables
- [ ] Tournois/classements
- [ ] Replay de parties
- [ ] Thèmes personnalisables

## 🎲 Comment Jouer

### Créer une partie
1. Cliquez sur "Créer une partie"
2. Entrez votre nom
3. Choisissez le nombre de joueurs (3-8)
4. Partagez le code de partie (ex: ABC123)

### Rejoindre
1. Cliquez sur "Rejoindre une partie"
2. Entrez le code reçu
3. Entrez votre nom
4. Attendez dans le lobby

### Jouer
1. Le joueur avec le 3♣ commence
2. Jouez des cartes de même valeur supérieures
3. Ou passez votre tour
4. Premier à finir = Président 👑
5. Dernier = Trou de cul 💩

## 🛠️ Technologies

- **Framework**: Next.js 15 (App Router)
- **Langage**: TypeScript (mode strict)
- **Temps réel**: Socket.IO
- **État**: Zustand
- **UI**: Tailwind CSS 4
- **Validation**: Zod

## 📚 Documentation

- [Cahier des charges](CAHIER_DES_CHARGES.md) - Spécifications complètes
- [Phase 1 - Implémentation](IMPLEMENTATION_PHASE1.md) - Détails techniques
- [Setup complet](SETUP_COMPLETE.md) - Configuration initiale

## 🔧 Scripts

```bash
npm run dev      # Serveur de développement
npm run build    # Build production
npm run start    # Démarrer en production
npm run lint     # Linter ESLint
```

## 🌐 Déploiement

L'application peut être déployée sur:
- **Vercel** (recommandé)
- **Railway**
- **Render**
- Tout hébergeur Node.js

## 📝 Notes Importantes

### Phase 1 (Actuelle)
- Les parties sont en mémoire (perdues au redémarrage)
- Pas de persistance de données
- Pas de reconnexion automatique
- 3-8 joueurs par partie

## 🤝 Contribution

Ce projet est en développement actif. Consultez le [cahier des charges](CAHIER_DES_CHARGES.md) pour voir les prochaines étapes.

## 📄 Licence

ISC

---

**Version**: 1.0.0 (Phase 1)
**Dernière mise à jour**: 2025-10-01
**Status**: ✅ Phase 1 Complète 
