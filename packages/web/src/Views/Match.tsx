import { useEffect, useState } from "react";

import ClassicLayout from "@/Layouts/ClassicLayout";
import Board, { type BoardZonesContent, type ZoneContent, type ZonesNames } from "@/Components/Game/Board";
import Card from "@/Components/Game/Card";
import { cards, getRandomCardId } from "@/cards";
import { MatchContext } from "./MatchContext";
import "./Match.css"
import ModalCardFullscreen from "@/Components/Game/ModalCardFullscreen";



export default function Match() {
    function showModal(cardId: number) {
        set_modalCardFullscreen_cardId(cardId)
        set_showModalCardFullscreen(true)
    }

    function removeModal() {
        set_showModalCardFullscreen(false)
    }



    // Définit le contenu des zones du Board
    const [boardZonesContent, set_boardZonesContent] = useState<BoardZonesContent>({
        opponent: {
            hero: {
                content: undefined
            },
            swordL: {
                content: undefined
            },
            swordR: {
                content: undefined
            },
            shield: {
                content: undefined
            },
            archerL: {
                content: undefined
            },
            archerR: {
                content: undefined
            },
            field: {
                content: undefined
            },
            deck: {
                content: undefined
            },
            extraDeck: {
                content: undefined
            },
            graveyard: {
                content: undefined
            },
            extraGraveyard: {
                content: undefined
            },
            banished: {
                content: undefined
            }
        },
        player: {
            hero: {
                content: undefined
            },
            swordL: {
                content: undefined
            },
            swordR: {
                content: undefined
            },
            shield: {
                content: undefined
            },
            archerL: {
                content: undefined
            },
            archerR: {
                content: undefined
            },
            field: {
                content: undefined
            },
            deck: {
                content: undefined
            },
            extraDeck: {
                content: undefined
            },
            graveyard: {
                content: undefined
            },
            extraGraveyard: {
                content: undefined
            },
            banished: {
                content: undefined
            }
        }
    })
    useEffect(() => {
        set_boardZonesContent(prev => ({
            opponent: Object.fromEntries(
                Object.keys(prev.opponent).map(zoneName => [
                    zoneName,
                    { content: <Card cardId={getRandomCardId()} /> }
                ])
            ) as Record<ZonesNames, ZoneContent>,
            player: Object.fromEntries(
                Object.keys(prev.player).map(zoneName => [
                    zoneName,
                    { content: <Card cardId={getRandomCardId()} /> }
                ])
            ) as Record<ZonesNames, ZoneContent>
        }))
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
