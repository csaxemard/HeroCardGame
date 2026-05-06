import styled from "styled-components"

export default function Footer() {
    return (
        <StyledFooter>
            <p>&copy; 2026 Hero Card Game</p>
        </StyledFooter>
    )
}


const StyledFooter = styled.footer`
    margin-top: 50px;
    padding: 15px;
    width: 100%;

    background-color: var(--bg);

    p {
        font-size: small;
        color: var(--textSub1);
    }
`