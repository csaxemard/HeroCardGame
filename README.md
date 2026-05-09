# Hero Card Game

## Concept
Ce projet adapte au format numérique le jeu de cartes Hero.  
Plateformes cibles : Web et mobile


<br>
<br>

## Backlog
- Tooltip recording mouse maintain on card (spinner ?)
- Fix bug No card found with correct Id

### Idées
- Importer les routes get de web à partir de shared pour les avoir aussi dans mobile ? Peut-être pas utile

## Contribution

Penser à dézipper les cartes images dans web/public/cards

### Technologies utilisées
- Express : Framework backend
- React et React Native : Framework frontend
- Typescript

### Architecture
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

### Fonctionnement Technique

- Organisation des components
    - Chaque component peut commencer par une div.ComponentName, main si View, pour le différencier des autres dans le css main.ComponentName

- Pages
    - Liste des routes sont dans /sitemap

- Routes
    - Get
        - back:server.ts a une route catch all qui redirige vers web. Il sert aussi les fichiers statics de web/dist
        - web: routes.tsx contient les routes web, il exporte le router et elles sont acccessibles avec router.routes
    - Post 
        - Les routes post sont dans shared:sharedRoutes.ts
        - Leur logique est dans back:server.ts

- Fonctionnement du shared
    - Dans src :
        - Chaque dossier contient un index.ts qui export * from autreFichierDuDossier.ts
        - Le shared:package.json doit exporter chaque index.js
        - Pour l'utilisation on import 
        - shared n'a pas besoin d'être compilé, ses fichiers sont importés tels quels par les autres packages




<br>
<br>

##
Date de départ : 14 décembre 2025