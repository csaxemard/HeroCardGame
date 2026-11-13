// --- App system types ---

export type Theme = "dark" | "light";


export type AppState = {
    // Constantes :
    appTitleBase: string,
    appVersion: string,
    // Mutables :
    currentTheme: Theme,
}



// Concernant les joueurs :
export type PlayerType = "opponent" | "player";



// --- Concernant les cartes ---
export type CardRole = "hero" | "darkHero" | "halfHero" | "multiHero" | "allied";
export type CardTyping = "Magie" | "Force" | "Plante" | "Feu" | "Eau" | "Vent";
export type AllySubRole = "sword" | "archer" | "shield" | "any";
export type Archetype = null | "WingsOfDestiny" | "ÂmesDamnées" | "any";
export type EffectKind = "continu" | "combat" | "invocation" | "cimetière" | "flip" | "reverse" | "rituel" | "contrecoup" | "contresort"
export interface CardDetails {
    id: number,
    name: string,
    img: string,
    role?: CardRole,
    type?: CardTyping, // 
    atk?: number | null,
    def?: number | null,
    stars?: number //
}



// --- Concernant le plateau ---

export type ZonesNames = "hero" | "swordL" | "swordR" | "shield" | "archerL" | "archerR" | "field" | "deck" | "extraDeck" | "graveyard" | "extraGraveyard" | "banished";
export type ZonesNamesByPlayer = {
    player: "hero" | "swordL" | "swordR" | "shield" | "archerL" | "archerR" | "field" | "deck" | "extraDeck" | "graveyard" | "extraGraveyard" | "banished";
    opponent: "hero" | "swordL" | "swordR" | "shield" | "archerL" | "archerR" | "field" | "deck" | "extraDeck" | "graveyard" | "extraGraveyard" | "banished";
}

export interface CardInstance {
    cardId: number;
    uuid: string;
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

export type PhaseType = | "draw" | "standby" | "flip" | "attack" | "shift" | "end"
export type PhaseStep =
    | "draw_start" | "draw_placeNormalHero" | "draw_drawCard" | "draw_end"
    | "standby_start" | "standby_end"
    | "flip_start" | "flip_end"
    | "attack_start" | "attack_end"
    | "shift_start" | "shift_end"
    | "endPhase_start" | "endPhase_end"

export type FightingZones = | "hero" | "swordL" | "swordR" | "archerL" | "archerR" | "shield"