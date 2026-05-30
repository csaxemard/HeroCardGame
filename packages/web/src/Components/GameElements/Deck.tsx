import Card from "./Card";
import "./Deck.css"



interface DeckProps {
    numberOfCards: number,
    /**
     * - Default: false
     */
    isExtraDeck?: boolean,
}

export default function Deck({ numberOfCards, isExtraDeck = false }: DeckProps) {
    const count = Math.min(numberOfCards, 5);
    const offset = isExtraDeck ? -3 : 3;

    // JSX stuff
    function getRandomRotate() {
        return Math.floor(Math.random() * (3 - (-3) + 1)) + (-3)
    }

    return (
        <div className={`Deck` + (isExtraDeck ? ' isExtraDeck' : '')}>
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