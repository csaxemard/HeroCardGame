import type { CardDetails, CardRole } from "./types";


export function getRandomCardId(): number {
    const min = 0
    const max = 125
    const unavailableCardIds: number[] = [0, 2, 4, 5, 10, 15, 25, 34, 40, 41, 43, 44, 47, 48, 49, 50, 51, 52, 54, 55, 56, 57, 60, 61, 62, 63, 64, 65, 66, 68, 69, 71, 75, 76, 77, 78, 79, 80, 81, 82, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 109, 110, 111, 112, 115, 116, 117, 118, 119, 120, 121, 122, 123];

    let cardId;
    do {
        cardId = Math.floor(Math.random() * (max - min + 1)) + min
    } while (unavailableCardIds.includes(cardId));

    return cardId
}

export function getRandomCardIdByRoles(
    /**
     * - If roles is only one of CardRoles, then return one id of that role
     * - If roles is an Array of CardRoles, then return one id of any of those roles
     */
    roles: CardRole | CardRole[]): number {
    // Get one id of any role of roles. If roles == array then one of them. If roles is a string then one of that role
    if (typeof roles === "string") {
        return cardIdsByRole[roles][Math.floor(Math.random() * cardIdsByRole[roles].length)]
    } else {
        const allIds = roles.reduce((acc: any, role: CardRole) => {
            return [...acc, ...(cardIdsByRole[role] || [])]
        }, [] as number[])

        if (allIds.length === 0) {
            throw new Error(`No cards found for roles: ${roles.join(", ")}`);
        }

        const randomIndex = Math.floor(Math.random() * allIds.length);
        return allIds[randomIndex];
    }
}




export const allCards: Record<number, CardDetails> = {
    1: { id: 1, name: "Heaven, Héros de la Destinée", img: "/cards-w215/1 - Heaven, Héros de la Destinée.png", role: "hero" },
    3: { id: 3, name: "Épée Démoniaque", img: "/cards-w215/3 - Épée Démoniaque.png", role: "allied" },
    6: { id: 6, name: "Aerial Assault", img: "/cards-w215/6 - Aerial Assault.png", role: "allied" },
    7: { id: 7, name: "Vieux Chêne", img: "/cards-w215/7 - Vieux Chêne.png", role: "allied" },
    8: { id: 8, name: "Khéos, Âme Emprisonnée", img: "/cards-w215/8 - Khéos, Âme Emprisonnée.png", role: "allied" },
    9: { id: 9, name: "Marine", img: "/cards-w215/9 - Marine.png", role: "hero" },
    11: { id: 11, name: "Bulbe d'Eau", img: "/cards-w215/11 - Bulbe d'Eau.png", role: "allied" },
    12: { id: 12, name: "Alleister, Dark Héros de la Malédiction", img: "/cards-w215/12 - Alleister, Dark Héros de la Malédiction.png", role: "darkHero" },
    13: { id: 13, name: "Pot d'Avidité", img: "/cards-w215/13 - Pot d'Avidité.png", role: "allied" },
    14: { id: 14, name: "Mini Guerrier Céleste", img: "/cards-w215/14 - Mini Guerrier Céleste.png", role: "allied" },
    16: { id: 16, name: "Dragon de la Lumière", img: "/cards-w215/16 - Dragon de la Lumière.png", role: "allied" },
    17: { id: 17, name: "Mini Ange Céleste", img: "/cards-w215/17 - Mini Ange Céleste.png", role: "allied" },
    18: { id: 18, name: "Mini Dragon Céleste", img: "/cards-w215/18 - Mini Dragon Céleste.png", role: "allied" },
    19: { id: 19, name: "Mini Archer Céleste", img: "/cards-w215/19 - Mini Archer Céleste.png", role: "allied" },
    20: { id: 20, name: "Eternea, Dragon Ultime Céleste", img: "/cards-w215/20 - Eternea, Dragon Ultime Céleste.png", role: "hero" },
    21: { id: 21, name: "Guwoz, Âme Perdue de l'Artefact", img: "/cards-w215/21 - Guwoz, Âme Perdue de l'Artefact.png", role: "allied" },
    22: { id: 22, name: "Terres Embrasées", img: "/cards-w215/22 - Terres Embrasées.png", role: "allied" },
    23: { id: 23, name: "Souffleur des Prisons de Verre", img: "/cards-w215/23 - Souffleur des Prisons de Verre.png", role: "allied" },
    24: { id: 24, name: "Hinomata, Âme Libérée", img: "/cards-w215/24 - Hinomata, Âme Libérée.png", role: "allied" },
    26: { id: 26, name: "Pühpou, Maîtresse des Âmes Damnées", img: "/cards-w215/26 - Pühpou, Maîtresse des Âmes Damnées.png", role: "hero" },
    27: { id: 27, name: "Sélection Perfide", img: "/cards-w215/27 - Sélection Perfide.png", role: "allied" },
    28: { id: 28, name: "Millenium", img: "/cards-w215/28 - Millenium.png", role: "darkHero" },
    29: { id: 29, name: "Mouton Nuage", img: "/cards-w215/29 - Mouton Nuage.png", role: "allied" },
    30: { id: 30, name: "Astre Noir", img: "/cards-w215/30 - Astre Noir.png", role: "allied" },
    31: { id: 31, name: "Petit Mouton", img: "/cards-w215/31 - Petit Mouton.png", role: "allied" },
    32: { id: 32, name: "MoutMouton", img: "/cards-w215/32 - MoutMouton.png", role: "allied" },
    33: { id: 33, name: "Mouton Bouffi Gris", img: "/cards-w215/33 - Mouton Bouffi Gris.png", role: "allied" },
    35: { id: 35, name: "Lycos, Double Cœur", img: "/cards-w215/35 - Lycos, Double Cœur.png" },
    36: { id: 36, name: "Statue de Pierre des Pastèques", img: "/cards-w215/36 - Statue de Pierre des Pastèques.png", role: "allied" },
    37: { id: 37, name: "Demon N°19", img: "/cards-w215/37 - Demon N°19.png", role: "allied" },
    38: { id: 38, name: "Chat Géant des Prairies", img: "/cards-w215/38 - Chat Géant des Prairies.png", role: "allied" },
    39: { id: 39, name: "Magie Ancienne Atalante", img: "/cards-w215/39 - Magie Ancienne Atalante.png", role: "allied" },
    42: { id: 42, name: "Crow", img: "/cards-w215/42 - Crow.png", role: "hero" },
    45: { id: 45, name: "Déferlante Divine Atalante", img: "/cards-w215/45 - Déferlante Divine Atalante.png", role: "allied" },
    46: { id: 46, name: "Zaeran'h", img: "/cards-w215/46 - Zaeran'h.png", role: "hero" },
    53: { id: 53, name: "Bâton Électrique Atalante", img: "/cards-w215/53 - Bâton Électrique Atalante.png", role: "allied" },
    58: { id: 58, name: "Poussière Enchantée", img: "/cards-w215/58 - Poussière Enchantée.png", role: "allied" },
    59: { id: 59, name: "Fée Tailleur de Pierre", img: "/cards-w215/59 - Fée Tailleur de Pierre.png", role: "allied" },
    67: { id: 67, name: "Exxeos", img: "/cards-w215/67 - Exxeos.png", role: "hero" },
    70: { id: 70, name: "Gojou Sama", img: "/cards-w215/70 - Gojou Sama.png", role: "allied" },
    72: { id: 72, name: "Crezcia", img: "/cards-w215/72 - Crezcia.png", role: "halfHero" },
    73: { id: 73, name: "Déterré des Sables", img: "/cards-w215/73 - Déterré des Sables.png", role: "allied" },
    74: { id: 74, name: "Guerrier Kakamöha", img: "/cards-w215/74 - Guerrier Kakamöha.png", role: "allied" },
    83: { id: 83, name: "Élixir de Résurrection", img: "/cards-w215/83 - Élixir de Résurrection.png", role: "allied" },
    90: { id: 90, name: "Explosion Synchro Ardente", img: "/cards-w215/90 - Explosion Synchro Ardente.png", role: "allied" },
    108: { id: 108, name: "Libération des Dramos", img: "/cards-w215/108 - Libération des Dramos.png", role: "allied" },
    113: { id: 113, name: "Sacralisation Requiem", img: "/cards-w215/113 - Sacralisation Requiem.png", role: "allied" },
    114: { id: 114, name: "Heras, Égerie des Civilisations Antiques", img: "/cards-w215/114 - Heras, Égerie des Civilisations Antiques.png", role: "darkHero" },
    124: { id: 124, name: "Jack Stubborn", img: "/cards-w215/124 - Jack Stubborn.png", role: "halfHero" },
    125: { id: 125, name: "Plume du Héros", img: "/cards-w215/125 - Plume du Héros.png", role: "allied" },
}

export const cardIdsByRole: Record<CardRole, number[]> = {
    hero: [1, 9, 20, 26, 35, 42, 46, 67, 72],
    darkHero: [12, 28,],
    halfHero: [72],
    multiHero: [],
    allied: [3, 6, 7, 8, 11, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24, 27, 29, 30, 31, 32, 33, 36, 37, 38, 39, 45, 53, 58, 59, 70, 73, 74],
}