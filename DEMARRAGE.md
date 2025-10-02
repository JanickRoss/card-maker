# 🚀 Guide de Démarrage - Card Game Maker

## ✅ Phase 1 Complète !

Votre application de jeux de cartes multijoueurs est prête à être testée !

## 📋 Prérequis

- Node.js 18+ installé
- Port 3000 disponible (ou utiliser un autre port)

## 🔧 Installation

```bash
npm install
```

## 🎮 Lancement

### Développement

```bash
npm run dev
```

L'application sera disponible sur **http://localhost:3000**

> **Note**: Si le port 3000 est occupé, utilisez :
> ```bash
> PORT=3005 npm run dev
> ```

### Production

```bash
npm run build
npm start
```

## 🧪 Tester l'Application

### Scénario de Test Multijoueur

1. **Ouvrez 3 onglets** dans votre navigateur

2. **Onglet 1 - Créer une partie** :
   - Allez sur http://localhost:3000
   - Cliquez sur "Créer une partie"
   - Entrez votre nom (ex: "Alice")
   - Choisissez 6 joueurs max
   - Cliquez "Créer la partie"
   - **Notez le code** affiché (ex: ABC123)

3. **Onglet 2 - Rejoindre** :
   - Allez sur http://localhost:3000
   - Cliquez sur "Rejoindre une partie"
   - Entrez le code (ABC123)
   - Entrez votre nom (ex: "Bob")
   - Cliquez "Rejoindre"

4. **Onglet 3 - Rejoindre** :
   - Répétez pour un 3ème joueur (ex: "Charlie")

5. **Dans le Lobby** :
   - Les joueurs 2 et 3 : Cliquez "Je suis prêt"
   - Joueur 1 (hôte) : Cliquez "Démarrer la partie"

6. **Jouer** :
   - Le joueur avec le 3♣ commence
   - Sélectionnez des cartes de même valeur
   - Cliquez "Jouer" ou "Passer"
   - Le premier à finir devient Président 👑
   - Le dernier devient Trou de cul 💩

## 🎯 Fonctionnalités Disponibles

### ✅ Implémenté
- Création de partie avec code unique
- Multijoueur temps réel (WebSocket)
- Jeu complet "Trou de cul"
- Lobby avec statut des joueurs
- Interface de jeu interactive
- Résultats avec classement

### 🚧 À Venir (Phase 2)
- Texas Hold'em
- Animations de cartes
- Système de chat
- Reconnexion automatique

## 📂 Structure du Projet

```
card-maker/
├── app/                    # Pages Next.js
│   ├── page.tsx           # Accueil
│   ├── create/            # Créer partie
│   ├── join/              # Rejoindre
│   ├── lobby/             # Salon
│   ├── game/              # Jeu
│   └── results/           # Résultats
│
├── lib/
│   ├── games/
│   │   ├── base/         # Classes de base
│   │   └── president/    # Logique Trou de cul
│   ├── socket/           # WebSocket
│   └── store/            # État Zustand
│
├── hooks/                # Hooks React
│   ├── useSocket.ts
│   └── useGame.ts
│
└── server.ts            # Serveur Node.js
```

## 🐛 Dépannage

### Le port 3000 est déjà utilisé
```bash
# Utilisez un autre port
PORT=3005 npm run dev
```

### Erreur de module manquant
```bash
# Réinstallez les dépendances
rm -rf node_modules
npm install
```

### Le jeu ne se connecte pas
1. Vérifiez que le serveur est démarré
2. Rafraîchissez la page (F5)
3. Vérifiez la console du navigateur pour les erreurs

### Les cartes ne s'affichent pas
1. Vérifiez que Tailwind CSS est bien compilé
2. Essayez de vider le cache : Ctrl+Shift+R

## 📖 Documentation Complète

- [README.md](README.md) - Présentation du projet
- [CAHIER_DES_CHARGES.md](CAHIER_DES_CHARGES.md) - Spécifications complètes
- [IMPLEMENTATION_PHASE1.md](IMPLEMENTATION_PHASE1.md) - Détails techniques

## 🎮 Règles du Jeu

### Trou de cul (Président)

**Objectif** : Se débarrasser de toutes ses cartes

**Règles** :
1. Le joueur avec le 3♣ commence
2. Jouer des cartes de **même valeur** et **valeur supérieure** aux précédentes
3. Possibilité de jouer 1, 2, 3 ou 4 cartes identiques
4. Si impossible : cliquer "Passer"
5. Le 2 est la carte la plus forte

**Classement** :
- 1er = Président 👑
- 2ème = Vice-Président 🎩
- Milieu = Neutre 😐
- Avant-dernier = Vice-Trou de cul 😕
- Dernier = Trou de cul 💩

## 🚀 Prochaines Étapes

### Pour Continuer le Développement

1. **Tests** :
   ```bash
   npm run test  # (à configurer)
   ```

2. **Déploiement Vercel** :
   ```bash
   vercel
   ```

3. **Phase 2** :
   - Implémenter Texas Hold'em
   - Ajouter animations
   - Système de chat

## ⚠️ Notes Importantes

- **Parties temporaires** : Les parties sont en mémoire et perdues au redémarrage
- **Pas de persistance** : Phase 3 ajoutera PostgreSQL
- **3-8 joueurs** : Recommandé pour le Trou de cul
- **Connexion stable** : WebSocket nécessite une bonne connexion

## 💡 Astuces

- **Code de partie** : Copiez-le directement depuis le lobby
- **Sélection multiple** : Cliquez sur plusieurs cartes de même valeur
- **Raccourcis** : Les cartes se trient automatiquement

## 🆘 Support

En cas de problème :
1. Consultez la documentation
2. Vérifiez les logs du serveur dans le terminal
3. Ouvrez la console du navigateur (F12)

---

**Bon jeu ! 🎴🎉**

Version 1.0.0 - Phase 1 Complète
