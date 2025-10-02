# 🚀 Guide de Déploiement

Ce guide explique comment déployer l'application Card Maker sur différentes plateformes.

## ⚠️ Important : Limitations WebSocket

**Vercel** ne supporte pas nativement les serveurs WebSocket persistants avec Socket.io en raison de sa nature serverless. Pour un déploiement complet avec WebSocket, vous avez deux options :

### Option 1 : Déploiement Hybride (Recommandé pour Production)
- **Frontend sur Vercel** (Next.js)
- **Backend WebSocket sur Railway/Render** (serveur Node.js)

### Option 2 : Déploiement Tout-en-Un
- **Railway** ou **Render** (Frontend + Backend)

## 🌐 Option 1 : Railway (Recommandé - Tout-en-Un)

Railway supporte les applications Next.js avec serveur personnalisé et WebSocket.

### Étapes

1. **Créer un compte sur Railway**
   - Allez sur [railway.app](https://railway.app)
   - Connectez-vous avec GitHub

2. **Nouveau Projet**
   ```bash
   # Assurez-vous que votre code est sur GitHub
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

3. **Dans Railway Dashboard**
   - Cliquez sur "New Project"
   - Sélectionnez "Deploy from GitHub repo"
   - Choisissez votre repository
   - Railway détectera automatiquement Next.js

4. **Configuration des Variables**
   - Ajoutez ces variables d'environnement :
   ```
   NODE_ENV=production
   PORT=3000
   ```

5. **Build Settings**
   - Build Command : `npm run build`
   - Start Command : `npm run start`

6. **Déployer**
   - Railway déploiera automatiquement
   - Vous obtiendrez une URL comme `https://your-app.up.railway.app`

### Avantages Railway
- ✅ Support WebSocket natif
- ✅ Déploiement automatique depuis GitHub
- ✅ Gratuit jusqu'à 500h/mois
- ✅ Logs en temps réel
- ✅ Facile à configurer

---

## 🔷 Option 2 : Render

Alternative similaire à Railway avec support WebSocket.

### Étapes

1. **Créer un compte Render**
   - Allez sur [render.com](https://render.com)
   - Connectez-vous avec GitHub

2. **Nouveau Web Service**
   - Dashboard → "New" → "Web Service"
   - Connectez votre repository GitHub

3. **Configuration**
   ```
   Name: card-maker
   Environment: Node
   Build Command: npm install && npm run build
   Start Command: npm run start
   ```

4. **Variables d'environnement**
   ```
   NODE_ENV=production
   PORT=10000
   ```

5. **Déployer**
   - Cliquez sur "Create Web Service"
   - URL : `https://card-maker.onrender.com`

### Avantages Render
- ✅ Support WebSocket
- ✅ Gratuit (avec limitations)
- ✅ SSL automatique
- ✅ Déploiement continu

---

## ⚡ Option 3 : Vercel (Frontend Seulement)

**⚠️ Note** : Cette option nécessite un backend séparé pour WebSocket.

### Déploiement Frontend sur Vercel

1. **Installer Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Se connecter**
   ```bash
   vercel login
   ```

3. **Déployer**
   ```bash
   vercel
   ```

4. **Configuration**
   - Project name : `card-maker`
   - Framework : Next.js
   - Build Command : `next build`
   - Output Directory : `.next`

### Backend WebSocket Séparé

Vous devrez déployer le serveur Socket.io séparément :

1. **Créer un projet backend séparé**
   ```bash
   mkdir card-maker-backend
   cd card-maker-backend
   npm init -y
   npm install socket.io express cors
   ```

2. **Créer server.js**
   ```javascript
   const express = require('express');
   const { createServer } = require('http');
   const { Server } = require('socket.io');
   const cors = require('cors');

   const app = express();
   app.use(cors());

   const httpServer = createServer(app);
   const io = new Server(httpServer, {
     cors: {
       origin: process.env.FRONTEND_URL || "http://localhost:3000",
       methods: ["GET", "POST"]
     }
   });

   // Copier la logique de lib/socket/server.ts ici

   const PORT = process.env.PORT || 3001;
   httpServer.listen(PORT, () => {
     console.log(`WebSocket server on port ${PORT}`);
   });
   ```

3. **Déployer sur Railway/Render**
   - Suivez les mêmes étapes que l'Option 1 ou 2

4. **Mettre à jour le Frontend**
   ```typescript
   // components/providers/SocketProvider.tsx
   const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
   ```

5. **Variables d'environnement Vercel**
   ```
   NEXT_PUBLIC_SOCKET_URL=https://votre-backend.railway.app
   ```

---

## 🔧 Configuration Pré-Déploiement

### 1. Vérifier package.json

```json
{
  "scripts": {
    "dev": "tsx server.ts",
    "build": "next build",
    "start": "NODE_ENV=production tsx server.ts",
    "lint": "next lint"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

### 2. Variables d'environnement

Créez `.env.production` :
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
```

### 3. Test Build Local

```bash
# Build
npm run build

# Test en production localement
npm run start

# Ouvrir http://localhost:3000
```

### 4. Vérifier les Logs

Assurez-vous qu'il n'y a pas d'erreurs :
- ✅ Next.js compile
- ✅ Socket.io s'initialise
- ✅ Aucune erreur TypeScript

---

## 📊 Comparaison des Options

| Feature | Railway | Render | Vercel (Split) |
|---------|---------|--------|----------------|
| **WebSocket** | ✅ Natif | ✅ Natif | ⚠️ Backend séparé |
| **Facilité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Gratuit** | 500h/mois | Oui (limité) | Oui (frontend) |
| **SSL** | ✅ Auto | ✅ Auto | ✅ Auto |
| **Logs** | ✅ Temps réel | ✅ Temps réel | ⚠️ Séparé |
| **CI/CD** | ✅ GitHub | ✅ GitHub | ✅ GitHub |
| **Recommandé** | ⭐ **Meilleur** | ⭐ Très bon | ⚠️ Complexe |

---

## 🎯 Recommandation Finale

Pour cette application (Phase 1) :

**🏆 Railway est recommandé** car :
1. Support WebSocket natif
2. Déploiement en un clic depuis GitHub
3. Gratuit pour commencer
4. Pas besoin de séparer frontend/backend
5. Logs faciles à consulter

### Quick Start Railway

```bash
# 1. Push sur GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Aller sur railway.app
# 3. "New Project" → "Deploy from GitHub"
# 4. Sélectionner le repo
# 5. Déploiement automatique !
```

---

## 🔍 Vérification Post-Déploiement

Une fois déployé, testez :

- [ ] Page d'accueil charge correctement
- [ ] Création de partie fonctionne
- [ ] Rejoindre une partie fonctionne
- [ ] WebSocket se connecte (vérifier dans DevTools)
- [ ] Lobby affiche les joueurs
- [ ] Partie se lance correctement
- [ ] Jeu fonctionne (jouer des cartes)
- [ ] Pas d'erreurs dans les logs

### Débugger les Problèmes

**WebSocket ne connecte pas**
```bash
# Vérifier les logs du serveur
# Sur Railway : Dashboard → Logs
# Sur Render : Dashboard → Logs
```

**Erreur CORS**
```typescript
// Vérifier lib/socket/server.ts
cors: {
  origin: process.env.NEXT_PUBLIC_APP_URL || "*",
  methods: ["GET", "POST"]
}
```

**Build échoue**
```bash
# Tester localement d'abord
npm run build
npm run start
```

---

## 📝 Domaine Personnalisé (Optionnel)

### Railway
1. Dashboard → Settings → Domains
2. Ajouter votre domaine
3. Configurer DNS (CNAME)

### Render
1. Settings → Custom Domain
2. Ajouter domaine
3. Configurer DNS

---

## 🚀 Déploiement Continu

Une fois configuré, chaque push sur `main` déclenchera automatiquement :
1. Build de l'application
2. Tests (si configurés)
3. Déploiement
4. Redémarrage du serveur

---

**Besoin d'aide ?** Consultez les docs officielles :
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
