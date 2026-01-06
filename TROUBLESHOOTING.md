# 🔧 Guide de Dépannage

## Erreur: "Failed to load resource: main.tsx / vite.svg 404"

### Causes possibles:

1. **En développement local** - Le serveur Vite n'est pas lancé
   ```bash
   npm run dev
   ```

2. **Fichier manquant** - Le fichier `vite.svg` ou `main.tsx` n'existe pas
   - Assurez-vous que les fichiers existent à la racine du projet
   - Vérifiez que le build a généré les fichiers dans `dist/`

3. **Chemin incorrect dans index.html**
   - Pour GitHub Pages, utilisez des chemins absolus: `/main.tsx`
   - La config Vite (`base: '/RATP2/'`) gère le préfixe automatiquement

### Solution:

```bash
# 1. Assurer que npm est à jour
npm install

# 2. Nettoyer et reconstruire
rm -rf dist node_modules
npm install
npm run build

# 3. En développement
npm run dev
```

---

## Erreur: "A listener indicated an asynchronous response but the message channel closed"

### Causes possibles:

1. **Extension navigateur bloquante** - Une extension essaie d'injecter du code
   - Essayez en mode incognito ou désactiver les extensions

2. **Service Worker incomplet** - Un service worker ne répond pas correctement
   - Vérifiez que vous n'en avez pas un défaut
   - Nettoyez le cache: `DevTools → Application → Clear Storage`

3. **Vite Hot Module Replacement (HMR)** - Problème de reconnexion
   - Redémarrez le serveur: `Ctrl+C` puis `npm run dev`

### Solution:

```bash
# 1. En mode incognito/private
# (pour éliminer les extensions)

# 2. Nettoyer le cache du navigateur
# DevTools → Application → Clear Storage → Clear Site Data

# 3. Restart le serveur de développement
npm run dev

# 4. Actualisez la page avec Ctrl+Shift+R (hard refresh)
```

---

## Erreur: "npm error 404 Not Found - mini-glob"

### Solution appliquée dans cette branche:

✅ Le `package-lock.json` a été supprimé  
✅ Il a été ajouté au `.gitignore`  
✅ Les dépendances seront regénérées proprement

```bash
npm install
npm ci
```

---

## Erreur: "Cannot find module './App'"

### Cause: Import incorrect dans `main.tsx`

### Solution:

Vérifiez que le fichier s'appelle `App.tsx` (avec majuscule) et qu'il se trouve à la racine du projet.

```typescript
// ✅ Correct
import App from './App';

// ❌ Incorrect
import App from './app';      // Mauvaise casse
import App from './App.tsx';   // Extension non nécessaire
```

---

## Build GitHub Actions échoue: "npm error code E404"

### Solution:

La branche `fix/clean-npm-dependencies` a résolu ce problème en:

1. Supprimant le `package-lock.json` corrompu
2. Ajoutant `.gitignore` pour éviter sa recommission
3. Forçant `npm ci` à régénérer un lock file propre

**Fusionnez cette branche dans votre branche de travail** pour appliquer la correction.

---

## Aucune de ces solutions ne fonctionne?

### Essayez le "nuclear option" (réinitialisation complète):

```bash
# 1. Supprimez tout ce qui est généré
rm -rf node_modules dist dist-ssr .vite

# 2. Supprimez les lock files
rm package-lock.json yarn.lock pnpm-lock.yaml

# 3. Réinstallez from scratch
npm cache clean --force
npm install

# 4. Testez
npm run dev
```

Si ça continue, vérifiez que vous utilisez la bonne version de Node:
```bash
node --version  # Devrait être >= 16.x
npm --version   # Devrait être >= 8.x
```
