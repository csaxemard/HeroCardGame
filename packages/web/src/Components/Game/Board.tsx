import { useEffect } from "react";
import "./Board.css"
import Card from "./Card";



export type PlayerType = "opponent" | "player";

export type ZonesNames = "hero" | "swordL" | "swordR" | "shield" | "archerL" | "archerR" | "field" | "deck" | "extraDeck" | "graveyard" | "extraGraveyard" | "banished";

interface ZoneConfig { readableName: string; gridRowStart?: number; gridColStart?: number; }

export interface ZoneContent {
    /**
     * - Peut être une Card, ou autre chose, mais qui sera le node enfant de la zone
     */
    content: React.ReactNode,
    // restreindre un type à un Component ?
    // ReactElement<typeof Card> | ReactElement<typeof Deck> | null;
    // ou :
    // ReactElement<CardProps> | ReactElement<DeckProps> | null;

    // Card ? Si card, et pour le deck je mets card aussi ou deck ? Demander à gpt si je deck et extradeck dans le meme component Desck avec un boolean isExtraDeck et un autre isSupraDeck etc, ou si je dois faire un component séparé pour chacun
}

type BoardZonesConfig = Record<PlayerType, Record<ZonesNames, ZoneConfig>>;
export type BoardZonesContent = Record<PlayerType, Record<ZonesNames, ZoneContent | null>>;

interface BoardProps {
    /**
     * - Default value : true
     */
    readyForMatch?: boolean,
    /**
     * - Definit le contenu des zones de chaque joueur sur le plateau
     *     - Chaque zone peut contenir un noeud JSX (une Card, un Deck, un Graveyard, juste un chiffre, ou autre chose)
     *     - Une zone peut aussi contenir null (auquel cas seule la zone sera affichée avec son nom et pas de contenu)
     */
    boardZonesContent: BoardZonesContent
}



export default function Board({ readyForMatch = false, boardZonesContent }: BoardProps) {
    // Définit les zones et leur emplacement
    const boardZonesConfig: BoardZonesConfig = {
        opponent: {
            hero: { readableName: "Héros", gridRowStart: 3, gridColStart: 4, },
            swordL: { readableName: "Epée", gridRowStart: 3, gridColStart: 6, },
            swordR: { readableName: "Epée", gridRowStart: 3, gridColStart: 2, },
            shield: { readableName: "Bouclier", gridRowStart: 1, gridColStart: 4, },
            archerL: { readableName: "Archer", gridRowStart: 2, gridColStart: 5, },
            archerR: { readableName: "Archer", gridRowStart: 2, gridColStart: 3, },
            field: { readableName: "Terrain", gridRowStart: 4, gridColStart: 5, },
            deck: { readableName: "Deck", gridRowStart: 1, gridColStart: 1, },
            extraDeck: { readableName: "Extra deck", gridRowStart: 1, gridColStart: 7, },
            graveyard: { readableName: "Cimetière", gridRowStart: 3, gridColStart: 1, },
            extraGraveyard: { readableName: "Extra cimetière", gridRowStart: 3, gridColStart: 7, },
            banished: { readableName: "Zone bannie", },
        },
        player: {} as Record<ZonesNames, ZoneConfig>
    };
    boardZonesConfig.player = Object.fromEntries(
        Object.entries(boardZonesConfig.opponent).map(([zoneName, zoneConfig]) => {
            if (zoneConfig.gridRowStart == null || zoneConfig.gridColStart == null) {
                // Pas de gridRowStart ou gridColStart pour banished
                return [zoneName, { ...zoneConfig }]
            }

            return [zoneName, { ...zoneConfig, gridRowStart: 8 - zoneConfig.gridRowStart, gridColStart: 8 - zoneConfig.gridColStart }]    // devtodo : Changer col 8 pour 7 ? Y a 7 cols pas 8
        })
    ) as Record<ZonesNames, ZoneConfig>



    // Logique à déplacer dans BoardViewer
    useEffect(() => {
        setTimeout(() => {
            readyForMatch && document.querySelector(`.Board`)?.classList.remove("transitionPerspective-start")
        }, 400);
    }, [])


    // Crée le JSX pour chaque zone avec son contenu définit dans le prop
    const zones = (Object.entries(boardZonesConfig) as [PlayerType, Record<ZonesNames, ZoneConfig>][]).map(([playerType, zones]) => (
        (Object.entries(zones) as [ZonesNames, ZoneConfig][]).map(([zoneName, zoneConfig]) => {
            let zoneContent = boardZonesContent[playerType]?.[zoneName] || null;

            return (
                <div
                    key={`${playerType}-${zoneName}`}
                    className={`zone ${playerType} ${zoneName} ${zoneContent ? "hasContent" : "hasNoContent"}`}
                    style={{
                        "--gridRowStart": zoneConfig.gridRowStart,
                        "--gridColStart": zoneConfig.gridColStart,
                    } as React.CSSProperties}
                >
                    {!zoneContent && <p className="zoneName">{zoneConfig.readableName}</p>}
                    {zoneContent && zoneContent.content}
                </div>
            )
        })
    ))



    return (
        <div className={`Board ${readyForMatch ? "transitionPerspective-end" : "transitionPerspective-start"}`}>
            {zones}
        </div>
    )
}