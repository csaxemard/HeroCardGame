import styled from "styled-components"
import ClassicLayout from "@/Layouts/ClassicLayout"



export default function Error404() {
    return (
        <ClassicLayout>
            <StyledMain>
                <h1>Erreur, cette page n'existe pas.</h1>
            </StyledMain>
        </ClassicLayout>
    )
}



const StyledMain = styled.main`
    margin: 20px;
`
