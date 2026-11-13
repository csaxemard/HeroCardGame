import ClassicLayout from "@/Layouts/ClassicLayout"
import Card from "../Components/GameElements/Card"
import { useNavigate, useParams } from "react-router"
import { allCards } from "@/cards"
import styled from "styled-components"



export default function CardViewer() {
    function validateParamCardId(cardId: string | undefined): { success: boolean, errorJSX?: React.ReactNode, cardId?: number } {
        if (cardId === null || cardId === undefined) return { success: false, errorJSX: <p>L'url ne contient pas d'identifiant de carte</p> }
        else if (isNaN(Number(cardId))) return { success: false, errorJSX: <p>L'identifiant de carte doit être un nombre</p> }
        else if (!allCards[Number(cardId)]) return { success: false, errorJSX: <p>Aucune carte n'a cet identifiant</p> }
        return { success: true, cardId: Number(cardId) }
    }

    function changeViewedCard() {
        const newCardId = (document.querySelector(`#newCardId`) as HTMLInputElement).value
        navigate(`/catalogue/${newCardId}`)
    }



    const navigate = useNavigate()

    // Concernant les paramètres de l'url
    let params = useParams()
    const cardIdValidation = validateParamCardId(params.cardId)


    // Concernant select newCard to show
    const cardListJSX = Object.entries(allCards).map(([cardId, card]) => (
        <option key={card.name} value={cardId}>{card.name}</option>
    ));



    return (
        <ClassicLayout>
            <StyledMain className="CardViewer offsetTop centered">
                {cardIdValidation.success && <Card cardId={cardIdValidation.cardId!} imgResolution={1000} />}
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
    padding: 20px;

    @media (max-width: 1000px) {
        max-height: 85vh;
        gap: 20px;
        padding: 15px;
    }

    @media (max-width: 600px) {
        max-height: 90vh;
        gap: 15px;
        padding: 10px;
    }

    select {
        text-align: center;
        padding: 8px 12px;
        border-radius: 6px;
        border: 1px solid var(--dividerColor);
        background-color: var(--bg);
        color: var(--text);
        font-size: 14px;
        cursor: pointer;

        @media (max-width: 600px) {
            font-size: 13px;
            padding: 6px 10px;
        }
    }

    form {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: center;

        span {
            white-space: nowrap;
            font-size: 14px;

            @media (max-width: 600px) {
                font-size: 12px;
            }
        }
    }
`