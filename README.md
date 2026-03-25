# Hero Card Game

## Concept
Ce projet adapte au format numérique le jeu de cartes Hero, créé en 2021 par Gricha.  
Plateformes cibles : Web et mobile


<br>
<br>



## Contribution

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

<br>
<br>

##
Date de départ : 14 décembre 2025