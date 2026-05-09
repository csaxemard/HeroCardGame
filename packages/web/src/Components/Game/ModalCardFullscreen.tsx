import type { Card } from "@/cards"
import "./ModalCardFullscreen.css"
import { useEffect } from "react"



export default function ModalCardFullscreen({ card, removeModal }: { card: Card, removeModal: () => void }) {
    function handleEscape(e: KeyboardEvent) {
        console.log(e)
        if (e.key !== "Escape") return
        removeModal()
        document.removeEventListener("keydown", handleEscape)
    }

    function handleClickModal(e: any) {
        if (!(e.target as HTMLElement).closest("img")) {
            removeModal()
        }
    }



    useEffect(() => {
        document.addEventListener("keydown", handleEscape)
    }, [])

    return (
        <div className="modal cardFullscreen" onClick={handleClickModal}>
            <button className="removeModal charAsIcon" title="Fermer (Échap)" onClick={removeModal}>⨉</button>
            <img src={card.img} alt={card.name} />
        </div>
    )
}