import { useRef, useLayoutEffect } from "react";
import Card from "./Card";
import "./Hand.css";
import type { CardInstance } from "@/types";

interface HandProps {
    cardInstances: CardInstance[];
    /** - Default: false */ isOpponentHand?: boolean;
    /** - Définit si les cartes se soulèvent on card hover. (Default: false)  
     * Utilisé pour l'UI de mes Matchs */ canTranslateOnHover?: boolean
     onCardContextMenu: (cardId: number) => void
}



export default function Hand({ cardInstances, isOpponentHand = false, canTranslateOnHover, onCardContextMenu }: HandProps) {

    function adjustOverlap(container: HTMLElement) {
        const cards = Array.from(container.children) as HTMLElement[];
        if (cards.length < 2) return;

        const containerWidth = container.clientWidth;
        const cardWidth = cards[0].offsetWidth;
        const gap = 20;
        const totalWidth = cards.length * cardWidth + (cards.length - 1) * gap;

        if (totalWidth > containerWidth) {
            const deficit = totalWidth - containerWidth;
            const marginLeft = deficit / (cards.length - 1);
            for (let i = 1; i < cards.length; i++) {
                cards[i].style.marginLeft = `-${marginLeft}px`;
            }
        } else {
            for (let i = 1; i < cards.length; i++) {
                cards[i].style.marginLeft = "0px";
            }
        }
    };



    const cardsContainerRef = useRef<HTMLDivElement>(null);

    // Ajuste l'overlap quand nouvelle carte ou window resized
    useLayoutEffect(() => {
        // Expl : useLayoutEffect s'exécute avant que le navigateur ne peint à l'écran. useEffect s'exécute après la peinture
        const container = cardsContainerRef.current;
        if (!container) return;

        adjustOverlap(container);

        const resizeObserver = new ResizeObserver(() => adjustOverlap(container));
        resizeObserver.observe(container);

        return () => resizeObserver.disconnect();
    }, [cardInstances.length]);



    return (
        <div className={"Hand" + (isOpponentHand ? " opponent" : " player")}>
            <div className="cardsContainer" ref={cardsContainerRef}>
                {cardInstances.map((instance, index) => (
                    <div key={instance.uuid} className={"cardContainer" + (canTranslateOnHover ? " canTranslateOnHover" : "")} style={{ zIndex: index }}>
                        <Card cardId={isOpponentHand ? 0 : instance.cardId} cardInstanceUuid={instance.uuid} isFaceDown={isOpponentHand} onContextMenu={onCardContextMenu}/>
                    </div>
                ))}
            </div>
        </div>
    );
}