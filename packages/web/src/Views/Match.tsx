import { useEffect, useState } from "react";

import ClassicLayout from "@/Layouts/ClassicLayout";
import { cardIdsByRole, cards, getRandomCardIdByRoles } from "@/cards";
import { MatchContext } from "./MatchContext";
import "./Match.css"
import ModalCardFullscreen from "@/Components/GameElements/ModalCardFullscreen";
import Board from "@/Components/GameElements/Board";
import type { BoardZonesContent, PlayerType, ZonesNames } from "@/types";
import { useMatch } from "@/Core/UseMatch";
import { MatchManager } from "@/Core/MatchManager";
import InfosBox, { addInfo } from "@/Components/MatchUI/InfosBox";



export default function Match() {
    function showModal(cardId: number) {
        set_modalCardFullscreen_cardId(cardId)
        set_showModalCardFullscreen(true)
    }

    function removeModal() {
        set_showModalCardFullscreen(false)
    }

    function fillBoardZonesContentWithRandom() {
        set_boardZonesContent(prev => {
            return (
                Object.fromEntries(
                    Object.entries(prev).map(([playerType, zones]) => [
                        playerType,
                        Object.fromEntries(
                            (Object.entries(zones) as [ZonesNames, any | null][]).map(([zoneName, zoneContent]) => {
                                let newZoneContent;

                                if (["graveyard", "extraGraveyard"].includes(zoneName)) {
                                    newZoneContent = zoneContent.cardIds?.length == 0
                                        ? {
                                            cardIds: Array.from({ length: Math.floor(Math.random() * 10) + 1 }, () => (
                                                zoneName == "extraGraveyard"
                                                    ? getRandomCardIdByRoles(["darkHero", "halfHero", "hero", "multiHero"])
                                                    : getRandomCardIdByRoles("monster")
                                            ))
                                        }
                                        : zoneContent
                                } else if (["deck", "extraDeck"].includes(zoneName)) {
                                    newZoneContent = zoneContent.numberOfCards <= 0
                                        ? { numberOfCards: (Math.floor(Math.random() * (12 - 1 + 1)) + 1) }
                                        : zoneContent
                                } else {
                                    newZoneContent = zoneContent.cardId == undefined
                                        ? {
                                            cardId: (zoneName == "hero"
                                                ? getRandomCardIdByRoles(["darkHero", "halfHero", "hero", "multiHero"])
                                                : getRandomCardIdByRoles(["monster", "field"]))
                                        } : zoneContent
                                }

                                return [
                                    zoneName,
                                    newZoneContent
                                ]
                            })
                        )
                    ])
                ) as BoardZonesContent
            )
        })
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



    const [showBoard, set_showBoard] = useState(false)
    const [showDecideFirstPlayer, set_showDecideFirstPlayer] = useState(false)
    // Concernant modalCardFullscreen
    const [showModalCardFullscreen, set_showModalCardFullscreen] = useState(false)
    const [modalCardFullscreen_cardId, set_modalCardFullscreen_cardId] = useState<number>()

    // Définit le contenu des zones du Board
    const [boardZonesContent, set_boardZonesContent] = useState<BoardZonesContent>({
        opponent: {
            hero: {},
            swordL: {},
            swordR: {},
            shield: {},
            archerL: {},
            archerR: {},
            field: {},
            deck: { numberOfCards: 0 },
            extraDeck: { numberOfCards: 0 },
            graveyard: { cardIds: [] },
            extraGraveyard: { cardIds: [] },
            banished: { cardIds: [] },
        },
        player: {
            hero: {},
            swordL: {},
            swordR: {},
            shield: {},
            archerL: {},
            archerR: {},
            field: {},
            deck: { numberOfCards: 0 },
            extraDeck: { numberOfCards: 0 },
            graveyard: { cardIds: [] },
            extraGraveyard: { cardIds: [] },
            banished: { cardIds: [] },
        }
    })
    useEffect(() => {
        set_showBoard(true);
        fillBoardZonesContentWithRandom();

        (window as any).a = addInfo
        // Init game :
        // const playerGenDecks = generateDecks();
        // const opponentGenDecks = generateDecks();

        // const matchManager = new MatchManager(playerGenDecks, opponentGenDecks, true);
        // (window as any).ms = matchManager.matchState
        // matchManager.startMatch()
    }, [])


    // const [currentPlayer, set_currentPlayer] = useState<PlayerType>(
    // const [playerHand, setPlayerHand] = useState<number[]>([]);
    // const [opponentHandCount, setOpponentHandCount] = useState(0);
    // const { state, playCard, endTurn } = useMatch(playerDeck, opponentDeck);



    return (
        <ClassicLayout hideFooter={true}>
            <main className="Match">
                <MatchContext value={showModal}>

                    <div className="left">
                        {showBoard &&
                            <div className="boardContainer fullHeight">
                                <Board
                                    // readyForMatch
                                    boardZonesContent={boardZonesContent}
                                />
                            </div>
                        }
                        {showDecideFirstPlayer &&
                            <div className="modal decideFirstPlayer">
                                div
                            </div>
                        }
                    </div>

                    <div className="right">
                        <InfosBox />
                    </div>

                    {showModalCardFullscreen && <ModalCardFullscreen card={cards[modalCardFullscreen_cardId!]} removeModal={removeModal} />}
                </MatchContext>
            </main>

        </ClassicLayout>
    )
}

