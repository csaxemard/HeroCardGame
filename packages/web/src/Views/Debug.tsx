import Card from "@/Components/GameElements/Card";
import ClassicLayout from "@/Layouts/ClassicLayout";

export default function Debug() {
    return (
        <ClassicLayout hideFooter={true}>
            <main className="Debug centered fullHeight">
                <Card cardId={1} />
            </main>
        </ClassicLayout>
    )
}