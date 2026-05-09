# Hero Card Game

## Concept
Ce projet adapte au format numérique le jeu de cartes Hero.  
Plateformes cibles : Web et mobile  
Date de départ : 14 décembre 2025  


<br><br>


## Backlog
- Vital :
    - (web/Card) fix: bug No card found but Id is correct
    - (web/Match) Implémenter deck
        - Comp Deck
        - Type Deck only pour zoneContent de deck
        - 

- Déco :
    - Tooltip recording mouse maintain on card (spinner ?), ou bien Rclick simple
- Idées :


<br><br>

<details>
<summary><h2 style="display: inline-block; width: 90%;">Contribution</h2></summary>

### Quick start
- Cloner repo
- Dézipper `z-resources/heroCards_20260424.7z` dans `web/public/cards`

### Commandes
```plaintext
        npm run dev:back       ->   start http://localhost:3000 && tsx watch src/index.ts
        npm run build:back     ->   tsc
        npm run start:back     ->   node dist/index.js
        npm run dev:web        ->   vite
        npm run build:web      ->   tsc && vite build
        npm run dev:mobile     ->   expo start
        npm run build:mobile   ->   expo build
        npm run build:shared   ->   tsc
```
</details>


<br><br>


## Ecosystème

### Technologies utilisées
- Express : Framework backend
- React et React Native : Framework frontend
- Typescript

<details>
<summary><h3 style="display: inline-block; width: 90%;">Structure du projet</h3></summary>

- Ce projet est une monorepo comprenant 4 workspaces
```js
HeroCardGame/
    packages/    // Workspaces principaux
        back/      // Backend (Express)
            src/
        web/       // Frontend web (React)
            src/
        mobile/    // Frontend mobile (React Native)
            src/
    shared/      // Eléments partagés entre workspaces
```
</details>



<details>
<summary><h3 style="display: inline-block; width: 90%;">Fonctionnements techniques divers</h3></summary>

- Organisation des components
    - Chaque component peut commencer par une div.ComponentName, main si View, pour le différencier des autres dans le css main.ComponentName

- Pages
    - Liste des routes sont dans /sitemap

- Routes
    - Get
        - back:server.ts a une route catch all qui redirige vers web. Il sert aussi les fichiers statics de web/dist
        - web: routes.tsx contient les routes web, il exporte le router et elles sont acccessibles avec router.routes
    - Post 
        - Les routes post sont dans shared:src/index.ts (pas sharedRoutes.ts)
        - Leur logique est dans back:server.ts

- Fonctionnement du shared
    - Dans src :
        - Chaque dossier contient un index.ts qui export * from autreFichierDuDossier.ts
        - Le shared:package.json doit exporter chaque index.js
        - Pour l'utilisation on import 
        - shared n'a pas besoin d'être compilé, ses fichiers sont importés tels quels par les autres packages

- État global de l'application
    - Géré via React Context (AppContext) dans web/src/AppContext.tsx
    - Contient l'état mutable comme le thème actuel, et des utilitaires comme setPageTitle

- Gestion des thèmes
    - Thèmes "light" et "dark" définis dans web/src/themes.ts
    - Variables CSS injectées dynamiquement dans le head via loadThemesStyles() appelée dans main.tsx
    - Thème stocké dans localStorage, appliqué sur #app avec classe "dark" pour le thème sombre

- Types TypeScript
    - Définis dans web/src/types.d.ts pour les types partagés (Theme, AppState, etc.)
    - Utilisés pour typer l'état et les props des composants

- Configuration de build
    - Vite pour le web avec alias : '@' pour src/, '@herocardgame/shared' pour shared/
    - Monorepo avec workspaces npm pour gérer les dépendances partagées

- Gestion des cartes
    - Images des cartes stockées dans web/public/cards/ (à extraire de z-resources/heroCards_20260424.7z)
    - Composant cards.tsx pour afficher les cartes
    - Vues de debug : /debug/card pour CardViewer, /debug/board pour Match

- Backend Express
    - Sert les fichiers statiques du build web en prod
    - Route catch-all pour SPA (retourne index.html)
    - API simple avec /api/hello pour tests
    - Port 3000 en dev

- Mobile (React Native)
    - Utilise Expo pour le développement
    - Structure similaire au web mais adaptée mobile
</details>




<br>
<br>