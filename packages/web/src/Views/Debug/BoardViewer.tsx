import { useEffect } from "react";

import ClassicLayout from "@/Layouts/ClassicLayout";
import Board from "../../Components/Game/Board";
import Card from "@/Components/Game/Card";



export default function BoardViewer() {
    function fillDeck(board: Element | null) {
        const deck = board?.querySelector(`.player.deck`);
        
        // for (let i = 0; i < 30; i++) {
        //     const newCard = document.createElement("div")
        //     newCard.innerHTML = String(<Card />)
        //     deck?.appendChild(newCard)
        // }
    }
    
    useEffect(() => {
        const board = document.querySelector(`.Board`)
        // fillDeck(board)
    }, [])
    
    
    
    return (
        <ClassicLayout hideFooter={true}>
            <main className="centered">
                <Board 
                readyForMatch
                />
            </main>
        </ClassicLayout>
    )
}
