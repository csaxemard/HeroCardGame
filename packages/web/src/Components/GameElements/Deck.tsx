import { useContext } from "react";
import Card from "./Card";
import "./Deck.css"
import { MatchContext } from "@/Views/MatchContext";
import type { PlayerType } from "@/types";



interface DeckProps {
    numberOfCards: number,
    /** - Default: false */
    isExtraDeck?: boolean,
    ownerPlayer: PlayerType
}

export default function Deck({ numberOfCards, isExtraDeck = false, ownerPlayer }: DeckProps) {
    function handleClickDeck() {
        actionsPassedToZones.drawOnClickDeck()
    }
    

    
    const matchContext = useContext(MatchContext)
    if (!matchContext) throw new Error("useContext must be used within an AppProvider");
    const { canDrawCard, actionsPassedToZones } = matchContext;

    let canTriggerDrawOnClickDeck = false
    if (canDrawCard && !isExtraDeck && ownerPlayer == "player") canTriggerDrawOnClickDeck = true
        
    

    const count = Math.min(numberOfCards, 5);
    const offset = isExtraDeck ? -3 : 3;

    // JSX stuff
    // function getRandomRotate() {
    //     return Math.floor(Math.random() * (3 - (-3) + 1)) + (-3)
    // }

    return (
        <div className={`Deck` + (isExtraDeck ? ' isExtraDeck' : '') + (canTriggerDrawOnClickDeck ? " isClickable" : "")}
            onClick={canTriggerDrawOnClickDeck ? handleClickDeck : undefined}
        >
            <div className="cardsStack">
                {[...Array(count)].map((_, i) => (
                    <div className="Deck-cardContainer" key={i} style={{ transform: `translate(${i * offset}px, ${i * 3}px)` }} >
                        <Card cardId={0} isFaceDown isExtra={isExtraDeck} />
                    </div>
                ))}
            </div>
            <span className="numberOfCards" style={{ transform: `translate(${(count - 1) * offset}px, ${(count - 1) * offset * (isExtraDeck ? -1 : 1)}px)` }}>{numberOfCards}</span>
        </div>
    );
}