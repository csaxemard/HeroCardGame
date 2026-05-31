import { useEffect, useRef, useState, type ReactElement } from "react";

import ClassicLayout from "@/Layouts/ClassicLayout";
import { cardIdsByRole, cards, getRandomCardId, getRandomCardIdByRoles } from "@/cards";
import { MatchContext } from "./MatchContext";
import "./Match.css"
import ModalCardFullscreen from "@/Components/GameElements/ModalCardFullscreen";
import Board from "@/Components/GameElements/Board";
import type { BoardZonesContent, PlayerType, ZonesNames } from "@/types";
import { useMatch } from "@/Core/UseMatch";
import { MatchManager } from "@/Core/MatchManager";
import InfosBox, { addInfo } from "@/Components/MatchUI/InfosBox";
import Card from "@/Components/GameElements/Card";
import Hand from "@/Components/GameElements/Hand";



type CurrentLeftPanel = "decidingFirstPlayer" | "board" | "matchEndCard" | null




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




export default function Match() {
    function showModal(cardId: number) {
        set_modalCardFullscreen_cardId(cardId)
        set_showModalCardFullscreen(true)
    }

    function removeModal() {
        set_showModalCardFullscreen(false)
    }

    // function fillBoardZonesContentWithRandom() {
    //     set_boardZonesContent(prev => {
    //         return (
    //             Object.fromEntries(
    //                 Object.entries(prev).map(([playerType, zones]) => [
    //                     playerType,
    //                     Object.fromEntries(
    //                         (Object.entries(zones) as [ZonesNames, any | null][]).map(([zoneName, zoneContent]) => {
    //                             let newZoneContent;

    //                             if (["graveyard", "extraGraveyard"].includes(zoneName)) {
    //                                 newZoneContent = zoneContent.cardIds?.length == 0
    //                                     ? {
    //                                         cardIds: Array.from({ length: Math.floor(Math.random() * 10) + 1 }, () => (
    //                                             zoneName == "extraGraveyard"
    //                                                 ? getRandomCardIdByRoles(["darkHero", "halfHero", "hero", "multiHero"])
    //                                                 : getRandomCardIdByRoles("monster")
    //                                         ))
    //                                     }
    //                                     : zoneContent
    //                             } else if (["deck", "extraDeck"].includes(zoneName)) {
    //                                 newZoneContent = zoneContent.numberOfCards <= 0
    //                                     ? { numberOfCards: (Math.floor(Math.random() * (12 - 1 + 1)) + 1) }
    //                                     : zoneContent
    //                             } else {
    //                                 newZoneContent = zoneContent.cardId == undefined
    //                                     ? {
    //                                         cardId: (zoneName == "hero"
    //                                             ? getRandomCardIdByRoles(["darkHero", "halfHero", "hero", "multiHero"])
    //                                             : getRandomCardIdByRoles(["monster", "field"]))
    //                                     } : zoneContent
    //                             }

    //                             return [
    //                                 zoneName,
    //                                 newZoneContent
    //                             ]
    //                         })
    //                     )
    //                 ])
    //             ) as BoardZonesContent
    //         )
    //     })
    // }

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

    function choseFirstPlayer(playerType: PlayerType) {

    }



    const playerGenDecks = generateDecks();
    const opponentGenDecks = generateDecks();
    const playerCustomDeck = {
        deck: [3, 3, 11, 11, 11, 31, 31, 31, 38, 38, 38, 3, 3, 11, 11, 11, 31, 31, 31, 38, 38, 38, 3, 3, 11, 11, 11, 31, 31, 31, 38, 38, 38],

        extraDeck: [1, 9, 20],
    }

    // Variables state :
    const [currentLeftPanel, set_currentLeftPanel] = useState<CurrentLeftPanel>(null)
    const [showModalCardFullscreen, set_showModalCardFullscreen] = useState(false)
    const [modalCardFullscreen_cardId, set_modalCardFullscreen_cardId] = useState<number>()
    const [hideModalMatchEnd, set_hideModalMatchEnd] = useState(false)
    // const [matchManager] = useState(new MatchManager(playerCustomDeck, opponentGenDecks)); // Sans debug
    const [matchManager] = useState(new MatchManager(playerCustomDeck, opponentGenDecks, { skipDecideFirstPlayer: "player", opponentIsRandomBot: true }));
    const [matchState, setmatchState] = useState(() => matchManager.matchState);
    const boardZonesContent = {
        // Est mis à jour automatiquement avec les valeurs du matchState quand il est updaté avec la subscription car il en dépend
        player: {
            hero: matchState.player.fightingZones.hero ? { cardId: matchState.player.fightingZones.hero } : {},
            swordL: matchState.player.fightingZones.swordL ? { cardId: matchState.player.fightingZones.swordL } : {},
            swordR: matchState.player.fightingZones.swordR ? { cardId: matchState.player.fightingZones.swordR } : {},
            shield: matchState.player.fightingZones.shield ? { cardId: matchState.player.fightingZones.shield } : {},
            archerL: matchState.player.fightingZones.archerL ? { cardId: matchState.player.fightingZones.archerL } : {},
            archerR: matchState.player.fightingZones.archerR ? { cardId: matchState.player.fightingZones.archerR } : {},
            field: {},
            deck: { numberOfCards: matchState.player.deck.length },
            extraDeck: { numberOfCards: matchState.player.extraDeck.length },
            graveyard: { cardIds: matchState.player.graveyard },
            extraGraveyard: { cardIds: matchState.player.extraGraveyard },
            banished: { cardIds: matchState.player.banished },
        },
        opponent: {
            hero: matchState.opponent.fightingZones.hero ? { cardId: matchState.opponent.fightingZones.hero } : {},
            swordL: matchState.opponent.fightingZones.swordL ? { cardId: matchState.opponent.fightingZones.swordL } : {},
            swordR: matchState.opponent.fightingZones.swordR ? { cardId: matchState.opponent.fightingZones.swordR } : {},
            shield: matchState.opponent.fightingZones.shield ? { cardId: matchState.opponent.fightingZones.shield } : {},
            archerL: matchState.opponent.fightingZones.archerL ? { cardId: matchState.opponent.fightingZones.archerL } : {},
            archerR: matchState.opponent.fightingZones.archerR ? { cardId: matchState.opponent.fightingZones.archerR } : {},
            field: {},
            deck: { numberOfCards: matchState.opponent.deck.length },
            extraDeck: { numberOfCards: matchState.opponent.extraDeck.length },
            graveyard: { cardIds: matchState.opponent.graveyard },
            extraGraveyard: { cardIds: matchState.opponent.extraGraveyard },
            banished: { cardIds: matchState.opponent.banished },
        }
    };

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




    // expose les fonctions internal exportée en haut
    useEffect(() => {
        set_currentLeftPanel_internal = (value: CurrentLeftPanel) => {
            set_currentLeftPanel(value);
        };

        return () => {
            set_currentLeftPanel_internal = null;
        };
    }, []);

    // Init game
    useEffect(() => {
        // set_showBoard(true);
        // fillBoardZonesContentWithRandom();

        const unsubscribe = matchManager.subscribe((newMatchState) => {
            setmatchState({ ...newMatchState });
        });
        (window as any).ms = matchState;

        matchManager.startMatch();

        return () => {
            matchManager.uninitializeMatchManager()
            unsubscribe()
        };
    }, [matchManager])

    const boardAndHandsContainerRef = useRef<HTMLDivElement>(null);
    const leftRef = useRef<HTMLDivElement>(null);




    // JSX :



    return (
        <ClassicLayout hideFooter={true}>
            <main className="Match">
                <MatchContext value={showModal}>
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
                                    <Hand key={matchState.opponent.hand.length + "b"} cardsIds={matchState.opponent.hand} isOpponentHand parentLeftRef={leftRef} />
                                    <div className="boardContainer fullHeight">
                                        <Board
                                            // readyForMatch
                                            boardZonesContent={boardZonesContent}
                                        />
                                    </div>
                                    <Hand key={matchState.opponent.hand.length} cardsIds={matchState.player.hand} parentLeftRef={leftRef} />
                                </div>
                            </>
                        }
                    </div>

                    <div className="right">
                        <button className="flexIAlignEnd">
                            <svg className="icon">
                                <use href="#manual" />
                            </svg>
                        </button>


                        <InfosBox />
                        <button onClick={() => matchManager.drawCard("opponent")}>Draw opponent</button>
                        <button onClick={() => matchManager.drawCard("player")}>Draw player</button>
                        {/* {canGoToNextPhase && <button onClick={() => matchManager.goToNextPhase()}>Passer à la phase suivante</button>} */}
                        {matchState.winner &&
                            <button onClick={() => set_hideModalMatchEnd(!hideModalMatchEnd)}>Voir / cacher le plateau</button>
                        }

                        {/* Debug : */}
                        <button onClick={() => matchManager.killPlayer("player", "emptyDeck")}>Kill Player</button>
                        <button onClick={() => matchManager.killPlayer("opponent", "emptyDeck")}>Kill Opponent</button>
                        {/* <button onClick={() => matchManager.addRandomCardToHand("opponent")}>Ajouter une carte à la main (adv)</button>
                        <button onClick={() => matchManager.addRandomCardToHand("player")}>Ajouter une carte à la main (vous)</button> */}
                    </div>

                    {showModalCardFullscreen && <ModalCardFullscreen card={cards[modalCardFullscreen_cardId!]} removeModal={removeModal} />}
                </MatchContext>
            </main>

        </ClassicLayout>
    )
}

