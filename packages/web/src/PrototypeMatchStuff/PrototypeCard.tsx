import type { PrototypeCard_Type } from "./prototypeMatchStuffTypes"
import "./PrototypeCard.css"
import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * ### PrototypeCard
 * - Une prototype de carte, pour tester les fonctionnalités interactives des cartes
 * - Doit fonctionner tout aussi bien qu'une carte normale
 * - Props :
 *     - `card: PrototypeCardType`
 */
export default function PrototypeCard({ card, canDescriptionOverflow = true }: { card: PrototypeCard_Type, canDescriptionOverflow?: boolean }) {
    const cardTypesDesignElements = {
        icons: { eau: "🌊", feu: "🔥", force: "⚔️", magie: "🌀", multicolore: "🌈", plante: "🌳", vent: "🪽" },
        backgroundColors: { eau: "#00162f", feu: "#5d1515", force: "#652b02", magie: "#965081", multicolore: "#782592", plante: "#1d5905", vent: "#a5771d" },
        innerBackgroundColorsGradientStart: { eau: "#497cb6", feu: "#5d1515", force: "#652b02", magie: "#965081", multicolore: "#782592", plante: "#1d5905", vent: "#a5771d" },
        innerBackgroundColorsGradientEnd: { eau: "#032654", feu: "#5d1515", force: "#652b02", magie: "#965081", multicolore: "#782592", plante: "#1d5905", vent: "#a5771d" },
        borderColors: { eau: "#01356f", feu: "#5d1515", force: "#652b02", magie: "#965081", multicolore: "#782592", plante: "#1d5905", vent: "#a5771d" },
    };
    const cardCollectionsAcronyms = { "Les Armes de Légende": "ARLE", "L'Art des Maîtres": "ARMA", "Le Secret des Limbes": "SELI", "Rainbowgeddon": "RAIN", "Wings of Destiny": "WOD" };

    const prototypeCard_ref = useRef<HTMLDivElement | null>(null)
    const prototypeCardName_ref = useRef<HTMLSpanElement | null>(null)
    const [cardCurrentWidth, set_cardCurrentWidth] = useState<number>(0) // Default 0 makes text invisible while correct cardCurrentWidth is not rendered
    const [cardNameXScale, set_cardNameXScale] = useState<number | undefined>(0)

    useEffect(() => {
        // Au montage et à chaque fois que la height de div.prototypeCard change, update cardCurrentWidth
        if (!prototypeCard_ref.current) return;

        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                set_cardCurrentWidth(entry.target.getBoundingClientRect().width);
            }
        })

        observer.observe(prototypeCard_ref.current)
        return () => observer.disconnect()
    }, [])

    useLayoutEffect(() => {
        // Au montage et à chaque fois que le nom de la carte change,
        // Calcule la taille du nom pour qu'il soit entièrement visible s'il est trop long
        const el = prototypeCardName_ref.current;
        const parent = el?.parentElement;
        if (!el || !parent) return;

        const textWidth = el.scrollWidth;
        const containerWidth = parent.getBoundingClientRect().width;
        if (!textWidth || !containerWidth) return;
        set_cardNameXScale(Math.min(containerWidth / textWidth, 1));
    }, [card.name, cardCurrentWidth]);

    // const artefactCardDesign_JSX = <></>;


    return (
        <div ref={prototypeCard_ref} className={"prototypeCard"} style={{
            "--typeBgColor": cardTypesDesignElements.backgroundColors[card.type],
            "--typeInnerBgColorGradientStart": cardTypesDesignElements.innerBackgroundColorsGradientStart[card.type],
            "--typeInnerBgColorGradientEnd": cardTypesDesignElements.innerBackgroundColorsGradientEnd[card.type],
            "--typeBorderColor": cardTypesDesignElements.borderColors[card.type],
            "--cardCurrentWidth": String(cardCurrentWidth) + "px",
        } as any}>
            <div className="innerBackground">
                <div className="topInfos">
                    <div className="nameContainer">
                        <span ref={prototypeCardName_ref} className="name" style={{ "--cardNameXScale": cardNameXScale } as any}>
                            {card.name}
                        </span>
                    </div>
                    <div className="type charAsIcon">{cardTypesDesignElements.icons[card.type]}</div>
                </div>

                <div className="imageArea">
                    <img src={`/cardArtworks/${card.id}.jpg`} alt="" />

                    <div className="starsContainer">
                        {[...Array(card.stars)].map((_, i) => <div key={i} className="star charAsIcon"></div>)}
                    </div>
                </div>

                <span className="family">/{card.family}</span>

                <div className="bottomInfos">
                    {card.category == "artefact" &&
                        <p className="description" style={{ overflow: canDescriptionOverflow ? "auto" : "hidden" }}>
                            {card.description}
                        </p>
                    }
                    {card.category == "combattant" &&
                        <>
                            <span className="atk">Atk : {card.baseAtk}</span>
                            <span className="def">Def : {card.baseDef}</span>
                        </>
                    }
                </div>

                <div className="footerInfos">
                    <span className="cardReference">{cardCollectionsAcronyms[card.collection]}-FR{String(card.id).padStart(3, "0")}</span>
                    <span className="copyright">&copy; 2020 Gricha </span>
                </div>
            </div>

            {/* "Artefact" | "Champion" | "Combattant" | "Dark Héros" | "Demi Héros" | "Héros" | "Multi Héros" | "Terrain" */}
        </div>
    )
}
