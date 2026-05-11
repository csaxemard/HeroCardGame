import { useEffect, useState } from "react";

import ClassicLayout from "@/Layouts/ClassicLayout";
import { cards, getRandomCardId, getRandomCardIdByRoles } from "@/cards";
import { MatchContext } from "./MatchContext";
import "./Match.css"
import ModalCardFullscreen from "@/Components/Game/ModalCardFullscreen";
import Board from "@/Components/Game/Board";
import type { BoardZonesContent, ZonesNames } from "@/types";


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
                                if (["graveyard", "extraGraveyard"].includes(zoneName)) {
                                    return [
                                        zoneName,
                                        zoneContent.cardIds?.length == 0
                                            ? {
                                                cardIds: Array.from({ length: Math.floor(Math.random() * 10) + 1 }, () => (
                                                    zoneName == "extraGraveyard"
                                                    ? getRandomCardIdByRoles(["darkHero", "halfHero", "hero", "multiHero"])
                                                    : getRandomCardIdByRoles("monster")
                                                )) 
                                            }
                                            : zoneContent
                                    ]
                                } else if (["deck", "extraDeck"].includes(zoneName)) {
                                    return [
                                        zoneName,
                                        zoneContent.numberOfCards <= 0
                                            ? { numberOfCards: (Math.floor(Math.random() * (12 - 1 + 1)) + 1) }
                                            : zoneContent
                                    ]
                                } else {
                                    return [
                                        zoneName,
                                        zoneContent.cardId == undefined
                                            ? {
                                                cardId: (zoneName == "hero"
                                                    ? getRandomCardIdByRoles(["darkHero", "halfHero", "hero", "multiHero"])
                                                    : getRandomCardIdByRoles(["monster", "field"]))
                                            } : zoneContent
                                    ]
                                }
                            })
                        )
                    ])
                ) as BoardZonesContent
            )
        })
    }



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
        fillBoardZonesContentWithRandom()
    }, [])




    // Concernant modalCardFullscreen
    const [showModalCardFullscreen, set_showModalCardFullscreen] = useState(false)
    const [modalCardFullscreen_cardId, set_modalCardFullscreen_cardId] = useState<number>()



    return (
        <ClassicLayout hideFooter={true}>
            <main className="Match">
                <MatchContext value={showModal}>
                    <Board readyForMatch boardZonesContent={boardZonesContent} />

                    {showModalCardFullscreen && <ModalCardFullscreen card={cards[modalCardFullscreen_cardId!]} removeModal={removeModal} />}
                </MatchContext>
            </main>

        </ClassicLayout>
    )
}

