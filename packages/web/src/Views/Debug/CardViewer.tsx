import ClassicLayout from "@/Layouts/ClassicLayout"
import Card from "../../Components/Game/Card"

export default function CardViewer() {
    return (
        <ClassicLayout>
            <main className="centered offsetTop">
                <Card />
            </main>
        </ClassicLayout>
    )
}