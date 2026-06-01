// --- App system types ---

export type Theme = "dark" | "light";


export type AppState = {
    // Constantes :
    appTitleBase: string,
    appVersion: string,
    // Mutables :
    currentTheme: Theme,
}



// --- Concernant les cartes et le plateau ---

export type PlayerType = "opponent" | "player";
export type CardRoles = "hero" | "darkHero" | "halfHero" | "multiHero" | "monster" | "field";
export type MonsterSubRoles = "fighter" | "shield" | "archer";
export type CardTypes = "opponent" | "player";
export type ZonesNames = "hero" | "swordL" | "swordR" | "shield" | "archerL" | "archerR" | "field" | "deck" | "extraDeck" | "graveyard" | "extraGraveyard" | "banished";
export type ZonesNamesByPlayer = {
    player: "hero" | "swordL" | "swordR" | "shield" | "archerL" | "archerR" | "field" | "deck" | "extraDeck" | "graveyard" | "extraGraveyard" | "banished";
    opponent: "hero" | "swordL" | "swordR" | "shield" | "archerL" | "archerR" | "field" | "deck" | "extraDeck" | "graveyard" | "extraGraveyard" | "banished";
}

export interface CardType { id: number, name: string, type?: "hero" | "monster", img: string }
export interface CardInstance {
    cardId: number;
    uuid: string; // UUID
}

export interface ZoneConfig {
    readableName: string;
    gridRowStart?: number;
    gridColStart?: number;
    isDisabled?: boolean;
    isDeck?: boolean;
    isGraveyard?: boolean;
    isExtra?: boolean;
}

/**
 * - Peut être une Card, ou autre chose, mais qui sera le node enfant de la zone
 */
export type ZoneContent = React.ReactNode
// restreindre un type à un Component ?
// ReactElement<typeof Card> | ReactElement<typeof Deck> | null;
// ou :
// ReactElement<CardProps> | ReactElement<DeckProps> | null;

// Card ? Si card, et pour le deck je mets card aussi ou deck ? Demander à gpt si je deck et extradeck dans le meme component Desck avec un boolean isExtraDeck et un autre isSupraDeck etc, ou si je dois faire un component séparé pour chacun

export type CardZoneContent = { cardId?: number };
export type DeckZoneContent = { numberOfCards: number };
export type GraveyardZoneContent = { cardIds: number[] };

export type HalfBoardZonesContent = {
    hero: CardZoneContent,
    swordL: CardZoneContent,
    swordR: CardZoneContent,
    shield: CardZoneContent,
    archerL: CardZoneContent,
    archerR: CardZoneContent,
    field: CardZoneContent,
    deck: DeckZoneContent,
    extraDeck: DeckZoneContent,
    graveyard: GraveyardZoneContent,
    extraGraveyard: GraveyardZoneContent,
    banished: GraveyardZoneContent,
}

export type BoardZonesConfig = Record<PlayerType, Record<ZonesNames, ZoneConfig>>;
export type BoardZonesContent = Record<PlayerType, HalfBoardZonesContent>;



// --- Conernant les matchs ---


