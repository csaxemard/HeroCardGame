# Hero Card Game

## Concept
Ce projet adapte au format numérique le jeu de cartes Hero.  
Plateformes cibles : Web et mobile  
Date de départ : 14 décembre 2025  


<br><br>


## Backlog
- Restreindre ZoneContent to one type of card


- Vital :
    - (web/Card) Fix Card not showing despite correct id
    - (web/Match) Add Deck
        - Comp Deck
        - Type Deck only pour zoneContent de deck
    - (web/Card) fix: removeEventListener("keydown", handleEscape) not working in ModalCardFullscreen

- Config
    - Configurer un des serveurs de l’école pour servir mon site
    - Mettre toutes les cartes dans une base de données au lieu de variable js
    - Mettre un filigrane sur chaque carte, c’est important, xnconvert il le fait. (Je peux l’enlever pour l’exam peut-être). Associer l’id de rainbowpath et gricha pour que eux utilisent les cartes sans filigrane peut-être ?
- Gameplay (Match)
    - 🔹 (1) Faire que chaque emplacement ne peut recevoir qu’un type de carte défini
    - (2) Vider toutes les zones. Remplir seulement le deck et l’extradeck avec un composant Deck, isExtraDeck.
    - Le composant Deck il return une div avec une img de CardBack, et il a un props avec remainingCards qui est une liste de cards, et il affiche un absolute remainingCards.length sur la pile du Deck.
    - Ok ça c’était le deck / extradeck. Demander à gpt si c’est mieux de faire deux comp deck et extradeck ou si un seul avec un prop isExtraDeck est mieux
    - je me demande si à ce stade je ne mettrais pas déjà en place la bdd, ça ne devrait pas être trop long i guess ? Compliqué surement pas. Cenqui est difficile c'est que si je le fais maintenant au lieu de le hardcoder d’abord je risque de devoir modifier les tables pour suit my needs après et ça c’est chiant je crois.
    - Ensuite on aura le début de partie. Nourrir le deck avec 30 random cards de type non hero ou darkhero.
    - ensuite regarder les règles pour savoir c’est quoi la première étape de la partie. Je suppose qu’il faut choisir un héro à mettre en premier ?
    - d’ailleurs on a combien de lp ? Il me semble qu’il n’y a pas de LP et que c’est seulement quand l’adv n’a plus de héro qu’on a gagné
    - (idée) ce serait tellement stylé d’avoir une version portable pour que gricha et louka puissent faire des batailles en ligne, des decks etc
    - Ensuite il faudra regarder les règles pour voir la suite du déroulement de la partie après la pose du héro, chaque joueur pioche des cartes ? Combien ? Il faudra que je représente la main aussi, que j’aie un moyen de l’afficher
    - Je vais peut-être enlever la perspective parce qu’elle est un peu galère, ah j’ai pas essayé de la mettre en absolute aussi on verra. Ce qui serait bien ce serait de ne pas avoir une perspective mais une grid controllée, avec des vraies diagonales. Mais bon ça c’est de la déco ce sera pour après. 
    - maintenant que les joueurs ont pioché il faut faire la phase 0 où on pose chacun ses cartes face verso. Et ensuite il faut décider qui va commencer en premier.
    - Et ensuite tour 1 - premier joueur, qu’est-ce qu’il a comme options ? Il peut poser un monstre, invoquer par rituel un dark héro etc etc, implémenter les règles une par une, mais d’abord celles de base qui permettent d’avoir une partie complète. Pas d’invocation, pas d’effet flip. Pas de dark héro, juste les héros qui se tapent dessus et quand un héro n’a plus de PV il va au extra-cimetière et on choisit un autre héro à mettre à la place, et quand il n’y a plus de héro un joueur a gagné et l’autre a perdu.
    - Coder chaque carte une par une
    - Faire en sorte qu’on puisse faire une partie en temps réel entre deux ordis
- Autres parties du site
    - Faire un catalogue de cartes
        - Nécessite la bdd
    - Une page pour créer des decks
- Catalogue (l'actuel Cards viewer)
    - Faire une liste de toutes les cartes en petit à droite, et à gauche la carte sur laquelle on a cliqué
    - Ajouter une option de tri de cartes, par ordre alphabétique, attaque, défense, par famille (ordre alphabétique), par type (eau etc), par role (héros, guerriers, )
    - Et une option de groupement de cartes, par famille, ou toutes mélangées
- Version portable
    - D'abord faire que le site soit responsive ? Et si ça marche pas (trop lent), faire une appli ?
    - On joueurait à l’horizontale ? Je pense ouais ou bien faire des tests d’ui, avec figma peut-être ? Pour voir comment je peux arranger le plateau sur portable
    - Le soucis en react native c’est que il faudra que l’appli télécharge toutes les cartes, donc minimum 300Mo, sans compter React. On peut peut-être réduire la résolution des cartes parce qu’un portable n’a jamais autant de pixels, d’ailleurs sur pc aussi, là ce serait mieux, on serait peut-être à 100Mo c’est déjà mieux
- Style
    - Ajouter des animations sympas
    - Tooltip recording mouse maintain on card (spinner ? [spinners](https://cssloaders.github.io/)), ou bien Rclick simple
    - Apparence du Deck : plus tard je ferai que le composant deck son apparence c’est une pile de cardBack, exactement le nombre de cartes restantes, avec pour chacune un rotate randIntInRange btwn 1 et -1, peut-être une ombre mais c’est trop demandé. Et aussi une anim de mélange du deck.


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