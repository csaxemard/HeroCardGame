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
    const cardTypesColors = { eau: "#001a39", feu: "#5d1515", force: "#451e02", magie: "#420530", multicolore: "#782592", plante: "#1d5905", vent: "#a5771d" };

    return (
        <div className={"prototypeCard"} style={{ "--typeColor": cardTypesColors[card.type] } as any}>
            <div className="topInfos">
                <div>
                    <div className="name">{card.name}</div>
                    <div className="type charAsIcon">{cardTypesIcons[card.type]}</div>
                </div>
                {/* <div className="family">/{card.family}</div> */}
            </div>

            <div className="imageArea"></div>

            <div className="family">/{card.family}</div>
            <div className="bottomInfos">
                <div className="atk">Atk : {card.baseAtk}</div>
                <div className="stars">{card.stars} ⭐</div>
                <div className="def">Def : {card.baseDef}</div>
            </div>

            {/* "Artefact" | "Champion" | "Combattant" | "Dark Héros" | "Demi Héros" | "Héros" | "Multi Héros" | "Terrain" */}
        </div>
    )
}
