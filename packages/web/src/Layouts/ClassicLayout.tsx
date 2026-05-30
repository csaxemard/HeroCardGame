import { useContext, type ReactNode } from "react"
import Header from "@/Components/WebsiteUI/Header"
import Footer from "@/Components/WebsiteUI/Footer"
import { AppContext } from "@/AppContext";

interface Props {
    /**
     * - Default value : false
     */
    hideFooter?: boolean;
    children: ReactNode;
}



export default function ClassicLayout({ hideFooter = false, children }: Props) {
    // Context
    const appContext = useContext(AppContext)
    if (!appContext) throw new Error("useContext must be used within an AppProvider");
    const { appState, setAppState, utils } = appContext;

    // Logic
    return (
        <div id="app" className={appState.currentTheme}>
            <Header />
            {children}
            {!hideFooter && <Footer />}
        </div>
    )
}