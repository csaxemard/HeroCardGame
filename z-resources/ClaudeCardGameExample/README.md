# ⚔ Card Duel

Un jeu de cartes React + Vite + TypeScript avec drag & drop complet.

## Installation

```bash
npm install
npm run dev
```

## Fonctionnalités

- **24 cartes** réparties en 4 familles (🔥 Feu, 💧 Eau, 🌿 Terre, ✨ Arcane)
- **3 raretés** : Commune, Rare, Légendaire (avec effet holo)
- **Drag & drop** complet via `@dnd-kit` :
  - Glissez des cartes de votre **main** vers votre **champ**
  - Réorganisez les cartes dans n'importe quelle zone
  - Envoyez des cartes au **cimetière**
- **Combat** : bouton Attaquer pour calculer ATK vs DEF
- **Système de mana** qui augmente chaque tour
- **IA ennemie** simple qui contre-attaque en fin de tour
- **Log de combat** en temps réel
- **Écran de fin de partie** victoire/défaite

## Stack technique

- React 18 + TypeScript
- Vite 5
- @dnd-kit/core + @dnd-kit/sortable
- CSS Modules
- Google Fonts (Cinzel Decorative, Cinzel, Crimson Pro)
