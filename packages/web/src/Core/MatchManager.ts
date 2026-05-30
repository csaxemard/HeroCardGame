import type { PlayerType } from "@/types";
import { addInfo } from "@/Components/MatchUI/InfosBox";

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
        addInfo("--- Début du match ---")
        this.decideFirstPlayer()
        while (!this.matchState.winner) {
            this.startTurn()
        }
    }

    // Actions concernant tour 0
    decideFirstPlayer() {
        addInfo("Lancer de pièce...")
        const coinTossWinner = Math.random() < .5 ? "player" : "opponent"

        let choice;
        if (coinTossWinner == "player") {
            addInfo("Vous décidez qui commence.")
            choice = !this.debug ? prompt("Quel joueur commence ?\n1 : Vous | 2 : Adversaire") : "1" 
        } else {
            addInfo("Le joueur adverse décide qui commence.")
            if (this.debug) {
                choice = "1"
            } else {
                choice = prompt("Cher adversaire. Quel joueur commence ?\n1 : Vous | 2 : Adversaire")
            }
        }
        
        this.matchState.currentPlayer = choice == "1" ? "player" : "opponent"
        addInfo(this.matchState.currentPlayer == "player" ? "Vous commencez la partie." : "Le joueur adverse commence la partie.")
    }

    // Actions concernant match phase duel
    /**
     * 
     */
    startTurn() {
        this.matchState.turn! += 1
        addInfo(`Tour ${this.matchState.turn} :`)
        addInfo(`\tPhase: ${this.matchState.phase}`)
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
