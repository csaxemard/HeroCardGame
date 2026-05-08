import "./Card.css"
import type { Card } from "@/cards";
import { cards } from "@/cards";
import { useMemo } from "react";

interface CardProps {
    /** - Default : false */
    isGrabbable?: boolean,
    isSelectable?: boolean,
    isFaceDown?: boolean,
    cardId: number,
}



export default function Card({ isGrabbable = false, isSelectable = false, isFaceDown, cardId }: CardProps) {
    function getCardById(cardId: number) {
        let card;
        for (const card_tmp of cards) {
            if (card_tmp.id === cardId) {
                card = card_tmp
                break
            }
        }

        // if (!card) throw new Error(`No card found with id ${cardId}`);

        return card
    }

    const card: Card | undefined = getCardById(cardId)
    if (!card) return (<p>No card found with id {cardId}</p>)



    const randomRotate = useMemo(() => (
        Math.floor(Math.random() * 7) - 3
    ), []);

    return (
        <div
            className={`Card ${isGrabbable ? "isGrabbable" : ""} ${isSelectable ? "isSelectable" : ""}`}
            data-id={card.id}
            style={{ transform: `rotate(${randomRotate}deg)` }}
        >
            <div className="front">
                <img src={card.img} alt={card.name} />
            </div>
            <div className="back">
                <img src="/cardBack.png" alt="cardBack" />
            </div>
        </div>
    )
}