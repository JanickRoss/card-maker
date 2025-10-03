# 🚂 Guide de Déploiement Railway - Étape par Étape

## ✅ Préparation (Déjà Fait)

- [x] Code prêt et testé
- [x] Build production réussi
- [x] Commit créé avec tous les changements
- [x] `.gitignore` configuré

## 📋 Étapes de Déploiement

### 1. Pusher vers GitHub

Si le push automatique n'a pas fonctionné, faites-le manuellement :

```bash
# Dans le terminal de VS Code ou Git Bash
cd "c:\DEV\Fantabulous-organisation\card-maker"

# Vérifier le statut
git status

# Si besoin, forcer le push
git push origin main --force
```

**OU** utilisez l'interface GitHub Desktop si vous l'avez.

---

### 2. Créer un Compte Railway

1. Allez sur **[https://railway.app](https://railway.app)**
2. Cliquez sur **"Start a New Project"** ou **"Login"**
3. Connectez-vous avec votre compte **GitHub**
4. Autorisez Railway à accéder à vos repositories

---

### 3. Déployer le Projet

#### Option A : Depuis le Dashboard Railway

1. Une fois connecté, cliquez sur **"New Project"**
2. Sélectionnez **"Deploy from GitHub repo"**
3. Choisissez votre repository : **`Fantabulous-organisation/card-maker`**
4. Railway va automatiquement :
   - Détecter qu'il s'agit d'un projet Next.js
   - Installer les dépendances (`npm install`)
   - Lancer le build (`npm run build`)
   - Démarrer l'application (`npm run start`)

#### Option B : Avec Railway CLI (Avancé)

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter
railway login

# Initialiser
railway init

# Déployer
railway up
```

---

### 4. Configuration des Variables d'Environnement

Une fois le projet déployé :

1. Dans Railway Dashboard → Sélectionnez votre projet
2. Cliquez sur l'onglet **"Variables"**
3. Ajoutez ces variables :

```env
NODE_ENV=production
PORT=3000
```

**Note** : Railway définit automatiquement `PORT`, mais notre app utilise 3000 par défaut.

---

### 5. Vérifier le Déploiement

1. **Logs en temps réel** :
   - Dans Railway Dashboard → Onglet **"Deployments"**
   - Cliquez sur le déploiement actif
   - Regardez les logs en temps réel

2. **Logs à vérifier** :
   ```
   ✓ Compiled successfully
   > Ready on http://<domain>:3000
   ✅ Socket.IO server initialized
   ```

3. **Obtenir l'URL** :
   - Railway Dashboard → Onglet **"Settings"**
   - Section **"Domains"**
   - Vous verrez une URL comme : `https://card-maker-production.up.railway.app`

---

### 6. Tester l'Application Déployée

1. **Ouvrez l'URL** générée par Railway
2. **Testez les fonctionnalités** :
   - [ ] Page d'accueil charge
   - [ ] Créer une partie
   - [ ] Rejoindre avec un autre onglet/appareil
   - [ ] Vérifier WebSocket (DevTools → Network → WS)
   - [ ] Jouer une partie complète
   - [ ] Vérifier les rangs en fin de partie

---

### 7. Configuration Optionnelle

#### Domaine Personnalisé

1. Railway Dashboard → **Settings** → **Domains**
2. **Add Custom Domain**
3. Entrez votre domaine (ex: `cardgame.votredomaine.com`)
4. Configurez le DNS de votre domaine :
   ```
   Type: CNAME
   Name: cardgame (ou @)
   Value: <votre-app>.up.railway.app
   ```

#### Déploiement Automatique

Par défaut, Railway redéploie automatiquement à chaque push sur `main`.

Pour désactiver :
- Settings → **Auto-deploy** → Désactiver

---

## 🐛 Dépannage

### Erreur : "Build Failed"

**Vérifier les logs** :
- Railway Dashboard → Deployments → Logs

**Solutions courantes** :
```bash
# Localement, vérifier que le build fonctionne
npm run build

# Vérifier package.json
# "scripts": {
#   "build": "next build",
#   "start": "NODE_ENV=production tsx server.ts"
# }
```

### Erreur : "Application Crashed"

**Vérifier** :
1. Les logs de démarrage dans Railway
2. Que `PORT` est bien défini
3. Que `tsx` est installé comme dépendance

**Fix** :
```bash
# S'assurer que tsx est dans dependencies, pas devDependencies
npm install tsx --save
git add package.json package-lock.json
git commit -m "Move tsx to dependencies for Railway"
git push
```

### WebSocket ne se connecte pas

**Vérifier** :
1. L'URL dans `components/providers/SocketProvider.tsx`
2. Que CORS est bien configuré dans `lib/socket/server.ts`

**Fix CORS** (si nécessaire) :
```typescript
// lib/socket/server.ts
cors: {
  origin: process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_APP_URL || "*"
    : "http://localhost:3000",
  methods: ["GET", "POST"]
}
```

### "Game not found" en production

**Cause** : Plusieurs instances du serveur (Railway peut scaler)

**Solution** :
- Railway Free tier = 1 instance → Pas de problème
- Si vous scalez, il faudra utiliser Redis pour partager l'état

---

## 📊 Monitoring

### Métriques Railway

Railway Dashboard → **Metrics** :
- CPU Usage
- Memory Usage
- Network Traffic
- Logs en temps réel

### Logs en Temps Réel

```bash
# Avec Railway CLI
railway logs

# Ou dans le Dashboard
Deployments → View Logs
```

---

## 💰 Coûts

**Railway Pricing** :
- **Plan Gratuit** :
  - 500h/mois ($5 de crédit gratuit)
  - Parfait pour développement/test
  - 1GB RAM, 1GB Storage

- **Plan Hobby ($5/mois)** :
  - Crédit mensuel $5
  - Idéal pour petits projets

- **Plan Pro ($20/mois)** :
  - Crédit mensuel $20
  - Pour production

**Pour ce projet en Phase 1** : Le plan gratuit suffit largement !

---

## ✅ Checklist Post-Déploiement

- [ ] Application accessible via URL Railway
- [ ] WebSocket fonctionne (vérifier DevTools)
- [ ] Créer une partie fonctionne
- [ ] Rejoindre une partie fonctionne
- [ ] Jouer une partie complète
- [ ] Pas d'erreurs dans les logs Railway
- [ ] Mettre à jour README.md avec l'URL de production
- [ ] Partager l'URL avec votre équipe/amis !

---

## 🎉 Succès !

Si tout fonctionne :

1. **Partagez l'URL** : `https://votre-app.up.railway.app`
2. **Testez avec des amis** sur différents appareils
3. **Surveillez les logs** pour les erreurs
4. **Collectez les retours** pour la Phase 2

---

## 📝 Notes Importantes

### Limitations Phase 1 (à communiquer aux utilisateurs)

⚠️ **Parties en mémoire** : Si Railway redémarre le serveur, toutes les parties sont perdues
⚠️ **Pas de persistance** : Pas de base de données (Phase 3)
⚠️ **Pas de reconnexion auto** : Refresh = déconnexion

### Prochaines Étapes (Phase 2)

- [ ] Texas Hold'em
- [ ] Reconnexion automatique
- [ ] Chat en jeu
- [ ] Animations

---

**Besoin d'aide ?**
- Railway Docs : https://docs.railway.app
- Railway Discord : https://discord.gg/railway
- Issues GitHub : Ouvrir une issue dans votre repo

---

**🚀 Bon déploiement !**
