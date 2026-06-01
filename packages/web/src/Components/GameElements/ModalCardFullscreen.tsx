import type { CardType } from "@/types"
import "./ModalCardFullscreen.css"
import { useEffect } from "react"

interface ModalCardFullscreenProps {
    /** La carte a afficher (n'affiche pas un Card, juste l'image) */ card: CardType,
    /** - Callback appelé on modal closed */ onModalClosed: () => void,
}



export default function ModalCardFullscreen({ card, onModalClosed }: ModalCardFullscreenProps) {

    function handleEscape(e: KeyboardEvent) {
        if (e.key !== "Escape") return
        document.removeEventListener("keydown", handleEscape)
        onModalClosed?.()
    }

    function handleClickModal(e: any) {
        if (!(e.target as HTMLElement).closest("img")) {
            onModalClosed?.()
        }
    }



    useEffect(() => {
        document.addEventListener("keydown", handleEscape)
    }, [])



    return (
        <div className="modal cardFullscreen" onClick={handleClickModal}>
            <button className="removeModal charAsIcon" title="Fermer (Échap)" onClick={onModalClosed}>⨉</button>
            <img src={card.img.replace("215/", "1000/")} alt={card.name} />
        </div>
    )
}