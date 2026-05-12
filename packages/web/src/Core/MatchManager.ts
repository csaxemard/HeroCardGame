import type { PlayerType } from "@/types";


interface PlayerDecks { deck: number[]; extraDeck: number[]; };
type FightingZoneContent = number | null;

/**
 * - Contains the state of each players sides during match
 */
interface PlayerState {
    heroesLeft: number
    deck: number[],
    extraDeck: number[],
    hand: number[],
    graveyard: number[],
    extraGraveyard: number[],
    banished: number[],
    fightingZones: {
        hero: FightingZoneContent,
        swordL: FightingZoneContent,
        swordR: FightingZoneContent,
        archerL: FightingZoneContent,
        archerR: FightingZoneContent,
        shield: FightingZoneContent,
    };
}

/**
 * - Contains the state of the match
 */
interface MatchState {
    turn: number | null,
    phase: "draw" | "standby" | "flip" | "attack" | "shift" | "end" | null,
    coinTossWinner: PlayerType | null,
    winner: PlayerType | null,
    currentPlayer: PlayerType | null,
    player: PlayerState
    opponent: PlayerState,
}




export class MatchManager {
    matchState: MatchState;
    debug: boolean;

    constructor(playerDecks: PlayerDecks, opponentDecks: PlayerDecks, debug: boolean = false) {
        this.matchState = this.initializeState(playerDecks, opponentDecks)
        this.debug = debug;
    }

    // Config
    private initializeState(playerDecks: PlayerDecks, opponentDecks: PlayerDecks): MatchState {
        return {
            turn: null,
            phase: null,
            coinTossWinner: null,
            winner: null,
            currentPlayer: null,
            player: {
                heroesLeft: 3,
                deck: playerDecks.deck,
                extraDeck: playerDecks.extraDeck,
                hand: [],
                graveyard: [],
                extraGraveyard: [],
                banished: [],
                fightingZones: {
                    hero: null,
                    swordL: null,
                    swordR: null,
                    archerL: null,
                    archerR: null,
                    shield: null
                },
            },
            opponent: {
                heroesLeft: 3,
                deck: opponentDecks.deck,
                extraDeck: opponentDecks.extraDeck,
                hand: [],
                graveyard: [],
                extraGraveyard: [],
                banished: [],
                fightingZones: {
                    hero: null,
                    swordL: null,
                    swordR: null,
                    archerL: null,
                    archerR: null,
                    shield: null
                },
            },
        }
    }

    // Match phases
    startMatch() {
        this.matchState.turn = 0
        console.log("--- Début du match ---")
        this.decideFirstPlayer()
        while (!this.matchState.winner) {
            this.startTurn()
        }
    }

    // Actions concernant tour 0
    decideFirstPlayer() {
        console.log("Lancer de pièce...")
        const coinTossWinner = Math.random() < .5 ? "player" : "opponent"
        let choice; let asking = true;
        do {
            if (coinTossWinner == "player") {
                console.log("Vous décidez qui commence.")
                if (this.debug) {
                    choice = "1"
                } else {
                    choice = prompt("Quel joueur commence ?\n1 : Vous | 2 : Adversaire")
                }
            } else {
                console.log("Le joueur adverse décide qui commence.")
                if (this.debug) {
                    choice = "1"
                } else {
                    choice = prompt("Cher adversaire. Quel joueur commence ?\n1 : Vous | 2 : Adversaire")
                }
            }
            if (choice == "1" || choice == "2") asking = false
        } while (asking);
        this.matchState.currentPlayer = choice == "1" ? "player" : "opponent"
        console.log(this.matchState.currentPlayer == "player" ? "Vous commencez la partie." : "Le joueur adverse commence la partie.")
    }

    // Actions concernant match phase duel
    /**
     * 
     */
    startTurn() {
        this.matchState.turn! += 1
        console.log(`Tour ${this.matchState.turn} :`)
        console.log(`\tPhase: ${this.matchState.phase}`)
        if (this.matchState.turn !== 1) this.startDrawPhase()
        this.startStandbyPhase()
        this.startFlipPhase()
        this.startAttackPhase()
        this.startShiftPhase()
        this.startEndPhase()
    }
    startDrawPhase() {
        console.log("Draw Phase")
        console.log("Method not implemented.");
    }
    startAttackPhase() {
        console.log("Method not implemented.");
    }
    startShiftPhase() {
        console.log("Method not implemented.");
    }
    startEndPhase() {
        console.log("Method not implemented.");
    }
    startFlipPhase() {
        console.log("Method not implemented.");
    }
    startStandbyPhase() {
        console.log("Method not implemented.");
        prompt("Fin du tour")
    }


    // Actions concernant match phase end
}
