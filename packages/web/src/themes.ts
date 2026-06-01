// --- Functions ---

import type { Theme } from "./types";

/**
 * Crée une balise `<style>` dans le `<head>`, qui applique les variables des thèmes à #app  
 * 
 * - Utilisation : Le head existe avant DOMContentLoaded,
 * donc on peut appeler cette fonction dans main.tsx, avant root.render().  
 *     - (Comme ça les variables sont dispo avant que le composant soit rendu, donc pas de changement brutal)
 */
export function loadThemesStyles() {
    const style = document.createElement("style")

    let light = "#app {\n"
    let dark = "#app.dark {\n"

    Object.entries(themes).forEach(([key, themeProperties]) => {
        light += `--${key}: ${themeProperties[0]};\n`
        dark += `--${key}: ${themeProperties[1] || themeProperties[0]};\n`
    });

    light += "}";
    dark += "}";

    style.textContent = "/* [Dev note] Style generated from themes.ts */\n" + light + "\n" + dark
    style.id = "css-theme-variables"
    style.dataset.devNote = "Style generated from themes.ts"
    document.head.appendChild(style)
}

/**
 * Returns currentTheme initial value, as stored in localStorage or default
 * 
 * 
 * - Utilisation : A appeler dans App.tsx, pour initialiser la valeur du appState qu'on passe comme appContext
 * ```tsx
 * const currentThemeInitialValue = 
 * ```
 */
export function getCurrentThemeInitialValue(): Theme {
    if (Boolean(localStorage.getItem("currentTheme")) == true) {
        // console.log(localStorage.getItem("currentTheme")! as Theme);
        return localStorage.getItem("currentTheme")! as Theme;
    } else {
        localStorage.setItem("currentTheme", currentThemeDefaultValue);
        return currentThemeDefaultValue;
    }
}

/**
 * A appeler à chaque fois qu'on change appState.currentTheme
 */
export function updateThemeInLocalStorage(newTheme: Theme) {
    // console.log(newTheme)
    localStorage.setItem("currentTheme", newTheme);
}



// --- Main ---

const themes = {
    // Format : cssVarName: ["valueLight", "valueDark", "maybe3rdTheme?"]
    // Si dark n'a pas de valeur, il prend la valeur de light comme fallback

    /* Bg, aplats */
    bg: ["#fff", "#3e3e3e"],
    bgTop1: ["#f0f0f0", "#505050"],
    bgTop2: ["#e0e0e0", "#606060"],
    bgTop3: ["#f0f0f0", "#707070"],
    bgTop1Colored: ["#ecf2fc", "#4b5056"],
    bgColoredPurple: ["#a0a0ff", "#1e1e2f"],
    bgColoredPurpleTop1: ["#d3d3ff", "#2a2a3a"],
    bgColoredOrange: ["#fcd088", "#ae8746"],
    bgSub1: ["#ffffff", "#2f2f2f"],

    /* Effects */
    boxBorder: ["transparent", "var(--dividerColor)"],
    dividerColor: ["#5454547a", "#6a6a6a"],
    divider: ["1px solid var(--dividerColor)"],
    shadow: ["rgba(0, 0, 0, .1) 0 2px 4px 0", ""],
    shadow2: ["0 12px 32px rgba(0, 0, 0, .1), 0 2px 6px rgba(0, 0, 0, .08)", ""],
    shadowUniform: ["#bebebe 0 0 5px 0", "#353535 0 0 5px 0"],

    /* Accents */
    emph: ["#ff6052", "#ff7e72"],
    emph2: ["#ffa632ff", ""],
    emph3: ["#008000", ""],

    /* Text default */
    text: ["black", "white"],
    textSub1: ["#5f5f5f", "#c0c0c0"],
    textSub2: ["#707070", "#909090"],
    textOpposite: ["white", "black"],
    link: ["#0b57d0", "#9bc2ff"],

    /* Button default */
    btnBg: ["var(--bgTop1)", "var(--bgTop1)"],
    btnBgHover: ["#ecf2fc", "var(--bgTop2)"],
    btnBgActive: ["#bdd6ff", "#9b9b9b"],
}

const currentThemeDefaultValue: Theme = "dark"