import { createRoot } from "react-dom/client"
import App from "./App"
import { loadThemesStyles } from "./themes"



// Themes
loadThemesStyles()

// App
const root = createRoot(document.getElementById("root")!)
root.render(<App />)
