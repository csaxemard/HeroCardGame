export type Theme = "dark" | "light";


export type AppState = {
    // Constantes :
    appTitleBase: string,
    appVersion: string,
    // Mutables :
    currentTheme: Theme,
}
