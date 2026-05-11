import type { CardType } from "@/types";
import "./Graveyard.css"
import { cards } from "@/cards";



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

    if (containingCards.includes(null!)) return <p>No card found with one of these ids : {cardIds.join(", ")}</p>
        
    

    // Pour l'overlap
    const numberOfCards = cardIds.length;
    const count = Math.min(cappedCardIds.length, 5);
    const offsetX = isExtraGraveyard ? -10 : 10;

    // JSX stuff
    function getRandomRotate() {
        return Math.floor(Math.random() * (3 - (-3) + 1)) + (-3)
    }



    return (
        <div className={`Graveyard` + (isExtraGraveyard ? ' isExtraGraveyard' : '')}>
            <div className="cardsStack">
                {containingCards.map((card, i) => (
                    <img key={`${card.name}-${i}`} src={card.img} style={{ transform: `translate(${i * offsetX}px)`, rotate: `${i * (isExtraGraveyard ? -1 : 1) }deg` }} />
                ))}
            </div>
            <span className="numberOfCards" style={{ transform: `translate(${(count - 1) * offsetX}px, ${(count - 1) * offsetX * (isExtraGraveyard ? -1 : 1)}px)` }}>{numberOfCards}</span>
        </div>
    );
}