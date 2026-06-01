import Card from "./Card";
import "./Deck.css"

interface DeckProps {
    /** - Liste des uuids des cardInstances que contient le deck */ cardInstancesUuids: string[],
    /** - Default: false */ isExtraDeck?: boolean,
    /** - Callback exécuté quand on LClick sur le deck */ onClick?: () => void,
}



export default function Deck({ cardInstancesUuids, isExtraDeck = false, onClick, }: DeckProps) {
    const isClickable = !!onClick;
    const visibleCards = cardInstancesUuids.slice(0, 5);
    const offset = isExtraDeck ? -3 : 3;



    return (
        <div
            className={
                "Deck" +
                (isExtraDeck ? " isExtraDeck" : "") +
                (isClickable ? " isClickable" : "")
            }
            onClick={onClick}   // Expl : React check tout seul si undefined
        >
            <div className="cardsStack">
                {visibleCards.map((uuid, i) => (
                    <div key={uuid} className="Deck-cardContainer" style={{ transform: `translate(${i * offset}px, ${i * 3}px)` }}>
                        <Card cardId={0} cardInstanceUuid={uuid} isFaceDown isExtra={isExtraDeck} />
                        {i == visibleCards.length - 1 &&
                            <span className="numberOfCards">{cardInstancesUuids.length}</span>
                        }
                    </div>
                ))}
            </div>
        </div>
    );
}