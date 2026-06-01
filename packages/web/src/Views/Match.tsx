import "./Match.css"
import "@/Components/GameElements/Board.css";
import { useEffect, useRef, useState } from "react";
import ClassicLayout from "@/Layouts/ClassicLayout";
import { cardIdsByRole, cards } from "@/cards";
import ModalCardFullscreen from "@/Components/GameElements/ModalCardFullscreen";
import type { BoardZonesConfig, PlayerType, ZoneConfig, ZonesNames } from "@/types";
import { MatchManager, type MatchEvent } from "@/Core/MatchManager";
import InfosBox from "@/Components/MatchUI/InfosBox";
import Card from "@/Components/GameElements/Card";
import Hand from "@/Components/GameElements/Hand";
import Graveyard from "@/Components/GameElements/Graveyard";
import Deck from "@/Components/GameElements/Deck";



type CurrentLeftPanel = "decidingFirstPlayer" | "board" | "matchEndCard" | null




/* fonctions internal
let set_currentLeftPanel_internal: ((value: CurrentLeftPanel) => void) | null = null;

export const UiFunctions = {
    set_currentLeftPanel: (value: CurrentLeftPanel) => {
        if (set_currentLeftPanel_internal) {
            set_currentLeftPanel_internal(value); // appelle la vraie fonction qui modifie le state
        } else {
            console.warn("(Match) Match non monté, impossible de set_currentLeftPanel");
        }
    },
}
*/




export default function Match() {
    function removeModal() {
        set_showModalCardFullscreen(false)
    }

    function generateDecks(): { deck: number[], extraDeck: number[] } {
        const deckSize = Math.floor(Math.random() * 11) + 30; // 30-40
        const extraSize = Math.floor(Math.random() * 10) + 3; // 3-12

        const monsterPool = cardIdsByRole.monster;
        const heroPool = [...cardIdsByRole.hero, ...cardIdsByRole.darkHero, ...cardIdsByRole.halfHero];

        const deck: number[] = [];
        const deckCount: Record<number, number> = {};

        // Remplir deck
        for (let i = 0; i < deckSize; i++) {
            let cardId: number;
            do {
                cardId = monsterPool[Math.floor(Math.random() * monsterPool.length)];
            } while (deckCount[cardId] >= 3);

            deck.push(cardId);
            deckCount[cardId] = (deckCount[cardId] || 0) + 1;
        }

        const extraDeck: number[] = [];
        const extraCount: Record<number, number> = {};

        // Ajouter min 3 heroes
        for (let i = 0; i < 3; i++) {
            let heroId: number;
            do {
                heroId = heroPool[Math.floor(Math.random() * heroPool.length)];
            } while (extraCount[heroId] >= 3);

            extraDeck.push(heroId);
            extraCount[heroId] = (extraCount[heroId] || 0) + 1;
        }

        // Remplir reste extraDeck
        for (let i = 3; i < extraSize; i++) {
            const isHero = Math.random() > 0.5;
            const pool = isHero ? heroPool : monsterPool;
            let cardId: number;
            do {
                cardId = pool[Math.floor(Math.random() * pool.length)];
            } while (extraCount[cardId] >= 3);

            extraDeck.push(cardId);
            extraCount[cardId] = (extraCount[cardId] || 0) + 1;
        }

        return { deck, extraDeck };
    }

    // Actions passed to components
    function showModal(cardId: number) {
        set_modalCardFullscreen_cardId(cardId)
        set_showModalCardFullscreen(true)
    }

    function drawOnClickDeck() {
        matchManager.drawCards("player", matchState.player.numberOfCardsToDraw)
        if (!matchState.player.hasDrawnInitialCards) matchManager.confirmInitialDraw("player")
    }

    // Helper JSX
    const renderZone = (playerType: PlayerType, zoneName: ZonesNames, readableName: string, gridRow: number, gridCol: number, isDeck = false, isGraveyard = false, isExtra = false) => {
        const playerState = matchState[playerType];
        let content = null;

        if (isDeck) {
            const instances = zoneName === 'extraDeck' ? playerState.extraDeck : playerState.deck;
            const playerCanDraw = playerType === 'player' && !isExtra;
            if (instances.length > 0) {
                content = <Deck cardInstancesUuids={instances.map(c => c.uuid)} isExtraDeck={isExtra} onClick={playerCanDraw ? () => drawOnClickDeck() : undefined} />;
            }
        } else if (isGraveyard) {
            const instances = zoneName === 'extraGraveyard' ? playerState.extraGraveyard : playerState.graveyard;
            if (instances.length > 0) {
                content = <Graveyard cardInstances={instances} isExtraGraveyard={isExtra} />;
            }
        } else {
            const card = playerState.fightingZones[zoneName as keyof typeof playerState.fightingZones];
            if (card) {
                content = <Card cardId={card.cardId} cardInstanceUuid={card.uuid} onContextMenu={() => showModal(card.cardId)} />;
            }
        }

        const placeholder = <p className="zoneName">{readableName}</p>;

        return (
            <div
                className={`zone ${playerType} ${zoneName} ${content ? "hasContent" : "hasNoContent"}`}
                style={{ gridRowStart: gridRow, gridColumnStart: gridCol }}
            >
                {content || placeholder}
            </div>
        );
    };



    const playerGenDecks = generateDecks();
    const opponentGenDecks = generateDecks();
    const playerCustomDeck = {
        deck: [3, 3, 11, 11, 11, 31, 31, 31, 38, 38, 38, 3, 3, 11, 11, 11, 31, 31, 31, 38, 38, 38, 3, 3, 11, 11, 11, 31, 31, 31, 38, 38, 38],

        extraDeck: [1, 9, 20],
    }

    // Concernant les options de Hand
    const [canTranslateOnHover, setCanTranslateOnHover] = useState(true);

    useEffect(() => {
        const container = leftRef.current;
        if (!container) return;

        const handleScroll = () => setCanTranslateOnHover(container.scrollTop === 0);
        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    // Variables state :
    const [currentLeftPanel, set_currentLeftPanel] = useState<CurrentLeftPanel>(null)
    const [showModalCardFullscreen, set_showModalCardFullscreen] = useState(false)
    const [modalCardFullscreen_cardId, set_modalCardFullscreen_cardId] = useState<number>()
    const [hideModalMatchEnd, set_hideModalMatchEnd] = useState(false)
    // const [matchManager] = useState(new MatchManager(playerCustomDeck, opponentGenDecks, {opponentIsRandomBot: true})); // Sans debug
    const [matchManager] = useState(new MatchManager(playerCustomDeck, opponentGenDecks, { skipDecideFirstPlayer: "player", opponentIsRandomBot: true, autoInitialDraw: true }));
    const [matchState, setmatchState] = useState(() => matchManager.matchState);

    /* Previous, quand j'utilisais Board.tsx
    // const boardZonesContent = {
    //     // Est mis à jour automatiquement avec les valeurs du matchState quand il est updaté avec la subscription car il en dépend
    //     player: {
    //         hero: matchState.player.fightingZones.hero ? { cardId: matchState.player.fightingZones.hero } : {},
    //         swordL: matchState.player.fightingZones.swordL ? { cardId: matchState.player.fightingZones.swordL } : {},
    //         swordR: matchState.player.fightingZones.swordR ? { cardId: matchState.player.fightingZones.swordR } : {},
    //         shield: matchState.player.fightingZones.shield ? { cardId: matchState.player.fightingZones.shield } : {},
    //         archerL: matchState.player.fightingZones.archerL ? { cardId: matchState.player.fightingZones.archerL } : {},
    //         archerR: matchState.player.fightingZones.archerR ? { cardId: matchState.player.fightingZones.archerR } : {},
    //         field: {},
    //         deck: { numberOfCards: matchState.player.deck.length },
    //         extraDeck: { numberOfCards: matchState.player.extraDeck.length },
    //         graveyard: { cardIds: matchState.player.graveyard },
    //         extraGraveyard: { cardIds: matchState.player.extraGraveyard },
    //         banished: { cardIds: matchState.player.banished },
    //     },
    //     opponent: {
    //         hero: matchState.opponent.fightingZones.hero ? { cardId: matchState.opponent.fightingZones.hero } : {},
    //         swordL: matchState.opponent.fightingZones.swordL ? { cardId: matchState.opponent.fightingZones.swordL } : {},
    //         swordR: matchState.opponent.fightingZones.swordR ? { cardId: matchState.opponent.fightingZones.swordR } : {},
    //         shield: matchState.opponent.fightingZones.shield ? { cardId: matchState.opponent.fightingZones.shield } : {},
    //         archerL: matchState.opponent.fightingZones.archerL ? { cardId: matchState.opponent.fightingZones.archerL } : {},
    //         archerR: matchState.opponent.fightingZones.archerR ? { cardId: matchState.opponent.fightingZones.archerR } : {},
    //         field: {},
    //         deck: { numberOfCards: matchState.opponent.deck.length },
    //         extraDeck: { numberOfCards: matchState.opponent.extraDeck.length },
    //         graveyard: { cardIds: matchState.opponent.graveyard },
    //         extraGraveyard: { cardIds: matchState.opponent.extraGraveyard },
    //         banished: { cardIds: matchState.opponent.banished },
    //     }
    // };

    // Définit le contenu des zones du Board
    // const [boardZonesContent, set_boardZonesContent] = useState<BoardZonesContent>({
    //     opponent: {
    //         hero: {},
    //         swordL: {},
    //         swordR: {},
    //         shield: {},
    //         archerL: {},
    //         archerR: {},
    //         field: {},
    //         deck: { numberOfCards: 0 },
    //         extraDeck: { numberOfCards: 0 },
    //         graveyard: { cardIds: [] },
    //         extraGraveyard: { cardIds: [] },
    //         banished: { cardIds: [] },
    //     },
    //     player: {
    //         hero: {},
    //         swordL: {},
    //         swordR: {},
    //         shield: {},
    //         archerL: {},
    //         archerR: {},
    //         field: {},
    //         deck: { numberOfCards: 0 },
    //         extraDeck: { numberOfCards: 0 },
    //         graveyard: { cardIds: [] },
    //         extraGraveyard: { cardIds: [] },
    //         banished: { cardIds: [] },
    //     }
    // })
    */




    /* expose les fonctions internal exportée en haut
    useEffect(() => {
        set_currentLeftPanel_internal = (value: CurrentLeftPanel) => {
            set_currentLeftPanel(value);
        };

        return () => {
            set_currentLeftPanel_internal = null;
        };
    }, []);
    */

    // Init game
    useEffect(() => {
        // set_showBoard(true);

        const unsubscribe = matchManager.subscribe((newMatchState) => {
            setmatchState({ ...newMatchState });
        });


        (window as any).ms = matchState;

        matchManager.startMatch();


        return () => unsubscribe()
    }, [matchManager])

    // React to game events
    useEffect(() => {
        matchManager.onEvent((event) => {
            switch (event.type) {
                case 'startedDecidingFirstPlayer':
                    set_currentLeftPanel('decidingFirstPlayer');
                    break;
                case "startedTurnsLoop":
                    set_currentLeftPanel('board');
                    break
                case 'matchWon':
                    // déjà géré via matchState.winner, mais peux ajouter logique
                    break;
            }
        });
    }, []);

    const boardAndHandsContainerRef = useRef<HTMLDivElement>(null);
    const leftRef = useRef<HTMLDivElement>(null);




    // JSX :
    const boardZonesConfig: BoardZonesConfig = {
        opponent: {
            hero: { readableName: "Héros", gridRowStart: 3, gridColStart: 4 },
            swordL: { readableName: "Epée", gridRowStart: 3, gridColStart: 6 },
            swordR: { readableName: "Epée", gridRowStart: 3, gridColStart: 2 },
            shield: { readableName: "Bouclier", gridRowStart: 1, gridColStart: 4 },
            archerL: { readableName: "Archer", gridRowStart: 2, gridColStart: 5 },
            archerR: { readableName: "Archer", gridRowStart: 2, gridColStart: 3 },
            field: { readableName: "Terrain", gridRowStart: 4, gridColStart: 5, isDisabled: true },
            deck: { readableName: "Deck", gridRowStart: 1, gridColStart: 1, isDeck: true },
            extraDeck: { readableName: "Extra deck", gridRowStart: 1, gridColStart: 7, isDeck: true, isExtra: true },
            graveyard: { readableName: "Cimetière", gridRowStart: 3, gridColStart: 1, isGraveyard: true },
            extraGraveyard: { readableName: "Extra cimetière", gridRowStart: 3, gridColStart: 7, isGraveyard: true, isExtra: true },
            banished: { readableName: "Zone bannie", isGraveyard: true },
        },
        player: {} as Record<ZonesNames, ZoneConfig>
    };
    boardZonesConfig.player = Object.fromEntries(
        // Generate player side from opponent
        Object.entries(boardZonesConfig.opponent).map(([zoneName, zoneConfig]) => {
            if (zoneConfig.gridRowStart == null || zoneConfig.gridColStart == null) {
                // Pas de gridRowStart ou gridColStart pour banished
                return [zoneName, { ...zoneConfig }]
            }

            return [zoneName, { ...zoneConfig, gridRowStart: 8 - zoneConfig.gridRowStart, gridColStart: 8 - zoneConfig.gridColStart }]    // devtodo : Changer col 8 pour 7 ? Y a 7 cols pas 8
        })
    ) as Record<ZonesNames, ZoneConfig>

    const boardJSX = (
        <div className={"Board"
            // + (matchState.turn !== null ? "transitionPerspective-end transitionPerspective-start" : "")   // readyForMatch
        }>
            {Object.entries(boardZonesConfig).map(([playerType, zones]) => (
                Object.entries(zones).map(([zoneName, config]) => {
                    if (zoneName === 'field' || zoneName === 'banished') return null;
                    return renderZone(
                        playerType as PlayerType,
                        zoneName as ZonesNames,
                        config.readableName,
                        config.gridRowStart!,  // change
                        config.gridColStart!,  // change
                        config.isDeck,
                        config.isGraveyard,
                        config.isExtra
                    );
                })
            ))}
        </div>
    );


    return (
        <ClassicLayout hideFooter={true}>
            <main className="Match">
                <div className="left" ref={leftRef}>
                    {currentLeftPanel == "decidingFirstPlayer" &&
                        <div className="decidingFirstPlayer">
                            {!matchState.coinTossWinner && <p className="error">"(Match) Erreur : matchState.coinTossWinner est null"</p>}
                            {matchState.coinTossWinner == "opponent" ?
                                <p>Le joueur adverse décide qui commencera la partie<span>...</span></p>
                                : <>
                                    <p>Choisissez le joueur qui commencera la partie</p>
                                    <div className="flexHori">
                                        <button onClick={() => matchManager.setFirstPlayer("player")}>Moi</button>
                                        <button onClick={() => matchManager.setFirstPlayer("opponent")}>Adversaire</button>
                                    </div>
                                </>
                            }
                        </div>
                    }
                    {currentLeftPanel == "board" &&
                        <>
                            {matchState.winner &&
                                <div className={"modal matchEnd" + (matchState.winner == "player" ? " playerWon" : "") + (hideModalMatchEnd ? " hideModalMatchEnd" : "")}>
                                    {!hideModalMatchEnd &&
                                        <div className="message">
                                            {matchState.winner == "player" ?
                                                <>
                                                    {matchState.defeatCause == "noHeroesLeft" ?
                                                        <p>Vous avez vaincu les 3 héros de l'adversaire</p>
                                                        : <p>L'adversaire n'a plus de carte à piocher</p>
                                                    }
                                                    <br /><p>Félicitations, vous remportez la victoire !</p>
                                                </>
                                                : <>
                                                    {matchState.defeatCause == "noHeroesLeft" ?
                                                        <p>Vos 3 héros ont été vaincus</p>
                                                        : <p>Vous n'avez plus de carte à piocher</p>
                                                    }
                                                    <br /><p>L'adversaire remporte la victoire !</p>
                                                </>
                                            }
                                        </div>
                                    }
                                </div>
                            }
                            <div className="boardAndHandsContainer" ref={boardAndHandsContainerRef}>
                                <Hand cardInstances={matchState.opponent.hand} isOpponentHand onCardContextMenu={showModal} />
                                <div className="boardContainer fullHeight">
                                    {boardJSX}
                                </div>
                                <Hand cardInstances={matchState.player.hand} canTranslateOnHover={canTranslateOnHover} onCardContextMenu={showModal} />
                            </div>
                        </>
                    }
                </div>

                <div className="right">
                    <button className="flexIAlignEnd" title="Ouvrir le guide de jeu">
                        <svg className="icon">
                            <use href="#manual" />
                        </svg>
                    </button>


                    <InfosBox />
                    {matchState.winner &&
                        <button onClick={() => set_hideModalMatchEnd(!hideModalMatchEnd)}>Voir / cacher le plateau</button>
                    }

                    {/* Debug : */}
                    <button onClick={() => matchManager.drawCards("opponent", 1)}>Draw opponent</button>
                        <button onClick={() => matchManager.drawCards("player", 1)}>Draw player</button>
                    {/* {canGoToNextPhase && <button onClick={() => matchManager.goToNextPhase()}>Passer à la phase suivante</button>} */}
                    {/* <button onClick={() => matchManager.killPlayer("player", "emptyDeck")}>Kill Player</button>
                        <button onClick={() => matchManager.killPlayer("opponent", "emptyDeck")}>Kill Opponent</button> */}
                    {/* <button onClick={() => matchManager.addRandomCardToHand("opponent")}>Ajouter une carte à la main (adv)</button>
                        <button onClick={() => matchManager.addRandomCardToHand("player")}>Ajouter une carte à la main (vous)</button> */}
                </div>

                {showModalCardFullscreen && <ModalCardFullscreen card={cards[modalCardFullscreen_cardId!]} onModalClosed={removeModal} />}
            </main>

        </ClassicLayout>
    )
}

