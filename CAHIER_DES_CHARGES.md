# Cahier des Charges - Application de Jeux de Cartes Multijoueurs

## 1. Présentation du Projet

### 1.1 Objectif
Développer une application web en Next.js avec TypeScript permettant de créer et héberger des jeux de cartes multijoueurs en temps réel, avec support initial pour le Texas Hold'em et le Trou de cul (Président).

### 1.2 Technologies Principales
- **Frontend/Backend**: Next.js 15+ (App Router)
- **Langage**: TypeScript
- **Temps réel**: WebSocket (Socket.io)
- **État global**: Zustand ou Redux Toolkit
- **UI**: Tailwind CSS + Shadcn/ui
- **Validation**: Zod

## 2. Développement par Phases

### **PHASE 1 - MVP Sans Persistance (4-6 semaines)**
> Objectif: Application fonctionnelle en mémoire avec sessions temporaires

#### Fonctionnalités
- Création de partie avec code unique
- Connexion des joueurs via code de partie
- Jeu complet de Trou de cul (règles de base)
- Interface de jeu responsive
- Gestion d'état en mémoire (Map/Set)
- Communication WebSocket

#### Livrables
- Application déployable sur Vercel
- Parties fonctionnelles (perdues au redémarrage serveur)
- Interface utilisateur complète
- Tests unitaires de base

---

### **PHASE 2 - Texas Hold'em + Améliorations UX (3-4 semaines)**
> Objectif: Ajouter le second jeu et améliorer l'expérience

#### Fonctionnalités
- Implémentation complète du Texas Hold'em
- Sélection du type de jeu à la création
- Animations de cartes
- Système de chat en jeu
- Gestion des déconnexions/reconnexions
- Timer pour les actions

#### Livrables
- Deux jeux complets et testés
- Animations fluides
- Expérience utilisateur améliorée

---

### **PHASE 3 - Persistance et Comptes Utilisateurs (4-5 semaines)**
> Objectif: Sauvegarder l'état et ajouter l'authentification

#### Fonctionnalités
- Base de données PostgreSQL (Supabase ou Neon)
- Authentification (NextAuth.js)
- Sauvegarde/reprise de parties
- Historique des parties
- Profils utilisateurs basiques
- Statistiques de jeu

#### Livrables
- Données persistantes
- Système d'authentification
- Dashboard utilisateur

---

### **PHASE 4 - Fonctionnalités Avancées (3-4 semaines)**
> Objectif: Enrichir l'expérience et la personnalisation

#### Fonctionnalités
- Règles personnalisables par partie
- Tournois/classements
- Replay de parties
- Thèmes personnalisables
- Système de spectateurs
- Notifications push

---

## 3. Fonctionnalités Détaillées

### 3.1 Gestion des Parties

#### Création de Partie
- Sélection du type de jeu (Texas Hold'em / Trou de cul)
- Paramètres configurables:
  - Nombre de joueurs (2-10)
  - Nom de la partie
  - Visibilité (publique/privée)
  - Options spécifiques au jeu
- Génération d'un code unique (6 caractères alphanumériques)
- L'hôte devient automatiquement le dealer

#### Rejoindre une Partie
- Saisie du code de partie
- Choix du pseudo (temporaire en Phase 1)
- Validation de disponibilité (places restantes)
- Attente dans le lobby avant démarrage

#### Lobby de Partie
- Liste des joueurs connectés
- Statut de chaque joueur (prêt/pas prêt)
- Chat pré-partie
- Configuration finale (réservée à l'hôte)
- Bouton "Démarrer" (quand tous prêts)

### 3.2 Jeu : Trou de cul (Président)

#### Règles de Base
- 4 à 8 joueurs recommandés
- Distribution de toutes les cartes du deck
- Premier tour: le joueur avec le 3 de trèfle commence
- Tours suivants: le Trou de cul commence
- Objectif: se débarrasser de toutes ses cartes

#### Mécaniques de Jeu
- Jouer des cartes de valeur égale ou supérieure
- Possibilité de jouer des paires, triples, quadruples
- Passer si impossible/non souhaité
- Le 2 est la carte la plus forte
- Le tour se réinitialise quand tous passent sauf un

#### Hiérarchie de Fin de Partie
1. **Président** (1er à finir)
2. **Vice-président** (2ème)
3. **Neutre(s)** (milieu)
4. **Vice-trou de cul** (avant-dernier)
5. **Trou de cul** (dernier)

#### Échange de Cartes (Phase 2+)
- Trou de cul donne ses 2 meilleures cartes au Président
- Vice-trou de cul donne 1 carte au Vice-président
- Échanges inverses avec cartes libres

#### Interface Spécifique
- Main de cartes triée automatiquement
- Sélection multiple de cartes (même valeur)
- Indicateur de tour actuel
- Affichage des dernières cartes jouées
- Badge de rang pour chaque joueur
- Bouton "Passer" toujours visible

### 3.3 Jeu : Texas Hold'em

#### Règles de Base
- 2 à 9 joueurs
- Chaque joueur reçoit 2 cartes privées
- 5 cartes communes (Flop, Turn, River)
- 4 tours d'enchères

#### Phases de Jeu
1. **Pre-flop**: Distribution + 1er tour d'enchères
2. **Flop**: 3 cartes communes + enchères
3. **Turn**: 4ème carte commune + enchères
4. **River**: 5ème carte commune + enchères finales
5. **Showdown**: Révélation et détermination du gagnant

#### Système d'Enchères
- **Blinds**: Petite blind (SB) et grosse blind (BB)
- **Actions possibles**:
  - Fold (se coucher)
  - Check (passer sans miser)
  - Call (suivre)
  - Raise (relancer)
  - All-in (tapis)
- Rotation des blinds dans le sens horaire
- Mise minimale = grosse blind

#### Configuration de Table
- Stack initial (jetons): 1000 à 10000
- Petite blind: 5 à 100
- Grosse blind: 10 à 200
- Mode tournoi vs cash game (Phase 3+)

#### Interface Spécifique
- Affichage du pot central
- Jetons de chaque joueur
- Cartes privées (masquées pour les autres)
- Cartes communes au centre
- Slider pour les mises
- Boutons d'action contextuels
- Timer de décision (30-60s)
- Indicateur du dealer (bouton D)
- Calcul automatique des combinaisons

#### Combinaisons (par ordre décroissant)
1. Quinte flush royale
2. Quinte flush
3. Carré
4. Full
5. Couleur
6. Quinte
7. Brelan
8. Double paire
9. Paire
10. Carte haute

### 3.4 Communication Temps Réel

#### Événements WebSocket
```typescript
// Connexion
- 'join-game': Rejoindre une partie
- 'leave-game': Quitter une partie
- 'player-ready': Joueur prêt

// Gameplay
- 'play-cards': Jouer des cartes
- 'pass-turn': Passer son tour
- 'bet': Effectuer une mise (poker)
- 'fold': Se coucher (poker)
- 'check': Checker (poker)

// État du jeu
- 'game-state': État complet du jeu
- 'turn-change': Changement de tour
- 'round-end': Fin de manche
- 'game-end': Fin de partie

// Communication
- 'chat-message': Message de chat
- 'player-disconnect': Déconnexion
- 'player-reconnect': Reconnexion
```

#### Gestion de la Latence
- Optimistic updates côté client
- Réconciliation avec état serveur
- Indicateur de latence
- File d'attente d'actions

## 4. Architecture Technique

### 4.1 Structure du Projet

```
card-maker/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Page d'accueil
│   │   ├── create/            # Création de partie
│   │   ├── join/              # Rejoindre partie
│   │   ├── game/[code]/       # Interface de jeu
│   │   └── api/               # API Routes
│   │       └── socket/        # WebSocket handler
│   │
│   ├── components/            # Composants React
│   │   ├── ui/               # Composants UI génériques
│   │   ├── game/             # Composants de jeu
│   │   │   ├── Card.tsx
│   │   │   ├── Deck.tsx
│   │   │   ├── PlayerHand.tsx
│   │   │   └── GameBoard.tsx
│   │   ├── lobby/            # Composants lobby
│   │   └── layout/           # Layout components
│   │
│   ├── lib/                  # Logique métier
│   │   ├── games/
│   │   │   ├── base/         # Classes/interfaces communes
│   │   │   │   ├── Card.ts
│   │   │   │   ├── Deck.ts
│   │   │   │   ├── Player.ts
│   │   │   │   └── Game.ts
│   │   │   ├── president/    # Logique Trou de cul
│   │   │   │   ├── PresidentGame.ts
│   │   │   │   ├── rules.ts
│   │   │   │   └── validators.ts
│   │   │   └── poker/        # Logique Texas Hold'em
│   │   │       ├── PokerGame.ts
│   │   │       ├── handEvaluator.ts
│   │   │       ├── betting.ts
│   │   │       └── rules.ts
│   │   │
│   │   ├── socket/           # Gestion WebSocket
│   │   │   ├── server.ts
│   │   │   └── events.ts
│   │   │
│   │   └── store/            # État global (Zustand)
│   │       ├── gameStore.ts
│   │       └── playerStore.ts
│   │
│   ├── types/                # Types TypeScript
│   │   ├── game.ts
│   │   ├── player.ts
│   │   └── socket.ts
│   │
│   ├── hooks/                # Custom hooks
│   │   ├── useGame.ts
│   │   ├── useSocket.ts
│   │   └── usePlayer.ts
│   │
│   └── utils/                # Utilitaires
│       ├── validation.ts
│       ├── gameHelpers.ts
│       └── constants.ts
│
├── public/                   # Assets statiques
│   └── cards/               # Images de cartes
│
├── prisma/                  # Schema DB (Phase 3)
│   └── schema.prisma
│
└── tests/                   # Tests
    ├── unit/
    └── integration/
```

### 4.2 Stack Technique par Phase

#### Phase 1 (MVP)
```typescript
// Gestion d'état en mémoire
const games = new Map<string, GameInstance>();
const players = new Map<string, PlayerConnection>();

// WebSocket simple avec Socket.io
// État géré côté serveur uniquement
// Pas de base de données
```

#### Phase 3 (Persistance)
```typescript
// Base de données: PostgreSQL
// ORM: Prisma
// Auth: NextAuth.js
// Cache: Redis (optionnel)
```

### 4.3 Modèles de Données (Phase 3+)

#### Schema Prisma
```prisma
model User {
  id            String    @id @default(cuid())
  email         String?   @unique
  username      String    @unique
  createdAt     DateTime  @default(now())
  games         GamePlayer[]
  hostedGames   Game[]    @relation("GameHost")
}

model Game {
  id            String    @id @default(cuid())
  code          String    @unique
  type          GameType
  status        GameStatus
  hostId        String
  host          User      @relation("GameHost", fields: [hostId], references: [id])
  players       GamePlayer[]
  config        Json      // Configuration spécifique
  state         Json      // État actuel du jeu
  createdAt     DateTime  @default(now())
  startedAt     DateTime?
  endedAt       DateTime?
}

model GamePlayer {
  id            String    @id @default(cuid())
  gameId        String
  game          Game      @relation(fields: [gameId], references: [id])
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  position      Int
  isReady       Boolean   @default(false)
  joinedAt      DateTime  @default(now())
  leftAt        DateTime?

  @@unique([gameId, userId])
}

enum GameType {
  PRESIDENT
  TEXAS_HOLDEM
}

enum GameStatus {
  LOBBY
  IN_PROGRESS
  FINISHED
  ABANDONED
}
```

### 4.4 Sécurité

#### Phase 1
- Validation des entrées avec Zod
- Rate limiting sur les endpoints
- CORS configuré strictement
- Sanitisation des noms/messages
- Codes de partie non prédictibles

#### Phase 3+
- Authentification JWT
- Protection CSRF
- Encryption des données sensibles
- Audit logs
- Protection contre la triche:
  - Validation serveur de toutes les actions
  - Vérification des tours
  - Timeout sur les actions
  - Détection de patterns suspects

### 4.5 Performance

#### Optimisations
- Server-side rendering (SSR) pour SEO
- Client-side navigation (SPA après chargement)
- Code splitting par route
- Lazy loading des composants lourds
- Memoization des composants React
- WebSocket connection pooling
- Compression des messages WebSocket

#### Scalabilité (Phase 4+)
- Déploiement multi-régions
- Load balancing
- Redis pour état partagé entre instances
- Message queue pour événements asynchrones

## 5. Interface Utilisateur

### 5.1 Pages Principales

#### 1. Page d'Accueil
```
┌─────────────────────────────────────┐
│  🎴 CARD GAME MAKER                 │
│                                     │
│  ┌─────────────┐  ┌──────────────┐ │
│  │ Créer une   │  │ Rejoindre    │ │
│  │ partie      │  │ une partie   │ │
│  └─────────────┘  └──────────────┘ │
│                                     │
│  Jeux disponibles:                  │
│  • Texas Hold'em                    │
│  • Trou de cul (Président)          │
│                                     │
│  [Se connecter] (Phase 3+)          │
└─────────────────────────────────────┘
```

#### 2. Création de Partie
```
┌─────────────────────────────────────┐
│  Nouvelle Partie                    │
│                                     │
│  Type de jeu:                       │
│  ( ) Texas Hold'em                  │
│  (•) Trou de cul                    │
│                                     │
│  Nom de la partie:                  │
│  [_____________________]            │
│                                     │
│  Nombre de joueurs: [4] ▼           │
│                                     │
│  Options avancées ▼                 │
│                                     │
│  [Créer la partie]                  │
└─────────────────────────────────────┘
```

#### 3. Lobby de Partie
```
┌─────────────────────────────────────────┐
│  Partie: #ABC123        [Copier code]   │
├─────────────────────────────────────────┤
│  Joueurs (3/6):                         │
│                                         │
│  ✓ Alice (Hôte)          [Prêt]        │
│  ✓ Bob                   [Prêt]        │
│  ⏳ Charlie              [Pas prêt]     │
│                                         │
│  En attente de joueurs...               │
│                                         │
├─────────────────────────────────────────┤
│  Chat:                                  │
│  Alice: Prêts?                          │
│  Bob: Oui!                              │
│  [Message________________] [Envoyer]    │
├─────────────────────────────────────────┤
│  [Je suis prêt]    [Quitter]           │
│  [Démarrer la partie] (hôte only)      │
└─────────────────────────────────────────┘
```

#### 4. Interface de Jeu - Trou de cul
```
┌──────────────────────────────────────────────┐
│  Partie: #ABC123          Trou de cul        │
│  Tour actuel: Alice                          │
├──────────────────────────────────────────────┤
│                                              │
│     [Alice - Président] 👑                   │
│         5 cartes                             │
│                                              │
│  [Bob - Neutre]              [Charlie - VT]  │
│     7 cartes                    4 cartes     │
│                                              │
│         Dernières cartes jouées:             │
│         ┌───┐ ┌───┐                         │
│         │ 9 │ │ 9 │  (Bob)                   │
│         └───┘ └───┘                         │
│                                              │
│  [Vous - Dave]                               │
│     Trou de cul 💩                           │
│                                              │
│  Votre main:                                 │
│  ┌───┐┌───┐┌───┐┌───┐┌───┐┌───┐           │
│  │ 3 ││ 5 ││ 7 ││ J ││ J ││ K │           │
│  │ ♠ ││ ♥ ││ ♦ ││ ♣ ││ ♥ ││ ♠ │           │
│  └───┘└───┘└───┘└───┘└───┘└───┘           │
│                                              │
│  [Jouer les cartes sélectionnées] [Passer]  │
└──────────────────────────────────────────────┘
```

#### 5. Interface de Jeu - Texas Hold'em
```
┌──────────────────────────────────────────────┐
│  Partie: #XYZ789          Texas Hold'em      │
│  Pot: $450               Blind: 10/20        │
├──────────────────────────────────────────────┤
│                                              │
│       [Alice - $980] D                       │
│       ┌───┐┌───┐                            │
│       │ ? ││ ? │  [Fold]                     │
│       └───┘└───┘                            │
│                                              │
│  [Bob - $1,050]                 [You - $970]│
│  ┌───┐┌───┐              Pot: $150         │
│  │ ? ││ ? │                                 │
│  └───┘└───┘                                 │
│      [All-in $200]                          │
│                                              │
│         Cartes communes (Flop):              │
│         ┌───┐ ┌───┐ ┌───┐                  │
│         │ A │ │ K │ │ 7 │                  │
│         │ ♠ │ │ ♥ │ │ ♦ │                  │
│         └───┘ └───┘ └───┘                  │
│                                              │
│  Vos cartes:                                 │
│  ┌───┐ ┌───┐                                │
│  │ A │ │ Q │  Paire d'As                    │
│  │ ♥ │ │ ♠ │                                │
│  └───┘ └───┘                                │
│                                              │
│  Mise: [$___________] (Min: $20)            │
│  [Fold] [Check] [Call $20] [Raise]          │
│                                              │
│  ⏱ 28s restantes                            │
└──────────────────────────────────────────────┘
```

### 5.2 Design System

#### Palette de Couleurs
```css
/* Thème principal */
--background: #0f172a      /* Bleu nuit */
--surface: #1e293b         /* Surface cards */
--primary: #3b82f6         /* Bleu action */
--secondary: #8b5cf6       /* Violet */
--accent: #10b981          /* Vert succès */
--danger: #ef4444          /* Rouge */
--warning: #f59e0b         /* Orange */

/* Cartes */
--card-red: #dc2626        /* Coeur/Carreau */
--card-black: #1f2937      /* Pique/Trèfle */
--card-back: #4b5563       /* Dos de carte */

/* Texte */
--text-primary: #f1f5f9
--text-secondary: #94a3b8
--text-muted: #64748b
```

#### Composants UI Réutilisables
- **Button**: Primaire, secondaire, danger, ghost
- **Card**: Container avec shadow et border-radius
- **Badge**: Pour statuts (prêt, en attente, etc.)
- **Avatar**: Photo de profil ou initiales
- **Toast**: Notifications non-intrusives
- **Modal**: Dialogs et confirmations
- **Tooltip**: Info-bulles au survol
- **Slider**: Pour les mises (poker)

#### Responsive Design
- **Mobile** (< 768px):
  - Layout vertical
  - Cartes plus petites
  - Boutons pleine largeur
  - Chat en modal

- **Tablette** (768px - 1024px):
  - Layout adaptatif
  - Sidebar pour chat

- **Desktop** (> 1024px):
  - Layout optimal
  - Toutes fonctionnalités visibles
  - Animations complètes

### 5.3 Animations et Feedback

#### Animations Principales
- **Distribution de cartes**: Animation de deal (200ms par carte)
- **Jeu de carte**: Slide vers le centre (300ms)
- **Tour de joueur**: Pulsation douce sur le joueur actif
- **Gain de partie**: Confetti et highlight
- **Jetons au pot**: Animation de déplacement

#### Feedback Utilisateur
- Loading states sur toutes les actions
- Confirmation visuelle des actions
- Sons optionnels (clic, cartes, jetons)
- Vibration tactile sur mobile (optionnel)
- Messages d'erreur clairs et contextuels

## 6. Tests et Qualité

### 6.1 Stratégie de Tests

#### Tests Unitaires (Jest + Testing Library)
- Logique de jeu (rules, validators)
- Utilitaires et helpers
- Composants UI isolés
- Coverage minimum: 80%

#### Tests d'Intégration
- Flux complets de partie
- WebSocket communication
- API endpoints

#### Tests E2E (Playwright - Phase 3+)
- Scénario complet de partie
- Multi-joueurs simulés
- Tests de déconnexion/reconnexion

### 6.2 CI/CD

```yaml
# GitHub Actions workflow
- Lint (ESLint + Prettier)
- Type check (TypeScript)
- Tests unitaires
- Tests d'intégration
- Build production
- Déploiement Vercel (auto sur main)
```

## 7. Déploiement

### Phase 1 & 2
- **Hosting**: Vercel (gratuit)
- **WebSocket**: Vercel serverless avec upgrade HTTP
- **DNS**: Domaine personnalisé (optionnel)

### Phase 3+
- **Base de données**: Supabase ou Neon (PostgreSQL)
- **Auth**: NextAuth.js avec providers
- **Storage**: Vercel Blob (avatars, etc.)
- **CDN**: Vercel Edge Network

### Phase 4+ (Scalabilité)
- **Redis**: Upstash pour cache/sessions
- **Monitoring**: Sentry pour erreurs
- **Analytics**: Vercel Analytics
- **Logs**: Logtail ou Datadog

## 8. Contraintes et Règles Métier

### 8.1 Contraintes Trou de cul

#### Règles Strictes
- Minimum 3 joueurs, maximum 10
- Distribution égale (cartes restantes défaussées)
- 3 de trèfle obligatoire au premier tour si possédé
- Impossible de jouer une carte inférieure
- Le dernier à jouer commence le tour suivant
- Échanges de cartes obligatoires en début de manche

#### Variantes Configurables (Phase 2+)
- Règle du 10: réinitialise le plateau
- Règle du 7: inverse l'ordre de jeu
- Joker wild card
- Nombre de cartes à échanger
- Saut de tour après quadruple

### 8.2 Contraintes Texas Hold'em

#### Règles Strictes
- Minimum 2 joueurs, maximum 9
- Blinds obligatoires (SB et BB)
- Ordre des enchères respecté (sens horaire)
- All-in possible à tout moment
- Validation des combinaisons par algorithme
- Pot side-pots en cas de all-in multiples

#### Variantes Configurables (Phase 2+)
- Limite de mise (No-limit, Pot-limit, Fixed)
- Augmentation automatique des blinds (tournoi)
- Re-buy autorisé ou non
- Temps de réflexion par action
- Mode cash game vs tournoi

### 8.3 Anti-Triche

#### Mesures de Sécurité
- Cartes mélangées côté serveur uniquement
- Validation serveur de chaque action
- Impossible de voir les cartes des autres
- Détection de patterns de communication externe (Phase 3+)
- Logs d'audit de toutes les actions
- Timeout forcé sur inactivité
- Vérification de l'ordre des tours

## 9. Livrables par Phase

### Phase 1 (MVP)
- [ ] Application Next.js + TypeScript configurée
- [ ] WebSocket fonctionnel
- [ ] Trou de cul complet et jouable
- [ ] Interface responsive
- [ ] Tests unitaires de base
- [ ] Déploiement Vercel
- [ ] Documentation utilisateur

### Phase 2 (Texas Hold'em)
- [ ] Texas Hold'em complet
- [ ] Sélection de jeu
- [ ] Système de chat
- [ ] Animations de cartes
- [ ] Gestion déconnexions
- [ ] Tests E2E

### Phase 3 (Persistance)
- [ ] Base de données Prisma
- [ ] Authentification NextAuth
- [ ] Sauvegarde de parties
- [ ] Profils utilisateurs
- [ ] Historique et statistiques
- [ ] Migration des données

### Phase 4 (Avancé)
- [ ] Règles personnalisables
- [ ] Système de tournois
- [ ] Classements globaux
- [ ] Replay de parties
- [ ] Thèmes personnalisables
- [ ] Mode spectateur

## 10. Estimation des Ressources

### Équipe Recommandée
- **Phase 1**: 1 développeur full-stack (4-6 semaines)
- **Phase 2**: 1 développeur + 1 designer UI/UX (3-4 semaines)
- **Phase 3**: 1 développeur backend + 1 frontend (4-5 semaines)
- **Phase 4**: Équipe complète selon features

### Budget Estimé (Hébergement)

#### Phase 1-2
- Vercel: Gratuit (Hobby plan)
- Domaine: ~15$/an (optionnel)
- **Total**: ~0-15$/an

#### Phase 3+
- Vercel Pro: 20$/mois
- Supabase/Neon: 0-25$/mois
- Upstash Redis: 0-10$/mois
- **Total**: ~20-55$/mois

## 11. Risques et Mitigation

### Risques Techniques
| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Problèmes de latence WebSocket | Élevé | Moyen | Tests de charge, optimisation messages |
| Synchronisation état multi-joueurs | Élevé | Élevé | Architecture event-sourcing, tests rigoureux |
| Scalabilité avec nombreux utilisateurs | Moyen | Faible | Architecture préparée dès Phase 1 |
| Bugs de règles de jeu | Élevé | Moyen | Tests exhaustifs, validation communauté |

### Risques Fonctionnels
| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Abandons de partie | Faible | Élevé | Gestion IA/bots (Phase 4), remplacement joueurs |
| Triche entre joueurs | Moyen | Moyen | Validation serveur stricte, détection patterns |
| Complexité des règles | Moyen | Faible | Tutorial intégré, mode pratique |

## 12. Roadmap Long Terme (Post Phase 4)

### Fonctionnalités Futures
- Autres jeux de cartes (Uno, Belote, Tarot, etc.)
- Mode tournoi organisé avec prizes
- Application mobile native (React Native)
- Système de ranking ELO
- Parties privées avec mot de passe
- Intégration streaming (Twitch/YouTube)
- API publique pour développeurs tiers
- Système d'achievements/trophées
- Market de thèmes/avatars personnalisés
- IA pour jouer contre des bots

### Monétisation Potentielle
- Freemium: Fonctionnalités de base gratuites
- Premium: Statistiques avancées, thèmes exclusifs
- Publicité non-intrusive
- Vente de cosmétiques
- Tournois payants avec cagnottes

## 13. Suivi d'Avancement du Projet

### État Global
**Phase actuelle**: Phase 1 - MVP Sans Persistance ✅ **100% Complétée**
**Prochaine phase**: Phase 2 - Texas Hold'em + UX
**Démarrage**: 2025-10-01
**Progression globale**: ■■■■⬜⬜⬜⬜⬜⬜ 30%

---

### ✅ Phase 1 - MVP Sans Persistance (100%)
**Statut**: ✅ **COMPLÈTE**
**Début**: 2025-10-01
**Fin**: 2025-10-02
**Durée réelle**: 2 jours

**🎉 Phase 1 Terminée avec Succès !**

#### Tâches Principales
- [x] **Setup Initial** (100%)
  - [x] Initialisation Next.js + TypeScript
  - [x] Configuration Tailwind CSS
  - [x] Installation Socket.io
  - [x] Structure de base du projet

- [x] **Architecture de Base** (100%)
  - [x] Types TypeScript (Card, Player, Game)
  - [x] Classes de base (Deck, Player, Game)
  - [x] WebSocket server setup
  - [x] Store Zustand

- [x] **Système de Parties** (100%)
  - [x] Création de partie avec code unique
  - [x] Système de lobby
  - [x] Connexion des joueurs
  - [x] Gestion d'état en mémoire

- [x] **Jeu: Trou de cul** (100%)
  - [x] Logique de jeu complète
  - [x] Distribution de cartes
  - [x] Validation des coups
  - [x] Système de tours
  - [x] Hiérarchie de fin de partie

- [x] **Interface Utilisateur** (100%)
  - [x] Page d'accueil
  - [x] Création/Rejoindre partie
  - [x] Lobby de partie
  - [x] Interface de jeu
  - [x] Composants de cartes

- [x] **Tests & Déploiement** (100%)
  - [x] Tests unitaires de base (46 tests - 100% pass)
    - [x] Tests des règles du President
    - [x] Tests de la classe Card
    - [x] Tests de la classe Deck
  - [x] Configuration Vitest
  - [x] Documentation utilisateur complète
    - [x] README.md avec guide utilisateur détaillé
    - [x] CONTRIBUTING.md pour développeurs
    - [x] Règles du jeu expliquées
    - [x] Guide de dépannage
  - [x] Préparation déploiement
    - [x] Build production réussi ✅
    - [x] Configuration Railway/Render/Vercel
    - [x] Documentation déploiement (DEPLOYMENT.md)
    - [x] Variables d'environnement configurées
    - [x] Scripts package.json optimisés

#### Blocages & Risques Identifiés
_Aucun blocage majeur_

#### Notes de Développement
- **2025-10-01**: Début Phase 1 - Initialisation du projet
- **2025-10-01**: Implémentation complète de la logique de jeu
- **2025-10-01**: WebSocket et système de parties fonctionnels
- **2025-10-01**: Interface utilisateur complète
- **2025-10-02**: Corrections bugs multijoueurs (socket persistence, currentPlayerId, getValue)
- **2025-10-02**: Tests unitaires ajoutés - 46 tests créés (100% pass)
- **2025-10-02**: Configuration Vitest complète
- **2025-10-02**: Documentation complète (README.md + CONTRIBUTING.md)
- **2025-10-02**: Préparation déploiement - Build production réussi
- **2025-10-02**: DEPLOYMENT.md créé avec guides Railway/Render/Vercel

---

### ⬜ Phase 2 - Texas Hold'em + UX (0%)
**Statut**: ⏳ En attente
**Début prévu**: Après Phase 1
**Durée estimée**: 3-4 semaines

#### Checklist
- [ ] Implémentation Texas Hold'em
- [ ] Sélection du type de jeu
- [ ] Animations de cartes
- [ ] Système de chat
- [ ] Gestion déconnexions/reconnexions
- [ ] Timer pour actions
- [ ] Tests E2E

---

### ⬜ Phase 3 - Persistance & Auth (0%)
**Statut**: ⏳ En attente
**Début prévu**: Après Phase 2
**Durée estimée**: 4-5 semaines

#### Checklist
- [ ] Setup PostgreSQL (Supabase/Neon)
- [ ] Schema Prisma
- [ ] NextAuth.js configuration
- [ ] Sauvegarde/reprise parties
- [ ] Profils utilisateurs
- [ ] Historique & statistiques
- [ ] Migration données

---

### ⬜ Phase 4 - Fonctionnalités Avancées (0%)
**Statut**: ⏳ En attente
**Début prévu**: Après Phase 3
**Durée estimée**: 3-4 semaines

#### Checklist
- [ ] Règles personnalisables
- [ ] Système de tournois
- [ ] Classements
- [ ] Replay de parties
- [ ] Thèmes personnalisables
- [ ] Mode spectateur

---

### Métriques de Qualité

#### Code Quality
- **Tests Coverage**: 0% (Objectif: 80%)
- **TypeScript Strict**: ✅ Activé
- **ESLint**: ⏳ À configurer
- **Prettier**: ⏳ À configurer

#### Performance
- **Lighthouse Score**: N/A
- **Core Web Vitals**: N/A
- **WebSocket Latency**: N/A

#### Déploiement
- **Environment Staging**: ⏳ À configurer
- **Environment Production**: ⏳ À configurer
- **CI/CD Pipeline**: ⏳ À configurer

---

## 14. Annexes

### 14.1 Ressources Utiles

#### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Socket.io Documentation](https://socket.io/docs/v4/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Shadcn/ui Components](https://ui.shadcn.com/)

#### Algorithmes
- Évaluation de mains de poker: [Poker Hand Evaluator](https://github.com/chenosaurus/poker-evaluator)
- Algorithme de mélange: Fisher-Yates shuffle
- Calcul de cotes: Formule EV (Expected Value)

### 14.2 Glossaire

**WebSocket**: Protocole de communication bidirectionnelle temps réel

**Server-Side Rendering (SSR)**: Rendu HTML côté serveur

**Optimistic Update**: Mise à jour UI avant confirmation serveur

**Event Sourcing**: Architecture basée sur événements

**ELO Rating**: Système de classement par compétence

**Blinds**: Mises forcées au poker

**All-in**: Miser tous ses jetons

**Showdown**: Révélation finale des cartes

---

## Validation et Approbation

**Version**: 1.0
**Date**: 2025-10-01
**Auteur**: Claude
**Statut**: ✅ Prêt pour développement Phase 1

---

**Prochaine étape**: Initialisation du projet Next.js et setup de l'architecture de base.
