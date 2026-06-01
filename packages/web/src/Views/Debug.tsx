import Deck from "@/Components/GameElements/Deck";
import ClassicLayout from "@/Layouts/ClassicLayout";

export default function Debug() {
    return (
        <ClassicLayout hideFooter={true}>
            <main className="Debug centered fullHeight" style={{width : "350px", height: "350px"}}>
                <Deck cardInstancesUuids={["a", "b", "c"]}  />
            </main>
        </ClassicLayout>
    )
}