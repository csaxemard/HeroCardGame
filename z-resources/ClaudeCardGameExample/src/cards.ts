export type CardSuit = 'fire' | 'water' | 'earth' | 'arcane';
export type CardRarity = 'common' | 'rare' | 'legendary';

export interface Card {
  id: string;
  name: string;
  suit: CardSuit;
  rarity: CardRarity;
  attack: number;
  defense: number;
  mana: number;
  description: string;
  power?: string; // special power name
}

export type ZoneId = 'hand' | 'field-player' | 'field-enemy' | 'graveyard';

export interface GameZone {
  id: ZoneId;
  label: string;
  cards: Card[];
  maxCards: number;
}

const SUITS: Record<CardSuit, { emoji: string; color: string; glow: string }> = {
  fire:   { emoji: '🔥', color: '#c0392b', glow: '#ff6b35' },
  water:  { emoji: '💧', color: '#2e6fbf', glow: '#74b9ff' },
  earth:  { emoji: '🌿', color: '#27ae60', glow: '#55efc4' },
  arcane: { emoji: '✨', color: '#8e44ad', glow: '#e056fd' },
};

export { SUITS };

export const ALL_CARDS: Card[] = [
  // FIRE
  { id: 'f1', name: 'Flamme Éternelle',   suit: 'fire',   rarity: 'legendary', attack: 9,  defense: 3,  mana: 7, description: 'Embrase toute la rangée ennemie.', power: 'Embrasement' },
  { id: 'f2', name: 'Cendrier du Chaos',  suit: 'fire',   rarity: 'rare',      attack: 6,  defense: 4,  mana: 4, description: 'Inflige des dégâts en zone.', power: 'Explosion' },
  { id: 'f3', name: 'Braise Errante',     suit: 'fire',   rarity: 'common',    attack: 4,  defense: 2,  mana: 2, description: 'Rapide et imprévisible.' },
  { id: 'f4', name: 'Salamandre Noire',   suit: 'fire',   rarity: 'rare',      attack: 5,  defense: 5,  mana: 5, description: 'Régénère chaque tour.', power: 'Régénération' },
  { id: 'f5', name: 'Souffle du Dragon',  suit: 'fire',   rarity: 'legendary', attack: 10, defense: 2,  mana: 8, description: 'Attaque pure dévastatrice.', power: 'Souffle' },
  { id: 'f6', name: 'Tison Maudit',       suit: 'fire',   rarity: 'common',    attack: 3,  defense: 3,  mana: 2, description: 'Empoisonne à la flamme.' },

  // WATER
  { id: 'w1', name: 'Abyssal Ancien',     suit: 'water',  rarity: 'legendary', attack: 7,  defense: 8,  mana: 7, description: 'Venu des profondeurs oubliées.', power: 'Engloutir' },
  { id: 'w2', name: 'Vague de Givre',     suit: 'water',  rarity: 'rare',      attack: 5,  defense: 6,  mana: 4, description: 'Gèle l\'adversaire 2 tours.', power: 'Gel' },
  { id: 'w3', name: 'Naïade Mystique',    suit: 'water',  rarity: 'common',    attack: 3,  defense: 5,  mana: 2, description: 'Soigne les alliés adjacents.' },
  { id: 'w4', name: 'Tempête Pélagique',  suit: 'water',  rarity: 'rare',      attack: 7,  defense: 3,  mana: 5, description: 'Balaye tous les défenseurs.', power: 'Tsunami' },
  { id: 'w5', name: 'Larme du Léviathan', suit: 'water',  rarity: 'legendary', attack: 6,  defense: 10, mana: 8, description: 'Défense quasi indestructible.', power: 'Carapace' },
  { id: 'w6', name: 'Remous Éthéré',      suit: 'water',  rarity: 'common',    attack: 2,  defense: 4,  mana: 1, description: 'Ralentit l\'ennemi.' },

  // EARTH
  { id: 'e1', name: 'Golem de Pierre',    suit: 'earth',  rarity: 'legendary', attack: 5,  defense: 12, mana: 6, description: 'Forteresse vivante infranchissable.', power: 'Forteresse' },
  { id: 'e2', name: 'Druide des Racines', suit: 'earth',  rarity: 'rare',      attack: 4,  defense: 7,  mana: 4, description: 'Enracine l\'ennemi au sol.', power: 'Enraciner' },
  { id: 'e3', name: 'Esprit de la Forêt', suit: 'earth',  rarity: 'common',    attack: 3,  defense: 5,  mana: 2, description: 'Protège les alliés proches.' },
  { id: 'e4', name: 'Titan Tellurique',   suit: 'earth',  rarity: 'legendary', attack: 8,  defense: 9,  mana: 9, description: 'Tremblement de terre dévastateur.', power: 'Séisme' },
  { id: 'e5', name: 'Champigolem',        suit: 'earth',  rarity: 'rare',      attack: 5,  defense: 6,  mana: 4, description: 'Empoisonne progressivement.', power: 'Spores' },
  { id: 'e6', name: 'Bourgeon Sauvage',   suit: 'earth',  rarity: 'common',    attack: 2,  defense: 4,  mana: 1, description: 'Croît avec le temps.' },

  // ARCANE
  { id: 'a1', name: 'Archimage Noir',     suit: 'arcane', rarity: 'legendary', attack: 8,  defense: 4,  mana: 9, description: 'Copie les pouvoirs ennemis.', power: 'Mimétisme' },
  { id: 'a2', name: 'Phantôme Lié',       suit: 'arcane', rarity: 'rare',      attack: 6,  defense: 3,  mana: 5, description: 'Ignore toutes les défenses.', power: 'Spectre' },
  { id: 'a3', name: 'Rune du Néant',      suit: 'arcane', rarity: 'common',    attack: 4,  defense: 3,  mana: 3, description: 'Annule un sort adverse.' },
  { id: 'a4', name: 'Void Éveillé',       suit: 'arcane', rarity: 'legendary', attack: 11, defense: 5,  mana: 10, description: 'Détruit une carte au hasard.', power: 'Annihilation' },
  { id: 'a5', name: 'Illusion Parfaite',  suit: 'arcane', rarity: 'rare',      attack: 5,  defense: 5,  mana: 5, description: 'Clone la carte la plus forte.', power: 'Clone' },
  { id: 'a6', name: 'Écho Astral',        suit: 'arcane', rarity: 'common',    attack: 3,  defense: 3,  mana: 2, description: 'Rejoue la dernière action.' },
];

export function getStartingHand(): Card[] {
  const shuffled = [...ALL_CARDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 7);
}
