import type { CardType } from "@/types";
import "./Graveyard.css"
import { cards } from "@/cards";
import type { CSSProperties } from "styled-components";
import Card from "./Card";



interface GraveyardProps {
    cardIds: number[],
    /**
     * - Default: false
     */
    isExtraGraveyard?: boolean,
    /**
     * - Default: false
     */
    isBanishedZone?: boolean,
}

export default function Graveyard({ cardIds, isExtraGraveyard = false, isBanishedZone = false }: GraveyardProps) {
    // Cap graveyard to 8 cards displayed
    const cappedCardIds = cardIds.slice(0, 8);
    const containingCards = cappedCardIds.map((cardId): CardType => cards[cardId] || null)

    // Arg safeguard
    if (containingCards.includes(null!)) return <p>No card found with one of these ids : {cardIds.join(", ")}</p>
        
    // Pour l'overlap
    const numberOfCards = cardIds.length;
    const count = Math.min(cappedCardIds.length, 5);
    const offsetX = isExtraGraveyard ? -10 : 10;


    return (
        <div className={`Graveyard` + (isExtraGraveyard ? ' isExtraGraveyard' : '')}>
            <div className="cardsStack">
                {containingCards.map((card, i) => (
                    <div key={`${card.name}-${i}`} className="gy-cardContainer" style={{ "--transformValue": `translate(${i * offsetX}px)`, rotate: `${i * (isExtraGraveyard ? -1 : 1)}deg` } as CSSProperties}>
                        <Card cardId={card.id} />
                    </div>
                ))}
            </div>
            <span className="numberOfCards" style={{ transform: `translate(${(count - 1) * offsetX}px, ${(count - 1) * offsetX * (isExtraGraveyard ? -1 : 1)}px)` }}>{numberOfCards}</span>
        </div>
    );
}