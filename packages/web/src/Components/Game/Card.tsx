import "./Card.css"
import type { Card } from "@/cards";
import { cards } from "@/cards";
import React, { useContext, useEffect, useMemo, useState, type SyntheticEvent } from "react";
import type { PlayerType } from "./Board";
import { BoardViewerContext } from "@/Views/Debug/BoardViewerContext";

interface CardProps {
    /** - Default : false */
    isGrabbable?: boolean,
    isSelectable?: boolean,
    isFaceDown?: boolean,
    cardId: number,
    ownerPlayerType?: PlayerType
}



export default function Card({ isGrabbable = false, isSelectable = false, isFaceDown, cardId }: CardProps) {
    function handleCardClick(e: SyntheticEvent) {
        const target = e.currentTarget as HTMLElement;

        const timer = setTimeout(() => {
            showModal?.(cardId);
        }, 1500);

        const cleanup = () => clearTimeout(timer);

        target.addEventListener("mousemove", cleanup, { once: true });
        target.addEventListener('mouseup', cleanup, { once: true });
    }



    // Context pour modal.showCardFullscreen
    const showModal = useContext(BoardViewerContext)
    if (!showModal) throw new Error("useContext must be used within an AppProvider");

    // Récupère la carte associée à l'id
    const card = cards[cardId] ?? null
    if (!card) return (<p>No card found with id {cardId}</p>)

    // JSX stuff
    const randomRotate = useMemo(() => (
        Math.floor(Math.random() * 7) - 3
    ), []);



    return (
        <div
            className={`Card ${isGrabbable ? "isGrabbable" : ""} ${isSelectable ? "isSelectable" : ""}`}
            data-id={card.id}
            style={{ transform: `rotate(${randomRotate}deg)` }}
            onMouseDown={handleCardClick}
        >
            <div className="front">
                <img src={card.img} alt={card.name} />
            </div>
            <div className="back">
                <img src="/cardBack.png" alt="cardBack" />
            </div>
            <div className="tooltipRecordingMouseDownTime"></div>
        </div>
    )
}