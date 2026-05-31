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
    hasDrawnInitialCards: boolean;
    graveyard: number[],
    extraGraveyard: number[],
    banished: number[],
    numberOfCardsToDraw: number,
    normalInvocationsLeft: number,
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
    defeatCause: "noHeroesLeft" | "emptyDeck" | null
    firstPlayer: PlayerType | null,
    currentPlayer: PlayerType | null,
    player: PlayerState
    opponent: PlayerState,
}

interface ActionResult { success: boolean; error?: string; }
interface MatchManagerDebugOptions {
    skipDecideFirstPlayer?: PlayerType,
    opponentIsRandomBot?: boolean,
    autoInitialDraw?: boolean,
}



export class MatchManager {
    matchState: MatchState;
    debugOptions: MatchManagerDebugOptions;
    private subscribers: ((state: MatchState) => void)[] = [];

    constructor(playerDecks: PlayerDecks, opponentDecks: PlayerDecks, debugOptions: MatchManagerDebugOptions = {}) {
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
            defeatCause: null,
            firstPlayer: null,
            currentPlayer: null,
            player: {
                heroesLeft: 3,
                deck: playerDecks.deck,
                extraDeck: playerDecks.extraDeck,
                normalInvocationsLeft: 0,
                hand: [],
                graveyard: [],
                extraGraveyard: [],
                banished: [],
                numberOfCardsToDraw: 0,
                fightingZones: {
                    hero: null,
                    swordL: null,
                    swordR: null,
                    archerL: null,
                    archerR: null,
                    shield: null
                },
                hasDrawnInitialCards: false
            },
            opponent: {
                heroesLeft: 3,
                deck: opponentDecks.deck,
                extraDeck: opponentDecks.extraDeck,
                hand: [],
                graveyard: [],
                extraGraveyard: [],
                banished: [],
                normalInvocationsLeft: 0,
                numberOfCardsToDraw: 0,
                fightingZones: {
                    hero: null,
                    swordL: null,
                    swordR: null,
                    archerL: null,
                    archerR: null,
                    shield: null
                },
                hasDrawnInitialCards: false
            },
        }
    }

    uninitializeMatchManager() {
        document.removeEventListener("custom-onFirstPlayerChosen", this.startTurnsLoop)
        document.removeEventListener("custom-onMatchWon", this.startTurnsLoop)
    }

    subscribe(callback: (matchState: MatchState) => void): () => void {
        this.subscribers.push(callback);
        return () => { this.subscribers = this.subscribers.filter(cb => cb !== callback); };
    }

    /** - Trigger re-render de Match  */
    private emit() {
        this.subscribers.forEach(cb => cb(this.matchState));
    }




    // Etapes concernant le début du match
    startMatch() {
        addInfo(`${Object.keys(this.debugOptions).length != 0 ? "Debug options : " + Object.entries(this.debugOptions).filter(([_, val]) => val).map(([name]) => name).join(", ") : ""}`)
        addInfo(`--- Début du match ---`, true)
        this.decideFirstPlayer()

        // document.addEventListener("custom-onFirstPlayerChosen", this.startTurnsLoop)
    }

    private decideFirstPlayer() {
        addInfo("Lancer de pièce...")
        this.matchState.coinTossWinner = Math.random() < .5 ? "player" : "opponent"

        UiFunctions.set_currentLeftPanel("decidingFirstPlayer")

        if (this.debugOptions.skipDecideFirstPlayer) {
            setTimeout(() => {
                this.setFirstPlayer(this.debugOptions.skipDecideFirstPlayer!)
            }, 0);
            return
        }

        if (this.matchState.coinTossWinner == "opponent") {
            // Debug solo
            if (this.debugOptions.opponentIsRandomBot) {
                setTimeout(() => {
                    this.setFirstPlayer(Math.random() < .5 ? "player" : "opponent")
                }, 3000);
            }
        }
    }

    private startTurnsLoop = () => {
        // Fonction flêchée car eventlistener enlève l'accès au this sinon
        UiFunctions.set_currentLeftPanel("board")


        // chaque joueur mélange son deck
        for (const player of (["player", "opponent"] as PlayerType[])) this.shuffleDeck(player);
        // addInfo("Les decks ont été mélangés")


        // Chaque joueur pioche 4 cartes
        for (const player of (["player", "opponent"] as PlayerType[])) this.matchState[player].numberOfCardsToDraw = 4
        addInfo("Cliquez sur votre deck pour piocher vos 4 cartes de départ.")
        if (this.debugOptions.opponentIsRandomBot) {
            this.drawCard("opponent", 4)
            this.confirmInitialDraw("opponent")
        }
    }

    confirmInitialDraw(player: PlayerType) {
        if (this.matchState[player].numberOfCardsToDraw > 0) {
            return { success: false, error: `(${player}) Cartes restantes à piocher` };
        }

        this.matchState[player].hasDrawnInitialCards = true;

        if (this.matchState.player.hasDrawnInitialCards && this.matchState.opponent.hasDrawnInitialCards) {
            this.startTurn();
        }

        this.emit();
        return { success: true };
    }




    // Etapes concernant les tours et leurs phases
    private startTurn() {
        if (!this.matchState.turn) this.matchState.turn = 1
        else this.matchState.turn += 1

        addInfo(`Tour ${this.matchState.turn}`, true)

        if (![1, 2].includes(this.matchState.turn)) this.startDrawPhase()
        else {
            addInfo("Rappel : Aucun joueur ne pioche durant son premier tour.");
            this.startStandbyPhase()
        }
    }
    private startDrawPhase() {
        this.matchState.phase = "draw"
        addInfo(`\tDraw Phase`)


        const drawResult = this.drawCard(this.matchState.currentPlayer!, 1)
        if (drawResult.error == "Deck vide") {
            this.setWinner(this.matchState.currentPlayer === 'player' ? 'opponent' : 'player', "emptyDeck");
            return;
        }
        // this.startStandbyPhase()
    }
    private startStandbyPhase() {
        addInfo(`\tStandby Phase`)
        console.log("Method not implemented.");
    }
    private startFlipPhase() {
        console.log("Method not implemented.");
    }
    private startAttackPhase() {
        console.log("Method not implemented.");
    }
    private startShiftPhase() {
        console.log("Method not implemented.");
    }
    private startEndPhase() {
        console.log("Method not implemented.");
        prompt("end phase")
        if (!this.matchState.winner) {
            this.startTurn
        }
    }



    // Actions concernant les zones et les cartes
    shuffleDeck(player: PlayerType): void {
        const pState = this.matchState[player];
        for (let i = pState.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pState.deck[i], pState.deck[j]] = [pState.deck[j], pState.deck[i]];
        }
        addInfo(`(${player}) Le Deck a été mélangé.`)
        this.emit();
    }

    drawCard(player: PlayerType, numberOfCardsToDraw: number): ActionResult {
        const pState = this.matchState[player];
        const deck = pState.deck;

        for (let i = 0; i < numberOfCardsToDraw; i++) {
            if (deck.length === 0) {
                addInfo("Deck vide. Impossible de piocher")
                return { success: false, error: 'Deck vide' };
            }

            if (pState.numberOfCardsToDraw <= 0) {
                addInfo(`(${player}) Vous n'etes pas autorisé à piocher`)
                return { success: false, error: 'unauthorizedDraw' };
            }

            const cardId = deck.shift()!;
            pState.hand.push(cardId);
            this.matchState[player].numberOfCardsToDraw--;
        }
        this.emit();
        return { success: true };
    }


    // Actions concernant l'exécution du match
    setFirstPlayer(firstPlayer: PlayerType) {
        this.matchState.currentPlayer = firstPlayer
        this.emit();

        addInfo(this.matchState.currentPlayer == "player" ? "Vous commencerez la partie." : "Le joueur adverse commencera la partie.")
        this.startTurnsLoop()
        // document.dispatchEvent(new CustomEvent("custom-onFirstPlayerChosen", { cancelable: true, bubbles: true }))
    }
    setWinner(winner: PlayerType, defeatCause: "noHeroesLeft" | "emptyDeck") {
        this.matchState.winner = winner
        this.matchState.defeatCause = defeatCause
        addInfo(this.matchState.winner == "player" ? "Vous remportez la partie" : "L'adversaire remporte la partie")
        this.emit()
    }



    // Fonctions debug
    addRandomCardToHand(playerToGiveCard: PlayerType) {
        this.matchState[playerToGiveCard].hand.push(getRandomCardId())
        this.emit();
    }
    killPlayer(player: PlayerType, defeatCause: "noHeroesLeft" | "emptyDeck") {
        this.setWinner(player === 'player' ? 'opponent' : 'player', defeatCause);
    }
}
