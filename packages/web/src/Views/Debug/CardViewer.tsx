import ClassicLayout from "@/Layouts/ClassicLayout"
import Card from "../../Components/Game/Card"
import { useNavigate, useParams } from "react-router"
import { cards, type CardType } from "@/cards"
import styled from "styled-components"
import { useState } from "react"



export default function CardViewer() {
    function validateParamCardId(cardId: string | undefined): { success: boolean, errorJSX?: React.ReactNode, cardId?: number } {
        if (cardId === null || cardId === undefined) return { success: false, errorJSX: <p>L'url ne contient pas d'identifiant de carte</p> }
        else if (isNaN(Number(cardId))) return { success: false, errorJSX: <p>L'identifiant de carte doit être un nombre</p> }
        else if (!cards[Number(cardId)]) return { success: false, errorJSX: <p>Aucune carte n'a cet identifiant</p> }
        return { success: true, cardId: Number(cardId) }
    }

    function changeViewedCard() {
        const newCardId = (document.querySelector(`#newCardId`) as HTMLInputElement).value
        navigate(`/debug/card/${newCardId}`)
    }



    const navigate = useNavigate()

    // Concernant les paramètres de l'url
    let params = useParams()
    const cardIdValidation = validateParamCardId(params.cardId)


    // Concernant select newCard to show
    const cardListJSX = Object.entries(cards).map(([cardId, card]) => (
        <option key={card.name} value={cardId}>{card.name}</option>
    ));



    return (
        <ClassicLayout>
            <StyledMain className="CardViewer offsetTop centered">
                {cardIdValidation.success && <Card cardId={cardIdValidation.cardId!} />}
                {!cardIdValidation.success && cardIdValidation.errorJSX}

                <form>
                    <span>Choisir une autre carte : </span>
                    <select name="newCardId" id="newCardId" value={`${cardIdValidation.cardId ?? ""}`} onChange={changeViewedCard}>
                        <option value="" disabled>--- Choisissez une carte ---</option>
                        {cardListJSX}
                    </select>
                </form>
            </StyledMain>
        </ClassicLayout>
    )
}

const StyledMain = styled.main`
    max-height: 70vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;
    select {
        text-align: center;
    }
`