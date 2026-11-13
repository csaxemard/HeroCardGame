import { useContext, type ReactNode } from "react"
import Header from "@/Components/WebsiteUI/Header"
import Footer from "@/Components/WebsiteUI/Footer"
import { AppContext } from "@/AppContext";
import SvgSprites from "@/Components/SvgSprites";

interface Props {
    /**
     * - Default value : false
     */
    hideFooter?: boolean;
    children: ReactNode;
}



/**
 * ### ClassicLayout
 * - Un layout pour une page simple avec un header, du contenu et un footer
 * - Children : Le contenu de la page
 * - Props :
 *    - `hideFooter?: boolean = false` : Supprime le footer
 * 
 * --
 * 
 * - Note : Renommer hideFooter en noFooter
 */
export default function ClassicLayout({ hideFooter = false, children }: Props) {
    // Context
    const appContext = useContext(AppContext)
    if (!appContext) throw new Error("useContext must be used within an AppProvider");
    const { appState } = appContext;

    // Logic
    return (
        <div id="app" className={appState.currentTheme}>
            <Header />
            {children}
            {!hideFooter && <Footer />}
            <SvgSprites/>
        </div>
    )
}