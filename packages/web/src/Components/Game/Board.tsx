import { useEffect } from "react";
import "./Board.css"
import type { BoardZonesConfig, ZonesNames, ZoneConfig, PlayerType, BoardZonesContent, DeckZoneContent, GraveyardZoneContent, CardZoneContent } from "@/types";
import Card from "./Card";
import Deck from "./Deck";
import { cards } from "@/cards";
import Graveyard from "./Graveyard";

export interface BoardProps {
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
            field: { readableName: "Terrain", gridRowStart: 4, gridColStart: 5, isDisabled: true},
            deck: { readableName: "Deck", gridRowStart: 1, gridColStart: 1, },
            extraDeck: { readableName: "Extra deck", gridRowStart: 1, gridColStart: 7, },
            graveyard: { readableName: "Cimetière", gridRowStart: 3, gridColStart: 1, },
            extraGraveyard: { readableName: "Extra cimetière", gridRowStart: 3, gridColStart: 7, },
            banished: { readableName: "Zone bannie", },
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



    // Logique à déplacer dans Match
    useEffect(() => {
        setTimeout(() => {
            readyForMatch && document.querySelector(`.Board`)?.classList.remove("transitionPerspective-start")
        }, 400);
    }, [])


    // Crée le JSX pour chaque zone avec son contenu définit dans le prop
    const zonesJSX = (Object.entries(boardZonesConfig) as [PlayerType, Record<ZonesNames, ZoneConfig>][]).map(([playerType, zones]) => (
        (Object.entries(zones) as [ZonesNames, ZoneConfig][]).map(([zoneName, zoneConfig]) => {
            if (zoneName == "field") return;
            
            let zoneContent = boardZonesContent[playerType][zoneName];
            
            // Définit le zoneContentJSX selon la zone
            let zoneContentJSX;
            if (["deck"].includes(zoneName)) {
                const zoneContent_tmp = zoneContent as DeckZoneContent
                if (zoneContent_tmp.numberOfCards <= 0) {
                    zoneContentJSX = null!
                } else {
                    zoneContentJSX = <Deck numberOfCards={zoneContent_tmp.numberOfCards} isExtraDeck={zoneName == "extraDeck"} />;
                }
            } else if (zoneName == "extraDeck") {
                const zoneContent_tmp = zoneContent as DeckZoneContent
                if (zoneContent_tmp.numberOfCards <= 0) {
                    zoneContentJSX = null!
                } else {
                    zoneContentJSX = <Deck numberOfCards={zoneContent_tmp.numberOfCards} isExtraDeck />;
                }
            } else if (["graveyard", "extraGraveyard"].includes(zoneName)) {
                const zoneContent_tmp = zoneContent as GraveyardZoneContent
                if (zoneContent_tmp.cardIds.length == 0) {
                    zoneContentJSX = null!
                } else {
                    zoneContentJSX = <Graveyard cardIds={zoneContent_tmp.cardIds} isExtraGraveyard={zoneName == "extraGraveyard"} isBanishedZone={zoneName == "banished"} />;
                }
            } else {
                const zoneContent_tmp = zoneContent as CardZoneContent
                if ('cardId' in zoneContent_tmp && zoneContent_tmp.cardId) {
                    if (!cards[zoneContent_tmp.cardId]) {
                        zoneContentJSX = null!
                    } else {
                        zoneContentJSX = <Card cardId={zoneContent_tmp.cardId} shouldRotate={readyForMatch && true} />;
                    }
                }
            }


            return (
                <div
                    key={`${playerType}-${zoneName}`}
                    className={`zone ${playerType} ${zoneName} ${zoneContentJSX ? "hasContent" : "hasNoContent"}`}
                    style={{
                        "--gridRowStart": zoneConfig.gridRowStart,
                        "--gridColStart": zoneConfig.gridColStart,
                    } as React.CSSProperties}
                >
                    {!zoneContentJSX && <p className="zoneName">{zoneConfig.readableName}</p>}
                    {zoneContentJSX && zoneContentJSX}
                </div>
            )
        })
    ))



    return (
        <div className={`Board ${readyForMatch ? "transitionPerspective-end transitionPerspective-start" : ""}`}>
            {zonesJSX}
        </div>
    )
}