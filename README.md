# RATP2 - VHP Live Dashboard

Dashboard en temps réel pour les données de transit RATP utilisant React + Vite + TypeScript.

## 🚀 Installation

```bash
# Cloner le repositoire
git clone https://github.com/plero75/RATP2.git
cd RATP2

# Installer les dépendances
npm install
```

## 📦 Développement

```bash
# Démarrer le serveur de développement (localhost:5173)
npm run dev
```

## 🔨 Build

```bash
# Construire pour la production
npm run build

# Prévisualiser la version produite
npm run preview
```

## 📝 Notes importantes

- **Base URL**: Le projet est déployé sur `https://plero75.github.io/RATP2/`
- **Vite config**: La config Vite inclut `base: '/RATP2/'` pour GitHub Pages
- **npm ci**: Utilisez toujours `npm ci` en CI/CD au lieu de `npm install`
- **Lock file**: Le `package-lock.json` est ignoré (regénéré à chaque installation)

## 🌐 Déploiement

Le déploiement se fait automatiquement via GitHub Actions quand vous pushez sur:
- `codex/rendre-la-page-responsive-sans-defilement`

Le workflow:
1. Installe les dépendances avec `npm ci`
2. Build le projet avec `npm run build`
3. Déploie le dossier `dist` sur GitHub Pages

## 📚 Structure du projet

```
.
├── components/      # Composants React
├── hooks/          # React hooks personnalisés
├── services/       # Services API et utilitaires
├── App.tsx         # Composant racine
├── main.tsx        # Point d'entrée
├── index.html      # Template HTML
└── vite.config.ts  # Configuration Vite
```

## 🔧 Technologies

- **React 19.2.0** - Framework UI
- **Vite 6.2.0** - Build tool
- **TypeScript ~5.8.2** - Type safety
- **TailwindCSS 3.4.17** - Styling
- **date-fns 4.1.0** - Date utilities
