export interface CardType { id: number, name: string, type?: "hero" | "monster", img: string }



export function getRandomCardId() {
    const min = 0
    const max = 125
    const unavailableCardIds: number[] = [0, 2, 4, 5, 10, 15, 25, 34, 40, 41, 43, 44, 47, 48, 49, 50, 51, 52, 54, 55, 56, 57, 60, 61, 62, 63, 64, 65, 66, 68, 69, 71, 75, 76, 77, 78, 79, 80, 81, 82, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 109, 110, 111, 112, 115, 116, 117, 118, 119, 120, 121, 122, 123];

    let cardId;
    do {
        cardId = Math.floor(Math.random() * (max - min + 1)) + min
    } while (unavailableCardIds.includes(cardId));

    return cardId
}



export const cards: Record<number, CardType> = {
    1: { id: 1, name: "Heaven, Héros de la Destinée", img: "/cards/1 - Heaven, Héros de la Destinée.png" },
    3: { id: 3, name: "Épée Démoniaque", img: "/cards/3 - Épée Démoniaque.png" },
    6: { id: 6, name: "Aerial Assault", img: "/cards/6 - Aerial Assault.png" },
    7: { id: 7, name: "Vieux Chêne", img: "/cards/7 - Vieux Chêne.png" },
    8: { id: 8, name: "Khéos, Âme Emprisonnée", img: "/cards/8 - Khéos, Âme Emprisonnée.png" },
    9: { id: 9, name: "Marine", img: "/cards/9 - Marine.png" },
    11: { id: 11, name: "Bulbe d'Eau", img: "/cards/11 - Bulbe d'Eau.png" },
    12: { id: 12, name: "Alleister, Dark Héros de la Malédiction", img: "/cards/12 - Alleister, Dark Héros de la Malédiction.png" },
    13: { id: 13, name: "Pot d'Avidité", img: "/cards/13 - Pot d'Avidité.png" },
    14: { id: 14, name: "Mini Guerrier Céleste", img: "/cards/14 - Mini Guerrier Céleste.png" },
    16: { id: 16, name: "Dragon de la Lumière", img: "/cards/16 - Dragon de la Lumière.png" },
    17: { id: 17, name: "Mini Ange Céleste", img: "/cards/17 - Mini Ange Céleste.png" },
    18: { id: 18, name: "Mini Dragon Céleste", img: "/cards/18 - Mini Dragon Céleste.png" },
    19: { id: 19, name: "Mini Archer Céleste", img: "/cards/19 - Mini Archer Céleste.png" },
    20: { id: 20, name: "Eternea, Dragon Ultime Céleste", img: "/cards/20 - Eternea, Dragon Ultime Céleste.png" },
    21: { id: 21, name: "Guwoz, Âme Perdue de l'Artefact", img: "/cards/21 - Guwoz, Âme Perdue de l'Artefact.png" },
    22: { id: 22, name: "Terres Embrasées", img: "/cards/22 - Terres Embrasées.png" },
    23: { id: 23, name: "Souffleur des Prisons de Verre", img: "/cards/23 - Souffleur des Prisons de Verre.png" },
    24: { id: 24, name: "Hinomata, Âme Libérée", img: "/cards/24 - Hinomata, Âme Libérée.png" },
    26: { id: 26, name: "Pühpou, Maîtresse des Âmes Damnées", img: "/cards/26 - Pühpou, Maîtresse des Âmes Damnées.png" },
    27: { id: 27, name: "Sélection Perfide", img: "/cards/27 - Sélection Perfide.png" },
    28: { id: 28, name: "Millenium", img: "/cards/28 - Millenium.png" },
    29: { id: 29, name: "Mouton Nuage", img: "/cards/29 - Mouton Nuage.png" },
    30: { id: 30, name: "Astre Noir", img: "/cards/30 - Astre Noir.png" },
    31: { id: 31, name: "Petit Mouton", img: "/cards/31 - Petit Mouton.png" },
    32: { id: 32, name: "MoutMouton", img: "/cards/32 - MoutMouton.png" },
    33: { id: 33, name: "Mouton Bouffi Gris", img: "/cards/33 - Mouton Bouffi Gris.png" },
    35: { id: 35, name: "Lycos, Double Cœur", img: "/cards/35 - Lycos, Double Cœur.png" },
    36: { id: 36, name: "Statue de Pierre des Pastèques", img: "/cards/36 - Statue de Pierre des Pastèques.png" },
    37: { id: 37, name: "Demon N°19", img: "/cards/37 - Demon N°19.png" },
    38: { id: 38, name: "Chat Géant des Prairies", img: "/cards/38 - Chat Géant des Prairies.png" },
    39: { id: 39, name: "Magie Ancienne Atalante", img: "/cards/39 - Magie Ancienne Atalante.png" },
    42: { id: 42, name: "Crow", img: "/cards/42 - Crow.png" },
    45: { id: 45, name: "Déferlante Divine Atalante", img: "/cards/45 - Déferlante Divine Atalante.png" },
    46: { id: 46, name: "Zaeran'h", img: "/cards/46 - Zaeran'h.png" },
    53: { id: 53, name: "Bâton Électrique Atalante", img: "/cards/53 - Bâton Électrique Atalante.png" },
    58: { id: 58, name: "Poussière Enchantée", img: "/cards/58 - Poussière Enchantée.png" },
    59: { id: 59, name: "Fée Tailleur de Pierre", img: "/cards/59 - Fée Tailleur de Pierre.png" },
    67: { id: 67, name: "Exxeos", img: "/cards/67 - Exxeos.png" },
    70: { id: 70, name: "Gojou Sama", img: "/cards/70 - Gojou Sama.png" },
    72: { id: 72, name: "Crezcia", img: "/cards/72 - Crezcia.png" },
    73: { id: 73, name: "Déterré des Sables", img: "/cards/73 - Déterré des Sables.png" },
    74: { id: 74, name: "Guerrier Kakamöha", img: "/cards/74 - Guerrier Kakamöha.png" },
    83: { id: 83, name: "Élixir de Résurrection", img: "/cards/83 - Élixir de Résurrection.png" },
    90: { id: 90, name: "Explosion Synchro Ardente", img: "/cards/90 - Explosion Synchro Ardente.png" },
    108: { id: 108, name: "Libération des Dramos", img: "/cards/108 - Libération des Dramos.png" },
    113: { id: 113, name: "Sacralisation Requiem", img: "/cards/113 - Sacralisation Requiem.png" },
    114: { id: 114, name: "Heras, Égerie des Civilisations Antiques", img: "/cards/114 - Heras, Égerie des Civilisations Antiques.png" },
    124: { id: 124, name: "Jack Stubborn", img: "/cards/124 - Jack Stubborn.png" },
    125: { id: 125, name: "Plume du Héros", img: "/cards/125 - Plume du Héros.png" },

}