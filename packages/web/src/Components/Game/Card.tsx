import "./Card.css"
import type { CardType } from "@/cards";
import { cards } from "@/cards";
import { useContext, useMemo, type SyntheticEvent } from "react";
import type { PlayerType } from "./Board";
import { MatchContext } from "@/Views/MatchContext";

interface CardProps {
    /** - Default : false */
    isGrabbable?: boolean,
    isSelectable?: boolean,
    isFaceDown?: boolean,
    /**
     * - Rotate card slightly to add realism (default: false)
     */
    shouldRotate?: boolean,
    /** - Default : true */
    hasRoundedCorners?: boolean,
    cardId: number,
    ownerPlayerType?: PlayerType
}



/**
 * - max-width et max-height sont 100%, donc la taille est définie par le container de la Card
 */
export default function Card({ isGrabbable = false, isSelectable = false, hasRoundedCorners = true, isFaceDown, cardId, shouldRotate = false }: CardProps) {
    function handleCardClick(e: SyntheticEvent) {
        const target = e.currentTarget as HTMLElement;

        const timer = setTimeout(() => {
            showModal?.(cardId);
        }, 1500);

        const cleanup = () => clearTimeout(timer);

        target.addEventListener("mousemove", cleanup, { once: true });
        target.addEventListener('mouseup', cleanup, { once: true });
    }



    // Context pour ModalCardFullscreen
    let canTriggerShowModal = false
    const showModal = useContext(MatchContext)
    if (showModal) canTriggerShowModal = true

    // Récupère la carte associée à l'id
    const card = cards[cardId] ?? null
    if (!card) return <p>No card found with id {cardId}</p>

    // JSX stuff
    let randomRotate = null
    if (shouldRotate) {
        randomRotate = useMemo(() => (
            Math.floor(Math.random() * (3 - (-3) + 1)) + (-3)
        ), []);
    }



    return (
        <div
            className={
                "Card" +
                (isGrabbable ? " isGrabbable" : "") +
                (isSelectable ? " isSelectable" : "") +
                (hasRoundedCorners ? " hasRoundedCorners" : "") +
                (isFaceDown ? " isFaceDown" : "")
            }
            // data-id={card.id}
            style={shouldRotate ? { transform: `rotate(${randomRotate}deg)` } : undefined}
            onMouseDown={canTriggerShowModal ? handleCardClick : undefined}
        >
            {!isFaceDown ?
                <img src={card.img} alt={card.name} />
                : <img src="/cardBack.png" alt="cardBack" />
            }

            {/* <div className="tooltipRecordingMouseDownTime"></div> */}
        </div >
    )
}