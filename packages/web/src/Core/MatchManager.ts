import type { CardInstance, FightingZones, PhaseStep, PhaseType, PlayerType } from "@/types";
import { addInfo } from "@/Components/MatchUI/InfosBox";
import { allCards, getRandomCardId } from "@/cards";
import { v4 as uuidv4 } from 'uuid';


interface PlayerDecks { deck: number[]; extraDeck: number[]; };

/**
 * - Contains the state of each players sides during match
 */
interface PlayerState {
    heroesLeft: number
    hasDrawnInitialCards: boolean;
    numberOfCardsToDraw: number,
    normalInvocationsLeft: number,
    deck: CardInstance[],
    extraDeck: CardInstance[],
    hand: CardInstance[],
    graveyard: CardInstance[],
    extraGraveyard: CardInstance[],
    banished: CardInstance[],
    fightingZones: {
        hero: CardInstance[],
        swordL: CardInstance | null,
        swordR: CardInstance | null,
        archerL: CardInstance | null,
        archerR: CardInstance | null,
        shield: CardInstance | null,
    };
}

/**
 * - Contains the state of the match
 */
interface MatchState {
    // Etapes du match
    matchStep: "matchStart" | "decidingFirstPlayer" | "turnsLoop" | "matchWon" | null;
    turn: number | null,
    phase: PhaseType | null,
    phaseStep: PhaseStep | null,
    // Trucs définis qu'une fois
    coinTossWinner: PlayerType | null,
    winner: PlayerType | null,
    defeatCause: "noHeroesLeft" | "emptyDeck" | null
    firstPlayer: PlayerType | null,
    // Le reste
    canChangePhase: boolean,
    currentPlayer: PlayerType | null,
    player: PlayerState
    opponent: PlayerState,
}

interface ActionResult { success: boolean; error?: string; }
interface MatchManagerDebugOptions {
    skipDecideFirstPlayer?: PlayerType,
    opponentIsRandomBot?: boolean,
    shouldPlayerAutoPlay?: boolean,
}

export type MatchEvent =
    | { type: 'matchStepChanged'; matchStep: "matchStart" | "decidingFirstPlayer" | "turnsLoop" | "matchWon" }
    | { type: 'startedDecidingFirstPlayer' }
    | { type: 'startedTurnsLoop' }
    | { type: 'turnChanged' }
    | { type: 'phaseChanged'; phase: PhaseType }
    | { type: 'phaseReset'; }
    | { type: 'drawPhase_stepChanged', phaseStep: PhaseStep }
    | { type: 'standbyPhase_stepChanged', phaseStep: string }
    | { type: 'flipPhase_stepChanged', phaseStep: string }
    | { type: 'attackPhase_stepChanged', phaseStep: string }
    | { type: 'shiftPhase_stepChanged', phaseStep: string }
    | { type: 'endPhase_stepChanged', phaseStep: string }
    | { type: 'matchWon'; winner: PlayerType; defeatCause: 'noHeroesLeft' | 'emptyDeck' }
    | { type: 'cardDrawn'; player: PlayerType; uuid: string }
    | { type: 'cardMoved'; cardId: number; from: string; to: string; uuid: string }
    | { type: 'panelChange'; panel: 'decidingFirstPlayer' | 'board' }
    ;


export class MatchManager {
    matchState: MatchState;
    debugOptions: MatchManagerDebugOptions;
    private subscribers: ((state: MatchState) => void)[] = [];
    lastDrawnCard: { player: PlayerType, cardId: number, timestamp: number } | null | undefined;
    private eventListeners: ((event: MatchEvent) => void)[] = [];

    constructor(playerDecks: PlayerDecks, opponentDecks: PlayerDecks, debugOptions: MatchManagerDebugOptions = {}) {
        this.matchState = this.initializeState(playerDecks, opponentDecks)
        this.debugOptions = debugOptions;
    }

    // Config
    private initializeState(playerDecks: PlayerDecks, opponentDecks: PlayerDecks): MatchState {
        return {
            matchStep: null,
            turn: null,
            phase: null,
            canChangePhase: false,
            coinTossWinner: null,
            winner: null,
            defeatCause: null,
            firstPlayer: null,
            currentPlayer: null,
            phaseStep: null,
            player: {
                heroesLeft: 3,
                deck: playerDecks.deck.map(cardId => ({ cardId, uuid: uuidv4() })),
                extraDeck: playerDecks.extraDeck.map(cardId => ({ cardId, uuid: uuidv4() })),
                normalInvocationsLeft: 0,
                hand: [],
                graveyard: [],
                extraGraveyard: [],
                banished: [],
                numberOfCardsToDraw: 0,
                fightingZones: {
                    hero: [],
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
                deck: opponentDecks.deck.map(cardId => ({ cardId, uuid: uuidv4() })),
                extraDeck: opponentDecks.extraDeck.map(cardId => ({ cardId, uuid: uuidv4() })),
                hand: [],
                graveyard: [],
                extraGraveyard: [],
                banished: [],
                normalInvocationsLeft: 0,
                numberOfCardsToDraw: 0,
                fightingZones: {
                    hero: [],
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

    subscribe(callback: (matchState: MatchState) => void): () => void {
        this.subscribers.push(callback);
        return () => { this.subscribers = this.subscribers.filter(cb => cb !== callback); };
    }

    /** - Trigger re-render de Match  */
    private emit() {
        this.subscribers.forEach(cb => cb(this.matchState));
    }

    onEvent(callback: (event: MatchEvent) => void) {
        this.eventListeners.push(callback);
    }

    private emitEvent(event: MatchEvent) {
        this.eventListeners.forEach(cb => cb(event));
    }




    // Etapes concernant le début du match
    startMatch() {
        addInfo(`${Object.keys(this.debugOptions).length != 0 ? "Debug options : " + Object.entries(this.debugOptions).filter(([_, val]) => val).map(([name]) => name).join(", ") : ""}`)

        this.matchState.matchStep = "matchStart"
        this.emitEvent({ type: "matchStepChanged", matchStep: "matchStart" });
        addInfo(`--- Début du match ---`, true)

        this.goToNextStep()
    }

    private decideFirstPlayer() {
        this.matchState.matchStep = "decidingFirstPlayer"
        this.emitEvent({ type: "matchStepChanged", matchStep: "decidingFirstPlayer" });
        this.matchState.coinTossWinner = Math.random() < .5 ? "player" : "opponent"
        addInfo((this.matchState.coinTossWinner == "player" ? `Vous décidez` : "L'adversaire décide") + " qui commence...")

        if (this.debugOptions.skipDecideFirstPlayer) {
            const result = this.setFirstPlayer(this.debugOptions.skipDecideFirstPlayer!)
            if (!result.success) console.log(result.error)
            else this.goToNextStep()
        } else if (this.matchState.coinTossWinner == "opponent" && this.debugOptions.opponentIsRandomBot) {
            const result = this.setFirstPlayer(Math.random() < .5 ? "player" : "opponent")
            if (!result.success) console.log(result.error)
            else this.goToNextStep()
        }
        // else on attend que le currPlayer appuie sur un des boutons qui trigger gotonext
    }

    private startTurnsLoop() {
        this.matchState.matchStep = "turnsLoop"
        this.emitEvent({ type: "matchStepChanged", matchStep: "turnsLoop" })

        // chaque joueur mélange son deck
        for (const player of (["player", "opponent"] as PlayerType[])) this.shuffleDeck(player);

        // Chaque joueur pioche 4 cartes
        for (const player of (["player", "opponent"] as PlayerType[])) this.matchState[player].numberOfCardsToDraw = 4
        addInfo("Cliquez sur votre deck pour piocher vos 4 cartes de départ.")

        if (this.debugOptions.opponentIsRandomBot) {
            const result = this.drawCards("opponent", this.matchState.opponent.numberOfCardsToDraw)
            if (!result.success) console.log(result.error)
            else this.confirmInitialDraw("opponent")
        }
        // if (this.debugOptions.shouldPlayerAutoPlay) {
        //     setTimeout(() => {
        //         this.drawCards("player", 4)
        //         this.confirmInitialDraw("player")
        //     }, 1000);
        // }
    }

    confirmInitialDraw(player: PlayerType) {
        if (this.matchState[player].numberOfCardsToDraw > 0) {
            addInfo(`(${player}) Erreur : Cartes restantes à piocher`);
            return
        }
        this.matchState[player].hasDrawnInitialCards = true;
        this.emit();
        this.goToNextStep()
    }




    // Etapes concernant les tours et leurs phases
    private startTurn() {
        // Vérifications variables nécessaires
        if (!this.matchState.currentPlayer) { console.error("(MatchManager.startTurn) Erreur matchState.currentPlayer est null"); return };

        // Increment turn
        if (!this.matchState.turn) this.matchState.turn = 1
        else this.matchState.turn += 1
        this.emit()

        // switch player
        if (this.matchState.turn != 1) {
            this.matchState.currentPlayer = this.matchState.currentPlayer === "player" ? "opponent" : "player"
            this.emit()
        }

        if (this.matchState.currentPlayer) {
            this.matchState[this.matchState.currentPlayer].normalInvocationsLeft = 1;
        }

        this.emitEvent({ type: "turnChanged" })
        addInfo(`--- Tour ${this.matchState.turn} ---\n${this.getPlayerReadableName(this.matchState.currentPlayer)}`, true)

        this.goToNextStep()
    }

    private startDrawPhase() {
        this.matchState.phase = "draw"
        this.emit()
        this.emitEvent({ type: "phaseChanged", phase: this.matchState.phase })
        addInfo(`\t• ${this.getPhaseReadableName(this.matchState.phase)}`)

        this.matchState.phaseStep = "draw_start"
        this.emit()
        this.emitEvent({ type: "drawPhase_stepChanged", phaseStep: this.matchState.phaseStep })

        this.goToNextStep()
    }
    private drawPhase_placeNormalHero() {
        // Vérifications variables nécessaires !
        if (!this.matchState.currentPlayer) { console.error("(MatchManager.startDrawPhase) Erreur matchState.currentPlayer est null"); return };
        if (!this.matchState.turn) { console.error("(MatchManager.startDrawPhase) Erreur matchState.turn est null"); return };

        this.matchState.phaseStep = 'draw_placeNormalHero';
        this.emitEvent({ type: 'drawPhase_stepChanged', phaseStep: 'draw_placeNormalHero' });
        this.emit();

        addInfo("Choisissez votre héros")

        if (this.matchState.currentPlayer == "opponent" && this.debugOptions.opponentIsRandomBot) {
            const result = this.placeNormalHero("opponent", this.matchState.opponent.extraDeck[0].uuid)
            if (!result.success) console.log(result.error)
            else this.goToNextStep()
        }
        // } else if (this.matchState.currentPlayer == "player" && this.debugOptions.shouldPlayerAutoPlay) {
        //     setTimeout(() => {
        //         const result = this.placeNormalHero("player", this.matchState.player.extraDeck[Math.floor(Math.random() * this.matchState.player.extraDeck.length)].uuid)
        //         if (result.success) this.goToNextStep()
        //     }, 1000);
        // }
    }
    private drawPhase_drawCard() {
        // Vérifications variables nécessaires !
        if (!this.matchState.currentPlayer) { console.error("(MatchManager.startDrawPhase) Erreur matchState.currentPlayer est null"); return };
        if (!this.matchState.turn) { console.error("(MatchManager.startDrawPhase) Erreur matchState.turn est null"); return };

        this.matchState.phaseStep = 'draw_drawCard';
        this.emit()
        this.emitEvent({ type: 'drawPhase_stepChanged', phaseStep: this.matchState.phaseStep });

        this.matchState[this.matchState.currentPlayer].numberOfCardsToDraw = 1;
        this.emit()

        if (this.matchState.currentPlayer == "opponent" && this.debugOptions.opponentIsRandomBot) {
            const result = this.drawCards("opponent", this.matchState.opponent.numberOfCardsToDraw)
            if (!this.matchState.opponent.hasDrawnInitialCards) this.confirmInitialDraw("opponent")
            if (result.success) this.goToNextStep()
            else if (result.error == "emptyDeck" && this.matchState.phase == "draw" && this.matchState.phaseStep == "draw_drawCard" && this.matchState.currentPlayer) {
                this.setWinner(this.matchState.currentPlayer, "emptyDeck")
            }
        }
        // if (this.matchState.currentPlayer == "player" && this.debugOptions.shouldPlayerAutoPlay) {
        //     draw()
        // }
        // Si pas autoplay, l'UI appellera drawCards puis goToNextPhase
    }
    private drawPhase_end() {
        this.matchState.phaseStep = 'draw_end';
        this.emit()
        this.emitEvent({ type: 'drawPhase_stepChanged', phaseStep: this.matchState.phaseStep });

        if (this.debugOptions.opponentIsRandomBot && this.matchState.currentPlayer === "opponent") {
            this.goToNextPhase()
        }
    }

    private startStandbyPhase() {
        this.matchState.phase = "standby"
        this.emit()
        this.emitEvent({ type: "phaseChanged", phase: this.matchState.phase })
        addInfo(`\t• ${this.getPhaseReadableName(this.matchState.phase)}`)

        this.matchState.phaseStep = "standby_start"
        this.emit()
        this.emitEvent({ type: "standbyPhase_stepChanged", phaseStep: this.matchState.phaseStep })

        this.goToNextStep()
    }
    private standbyPhase_end() {
        this.matchState.phaseStep = "standby_end"
        this.emit()
        this.emitEvent({ type: "standbyPhase_stepChanged", phaseStep: this.matchState.phaseStep })

        if (this.debugOptions.opponentIsRandomBot && this.matchState.currentPlayer === "opponent") {
            this.opponentSummonMonsterIfPossible();
            this.goToNextPhase()
        }
    }

    private startFlipPhase() {
        this.matchState.phase = "flip"
        this.emit()
        this.emitEvent({ type: "phaseChanged", phase: this.matchState.phase })
        addInfo(`\t• ${this.getPhaseReadableName(this.matchState.phase)}`)

        this.matchState.phaseStep = "flip_start"
        this.emit()
        this.emitEvent({ type: "flipPhase_stepChanged", phaseStep: this.matchState.phaseStep })

        this.goToNextStep()
    }
    private flipPhase_end() {
        this.matchState.phaseStep = "flip_end"
        this.emit()
        this.emitEvent({ type: "flipPhase_stepChanged", phaseStep: this.matchState.phaseStep })

        if (this.debugOptions.opponentIsRandomBot && this.matchState.currentPlayer === "opponent") {
            this.goToNextPhase()
        }
    }

    private startAttackPhase() {
        this.matchState.phase = "attack"
        this.emit()
        this.emitEvent({ type: "phaseChanged", phase: this.matchState.phase })
        addInfo(`\t• ${this.getPhaseReadableName(this.matchState.phase)}`)

        this.matchState.phaseStep = "attack_start"
        this.emit()
        this.emitEvent({ type: "attackPhase_stepChanged", phaseStep: this.matchState.phaseStep })

        this.goToNextStep()
    }
    private attackPhase_end() {
        this.matchState.phaseStep = "attack_end"
        this.emit()
        this.emitEvent({ type: "attackPhase_stepChanged", phaseStep: this.matchState.phaseStep })

        if (this.debugOptions.opponentIsRandomBot && this.matchState.currentPlayer === "opponent") {
            this.opponentAttackIfPossible();
            this.goToNextPhase()
        }
    }
    private startShiftPhase() {
        this.matchState.phase = "shift"
        this.emit()
        this.emitEvent({ type: "phaseChanged", phase: this.matchState.phase })
        addInfo(`\t• ${this.getPhaseReadableName(this.matchState.phase)}`)

        this.matchState.phaseStep = "shift_start"
        this.emit()
        this.emitEvent({ type: "shiftPhase_stepChanged", phaseStep: this.matchState.phaseStep })

        this.goToNextStep()
    }
    private shiftPhase_end() {
        this.matchState.phaseStep = "shift_end"
        this.emit()
        this.emitEvent({ type: "shiftPhase_stepChanged", phaseStep: this.matchState.phaseStep })

        if (this.debugOptions.opponentIsRandomBot && this.matchState.currentPlayer === "opponent") {
            this.goToNextPhase()
        }
    }

    private startEndPhase() {
        this.matchState.phase = "end"
        this.emit()
        this.emitEvent({ type: "phaseChanged", phase: this.matchState.phase })
        addInfo(`\t• ${this.getPhaseReadableName(this.matchState.phase)}`)

        this.matchState.phaseStep = "endPhase_start"
        this.emit()
        this.emitEvent({ type: "endPhase_stepChanged", phaseStep: this.matchState.phaseStep })

        this.goToNextStep()
    }
    private endPhase_end() {
        this.matchState.phaseStep = "endPhase_end"
        this.emit()
        this.emitEvent({ type: "endPhase_stepChanged", phaseStep: this.matchState.phaseStep })

        if (this.debugOptions.opponentIsRandomBot && this.matchState.currentPlayer === "opponent") {
            this.goToNextPhase()
        }
    }



    // Actions concernant l'exécution du match
    setFirstPlayer(firstPlayer: PlayerType): ActionResult {
        this.matchState.currentPlayer = firstPlayer
        this.emit();

        addInfo(this.matchState.currentPlayer == "player" ? "Vous commencerez la partie." : "Le joueur adverse commencera la partie.")
        return { success: true }
    }

    setWinner(winner: PlayerType, defeatCause: "noHeroesLeft" | "emptyDeck") {
        this.matchState.winner = winner
        this.matchState.defeatCause = defeatCause
        addInfo(this.matchState.winner == "player" ? "Vous remportez la partie" : "L'adversaire remporte la partie")
        this.emit()
    }

    goToNextPhase() {
        switch (this.matchState.phase) {
            case "draw":
                this.matchState.canChangePhase = false
                this.startStandbyPhase()
                break;
            case "standby":
                this.matchState.canChangePhase = false
                this.startFlipPhase()
                break;
            case "flip":
                this.matchState.canChangePhase = false
                this.startAttackPhase()
                break;
            case "attack":
                this.matchState.canChangePhase = false
                this.startShiftPhase()
                break;
            case "shift":
                this.matchState.canChangePhase = false
                this.startEndPhase()
                break;
            case "end":
                this.matchState.canChangePhase = false
                if (!this.matchState.winner) {
                    this.matchState.phase = null
                    this.emit()
                    this.emitEvent({ type: "phaseReset" })
                    this.matchState.phaseStep = null
                    this.startTurn()
                } else return;
                break;
            default:
                break;
        }
    }
    goToNextStep() {
        switch (this.matchState.matchStep) {
            case "matchStart":
                this.decideFirstPlayer()
                break;
            case "decidingFirstPlayer":
                this.startTurnsLoop()
                break;
            case "turnsLoop":
                if (!this.matchState.phase) {
                    if (!this.matchState.turn) {
                        if (this.matchState.player.hasDrawnInitialCards && this.matchState.opponent.hasDrawnInitialCards) {
                            this.startTurn();
                        }
                    } else {
                        this.startDrawPhase()
                    }
                } else {
                    // 
                    switch (this.matchState.phase) {
                        case "draw":
                            // 
                            switch (this.matchState.phaseStep) {
                                case "draw_start":
                                    if (
                                        this.matchState.turn && this.matchState.currentPlayer &&
                                        ([1, 2].includes(this.matchState.turn) || this.matchState[this.matchState.currentPlayer].fightingZones.hero?.length == 0)
                                    ) {
                                        if (this.matchState.currentPlayer &&
                                            // dev Bug : should check if non normal hero in extra deck
                                            this.matchState[this.matchState.currentPlayer].extraDeck.length === 0
                                        ) {
                                            this.setWinner(this.matchState.currentPlayer == "player" ? "opponent" : "player", "noHeroesLeft")
                                            return
                                        } else {
                                            this.drawPhase_placeNormalHero()
                                        }
                                    } else {
                                        this.drawPhase_drawCard()
                                    }
                                    break;
                                case 'draw_placeNormalHero':
                                    if (this.matchState.turn && ![1, 2].includes(this.matchState.turn)) {
                                        this.drawPhase_drawCard()
                                    } else {
                                        addInfo("Rappel : Aucun joueur ne pioche durant son premier tour.");
                                        this.matchState.canChangePhase = true
                                        this.emit()
                                        this.drawPhase_end()
                                    }
                                    break;
                                case 'draw_drawCard':
                                    this.matchState.canChangePhase = true
                                    this.emit()
                                    this.drawPhase_end()
                                    break;
                                case "draw_end":
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case "standby":
                            switch (this.matchState.phaseStep) {
                                case "standby_start":
                                    this.matchState.canChangePhase = true
                                    this.emit()
                                    this.standbyPhase_end()
                                    break;
                                case "standby_end":
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case "flip":
                            switch (this.matchState.phaseStep) {
                                case "flip_start":
                                    this.matchState.canChangePhase = true
                                    this.emit()
                                    this.flipPhase_end()
                                    break;
                                case "flip_end":
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case "attack":
                            switch (this.matchState.phaseStep) {
                                case "attack_start":
                                    this.matchState.canChangePhase = true
                                    this.emit()
                                    this.attackPhase_end()
                                    break;
                                case "attack_end":
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case "shift":
                            switch (this.matchState.phaseStep) {
                                case "shift_start":
                                    this.matchState.canChangePhase = true
                                    this.emit()
                                    this.shiftPhase_end()
                                    break;
                                case "shift_end":
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case "end":
                            switch (this.matchState.phaseStep) {
                                case "endPhase_start":
                                    this.matchState.canChangePhase = true
                                    this.emit()
                                    this.endPhase_end()
                                    break;
                                case "endPhase_end":
                                    break;
                                default:
                                    break;
                            }
                            break;
                        default:
                            break;
                    }
                }
                break;
            case "matchWon":
                break;

            default:
                break;
        }
    }



    // Actions concernant les zones, les cartes et leurs déplacements
    shuffleDeck(player: PlayerType): void {
        const pState = this.matchState[player];
        for (let i = pState.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pState.deck[i], pState.deck[j]] = [pState.deck[j], pState.deck[i]];
        }
        addInfo(`(${this.getPlayerReadableName(player)}) Le Deck a été mélangé.`)
        this.emit();
    }

    drawCards(player: PlayerType, numberOfCardsToDraw: number): ActionResult {
        const pState = this.matchState[player];
        const actualDrawCount = Math.min(numberOfCardsToDraw, pState.numberOfCardsToDraw);

        for (let i = 0; i < actualDrawCount; i++) {
            if (pState.deck.length === 0) {
                addInfo(`(${this.getPlayerReadableName(player)}) Deck vide, impossible de piocher`)
                if (this.matchState.phase === 'draw' && this.matchState.phaseStep === 'draw_drawCard') {
                    this.setWinner(player === 'player' ? 'opponent' : 'player', "emptyDeck");
                }
                return { success: false, error: 'emptyDeck' };
            }
            if (pState.numberOfCardsToDraw <= 0) {
                addInfo(`(${this.getPlayerReadableName(player)}) Vous ne pouvez pas piocher de carte.`)
                return { success: false, error: 'cantDraw' };
            }

            const cardInstanceFromDeck = pState.deck.shift()!;
            pState.hand.push(cardInstanceFromDeck);

            if (!pState.hasDrawnInitialCards) {
                pState.numberOfCardsToDraw--;
            }

            this.emit();
            this.emitEvent({ type: "cardDrawn", player, uuid: cardInstanceFromDeck.uuid });
        }
        return { success: true };
    }

    private getFirstEmptyMonsterZone(player: PlayerType): FightingZones | null {
        const order: FightingZones[] = ["swordL", "swordR", "archerL", "shield"];
        const pState = this.matchState[player];
        for (const zone of order) {
            if (!pState.fightingZones[zone]) return zone;
        }
        return null;
    }

    private getFirstMonsterZoneWithCard(player: PlayerType): FightingZones | null {
        const order: FightingZones[] = ["hero", "swordL", "swordR", "archerL", "shield"];
        const pState = this.matchState[player];
        for (const zone of order) {
            if (zone === "hero") {
                if (pState.fightingZones.hero.length > 0) return zone;
            } else if (pState.fightingZones[zone]) {
                return zone;
            }
        }
        return null;
    }

    private getFirstOccupiedMonsterZone(player: PlayerType): FightingZones | null {
        const order: FightingZones[] = ["swordL", "swordR", "archerL", "shield"];
        const pState = this.matchState[player];
        for (const zone of order) {
            if (pState.fightingZones[zone]) return zone;
        }
        return null;
    }

    private hasSwordMonsters(player: PlayerType): boolean {
        const zones = this.matchState[player].fightingZones;
        return !!zones.swordL || !!zones.swordR;
    }

    summonMonster(player: PlayerType, cardUuid: string, targetZone: FightingZones): ActionResult {
        if (this.matchState.currentPlayer !== player) return { success: false, error: 'notYourTurn' };
        if (this.matchState.phase === 'draw') return { success: false, error: 'notSummonPhase' };
        if (!['swordL', 'swordR', 'archerL', 'shield'].includes(targetZone)) return { success: false, error: 'invalidZone' };

        const pState = this.matchState[player];
        const cardIndex = pState.hand.findIndex(c => c.uuid === cardUuid);
        if (cardIndex === -1) return { success: false, error: 'cardNotFound' };
        if (pState.normalInvocationsLeft <= 0) return { success: false, error: 'noInvocationsLeft' };

        if (targetZone === 'hero') return { success: false, error: 'cannotSummonHero' };
        const zone = targetZone as Exclude<FightingZones, 'hero'>;
        if ((pState.fightingZones[zone] as any)) return { success: false, error: 'zoneOccupied' };

        const cardInstance = pState.hand[cardIndex];
        const card = allCards[cardInstance.cardId];
        if (!card || card.role !== 'allied') return { success: false, error: 'notSummonable' };

        pState.hand.splice(cardIndex, 1);
        (pState.fightingZones[zone] as any) = cardInstance;
        pState.normalInvocationsLeft--;

        addInfo(`(${this.getPlayerReadableName(player)}) Invoque ${card.name} sur ${targetZone}`);
        this.emitEvent({ type: 'cardMoved', cardId: cardInstance.cardId, from: 'hand', to: targetZone, uuid: cardInstance.uuid });
        this.emit();
        return { success: true };
    }

    private opponentSummonMonsterIfPossible() {
        if (!this.debugOptions.opponentIsRandomBot || this.matchState.currentPlayer !== 'opponent') return;
        const targetZone = this.getFirstEmptyMonsterZone('opponent');
        const cardToSummon = this.matchState.opponent.hand.find(instance => allCards[instance.cardId]?.role === 'allied');
        if (cardToSummon && targetZone && this.matchState.opponent.normalInvocationsLeft > 0) {
            this.summonMonster('opponent', cardToSummon.uuid, targetZone);
        }
    }

    private opponentAttackIfPossible() {
        if (!this.debugOptions.opponentIsRandomBot || this.matchState.currentPlayer !== 'opponent') return;
        const playerHasSwordDefense = this.hasSwordMonsters('player');
        const attackerZone = this.getFirstMonsterZoneWithCard('opponent');
        if (!attackerZone) return;

        if (!playerHasSwordDefense && this.matchState.player.fightingZones.hero.length > 0) {
            this.attackZone('opponent', attackerZone, 'hero');
            return;
        }

        const playerMonsterZone = this.getFirstOccupiedMonsterZone('player');
        if (playerMonsterZone) {
            this.attackZone('opponent', attackerZone, playerMonsterZone);
            return;
        }

        if (this.matchState.player.fightingZones.hero.length > 0) {
            this.attackZone('opponent', attackerZone, 'hero');
        }
    }

    /* summonCard(card: CardInstance, originZone: ZonesNames, targetZone: ZonesNames): ActionResult {
    } */

    placeNormalHero(player: PlayerType, heroUuid: string): ActionResult {
        const pState = this.matchState[player];
        const heroIndex = pState.extraDeck.findIndex(c => c.uuid === heroUuid);

        if (heroIndex === -1) return { success: false, error: 'heroNotFound' };
        if (this.matchState.phase !== 'draw' || this.matchState.phaseStep !== "draw_placeNormalHero") return { success: false, error: 'Pas la phase de choix du héros' };

        const hero = pState.extraDeck.splice(heroIndex, 1)[0];
        pState.fightingZones.hero = [hero];
        pState.heroesLeft = 3;

        this.matchState.phase = 'draw';
        this.emitEvent({ type: 'phaseChanged', phase: 'draw' });
        this.emit();

        return { success: true };
    }

    attackZone(playerAttacking: PlayerType, cardZoneAttacking: FightingZones, cardZoneTarget: FightingZones): ActionResult {
        if (this.matchState.phase !== 'attack') return { success: false, error: 'notAttackPhase' };

        const attackerState = this.matchState[playerAttacking];
        const victim = playerAttacking === 'player' ? 'opponent' : 'player';
        const victimState = this.matchState[victim];

        const attackerCard = cardZoneAttacking === 'hero'
            ? attackerState.fightingZones.hero[attackerState.fightingZones.hero.length - 1]
            : attackerState.fightingZones[cardZoneAttacking];

        if (!attackerCard) return { success: false, error: 'noAttackingCard' };

        if (cardZoneTarget === 'hero') {
            if (this.hasSwordMonsters(victim)) {
                return { success: false, error: 'heroProtectedBySword' };
            }
            if (victimState.fightingZones.hero.length === 0) return { success: false, error: 'noHeroToDestroy' };

            const cardInstance = victimState.fightingZones.hero[victimState.fightingZones.hero.length - 1];
            this.sendToGraveyard(cardInstance, 'hero', victim);
            victimState.heroesLeft--;
        } else {
            const targetCard = victimState.fightingZones[cardZoneTarget];
            if (!targetCard) return { success: false, error: 'noTargetCard' };
            this.sendToGraveyard(targetCard, cardZoneTarget, victim);
        }

        if (victimState.heroesLeft <= 0) {
            this.setWinner(playerAttacking, 'noHeroesLeft');
        }

        this.emit();
        return { success: true };
    }

    sendToGraveyard(cardInstance: CardInstance, originZone: FightingZones | "hand", victimPlayer: PlayerType): ActionResult {
        const card = allCards[cardInstance.cardId]

        const pState = this.matchState[victimPlayer];

        // Remove from origin zone
        if (originZone === 'hand') {
            const index = pState.hand.findIndex(c => c.uuid === cardInstance.uuid);
            if (index === -1) return { success: false, error: 'cardNotFound' };
            pState.hand.splice(index, 1);
        } else if (originZone == "hero") {
            const index = pState.fightingZones.hero.findIndex(c => c.uuid === cardInstance.uuid)
            if (index === -1) return { success: false, error: 'cardNotFound' };
            pState.fightingZones.hero.splice(index, 1);
        } else if (["swordL", "swordR", "archerL", "archerR", "shield"].includes(originZone)) {
            if (pState.fightingZones[originZone]?.uuid !== cardInstance.uuid) return { success: false, error: 'cardNotFound' };
            pState.fightingZones[originZone] = null
        } else {
            return { success: false, error: 'invalidOriginZone' };
        }

        // Add to graveyard
        if (card.role == "hero") pState.extraGraveyard.push(cardInstance);
        else pState.graveyard.push(cardInstance);

        this.emitEvent({ type: 'cardMoved', cardId: cardInstance.cardId, from: originZone, to: 'graveyard', uuid: cardInstance.uuid });
        this.emit();

        return { success: true };
    }



    // Actions concernant les effets de cartes



    // Autre (fourre-tout)
    getNextPhaseReadableName(phase: PhaseType, lowerCase: boolean = false): string {
        switch (phase) {
            case "draw":
                return this.getPhaseReadableName(`standby`, lowerCase)
            case "standby":
                return this.getPhaseReadableName(`flip`, lowerCase)
            case "flip":
                return this.getPhaseReadableName(`attack`, lowerCase)
            case "attack":
                return this.getPhaseReadableName(`shift`, lowerCase)
            case "shift":
                return this.getPhaseReadableName(`end`, lowerCase)
            case "end":
                return `${lowerCase ? "t" : "T"}erminer mon tour`
            default:
                return ""
        }
    }

    getPhaseReadableName(phase: PhaseType | null, lowerCase: boolean = false): string {
        const p = lowerCase ? "p" : "P"
        switch (phase) {
            case "draw":
                return `${p}hase de pioche`
            case "standby":
                return `${p}hase d'attente`
            case "flip":
                return `${p}hase de flip`
            case "attack":
                return `${p}hase d'attaque`
            case "shift":
                return `${p}hase de déplacement`
            case "end":
                return `${p}hase de fin`
            default:
                return ""
        }
    }

    getPlayerReadableName(player: PlayerType, lowerCase: boolean = false) {
        return player == "player" ? `${lowerCase ? "v" : "V"}ous` : `${lowerCase ? "a" : "A"}dversaire`
    }



    // Fonctions debug
    addRandomCardToHand(playerToGiveCard: PlayerType) {
        this.matchState[playerToGiveCard].hand.push({ cardId: getRandomCardId(), uuid: uuidv4() })
        this.emit();
    }
    killPlayer(player: PlayerType, defeatCause: "noHeroesLeft" | "emptyDeck") {
        this.setWinner(player === 'player' ? 'opponent' : 'player', defeatCause);
    }
}
