import { useRef, useEffect, useState } from "react";
import Card from "./Card";
import "./Hand.css";

interface HandProps {
    cardsIds: number[];
    isOpponentHand?: boolean;
    parentLeftRef?: React.RefObject<HTMLDivElement | null>
}

export default function Hand({ cardsIds, isOpponentHand = false, parentLeftRef }: HandProps) {
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
    const [canTranslateOnHover, setCanTranslateOnHover] = useState(false);



    // Ajuste l'overlap quand nouvelle carte ou resize window
    useEffect(() => {
        const container = cardsContainerRef.current;
        if (!container) return;

        adjustOverlap(container);

        const resizeObserver = new ResizeObserver(() => adjustOverlap(container));
        resizeObserver.observe(container);

        return () => resizeObserver.disconnect();
    });

    // enable CanTranslateOnHover if not scrolled
    useEffect(() => {
        const container = parentLeftRef?.current;
        if (!container || isOpponentHand) return;

        const handleScroll = () => {
            setCanTranslateOnHover(container.scrollTop == 0);
        };

        handleScroll(); // valeur initiale
        container.addEventListener("scroll", handleScroll);

        return () => container.removeEventListener("scroll", handleScroll);
    });



    return (
        <div className={"Hand" + (isOpponentHand ? " opponent" : " player")}>
            <div className="cardsContainer" ref={cardsContainerRef}>
                {cardsIds.map((cardId, index) => (
                    <div key={String(cardId) + index} className={"cardContainer" + (canTranslateOnHover ? " canTranslateOnHover" : "")} style={{ zIndex: index }}>
                        <Card cardId={cardId} isFaceDown={isOpponentHand} />
                    </div>
                ))}
            </div>
        </div>
    );
}