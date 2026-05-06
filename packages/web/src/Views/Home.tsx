import { useContext, useEffect } from "react"
import ClassicLayout from "@/Layouts/ClassicLayout"
import { AppContext } from "@/AppContext"
import "./Home.css"



export default function Home() {
    const appContext = useContext(AppContext)
    if (!appContext) throw new Error("useContext(AppContext) returned an empty value");
    const { appState, setAppState, utils } = appContext
    

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