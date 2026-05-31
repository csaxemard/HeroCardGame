import "./Card.css"
import { cards } from "@/cards";
import { useContext, useMemo, type SyntheticEvent } from "react";
import { MatchContext } from "@/Views/MatchContext";
import type { PlayerType } from "@/types";

interface CardProps {
    /** - Default : false */
    isGrabbable?: boolean,
    /** - Default : false */
    isSelectable?: boolean,
    /** Si isFaceDown, mettre 0 comme cardId */
    isFaceDown?: boolean,
    /** - Rotate card slightly to add realism (default: false) */
    shouldRotate?: boolean,
    /** - Default : true */
    hasRoundedCorners?: boolean,
    /** - Default : true */
    hasBorder?: boolean,
    isExtra?: boolean
    ownerPlayerType?: PlayerType
    /** Si isFaceDown, mettre 0 comme cardId */
    cardId: number,
}



/**
 * - max-width et max-height sont 100%, donc la taille est définie par le container de la Card
 */
export default function Card({ isGrabbable = false, isSelectable = false, hasRoundedCorners = false, hasBorder = true, isFaceDown, isExtra, cardId, shouldRotate = false }: CardProps) {
    function handleCardClick(e: SyntheticEvent) {
        const target = e.currentTarget as HTMLElement;

        const timer = setTimeout(() => {
            actionsPassedToZones.showModal?.(cardId);
        }, 1500);

        const cleanup = () => clearTimeout(timer);

        target.addEventListener("mousemove", cleanup, { once: true });
        target.addEventListener('mouseup', cleanup, { once: true });
    }
    function handleCardRClick(e: SyntheticEvent) {
        e.preventDefault()
        if (isFaceDown) return
        actionsPassedToZones.showModal?.(cardId);
    }



    // Context pour ModalCardFullscreen
    let canTriggerShowModal = false
    const matchContext = useContext(MatchContext)
    if (!matchContext) throw new Error("useContext must be used within an AppProvider");
    const { actionsPassedToZones } = matchContext;

    if (!isFaceDown) canTriggerShowModal = true

    // Récupère la carte associée à l'id
    const card = cards[cardId] ?? null
    if (!card && !isFaceDown) return <p>No card found with id {cardId}</p>

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
                (canTriggerShowModal ? " canTriggerShowModal" : "") +
                // (isClickable ? " isclickable" : "") +
                (hasRoundedCorners ? " hasRoundedCorners" : "") +
                (isFaceDown ? " isFaceDown" : "") +
                (hasBorder ? " hasBorder" : "")
            }
            // data-id={card.id}
            style={shouldRotate ? { transform: `rotate(${randomRotate}deg)` } : undefined}
            onMouseDown={canTriggerShowModal ? handleCardClick : undefined}
            onContextMenu={canTriggerShowModal ? handleCardRClick : undefined}
        >
            {!isFaceDown ?
                <img src={card.img} alt={card.name} />
                : isExtra ?
                    <img src="/extraCardBack.png" alt="cardBack" />
                    : <img src="/cardBack.png" alt="cardBack" />
            }

            {/* <div className="tooltipRecordingMouseDownTime"></div> */}
        </div >
    )
}