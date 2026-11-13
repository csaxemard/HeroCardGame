import "./ModalChoseCards.css"
import { useEffect } from "react"
import { allCards } from "@/cards"
import type { CardInstance } from "@/types"

interface ModalChoseCards {
    /** Les cartes a afficher (n'affiche pas des Cards, juste les images) */ cardInstances: CardInstance[],
    /**  */ choiceText: string,
    /** - Callback appelé on modal closed */ onModalClosed: () => void,
    /** - Callback appelé quand on clique sur une des images de cartes.  
     * Passe en argument l'id de la carte */ onCardImgClicked?: (cardInstanceUuid: string) => void,
}



export default function ModalCardFullscreen({ cardInstances, choiceText, onModalClosed, onCardImgClicked }: ModalChoseCards) {

    function handleEscape(e: KeyboardEvent) {
        if (e.key !== "Escape") return
        document.removeEventListener("keydown", handleEscape)
        onModalClosed?.()
    }

    function handleClickModal(e: any) {
        if (!(e.target as HTMLElement).closest("img, p")) {
            onModalClosed?.()
        }
    }



    const cards = cardInstances.map(instance => allCards[instance.cardId])

    useEffect(() => {
        document.addEventListener("keydown", handleEscape)
    }, [])



    return (
        <div className="ModalChoseCards" onClick={handleClickModal}>
            <button className="removeModal charAsIcon" title="Fermer (Échap)" onClick={onModalClosed}>⨉</button>
            <p className="choiceText">{choiceText}</p>
            <div className="cardsList coloredScrollbar" >
                {cards.map((card, i) => (
                    <img key={card.img + i} onClick={() => onCardImgClicked?.(cardInstances[i].uuid)} src={card.img.replace("215/", "600/")} alt={card.name} />
                ))}
            </div>
        </div>
    )
}