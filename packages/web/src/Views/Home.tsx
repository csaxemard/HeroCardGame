import { useEffect } from "react"
import ClassicLayout from "@/Layouts/ClassicLayout"
import "./Home.css"



export default function Home() {
    useEffect(() => {
        // setPageTitle("Accueil")
    }, [])

    

    return (
        <ClassicLayout>
            <main className="Home centered">
                <h1>Hero Card Game</h1>
            </main>
        </ClassicLayout>
    )
}