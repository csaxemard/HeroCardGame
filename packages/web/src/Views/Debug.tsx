import ClassicLayout from "@/Layouts/ClassicLayout";
import PrototypeCard from "@/PrototypeMatchStuff/PrototypeCard";
import { prototypeCards } from "@/PrototypeMatchStuff/AllPrototypeCards";
import { useState } from "react";

export default function Debug() {

    const [cardId, set_cardId] = useState([1, 6, 8, 28, 30, 31, 36, 45, 72, 114, 124][Math.floor(Math.random() * 11)])

    return (
        <ClassicLayout hideFooter={true}>
            <main className="Debug centered fullHeight" style={{ width: "350px", height: "350px" }}>
                <PrototypeCard card={prototypeCards[cardId]}></PrototypeCard>
                <input type="number" value={cardId} onChange={(e) => { set_cardId(_ => Number(e.target.value)) }} />
            </main>
        </ClassicLayout>
    )
}