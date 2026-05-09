import { createContext } from "react";

export const BoardViewerContext = createContext<((cardId: number) => void) | null>(null);