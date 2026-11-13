import ClassicLayout from "@/Layouts/ClassicLayout";
import PrototypeCard from "@/PrototypeMatchStuff/PrototypeCard";
import { prototypeCards } from "@/PrototypeMatchStuff/AllPrototypeCards";

export default function Debug() {
    return (
        <ClassicLayout hideFooter={true}>
            <main className="Debug centered fullHeight" style={{width : "350px", height: "350px"}}>
                <PrototypeCard card={prototypeCards[112]}></PrototypeCard>
            </main>
        </ClassicLayout>
    )
}