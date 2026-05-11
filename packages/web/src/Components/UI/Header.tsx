import { Link } from "react-router"
import "./Header.css"
import { updateThemeInLocalStorage } from "@/themes";
import { useContext, useEffect } from "react";
import { AppContext } from "@/AppContext";
import type { AppState } from "@/types";



export default function Header() {
    // Functions :
    function switchTheme() {
        if (appState.currentTheme == "light") {
            setAppState((prev: AppState): AppState => ({ ...prev, currentTheme: "dark" }))
        } else {
            setAppState((prev: AppState): AppState => ({ ...prev, currentTheme: "light" }))
        }
    }

    function openDrawer(event: React.SyntheticEvent) {
        // Hide all navDrawers
        document.querySelectorAll(`.navDrawer`).forEach(drawer => {
            const navDrawerContainer: HTMLElement | null = (event.target as HTMLElement).closest(".navDrawer-container");
            delete navDrawerContainer?.dataset.isHovered
            drawer.classList.add("hidden")
        });

        const navDrawerContainer: HTMLElement | null = (event.target as HTMLElement).closest(".navDrawer-container");
        const navDrawer = (event.target as HTMLElement).closest(".navDrawer-container")?.querySelector(".navDrawer")

        if (navDrawerContainer) {
            navDrawerContainer.dataset.isHovered = "true"
        }

        navDrawer?.classList.remove("hidden")
    }

    function closeDrawer(event: React.SyntheticEvent) {
        const navDrawerContainer: HTMLElement | null = (event.target as HTMLElement).closest(".navDrawer-container");
        const navDrawer = (event.target as HTMLElement).closest(".navDrawer-container")?.querySelector(".navDrawer")

        delete navDrawerContainer?.dataset.isHovered

        setTimeout(() => {
            if (navDrawerContainer?.dataset.isHovered !== "true") {
                navDrawer?.classList.add("hidden")
            }
        }, 200);
    }



    // Context
    const appContext = useContext(AppContext)
    if (!appContext) throw new Error("useContext must be used within an AppProvider");
    const { appState, setAppState, utils } = appContext;

    // useEffect for switchTheme
    useEffect(() => {
        // La nouvelle valeur de appState.currentTheme n'est pas diponible immédiatement après l'avoir changée dans switchThem
        // elle l'est au prochain render. Donc useEffect dans le body du composant
        updateThemeInLocalStorage(appState.currentTheme)
    }, [appState]);


    return (
        <header className={"Header " + appState.currentTheme}
        // style={{ "--ma-variable": valeurContextuelle } as React.CSSProperties}
        >
            <Link to="/" className="appLogoLink">Hero Card Game</Link>

            <nav className="navbar">
                <button className="charAsIcon themeSwitch" type="button" role="switch"
                    onClick={switchTheme}
                    title="Activer / Désactiver le mode sombre">
                    {appState.currentTheme == "light" ? "🌙" : "🔆"}
                </button>

                {/* <div className="navDrawer-container" onMouseLeave={closeDrawer} onMouseEnter={openDrawer}>
                    <a href="/debug/card" className="navDrawerHandle navLink">
                        <span className="category">Debug</span>
                        <span className="charAsIcon"> ▿</span>
                    </a>
                    <ul className={`navDrawer hidden`}>
                        <Link to={"/debug/card/1"} className="navLink navDrawerItem">Card viewer</Link>
                    </ul>
                </div> */}
                <Link to={"/catalogue/1"} className="navLink navDrawerItem">Catalogue</Link>
                <Link to={"/match"} className="navLink navDrawerItem">Match</Link>
                <Link to="/" className="navLink">Accueil</Link>

            </nav >
        </header >
    )
}

