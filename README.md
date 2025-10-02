# 🎴 Application de Jeux de Cartes Multijoueurs

Application web en temps réel permettant de jouer à des jeux de cartes multijoueurs. Actuellement disponible : **Trou de cul** (Président).

Développée avec **Next.js 15**, **TypeScript** et **Socket.IO**.

## 🎮 Jeux Disponibles

### ✅ Trou de cul (Président) - Phase 1
Jeu de cartes québécois où les joueurs tentent de se débarrasser de toutes leurs cartes. Le premier devient **Président** 👑, le dernier devient **Trou de cul** 💩.

**Joueurs** : 3-10 joueurs
**Durée moyenne** : 10-15 minutes

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

## 🎲 Comment Jouer au Trou de cul

### 1. Créer une Partie

1. Sur la page d'accueil, cliquez sur **"Créer une partie"**
2. Entrez votre nom de joueur
3. Configurez le nombre maximum de joueurs (3-10 recommandé)
4. Un code unique sera généré (ex: `8LNBYT`)
5. **Partagez ce code** avec vos amis !

### 2. Rejoindre une Partie

1. Cliquez sur **"Rejoindre une partie"**
2. Entrez le **code de partie** à 6 caractères
3. Entrez votre nom
4. Vous serez redirigé vers le lobby

### 3. Lobby de Partie

- **Voir les joueurs** connectés en temps réel
- **Marquer votre statut** comme "Prêt" (joueurs non-hôtes)
- L'**hôte** peut démarrer quand :
  - Minimum **3 joueurs** sont présents
  - Tous les joueurs sont **"Prêt"**

### 4. Règles du Jeu

#### Objectif
Se débarrasser de toutes ses cartes le plus rapidement possible.

#### Hiérarchie des Cartes
Du plus **faible** au plus **fort** :
```
3 < 4 < 5 < 6 < 7 < 8 < 9 < 10 < J < Q < K < A < 2
```
⚠️ Le **2 est la carte la plus forte** !

#### Déroulement d'un Tour

1. **Premier tour** : Le joueur avec le **3♣** (3 de trèfle) commence et DOIT le jouer
2. Vous pouvez jouer :
   - Une **carte seule**
   - Une **paire** (2 cartes identiques)
   - Un **brelan** (3 cartes identiques)
   - Un **carré** (4 cartes identiques)
3. Le joueur suivant doit **battre** le jeu précédent avec :
   - Le **même nombre** de cartes
   - De **valeur supérieure**
4. Si vous ne pouvez/voulez pas jouer : **"Passer"**
5. Quand tous sauf un ont passé → le plateau est nettoyé
6. Le dernier joueur à avoir joué recommence

#### Interface de Jeu

**En haut** : Autres joueurs et leur nombre de cartes
- Un anneau doré indique le joueur actif

**Au centre** :
- Message "Tour de [Nom du joueur]" ou "C'est votre tour !"
- Dernières cartes jouées

**En bas** : Votre main
- **Cliquez** sur des cartes pour les sélectionner
- Seules les cartes de **même rang** peuvent être sélectionnées ensemble
- Les cartes sélectionnées remontent légèrement
- Bouton **"Jouer"** : Poser vos cartes sélectionnées
- Bouton **"Passer"** : Passer votre tour

#### Fin de Partie et Rangs

Les joueurs reçoivent un rang selon leur ordre de fin :

1. **👑 Président** - Premier à terminer
2. **🎩 Vice-Président** - Deuxième
3. **😐 Neutre** - Joueurs du milieu
4. **😕 Vice-Trou de cul** - Avant-dernier
5. **💩 Trou de cul** - Dernier (toutes ses cartes restent)

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

## 🔧 Scripts Disponibles

```bash
npm run dev        # Serveur de développement (localhost:3000)
npm run build      # Build de production
npm run start      # Démarrer en production
npm run lint       # Linter ESLint
npm test           # Lancer les tests (mode watch)
npm run test:run   # Lancer les tests une fois
npm run test:ui    # Interface UI pour les tests
```

## 🧪 Tests

Le projet utilise **Vitest** pour les tests unitaires.

**Couverture actuelle** :
- ✅ 46 tests unitaires (100% pass)
- Tests des règles du President
- Tests de la classe Card
- Tests de la classe Deck

```bash
# Lancer les tests en mode watch
npm test

# Lancer une seule fois
npm run test:run

# Ouvrir l'interface UI
npm run test:ui
```

## 🌐 Déploiement

L'application peut être déployée sur:
- **Vercel** (recommandé)
- **Railway**
- **Render**
- Tout hébergeur Node.js

## ⚠️ Notes Importantes

### Limitations Phase 1 (Actuelle)
- **Persistence** : Les parties sont en mémoire uniquement. Si le serveur redémarre, toutes les parties sont perdues.
- **Pas de base de données** : Aucune donnée n'est sauvegardée
- **Pas de reconnexion** : Si vous perdez la connexion, vous devez rafraîchir
- **Capacité** : 3-10 joueurs par partie (recommandé 4-6)
- **Pas d'authentification** : Les noms sont temporaires

### Navigateurs Supportés
- ✅ Chrome / Edge (version récente)
- ✅ Firefox (version récente)
- ✅ Safari (version récente)
- ❌ Internet Explorer (non supporté)

## 🐛 Dépannage

### Le jeu ne se connecte pas
1. Vérifiez que le serveur est bien lancé (`npm run dev`)
2. Ouvrez `http://localhost:3000` (pas https)
3. Vérifiez la console du navigateur (F12) pour les erreurs
4. Assurez-vous que le port 3000 n'est pas déjà utilisé

### Erreur "Game not found"
- Le code de partie est peut-être invalide
- Le créateur de la partie a peut-être quitté
- La partie a peut-être expiré
- Créez une nouvelle partie

### Les cartes ne s'affichent pas
1. Rafraîchissez la page (F5)
2. Vérifiez que vous êtes bien dans une partie active
3. Regardez les logs du serveur dans le terminal
4. Essayez de quitter et rejoindre la partie

### "Tour de undefined"
- Ce bug a été corrigé dans la version actuelle
- Si vous le voyez encore, rafraîchissez et redémarrez le serveur

### Les cartes noires sont difficiles à voir
- Ce problème a été corrigé (les trèfles ♣ et piques ♠ sont maintenant en noir foncé)
- Si vous utilisez une vieille version, faites `git pull`

## 🤝 Contribution

Ce projet est en développement actif. Consultez le [cahier des charges](CAHIER_DES_CHARGES.md) pour voir les prochaines étapes.

## 📄 Licence

ISC

---

**Version**: 1.0.0 (Phase 1)
**Dernière mise à jour**: 2025-10-02
**Status**: ✅ Phase 1 - 95% Complète (reste déploiement)

**Prochaines étapes** : Phase 2 - Texas Hold'em
