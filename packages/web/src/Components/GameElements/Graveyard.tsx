import "./Graveyard.css"
import Card from "./Card";
import type { CardInstance } from "@/types";

interface GraveyardProps {
    /** - Liste des cardInstances que contient ce Graveyard */ cardInstances: CardInstance[];
    /** - Default: false */ isExtraGraveyard?: boolean,
    /** - Default: false */ isBanishedZone?: boolean,
    onCardContextMenu: (cardId: number) => void
}



export default function Graveyard({ cardInstances, isExtraGraveyard = false, isBanishedZone = false, onCardContextMenu  }: GraveyardProps) {
    isBanishedZone   // pour enlever l'erreur unused declaration de ts qui empeche le build
    const visibleCards = cardInstances.slice(0, 8);
    const count = Math.min(visibleCards.length, 5);
    const offsetX = isExtraGraveyard ? -10 : 10;
    const numberOfCards = cardInstances.length;

    const visibleCardsJSX = visibleCards.map((instance, i) => (
        <div
            key={instance.uuid}
            className="gy-cardContainer"
            style={{ transform: `translate(${i * offsetX}px)`, rotate: `${i * (isExtraGraveyard ? -1 : 1)}deg` }}
        >
            <Card cardId={instance.cardId} cardInstanceUuid={instance.uuid} onContextMenu={onCardContextMenu} />
        </div>
    ))


    return (
        <div className={"Graveyard" + (isExtraGraveyard ? ' isExtraGraveyard' : '')}>
            <div className="cardsStack">
                {visibleCardsJSX}
            </div>
            <span className="numberOfCards" style={{ transform: `translate(${(count - 1) * offsetX}px, ${(count - 1) * offsetX * (isExtraGraveyard ? -1 : 1)}px)` }}>
                {numberOfCards}
            </span>
        </div>
    );
}
