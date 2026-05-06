import "./Card.css"
import type { Card } from "@/cards";
import { cards } from "@/cards";

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

    return (
        <div
            className={`Card ${isGrabbable ? "isGrabbable" : ""} ${isSelectable ? "isSelectable" : ""} ${isFaceDown ? "isFaceDown" : ""}`}
            data-id={card.id} style={{
                rotate: String(Math.floor(Math.random() * (3 - (-3) + 1)) + (-3)) + "deg"
            }}>
            {!isFaceDown &&
                <div className="front">
                    <img src={card.img} alt={card.name} />
                </div>
            }
            {isFaceDown &&
                <div className="back">
                    <img src="/public/cardBack.png" alt="cardBack" />
                </div>
            }
        </div>
    )
}