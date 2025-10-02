# 🛠️ Guide du Développeur

Documentation technique pour les développeurs contribuant au projet Card Maker.

## 📋 Table des Matières

- [Architecture](#architecture)
- [Structure du Code](#structure-du-code)
- [Conventions de Code](#conventions-de-code)
- [Ajouter un Nouveau Jeu](#ajouter-un-nouveau-jeu)
- [Tests](#tests)
- [WebSocket Events](#websocket-events)
- [Debugging](#debugging)

## 🏗️ Architecture

### Stack Technique

- **Frontend**: Next.js 15 (App Router) + React 19
- **Backend**: Node.js custom server avec Next.js
- **WebSocket**: Socket.io (client + serveur)
- **État**: Zustand pour l'état global client
- **Styling**: Tailwind CSS 4
- **Tests**: Vitest
- **TypeScript**: Mode strict activé

### Pattern Architecture

Le projet utilise une architecture **orientée objet** pour la logique de jeu :

```
Game (base class)
  ├── PresidentGame
  └── TexasHoldemGame (à venir)

Player (base class)
Card (base class)
Deck (base class)
```

### Communication Client-Serveur

```
Client                    Server
  │                         │
  ├──► create-game ────────►│
  │◄──── game-created ──────┤
  │                         │
  ├──► join-game ──────────►│
  │◄──── game-joined ───────┤
  │◄──── player-joined ─────┤ (broadcast)
  │                         │
  ├──► start-game ─────────►│
  │◄──── game-started ──────┤ (broadcast)
  │                         │
  ├──► play-cards ─────────►│
  │◄──── game-state ────────┤ (tous)
  │◄──── turn-change ───────┤ (broadcast)
```

## 📁 Structure du Code

### Dossiers Principaux

```
lib/
├── games/              # Logique métier des jeux
│   ├── base/          # Classes de base réutilisables
│   │   ├── Card.ts    # Carte avec méthodes de comparaison
│   │   ├── Deck.ts    # Paquet de cartes
│   │   ├── Player.ts  # Joueur avec main de cartes
│   │   └── Game.ts    # Classe abstraite de jeu
│   └── president/     # Implémentation Trou de cul
│       ├── PresidentGame.ts  # Logique du jeu
│       ├── rules.ts          # Règles et validations
│       └── validators.ts     # Validateurs
│
├── socket/            # WebSocket serveur
│   ├── server.ts      # Initialisation Socket.io + handlers
│   └── GameManager.ts # Gestion des parties en mémoire
│
└── store/             # État Zustand
    └── gameStore.ts   # Store global client
```

### Composants React

```
components/
├── providers/
│   └── SocketProvider.tsx  # Context pour socket unique
└── game/
    └── PlayingCard.tsx     # Composant carte

app/                        # Pages Next.js
├── page.tsx               # Accueil
├── create/page.tsx        # Créer partie
├── join/page.tsx          # Rejoindre
├── lobby/page.tsx         # Lobby
└── game/page.tsx          # Jeu
```

## 📝 Conventions de Code

### TypeScript

- **Mode strict** activé
- Toujours typer les paramètres et retours de fonction
- Utiliser les interfaces pour les objets complexes
- Utiliser les enums pour les valeurs fixes

```typescript
// ✅ Bon
interface GameConfig {
  type: GameType;
  maxPlayers: number;
}

function createGame(config: GameConfig): Game {
  return new PresidentGame(config);
}

// ❌ Mauvais
function createGame(config: any) {
  return new PresidentGame(config);
}
```

### Naming

- **Classes** : PascalCase (`PresidentGame`, `Card`)
- **Fonctions/variables** : camelCase (`playCards`, `currentPlayer`)
- **Constantes** : UPPER_SNAKE_CASE (`SOCKET_EVENTS`, `MAX_PLAYERS`)
- **Composants React** : PascalCase (`PlayingCard`, `GameBoard`)
- **Fichiers** : kebab-case pour utils, PascalCase pour composants

### Organisation des Imports

```typescript
// 1. Imports externes
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// 2. Imports types
import type { Card, GameState } from '@/types/game';

// 3. Imports internes
import { useSocket } from '@/hooks/useSocket';
import { SOCKET_EVENTS } from '@/utils/constants';
```

## 🎮 Ajouter un Nouveau Jeu

### 1. Créer la Structure

```bash
lib/games/
└── my-game/
    ├── MyGame.ts        # Classe principale
    ├── rules.ts         # Règles du jeu
    └── validators.ts    # Validations
```

### 2. Étendre la Classe Game

```typescript
// lib/games/my-game/MyGame.ts
import { Game } from '../base/Game';
import { GameConfig, GameStatus } from '@/types/game';

export class MyGame extends Game {
  constructor(id: string, code: string, maxPlayers: number) {
    const config: GameConfig = {
      type: GameType.MY_GAME,
      maxPlayers,
      minPlayers: 2,
      name: "Mon Jeu",
    };
    super(id, code, config);
  }

  start(): void {
    // Logique de démarrage
    this.state.status = GameStatus.IN_PROGRESS;
  }

  playCards(playerId: string, cards: Card[]): void {
    // Logique de jeu
  }

  passTurn(playerId: string): void {
    // Passer le tour
  }
}
```

### 3. Ajouter au GameManager

```typescript
// lib/socket/GameManager.ts
createGame(playerName: string, maxPlayers: number, gameType: GameType) {
  switch(gameType) {
    case GameType.PRESIDENT:
      return new PresidentGame(id, code, maxPlayers);
    case GameType.MY_GAME:
      return new MyGame(id, code, maxPlayers);
  }
}
```

### 4. Mettre à Jour les Types

```typescript
// types/game.ts
export enum GameType {
  PRESIDENT = "president",
  MY_GAME = "my_game",  // Ajouter ici
}
```

## 🧪 Tests

### Structure des Tests

```
tests/
├── unit/                    # Tests unitaires
│   ├── card.test.ts
│   ├── deck.test.ts
│   └── my-game-rules.test.ts
└── integration/             # Tests d'intégration
    └── websocket.test.ts
```

### Écrire un Test

```typescript
import { describe, it, expect } from 'vitest';
import { Card } from '@/lib/games/base/Card';
import { Rank, Suit } from '@/types/game';

describe('Card', () => {
  it('should create a card with correct properties', () => {
    const card = new Card(Suit.HEARTS, Rank.ACE);
    expect(card.suit).toBe(Suit.HEARTS);
    expect(card.rank).toBe(Rank.ACE);
  });
});
```

### Lancer les Tests

```bash
npm test           # Mode watch
npm run test:run   # Une fois
npm run test:ui    # Interface graphique
```

## 📡 WebSocket Events

### Events Client → Serveur

| Event | Payload | Description |
|-------|---------|-------------|
| `create-game` | `{ playerName, gameConfig }` | Créer une partie |
| `join-game` | `{ gameCode, playerName }` | Rejoindre |
| `player-ready` | - | Toggle statut prêt |
| `start-game` | - | Démarrer (hôte) |
| `play-cards` | `{ cards }` | Jouer des cartes |
| `pass-turn` | - | Passer |
| `leave-game` | - | Quitter |

### Events Serveur → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `game-created` | `{ gameCode, playerId }` | Partie créée |
| `game-joined` | `{ playerId, gameState, players }` | Rejoint avec succès |
| `player-joined` | `{ player }` | Nouveau joueur (broadcast) |
| `player-left` | `{ playerId }` | Joueur parti |
| `player-ready-update` | `{ playerId, isReady }` | Statut prêt changé |
| `game-started` | `{ gameState, players }` | Partie démarrée |
| `game-state` | `{ gameState, players }` | État mis à jour |
| `turn-change` | `{ currentPlayerId }` | Changement de tour |
| `cards-played` | `{ playerId, cards }` | Cartes jouées |
| `game-end` | `{ rankings }` | Fin de partie |
| `error` | `{ message }` | Erreur |

### Ajouter un Nouvel Event

1. **Définir dans types/socket.ts**

```typescript
export interface ClientToServerEvents {
  "my-event": (data: { payload: string }) => void;
}

export interface ServerToClientEvents {
  "my-response": (data: { result: string }) => void;
}
```

2. **Ajouter dans utils/constants.ts**

```typescript
export const SOCKET_EVENTS = {
  MY_EVENT: "my-event",
  MY_RESPONSE: "my-response",
} as const;
```

3. **Handler côté serveur**

```typescript
// lib/socket/server.ts
socket.on(SOCKET_EVENTS.MY_EVENT, ({ payload }) => {
  console.log('Received:', payload);
  socket.emit(SOCKET_EVENTS.MY_RESPONSE, { result: 'ok' });
});
```

4. **Utiliser côté client**

```typescript
// hooks/useGame.ts
socket.on(SOCKET_EVENTS.MY_RESPONSE, ({ result }) => {
  console.log('Response:', result);
});
```

## 🐛 Debugging

### Logs Serveur

Le serveur utilise des emojis pour faciliter le debugging :

- 🎮 Création de partie
- 👤 Joueur rejoint
- 🚀 Partie démarrée
- 🎴 Cartes jouées
- ❌ Erreur

### Console Browser

Ouvrez DevTools (F12) et regardez :
- **Console** : Logs des events Socket.io
- **Network** : WebSocket connection (WS tab)
- **Application** : État Zustand (avec Redux DevTools)

### Problèmes Courants

**Socket ne se connecte pas**
```typescript
// Vérifier dans SocketProvider.tsx
console.log('Socket connected:', socket.connected);
```

**État non synchronisé**
```typescript
// Vérifier le store
import { useGameStore } from '@/lib/store/gameStore';
console.log(useGameStore.getState());
```

**Cartes perdent leurs méthodes**
```typescript
// Toujours recréer des instances côté serveur
const cardInstances = cards.map(c => new Card(c.suit, c.rank));
```

## 🔐 Sécurité

### Validations

- ✅ Valider TOUS les inputs côté serveur
- ✅ Sanitiser les noms de joueurs
- ✅ Vérifier les permissions (ex: seul l'hôte peut start)
- ✅ Valider les coups de jeu (pas de triche)

```typescript
// ✅ Bon
const sanitizedName = sanitizePlayerName(playerName);
if (!game.isValidPlay(playerId, cards)) {
  throw new Error("Invalid play");
}

// ❌ Mauvais - faire confiance au client
game.playCards(playerId, cards); // Sans validation
```

## 📦 Build & Deploy

### Build Local

```bash
npm run build
npm run start
```

### Variables d'Environnement

```env
# .env.local
NODE_ENV=development
PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Déploiement Vercel

Le projet est configuré pour Vercel avec :
- WebSocket supporté via custom server
- Configuration dans `vercel.json` (à créer)

## 🤝 Contribution

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/ma-feature`)
3. Committez (`git commit -m 'Add: ma feature'`)
4. Pushez (`git push origin feature/ma-feature`)
5. Ouvrez une Pull Request

### Format des Commits

- `Add:` Nouvelle fonctionnalité
- `Fix:` Correction de bug
- `Update:` Amélioration
- `Refactor:` Refactoring
- `Test:` Ajout de tests
- `Docs:` Documentation

---

**Questions ?** Consultez le [cahier des charges](CAHIER_DES_CHARGES.md) ou ouvrez une issue.
