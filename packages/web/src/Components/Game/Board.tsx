import { useEffect, useState } from "react";
import "./Board.css"
import Card from "./Card";
import { cards } from "@/cards";
// import Card from "./Card"

interface ZoneConfig {
    name: string; gridrs: number; gridcs: number;   // grid-row-start, grid-column-start
    card?: {
        cardId?: number, isFaceDown?: boolean
    }
}
interface BoardZones { opponent: Record<string, ZoneConfig>; player: Record<string, ZoneConfig>; }

interface BoardProps {
    /**
     * - Default value : true
     */
    readyForMatch?: boolean,
}



export default function Board({ readyForMatch = false }: BoardProps) {
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



    const [cardHero, set_cardHero] = useState()
    // JSX
    const boardZones: BoardZones = {
        opponent: {
            hero: { name: "Héros", gridrs: 3, gridcs: 4, card: {isFaceDown: false} },
            swordL: { name: "Epée", gridrs: 3, gridcs: 6, card: {isFaceDown: false} },
            swordR: { name: "Epée", gridrs: 3, gridcs: 2, card: {isFaceDown: false} },
            shield: { name: "Bouclier", gridrs: 1, gridcs: 4, card: {isFaceDown: false} },
            archerL: { name: "Archer", gridrs: 2, gridcs: 5, card: {isFaceDown: false} },
            archerR: { name: "Archer", gridrs: 2, gridcs: 3, card: {isFaceDown: false} },
            field: { name: "Terrain", gridrs: 4, gridcs: 5, card: {isFaceDown: false} },
            deck: { name: "Deck", gridrs: 1, gridcs: 1, card: {isFaceDown: true} },
            extraDeck: { name: "Extra deck", gridrs: 1, gridcs: 7, card: {isFaceDown: true} },
            graveyard: { name: "Cimetière", gridrs: 3, gridcs: 1, },
            extraGraveyard: { name: "Extra cimetière", gridrs: 3, gridcs: 7, },
            // banished: { name: "Bannies", gridrs: 4, gridcs: 8, },
        },
        player: {}
    };

    boardZones.player = Object.fromEntries(
        Object.entries(boardZones.opponent).map(([zoneName, zoneConfig]) => {
            return [zoneName, { ...zoneConfig, gridrs: 8 - zoneConfig.gridrs, gridcs: 8 - zoneConfig.gridcs }]
        })
    )



    // Logic
    useEffect(() => {
        setTimeout(() => {
            readyForMatch && document.querySelector(`.Board`)?.classList.remove("transitionPerspective-start")
        }, 400);
    }, [])



    return (
        <div className={`Board ${readyForMatch ? "transitionPerspective-end transitionPerspective-start" : ""}`}>
            {/* <div className={`Board ${readyForMatch && "transitionPerspective-end transitionPerspective-start"}`}> */}
            {Object.entries(boardZones).map(([playerType, zones]) => (
                (Object.entries(zones) as [string, ZoneConfig][]).map(([zoneName, zoneConfig]) => (
                    <div
                        key={`${playerType}-${zoneName}`}
                        className={`${playerType} zone ${zoneName} ${zoneConfig.card ? "hasCard" : "hasNoCard"}`}
                        style={{
                            "--gridrs": zoneConfig.gridrs,
                            "--gridcs": zoneConfig.gridcs,
                        } as React.CSSProperties}
                    >
                        {!zoneConfig.card && <p className="zoneName">{zoneConfig.name}</p>}
                        {zoneConfig.card && <Card cardId={getRandomCardId()} isSelectable={playerType === "player"} isFaceDown={zoneConfig.card.isFaceDown} />}
                    </div>
                ))
            ))}
        </div>
    )
}