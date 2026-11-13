import type { PrototypeCard_Type } from "./prototypeMatchStuffTypes"
import "./PrototypeCard.css"

/**
 * ### PrototypeCard
 * - Une prototype de carte, pour tester les fonctionnalités interactives des cartes
 * - Doit fonctionner tout aussi bien qu'une carte normale
 * - Props :
 *     - `card: PrototypeCardType`
 */
export default function PrototypeCard({ card }: { card: PrototypeCard_Type }) {
    const cardTypesIcons = { eau: "🌊", feu: "🔥", force: "⚔️", magie: "🌀", multicolore: "🌈", plante: "🌳", vent: "🪽" };
    const cardTypesColors = { eau: "#295c95", feu: "#5d1515", force: "#652b02", magie: "#965081", multicolore: "#782592", plante: "#1d5905", vent: "#a5771d" };

    return (
        <div className={"prototypeCard"} style={{ "--typeColor": cardTypesColors[card.type] } as any}>
            <div className="topInfos">
                <div>
                    <div className="name">{card.name}</div>
                    <div className="type charAsIcon">{cardTypesIcons[card.type]}</div>
                </div>
                {/* <div className="family">/{card.family}</div> */}
            </div>

            <div className="imageArea">
                <img src={`/cardArtworks/${card.id}.jpg`} alt="" />
                <div className="stars charAsIcon" data-stars={card.stars}></div>
            </div>

            <div className="family">/{card.family}</div>
            <div className="bottomInfos">
                {card.category == "artefact" &&
                    <div className="description">{card.description}</div>
                }
                {card.category == "combattant" &&
                    <>
                        <div className="atk">Atk : {card.baseAtk}</div>
                        <div className="def">Def : {card.baseDef}</div>
                    </>
                }
            </div>
            <div className="footerInfos">
                <span className="cardReference">WOD-FR045</span>
                <span className="copyright">&copy; 2020 Gricha </span>
            </div>

            {/* "Artefact" | "Champion" | "Combattant" | "Dark Héros" | "Demi Héros" | "Héros" | "Multi Héros" | "Terrain" */}
        </div>
    )
}
