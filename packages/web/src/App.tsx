import { RouterProvider } from "react-router"
import "./main.css"
import router from "./router"
import { AppContext } from "./AppContext"
import { useState } from "react";
import { getCurrentThemeInitialValue } from "./themes";
import type { AppState } from "./types";


// App.tsx
export default function App() {
    const currentThemeInitialValue = getCurrentThemeInitialValue()
    // --- App context defaults ---
    const [appState, setAppState] = useState<AppState>({
        // Constantes :
        appTitleBase: "Hero Card Game",
        appVersion: "0.2.1",
        // Mutables :
        currentTheme: currentThemeInitialValue,
    });
    const utils = {
        /**
         * - Exemple d'utilisation dans un composant View :
         * ```tsx
         * useEffect(() => {
         *    setPageTitle("Accueil")
         * }, [])
         * ```
         */
        setPageTitle: (newTitle: String) => {
            document.title = `${newTitle} | ${appState.appTitleBase}`
        }
    }



    return (
        <AppContext value={{ appState, setAppState, utils }}>
            <RouterProvider router={router} />
        </AppContext>
    );
}