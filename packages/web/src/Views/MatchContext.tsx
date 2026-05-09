import { createContext } from "react";

export const MatchContext = createContext<((cardId: number) => void) | null>(null);