import type { PlayerType } from "@/types";
import { addInfo } from "@/Components/MatchUI/InfosBox";
import { UiFunctions } from "@/Views/Match";
import { getRandomCardId } from "@/cards";

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
    firstPlayer: PlayerType | null,
    currentPlayer: PlayerType | null,
    player: PlayerState
    opponent: PlayerState,
}

interface MatchStateDebugOptions {
    shouldSkipDecidesFirstPlayer?: PlayerType
}



export class MatchManager {
    matchState: MatchState;
    debugOptions: MatchStateDebugOptions;
    private subscribers: ((state: MatchState) => void)[] = [];

    constructor(playerDecks: PlayerDecks, opponentDecks: PlayerDecks, debugOptions: MatchStateDebugOptions = {}) {
        this.matchState = this.initializeState(playerDecks, opponentDecks)
        this.debugOptions = debugOptions;
    }

    // Config
    private initializeState(playerDecks: PlayerDecks, opponentDecks: PlayerDecks): MatchState {
        return {
            turn: null,
            phase: null,
            coinTossWinner: null,
            winner: null,
            firstPlayer: null,
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
    uninitializeMatchManager() {
        document.removeEventListener("custom-onFirstPlayerChosen", this.startTurnsLoop)
        document.removeEventListener("custom-onMatchWon", this.startTurnsLoop)
    }

    subscribe(callback: (state: MatchState) => void): () => void {
        this.subscribers.push(callback);
        return () => { this.subscribers = this.subscribers.filter(cb => cb !== callback); };
    }

    private emit() {
        this.subscribers.forEach(cb => cb(this.matchState));
    }




    // Match phases
    startMatch() {
        addInfo(`--- Début du match ---\n${Object.keys(this.debugOptions).length != 0 ? "Debug options : " + Object.entries(this.debugOptions).filter(([_, val]) => val).map(([name]) => name).join(", ") : ""}`)
        this.decideFirstPlayer()

        document.addEventListener("custom-onFirstPlayerChosen", this.startTurnsLoop)
    }
    private startTurnsLoop = () => {
        // Fonction flêchée car eventlistener enlève l'accès au this sinon
        UiFunctions.set_currentLeftPanel("board")
        
        this.startTurn()
    }
    // Actions concernant le début du match
    decideFirstPlayer() {
        addInfo("Lancer de pièce...")
        this.matchState.coinTossWinner = Math.random() < .5 ? "player" : "opponent"

        UiFunctions.set_currentLeftPanel("decidingFirstPlayer")

        if (this.debugOptions.shouldSkipDecidesFirstPlayer) {
            setTimeout(() => {
                this.setFirstPlayer(this.debugOptions.shouldSkipDecidesFirstPlayer!)
            }, 0);
            return
        }

        // Debug solo
        if (this.matchState.coinTossWinner == "opponent") {
            setTimeout(() => {
                this.setFirstPlayer(Math.random() < .5 ? "player" : "opponent")
            }, 5000);
        }
    }

    // Actions concernant match phase duel
    startTurn() {
        if (!this.matchState.turn) this.matchState.turn = 0
        else this.matchState.turn += 1

        addInfo(`Tour ${this.matchState.turn ? "initial" : this.matchState.turn}`)
        addInfo(`\tPhase: ${this.matchState.phase}`)
        if (this.matchState.turn !== 1) this.startDrawPhase()
        this.startStandbyPhase()
        this.startFlipPhase()
        this.startAttackPhase()
        this.startShiftPhase()
        setTimeout(() => {
            this.startEndPhase()
        }, 5000);
    }
    startDrawPhase() {
        addInfo(`Tour ${this.matchState.turn} : Draw Phase`)
        if (this.matchState[this.matchState.currentPlayer!].deck.length <= 0) {
            this.setWinner(this.matchState.currentPlayer!)
        }
        console.log("Method not implemented.");
    }
    startStandbyPhase() {
        console.log("Method not implemented.");
    }
    startFlipPhase() {
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
        prompt("end phase")
        if (!this.matchState.winner) {
            this.startTurn
        }
    }


    // Actions concernant match phase end



    // Wrappers de setters :
    setFirstPlayer(firstPlayer: PlayerType) {
        this.matchState.currentPlayer = firstPlayer
        this.emit();

        addInfo(this.matchState.currentPlayer == "player" ? "Vous commencez la partie." : "Le joueur adverse commence la partie.")
        document.dispatchEvent(new CustomEvent("custom-onFirstPlayerChosen", { cancelable: true, bubbles: true }))
    }
    setWinner(winner: PlayerType) {
        this.matchState.winner = winner
        addInfo(this.matchState.winner == "player" ? "Félicitations, vous remportez la partie." : "Le joueur adverse remporte la partie.")
        document.dispatchEvent(new CustomEvent("custom-onMatchWon", { cancelable: true, bubbles: true }))
    }
    // add38() {
    //     this.matchState.opponent.hand.push(getRandomCardId())
    //     this.emit();
    // }
    // add38p() {
    //     this.matchState.player.hand.push(getRandomCardId())
    //     this.emit();
    // }
}
