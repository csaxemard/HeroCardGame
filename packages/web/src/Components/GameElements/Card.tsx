import "./Card.css"
import { cards } from "@/cards";
import { motion } from "motion/react";

interface CardProps {
    /** - Si isFaceDown, mettre 0 comme cardId */ cardId: number,
    /** - Id unique qui identifie la carte tout le long de la partie. Utilisé par Motion */ cardInstanceUuid: string,
    isExtra?: boolean
    /** - Si isFaceDown, mettre 0 comme cardId */ isFaceDown?: boolean,
    // Options :
    /** - Callback exécuté quand on Rclick une carte (recto only).  
     * Le callback prend un argument cardId */ onContextMenu?: (cardId: number) => void;
    /** - Default : false */ isGrabbable?: boolean,
    /** - Default : false */ isSelectable?: boolean,
    // Style : 
    /** - Rotate card slightly to add realism (default: false) */ shouldRotate?: boolean,
    /** - Default : true */ hasRoundedCorners?: boolean,
    /** - Default : true */ hasBorder?: boolean,
}



/**
 * - max-width et max-height sont 100%, donc la taille est définie par le container de la Card
 */
export default function Card({
    cardId,
    cardInstanceUuid,
    isExtra,
    isFaceDown,
    // Options :
    onContextMenu,
    isGrabbable = false,
    isSelectable = false,
    // Style :
    hasRoundedCorners = false,
    hasBorder = true,
    shouldRotate = false,
}: CardProps) {

    function handleRClick(e: React.SyntheticEvent) {
        e.preventDefault();
        if (!isFaceDown && onContextMenu) {
            onContextMenu(cardId);
        }
    }



    // Récupère la carte associée à l'id
    const card = cards[cardId] ?? null
    if (!card && !isFaceDown) return <p>No card found with id {cardId}</p>

    // JSX stuff
    const isClickable = !!onContextMenu && !isFaceDown;   // Expl : !! équivalent à onContextMenu !== undefined && onContextMenu !== null;
    const randomRotate = shouldRotate ? Math.floor(Math.random() * 7) - 3 : 0;



    return (
        <motion.div
            className={
                "Card" +
                (isGrabbable ? " isGrabbable" : "") +
                (isSelectable ? " isSelectable" : "") +
                (isClickable ? " isClickable" : "") +
                (hasRoundedCorners ? " hasRoundedCorners" : "") +
                (isFaceDown ? " isFaceDown" : "") +
                (hasBorder ? " hasBorder" : "")
            }
            layoutId={cardInstanceUuid}   // Expl : Fait que quand l'élément est dérendu à un endroit et rerendu (même layoutId) à un autre, on aura une translation entre les deux endroits
            style={shouldRotate ? { transform: `rotate(${randomRotate}deg)` } : undefined}
            onContextMenu={handleRClick}
        >
            {!isFaceDown ?
                <img src={card.img} alt={card.name} />
                : isExtra ?
                    <img src="/extraCardBack.png" alt="cardBack" />
                    : <img src="/cardBack.png" alt="cardBack" />
            }
        </motion.div >
    )
}