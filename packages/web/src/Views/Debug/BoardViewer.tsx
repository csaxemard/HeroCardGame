import { useEffect, useState } from "react";

import ClassicLayout from "@/Layouts/ClassicLayout";
import Board, { type BoardZonesContent, type ZoneContent, type ZonesNames } from "@/Components/Game/Board";
import Card from "@/Components/Game/Card";
import { cards } from "@/cards";



export default function BoardViewer() {
    function getRandomCardId() {
        const min = 0
        const max = 125
        const unavailableCardIds: number[] = [0, 2, 4, 5, 10, 15, 25, 34, 40, 41, 43, 44, 47, 48, 49, 50, 51, 52, 54, 55, 56, 57, 60, 61, 62, 63, 64, 65, 66, 68, 69, 71, 75, 76, 77, 78, 79, 80, 81, 82, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 109, 110, 111, 112, 115, 116, 117, 118, 119, 120, 121, 122, 123];

        let cardId;
        do {
            cardId = Math.floor(Math.random() * (max - min + 1)) + min
        } while (unavailableCardIds.includes(cardId));

        return cardId
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



    return (
        <ClassicLayout hideFooter={true}>
            <main className="centered">
                <Board readyForMatch boardZonesContent={boardZonesContent} />
            </main>
        </ClassicLayout>
    )
}
